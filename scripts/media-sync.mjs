/**
 * Sube `public/media` y `public/multimedia` a R2 y regenera `media-manifest.json`.
 *
 *   node scripts/media-sync.mjs [--dry-run] [--prune] [--force]
 *
 * Solo sube lo que cambió: compara el sha256 local contra el metadato `sha256`
 * del objeto remoto. `--prune` borra en R2 lo que ya no existe en local.
 */
import { readFile, stat } from "node:fs/promises";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  bytes,
  contentType,
  hashFile,
  loadEnv,
  localPath,
  pool,
  readManifest,
  requireEnv,
  walkMedia,
  writeManifest,
} from "./media-lib.mjs";

const flags = new Set(process.argv.slice(2));
const dryRun = flags.has("--dry-run");
const prune = flags.has("--prune");
const force = flags.has("--force");

await loadEnv();
const [accountId, accessKeyId, secretAccessKey, bucket] = requireEnv(
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
);

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

/** Objeto remoto -> sha256 guardado como metadato en la subida anterior. */
async function listRemote() {
  const remote = new Map();
  let token;
  do {
    const page = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token }),
    );
    for (const object of page.Contents ?? []) {
      remote.set(`/${object.Key}`, { size: object.Size, etag: object.ETag });
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return remote;
}

const keys = await walkMedia();
if (!keys.length) {
  console.error("No hay archivos en public/media ni public/multimedia. Aborto.");
  process.exit(1);
}

console.log(`Analizando ${keys.length} archivos...`);

const local = new Map();
await pool(keys, 8, async (key) => {
  const absolute = localPath(key);
  const [{ size }, sha256] = await Promise.all([stat(absolute), hashFile(absolute)]);
  local.set(key, { size, sha256 });
});

const remote = await listRemote();
const previous = (await readManifest()) ?? { assets: {} };

const pending = keys.filter((key) => {
  if (force) return true;
  if (!remote.has(key)) return true;
  const known = previous.assets?.[key];
  // El manifest es la memoria de qué sha subimos; el tamaño remoto lo confirma.
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
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key.replace(/^\//, ""),
      Body: await readFile(localPath(key)),
      ContentType: contentType(key),
      // Los nombres son estables y el contenido inmutable por convención.
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: { sha256 },
    }),
  );
  uploaded += 1;
  console.log(`  subido ${key} (${bytes(size)})`);
});

if (orphans.length) {
  if (prune && !dryRun) {
    await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: orphans.map((key) => ({ Key: key.replace(/^\//, "") })) },
      }),
    );
    console.log(`Eliminados ${orphans.length} objetos huérfanos.`);
  } else {
    console.log(`\n${orphans.length} objetos existen en R2 pero no en local:`);
    for (const key of orphans) console.log(`  ${key}`);
    console.log("Usa --prune para borrarlos.");
  }
}

if (!dryRun) {
  await writeManifest(Object.fromEntries(local));
  console.log(`\nmedia-manifest.json actualizado (${keys.length} archivos, ${uploaded} subidos).`);
  console.log("Commitea el manifest para que la verificación de CI lo use.");
}
