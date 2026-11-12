// Writes a static HTML page for every tab and paper, plus robots.txt and the sitemap.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const ssrDir = new URL("../dist-ssr/", import.meta.url);
const siteUrl = (
  process.env.VITE_SITE_URL || "https://www.sammoradzadeh.me/"
).replace(/\/?$/, "/");

const { base, notFoundPage, pages, render, renderHead } = await import(
  new URL("entry-server.js", ssrDir)
);
const template = await readFile(new URL("index.html", dist), "utf8");
for (const marker of ['<div id="root"></div>', "<title>"])
  if (!template.includes(marker))
    throw new Error(`dist/index.html is missing ${marker}`);

const pageHtml = (page) =>
  template
    .replace(/<title>.*?<\/title>/s, renderHead(page, siteUrl))
    .replace('<div id="root"></div>', `<div id="root">${render(page)}</div>`);

for (const page of pages) {
  const html = pageHtml(page);
  const dir = new URL(page.path.slice(base.length), dist);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL("index.html", dir), html);
}

await writeFile(new URL("404.html", dist), pageHtml(notFoundPage));

await writeFile(
  new URL("robots.txt", dist),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`,
);
const urls = pages
  .map((page) => `  <url><loc>${new URL(page.path, siteUrl).href}</loc></url>`)
  .join("\n");
await writeFile(
  new URL("sitemap.xml", dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${pages.length} pages`);
