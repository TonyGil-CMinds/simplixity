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
  layout:
    | "t4n-legacy"
    | "t4n-place"
    | "t4n-community"
    | "t4n-bioscanner"
    | "t4n-platform"
    | "t4n-soundtrack"
    | "n500-origin"
    | "n500-remember"
    | "n500-journey"
    | "n500-platform"
    | "n500-soundtrack"
    | "vo-nets"
    | "vo-world"
    | "vo-platform"
    | "vo-soundtrack"
    | "generic";
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

export const n500Tracks: readonly SoundtrackTrack[] = [
  {
    id: "start-of-a-startup",
    title: "The Start of a Startup",
    src: asset("/media/narratives/n-500/audio/01-the-start-of-a-startup.mp3"),
    duration: 67.76,
    description: "Yo también lo recuerdo con mucha nostalgia.",
  },
  {
    id: "remember-me",
    title: "Remember Me ft. Lyra Nyx",
    src: asset("/media/narratives/n-500/audio/02-remember-me.mp3"),
    duration: 274.08,
    description: "Los emprendimientos NbS buscan ser recordados.",
  },
  {
    id: "the-breaking",
    title: "The Breaking...",
    src: asset("/media/narratives/n-500/audio/03-the-breaking.mp3"),
    duration: 99,
    description: "Si Dios me permitiera volver a hacerlo, lo haría todo igual.",
  },
  {
    id: "now-we-build",
    title: "Now We Build",
    src: asset("/media/narratives/n-500/audio/04-now-we-build.mp3"),
    duration: 102.6,
    description: "Es un salto de fe. Eso y pizzas.",
  },
  {
    id: "glorious-imperfection",
    title: "Glorious Imperfection",
    src: asset("/media/narratives/n-500/audio/05-glorious-imperfection.mp3"),
    duration: 56.64,
    description: "De alguna manera estamos llegando más lejos.",
  },
  {
    id: "no-way-to-take-it-slow",
    title: "No Way to Take It Slow ft. June",
    src: asset("/media/narratives/n-500/audio/06-no-way-to-take-it-slow.mp3"),
    duration: 184.2,
    description: "Tema principal. Nada detiene este tren. Nada.",
  },
  {
    id: "you-are-invited-too",
    title: "You Are Invited, Too",
    src: asset("/media/narratives/n-500/audio/07-you-are-invited-too.mp3"),
    duration: 99.76,
    description: "Si me das la oportunidad, no te fallaré.",
  },
  {
    id: "one-step-one-dream",
    title: "One Step for a Dream",
    src: asset("/media/narratives/n-500/audio/08-one-step-one-dream.mp3"),
    duration: 137.24,
    description: "Es ahora o nunca. Sin importar lo que pase, cuenta conmigo.",
  },
  {
    id: "the-becoming",
    title: "...The Becoming",
    src: asset("/media/narratives/n-500/audio/09-the-becoming.mp3"),
    duration: 139.28,
    description: "Cinco años después, no sé si cambió el lugar o fui yo. Pero estoy en paz.",
  },
] as const;

export const vitalOceansTracks: readonly SoundtrackTrack[] = [
  {
    id: "these-nets",
    title: "These Nets Are Also Part of Me",
    src: asset("/media/narratives/vital-oceans/audio/01-these-nets-are-also-part-of-me.mp3"),
    duration: 144.24,
    description: "Si estas redes nos unen y también nos separan, lo mejor es que el océano esté de nuestro lado.",
  },
  {
    id: "seamless",
    title: "(Sea)mless ft. June",
    src: asset("/media/narratives/vital-oceans/audio/02-seamless-ft-june.mp3"),
    duration: 249.68,
    description: "Tema principal. Entender que no podemos hacer esto solos es lo más importante. Tú empujas, yo empujo.",
  },
  {
    id: "enormous-world",
    title: "The World Was Always This Enormous",
    src: asset("/media/narratives/vital-oceans/audio/03-the-world-was-always-this-enormous.mp3"),
    duration: 300,
    description: "La inmensidad de un océano de posibilidades, personas, historias y memorias.",
  },
  {
    id: "unmarked",
    title: "(Un)marked",
    src: asset("/media/narratives/vital-oceans/audio/04-unmarked.mp3"),
    duration: 193.88,
    description: "Piano y violín: lo que se escucha cuando una sola persona intenta sostenerlo todo.",
  },
  {
    id: "strings-and-tides",
    title: "Strings and Tides",
    src: asset("/media/narratives/vital-oceans/audio/05-strings-and-tides.mp3"),
    duration: 172.48,
    description: "La marea también cambia. Ahí encontramos la forma de escapar de estas redes.",
  },
  {
    id: "vital-oceans",
    title: "Vital Oceans",
    src: asset("/media/narratives/vital-oceans/audio/06-vital-oceans.mp3"),
    duration: 69.76,
    description: "Infinidad, aceptación y una promesa: proteger la vida de este océano.",
  },
  {
    id: "my-home-is-the-sea",
    title: "My Home is The Sea ft. Crimson Rush",
    src: asset("/media/narratives/vital-oceans/audio/07-my-home-is-the-sea.mp3"),
    duration: 283.88,
    description: "Un canto hacia el mar como hogar: de las comunidades, de quienes pescan y de la vida que vuelve.",
  },
  {
    id: "watermarked",
    title: "(Water)marked",
    src: asset("/media/narratives/vital-oceans/audio/08-watermarked.mp3"),
    duration: 124.88,
    description: "Las mismas notas, ahora con más instrumentos. Varias voces trabajando en una misión compartida.",
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
      { id: "bioscanner", label: "Bioscanner", layout: "t4n-bioscanner" },
      { id: "plataforma", label: "Cómo funciona Bioscanner", layout: "t4n-platform" },
      { id: "banda-sonora", label: "Banda sonora", layout: "t4n-soundtrack" },
    ],
  },
  {
    slug: "natura500",
    word: "Natura 500",
    title: "Natura 500",
    credits: "NATURATECH LAC / BID LAB",
    date: "02 / bitácora · América Latina y el Caribe",
    note: "El inicio de una startup contado desde la ruptura, la construcción y aquello en lo que termina convirtiéndose quien la crea.",
    tags: ["Emprendimiento", "Naturaleza", "Narrativa sonora"],
    kind: "Emprendimiento verde y azul",
    bg: "#D85B36",
    fg: "#FFF8E8",
    paper: "#F1E8D0",
    accent: "#D85B36",
    cover: asset("/media/narratives/n-500/images/rectangle-2.webp"),
    spreads: [
      { id: "el-inicio", label: "The Start of a Startup", layout: "n500-origin" },
      { id: "ser-recordadas", label: "Ser recordadas", layout: "n500-remember" },
      { id: "el-viaje", label: "De la ruptura a la transformación", layout: "n500-journey" },
      { id: "la-plataforma", label: "Un HBO verde y azul", layout: "n500-platform" },
      { id: "banda-sonora", label: "Banda sonora", layout: "n500-soundtrack" },
    ],
  },
  {
    slug: "oceanos-vitales",
    word: "Océanos Vitales",
    title: "Océanos Vitales",
    credits: "C MINDS / BID LAB / FUNDES",
    date: "03 / bitácora · Baja California",
    note: "Una red de comunidades, ciencia e instituciones para convertir historias del mar en Áreas Marinas Protegidas.",
    tags: ["Océano", "Comunidades", "Inteligencia artificial"],
    kind: "Conservación marina inclusiva",
    bg: "#087F8C",
    fg: "#F4F1DF",
    paper: "#EEF3E8",
    accent: "#18A9B8",
    cover: asset("/media/narratives/vital-oceans/images/portada-1.webp"),
    spreads: [
      { id: "estas-redes", label: "Estas redes que nos unen / separan", layout: "vo-nets" },
      { id: "la-inmensidad", label: "La inmensidad de este mundo", layout: "vo-world" },
      { id: "la-plataforma", label: "La plataforma", layout: "vo-platform" },
      { id: "banda-sonora", label: "Banda sonora", layout: "vo-soundtrack" },
    ],
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
