import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = (
  process.env.VITE_SITE_URL || "https://www.sammoradzadeh.me"
).replace(/\/?$/, "/");

// Fills in the absolute URL in index.html and emits robots.txt and sitemap.xml.
const seoFiles = () => ({
  name: "seo-files",
  transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl),
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "robots.txt",
      source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`,
    });
    this.emitFile({
      type: "asset",
      fileName: "sitemap.xml",
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </url>\n</urlset>\n`,
    });
  },
});

export default defineConfig({
  // configure-pages supplies the repository path in CI; local development uses /.
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react(), tailwindcss(), seoFiles()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    restoreMocks: true,
  },
});
