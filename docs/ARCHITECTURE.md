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

Para agregar una narrativa, crear una carpeta con slug estable en `public/media/narratives/`, registrar su contenido en `src/data/narratives.ts` y reutilizar los componentes de página y audio existentes.
