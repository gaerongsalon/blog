# Deployment Rules

- Use the deployment AWS profile supplied by the operator and region `ap-northeast-2` for this project unless a command explicitly targets ACM/CloudFront global resources.
- Production site domain is `https://example.com`.
- The current REST API stack is derived from `packages/config/secrets.json` and deployed to stage `dev`.
- `example.com` is an API Gateway edge-optimized custom domain mapped to the `dev` stage with base path `(none)`.
- Route53 hosts `example.com.`; the apex `A` record aliases to the API Gateway CloudFront distribution.
- `static.example.com` points to a separate CloudFront distribution for the static file bucket.
- `api.example.com` exists for other services and auth-related paths; this blog's frontend calls same-origin `/api/*`.
- Validate deployment with direct public endpoint calls: `curl -fsS https://example.com/`, `curl -fsS https://example.com/api/articles`, and one concrete `/api/article/{slug}` from the article list.
- After direct endpoint calls, inspect matching Lambda logs for `queryDatabase` and `serveHtml`; do not infer health from build success alone.
- A healthy article list returns JSON quickly. A 502 after about 15 seconds has previously meant the DB Lambda timed out before reading SQLite from S3.
- `serveHtml` applies SEO by calling `https://example.com/api/article/{slug}` for article pages, so DB read failures can also break article page HTML.
- Deploy with Node 22.13.0 or newer. `deploy.sh` pins the current Node 22 runtime through nvm and enables Corepack for pnpm.
- Serverless Framework v4 uses built-in esbuild; do not re-add `serverless-esbuild` or `serverless-prune-plugin`.
- Lambda function versioning is disabled in the Serverless manifest to avoid accumulating versions after the prune plugin removal.
- Native Lambda layers must be built in a Lambda-compatible Node 22 container and published with explicit compatible architecture.
- Node 22 layer ARNs are local deployment configuration in ignored `packages/config/secrets.json`; do not hard-code account-specific layer ARNs in source.
