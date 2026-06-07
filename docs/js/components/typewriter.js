function reserveTypewriterSpace(el, phrases) {
  const longest = phrases.reduce((a, b) => (a.length >= b.length ? a : b));
  const probe = document.createElement("span");
  probe.textContent = longest;
  probe.className = el.className;
  probe.setAttribute("aria-hidden", "true");
  Object.assign(probe.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  });

  const host = el.parentElement || document.body;
  host.appendChild(probe);
  el.style.minWidth = `${probe.offsetWidth}px`;
  host.removeChild(probe);
}

export function initTypewriter(selector, phrases, options = {}) {
  const el = document.querySelector(selector);
  if (!el || !phrases?.length) return;

  const { speed = 55, pause = 2200, reserveSpace = true } = options;

  el.style.display = "inline-block";
  el.style.verticalAlign = "top";
  el.style.whiteSpace = "nowrap";

  if (reserveSpace) reserveTypewriterSpace(el, phrases);

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(tick, deleting ? speed / 2 : speed);
  }

  tick();
}
