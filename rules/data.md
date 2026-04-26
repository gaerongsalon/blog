# Data Rules

- Back up S3 data before any deployment or code path change that might write, delete, or migrate data.
- Current backup location is `~/tmp/blog-backup`.
- Internal data bucket and prefix come from ignored local deployment configuration.
- SQLite DB key is under `sqlite/{dbKey}.db` within the internal prefix; the latest backup confirmed 45 articles.
- Image and JSON DB data also live under the same internal prefix.
- Static file bucket comes from ignored local deployment configuration; static backup contains historical frontend assets.
- SQLite read and write paths use direct S3 instead of S3 Cache Bridge because the bridge host caused Lambda timeouts and stale write risk.
- S3 read helpers must propagate non-404 S3 errors; never convert permission, throttle, or network errors into “object absent.”
- Never commit real `packages/config/secrets.json`, `packages/config/metadata.json`, `packages/config/logo.png`, `apps/pages/.env`, or other generated secret-bearing files.
- Avoid printing secret values, raw authorization tokens, account IDs, bucket names, or local profile names in final responses, tracked docs, logs, or commit messages.
