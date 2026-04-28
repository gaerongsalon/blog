# Workflow Rules

- Check `git status --short --untracked-files=all` before editing and preserve unrelated user changes.
- The known unrelated local change at task start was `apps/api/.vscode/settings.json`; do not overwrite it unless asked.
- Use Node 24.15.0 and pnpm 10+ for this repository.
- Keep Node-facing type packages on the Node 24 major line because the local runtime and AWS Lambda runtime are `nodejs24.x`.
- Use `pnpm install` after dependency manifest changes and keep `pnpm-lock.yaml` in sync.
- Build order is frontend first, then API packaging, because `apps/pages` copies `dist` into `apps/api/pages`.
- For Serverless changes, run `cd apps/api && pnpm run build` before deploy.
- For deployment validation, test both API JSON endpoints and rendered HTML pages.
- After frontend dependency or bundler changes, validate the deployed page in a fresh browser context and check console output; a production React #130 often means an imported JSX component resolved to a module object.
- Prefer package-root named exports over default subpath imports for CommonJS packages when Vite interop returns objects instead of component functions.
- Keep generated build outputs, `.serverless`, `.esbuild`, local logs, and ignored secret files out of commits.
- Keep local editor folders such as `.vscode/` untracked unless the file is intentionally shared and reviewed.
- Before every git commit, run `gitleaks detect --source . --redact --no-banner` from the repository root and resolve any finding before staging or committing.
- Before every git commit, inspect the staged diff and tracked source for local-only/operator-specific values that `gitleaks` may not classify as secrets. Pay special attention to real domains such as `example.com`, local account/user names such as `lacti`, AWS profile names, bucket names, account IDs, private endpoints, and generated config copied out of `packages/config`.
- If a value such as the production blog domain is intentionally part of the product surface, keep it only when the surrounding rule or code path makes that intent clear; otherwise move it back to ignored configuration or replace it with a placeholder.
- For requested reviews, use fresh-context subagents and synthesize only verified findings.
