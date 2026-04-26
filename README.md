# Blog

Production blog monorepo for the operator-owned domain. The workspace contains a Serverless API, a Vite/React frontend, shared runtime packages, and Lambda layer build projects.

## Project Layout

- `apps/api`: Serverless Framework backend for REST endpoints, article storage, image processing, sitemap generation, and static HTML serving.
- `apps/pages`: Vite and React frontend. Its build output is copied into `apps/api/pages` for the `serveHtml` Lambda.
- `packages/*`: Shared workspace packages for AWS access, config, image processing, JSON documents, Redis locks, Serverless helpers, SQLite, and small utilities.
- `lambda-layers/*`: Native dependency layer builders for AWS Lambda.
- `rules/`: Repository rules for architecture, data, deployment, and workflow.

## Requirements

- Node.js `24.15.0`
- pnpm `10+`
- AWS credentials for deployment commands
- Local config files under `packages/config` based on the example JSON files

## Setup

```sh
pnpm install
```

Real `packages/config/metadata.json`, `packages/config/secrets.json`, and local deployment assets are ignored operator inputs. Do not commit real secrets or generated environment files.

## Development

Run the API locally:

```sh
cd apps/api
pnpm run dev
```

Run the frontend locally:

```sh
cd apps/pages
source .envrc
pnpm run dev
```

The frontend dev server proxies `/api` and `/image` requests to the local API server.

## Build

Build the frontend first so `apps/pages` refreshes `apps/api/pages`:

```sh
cd apps/pages
source .envrc
pnpm run build
```

Package the API:

```sh
cd apps/api
pnpm run build
```

## Deploy

Deploy pages and refresh the HTML Lambda:

```sh
./deploy.sh pages
```

Deploy the API:

```sh
cd apps/api
AWS_PROFILE=<deployment-profile> pnpm run deploy
```

Before changing AWS resources, Serverless configuration, S3 data, or SQLite data, read the relevant files in `rules/`.

