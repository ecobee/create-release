<p align="center">
  <a href="https://github.com/ecobee/create-release/actions"><img alt="typescript-action status" src="https://github.com/ecobee/create-release/workflows/build-test/badge.svg"></a>
</p>

# Create Release

Use this action create a changelog of all the changes since hte last release, then generate a new release and tag

# Usage
Include the following step in an existing workflow:

```yaml
name: Deploy To Prod
on: workflow_dispatch

jobs:
  deploy:
    name: Production deployment
    runs-on: ubuntu-latest
    steps:
      - name: Bump version and push tag
        id: create_tag
        uses: ecobee/create-release@v0.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```


## Development

Install the dependencies
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run pack
```

Run the tests :heavy_check_mark:
```bash
$ npm test

 PASS  __tests__/main.test.ts
  Run
    ✓ sets all the outputs on a successful run (51ms)
    ✓ does not create a release if the github token env variable is not set (5ms)
    ✓ does not create a release if the repo does not contain any releases (14ms)
    ✓ does not create a release if the latest release is not found (12ms)
    ✓ does not create a release if there are no unreleased commits  (17ms)
...
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run pack
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

The action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/ecobee/create-release/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
