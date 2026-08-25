/**
 * Publica lo que haya en `media-inbox/` sin exigir credenciales a quien lo dejó.
 *
 *   node scripts/media-ingest.mjs --preview   # local: copia a public/ para ver el sitio
 *   node scripts/media-ingest.mjs --clear     # CI: sube a R2, actualiza manifest, vacía el buzón
 *
 * El buzón replica la ruta final: `media-inbox/media/landing/foo.webp` termina
 * como `/media/landing/foo.webp`. A diferencia de `media-sync`, aquí el manifest
 * se fusiona en vez de regenerarse: en CI `public/media` está vacío (los binarios
 * no viven en git) y regenerarlo borraría todo lo ya publicado.
 */
import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import {
  MEDIA_DIRS,
  ROOT,
  bytes,
  hashFile,
  loadEnv,
  localPath,
  pool,
  readManifest,
  writeManifest,
} from "./media-lib.mjs";
import { connect, hasCredentials, upload } from "./media-r2.mjs";

const INBOX = path.join(ROOT, "media-inbox");

const flags = new Set(process.argv.slice(2));
const preview = flags.has("--preview");
const clear = flags.has("--clear");

await loadEnv();

async function walkInbox() {
  const found = [];
  const walk = async (absolute, prefix) => {
    let entries;
    try {
      entries = await readdir(absolute, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "README.md") continue;
      const next = path.join(absolute, entry.name);
      if (entry.isDirectory()) await walk(next, `${prefix}/${entry.name}`);
      else if (entry.isFile()) found.push({ absolute: next, key: `${prefix}/${entry.name}` });
    }
  };
  await walk(INBOX, "");
  return found.sort((a, b) => a.key.localeCompare(b.key));
}

const items = await walkInbox();
if (!items.length) {
  console.log("media-inbox/ está vacío, nada que publicar.");
  process.exit(0);
}

const misplaced = items.filter(({ key }) => !MEDIA_DIRS.some((dir) => key.startsWith(`/${dir}/`)));
if (misplaced.length) {
  console.error("Estos archivos no están bajo una carpeta válida del buzón:");
  for (const { key } of misplaced) console.error(`  media-inbox${key}`);
  console.error(`\nDeben ir en ${MEDIA_DIRS.map((dir) => `media-inbox/${dir}/...`).join(" o ")},`);
  console.error("replicando la ruta con la que se llamarán desde el sitio.");
  process.exit(1);
}

console.log(`${items.length} archivo(s) en el buzón:`);

// Copiar a public/ deja el sitio utilizable en local y mantiene coherente la
// ruta que resuelve asset() cuando no hay PUBLIC_MEDIA_BASE_URL.
for (const { absolute, key } of items) {
  const destination = localPath(key);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(absolute, destination);
  console.log(`  ${key} (${bytes((await stat(absolute)).size)})`);
}

if (preview) {
  console.log("\nCopiados a public/. Corre `npm run dev` para verlos.");
  console.log("Haz push con los archivos en media-inbox/ para publicarlos.");
  process.exit(0);
}

if (!hasCredentials()) {
  console.error("\nFaltan credenciales de R2. Usa --preview para solo copiar a public/.");
  process.exit(1);
}

const connection = connect();
const manifest = (await readManifest()) ?? { assets: {} };
const assets = { ...manifest.assets };

await pool(items, 4, async ({ key }) => {
  const absolute = localPath(key);
  const [{ size }, sha256] = await Promise.all([stat(absolute), hashFile(absolute)]);
  await upload(connection, key, absolute, sha256);
  assets[key] = { size, sha256 };
  console.log(`  publicado ${key}`);
});

await writeManifest(assets);
console.log(`\nmedia-manifest.json actualizado (${Object.keys(assets).length} archivos en total).`);

if (clear) {
  for (const { absolute } of items) await rm(absolute);
  // Deja el buzón sin directorios huérfanos.
  for (const dir of MEDIA_DIRS) await rm(path.join(INBOX, dir), { recursive: true, force: true });
  console.log("Buzón vaciado.");
}
