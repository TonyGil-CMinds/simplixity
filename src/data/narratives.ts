import { asset } from "../lib/assets";

export type SoundtrackTrack = {
  id: string;
  title: string;
  src: string;
  duration: number;
  description: string;
};

export type NarrativeSpread = {
  id: string;
  label: string;
  layout: "t4n-legacy" | "t4n-place" | "t4n-community" | "t4n-soundtrack" | "generic";
};

export type NarrativeProject = {
  slug: string;
  word: string;
  title: string;
  credits?: string;
  date: string;
  note: string;
  tags: readonly string[];
  kind: string;
  bg: string;
  fg: string;
  paper: string;
  accent: string;
  cover?: string;
  spreads: readonly NarrativeSpread[];
};

export const t4nTracks: readonly SoundtrackTrack[] = [
  {
    id: "para-ti",
    title: "Para Ti, Antes de Ti",
    src: asset("/media/narratives/tech-for-nature/audio/01-para-ti-antes-de-ti.mp3"),
    duration: 78.12,
    description: "Inspirada en Benja, en su padre y en su hija. Tres generaciones.",
  },
  {
    id: "dzilam",
    title: "Dzilam de Bravo",
    src: asset("/media/narratives/tech-for-nature/audio/02-dzilam-de-bravo.mp3"),
    duration: 133.08,
    description: "La selva, el manglar, la costa. Un puerto y un lugar que tiene tantas historias por contar.",
  },
  {
    id: "jaguares",
    title: "Te Juro que Todavía Hay Jaguares",
    src: asset("/media/narratives/tech-for-nature/audio/03-te-juro-que-todavia-hay-jaguares.mp3"),
    duration: 163.92,
    description: "Darwin dice que hay jaguares en la costa. Yo le creo. Sé que tú también.",
  },
  {
    id: "antes-de-nosotros",
    title: "Antes de Nosotros, Después de Nosotros",
    src: asset("/media/narratives/tech-for-nature/audio/04-antes-de-nosotros-despues-de-nosotros.mp3"),
    duration: 179.28,
    description: "Tema principal. El canto de las huellas que damos y de aquellas que seguirán.",
  },
  {
    id: "chac-mool",
    title: "Chac’Mool",
    src: asset("/media/narratives/tech-for-nature/audio/05-chac-mool.mp3"),
    duration: 148.28,
    description: "El tema del grupo de monitoreo. De los guardianes.",
  },
  {
    id: "monte",
    title: "El Monte Que Nos Ve",
    src: asset("/media/narratives/tech-for-nature/audio/06-el-monte-que-nos-ve.mp3"),
    duration: 124.8,
    description: "Mi abuelo caminó una vez el monte, ahora yo también lo hago.",
  },
  {
    id: "tech4all",
    title: "Tech4All",
    src: asset("/media/narratives/tech-for-nature/audio/07-tech4all.mp3"),
    duration: 213.2,
    description: "Tecnología que es embebida, pero que también es de todos.",
  },
  {
    id: "bioscanner",
    title: "Bioscanner",
    src: asset("/media/narratives/tech-for-nature/audio/08-bioscanner.mp3"),
    duration: 180.04,
    description: "Ángel y Xio están creando algo para hacer real el sueño de Rex.",
  },
  {
    id: "roaaar",
    title: "ROAAAR!",
    src: asset("/media/narratives/tech-for-nature/audio/09-roaaar.mp3"),
    duration: 129.6,
    description: "El cierre de una etapa, el inicio para muchas otras.",
  },
] as const;

export const narrativeProjects: readonly NarrativeProject[] = [
  {
    slug: "tech-for-nature-mexico",
    word: "Tech4Nature",
    title: "Tech for Nature México",
    credits: "IUCN / HUAWEI'S TECH4ALL PROGRAM / C MINDS",
    date: "01 / bitácora · México",
    note: "Una historia sobre legado, territorio, comunidad y tecnología creada junto a quienes caminan el bosque.",
    tags: ["Narrativa", "Conservación", "Tecnología"],
    kind: "Conservación + tecnología",
    bg: "#FFC107",
    fg: "#0E2A47",
    paper: "#F8F7F3",
    accent: "#FFB000",
    cover: asset("/media/narratives/tech-for-nature/images/legacy-cover.webp"),
    spreads: [
      { id: "legado", label: "El legado", layout: "t4n-legacy" },
      { id: "dzilam", label: "Dzilam de Bravo", layout: "t4n-place" },
      { id: "comunidad", label: "Antes y después", layout: "t4n-community" },
      { id: "banda-sonora", label: "Banda sonora", layout: "t4n-soundtrack" },
    ],
  },
  {
    slug: "natura500",
    word: "Natura500",
    title: "Natura500",
    date: "02 / bitácora · abr 2026",
    note: "El archivo visual y sonoro de esta iniciativa se incorporará próximamente a la colección.",
    tags: ["Próximamente"],
    kind: "Bitácora en preparación",
    bg: "#FF4FA3",
    fg: "#FFFFFF",
    paper: "#FFF8F1",
    accent: "#FF4FA3",
    spreads: [{ id: "resumen", label: "Resumen", layout: "generic" }],
  },
  {
    slug: "oceanos-vitales",
    word: "Océanos Vitales",
    title: "Océanos Vitales",
    date: "03 / bitácora · may 2026",
    note: "El archivo visual y sonoro de esta iniciativa se incorporará próximamente a la colección.",
    tags: ["Próximamente"],
    kind: "Bitácora en preparación",
    bg: "#29B6F6",
    fg: "#0E2A47",
    paper: "#F5FBFE",
    accent: "#29B6F6",
    spreads: [{ id: "resumen", label: "Resumen", layout: "generic" }],
  },
  {
    slug: "ceiba",
    word: "CEIBA",
    title: "CEIBA",
    date: "04 / bitácora · jun 2026",
    note: "El archivo visual y sonoro de esta iniciativa se incorporará próximamente a la colección.",
    tags: ["Próximamente"],
    kind: "Bitácora en preparación",
    bg: "#B798FF",
    fg: "#0E2A47",
    paper: "#FAF7FF",
    accent: "#B798FF",
    spreads: [{ id: "resumen", label: "Resumen", layout: "generic" }],
  },
] as const;
