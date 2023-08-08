# Microfrontend v2, context with RxJS

Project is used as a utility to share context between different hosts.

---

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]

## Usage

1. Execute the project for use with zelda-shared-context

```
npm start -- --port 8300
```

2. Execute the project for local development

```
npm run start:standalone
```

3. Add executable for hooks during commit

```
chmod a+x .husky/pre-commit
```

## Deployment

1. Project deployment works differently as there is _NO_ hosting page. Means navigating to the page e.g. https://zelda-auth-react-walcoorperation.vercel.app/ will deal with NO Page found.
2. All hosted microservice must be access via the js script, as in https://<host>/walcron-zelda-auth-react.js
3. Create a Github PAT (classic), with only read:packages access.
4. Login locally into github NPM repo with the PAT.

`npm login --scope=@yoonghan --auth-type=legacy --registry=https://npm.pkg.github.com/`

5. Copy in ~/.npmrc into vercel's variable NPM_RC. Basically the varible will contain:

```
//npm.pkg.github.com/:_authToken=...
@yoonghan:registry=https://npm.pkg.github.com/
```

## Github PAT permission required

1. For accessing private repo, please allow Profile -> Settings -> Personal Access Token (classic), open read:packages (basically th esame as vercel deployment). For more info refer: https://docs.github.com/en/packages/working-with-a-github-packages-registry. Add as Github secret in Settings->Secrets And variable and add NPM_TOKEN key. NOTE: In merge NODE_AUTH_TOKEN is used instead.
2. Create a PAT for zelda-root repository, with these permission , personal profile -> Developer Settings -> Fine Grain Token -> Actions(R)/Commit Statues(RW)/Contents(RW)/Metadata(R)/Pull Request(RW). Add into secret variable with key of CONTAINER_PAT.
3. Add 2 repository variables(not secret), GH_USER_NAME and GH_USER_EMAIL for distribution commit.

[build-badge]: https://img.shields.io/github/actions/workflow/status/yoonghan/zelda-shared-context-rxjs/pull-request.yml
[build]: https://github.com/yoonghan/zelda-shared-context-rxjs/actions?query=workflow
[coverage-badge]: https://img.shields.io/codecov/c/github/yoonghan/zelda-shared-context-rxjs.svg?style=flat-square
[coverage]: https://codecov.io/gh/yoonghan/zelda-shared-context-rxjs
