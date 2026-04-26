import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd()), ...process.env };
  return {
    plugins: [
      react(),
      {
        name: "html-env",
        transformIndexHtml(html) {
          return html.replace(/<\{\s*(VITE_[A-Z0-9_]+)\s*\}>/g, (_, key) => {
            return env[key] ?? "";
          });
        },
      },
    ],
    server: {
      proxy: {
        "/api": "http://localhost:3000",
        "/image": "http://localhost:3000",
      },
    },
  };
});
