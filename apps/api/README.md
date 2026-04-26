# @blog/api

Serverless backend for the production blog. It defines AWS Lambda handlers for article data, image uploads, image optimization, authentication, sitemap generation, and static HTML serving.

## Key Paths

- `serverless.ts`: Serverless Framework service configuration.
- `src/handlers/`: Lambda entrypoints and HTTP endpoint definitions.
- `src/db/`: Article and taxonomy queries backed by the S3-hosted SQLite database.
- `src/article/`: Article slug, ID, and tag helpers.
- `pages/`: Generated frontend build copied from `apps/pages/dist`.

## Commands

```sh
pnpm run dev
pnpm run build
pnpm run deploy
pnpm run deploy:pages
```

Build `apps/pages` first when changing rendered pages, because its postbuild step refreshes `apps/api/pages`.

