# Buzón de medios

Deja aquí las imágenes, audios o videos que quieras publicar y haz push. **No necesitas credenciales ni configurar variables.** La GitHub Action los sube a Cloudflare R2, actualiza `media-manifest.json` y vacía esta carpeta automáticamente.

## Cómo se usa

Replica la ruta con la que el archivo se llamará desde el sitio:

```text
media-inbox/media/landing/team/nueva-foto.webp   ->  /media/landing/team/nueva-foto.webp
media-inbox/media/narratives/<slug>/audio/x.mp3  ->  /media/narratives/<slug>/audio/x.mp3
media-inbox/multimedia/reel-2026.webm            ->  /multimedia/reel-2026.webm
```

Solo se aceptan rutas bajo `media-inbox/media/` y `media-inbox/multimedia/`.

Para referenciar el archivo desde el código, usa siempre `asset()`:

```astro
---
import { asset } from "../../lib/assets";
---
<img src={asset("/media/landing/team/nueva-foto.webp")} alt="..." />
```

Formatos: WebP para imágenes, MP3 para audio, WebM para video. Nombres estables en minúsculas y con guiones.

## Verlo antes de publicar

```bash
npm run media:preview
```

Copia el buzón a `public/` para que `npm run dev` lo muestre. Los archivos siguen en el buzón, así que el push los publica igual.

## Después del push

La Action deja un commit que borra lo que había aquí. Haz `git pull` antes de seguir trabajando.
