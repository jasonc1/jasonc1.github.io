import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// GitHub Pages serves `public/<name>/index.html` for a bare `/<name>` request,
// but Vite's dev server hands extensionless paths to the SPA fallback instead.
// This makes local dev behave the same, so static pages under public/ (e.g.
// /fasciile) work at the same URL in both places.
function staticPagesDev() {
  return {
    name: "static-pages-dev",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = (req.url || "").match(/^\/([\w-]+)\/?(?:[?#].*)?$/);
        if (match) {
          const file = path.resolve("public", match[1], "index.html");
          if (fs.existsSync(file)) {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(fs.readFileSync(file));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), staticPagesDev()],
});
