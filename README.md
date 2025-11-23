# Overview

This is the repo to my portfolio website - designed and created by me. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), but now we have moved away from CRA + Webpack and use Vite.

This site leverages GH-Pages + GH actions (very minimally customized). Please refer to the `vite.config.js` file and `.github/workflows/deploy.yml` file to see how it gets pushed and deployed.

## LOCAL DEVELOPMENT

In the project directory, you can run:

### `npm run start`

This will fire up Vite

## Deployment

### `npm run predeploy`

This will create a `dist/` folder (don't add to gitignore).

### `npm run deploy`

This will upload the `dist/` folder to GH-pages

Make sure to commit and push everything to repo afterwards

## DNS related

We need a `public/CNAME` file in order to preserve the domain in GH-Pages configuration. I'm writing this down because I deleted it thinking I didn't need it.
