---
name: Simplixity
description: Complejidad en movimiento, experiencias claras creadas con estrategia, diseño y tecnología.
colors:
  azul-institucional: "#0E2A47"
  rosa-pulso: "#FF4FA3"
  cian-senal: "#29B6F6"
  lila-imaginacion: "#B798FF"
  amarillo-chispa: "#FFC107"
  salvia-papel: "#EBF1E9"
  rosa-papel: "#FFD3E7"
  papel-claro: "#F4F4F6"
  tinta-suave: "#8FB4CE"
  papel-blanco: "#FFFFFF"
typography:
  display:
    fontFamily: "Neulis Cursive, Hanken Grotesk, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 9.375rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "normal"
  headline:
    fontFamily: "Neulis Cursive, Hanken Grotesk, sans-serif"
    fontSize: "clamp(2.125rem, 4.4vw, 5.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "normal"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(0.875rem, 1.4vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.2em"
rounded:
  xs: "8px"
  sm: "10px"
  md: "20px"
  lg: "24px"
  pill: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "18px"
  lg: "26px"
  xl: "34px"
  section-inline: "clamp(24px, 4vw, 56px)"
  section-block: "clamp(72px, 11vh, 120px)"
components:
  button-contact:
    backgroundColor: "{colors.amarillo-chispa}"
    textColor: "{colors.azul-institucional}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "16px 26px"
  chip-accent:
    backgroundColor: "{colors.rosa-pulso}"
    textColor: "{colors.papel-blanco}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  project-card:
    backgroundColor: "{colors.azul-institucional}"
    textColor: "{colors.papel-blanco}"
    rounded: "{rounded.lg}"
    padding: "20px 20px 28px"
  flipbook-page:
    backgroundColor: "{colors.papel-blanco}"
    textColor: "{colors.azul-institucional}"
    rounded: "{rounded.xs}"
    padding: "clamp(18px, 3vw, 36px)"
---

# Design System: Simplixity

## Overview

**Creative North Star: "Complejidad en movimiento"**

Simplixity se comporta como una bitácora creativa que cobró vida. El sistema mezcla rigor modular con materiales humanos: papel, puntos de semitono, recortes fotográficos, marcas de pincel, garabatos y notas manuales. La composición es energética y joven, pero cada gesto está ordenado para conservar credibilidad frente a gobiernos, financiadores, organizaciones internacionales y marcas globales.

El movimiento es narrativo. Las secciones se apilan como láminas; los títulos entran con una elevación firme; las imágenes se desplazan con parallax sutil. Narrativas es el componente emblemático: debe sentirse como hojear una bitácora física continua, no como cambiar entre paneles digitales.

El sistema rechaza la consultoría corporativa tradicional, la ONG institucional genérica y la plantilla de startup SaaS. También rechaza el color infantil o arbitrario. La expresividad siempre debe revelar una idea, una historia o una acción.

**Key Characteristics:**

- Paleta completa, saturada y disciplinada.
- Composición modular inspirada en cuadernos y hojas de trabajo.
- Fotografía real recortada sobre color, papel o semitono.
- Tipografía de gran escala combinada con etiquetas técnicas pequeñas.
- Movimiento continuo, táctil y respetuoso de reducción de movimiento.

## Colors

La paleta es un conjunto de tintas de taller creativo. El azul sostiene la credibilidad; rosa, cian, lila y amarillo marcan ritmo y jerarquía; los tonos papel evitan que el sistema se vuelva digitalmente frío.

### Primary

- **Azul Institucional:** tinta principal, superficies oscuras, navegación y texto de máxima jerarquía.
- **Rosa Pulso:** energía de marca, titulares, llamadas visuales y superficies inmersivas.

### Secondary

- **Cian Señal:** etiquetas, fondos frescos, estados activos y orientación.
- **Lila Imaginación:** capas experimentales, fondos de servicio y contraste creativo.

### Tertiary

- **Amarillo Chispa:** acciones de alta intención y acentos breves.
- **Rosa Papel:** superficie secundaria para composiciones editoriales y retratos.

### Neutral

- **Salvia Papel:** fondo cálido para método, cierre y páginas tranquilas.
- **Papel Claro:** lienzo general con textura sutil.
- **Papel Blanco:** páginas del flipbook y elementos de contraste.
- **Tinta Suave:** texto secundario sobre Azul Institucional.

**The Flexible Ink Rule.** Cada escena usa de dos a cuatro tintas de la paleta, nunca todas con el mismo peso. El azul ancla y una tinta saturada domina.

**The Paper Rule.** Las superficies claras deben sentirse como papel, no como blanco digital puro. El blanco se reserva para páginas, controles y contraste localizado.

## Typography

**Display Font:** Neulis Cursive con Hanken Grotesk como respaldo.
**Body Font:** Hanken Grotesk con system-ui como respaldo.

**Character:** La voz combina titulares manuales, densos y expresivos con una sans legible y contemporánea. El contraste recuerda anotaciones sobre una maqueta bien ordenada.

### Hierarchy

- **Display** (900, fluido hasta 150px, 0.84 a 0.9): palabras hero, manifiestos y cierres de una sola idea.
- **Headline** (900, fluido hasta 88px, 0.9): títulos de sección y nombres de proyecto.
- **Title** (700 a 900, 22 a 40px, 0.94): encabezados de tarjetas y páginas de bitácora.
- **Body** (400 a 600, 14 a 19px, 1.4 a 1.5): explicación y narrativa, limitada a 70 caracteres por línea.
- **Label** (600, 11 a 12px, 0.14em a 0.2em, mayúsculas): categorías, navegación contextual y metadatos.

**The One Idea Per Fold Rule.** Un solo titular domina cada viewport. El resto de la tipografía lo apoya y nunca compite por escala.

**The Human Annotation Rule.** Las marcas manuales se usan para títulos, notas y énfasis breves. Nunca sustituyen párrafos de lectura.

## Elevation

La profundidad es híbrida. La mayoría de las superficies son planas y se separan por color; las sombras aparecen en objetos físicos, navegación flotante y páginas que se levantan. En el flipbook, la sombra debe comunicar grosor, pliegue y dirección del giro.

### Shadow Vocabulary

- **Tarjeta flotante** (`0 30px 60px rgba(14,42,71,.14)`): tarjeta hero y piezas físicas grandes.
- **Control flotante** (`0 4px 18px rgba(14,42,71,.18)`): menú y controles compactos.
- **Libro abierto** (`0 34px 70px rgba(14,42,71,.22)`): volumen completo del flipbook.
- **Pliegue de página** (`inset 18px 0 30px -22px rgba(14,42,71,.35)`): cercanía al lomo durante el giro.

**The Physical Cause Rule.** Toda sombra debe tener una causa física visible. Si una superficie no flota, no se pliega ni se levanta, permanece plana.

## Components

### Buttons

- **Shape:** rectángulos táctiles de esquina suave (10px) o controles circulares completos.
- **Primary:** Amarillo Chispa sobre Azul Institucional, peso 700 y padding 16px por 26px.
- **Hover / Focus:** desplazamiento máximo de 2px, inversión o cambio a Rosa Pulso y foco visible de 3px.
- **Motion:** 220 a 320ms con salida exponencial. Nunca bounce o elastic.

### Chips

- **Style:** píldoras compactas con una tinta saturada o Azul Institucional, texto de alto contraste y padding de 5 a 7px por 10 a 13px.
- **State:** el color distingue categorías, pero el texto siempre nombra la categoría.

### Cards / Containers

- **Corner Style:** tarjetas grandes entre 20px y 24px; páginas editoriales entre 6px y 10px.
- **Background:** Azul Institucional para proyectos, tintas saturadas para escenas y papel para lectura.
- **Shadow Strategy:** planas por defecto; flotantes únicamente cuando la composición representa un objeto.
- **Border:** reglas finas de 1px y líneas de cuaderno. Nunca franjas laterales decorativas.
- **Internal Padding:** escala de 18px, 26px y 34px.

### Inputs / Fields

- **Style:** campos sobre papel con borde Azul Institucional de 1px, radio de 8px y etiquetas persistentes.
- **Focus:** borde Cian Señal y anillo exterior visible de 3px.
- **Error / Disabled:** el error incluye icono y mensaje; el estado nunca depende solo del color.

### Navigation

El isotipo permanece fijo y adapta su contraste por sección. El menú circular abre una superficie completa Azul Institucional con navegación display. En móvil, los enlaces ocupan una sola columna y conservan un objetivo táctil mínimo de 44px.

### Flipbook

El libro es una superficie editorial de dos páginas en escritorio y una página enfocada en móvil. Cada giro conserva continuidad entre página saliente y entrante mediante perspectiva, `transform-origin` en el lomo, sombreado progresivo y una duración constante. El contenido no cambia hasta que el pliegue lo oculta. Los botones, teclado, gesto horizontal y progreso deben compartir la misma máquina de estado para impedir saltos o giros superpuestos.

En `prefers-reduced-motion`, el giro 3D se sustituye por una disolución corta sin perder paginación, foco ni lectura.

## Do's and Don'ts

### Do:

- **Do** conservar la estructura, paleta y proporciones definidas en los prototipos HTML.
- **Do** usar semitono, papel, collage, recortes y doodles como materiales narrativos.
- **Do** mantener cada sección en `100svh` solo cuando su contenido cabe sin recorte; en móvil corto, permitir flujo natural.
- **Do** animar exclusivamente `transform`, `opacity`, filtros moderados y variables visuales compatibles con composición.
- **Do** hacer que el flipbook responda igual a botones, teclado, arrastre y gesto táctil.
- **Do** cumplir WCAG 2.2 AA, foco visible y `prefers-reduced-motion`.

### Don't:

- **Don't** convertir Simplixity en una consultora corporativa tradicional, una ONG institucional genérica o una plantilla de startup SaaS.
- **Don't** usar la paleta de manera infantil, arbitraria o puramente decorativa.
- **Don't** usar degradado dentro del texto, glassmorphism decorativo o tarjetas idénticas repetidas sin jerarquía.
- **Don't** usar `border-left` o `border-right` de más de 1px como franja decorativa.
- **Don't** simular el flipbook con un simple carrusel lateral o cambiar el contenido antes de que la página termine de girar.
- **Don't** bloquear el scroll, la navegación o el contenido si GSAP, Lenis o JavaScript no cargan.
