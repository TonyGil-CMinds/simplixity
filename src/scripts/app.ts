import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    simplixityLenis?: Lenis;
  }
}

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setupSmoothScroll() {
  if (reducedMotion.matches) return;

  window.simplixityLenis?.destroy();
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.05,
    anchors: { offset: 0 },
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.simplixityLenis = lenis;
}

function setupLoader() {
  const loader = document.querySelector<HTMLElement>("[data-loader]");
  if (!loader) return;

  if (reducedMotion.matches || sessionStorage.getItem("simplixity-loader-seen")) {
    loader.classList.add("is-hidden");
    document.dispatchEvent(new CustomEvent("simplixity:ready"));
    return;
  }

  sessionStorage.setItem("simplixity-loader-seen", "true");
  window.setTimeout(() => loader.classList.add("is-exiting"), 1750);
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    document.dispatchEvent(new CustomEvent("simplixity:ready"));
  }, 2900);
}

function setupHero() {
  const elements = gsap.utils.toArray<HTMLElement>("[data-hero-in]");
  if (!elements.length || reducedMotion.matches) return;

  gsap.set(elements, { autoAlpha: 0, y: 44 });
  const play = () => {
    gsap.to(elements, {
      autoAlpha: 1,
      y: 0,
      duration: 0.95,
      stagger: 0.11,
      ease: "power4.out",
      overwrite: false,
    });
  };

  const loader = document.querySelector("[data-loader]:not(.is-hidden)");
  if (loader) document.addEventListener("simplixity:ready", play, { once: true });
  else play();
}

function setupHeroSequence() {
  const sequence = document.querySelector<HTMLElement>("[data-hero-sequence]");
  const stage = sequence?.querySelector<HTMLElement>("[data-hero-stage]");
  const leftCard = sequence?.querySelector<HTMLElement>('[data-hero-side="left"]');
  const rightCard = sequence?.querySelector<HTMLElement>('[data-hero-side="right"]');
  const mainCard = sequence?.querySelector<HTMLElement>("[data-hero-main]");
  const cardInner = sequence?.querySelector<HTMLElement>("[data-hero-card-inner]");
  const heroWord = sequence?.querySelector<HTMLElement>("[data-hero-word]");
  const heroCopy = sequence?.querySelector<HTMLElement>("[data-hero-copy]");
  const caseCard = sequence?.querySelector<HTMLElement>("[data-hero-case]");
  const reel = sequence?.querySelector<HTMLVideoElement>("[data-hero-reel]");

  if (!sequence || !stage || !leftCard || !rightCard || !mainCard || !cardInner || !heroWord || !heroCopy || !caseCard || !reel) return;

  reel.muted = true;
  if (reducedMotion.matches) {
    reel.pause();
    return;
  }

  let reelIsActive = false;
  const setReelActive = (active: boolean) => {
    if (active === reelIsActive) return;
    reelIsActive = active;
    if (active) {
      void reel.play().catch(() => undefined);
      return;
    }
    reel.pause();
    if (reel.readyState >= 1) reel.currentTime = 0;
  };

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: sequence,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.85,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const reelVisible = self.progress >= 0.52 && self.progress < 0.995;
        setReelActive(reelVisible);
        sequence.dataset.tone = self.progress >= 0.42 ? "solid" : "light";
      },
      onLeave: () => setReelActive(false),
      onLeaveBack: () => setReelActive(false),
    },
  });

  timeline
    .to(leftCard, { xPercent: 92, scale: 0.94, duration: 0.34 }, 0)
    .to(rightCard, { xPercent: -92, scale: 0.94, duration: 0.34 }, 0)
    .to([leftCard, rightCard], { autoAlpha: 0.12, duration: 0.2 }, 0.3)
    .to(heroCopy, { xPercent: -48, autoAlpha: 0.08, duration: 0.4 }, 0.16)
    .to(caseCard, { xPercent: 55, autoAlpha: 0.08, duration: 0.4 }, 0.16)
    .to(heroWord, { yPercent: -34, autoAlpha: 0.16, duration: 0.42 }, 0.18)
    .to(stage, { backgroundColor: "#ff4fa3", duration: 0.24 }, 0.34)
    .to(
      mainCard,
      {
        scale: () => (window.innerWidth < 768 ? 1.08 : 1.18),
        yPercent: () => (window.innerWidth < 768 ? -2 : -4),
        duration: 0.3,
        ease: "power4.inOut",
      },
      0.4,
    )
    .to(cardInner, { rotationY: -180, duration: 0.2, ease: "power3.inOut" }, 0.4);
}

function setupScrollMotion() {
  if (reducedMotion.matches) return;

  gsap.utils.toArray<HTMLElement>("[data-title-reveal]").forEach((element) => {
    gsap.from(element, {
      autoAlpha: 0,
      y: 56,
      duration: 0.95,
      ease: "power4.out",
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        once: true,
      },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
    const delay = Number(element.dataset.reveal || 0) * 0.1;
    gsap.from(element, {
      autoAlpha: 0,
      y: 42,
      duration: 0.8,
      delay,
      ease: "power4.out",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        once: true,
      },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
    const amount = Number(element.dataset.parallax || 8);
    gsap.fromTo(
      element,
      { yPercent: amount * -0.5 },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: {
          trigger: element.closest("section") || element,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      },
    );
  });
}

function setupToneNavigation() {
  const whiteLogo = document.querySelector<HTMLElement>("[data-logo-white]");
  const burger = document.querySelector<HTMLElement>("[data-menu-toggle]");
  if (!whiteLogo || !burger) return;

  const apply = () => {
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

  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", apply);
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
    window.simplixityLenis?.start();
    openButton.focus({ preventScroll: true });
  };

  const open = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    openButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    window.simplixityLenis?.stop();
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

function init() {
  if (document.documentElement.dataset.simplixityReady) return;
  document.documentElement.dataset.simplixityReady = "true";
  setupSmoothScroll();
  setupLoader();
  setupHero();
  setupHeroSequence();
  setupScrollMotion();
  setupToneNavigation();
  setupMenu();
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
