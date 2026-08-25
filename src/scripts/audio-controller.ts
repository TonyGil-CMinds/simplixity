import { asset } from "../lib/assets";

declare global {
  interface Window {
    simplixityAudio?: HTMLAudioElement;
  }
}

export {};

const audio = window.simplixityAudio || new Audio();
window.simplixityAudio = audio;
audio.preload = "metadata";

let activeSrc = audio.currentSrc || "";
let activeTitle = "";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

const absoluteUrl = (src: string) => new URL(src, window.location.href).href;

const roots = () => Array.from(document.querySelectorAll<HTMLElement>("[data-audio-player]"));
const boundToggles = new WeakSet<HTMLElement>();

function syncControls() {
  const currentUrl = activeSrc ? absoluteUrl(activeSrc) : "";
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

function bindControls() {
  roots().forEach((root) => {
    const control = root.matches("[data-audio-toggle]")
      ? root
      : root.querySelector<HTMLElement>("[data-audio-toggle]");
    if (!control || boundToggles.has(control)) return;
    boundToggles.add(control);
    control.addEventListener("click", () => { void toggle(root); });
  });
  syncControls();
}

async function toggle(root: HTMLElement) {
  const src = root.dataset.audioSrc;
  if (!src) return;
  const resolved = absoluteUrl(src);

  if (activeSrc && absoluteUrl(activeSrc) === resolved) {
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

  audio.pause();
  activeSrc = src;
  activeTitle = root.dataset.audioTitle || "Banda sonora";
  audio.src = src;
  audio.currentTime = 0;

  if ("mediaSession" in navigator && "MediaMetadata" in window) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: activeTitle,
      artist: root.dataset.audioArtist || "Tech4Nature",
      album: "Tech for Nature México, Banda Sonora Original",
      artwork: [{ src: asset("/media/narratives/tech-for-nature/images/soundtrack-cover.webp"), sizes: "1200x1200", type: "image/webp" }],
    });
  }

  try {
    await audio.play();
    root.removeAttribute("data-audio-error");
  } catch (error) {
    root.dataset.audioError = error instanceof Error ? `${error.name}: ${error.message}` : "No se pudo reproducir";
  }
  syncControls();
}

document.addEventListener("input", (event) => {
  const range = (event.target as Element | null)?.closest<HTMLInputElement>("[data-audio-progress]");
  if (!range) return;
  const root = range.closest<HTMLElement>("[data-audio-player]");
  const src = root?.dataset.audioSrc;
  if (!root || !src) return;
  const resolved = absoluteUrl(src);
  if (!activeSrc || absoluteUrl(activeSrc) !== resolved) {
    activeSrc = src;
    activeTitle = root.dataset.audioTitle || "Banda sonora";
    audio.src = src;
  }
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(range.value) / 1000) * audio.duration;
  }
  syncControls();
});

audio.addEventListener("play", syncControls);
audio.addEventListener("pause", syncControls);
audio.addEventListener("timeupdate", syncControls);
audio.addEventListener("durationchange", syncControls);
audio.addEventListener("ended", syncControls);

window.addEventListener("simplixity:projectchange", (event) => {
  const projectIndex = (event as CustomEvent<{ projectIndex: number }>).detail.projectIndex;
  if (projectIndex !== 0 && !audio.paused) audio.pause();
});

window.addEventListener("simplixity:pagesmounted", bindControls);

new MutationObserver((records) => {
  const addedPlayer = records.some((record) =>
    Array.from(record.addedNodes).some((node) =>
      node instanceof HTMLElement
      && (node.matches("[data-audio-player]") || Boolean(node.querySelector("[data-audio-player]"))),
    ),
  );
  if (addedPlayer) bindControls();
}).observe(document.body, { childList: true, subtree: true });
bindControls();
