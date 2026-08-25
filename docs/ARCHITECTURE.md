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

`Flipbook.astro` mantiene una sola máquina de estado para navegación, gesto, teclado y giro de página. `NarrativePage.astro` decide la composición de cada página a partir de la clave `layout:side` del pliego. Los layouts registrados hoy incluyen las familias `t4n-*`, `n500-*`, `vo-*` y `generic`.

La materia de las hojas (papel de puntos, pauta `--rule`, cinta, fotos reveladas, folios) vive en `global.css` bajo el prefijo `.nb-`, para que sea reutilizable por cualquier bitácora futura. `InkMark.astro` concentra las marcas de tinta trazadas a mano; `DoodleArrow.astro` y `DoodleFace.astro` siguen sirviendo flechas y garabatos.

Regla operativa de las hojas: el alto de cualquier objeto se declara en múltiplos de `--rule`, nunca en porcentaje contra una fila flexible. Un porcentaje contra `1fr` desborda la hoja en cuanto cambia el contenido, y la hoja tiene alto fijo.

El audio se delega en tres componentes independientes. Los tres declaran `container-type: inline-size` y miden su interior en `cqw` propios, de modo que escalan con la caja que les asigna la hoja y no con el ancho del libro:

- `ColorAudioPlayer.astro`: reproductor protagonista.
- `CapsuleAudioPlayer.astro`: reproductor sobre fotografía.
- `PlayPauseButton.astro`: control mínimo para el listado de banda sonora.

`src/scripts/audio-controller.ts` conserva una única sesión de audio entre páginas clonadas por el flipbook. De este modo una hoja puede desmontarse visualmente sin detener la pista activa. Las listas que declaran `data-audio-playlist` avanzan a la siguiente pista al terminar y el runtime cancela sus escuchas anteriores cuando el módulo vuelve a inicializarse, evitando controles duplicados durante HMR.

## Política de medios

- Imágenes raster publicadas: WebP.
- Audio publicado: MP3.
- SVG y fuentes: `public/brand/`.
- Archivos de referencia que no forman parte del sitio: `docs/references/`.
- Maestros WAV/PNG: almacenamiento de producción externo, no Git.

Para agregar una narrativa, crear una carpeta con slug estable en `public/media/narratives/`, registrar su contenido en `src/data/narratives.ts` y reutilizar los componentes de página y audio existentes.

Para agregar un pliego a una bitácora existente: añadir la entrada en `spreads`, extender la unión `NarrativeSpread["layout"]` y escribir las dos caras en `NarrativePage.astro`. El orden del arreglo es el orden de lectura; la banda sonora se mantiene siempre al final.

## Almacenamiento de medios

Los binarios de `public/media/` y `public/multimedia/` no viven en git: se almacenan en Cloudflare R2 y se sirven desde ahí. `media-manifest.json` registra ruta, tamaño y sha256 de cada archivo y es el contrato entre local, el bucket y CI.

- Toda ruta a esos directorios se resuelve con `asset()` (`src/lib/assets.ts`), que antepone el origen del bucket. Trae la URL por defecto para que un clon nuevo funcione sin configuración; `PUBLIC_MEDIA_BASE_URL` la sobrescribe y vacía sirve desde `public/`.
- Publicar tiene dos vías: `npm run media:sync` para quien tiene credenciales de R2, y `media-inbox/` para quien no. El buzón replica la ruta final del archivo y la GitHub Action lo sube, fusiona el manifest y lo vacía. Contribuir con contenido no exige configurar un entorno.
- `public/brand/` sí viaja en git: es ligero, entra en el primer render y evita una petición cruzada de fuentes.
