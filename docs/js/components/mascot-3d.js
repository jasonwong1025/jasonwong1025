import { SITE } from "../config.js";
import { prefersReducedMotion } from "../core/reduced-motion.js";

const MASCOT_TEMPLATE = `
  <div class="mascot" data-mascot-root>
    <div class="mascot__layer mascot__glow" data-mascot-layer="glow"></div>
    <div class="mascot__layer mascot__shadow" data-mascot-layer="shadow"></div>
    <div class="mascot__layer mascot__frame" data-mascot-layer="frame"></div>
    <div class="mascot__layer mascot__image-wrap" data-mascot-layer="image">
      <img
        class="mascot__image"
        src="${SITE.mascot}"
        alt="Chibi programmer mascot typing on a laptop"
        width="800"
        height="1000"
        loading="eager"
        decoding="async"
      />
    </div>
    <div class="mascot__layer mascot__highlight" data-mascot-layer="highlight"></div>
  </div>
`;

export function createMascotStage(variant = "hero") {
  const stage = document.createElement("div");
  stage.className = `mascot-stage mascot-stage--${variant}`;
  stage.innerHTML = MASCOT_TEMPLATE;
  return stage;
}

export function initMascot(container, options = {}) {
  if (!container) return null;

  const {
    variant = "hero",
    float = true,
    tilt = true,
    breathe = true,
  } = options;

  const reduced = prefersReducedMotion();
  let stage = container.classList.contains("mascot-stage")
    ? container
    : container.querySelector(".mascot-stage");

  if (!stage) {
    stage = createMascotStage(variant);
    container.appendChild(stage);
  } else if (!stage.querySelector("[data-mascot-root]")) {
    stage.className = `mascot-stage mascot-stage--${variant}`;
    stage.innerHTML = MASCOT_TEMPLATE;
  }

  const root = stage.querySelector("[data-mascot-root]");
  const layers = {
    glow: stage.querySelector('[data-mascot-layer="glow"]'),
    shadow: stage.querySelector('[data-mascot-layer="shadow"]'),
    image: stage.querySelector('[data-mascot-layer="image"]'),
    highlight: stage.querySelector('[data-mascot-layer="highlight"]'),
  };

  if (reduced || typeof gsap === "undefined") {
    return { stage, root, layers, destroy: () => {} };
  }

  const ctx = gsap.context(() => {
    if (float) {
      gsap.to(root, {
        y: -12,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    if (breathe) {
      gsap.to(layers.glow, {
        opacity: 0.5,
        scale: 1.08,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

  }, stage);

  let rafId = null;
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  function onPointerMove(e) {
    if (!tilt) return;
    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    targetRotY = nx * 12;
    targetRotX = -ny * 8;
  }

  function onPointerLeave() {
    targetRotX = 0;
    targetRotY = 0;
  }

  function animateTilt() {
    currentRotX += (targetRotX - currentRotX) * 0.08;
    currentRotY += (targetRotY - currentRotY) * 0.08;

    gsap.set(root, {
      rotationX: currentRotX,
      rotationY: currentRotY,
      transformPerspective: 1200,
    });

    if (layers.image) {
      gsap.set(layers.image, { z: 10 + currentRotY * 0.5 });
    }
    if (layers.highlight) {
      gsap.set(layers.highlight, {
        x: currentRotY * 2,
        y: currentRotX * 2,
      });
    }
    rafId = requestAnimationFrame(animateTilt);
  }

  if (tilt) {
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerleave", onPointerLeave);
    rafId = requestAnimationFrame(animateTilt);
  }

  return {
    stage,
    root,
    layers,
    destroy: () => {
      ctx.revert();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}

export function initAllMascots() {
  const instances = [];
  document.querySelectorAll("[data-mascot]").forEach((el) => {
    const variant = el.dataset.mascot || "hero";
    instances.push(initMascot(el, { variant, float: variant !== "compact", tilt: true }));
  });
  return instances;
}
