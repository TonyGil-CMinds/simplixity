/// <reference types="astro/client" />

interface ImportMetaEnv {
  /**
   * Origen público de los medios (bucket de R2). Vacía en local para servir
   * desde `public/`. Ver `src/lib/assets.ts`.
   */
  readonly PUBLIC_MEDIA_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
