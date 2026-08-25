import { asset } from "../lib/assets";

type PlaylistEntry = {
  src: string;
  title: string;
  artist: string;
};

type AudioRuntime = {
  audio: HTMLAudioElement;
  activeSrc: string;
  activeTitle: string;
  activeArtist: string;
  playlist: PlaylistEntry[];
  playlistIndex: number;
  abortController?: AbortController;
  observer?: MutationObserver;
};

declare global {
  interface Window {
    simplixityAudio?: HTMLAudioElement;
    simplixityAudioRuntime?: AudioRuntime;
  }
}

export {};

const previousRuntime = window.simplixityAudioRuntime;
previousRuntime?.abortController?.abort();
previousRuntime?.observer?.disconnect();

const audio = previousRuntime?.audio || window.simplixityAudio || new Audio();
const runtime: AudioRuntime = previousRuntime || {
  audio,
  activeSrc: audio.currentSrc || "",
  activeTitle: "",
  activeArtist: "",
  playlist: [],
  playlistIndex: -1,
};

runtime.abortController = new AbortController();
window.simplixityAudio = audio;
window.simplixityAudioRuntime = runtime;
audio.preload = "metadata";

const signal = runtime.abortController.signal;
const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

const absoluteUrl = (src: string) => new URL(src, window.location.href).href;
const roots = () => Array.from(document.querySelectorAll<HTMLElement>("[data-audio-player]"));
const boundToggles = new WeakSet<HTMLElement>();

function syncControls() {
  const currentUrl = runtime.activeSrc ? absoluteUrl(runtime.activeSrc) : "";
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  const progress = duration > 0 ? (audio.currentTime / duration) * 1000 : 0;

  roots().forEach((root) => {
    const src = root.dataset.audioSrc || "";
    const isActive = Boolean(src) && absoluteUrl(src) === currentUrl;
    const isPlaying = isActive && !audio.paused;
    root.dataset.playing = String(isPlaying);
    root.style.setProperty("--audio-progress", `${isActive ? progress / 10 : 0}%`);

    const toggle = root.matches("[data-audio-toggle]")
      ? root
      : root.querySelector<HTMLElement>("[data-audio-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(isPlaying));
      toggle.setAttribute("aria-label", `${isPlaying ? "Pausar" : "Reproducir"} ${root.dataset.audioTitle || "pista"}`);
    }

    const range = root.querySelector<HTMLInputElement>("[data-audio-progress]");
    if (range) range.value = isActive ? String(progress) : "0";

    const current = root.querySelector<HTMLElement>("[data-audio-current]");
    if (current) current.textContent = isActive ? formatTime(audio.currentTime) : "0:00";

    const total = root.querySelector<HTMLElement>("[data-audio-duration]");
    if (total && isActive && duration) total.textContent = formatTime(duration);
  });
}

function readPlaylist(root: HTMLElement) {
  const serialized = root.dataset.audioPlaylist;
  const index = Number(root.dataset.audioPlaylistIndex);
  if (!serialized || !Number.isInteger(index)) return null;

  try {
    const playlist = JSON.parse(serialized) as PlaylistEntry[];
    if (!Array.isArray(playlist) || !playlist[index]) return null;
    return { playlist, index };
  } catch {
    return null;
  }
}

function updateMediaSession(entry: PlaylistEntry) {
  if (!("mediaSession" in navigator) || !("MediaMetadata" in window)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: entry.title,
    artist: entry.artist,
    album: "Tech for Nature México, Banda Sonora Original",
    artwork: [{ src: asset("/media/narratives/tech-for-nature/images/soundtrack-cover.webp"), sizes: "1200x1200", type: "image/webp" }],
  });
}

async function startEntry(entry: PlaylistEntry) {
  audio.pause();
  runtime.activeSrc = entry.src;
  runtime.activeTitle = entry.title;
  runtime.activeArtist = entry.artist;
  audio.src = entry.src;
  audio.currentTime = 0;
  updateMediaSession(entry);

  try {
    await audio.play();
  } catch {
    syncControls();
  }
}

async function toggle(root: HTMLElement) {
  const src = root.dataset.audioSrc;
  if (!src) return;
  const resolved = absoluteUrl(src);
  const playlistState = readPlaylist(root);

  if (playlistState) {
    runtime.playlist = playlistState.playlist;
    runtime.playlistIndex = playlistState.index;
  }

  if (runtime.activeSrc && absoluteUrl(runtime.activeSrc) === resolved) {
    if (audio.paused) {
      try {
        await audio.play();
        root.removeAttribute("data-audio-error");
      } catch (error) {
        root.dataset.audioError = error instanceof Error ? `${error.name}: ${error.message}` : "No se pudo reproducir";
      }
    } else {
      audio.pause();
    }
    syncControls();
    return;
  }

  if (!playlistState) {
    runtime.playlist = [];
    runtime.playlistIndex = -1;
  }

  await startEntry({
    src,
    title: root.dataset.audioTitle || "Banda sonora",
    artist: root.dataset.audioArtist || "Tech4Nature",
  });
  root.removeAttribute("data-audio-error");
  syncControls();
}

function bindControls() {
  roots().forEach((root) => {
    const control = root.matches("[data-audio-toggle]")
      ? root
      : root.querySelector<HTMLElement>("[data-audio-toggle]");
    if (!control || boundToggles.has(control)) return;
    boundToggles.add(control);
    control.addEventListener("click", () => { void toggle(root); }, { signal });
  });
  syncControls();
}

document.addEventListener("input", (event) => {
  const range = (event.target as Element | null)?.closest<HTMLInputElement>("[data-audio-progress]");
  if (!range) return;
  const root = range.closest<HTMLElement>("[data-audio-player]");
  const src = root?.dataset.audioSrc;
  if (!root || !src) return;
  const resolved = absoluteUrl(src);
  if (!runtime.activeSrc || absoluteUrl(runtime.activeSrc) !== resolved) {
    runtime.activeSrc = src;
    runtime.activeTitle = root.dataset.audioTitle || "Banda sonora";
    runtime.activeArtist = root.dataset.audioArtist || "Tech4Nature";
    runtime.playlist = [];
    runtime.playlistIndex = -1;
    audio.src = src;
  }
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(range.value) / 1000) * audio.duration;
  }
  syncControls();
}, { signal });

audio.addEventListener("play", syncControls, { signal });
audio.addEventListener("pause", syncControls, { signal });
audio.addEventListener("timeupdate", syncControls, { signal });
audio.addEventListener("durationchange", syncControls, { signal });
audio.addEventListener("ended", () => {
  const nextIndex = runtime.playlistIndex + 1;
  const nextTrack = runtime.playlist[nextIndex];
  if (!nextTrack) {
    syncControls();
    return;
  }
  runtime.playlistIndex = nextIndex;
  void startEntry(nextTrack).then(syncControls);
}, { signal });

window.addEventListener("simplixity:projectchange", (event) => {
  const projectIndex = (event as CustomEvent<{ projectIndex: number }>).detail.projectIndex;
  if (projectIndex !== 0 && !audio.paused) audio.pause();
}, { signal });

window.addEventListener("simplixity:pagesmounted", bindControls, { signal });

runtime.observer = new MutationObserver((records) => {
  const addedPlayer = records.some((record) =>
    Array.from(record.addedNodes).some((node) =>
      node instanceof HTMLElement
      && (node.matches("[data-audio-player]") || Boolean(node.querySelector("[data-audio-player]"))),
    ),
  );
  if (addedPlayer) bindControls();
});
runtime.observer.observe(document.body, { childList: true, subtree: true });
bindControls();
