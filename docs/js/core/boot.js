import { GSAP_CDN } from "../config.js";
import { prefersReducedMotion } from "./reduced-motion.js";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function loadGSAP() {
  await loadScript(GSAP_CDN.gsap);
  await loadScript(GSAP_CDN.scrollTrigger);
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });

  if (prefersReducedMotion()) {
    gsap.globalTimeline.timeScale(1000);
    ScrollTrigger.config({ limitCallbacks: true });
  }

  return gsap;
}

export function waitForFonts() {
  if (document.fonts?.ready) {
    return document.fonts.ready;
  }
  return Promise.resolve();
}
