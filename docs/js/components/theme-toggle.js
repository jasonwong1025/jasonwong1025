const STORAGE_KEY = "theme";

export function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function preferredTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* localStorage unavailable */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    const dark = theme === "dark";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  });
}

export function initThemeToggle() {
  if (!document.documentElement.dataset.theme) {
    applyTheme(preferredTheme());
  }

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(getTheme() === "dark"));
    btn.addEventListener("click", () => {
      const next = getTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      if (typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(btn, { rotate: -40, scale: 0.8 }, { rotate: 0, scale: 1, duration: 0.5, ease: "back.out(2)" });
      }
    });
  });

  // Follow OS changes only when the user hasn't explicitly chosen.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (!saved) applyTheme(e.matches ? "dark" : "light");
  });
}
