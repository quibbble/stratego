# Stratego

[![Netlify Status](https://api.netlify.com/api/v1/badges/acf3f86c-86f5-450c-ad99-aee5f4bdae68/deploy-status)](https://app.netlify.com/sites/stratego-quibbble/deploys)

Stratego game website. Play at [stratego.quibbble.com](https://stratego.quibbble.com).

This repo contains [ReactJS](https://react.dev) frontend code and makes use of custom React components found at [boardgame](https://github.com/quibbble/boardgame). Game logic can be found at [go-tsuro](https://github.com/quibbble/go-tsuro). Server logic can be found at [go-quibbble](https://github.com/quibbble/go-quibbble). 

[![Quibbble Stratego](screenshot.png)](https://stratego.quibbble.com)

## Run Locally

- Generate a personal `GITHUB_ACCESS_TOKEN` with package read permissions. Read more about it [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).
- Create a `.npmrc` file in the `stratego` root director with the following:
```
//npm.pkg.github.com/:_authToken=<GITHUB_ACCESS_TOKEN>
@quibbble:boardgame=https://npm.pkg.github.com
```
- Run `npm i`.
- Run the quibbble server ([go-quibbble](https://github.com/quibbble/go-quibbble)) locally on port `8080`.
- Create a `.env.local` file in the `stratego` root directory with the following:
```
REACT_APP_HOST="http://127.0.0.1:8080"
REACT_APP_WEBSOCKET="ws://127.0.0.1:8080"
```
- Run `npm start`.
