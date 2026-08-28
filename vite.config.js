import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { ROUTE_PATHS } from "./src/routes";

// GitHub Pages serves static files and nothing else — it has no rewrite rule, so
// requesting /rosetta looks for a file at that path and 404s before our JS ever
// runs. That is the reason the site used HashRouter for years.
//
// The built index.html contains no page-specific markup (just <div id="root"> and
// the bundle tag), so the file served at /rosetta and the one served at /haven can
// be byte-identical: the app boots, reads location.pathname, and renders the route.
// So we emit a copy per route and Pages can serve every deep link for real.
//
// Two filenames are written per route because Pages resolves extensionless URLs
// against <name>.html (keeping the clean URL) and directory URLs against
// <name>/index.html (which 301s to a trailing slash). Writing both means either
// resolution order works. They are ~1.7 KB each.
function staticRouteShells(routes) {
  let outDir;
  return {
    name: "static-route-shells",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);

      // Guard against drift: a route added to App.tsx but missing here would work
      // in-app and 404 on refresh or a shared link — a failure you would not catch
      // locally. Fail the build loudly instead.
      const app = readFileSync(resolve(config.root, "src/App.tsx"), "utf8");
      const declared = new Set(
        [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]),
      );
      const expected = new Set([...routes, "/", "*"]);
      const missing = [...declared].filter((p) => !expected.has(p));
      const extra = [...expected].filter((p) => !declared.has(p));
      if (missing.length || extra.length) {
        throw new Error(
          "src/routes.ts is out of sync with App.tsx.\n" +
            (missing.length ? `  in App.tsx but not routes.ts: ${missing.join(", ")}\n` : "") +
            (extra.length ? `  in routes.ts but not App.tsx: ${extra.join(", ")}\n` : ""),
        );
      }
    },
    closeBundle() {
      const shell = resolve(outDir, "index.html");
      for (const route of routes) {
        const name = route.replace(/^\//, "");
        writeFileSync(resolve(outDir, `${name}.html`), readFileSync(shell));
        const dir = resolve(outDir, name);
        mkdirSync(dir, { recursive: true });
        copyFileSync(shell, resolve(dir, "index.html"));
      }
      // Pages serves 404.html for anything unmatched, so this renders the app's
      // own styled NotFound instead of GitHub's default page.
      copyFileSync(shell, resolve(outDir, "404.html"));
    },
  };
}

export default defineConfig({
  plugins: [react(), staticRouteShells(ROUTE_PATHS)],
});
