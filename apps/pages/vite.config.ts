import VitePluginHtmlEnv from "vite-plugin-html-env";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), VitePluginHtmlEnv()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/image": "http://localhost:3000",
    },
  },
});
