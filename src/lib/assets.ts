/**
 * Resuelve la URL pública de un recurso de `public/media` o `public/multimedia`.
 *
 * En desarrollo `PUBLIC_MEDIA_BASE_URL` está vacía y las rutas se sirven desde
 * `public/`. En producción apunta al bucket de R2, de modo que los binarios no
 * viajan en el repositorio ni en el build de Vercel.
 *
 * `public/brand/` queda deliberadamente fuera: logos y tipografía son ligeros,
 * forman parte del render inicial y evitan una petición cruzada de fuentes.
 */
const REMOTE = /^\/(media|multimedia)\//;

const base = (import.meta.env.PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/+$/, "");

export function asset(path: string): string {
  if (/^[a-z]+:\/\//i.test(path)) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!base || !REMOTE.test(normalized)) return normalized;

  return `${base}${normalized}`;
}
