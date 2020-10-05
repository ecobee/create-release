import * as core from '@actions/core'
import * as github from '@actions/github'
import * as semver from 'semver'

const run = async (): Promise<void> => {
  try {
    const includePrerelease: boolean = parseBoolean(
      core.getInput('include-prerelease', {
        required: false
      })
    )
    const defaultBranch: string = core.getInput('default-branch', {
      required: false
    })

    const githubToken = process.env['GITHUB_TOKEN']
    if (!githubToken) {
      core.error("environment variable 'GITHUB_TOKEN' is not set")
      return
    }

    const octokit = github.getOctokit(githubToken)
    const nwo = process.env['GITHUB_REPOSITORY'] || '/'
    const [owner, repo] = nwo.split('/')

    core.info(`Listing releases for ${owner}/${repo}`)
    const {data: releases} = await octokit.repos.listReleases({
      owner,
      repo
    })
    if (releases.length === 0) {
      core.error(`No releases for "${nwo}" has been found`)
      return
    }
    const latestRelease = releases.find(
      element => element.prerelease === includePrerelease
    )
    if (!latestRelease) {
      core.error(`Latest release for "${nwo}" could not be found`)
      return
    }

    const base = latestRelease?.tag_name || ''
    core.info(
      `Comparing commits for ${owner}/${repo} on ${base} against ${defaultBranch}`
    )
    const {data: comparison} = await octokit.repos.compareCommits({
      owner,
      repo,
      base,
      head: defaultBranch
    })
    core.info(
      `${defaultBranch} is ${comparison.status} by ${comparison.total_commits} commit(s)`
    )

    const lastReleaseDate = latestRelease?.published_at || ''
    core.setOutput('latest-release-date', lastReleaseDate)
    core.info(`latest release date is ${lastReleaseDate}`)

    core.setOutput('commit-count', comparison.total_commits.toString())

    if (!comparison.total_commits) {
      core.info('Release is up-to-date')
      return
    }

    const newTag = semver.inc(latestRelease?.tag_name, 'patch')
    const newVersion = `v${newTag}`
    core.setOutput('new-version', newVersion)
    core.setOutput(
      'release-url',
      `https://github.com/${owner}/${repo}/releases/tag/${newVersion}`
    )

    const compareUrl = `https://github.com/${owner}/${repo}/compare/${latestRelease.tag_name}...${newVersion}`
    core.setOutput('diff-url', compareUrl)

    let authors = ''
    let commitSummary = ''
    const foundAuthors = new Map<string, boolean>()
    for (const commit of comparison.commits) {
      if (!foundAuthors.get(commit.author.login)) {
        authors += `* [${commit.author.login}](${commit.author.html_url})\n`
        foundAuthors.set(commit.author.login, true)
      }

      let truncatedCommit = commit.commit.message
      if (!truncatedCommit) {
        continue
      }

      const commitLines = commit.commit.message.split('\n')
      if (commitLines.length > 0) {
        truncatedCommit = commitLines[0]
      }
      commitSummary += `* ${truncatedCommit} ([${commit.sha.slice(0, 7)}](${
        commit.html_url
      }))\n`
    }
    const changeLog = `## Authors\n\n${authors}\n## Changes\n\n${compareUrl}\n\n${commitSummary}`
    core.setOutput('changelog', changeLog)

    core.info(`Creating release ${newVersion} for ${owner}/${repo}`)
    await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: newVersion, // eslint-disable-line @typescript-eslint/camelcase
      name: newVersion,
      body: changeLog
    })
  } catch (error) {
    core.setFailed(`create-release failure: ${error}`)
  }
}

export default run

function parseBoolean(toParse: string): boolean {
  return !!(toParse && toParse.toLowerCase() === 'true')
}

run()
