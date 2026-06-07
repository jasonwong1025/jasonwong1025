import { loadGSAP, waitForFonts } from "./core/boot.js";
import { initContactForm } from "./components/contact-form.js";
import { renderCta } from "./components/cta.js";
import { renderNav, initNav } from "./components/nav.js";
import { renderStatusBar, initCursorGlow } from "./components/status-bar.js";
import { initAllMascots } from "./components/mascot-3d.js";
import { initTypewriter } from "./components/typewriter.js";
import { initPixelCanvas } from "./components/pixel-canvas.js";
import { runIntro } from "./animations/intro.js";
import { initHero, initMarquees, initHomeSections, ensureVisible, clearHiddenStyles } from "./animations/hero.js";
import { prepareHomeText, initHomeInteractions } from "./animations/home-interactions.js";
import { initScrollReveal, initPageHead, initWorkHover, initContactLinks } from "./animations/scroll-reveal.js";
import { initScrollRevealVariants, initHomeScrollTransitions } from "./animations/scroll-transitions.js";
import { initStack } from "./animations/stack.js";
import { initToolbox } from "./animations/toolbox.js";
import { getFeaturedProjects, PROJECTS } from "./data/projects.js";
import {
  CREDENTIALS,
  EDUCATION_TIMELINE,
  SKILL_CATEGORIES,
  SKILLS,
  SKILLS_FLAT,
  VALUES,
  WORK_TIMELINE,
} from "./data/skills.js";

const PAGE = document.body.dataset.page || "home";

function mountChrome() {
  const navSlot = document.querySelector("[data-nav-slot]");
  const ctaSlot = document.querySelector("[data-cta-slot]");
  const statusSlot = document.querySelector("[data-status-slot]");
  if (navSlot) navSlot.innerHTML = renderNav(PAGE);
  if (ctaSlot) ctaSlot.innerHTML = renderCta(PAGE);
  if (statusSlot) statusSlot.innerHTML = renderStatusBar();
  initNav(PAGE);
}

function renderFeaturedProjects() {
  const container = document.querySelector("[data-featured-projects]");
  if (!container) return;

  container.innerHTML = getFeaturedProjects()
    .map(
      (p, i) => `
      <a class="featured__row" href="${p.links.repo}" target="_blank" rel="noopener noreferrer">
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

function renderTimelineItems(items) {
  return items
    .map(
      (item) => `
    <div class="timeline__item" data-reveal>
      <div class="timeline__year">${item.year}</div>
      <h3 class="timeline__title">${item.title}</h3>
      <p class="timeline__desc">${item.description}</p>
    </div>
  `
    )
    .join("");
}

function renderAboutTimeline() {
  const education = document.querySelector("[data-timeline-education]");
  const work = document.querySelector("[data-timeline-work]");

  if (education) education.innerHTML = renderTimelineItems(EDUCATION_TIMELINE);
  if (work) work.innerHTML = renderTimelineItems(WORK_TIMELINE);
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

function renderCredentials() {
  const container = document.querySelector("[data-credentials]");
  if (!container) return;

  container.innerHTML = CREDENTIALS.map(
    (c) => `
    <a class="credential-card" href="${c.url}" target="_blank" rel="noopener noreferrer">
      <div class="credential-card__body">
        <div class="credential-card__meta">
          <span class="credential-card__type">${c.type} · ${c.platform}</span>
          <span class="credential-card__year">${c.year}</span>
        </div>
        <h3 class="credential-card__title">${c.title}</h3>
        <p class="credential-card__issuer">${c.issuer}</p>
        <p class="credential-card__desc">${c.description}</p>
      </div>
      <span class="credential-card__arrow" aria-hidden="true">↗</span>
    </a>
  `
  ).join("");
}

function renderToolbox() {
  const filterBar = document.querySelector("[data-toolbox-filter]");
  const grid = document.querySelector("[data-toolbox-grid]");
  if (!filterBar || !grid) return;

  const filters = [
    { id: "all", label: "All" },
    ...SKILL_CATEGORIES.map(({ id, label }) => ({ id, label })),
  ];

  filterBar.innerHTML = filters
    .map(
      ({ id, label }) =>
        `<button class="toolbox__filter${id === "all" ? " is-active" : ""}" type="button" data-filter="${id}">${label}</button>`
    )
    .join("");

  grid.innerHTML = SKILL_CATEGORIES.flatMap(({ id }) =>
    SKILLS[id].map(
      (tool) => `
      <button class="toolbox__chip" type="button" data-toolbox-chip data-category="${id}" data-reveal-item>
        <span class="toolbox__chip-dot" aria-hidden="true"></span>
        <span class="toolbox__chip-label">${tool}</span>
      </button>
    `
    )
  ).join("");
}

function renderStack() {
  const nav = document.querySelector("[data-stack-nav]");
  const bento = document.querySelector("[data-stack-bento]");
  if (!nav || !bento) return;

  const filters = [{ id: "all", label: "All" }, ...SKILL_CATEGORIES];

  nav.innerHTML = filters
    .map(
      ({ id, label }) =>
        `<button class="stack__filter${id === "all" ? " is-active" : ""}" type="button" data-stack-filter="${id}">${label}</button>`
    )
    .join("");

  bento.innerHTML = SKILL_CATEGORIES.map(({ id, label }) => {
    const count = SKILLS[id].length;
    const layoutClass = id === "languages" || id === "frontend" ? " stack__card--lg" : "";

    return `
      <article class="stack__card${layoutClass}" data-stack-card data-category="${id}" data-reveal-item>
        <div class="stack__card-head">
          <span class="stack__card-dot" aria-hidden="true"></span>
          <h3 class="stack__card-title">${label}</h3>
          <span class="stack__card-count">${count}</span>
        </div>
        <div class="stack__chips">
          ${SKILLS[id]
            .map((skill) => `<span class="stack__chip" data-stack-chip>${skill}</span>`)
            .join("")}
        </div>
      </article>
    `;
  }).join("");
}

async function boot() {
  mountChrome();
  initContactForm();
  renderFeaturedProjects();
  renderWorkList();
  renderAboutTimeline();
  renderValues();
  renderCredentials();
  renderToolbox();
  renderSkillsMarquee();
  renderStack();

  if (PAGE === "home") prepareHomeText();

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
        initHomeInteractions();
        initHomeScrollTransitions();
        initScrollRevealVariants();
      } else {
        initScrollReveal();
      }
      initPageHead();
      initMarquees();
      initWorkHover();
      initWorkFilter();
      initContactLinks();
      initToolbox();
      initStack();
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
