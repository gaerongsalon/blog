# Repository Instructions

## Project Shape

- This repository deploys the production blog domain supplied by the operator. It is a pnpm monorepo with a Serverless API in `apps/api`, a Vite/React frontend in `apps/pages`, and shared packages in `packages/*`.
- Runtime configuration lives in ignored local files under `packages/config`; do not commit real secrets, metadata overrides, or generated env files.

## Required Rule Lookup

- Before non-trivial work, open `rules/index.md` and the relevant rule files.
- Keep this file short; put reusable project lessons in `rules/`.
- After each completed task, update the relevant rule file and `rules/index.md` if structure changes.

## Essential Commands

- Install/update workspace dependencies: `pnpm install`
- Build frontend: `cd apps/pages && source .envrc && pnpm run build`
- Package API: `cd apps/api && pnpm run build`
- Deploy API: `cd apps/api && AWS_PROFILE=<deployment-profile> pnpm run deploy`
- Deploy pages/static: `./deploy.sh pages`

## Non-Negotiables

- Follow `rules/deployment.md` before changing AWS resources or Serverless configuration.
- Follow `rules/data.md` before any operation that can overwrite S3 or SQLite data.
- Follow `rules/workflow.md` for dependency, build, review, and commit flow.
