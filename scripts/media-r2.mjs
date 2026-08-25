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

export const hasCredentials = () => CREDENTIAL_VARS.every((name) => process.env[name]);

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
