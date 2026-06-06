import { SITE } from "../config.js";

export function renderStatusBar() {
  const year = new Date().getFullYear();
  return `
    <footer class="status-bar" aria-hidden="true">
      <div class="status-bar__left">
        <span class="status-bar__dot"></span>
        <span>${SITE.location}</span>
        <span>${SITE.hireable ? "Open to work" : "Busy"}</span>
      </div>
      <div class="status-bar__right">
        <span>${SITE.handle} © ${year}</span>
      </div>
    </footer>
  `;
}

export function initStatusBar() {
  const clock = document.querySelector("[data-status-clock]");
  if (!clock) return;

  function tick() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("en-MY", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  tick();
  setInterval(tick, 30000);
}

export function initCursorGlow() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);
  document.body.classList.add("has-cursor-glow");

  window.addEventListener(
    "pointermove",
    (e) => {
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { passive: true }
  );
}
