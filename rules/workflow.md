# Workflow Rules

- Check `git status --short --untracked-files=all` before editing and preserve unrelated user changes.
- The known unrelated local change at task start was `apps/api/.vscode/settings.json`; do not overwrite it unless asked.
- Use Node 22.13.0+ and pnpm 10+ for this repository.
- Use `pnpm install` after dependency manifest changes and keep `pnpm-lock.yaml` in sync.
- Build order is frontend first, then API packaging, because `apps/pages` copies `dist` into `apps/api/pages`.
- For Serverless changes, run `cd apps/api && pnpm run build` before deploy.
- For deployment validation, test both API JSON endpoints and rendered HTML pages.
- Keep generated build outputs, `.serverless`, `.esbuild`, local logs, and ignored secret files out of commits.
- For requested reviews, use fresh-context subagents and synthesize only verified findings.
