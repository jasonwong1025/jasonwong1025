import { prefersReducedMotion } from "../core/reduced-motion.js";
import { clearHiddenStyles, ensureVisible } from "./hero.js";

export function runIntro(onComplete) {
  document.body.classList.remove("is-loading");
  clearHiddenStyles();

  const intro = document.querySelector("[data-intro]");
  if (!intro || prefersReducedMotion() || typeof gsap === "undefined") {
    ensureVisible();
    onComplete?.();
    return;
  }

  const name = intro.querySelector("[data-intro-name]");
  const tag = intro.querySelector("[data-intro-tag]");
  const bar = intro.querySelector("[data-intro-bar]");

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      ensureVisible();
      onComplete?.();
    },
  });

  if (name) {
    tl.from(name, { y: 28, opacity: 0, filter: "blur(8px)", duration: 0.7 });
  }
  if (bar) {
    tl.fromTo(bar, { width: 0 }, { width: 160, duration: 0.55, ease: "power2.inOut" }, "-=0.25");
  }
  if (tag) {
    tl.from(tag, { y: 14, opacity: 0, duration: 0.5 }, "-=0.3");
  }

  tl.to({}, { duration: 0.35 }).to(intro, {
    yPercent: -100,
    duration: 0.85,
    ease: "power4.inOut",
  });
}
