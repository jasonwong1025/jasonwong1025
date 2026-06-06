import { prefersReducedMotion } from "../core/reduced-motion.js";

export function initPixelCanvas(canvas) {
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let pixels = [];
  let raf = null;

  const palette = ["#c9a66b", "#6eb5ff", "#7ee787", "#e8e4dc", "#555b66"];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.floor(w / 12);
    const rows = Math.floor(h / 12);
    pixels = Array.from({ length: cols * rows }, (_, i) => ({
      x: (i % cols) * 12 + 6,
      y: Math.floor(i / cols) * 12 + 6,
      alpha: Math.random() * 0.4,
      speed: 0.002 + Math.random() * 0.004,
      color: palette[Math.floor(Math.random() * palette.length)],
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    pixels.forEach((p) => {
      const a = (Math.sin(time * p.speed + p.phase) + 1) * 0.5 * p.alpha;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = a;
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  resize();
  raf = requestAnimationFrame(draw);
  window.addEventListener("resize", resize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}
