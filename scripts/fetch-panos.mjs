// Downloads the 360° room panoramas into /public/panos (runs before dev/build).
// Skips files that already exist, so you can replace any of them with your own photos.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3LH94kfiThcLHxbg9cgNJYkBbAD/";
const panos = {
  "living.jpg": "hf_20261116_091310_e00d2db2-226d-48af-b8cf-4979408d69f5.jpeg",
  "kitchen.jpg": "hf_20261116_091310_13000599-7604-4def-a017-f3ce1b22f56f.jpeg",
  "master.jpg": "hf_20261116_091310_8561a5bb-ab45-412c-93f7-ba77f48c628a.jpeg",
  "bedroom.jpg": "hf_20261116_091311_84988225-8b2b-4571-950d-daa12735fb83.jpeg",
  "balcony.jpg": "hf_20261116_091311_10c58ee3-508e-4e6b-9e67-a5416348d9e2.jpeg",
};

const dir = join(process.cwd(), "public", "panos");
mkdirSync(dir, { recursive: true });

let fetched = 0;
for (const [file, remote] of Object.entries(panos)) {
  const dest = join(dir, file);
  if (existsSync(dest)) continue;
  try {
    const res = await fetch(CDN + remote);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    fetched++;
    console.log(`  ✓ panos/${file}`);
  } catch (err) {
    console.warn(`  ! could not download panos/${file} (${err.message}). The viewer will try the CDN directly.`);
  }
}
if (fetched) console.log(`Venezia: downloaded ${fetched} panorama(s).`);
