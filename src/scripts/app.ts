import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  let reelIsLoaded = false;
  let reelIsActive = false;
  const loadReel = () => {
    if (reelIsLoaded) return;
    const src = reel.dataset.src;
    if (!src) return;
    reelIsLoaded = true;
    reel.src = src;
    reel.load();
  };

  const setReelActive = (active: boolean) => {
    if (active === reelIsActive) return;
    reelIsActive = active;
    if (active) {
      loadReel();
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
        if (self.progress >= 0.42 && self.progress < 0.995) loadReel();
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

function init() {
  if (document.documentElement.dataset.simplixityMotionReady) return;
  document.documentElement.dataset.simplixityMotionReady = "true";
  setupLoader();
  setupHero();
  setupHeroSequence();
  setupScrollMotion();
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
