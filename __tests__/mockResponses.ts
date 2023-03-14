export const successfulComparisonResponse = {
  html_url: 'https://github.com/octocat/Hello-World/compare/master...topic',
  status: 'behind',
  ahead_by: 1,
  behind_by: 2,
  total_commits: 4,
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
      sha: '2e1cfa82b035c26cbbbdae632cea070514eb8b773f',
      html_url:
        'https://github.com/octocat/Hello-World/commit/2e1cfa82b035c26cbbbdae632cea070514eb8b773f',
      commit: {
        message: ''
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

export const successCreateReleaseResponse = [
  {
    url: 'https://api.github.com/repos/octocat/Hello-World/releases/1',
    html_url: 'https://github.com/octocat/Hello-World/releases/v1.0.0',
    assets_url:
      'https://api.github.com/repos/octocat/Hello-World/releases/1/assets',
    upload_url:
      'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}',
    tarball_url:
      'https://api.github.com/repos/octocat/Hello-World/tarball/v1.0.0',
    zipball_url:
      'https://api.github.com/repos/octocat/Hello-World/zipball/v1.0.0',
    id: 1,
    node_id: 'MDc6UmVsZWFzZTE=',
    tag_name: 'v1.0.0',
    target_commitish: 'master',
    name: 'v1.0.0',
    body: 'Description of the release',
    draft: false,
    prerelease: false,
    created_at: '2013-02-27T19:35:32Z',
    published_at: '2013-02-27T19:35:32Z',
    author: {
      login: 'octocat',
      id: 1,
      node_id: 'MDQ6VXNlcjE=',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      gravatar_id: '',
      url: 'https://api.github.com/users/octocat',
      html_url: 'https://github.com/octocat',
      followers_url: 'https://api.github.com/users/octocat/followers',
      following_url:
        'https://api.github.com/users/octocat/following{/other_user}',
      gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/octocat/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
      organizations_url: 'https://api.github.com/users/octocat/orgs',
      repos_url: 'https://api.github.com/users/octocat/repos',
      events_url: 'https://api.github.com/users/octocat/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/octocat/received_events',
      type: 'User',
      site_admin: false
    },
    assets: []
  }
]
