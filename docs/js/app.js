import { loadGSAP, waitForFonts } from "./core/boot.js";
import { renderNav, initNav } from "./components/nav.js";
import { renderStatusBar, initCursorGlow } from "./components/status-bar.js";
import { initAllMascots } from "./components/mascot-3d.js";
import { initTypewriter } from "./components/typewriter.js";
import { initPixelCanvas } from "./components/pixel-canvas.js";
import { runIntro } from "./animations/intro.js";
import { initHero, initMarquees, initHomeSections, ensureVisible, clearHiddenStyles } from "./animations/hero.js";
import {
  initScrollReveal,
  initPageHead,
  initWorkHover,
  initContactLinks,
} from "./animations/scroll-reveal.js";
import { getFeaturedProjects, PROJECTS } from "./data/projects.js";
import { SKILLS, SKILLS_FLAT, TIMELINE, VALUES } from "./data/skills.js";

const PAGE = document.body.dataset.page || "home";

function mountChrome() {
  const navSlot = document.querySelector("[data-nav-slot]");
  const statusSlot = document.querySelector("[data-status-slot]");
  if (navSlot) navSlot.innerHTML = renderNav(PAGE);
  if (statusSlot) statusSlot.innerHTML = renderStatusBar();
  initNav(PAGE);
}

function renderFeaturedProjects() {
  const container = document.querySelector("[data-featured-projects]");
  if (!container) return;

  container.innerHTML = getFeaturedProjects()
    .map(
      (p, i) => `
      <a class="featured__row" href="${p.links.repo}" target="_blank" rel="noopener noreferrer" data-home-reveal>
        <span class="featured__index">${String(i + 1).padStart(2, "0")}</span>
        <div class="featured__body">
          <h3 class="featured__name">${p.name}</h3>
          <p class="featured__desc">${p.description}</p>
          <div class="featured__tags">
            ${p.topics.slice(0, 4).map((t) => `<span class="featured__tag">${t}</span>`).join("")}
          </div>
        </div>
        <span class="featured__arrow" aria-hidden="true">↗</span>
      </a>
    `
    )
    .join("");
}

function renderSkillsMarquee() {
  const track = document.querySelector("[data-skills-marquee]");
  if (!track) return;

  const items = [...SKILLS_FLAT, ...SKILLS_FLAT];
  track.innerHTML = items
    .map(
      (skill) =>
        `<span class="marquee__item">${skill}<span>·</span></span>`
    )
    .join("");
}

function renderWorkList() {
  const container = document.querySelector("[data-work-list]");
  if (!container) return;

  container.innerHTML = PROJECTS.map(
    (p, i) => `
    <article class="work-item" data-reveal data-project-lang="${p.language.toLowerCase()}">
      <div class="work-item__num">${String(i + 1).padStart(2, "0")}</div>
      <div class="work-item__main">
        <div class="work-item__header">
          <h2 class="work-item__title">${p.name}</h2>
          <span class="work-item__year">${p.year}</span>
        </div>
        <p class="work-item__desc">${p.description}</p>
        <div class="work-item__meta">
          <span class="work-item__lang">${p.language}</span>
          ${p.stars ? `<span class="work-item__stars">★ ${p.stars}</span>` : ""}
        </div>
      </div>
      <div class="work-item__links">
        <a class="work-item__link" href="${p.links.repo}" target="_blank" rel="noopener noreferrer">Repository ↗</a>
        ${p.links.live ? `<a class="work-item__link" href="${p.links.live}" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>` : ""}
      </div>
    </article>
  `
  ).join("");
}

function initWorkFilter() {
  const filter = document.querySelector("[data-work-filter]");
  if (!filter) return;

  const buttons = filter.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll("[data-project-lang]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const lang = btn.dataset.filter;

      items.forEach((item) => {
        const show = lang === "all" || item.dataset.projectLang === lang.toLowerCase();
        gsap.to(item, {
          opacity: show ? 1 : 0.15,
          duration: 0.3,
          pointerEvents: show ? "auto" : "none",
        });
      });
    });
  });
}

function renderAboutTimeline() {
  const container = document.querySelector("[data-timeline]");
  if (!container) return;

  container.innerHTML = TIMELINE.map(
    (item) => `
    <div class="timeline__item" data-reveal>
      <div class="timeline__year">${item.year}</div>
      <h3 class="timeline__title">${item.title}</h3>
      <p class="timeline__desc">${item.description}</p>
    </div>
  `
  ).join("");
}

function renderValues() {
  const container = document.querySelector("[data-values]");
  if (!container) return;

  container.innerHTML = VALUES.map(
    (v) => `
    <div class="values-list__item" data-reveal>
      <div class="values-list__key">${v.key}</div>
      <div class="values-list__val">${v.value}</div>
    </div>
  `
  ).join("");
}

function renderToolGrid() {
  const container = document.querySelector("[data-tool-grid]");
  if (!container) return;

  container.innerHTML = SKILLS_FLAT.map(
    (tool) => `<span class="tool-grid__item" data-reveal>${tool}</span>`
  ).join("");
}

function renderSkillsGrid() {
  const container = document.querySelector("[data-skills-grid]");
  if (!container) return;

  const groups = [
    { label: "Languages", items: SKILLS.languages },
    { label: "Frontend", items: SKILLS.frontend },
    { label: "Backend", items: SKILLS.backend },
    { label: "Data", items: SKILLS.data },
    { label: "Tools", items: SKILLS.tools },
  ];

  container.innerHTML = groups
    .map(
      (g) => `
      <div class="skills-block__cell" data-reveal>
        <div class="skills-block__label">${g.label}</div>
        <ul class="skills-block__list">
          ${g.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `
    )
    .join("");
}

async function boot() {
  mountChrome();
  renderFeaturedProjects();
  renderWorkList();
  renderAboutTimeline();
  renderValues();
  renderToolGrid();
  renderSkillsMarquee();
  renderSkillsGrid();

  // Show content immediately — never wait for GSAP to see the page
  clearHiddenStyles();

  try {
    await waitForFonts();
    await loadGSAP();

    initAllMascots();
    initCursorGlow();
    initPixelCanvas(document.querySelector("[data-pixel-canvas]"));

    initTypewriter("[data-typewriter]", [
      "building full-stack projects",
      "exploring languages & tools",
      "learning new techniques",
      "Software Engineering @ APU",
    ]);

    runIntro(() => {
      if (PAGE === "home") {
        initHero();
        initHomeSections();
      }
      initPageHead();
      initMarquees();
      initScrollReveal();
      initWorkHover();
      initWorkFilter();
      initContactLinks();
      ScrollTrigger.refresh();
    });

    // Safety: if anything still hidden after 2s, force show
    setTimeout(ensureVisible, 2000);
  } catch (err) {
    console.error("Portfolio boot failed:", err);
    ensureVisible();
  }
}

boot();
