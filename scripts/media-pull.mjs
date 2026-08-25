/**
 * Descarga a `public/` los medios declarados en el manifest. Necesario tras un
 * clon nuevo, porque los binarios ya no viajan en el repositorio.
 *
 * Usa la URL pública, así que tampoco requiere credenciales de R2.
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { bytes, hashFile, loadEnv, localPath, pool, publicBase, readManifest } from "./media-lib.mjs";

await loadEnv();

const base = publicBase();
if (!base) {
  console.error("PUBLIC_MEDIA_BASE_URL no está definida.");
  process.exit(1);
}

const manifest = await readManifest();
if (!manifest) {
  console.error("No existe media-manifest.json.");
  process.exit(1);
}

const entries = Object.entries(manifest.assets ?? {});
let downloaded = 0;
let skipped = 0;
const failures = [];

await pool(entries, 4, async ([key, { size, sha256 }]) => {
  const absolute = localPath(key);
  try {
    const local = await stat(absolute);
    if (local.size === size && (await hashFile(absolute)) === sha256) {
      skipped += 1;
      return;
    }
  } catch {
    // No existe en local: se descarga.
  }

  try {
    const response = await fetch(`${base}${key}`);
    if (!response.ok) {
      failures.push(`${key} -> HTTP ${response.status}`);
      return;
    }
    await mkdir(path.dirname(absolute), { recursive: true });
    await writeFile(absolute, Buffer.from(await response.arrayBuffer()));
    downloaded += 1;
    console.log(`  descargado ${key} (${bytes(size)})`);
  } catch (error) {
    failures.push(`${key} -> ${error.message}`);
  }
});

console.log(`\n${downloaded} descargados, ${skipped} ya estaban al día.`);
if (failures.length) {
  console.error(`${failures.length} fallaron:`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
