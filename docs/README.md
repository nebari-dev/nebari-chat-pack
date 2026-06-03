# Nebari Chat Pack Documentation

This directory contains the [Docusaurus 3.5.2](https://docusaurus.io/) site for the Nebari Chat pack.

> **Note:** The site is currently an empty scaffold with a placeholder landing page. Section content will be added in follow-on work.

## Prerequisites

- Node.js `>= 18` (enforced by the `engines` field in `package.json`).
- Yarn (Classic, v1.22.x). Install globally with `npm install -g yarn`, then verify with `yarn --version`.

The site is built and tested against Node 20 and Yarn 1.22.22.

## Install

```bash
cd docs
yarn install
```

## Local development

```bash
yarn start
```

Starts the Docusaurus dev server with hot reload on http://localhost:3000/.

Note: the lunr search index is generated only by `yarn build`. The search box in the dev server will return no results; use a production build to exercise search.

## Production build

```bash
yarn build
```

Emits static files to `docs/build/`. The build step also produces the lunr search index via `docusaurus-lunr-search`.

## Preview the production build

```bash
yarn run serve
```

Serves the contents of `docs/build/` locally so you can verify the production output, including search.

## Troubleshooting

### `ValidationError: Invalid options object. Progress Plugin has been initialized using an options object that does not match the API schema`

This is a webpack-version mismatch. Docusaurus 3.5.2 targets webpack 5.94; webpack 5.97+ tightens the `ProgressPlugin` options schema and rejects what Docusaurus passes. `package.json` pins the resolution with:

```json
"resolutions": {
  "webpack": "5.94.0"
}
```

Yarn applies `resolutions` on install, but if `node_modules` was populated before the field existed (or by a different package manager) the wrong webpack stays cached. Reinstall cleanly:

```bash
cd docs
rm -rf node_modules yarn.lock
yarn install
yarn build
```

## Deployment

The site deploys automatically via [GitHub Pages](https://pages.github.com/) whenever changes land on the `main` branch. Configuration lives in [`.github/workflows/deploy-docs.yml`](../.github/workflows/deploy-docs.yml).

Pull requests trigger a build-only job (no deploy) so CI catches broken links before merge.

To enable GitHub Pages for this repository, go to **Settings → Pages** and set the source to **GitHub Actions**.
