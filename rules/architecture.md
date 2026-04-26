# Architecture Rules

- Treat this as a pnpm workspace for `https://example.com`.
- `apps/api` is the Serverless REST API and SSR-ish static HTML Lambda host.
- `apps/pages` is the Vite/React frontend; `postbuild` copies `dist` into `apps/api/pages` for the `serveHtml` Lambda package.
- `packages/aws`, `packages/sqlite`, `packages/imaging`, `packages/jsondb`, `packages/redis`, `packages/serverless`, and `packages/utils` are shared workspace packages.
- `packages/config/lib/*` imports local JSON config. Real `metadata.json`, `secrets.json`, and `logo.png` are ignored local deployment inputs.
- Blog article reads and writes use the SQLite file stored in S3, not a managed database.
- Frontend API requests are relative to the same origin under `/api/*`; do not point browser code at `api.example.com` unless the deployment model changes.
