/**
 * Resuelve la URL pública de un recurso de `public/media` o `public/multimedia`.
 *
 * Los binarios viven en Cloudflare R2 y no en el repositorio, así que la ruta
 * se antepone con el origen del bucket. `PUBLIC_MEDIA_BASE_URL` lo sobrescribe:
 * vacío (`PUBLIC_MEDIA_BASE_URL=` en `.env`) sirve desde `public/`, útil para
 * trabajar sin red con los archivos descargados por `npm run media:pull`.
 *
 * El valor por defecto está aquí, y no solo en variables de entorno, para que un
 * clon recién hecho funcione sin configurar nada. La URL es pública: cualquiera
 * que abra el sitio la ve. Las credenciales de escritura sí viven en `.env`.
 *
 * `public/brand/` queda deliberadamente fuera: logos y tipografía son ligeros,
 * forman parte del render inicial y evitan una petición cruzada de fuentes.
 */
const DEFAULT_BASE = "https://pub-37011291ef4a413f998f325185f1a2f9.r2.dev";

const REMOTE = /^\/(media|multimedia)\//;

const configured = import.meta.env.PUBLIC_MEDIA_BASE_URL;
const base = (configured ?? DEFAULT_BASE).replace(/\/+$/, "");

export function asset(path: string): string {
  if (/^[a-z]+:\/\//i.test(path)) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!base || !REMOTE.test(normalized)) return normalized;

  return `${base}${normalized}`;
}
