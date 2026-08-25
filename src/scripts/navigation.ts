function setupToneNavigation() {
  const whiteLogo = document.querySelector<HTMLElement>("[data-logo-white]");
  const burger = document.querySelector<HTMLElement>("[data-menu-toggle]");
  if (!whiteLogo || !burger) return;

  let frame = 0;
  const apply = () => {
    frame = 0;
    const stack = document.elementsFromPoint(Math.round(window.innerWidth / 2), 44);
    let tone = "light";
    for (const element of stack) {
      const section = element.closest<HTMLElement>("section[data-tone]");
      if (section) {
        tone = section.dataset.tone || "light";
        break;
      }
    }
    whiteLogo.style.opacity = tone === "solid" ? "1" : "0";
    burger.dataset.tone = tone;
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(apply);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  apply();
}

function setupMenu() {
  const menu = document.querySelector<HTMLElement>("[data-menu]");
  const openButton = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const closeButton = document.querySelector<HTMLButtonElement>("[data-menu-close]");
  if (!menu || !openButton || !closeButton) return;

  const focusable = () =>
    Array.from(menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));

  const close = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    openButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    openButton.focus({ preventScroll: true });
  };

  const open = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    openButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    window.setTimeout(() => focusable()[0]?.focus({ preventScroll: true }), 80);
  };

  openButton.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));

  document.addEventListener("keydown", (event) => {
    if (!menu.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key !== "Tab") return;
    const nodes = focusable();
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
}

function initNavigation() {
  if (document.documentElement.dataset.simplixityNavigationReady) return;
  document.documentElement.dataset.simplixityNavigationReady = "true";
  setupToneNavigation();
  setupMenu();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavigation, { once: true });
} else {
  initNavigation();
}
