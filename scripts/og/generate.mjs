/* ------------------------------------------------------------------
   Generates the share images (Open Graph / Twitter), app icons and the
   logo PNG used in structured data. Run after changing page copy or
   renders:

     PUPPETEER=<path-to>/puppeteer-core  CHROME=<path-to-chrome>  node scripts/og/generate.mjs

   Needs puppeteer-core (not a project dependency) and a local Chrome.
   Output is committed, so this does not run during the build.
------------------------------------------------------------------- */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pub = (p) => pathToFileURL(path.join(root, "public", p)).href;
const logoSvg = fs.readFileSync(path.join(root, "public/brand/venezia-logo.svg"), "utf8");
const markSvg = fs.readFileSync(path.join(root, "public/brand/venezia-mark.svg"), "utf8");

const puppeteerPath = process.env.PUPPETEER ?? "puppeteer-core";
const { default: puppeteer } = await import(
  /^[a-zA-Z]:[\\/]|^\//.test(puppeteerPath) ? pathToFileURL(path.join(puppeteerPath, "lib/esm/puppeteer/puppeteer-core.js")).href : puppeteerPath
);
const chrome = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const RERA = "RERA No. RAA16759/230426/311230";

/** One card per route. `dir` is the app-router folder ("" = home). */
const pages = [
  { dir: "", image: "images/b/dusk.jpg", pos: "62% 40%", eyebrow: "2 BHK Residences · S.G. Highway, Adalaj", title: "Where serenity flows <em>in everyday life.</em>", alt: "The Venezia: 2 BHK residences in five towers on S.G. Highway, Adalaj, shown at dusk" },
  { dir: "about", image: "images/b/front.jpg", pos: "70% 30%", eyebrow: "About · RM Enterprise", title: "A home that has <em>no equal.</em>", alt: "The Venezia front elevation: a project by RM Enterprise, Adalaj" },
  { dir: "residences", image: "images/floor-3d.jpg", pos: "70% 50%", eyebrow: "Residences · 280 homes · 14 floors", title: "Select your floor. <em>Step inside in 3D.</em>", alt: "3D cut-away of a 2 BHK residence at The Venezia, Adalaj" },
  { dir: "amenities", image: "images/b/water.jpg", pos: "65% 55%", eyebrow: "Amenities · 21,500 sq ft", title: "30+ resort-style <em>amenities.</em>", alt: "Water body and landscaped court among the amenities at The Venezia, Adalaj" },
  { dir: "gallery", image: "images/b/aerial.jpg", pos: "60% 40%", eyebrow: "Gallery · Renders & 360° tours", title: "Every angle, <em>every room.</em>", alt: "Aerial view of The Venezia campus, Adalaj" },
  { dir: "contact", image: "images/b/living.jpg", pos: "65% 50%", eyebrow: "Contact · +91 90700 78700", title: "Book a <em>private visit.</em>", alt: "Living room of a 2 BHK residence at The Venezia: book a site visit" },
];

const fonts = `<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400&family=Manrope:wght@500;600&display=block" rel="stylesheet">`;

const card = (p) => `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>
  *{box-sizing:border-box} html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#071233}
  .bg{position:absolute;inset:0;background:url("${pub(p.image)}") ${p.pos}/cover no-repeat}
  .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,18,51,.96) 0%,rgba(7,18,51,.86) 36%,rgba(7,18,51,.35) 66%,rgba(7,18,51,.08) 100%)}
  .copy{position:absolute;left:72px;top:64px;bottom:64px;width:640px;display:flex;flex-direction:column;color:#fff}
  .logo{width:250px;color:#fff} .logo svg{display:block;width:100%;height:auto}
  .eyebrow{margin:auto 0 0;font:600 17px/1.3 Manrope,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#8fd3ee}
  h1{margin:18px 0 0;font:300 64px/1.06 Outfit,sans-serif;letter-spacing:-.02em} h1 em{font-style:normal;color:#8fd3ee}
  .foot{margin-top:36px;padding-top:22px;border-top:1px solid rgba(255,255,255,.22);display:flex;gap:22px;align-items:center;font:500 17px/1 Manrope,sans-serif;color:rgba(255,255,255,.85)}
  .foot span{color:rgba(255,255,255,.55);font-size:15px}
  .bar{position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#8fd3ee,#3d78c4 45%,#0f2556)}
</style></head><body>
  <div class="bg"></div><div class="shade"></div>
  <div class="copy">
    <div class="logo">${logoSvg}</div>
    <p class="eyebrow">${p.eyebrow}</p>
    <h1>${p.title}</h1>
    <div class="foot">S.G. Highway, Adalaj, Gandhinagar<span>${RERA}</span></div>
  </div>
  <div class="bar"></div>
</body></html>`;

const icon = ({ size, mark, bg = "#0f2556", radius = 0 }) => `<!doctype html><html><head><style>
  html,body{margin:0;width:${size}px;height:${size}px;background:transparent}
  .i{width:100%;height:100%;display:grid;place-items:center;background:${bg};border-radius:${radius}px;color:#fff}
  .i svg{width:${mark * 100}%;height:auto;display:block}
</style></head><body><div class="i">${markSvg}</div></body></html>`;

const logoCard = `<!doctype html><html><head><style>
  html,body{margin:0;width:1200px;height:420px;background:#fff}
  .w{width:100%;height:100%;display:grid;place-items:center;color:#0f2556} .w svg{width:860px;height:auto}
</style></head><body><div class="w">${logoSvg}</div></body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "venezia-og-"));
const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();

async function render(html, width, height, out, type = "jpeg") {
  const file = path.join(tmp, "page.html");
  fs.writeFileSync(file, html);
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(file).href, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, type, ...(type === "jpeg" ? { quality: 84 } : { omitBackground: true }), clip: { x: 0, y: 0, width, height } });
  console.log("wrote", path.relative(root, out));
}

for (const p of pages) {
  const dir = path.join(root, "src/app", p.dir);
  await render(card(p), 1200, 630, path.join(dir, "opengraph-image.jpg"));
  fs.copyFileSync(path.join(dir, "opengraph-image.jpg"), path.join(dir, "twitter-image.jpg"));
  fs.writeFileSync(path.join(dir, "opengraph-image.alt.txt"), p.alt);
  fs.writeFileSync(path.join(dir, "twitter-image.alt.txt"), p.alt);
}

await render(icon({ size: 180, mark: 0.58 }), 180, 180, path.join(root, "src/app/apple-icon.png"), "png");
await render(icon({ size: 192, mark: 0.58 }), 192, 192, path.join(root, "public/icons/icon-192.png"), "png");
await render(icon({ size: 512, mark: 0.58 }), 512, 512, path.join(root, "public/icons/icon-512.png"), "png");
await render(icon({ size: 512, mark: 0.42 }), 512, 512, path.join(root, "public/icons/icon-maskable-512.png"), "png");
await render(logoCard, 1200, 420, path.join(root, "public/brand/venezia-logo.png"), "png");

await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
