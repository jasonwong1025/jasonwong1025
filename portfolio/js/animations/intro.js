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

  const code = intro.querySelector("[data-intro-code]");
  const bar = intro.querySelector("[data-intro-bar]");
  const text = code?.dataset.introCode || "boot.init()";

  if (code) code.textContent = text;

  const tl = gsap.timeline({
    onComplete: () => {
      ensureVisible();
      onComplete?.();
    },
  });

  tl.fromTo(bar, { width: 0 }, { width: 120, duration: 0.5, ease: "power2.inOut" })
    .to({}, { duration: 0.3 })
    .to(intro, { yPercent: -100, duration: 0.8, ease: "power4.inOut" });
}
