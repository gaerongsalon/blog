# @blog/pages

Vite and React frontend for the blog. It renders article lists, article pages, editing screens, category and tag pages, comments, login controls, and image upload tools.

## Key Paths

- `src/App.tsx`: Browser route definitions.
- `src/pages/`: Route-level page components.
- `src/views/`: Larger page views shared by route components.
- `src/components/`: Reusable UI components.
- `src/apis/`: Browser API clients for `/api/*` and image upload flows.
- `src/utils/`: Formatting, image URL, syntax highlighting, and fetch helpers.

## Commands

```sh
source .envrc && pnpm run dev
source .envrc && pnpm run build
pnpm run preview
source .envrc && pnpm run deploy
```

The build writes `dist/` and then copies it to `../api/pages` for the `serveHtml` Lambda package.

