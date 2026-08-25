/**
 * Acceso a R2 vía su API compatible con S3. Compartido por `media-sync` (subida
 * directa desde una máquina con credenciales) y `media-ingest` (subida desde CI).
 */
import { readFile } from "node:fs/promises";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { bytes, contentType, requireEnv } from "./media-lib.mjs";

export const CREDENTIAL_VARS = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
];

export const missingCredentials = () => CREDENTIAL_VARS.filter((name) => !process.env[name]);

export const hasCredentials = () => missingCredentials().length === 0;

/**
 * Nombra las que faltan, sin revelar valores. En CI un secret mal escrito o
 * definido a nivel de entorno llega como cadena vacía, y sin este detalle el
 * fallo es indistinguible de no haberlos creado.
 */
export function explainMissing() {
  const missing = missingCredentials();
  const present = CREDENTIAL_VARS.filter((name) => process.env[name]);
  const lines = [`Faltan ${missing.length} de ${CREDENTIAL_VARS.length} credenciales de R2.`];
  for (const name of missing) lines.push(`  AUSENTE  ${name}`);
  for (const name of present) lines.push(`  ok       ${name}`);
  return lines.join("\n");
}

export function connect() {
  const [accountId, accessKeyId, secretAccessKey, bucket] = requireEnv(...CREDENTIAL_VARS);
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return { client, bucket };
}

/** Inventario del bucket, indexado por clave con barra inicial (`/media/...`). */
export async function listRemote({ client, bucket }) {
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

export async function upload({ client, bucket }, key, absolute, sha256) {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key.replace(/^\//, ""),
      Body: await readFile(absolute),
      ContentType: contentType(key),
      // Los nombres son estables y el contenido inmutable por convención.
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: { sha256 },
    }),
  );
}

export async function remove({ client, bucket }, keys) {
  if (!keys.length) return;
  await client.send(
    new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: { Objects: keys.map((key) => ({ Key: key.replace(/^\//, "") })) },
    }),
  );
}

export { bytes };
