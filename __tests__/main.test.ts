import * as core from '@actions/core'
import run from '../src/main'
import fs from 'fs'
import yaml from 'js-yaml'
import {
  successfulComparisonResponse,
  successfulTagResponse,
  preReleaseTagResponse,
  upToDateComparisonResponse
} from './mockResponses'

const nock = require('nock')

beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
  const doc = yaml.safeLoad(
    fs.readFileSync(__dirname + '/../action.yml', 'utf8')
  )
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
    process.env[envVar] = doc.inputs[name]['default']
  })
  process.env.GITHUB_REPOSITORY = 'foo/bar'
  process.env.GITHUB_TOKEN = 'token'
})

afterEach(() => {
  const doc = yaml.safeLoad(
    fs.readFileSync(__dirname + '/../action.yml', 'utf8')
  )
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
    delete process.env[envVar]
  })
  nock.cleanAll()
})

describe('Run', () => {
  it('sets all the outputs on a successful run', async () => {
    const expectedChangelog = fs.readFileSync(
      __dirname + '/expected-changelog.md',
      'utf8'
    )

    nock('https://api.github.com')
      .persist()
      .get('/repos/foo/bar/releases')
      .reply(200, successfulTagResponse)
    nock('https://api.github.com')
      .persist()
      .get('/repos/foo/bar/compare/v1.0.0...master')
      .reply(200, successfulComparisonResponse)
    nock('https://api.github.com')
      .persist()
      .post('/repos/foo/bar/releases', {
        tag_name: 'v1.0.1',
        name: 'v1.0.1',
        body: expectedChangelog
      })
      .reply(201, successfulComparisonResponse)

    const setOutput = jest.spyOn(core, 'setOutput')
    const infoMock = jest.spyOn(core, 'info')
    const setFailed = jest.spyOn(core, 'setFailed')
    await run()

    expect(infoMock).toHaveBeenCalledWith('Listing releases for foo/bar')
    expect(infoMock).toHaveBeenCalledWith(
      'Comparing commits for foo/bar on v1.0.0 against master'
    )
    expect(infoMock).toHaveBeenCalledWith('master is behind by 4 commit(s)')
    expect(infoMock).toHaveBeenCalledWith(
      'latest release date is 2013-02-27T19:35:32Z'
    )
    expect(infoMock).toHaveBeenCalledWith('Creating release v1.0.1 for foo/bar')
    expect(setOutput).toHaveBeenCalledWith('commit-count', '4')
    expect(setOutput).toHaveBeenCalledWith('new-version', 'v1.0.1')
    expect(setOutput).toHaveBeenCalledWith(
      'release-url',
      'https://github.com/foo/bar/releases/tag/v1.0.1'
    )
    expect(setOutput).toHaveBeenCalledWith(
      'diff-url',
      'https://github.com/foo/bar/compare/v1.0.0...v1.0.1'
    )
    expect(setOutput).toHaveBeenCalledWith(
      'latest-release-date',
      '2013-02-27T19:35:32Z'
    )
    expect(setOutput).toHaveBeenCalledWith('changelog', expectedChangelog)
    expect(setFailed).not.toHaveBeenCalled()
  })

  it('allows the version to be overriden', async () => {
    const versionOverride = 'v1.0.1-beta.1'
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name == 'version-override') {
        return versionOverride
      } else if (name == 'default-branch') {
        return 'master'
      }
      return 'false'
    })

    nock('https://api.github.com')
      .persist()
      .get('/repos/foo/bar/releases')
      .reply(200, successfulTagResponse)
    nock('https://api.github.com')
      .persist()
      .get('/repos/foo/bar/compare/v1.0.0...master')
      .reply(200, successfulComparisonResponse)
    nock('https://api.github.com')
      .persist()
      .post('/repos/foo/bar/releases')
      .reply(201, successfulComparisonResponse)

    const setOutput = jest.spyOn(core, 'setOutput')
    const infoMock = jest.spyOn(core, 'info')
    const setFailed = jest.spyOn(core, 'setFailed')
    await run()

    expect(infoMock).toHaveBeenCalledWith(
      `Creating release ${versionOverride} for foo/bar`
    )
    expect(setOutput).toHaveBeenCalledWith('commit-count', '4')
    expect(setOutput).toHaveBeenCalledWith('new-version', versionOverride)
    expect(setOutput).toHaveBeenCalledWith(
      'release-url',
      `https://github.com/foo/bar/releases/tag/${versionOverride}`
    )
    expect(setOutput).toHaveBeenCalledWith(
      'diff-url',
      `https://github.com/foo/bar/compare/v1.0.0...${versionOverride}`
    )
    expect(setFailed).not.toHaveBeenCalled()
  })

  it('does not create a release if the github token env variable is not set', async () => {
    process.env.GITHUB_TOKEN = ''
    const errorMock = jest.spyOn(core, 'error')
    await run()
    expect(errorMock).toHaveBeenCalledWith(
      "environment variable 'GITHUB_TOKEN' is not set"
    )
  })

  it('does not create a release if the repo does not contain any releases', async () => {
    nock('https://api.github.com')
      .persist()
      .get('/repos/foo/bar/releases')
      .reply(200, [])
    const errorMock = jest.spyOn(core, 'error')
    await run()
    expect(errorMock).toHaveBeenCalledWith(
      'No releases for "foo/bar" has been found'
    )
  })

  it('does not create a release if the latest release is not found', async () => {
    nock('https://api.github.com')
      .persist()
      .get('/repos/foo/bar/releases')
      .reply(200, preReleaseTagResponse)
    const errorMock = jest.spyOn(core, 'error')
    await run()
    expect(errorMock).toHaveBeenCalledWith(
      'Latest release for "foo/bar" could not be found'
    )
  })

  it('does not create a release if there are no unreleased commits ', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name == 'version-override') {
        return ''
      } else if (name == 'default-branch') {
        return 'master'
      }
      return 'false'
    })

    const infoMock = jest.spyOn(core, 'info')
    nock('https://api.github.com')
      .persist()
      .get('/repos/foo/bar/releases')
      .reply(200, successfulTagResponse)
    nock('https://api.github.com')
      .persist()
      .get('/repos/foo/bar/compare/v1.0.0...master')
      .reply(200, upToDateComparisonResponse)
    await run()
    expect(infoMock).toHaveBeenCalledWith('Release is up-to-date')
  })
})
