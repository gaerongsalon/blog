# Workflow Rules

- Check `git status --short --untracked-files=all` before editing and preserve unrelated user changes.
- The known unrelated local change at task start was `apps/api/.vscode/settings.json`; do not overwrite it unless asked.
- Use Node 24.15.0 and pnpm 10+ for this repository.
- Use `pnpm install` after dependency manifest changes and keep `pnpm-lock.yaml` in sync.
- Build order is frontend first, then API packaging, because `apps/pages` copies `dist` into `apps/api/pages`.
- For Serverless changes, run `cd apps/api && pnpm run build` before deploy.
- For deployment validation, test both API JSON endpoints and rendered HTML pages.
- After frontend dependency or bundler changes, validate the deployed page in a fresh browser context and check console output; a production React #130 often means an imported JSX component resolved to a module object.
- Prefer package-root named exports over default subpath imports for CommonJS packages when Vite interop returns objects instead of component functions.
- Keep generated build outputs, `.serverless`, `.esbuild`, local logs, and ignored secret files out of commits.
- Keep local editor folders such as `.vscode/` untracked unless the file is intentionally shared and reviewed.
- For requested reviews, use fresh-context subagents and synthesize only verified findings.
