# Arquitectura del portafolio

## Objetivo

El sitio separa contenido, presentación, interacción y recursos para que cada nueva narrativa pueda incorporarse sin duplicar lógica ni aumentar innecesariamente el peso del repositorio.

## Capas

1. `src/data/` contiene el contenido serializable de proyectos y pistas.
2. `src/components/` contiene piezas reutilizables agrupadas por dominio.
3. `src/pages/` compone rutas sin almacenar comportamiento complejo.
4. `src/scripts/` coordina comportamientos compartidos: scroll, animación y reproducción.
5. `public/brand/` contiene identidad compartida; `public/media/` contiene únicamente medios optimizados de producción.

## Narrativas

`Flipbook.astro` mantiene una sola máquina de estado para navegación, gesto, teclado y giro de página. `NarrativePage.astro` decide la composición de cada página y delega el audio en tres componentes independientes:

- `ColorAudioPlayer.astro`: reproductor protagonista.
- `CapsuleAudioPlayer.astro`: reproductor sobre fotografía.
- `PlayPauseButton.astro`: control mínimo para el listado de banda sonora.

`src/scripts/audio-controller.ts` conserva una única sesión de audio entre páginas clonadas por el flipbook. De este modo una hoja puede desmontarse visualmente sin detener la pista activa.

## Política de medios

- Imágenes raster publicadas: WebP.
- Audio publicado: MP3.
- SVG y fuentes: `public/brand/`.
- Archivos de referencia que no forman parte del sitio: `docs/references/`.
- Maestros WAV/PNG: almacenamiento de producción externo, no Git.
- Los binarios de `public/media/` y `public/multimedia/` se almacenan en Cloudflare R2 y quedan fuera de git; `media-manifest.json` registra ruta, tamaño y sha256 de cada uno.
- Toda ruta a esos directorios se resuelve con `asset()` (`src/lib/assets.ts`), que antepone el origen del bucket. Trae la URL por defecto para que un clon nuevo funcione sin configuración; `PUBLIC_MEDIA_BASE_URL` la sobrescribe y vacía sirve desde `public/`.
- Publicar tiene dos vías: `npm run media:sync` para quien tiene credenciales de R2, y `media-inbox/` para quien no. El buzón se replica con la ruta final del archivo y la GitHub Action lo sube, fusiona el manifest y lo vacía. Así contribuir con contenido no exige configurar un entorno.

Para agregar una narrativa, crear una carpeta con slug estable en `public/media/narratives/`, registrar su contenido en `src/data/narratives.ts` y reutilizar los componentes de página y audio existentes.
