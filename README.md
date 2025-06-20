# Who Owns Massachusetts Frontend

<!-- badges: start -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip) [![Netlify Status](https://api.netlify.com/api/v1/badges/2c1b6580-ad37-4653-806f-b085e9e85e09/deploy-status)](https://app.netlify.com/sites/who-owns-mass-frontend/deploys) [![DOI](https://zenodo.org/badge/758640877.svg)](https://zenodo.org/badge/latestdoi/758640877) 
<!-- badges: end -->

![Screenshot of the Who Owns Massachusetts Interface](static/who-owns-mass-frontend.png)

This is the codebase for the front end of the Who Owns Massachusetts application. It's built using Svelte and SvelteKit and draws on the Bulma CSS/SCSS framework. Both production and staging branches available at...

+ [Production](https://who-owns-mass-frontend.netlify.app/): Builds from [`main`](https://github.com/mit-spatial-action/who-owns-mass-frontend/tree/main) branch.
+ [Staging](https://staging--who-owns-mass-frontend.netlify.app/): Builds from [`staging`](https://github.com/mit-spatial-action/who-owns-mass-frontend/tree/staging) branch.

## Configuration

### Node

Assuming you have `node` installed, you can install all dependencies by running `npm install` from the root directory.

### .env Configuration

The application expects several environment variables in an `.env` file located in the project's root directory. These are...

```
PUBLIC_MAPBOX_TOKEN='your token here`
VITE_PUBLIC_API_URL='http://djangoserverhost'
```

Note that your Mapbox token will be exposed to the client! As such, before deploying, you should make sure that your token is appropriately scoped and that it has URL restrictions in place. 

## Running

Run `npm run dev` from the root folder. This starts a vite server (`vite dev`) and a sass watcher that watches for changes in `src/styles/style.scss.`
