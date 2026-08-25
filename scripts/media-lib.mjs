import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
export const PUBLIC_DIR = path.join(ROOT, "public");
export const MANIFEST_PATH = path.join(ROOT, "media-manifest.json");

/** Directorios de `public/` gestionados en R2. `brand/` se queda en el repo. */
export const MEDIA_DIRS = ["media", "multimedia"];

const CONTENT_TYPES = {
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".vtt": "text/vtt",
  ".pdf": "application/pdf",
};

export const contentType = (key) =>
  CONTENT_TYPES[path.extname(key).toLowerCase()] || "application/octet-stream";

/** Carga `.env` sin dependencias, sin pisar variables ya presentes en el entorno. */
export async function loadEnv() {
  let raw;
  try {
    raw = await readFile(path.join(ROOT, ".env"), "utf8");
  } catch {
    return;
  }

  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match || line.trimStart().startsWith("#")) continue;
    const value = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  }
}

export function requireEnv(...names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Faltan variables de entorno: ${missing.join(", ")}`);
  }
  return names.map((name) => process.env[name]);
}

/** Recorre `public/media` y `public/multimedia` y devuelve claves tipo `/media/...`. */
export async function walkMedia() {
  const keys = [];

  const walk = async (absolute, prefix) => {
    let entries;
    try {
      entries = await readdir(absolute, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const key = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) await walk(path.join(absolute, entry.name), key);
      else if (entry.isFile()) keys.push(key);
    }
  };

  for (const dir of MEDIA_DIRS) await walk(path.join(PUBLIC_DIR, dir), `/${dir}`);
  return keys.sort();
}

export const localPath = (key) => path.join(PUBLIC_DIR, key.replace(/^\//, ""));

export function hashFile(absolute) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    createReadStream(absolute)
      .on("error", reject)
      .on("data", (chunk) => hash.update(chunk))
      .on("end", () => resolve(hash.digest("hex")));
  });
}

export async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return null;
  }
}

/** Claves ordenadas para que el diff en git sea legible. */
export async function writeManifest(assets) {
  const sorted = Object.fromEntries(Object.keys(assets).sort().map((key) => [key, assets[key]]));
  await writeFile(MANIFEST_PATH, `${JSON.stringify({ assets: sorted }, null, 2)}\n`, "utf8");
  return sorted;
}

/**
 * Origen público del bucket. `src/lib/assets.ts` es la fuente única de esa URL;
 * leerla de ahí evita que CI dependa de configurar una variable más y evita que
 * las dos copias se desincronicen en silencio.
 */
export async function publicBase() {
  const configured = process.env.PUBLIC_MEDIA_BASE_URL;
  if (configured) return configured.replace(/\/+$/, "");

  const source = await readFile(path.join(ROOT, "src", "lib", "assets.ts"), "utf8");
  const match = /DEFAULT_BASE\s*=\s*"([^"]+)"/.exec(source);
  return (match?.[1] ?? "").replace(/\/+$/, "");
}

export const bytes = (n) =>
  n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;

/** Ejecuta `task` sobre `items` con concurrencia limitada. */
export async function pool(items, limit, task) {
  const queue = [...items];
  const results = [];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await task(item));
    }
  });
  await Promise.all(workers);
  return results;
}
