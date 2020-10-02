export const successfulComparisonResponse = {
  html_url: 'https://github.com/octocat/Hello-World/compare/master...topic',
  status: 'behind',
  ahead_by: 1,
  behind_by: 2,
  total_commits: 3,
  commits: [
    {
      sha: '6dcb09b5b57875f334f61aebed695e2e4193db5e',
      html_url:
        'https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e',
      commit: {
        message: 'Fix all the bugs'
      },
      author: {
        login: 'octocat',
        html_url: 'https://github.com/octocat'
      }
    },
    {
      sha: 'f0c556fd81d38b23ff2b9c7c9d192ff426ff35bbc4',
      html_url:
        'https://github.com/octocat/Hello-World/commit/f0c556fd81d38b23ff2b9c7c9d192ff426ff35bbc4',
      commit: {
        message: 'Title of my commit\nBody of my message'
      },
      author: {
        login: 'antonnguyen',
        html_url: 'https://github.com/antonnguyen'
      }
    },
    {
      sha: '0353149329a25291e9282fbecdd8684e7dad7671866',
      html_url:
        'https://github.com/octocat/Hello-World/commit/0353149329a25291e9282fbecdd8684e7dad7671866',
      commit: {
        message: 'Oops!\nType fix that took down production\n😇'
      },
      author: {
        login: 'antonnguyen',
        html_url: 'https://github.com/antonnguyen'
      }
    }
  ]
}

export const upToDateComparisonResponse = {
  html_url: 'https://github.com/octocat/Hello-World/compare/master...topic',
  status: 'up-to-date',
  ahead_by: 0,
  behind_by: 0,
  total_commits: 0,
  commits: []
}

export const successfulTagResponse = [
  {
    tag_name: 'v1.0.0',
    prerelease: false,
    published_at: '2013-02-27T19:35:32Z'
  }
]

export const preReleaseTagResponse = [
  {
    tag_name: 'v1.0.0',
    prerelease: true,
    published_at: '2013-02-27T19:35:32Z'
  }
]
