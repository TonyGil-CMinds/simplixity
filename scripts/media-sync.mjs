/**
 * Sube `public/media` y `public/multimedia` a R2 y regenera `media-manifest.json`.
 * Es la vía directa, para quien tiene credenciales de R2 en su entorno.
 *
 *   node scripts/media-sync.mjs [--dry-run] [--prune] [--force] [--if-needed]
 *
 * Solo sube lo que cambió: compara el sha256 local contra el manifest y el
 * tamaño del objeto remoto. `--prune` borra en R2 lo que ya no existe en local.
 * `--if-needed` (usado por el hook pre-push) no hace ruido ni falla cuando no
 * hay credenciales o no hay nada pendiente.
 */
import { stat } from "node:fs/promises";
import {
  bytes,
  hashFile,
  loadEnv,
  localPath,
  pool,
  readManifest,
  walkMedia,
  writeManifest,
} from "./media-lib.mjs";
import { connect, explainMissing, hasCredentials, listRemote, remove, upload } from "./media-r2.mjs";

const flags = new Set(process.argv.slice(2));
const dryRun = flags.has("--dry-run");
const prune = flags.has("--prune");
const force = flags.has("--force");
const ifNeeded = flags.has("--if-needed");

await loadEnv();

if (!hasCredentials()) {
  if (ifNeeded) {
    // Caso normal de quien solo edita código: no hay nada que hacer.
    process.exit(0);
  }
  console.error(explainMissing());
  console.error("Si no las tienes, deja el archivo en media-inbox/ y haz push: CI lo publica.");
  process.exit(1);
}

const keys = await walkMedia();
if (!keys.length) {
  console.error("No hay archivos en public/media ni public/multimedia. Aborto.");
  process.exit(1);
}

const local = new Map();
await pool(keys, 8, async (key) => {
  const absolute = localPath(key);
  const [{ size }, sha256] = await Promise.all([stat(absolute), hashFile(absolute)]);
  local.set(key, { size, sha256 });
});

const previous = (await readManifest()) ?? { assets: {} };

// Filtro barato antes de hablar con la red: si el manifest ya coincide con el
// disco no hay nada pendiente y el hook pre-push puede salir en silencio.
const changedLocally = keys.filter((key) => {
  const known = previous.assets?.[key];
  return !known || known.sha256 !== local.get(key).sha256;
});
const manifestComplete = Object.keys(previous.assets ?? {}).length === keys.length;

if (ifNeeded && !changedLocally.length && manifestComplete) process.exit(0);

console.log(`Analizando ${keys.length} archivos...`);
const connection = connect();
const remote = await listRemote(connection);

const pending = keys.filter((key) => {
  if (force) return true;
  if (!remote.has(key)) return true;
  const known = previous.assets?.[key];
  return !known || known.sha256 !== local.get(key).sha256 || remote.get(key).size !== local.get(key).size;
});

const orphans = [...remote.keys()].filter((key) => !local.has(key));

if (!pending.length) console.log("Todo al día, nada que subir.");

let uploaded = 0;
await pool(pending, 4, async (key) => {
  const { size, sha256 } = local.get(key);
  if (dryRun) {
    console.log(`  [dry-run] subiría ${key} (${bytes(size)})`);
    return;
  }
  await upload(connection, key, localPath(key), sha256);
  uploaded += 1;
  console.log(`  subido ${key} (${bytes(size)})`);
});

if (orphans.length) {
  if (prune && !dryRun) {
    await remove(connection, orphans);
    console.log(`Eliminados ${orphans.length} objetos huérfanos.`);
  } else {
    console.log(`\n${orphans.length} objetos existen en R2 pero no en local:`);
    for (const key of orphans) console.log(`  ${key}`);
    console.log("Usa --prune para borrarlos.");
  }
}

if (dryRun) process.exit(0);

const before = JSON.stringify(previous.assets ?? {});
const after = await writeManifest(Object.fromEntries(local));
console.log(`\nmedia-manifest.json actualizado (${keys.length} archivos, ${uploaded} subidos).`);

if (ifNeeded && JSON.stringify(after) !== before) {
  // El push en curso llevaría un manifest desactualizado: mejor detenerlo aquí.
  console.error("\nEl manifest cambió. Los archivos ya están en R2; commitéalo y repite el push:");
  console.error("  git add media-manifest.json && git commit -m 'chore(medios): actualiza manifest'");
  process.exit(1);
}

if (!ifNeeded) console.log("Commitea el manifest para que la verificación de CI lo use.");
