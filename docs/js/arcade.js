/* ========================================================================
   WONG JIA SEN — PLAYER ONE (v2)
   Playable arcade portfolio. GSAP + ScrollTrigger. Reduced-motion aware.
   ======================================================================== */

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TOUCH = window.matchMedia("(hover: none), (pointer: coarse)").matches;
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
document.documentElement.classList.add("js");
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

/* --------------------------------------------------------------- DATA */
const CARD_STATS = [["Role", "Full-Stack Eng"], ["Education", "APU"], ["Location", "KL, MY"], ["CGPA", "<b>3.63</b>"], ["Status", "<b>Available</b>"]];
const CHAR_BIO = "Motivated Software Engineering student at <b>Asia Pacific University</b> with a strong foundation in object-oriented programming, full-stack web development, and mobile engineering. Currently shipping AI features on live products at <b>Codespace AI</b> alongside degree work — passionate about clean, lasting code and always ready for the next build.";
const CHAR_SLOTS = [
  { key: "ROLE", val: "Full-Stack Engineer", detail: "Web, mobile &amp; AI — polished UI down to APIs and data.", icon: "braces" },
  { key: "EDUCATION", val: "APU · BSc SE", detail: "BSc Software Engineering (current). Diploma ICT, CGPA <b>3.63</b>.", icon: "cap" },
  { key: "CURRENT", val: "Part-time @ Codespace AI Technology", detail: "Shipping AI features on live products alongside degree work.", icon: "bolt" },
  { key: "LOCATION", val: "Kuala Lumpur", detail: "Based in KL — open to remote, freelance &amp; open-source.", icon: "globe" },
  { key: "PROJECTS", val: "3 builds shipped", detail: "Beacon, NextGen Fitness &amp; OODJ APUASC — all on GitHub.", icon: "sword" },
  { key: "EXPERIENCE", val: "Internship @ Codespace AI Technology", detail: "12-week software eng internship @ Codespace AI — continued part-time.", icon: "trophy" },
];
const CHAR_SOCIAL = new Set(["mail", "github", "linkedin"]);
const CHAR_TRAITS = [
  { label: "Clean over clever", icon: "target" },
  { label: "Ships in public", icon: "branch" },
  { label: "Systems thinker", icon: "chip" },
  { label: "Open to collab", icon: "globe" },
];
const LANGS = [
  ["🇬🇧", "English", "Fluent", 4],
  ["🇨🇳", "Mandarin", "Native", 5],
  ["🇭🇰", "Cantonese", "Conversational", 3],
  ["🇲🇾", "Malay", "Conversational", 3],
];
const SKILLS = [
  ["Languages", [["JavaScript", 85], ["TypeScript", 82], ["Python", 80], ["Java", 75], ["Dart", 72], ["PHP", 82]]],
  ["Frontend", [["React", 82], ["Tailwind CSS", 85], ["Flutter", 72], ["HTML / CSS", 90]]],
  ["Backend", [["Node.js", 78], ["Laravel", 82]]],
  ["Database", [["MySQL", 82], ["PostgreSQL", 72], ["Redis", 65]]],
  ["Tools", [["Git", 85], ["Docker", 68], ["Linux", 72], ["VS Code", 92]]],
];
const KIT_CAT = {
  Languages: { c: "#9B7BFF", ic: "bolt" },
  Frontend:  { c: "#34E1E8", ic: "layout" },
  Backend:   { c: "#5CE08A", ic: "server" },
  Database:  { c: "#FFC23C", ic: "database" },
  Tools:     { c: "#FF4FA3", ic: "terminal" },
};
const SKILL_ICONS = {
  "JavaScript": "braces", "TypeScript": "braces", "Python": "snake", "Java": "coffee",
  "Dart": "target", "PHP": "hex", "React": "atom", "Tailwind CSS": "wind", "Flutter": "phone",
  "HTML / CSS": "layout", "Node.js": "server", "Laravel": "branch", "MySQL": "database",
  "PostgreSQL": "database", "Redis": "chip", "Git": "branch", "Docker": "container",
  "Linux": "terminal", "VS Code": "editor",
};
function skillTier(lvl) {
  if (lvl >= 90) return { g: "S", cls: "kit__tier--s", label: "Master", pips: 5 };
  if (lvl >= 80) return { g: "A", cls: "kit__tier--a", label: "Advanced", pips: 4 };
  if (lvl >= 70) return { g: "B", cls: "kit__tier--b", label: "Proficient", pips: 3 };
  return { g: "C", cls: "kit__tier--c", label: "Familiar", pips: lvl >= 60 ? 2 : 1 };
}
function skillMeter(tier) {
  return `<div class="kit__meter" data-kit-meter role="img" aria-label="${tier.label} proficiency">
    ${[1, 2, 3, 4, 5].map((i) => `<span class="kit__pip${i <= tier.pips ? " on" : ""}"></span>`).join("")}
  </div>`;
}
function renderKitPanel(label, skills, cat) {
  const avg = Math.round(skills.reduce((a, [, l]) => a + l, 0) / skills.length);
  const catTier = skillTier(avg);
  return `
    <header class="kit__panel-head" style="--c:${cat.c}">
      <h3 class="kit__panel-title">${label}</h3>
      <span class="kit__panel-meta">
        <span class="kit__panel-count">${skills.length}</span>
        <span class="kit__tier ${catTier.cls}" title="${catTier.label}">${catTier.g}</span>
      </span>
    </header>
    <ul class="kit__grid">
      ${skills.map(([name, lvl]) => {
        const tier = skillTier(lvl);
        const ic = SKILL_ICONS[name] || "chip";
        return `
        <li class="kit__slot" style="--c:${cat.c}" data-skill="${name}">
          <div class="kit__slot-top">
            <span class="kit__slot-ic" data-icon="${ic}" aria-hidden="true"></span>
            <span class="kit__slot-n">${name}</span>
          </div>
          <div class="kit__slot-foot">
            <span class="kit__rank">${tier.label}</span>
            <span class="kit__tier ${tier.cls}">${tier.g}</span>
          </div>
          ${skillMeter(tier)}
        </li>`;
      }).join("")}
    </ul>`;
}

function loadout() {
  const tabs = $("[data-kit-tabs]");
  const panel = $("[data-kit-panel]");
  const combo = $("[data-kit-combo]");
  if (!tabs || !panel) return;

  const total = SKILLS.reduce((n, [, s]) => n + s.length, 0);
  if (combo) combo.textContent = `${total} skills unlocked`;

  tabs.innerHTML = SKILLS.map(([label], i) => {
    const cat = KIT_CAT[label] || { c: "#34E1E8", ic: "chip" };
    return `<button class="kit__tab${i === 0 ? " is-on" : ""}" type="button" role="tab"
      aria-selected="${i === 0}" data-kit-tab="${i}" data-blip style="--c:${cat.c}">
      <span class="kit__tab-ic" data-icon="${cat.ic}" aria-hidden="true"></span>${label}
    </button>`;
  }).join("");

  let active = 0;
  const show = (i, animateMeters = true) => {
    active = i;
    const [label, skills] = SKILLS[i];
    const cat = KIT_CAT[label] || { c: "#34E1E8", ic: "chip" };
    $$("[data-kit-tab]", tabs).forEach((t, j) => {
      const on = j === i;
      t.classList.toggle("is-on", on);
      t.setAttribute("aria-selected", String(on));
    });
    panel.innerHTML = renderKitPanel(label, skills, cat);
    panel.style.setProperty("--c", cat.c);
    paintIcons();
    if (animateMeters) animateKitMeters(panel);
    const hint = $("[data-kit-hint]");
    const arena = $("[data-kit-arena]");
    if (hint) hint.textContent = `Juggling ${label.toLowerCase()}…`;
    if (arena) {
      arena.classList.add("is-juggle");
      clearTimeout(arena._jT);
      arena._jT = setTimeout(() => arena.classList.remove("is-juggle"), 3600);
    }
    if (!REDUCED && gsap) {
      gsap.fromTo(panel, { opacity: .6, y: 10 }, { opacity: 1, y: 0, duration: .35, ease: "power2.out" });
      gsap.from(".kit__slot", { opacity: 0, y: 12, duration: .32, stagger: .04, ease: "power2.out", immediateRender: false });
    }
  };

  tabs.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-kit-tab]");
    if (!tab) return;
    const i = +tab.dataset.kitTab;
    if (i === active) return;
    show(i);
  });

  show(0, false);
  paintIcons();
}

function animateKitMeters(root) {
  if (!root) return;
  root.querySelectorAll("[data-kit-meter]").forEach((meter) => {
    const pips = meter.querySelectorAll(".kit__pip.on");
    if (REDUCED || !gsap || !pips.length) return;
    gsap.from(pips, { scaleY: 0, transformOrigin: "bottom center", duration: .22, stagger: .05, ease: "back.out(2)" });
  });
}

function kitStage() {
  const kit = $("[data-kit]");
  if (!kit) return;
  const reveal = () => kit.classList.add("is-ready");
  if (REDUCED) reveal();
  else if (gsap && ScrollTrigger) {
    ScrollTrigger.create({ trigger: kit, start: "top 86%", once: true, onEnter: reveal });
  } else reveal();
}
/** Set `img` on any entry once a real screenshot exists — the label falls back to a pixel-icon plate until then. */
const PROJECTS = [
  { id: "beacon", name: "Beacon", year: "2026", lang: "TypeScript", ic: "target", c: "#4FA6F0", img: null,
    desc: "A privacy-first focus tool — Chrome extension with a React UI for focus sessions and smart site blocking, backed by local-only analytics. No account, no cloud.",
    tags: ["TypeScript", "React", "Privacy"], repo: "https://github.com/jasonwong1025/beacon", live: "https://jasonwong1025.github.io/beacon/" },
  { id: "capstone", name: "NextGen Fitness", year: "2025", lang: "Dart · Flutter", ic: "phone", c: "#54C5F8", img: null,
    desc: "Team capstone mobile app — AI-powered fitness with personalized workout plans, meal-scan nutrition tracking, and a diet chatbot.",
    tags: ["Flutter", "Dart", "AI"], repo: "https://github.com/jasonwong1025/capstone", live: null },
  { id: "oodj", name: "OODJ APUASC", year: "2026", lang: "Java", ic: "coffee", c: "#F0862E", img: null,
    desc: "Automobile Service Centre System in Java — object-oriented coursework with a structured, layered architecture and clean separation of concerns.",
    tags: ["Java", "OOP"], repo: "https://github.com/jasonwong1025/oodj-apuasc", live: null },
];
const SHIP_INITIAL = 2;
const STAGES = [
  { n: "04", kind: "edu", date: "Feb 2026 – Present", title: "BSc (Hons) Software Engineering", org: "Asia Pacific University", status: "in-progress",
    detail: "Bachelor's degree — deepening fundamentals in algorithms, mobile engineering, and software methodology.",
    badge: "Current",
    highlights: ["Data Structures & Algorithms", "System Development Methodologies", "Mobile App Engineering", "Building alongside industry work"] },
  { n: "03", kind: "work", date: "Oct 2025 – Present", title: "Software Engineer · Part-time", org: "Codespace AI Technology", status: "active",
    detail: "Part-time role alongside degree studies — still shipping production code on AI products.",
    badge: null,
    highlights: ["AI features on live products", "Full-stack implementation", "Production deployments", "Balanced with university workload"] },
  { n: "02", kind: "work", date: "Sep – Oct 2025", title: "Software Engineering Intern", org: "Codespace AI Technology", status: "cleared",
    detail: "12-week industry internship building AI features on live products alongside senior engineers.",
    badge: "12 weeks",
    highlights: ["Shipped AI-powered product features", "Worked across frontend and backend stacks", "Collaborated in a real team workflow", "Continued part-time after internship"] },
  { n: "01", kind: "edu", date: "Aug 2023 – Oct 2025", title: "Diploma in ICT — Software Engineering", org: "Asia Pacific University", status: "cleared",
    detail: "Diploma in Information & Communication Technology with a software engineering specialism. First Class Honours track.",
    badge: "CGPA 3.63",
    highlights: ["Programming with Python & Java OOP", "Database design & system analysis", "Responsive web & mobile coursework", "Graduated Oct 2025"] },
];
const ACH = [
  { ico: "trophy", t: "Google IT Automation w/ Python", d: 'Coursera · 2025 · <a href="https://coursera.org/share/f97cdd6da5f886f4dcfb544ec2e22c84" target="_blank" rel="noopener noreferrer">View ↗</a>' },
  { ico: "star", t: "High Score: CGPA 3.63", d: "Diploma in ICT, APU" },
  { ico: "sword", t: "Internship Cleared", d: "Software eng @ Codespace AI" },
  { ico: "globe", t: "Builds in Public", d: "Open-source on GitHub" },
];
const CONTACTS = [
  ["mail", "Email", "jiasen27826@gmail.com", "mailto:jiasen27826@gmail.com"],
  ["github", "GitHub", "@jasonwong1025", "https://github.com/jasonwong1025"],
  ["linkedin", "LinkedIn", "wong-jia-sen", "https://www.linkedin.com/in/wong-jia-sen/"],
  ["instagram", "Instagram", "@wjs.1025", "https://www.instagram.com/wjs.1025/"],
  ["globe", "Website", "jasonwong.top", "https://jasonwong.top"],
];
const TICKER = ["NOW PLAYING: FULL-STACK WEB", "MOBILE APPS", "AI-POWERED SOFTWARE", "BUILT IN PUBLIC", "OPEN TO WORK"];
const TAGLINE = "building full-stack, mobile & AI software";

/* --------------------------------------------------------------- PIXEL ICONS */
const BITS = {
  coin: ["00111100","01111110","11011011","11011011","11011011","11011011","01111110","00111100"],
  bug:  ["01000010","00100100","01111110","11111111","11111111","01111110","10100101","00000000"],
  chip: ["00100100","11111111","10111101","10111101","10111101","11111111","00100100","00000000"],
  cap:  ["00011000","00111100","01111110","11111111","00111100","00100100","00100110","00000000"],
  sword:["00000011","00000110","00001100","00011000","00110000","01100000","11100000","11000000"],
  trophy:["11111111","01111110","01111110","00111100","00011000","00111100","01111110","00000000"],
  star: ["00011000","00011000","11111111","01111110","00111100","01100110","01000010","00000000"],
  mail: ["00000000","11111111","11011011","10111101","10011001","11111111","00000000","00000000"],
  github:["10000001","11000011","11111111","10111101","11111111","11111111","01111110","00100100"],
  linkedin:["11111111","10011101","11011101","10011101","10011101","10011101","11111111","00000000"],
  instagram:["11111111","10000001","10111101","10100101","10111101","10000001","11111111","00010000"],
  globe:["00111100","01011010","11011011","11111111","11011011","11011011","01011010","00111100"],
  bolt:["00001100","00011000","00110000","01111100","00001100","00011000","00110000","01100000"],
  braces:["00110110","01100011","01100011","11000011","01100011","01100011","00110110","00000000"],
  snake:["01111000","01000000","01011100","00000100","01111100","01000000","01111100","00000000"],
  coffee:["00000000","01111100","01111110","01111101","01111101","01111110","00111100","00000000"],
  server:["11111110","10100010","11111110","00000000","11111110","10100010","11111110","00000000"],
  target:["00111100","01000010","10011001","10100101","10100101","10011001","01000010","00111100"],
  atom:["00011000","01100110","11000011","10111101","10111101","11000011","01100110","00011000"],
  phone:["00111100","01000010","01011010","01011010","01011010","01011010","01000010","00111100"],
  wind:["00000000","00111100","01000010","00000100","00011000","00100000","00111100","00000000"],
  layout:["11111111","10101011","11111111","10000001","10000001","10000001","11111111","00000000"],
  hex:["00011000","00111100","01111110","11111111","11111111","01111110","00111100","00011000"],
  database:["01111100","11111110","10000010","11111110","10000010","11111110","01111100","00000000"],
  branch:["01100000","01100000","01100000","01111100","01000110","01000110","00000110","00000000"],
  container:["00100100","01111110","01111110","00000000","01111110","01111110","01111110","00000000"],
  terminal:["11111111","10000001","10110001","10001001","10110001","10000001","11111111","00000000"],
  editor:["11111111","10001101","10011001","10110001","10011001","10001101","11111111","00000000"],
};
function px(name, cls) {
  const rows = BITS[name]; if (!rows) return "";
  const w = rows[0].length, h = rows.length;
  let r = "";
  rows.forEach((row, y) => [...row].forEach((c, x) => { if (c === "1") r += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }));
  return `<svg class="pxi ${cls || ""}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}
function paintIcons() { $$("[data-icon]").forEach((el) => { el.innerHTML = px(el.dataset.icon); }); }

/* --------------------------------------------------------------- COINS */
const Coins = (() => {
  let n = 0; const el = $("[data-coins]"); const wrap = $("[data-coins-wrap]");
  return {
    add(x) { n += x; if (el) el.textContent = n; if (wrap) { wrap.classList.remove("pop"); void wrap.offsetWidth; wrap.classList.add("pop"); } },
    get() { return n; },
  };
})();

/* --------------------------------------------------------------- INJECT */
function inject() {
  const cs = $("[data-card-stats]");
  if (cs) cs.innerHTML = CARD_STATS.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

  const lg = $("[data-langs]");
  if (lg) lg.innerHTML = LANGS.map(([flag, name, lvl, pips]) => `
    <div class="about__lang" tabindex="0">
      <span class="about__lang-flag" aria-hidden="true">${flag}</span>
      <div class="about__lang-body">
        <span class="about__lang-name">${name}</span>
        <span class="about__lang-lvl">${lvl}</span>
      </div>
      <div class="about__lang-pips" aria-label="${lvl}">${Array.from({ length: 5 }, (_, i) => `<span class="about__lang-pip${i < pips ? " on" : ""}"></span>`).join("")}</div>
    </div>`).join("");

  buildCharacter();

  const sh = $("[data-ships]");
  if (sh) sh.innerHTML = PROJECTS.map((p, i) => {
    const live = p.live ? `<a class="btn btn--gold" href="${p.live}" target="_blank" rel="noopener noreferrer" data-blip>▶ Live demo</a>` : "";
    const cls = i >= SHIP_INITIAL ? "ship is-collapsed" : "ship";
    const label = p.img
      ? `<img class="ship__label-img" src="${p.img}" alt="${p.name} preview" loading="lazy" decoding="async" />`
      : `<span class="ship__label-ico" aria-hidden="true">${px(p.ic)}</span>`;
    const teeth = Array.from({ length: 10 }, (_, t) => `<span style="--i:${t}"></span>`).join("");
    return `<article class="${cls}" style="--c:${p.c}">
      <div class="ship__label">
        ${label}
        <span class="ship__screw ship__screw--l" aria-hidden="true"></span>
        <span class="ship__screw ship__screw--r" aria-hidden="true"></span>
      </div>
      <div class="ship__plate">
        <h3 class="ship__name">${p.name}</h3>
        <span class="ship__meta">${p.year} · ${p.lang}</span>
        <p class="ship__desc">${p.desc}</p>
        <div class="ship__tags">${p.tags.map((t) => `<span class="ship__tag">${t}</span>`).join("")}</div>
        <div class="ship__foot">
          <a class="btn btn--cyan" href="${p.repo}" target="_blank" rel="noopener noreferrer" data-blip>Code ↗</a>${live}
        </div>
      </div>
      <div class="ship__teeth" aria-hidden="true">${teeth}</div>
    </article>`;
  }).join("");

  const ac = $("[data-achievements]");
  if (ac) ac.innerHTML = ACH.map((a) => `<div class="trophy" data-reveal>
    <span class="trophy__ico">${px(a.ico)}</span><div><p class="trophy__t">${a.t}</p><p class="trophy__d">${a.d}</p></div></div>`).join("");

  const cl = $("[data-contact-links]");
  if (cl) cl.innerHTML = CONTACTS.map(([ic, k, v, href]) => {
    const ext = href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a class="chan__row" href="${href}"${ext} data-blip><span class="chan__sel">▶</span><span class="chan__ico">${px(ic)}</span><span class="chan__k">${k}</span><span class="chan__v">${v}</span><span class="chan__go">↗</span></a>`;
  }).join("");

  const tk = $("[data-ticker-track]");
  if (tk) { const one = TICKER.map((t) => `<span>${t}</span><span class="s">◆</span>`).join(""); tk.innerHTML = one; }
}

/* --------------------------------------------------------------- STARFIELD + SKYLINE */
function starfield() {
  const cv = $("[data-stars]"); if (!cv) return;
  const ctx = cv.getContext("2d"); let w, h, stars, sY = 0;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const cols = ["#C9CCF5", "#34E1E8", "#FF4FA3", "#FFC23C", "#9B7BFF"];
  const resize = () => {
    w = cv.width = innerWidth * DPR; h = cv.height = innerHeight * DPR;
    cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
    stars = Array.from({ length: Math.min(150, Math.floor(innerWidth / 10)) }, () => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random() + .3, s: (Math.random() * 1.6 + .6) * DPR, t: Math.random() * 6 }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    stars.forEach((st, i) => { st.t += .03; const py = ((st.y - sY * st.z * .15 * DPR) % h + h) % h; ctx.globalAlpha = Math.max(.1, .4 + Math.sin(st.t) * .35); ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(st.x, py, st.s, st.s); });
    ctx.globalAlpha = 1; if (!REDUCED) requestAnimationFrame(draw);
  };
  resize(); addEventListener("resize", resize);
  if (!REDUCED) addEventListener("scroll", () => { sY = scrollY; }, { passive: true });
  draw();
}
function skyline() {
  const wrap = $("[data-hero-bg]"), cv = $("[data-hero-canvas]");
  if (!wrap || !cv) return;

  const ctx = cv.getContext("2d");
  const img = new Image();
  img.decoding = "async";
  img.src = "hero%20background.png";

  let cover = null, windows = [], stars = [], raf = 0, dpr = 1;

  const isWindowPx = (r, g, b, a) => {
    if (a < 128) return false;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 95) return false;
    const warm = r > 95 && g > 55 && b < 150 && r >= b - 20;
    const neonPink = r > 150 && b > 90 && g < 130;
    const neonCyan = g > 130 && b > 130 && r < 130;
    return lum > 120 && (warm || neonPink || neonCyan);
  };

  const isStarPx = (r, g, b, a) => {
    if (a < 180) return false;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return lum > 98 && lum < 215;
  };

  const seedStars = (W, H) => {
    const skyH = H * 0.4;
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * skyH,
        phase: Math.random() * 6.28, speed: 0.014 + Math.random() * 0.038,
        tint: Math.random() > 0.75 ? "#9BE7FF" : "#E8E4FF", proc: true,
      });
    }
  };

  const coverRect = (w, h) => {
    const ir = img.width / img.height, cr = w / h;
    if (cr > ir) return { dx: 0, dy: (h - w / ir) / 2, dw: w, dh: w / ir };
    return { dx: (w - h * ir) / 2, dy: 0, dw: h * ir, dh: h };
  };

  const parse = () => {
    const off = document.createElement("canvas");
    off.width = img.width; off.height = img.height;
    const octx = off.getContext("2d");
    octx.drawImage(img, 0, 0);
    const data = octx.getImageData(0, 0, img.width, img.height).data;
    const W = img.width, H = img.height, skyH = H * 0.43;
    windows = []; stars = [];

    for (let y = skyH | 0; y < H; y += 3) {
      for (let x = 0; x < W; x += 3) {
        const i = (y * W + x) * 4;
        if (isWindowPx(data[i], data[i + 1], data[i + 2], data[i + 3])) {
          windows.push({ x, y, on: true, next: performance.now() + rand(0, 3500), s: 3 });
        }
      }
    }
    for (let y = 0; y < skyH; y += 2) {
      for (let x = 0; x < W; x += 2) {
        const i = (y * W + x) * 4;
        if (isStarPx(data[i], data[i + 1], data[i + 2], data[i + 3])) {
          stars.push({ x, y, phase: Math.random() * 6.28, speed: 0.016 + Math.random() * 0.042, tint: data[i + 2] > data[i] + 20 ? "#9BE7FF" : "#E8E4FF" });
        }
      }
    }
    seedStars(W, H);
    if (windows.length > 420) windows.sort(() => Math.random() - 0.5).length = 420;
    if (stars.length > 130) stars.sort(() => Math.random() - 0.5).length = 130;
  };

  const resize = () => {
    const { width, height } = wrap.getBoundingClientRect();
    if (!width || !height) return;
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(width * dpr);
    cv.height = Math.round(height * dpr);
    if (img.naturalWidth) cover = coverRect(cv.width, cv.height);
  };

  const draw = () => {
    if (!img.naturalWidth || !cover) return;
    const now = performance.now();
    const px = cover.dw / img.width;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(img, cover.dx, cover.dy, cover.dw, cover.dh);

    if (!REDUCED) {
      stars.forEach((st) => {
        st.phase += st.speed;
        const wave = 0.5 + 0.5 * Math.sin(st.phase);
        const size = Math.max(px * (st.proc ? 2.4 : 2), dpr * (st.proc ? 1.6 : 1.2));
        const sx = cover.dx + st.x * px, sy = cover.dy + st.y * px;
        if (st.proc) {
          ctx.globalAlpha = 0.15 + wave * 0.85;
          ctx.fillStyle = st.tint;
          ctx.fillRect(sx, sy, size, size);
        } else if (wave > 0.62) {
          ctx.globalAlpha = (wave - 0.5) * 0.9;
          ctx.fillStyle = st.tint;
          ctx.fillRect(sx, sy, size, size);
        } else if (wave < 0.32) {
          ctx.globalAlpha = (0.35 - wave) * 0.75;
          ctx.fillStyle = "rgba(8, 5, 22, 0.8)";
          ctx.fillRect(sx, sy, size, size);
        }
      });
      ctx.globalAlpha = 1;

      windows.forEach((w) => {
        if (now > w.next) {
          w.on = Math.random() > 0.28;
          w.next = now + rand(500, 4200);
        }
        if (!w.on) {
          const size = Math.max(px * w.s, px * 2.5);
          ctx.fillStyle = "rgba(14, 8, 32, 0.94)";
          ctx.fillRect(cover.dx + w.x * px, cover.dy + w.y * px, size, size);
        }
      });
      raf = requestAnimationFrame(draw);
    }
  };

  const boot = () => { parse(); resize(); cancelAnimationFrame(raf); draw(); };
  img.onload = boot;
  img.onerror = () => { ctx.fillStyle = "#0B0A1A"; ctx.fillRect(0, 0, cv.width, cv.height); };
  resize();
  addEventListener("resize", () => { resize(); if (img.naturalWidth) boot(); });
  document.fonts?.ready?.then(() => ScrollTrigger?.refresh());
}

let introPinST = null;

function resetToIntro() {
  document.body.classList.remove("is-entered");
  scrollTo(0, 0);
  introPinST?.scroll(0);
}

/* --------------------------------------------------------------- BOOT + TITLE */
function boot(done) {
  const b = $("[data-boot]"); document.body.classList.add("boot-lock");
  resetToIntro();
  if (!b || REDUCED || !gsap) { if (b) b.classList.add("is-done"); document.body.classList.remove("boot-lock"); return done(); }
  const fill = $("[data-boot-fill]"), log = $("[data-boot-log]"), press = $("[data-boot-press]");
  const steps = ["loading cartridge…", "spawning player…", "linking modules…", "ready — insert coin"];
  const st = { v: 0 };
  gsap.timeline()
    .to(st, { v: 100, duration: 1.3, ease: "steps(22)", onUpdate() { fill.style.width = st.v + "%"; log.textContent = steps[Math.min(3, Math.floor(st.v / 25))]; } })
    .add(() => press.classList.add("on"))
    .to(b, { opacity: 0, duration: .5, delay: .5, onComplete() { b.classList.add("is-done"); document.body.classList.remove("boot-lock"); done(); } });
}
function titleIntro() {
  const typed = $("[data-typed]"), name = $("[data-name]");
  if (name && !REDUCED) { name.classList.add("glitch"); setTimeout(() => name.classList.remove("glitch"), 900); }
  if (gsap && !REDUCED) gsap.from("[data-t-item]", { y: 18, opacity: 0, duration: .6, stagger: .08, ease: "power3.out", delay: .2 });
  if (typed) {
    if (REDUCED) { typed.textContent = TAGLINE; return; }
    let i = 0; const tick = () => { typed.textContent = TAGLINE.slice(0, i++); if (i <= TAGLINE.length) setTimeout(tick, 45); };
    setTimeout(tick, 700);
  }
  // hiscore flavour count
  const hs = $("[data-hiscore]");
  if (hs && gsap && !REDUCED) { const o = { v: 0 }; gsap.to(o, { v: 3630, duration: 1.6, delay: .4, ease: "power1.out", onUpdate() { hs.textContent = String(Math.floor(o.v)).padStart(6, "0"); } }); }
}

/* --------------------------------------------------------------- INTRO — arcade cabinet entrance */
function introEnter() {
  const intro = $("[data-intro]");
  const cab = $(".intro__cab");
  const screen = $(".intro__screen");
  if (!intro || !cab || !screen || !gsap || !ScrollTrigger || REDUCED) {
    document.body.classList.remove("js-intro");
    document.body.classList.add("is-entered");
    titleIntro();
    return;
  }

  document.body.classList.add("js-intro");
  const mobile = matchMedia("(max-width: 700px)").matches;
  let entered = false;
  // nav shows/hides with the intro's own pinned zone (so it re-hides if the user scrolls
  // back up to the cabinet), but the hero's one-time entrance (titleIntro) only ever plays once
  const enter = () => {
    document.body.classList.add("is-entered");
    intro.style.pointerEvents = "none";
    if (intro.parentElement?.classList.contains("pin-spacer")) intro.parentElement.style.pointerEvents = "none";
    if (entered) return;
    entered = true;
    titleIntro();
  };
  const leave = () => {
    document.body.classList.remove("is-entered");
    intro.style.pointerEvents = "";
    intro.style.visibility = "";
    if (intro.parentElement?.classList.contains("pin-spacer")) intro.parentElement.style.pointerEvents = "";
    gsap.set(intro, { clearProps: "opacity" });
    if (gsap) gsap.set("#start [data-t-item], #start .title__stage", { clearProps: "opacity,transform" });
  };

  // Zoom pivots on the CRT center (not the browser window) — origin is synced from .intro__screen each frame.
  const syncCabPivot = () => {
    const cabRect = cab.getBoundingClientRect();
    const screenRect = screen.getBoundingClientRect();
    if (!cabRect.width || !cabRect.height) return;
    const ox = ((screenRect.left + screenRect.width / 2 - cabRect.left) / cabRect.width) * 100;
    const oy = ((screenRect.top + screenRect.height / 2 - cabRect.top) / cabRect.height) * 100;
    gsap.set(cab, { transformOrigin: `${ox}% ${oy}%` });
  };
  const scaleForScreen = () => {
    syncCabPivot();
    const rect = screen.getBoundingClientRect();
    return Math.max(innerWidth / rect.width, innerHeight / rect.height) * 1.15;
  };

  syncCabPivot();
  addEventListener("resize", syncCabPivot);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: intro,
      start: "top top",
      end: () => "+=" + Math.round(innerHeight * (mobile ? .28 : .34)),
      pin: true,
      scrub: 1,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      onRefresh: syncCabPivot,
      onLeave: enter,
      onEnterBack: leave,
      onUpdate: (self) => {
        if (document.body.classList.contains("is-entered") && self.direction === -1 && self.progress < 1) leave();
      },
    },
  });

  introPinST = tl.scrollTrigger;

  tl.to(".intro__hint", { opacity: 0, y: 14, duration: .12 }, 0)
    .to(cab, { scale: scaleForScreen, duration: .8, ease: "power1.in", force3D: true }, .08)
    .to(".intro__bg", { scale: 1.3, duration: .8, ease: "power1.in", force3D: true }, .08)
    .to(".intro__preview", { opacity: 0, duration: .15 }, .6)
    .to(intro, { opacity: 0, duration: .2, onStart: enter }, .78);

  $("[data-intro-hint]")?.addEventListener("click", () => {
    const st = tl.scrollTrigger;
    if (st) scrollTo({ top: st.end, behavior: REDUCED ? "auto" : "smooth" });
  });

  ScrollTrigger.refresh();
  resetToIntro();
}

addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  resetToIntro();
  ScrollTrigger?.refresh();
  introPinST?.scroll(0);
});

/* drifting light motes + a subtle mouse-tilt on the cabinet, while the intro is still at rest */
function introAmbience() {
  const motes = $("[data-intro-motes]");
  if (motes && !REDUCED) {
    for (let i = 0; i < 14; i++) {
      const m = document.createElement("span");
      m.className = "intro__mote";
      m.style.left = rand(4, 96) + "%";
      m.style.setProperty("--dur", rand(70, 150) / 10 + "s");
      m.style.setProperty("--delay", "-" + rand(0, 120) / 10 + "s");
      m.style.setProperty("--drift", rand(-40, 40) + "px");
      motes.appendChild(m);
    }
  }

  const cab = $("[data-intro-tilt]");
  if (!cab || !gsap || REDUCED || TOUCH) return;
  const rotX = gsap.quickTo(cab, "rotationX", { duration: .6, ease: "power3.out" });
  const rotY = gsap.quickTo(cab, "rotationY", { duration: .6, ease: "power3.out" });
  let active = true;
  const onMove = (e) => {
    if (!active) return;
    rotY((e.clientX / innerWidth - .5) * 12);
    rotX(-(e.clientY / innerHeight - .5) * 10);
  };
  const stop = () => { if (!active) return; active = false; removeEventListener("pointermove", onMove); rotX(0); rotY(0); };
  addEventListener("pointermove", onMove);
  addEventListener("scroll", function onScroll() { if (scrollY > 4) { stop(); removeEventListener("scroll", onScroll); } }, { passive: true });
}

/* --------------------------------------------------------------- FLIP CARD */
function flipCard() {
  const card = $("[data-pcard]"), btn = $("[data-pcard-flip]");
  btn?.addEventListener("click", () => card.classList.toggle("is-flipped"));
}

/* --------------------------------------------------------------- NAV / ZMAP */
function chrome() {
  const nav = $("[data-nav]"), burger = $("[data-burger]");
  burger?.addEventListener("click", () => { const o = nav.classList.toggle("is-open"); burger.classList.toggle("is-open", o); burger.setAttribute("aria-expanded", String(o)); });
  const close = () => { nav?.classList.remove("is-open"); burger?.classList.remove("is-open"); burger?.setAttribute("aria-expanded", "false"); };
  $$("[data-nav-link]").forEach((a) => a.addEventListener("click", close));
  $("[data-brand]")?.addEventListener("click", () => { scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }); Coins.add(1); });
  $("[data-scroll-top]")?.addEventListener("click", () => scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }));
  $("[data-press]")?.addEventListener("click", () => { const t = $("#character"); t && scrollTo({ top: t.offsetTop - 60, behavior: REDUCED ? "auto" : "smooth" }); });

  // zone map
  const zmap = $("[data-zmap]"); const secs = $$("[data-section]");
  if (zmap) {
    zmap.innerHTML = secs.map((s) => `<button class="zdot" data-z="${s.id}" aria-label="${s.dataset.zone}"><span class="zdot__tip">${s.dataset.zone}</span></button>`).join("");
    $$(".zdot", zmap).forEach((d) => d.addEventListener("click", () => { const t = $("#" + d.dataset.z); t && scrollTo({ top: t.offsetTop - 50, behavior: REDUCED ? "auto" : "smooth" }); }));
    if (ScrollTrigger) secs.forEach((s) => {
      const dot = $(`.zdot[data-z="${s.id}"]`, zmap); const link = $(`.menu a[href="#${s.id}"]`);
      ScrollTrigger.create({ trigger: s, start: "top 55%", end: "bottom 55%", onToggle: (self) => { dot?.classList.toggle("on", self.isActive); link?.classList.toggle("is-active", self.isActive); } });
    });
  }
}

/* --------------------------------------------------------------- SCROLL FX */
function sectionTransitions() {
  if (!gsap || !ScrollTrigger) return;
  const hud = $("[data-zone-hud]");
  let hudT = 0;
  const showZone = (name) => {
    if (!hud || !name) return;
    hud.textContent = name;
    hud.hidden = false;
    hud.classList.remove("is-on");
    void hud.offsetWidth;
    hud.classList.add("is-on");
    clearTimeout(hudT);
    hudT = setTimeout(() => {
      hud.classList.remove("is-on");
      setTimeout(() => { hud.hidden = true; }, 380);
    }, 2100);
  };

  const mark = (sec, on) => sec.classList.toggle("is-inview", on);

  $$("main [data-section]").forEach((sec) => {
    const hero = sec.id === "start";
    ScrollTrigger.create({
      trigger: sec,
      start: "top 62%",
      end: "bottom 38%",
      onEnter: () => { mark(sec, true); showZone(sec.dataset.zone); },
      onLeave: () => mark(sec, false),
      onEnterBack: () => { mark(sec, true); showZone(sec.dataset.zone); },
      onLeaveBack: () => mark(sec, false),
    });

    if (REDUCED) return;

    if (!hero) {
      gsap.fromTo(sec, { autoAlpha: 0, y: 44 }, {
        autoAlpha: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: sec, start: "top 94%", end: "top 58%", scrub: 0.55 },
      });
    }

    const title = $(".sec__title", sec);
    if (title) {
      gsap.fromTo(title, { x: -28, opacity: 0.35 }, {
        x: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: sec, start: "top 88%", end: "top 62%", scrub: 0.45 },
      });
    }

    const kids = [...sec.children].filter((c) => !c.matches(".sec__title"));
    if (kids.length && !hero) {
      gsap.set(kids, { y: 22, opacity: 0 });
      ScrollTrigger.create({
        trigger: sec, start: "top 72%", once: true,
        onEnter: () => gsap.to(kids, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power3.out", overwrite: "auto" }),
      });
    }
  });
}

function scrollFx() {
  if (!gsap || !ScrollTrigger) return;
  if (REDUCED) gsap.set("[data-reveal]", { opacity: 1, y: 0 });
  else gsap.set("[data-reveal]", { y: 22, opacity: 0 });

  sectionTransitions();
  // parallax title
  if (!REDUCED) {
    gsap.to("[data-hero-bg]", { yPercent: 10, ease: "none", scrollTrigger: { trigger: "#start", start: "top top", end: "bottom top", scrub: true } });
    gsap.to("[data-pcard]", { y: -60, ease: "none", scrollTrigger: { trigger: "#start", start: "top top", end: "bottom top", scrub: true } });
    // section titles — handled by sectionTransitions scrub; keep subtle snap for late entries
    $$("[data-title]").forEach((t) => {
      if (t.closest("[data-section]")) return;
      gsap.from(t, { x: -40, opacity: 0, duration: .7, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 85%" } });
    });
  }
  // reveals (per-element polish on top of section pass)
  $$("[data-reveal]").forEach((el) => ScrollTrigger.create({
    trigger: el, start: "top 90%", once: true,
    onEnter: () => REDUCED ? gsap.set(el, { opacity: 1, y: 0 }) : gsap.to(el, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", overwrite: "auto" }),
  }));
  // bar fills (skills + attrs)
  $$("[data-kit-meter]").forEach((meter) => {
    ScrollTrigger.create({ trigger: meter, start: "top 94%", once: true, onEnter: () => {
      const pips = meter.querySelectorAll(".kit__pip.on");
      if (REDUCED || !pips.length) return;
      gsap.from(pips, { scaleY: 0, transformOrigin: "bottom center", duration: .22, stagger: .05, ease: "back.out(2)" });
    } });
  });

  // character — fact rows + edu cards
  if (!REDUCED) {
    gsap.from(".about__fact", { x: -16, opacity: 0, duration: .45, stagger: .05, ease: "power2.out", scrollTrigger: { trigger: ".about__facts", start: "top 88%" } });
    gsap.from(".about__edu-card", { y: 16, opacity: 0, duration: .5, stagger: .1, ease: "power2.out", scrollTrigger: { trigger: ".about__edu", start: "top 86%" } });
    gsap.from(".contact__booth", { x: -28, opacity: 0, duration: .6, ease: "power3.out", scrollTrigger: { trigger: ".contact__scene", start: "top 82%" } });
    gsap.from(".contact__panels .contact__links", { x: -44, opacity: 0, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".contact__scene", start: "top 82%" } });
    gsap.from(".contact__panels .form", { x: 44, opacity: 0, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".contact__scene", start: "top 82%" } });
    const lg = $(".about__lang-list");
    if (lg) ScrollTrigger.create({ trigger: lg, start: "top 85%", once: true,
      onEnter: () => gsap.from(".about__lang-pip.on", { scale: 0, transformOrigin: "center", duration: .3, stagger: .015, ease: "back.out(2)" }) });
  }

  // loadout — arena + inventory
  const kit = $("[data-kit]");
  if (kit && !REDUCED) ScrollTrigger.create({ trigger: kit, start: "top 84%", once: true,
    onEnter: () => gsap.from(".kit__inv", { x: 28, opacity: 0, duration: .55, ease: "power3.out", immediateRender: false }) });

  // campaign log: stagger cards in
  const chronoCards = $$(".ch-card");
  const campaignTracks = $(".campaign__tracks");
  if (chronoCards.length && campaignTracks && !REDUCED) ScrollTrigger.create({ trigger: campaignTracks, start: "top 82%", once: true,
    onEnter: () => gsap.from(chronoCards, { opacity: 0, y: 18, duration: .45, stagger: .1, ease: "power2.out", immediateRender: false }) });

  // shipped: cards stagger in
  const shipCards = $$(".ship");
  if (shipCards.length && !REDUCED) ScrollTrigger.create({ trigger: "#shipped", start: "top 78%", once: true,
    onEnter: () => gsap.from(shipCards, { opacity: 0, y: 16, duration: .4, stagger: .08, ease: "power2.out", immediateRender: false }) });
}

/* --------------------------------------------------------------- TICKER */
function mountTicker(track) {
  if (!track || !gsap) return;
  track.innerHTML += track.innerHTML;
  const half = track.scrollWidth / 2;
  const tw = gsap.to(track, { x: -half, duration: half / 55, ease: "none", repeat: -1, modifiers: { x: (x) => (parseFloat(x) % half) + "px" } });
  if (REDUCED) tw.pause();
}
function ticker() {
  mountTicker($("[data-ticker-track]"));
}

/* --------------------------------------------------------------- GAME: BUG HUNT */
function bugHunt() {
  const root = $("[data-bughunt]"); if (!root) return;
  const grid = $("[data-bh-grid]", root), sEl = $("[data-bh-score]", root), tEl = $("[data-bh-time]", root);
  const startBtn = $("[data-bh-start]", root), msg = $("[data-bh-msg]", root), bestEl = $('[data-best="bughunt"]');
  let best = +(localStorage.getItem("wjs_bh") || 0); if (bestEl) bestEl.textContent = best;
  const cells = [];
  for (let i = 0; i < 9; i++) { const c = document.createElement("div"); c.className = "bh__cell"; c.innerHTML = `<span class="bug" role="button" aria-label="Squash bug">${px("bug")}</span>`; grid.appendChild(c); cells.push(c); }
  let running = false, score = 0, time = 30, spawnT, tickT;

  const squash = (c) => {
    if (!running || !c.classList.contains("up")) return;
    c.classList.remove("up"); const bug = $(".bug", c); bug.classList.add("squash");
    setTimeout(() => bug.classList.remove("squash"), 150);
    score += 10; sEl.textContent = score; Coins.add(1);
  };
  cells.forEach((c) => { const bug = $(".bug", c); bug.addEventListener("click", () => squash(c)); });

  const spawn = () => { if (!running) return; const idle = cells.filter((c) => !c.classList.contains("up")); if (idle.length) { const c = idle[rand(0, idle.length - 1)]; c.classList.add("up"); setTimeout(() => c.classList.remove("up"), rand(650, 1050)); } spawnT = setTimeout(spawn, rand(500, 850)); };

  startBtn.addEventListener("click", () => {
    if (running) return; running = true; score = 0; time = 30; sEl.textContent = 0; tEl.textContent = 30; msg.textContent = ""; startBtn.textContent = "▶ Playing…"; startBtn.disabled = true;
    spawn();
    tickT = setInterval(() => { time--; tEl.textContent = time; if (time <= 0) {
      clearInterval(tickT); clearTimeout(spawnT); running = false; cells.forEach((c) => c.classList.remove("up"));
      startBtn.textContent = "▶ Play again"; startBtn.disabled = false;
      if (score > best) { best = score; localStorage.setItem("wjs_bh", best); if (bestEl) bestEl.textContent = best; msg.textContent = `NEW BEST! ${score} pts`; }
      else msg.textContent = `Time! ${score} pts`;
    } }, 1000);
  });
}

/* --------------------------------------------------------------- GAME: MEMORY */
function memory() {
  const root = $("[data-memory]"); if (!root) return;
  const grid = $("[data-mem-grid]", root), mEl = $("[data-mem-moves]", root), pEl = $("[data-mem-pairs]", root);
  const startBtn = $("[data-mem-start]", root), msg = $("[data-mem-msg]", root), bestEl = $('[data-best="memory"]');
  const FACES = ["JS", "TS", "{ }", "λ", "SQL", "GIT"];
  let best = localStorage.getItem("wjs_mem"); if (bestEl && best) bestEl.textContent = best;
  let lock = false, first = null, moves = 0, pairs = 0;

  const deal = () => {
    lock = false; first = null; moves = 0; pairs = 0; mEl.textContent = 0; pEl.textContent = 0; msg.textContent = "";
    const deck = [...FACES, ...FACES].sort(() => Math.random() - .5);
    grid.innerHTML = deck.map((f) => `<div class="mcard" data-f="${f}"><div class="mcard__in"><div class="mcard__f mcard__front">?</div><div class="mcard__f mcard__back">${f}</div></div></div>`).join("");
    $$(".mcard", grid).forEach((card) => card.addEventListener("click", () => flip(card)));
  };
  const flip = (card) => {
    if (lock || card.classList.contains("flip") || card.classList.contains("done")) return;
    card.classList.add("flip");
    if (!first) { first = card; return; }
    moves++; mEl.textContent = moves;
    if (first.dataset.f === card.dataset.f) {
      first.classList.add("done"); card.classList.add("done"); first = null; pairs++; pEl.textContent = pairs; Coins.add(2);
      if (pairs === 6) {
        const bScore = best ? +best : Infinity;
        if (moves < bScore) { localStorage.setItem("wjs_mem", moves); if (bestEl) bestEl.textContent = moves; best = String(moves); msg.textContent = `CLEARED in ${moves} — NEW BEST!`; }
        else msg.textContent = `CLEARED in ${moves} moves!`;
        Coins.add(10);
      }
    } else {
      lock = true; const a = first, b = card; first = null;
      setTimeout(() => { a.classList.remove("flip"); b.classList.remove("flip"); lock = false; }, 650);
    }
  };
  startBtn.addEventListener("click", deal);
  deal();
}

/* --------------------------------------------------------------- SHIPPED */
function shipReveal() {
  const btn = $("[data-ships-toggle]");
  const extras = $$(".ship.is-collapsed");
  if (!btn || !extras.length) return;
  btn.classList.add("is-visible");
  const label = $("[data-ships-toggle-label]", btn);

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    label.textContent = open ? "Show more" : "Show less";

    if (!open) {
      extras.forEach((c) => c.classList.remove("is-collapsed"));
      if (gsap && !REDUCED) gsap.fromTo(extras, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .4, stagger: .07, ease: "power2.out" });
    } else if (gsap && !REDUCED) {
      gsap.to(extras, { opacity: 0, y: 14, duration: .25, stagger: .05, ease: "power2.in",
        onComplete: () => extras.forEach((c) => c.classList.add("is-collapsed")) });
    } else {
      extras.forEach((c) => c.classList.add("is-collapsed"));
    }
  });
}

/* --------------------------------------------------------------- KONAMI */
function konami() {
  const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let i = 0;
  addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    i = (k === seq[i]) ? i + 1 : (k === seq[0] ? 1 : 0);
    if (i === seq.length) { i = 0; unleash(); }
  });
  const hint = $("[data-hint]");
  function unleash() {
    Coins.add(50);
    if (hint) hint.textContent = "★ CHEAT UNLOCKED — +50 COINS! ★";
    rain(60);
  }
}


/* --------------------------------------------------------------- CHARACTER / ABOUT */
function buildCharacter() {
  const slots = $("[data-char-slots]"), readout = $("[data-char-readout]");
  const hook = $("[data-char-hook]"), traits = $("[data-char-traits]");
  const edu = $("[data-char-edu]");
  if (!slots) return;

  slots.innerHTML = CHAR_SLOTS.map((s, i) => `
    <button class="about__fact" type="button" data-i="${i}" data-blip role="listitem">
      <span class="about__fact-k">${s.key}</span>
      <span class="about__fact-v">${s.val}</span>
    </button>`).join("");

  if (hook) hook.innerHTML = CHAR_BIO;
  if (traits) traits.innerHTML = CHAR_TRAITS.map((t) => `
    <li class="about__tag"><span class="about__tag-ic" data-icon="${t.icon}" aria-hidden="true"></span>${t.label}</li>`).join("");

  if (edu) {
    const quests = STAGES.filter((s) => s.kind === "edu");
    edu.innerHTML = quests.map((q) => `
      <article class="about__edu-card" tabindex="0">
        <div class="about__edu-head">
          <span class="about__edu-badge about__edu-badge--${q.status}">${q.badge || (q.status === "in-progress" ? "In progress" : "Cleared")}</span>
          <time class="about__edu-date">${q.date}</time>
        </div>
        <h4 class="about__edu-title">${q.title}</h4>
        <p class="about__edu-org">${q.org}</p>
        <p class="about__edu-detail">${q.detail}</p>
      </article>`).join("");
  }

  const social = $("[data-char-links]");
  if (social) {
    social.innerHTML = CONTACTS.filter(([ic]) => CHAR_SOCIAL.has(ic)).map(([ic, k, v, href]) => {
      const ext = href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a class="about__link" href="${href}"${ext} data-blip aria-label="${k}: ${v}">
        <span class="about__link-ic">${px(ic)}</span>
        <span class="about__link-lbl">${k}</span>
      </a>`;
    }).join("");
  }

  const factEls = $$(".about__fact", slots);
  const setFact = (i) => {
    const s = CHAR_SLOTS[i];
    if (!s || !readout) return;
    readout.innerHTML = `<span class="about__read-k">${s.key}</span><span class="about__read-v">${s.detail}</span>`;
    readout.dataset.active = s.key;
    factEls.forEach((el) => el.classList.toggle("is-hot", +el.dataset.i === i));
  };
  factEls.forEach((el) => {
    el.addEventListener("mouseenter", () => setFact(+el.dataset.i));
    el.addEventListener("focus", () => setFact(+el.dataset.i));
    el.addEventListener("click", () => setFact(+el.dataset.i));
  });
  setFact(0);
}

/* --------------------------------------------------------------- CONFETTI */
function rain(n) {
  const fx = $("[data-fx]"); if (!fx || REDUCED || !gsap) return;
  const cols = ["#34E1E8", "#FFC23C", "#FF4FA3", "#5CE08A", "#9B7BFF"];
  for (let k = 0; k < n; k++) {
    const b = document.createElement("span"); b.className = "fx__bit"; b.style.background = cols[k % cols.length];
    b.style.left = Math.random() * 100 + "vw"; b.style.top = "-20px"; fx.appendChild(b);
    gsap.to(b, { y: innerHeight + 40, x: (Math.random() - .5) * 200, rotation: rand(0, 360), duration: rand(15, 32) / 10, ease: "power1.in", onComplete: () => b.remove() });
  }
}

/* --------------------------------------------------------------- CAMPAIGN LOG */
const STAGE_STATUS = { cleared: "✓ Cleared", active: "● Active", "in-progress": "⟳ In progress" };

function renderStageCard(s, i, total) {
  const n = String(total - i).padStart(2, "0");
  const bar = s.kind === "work" ? "work.log" : "edu.log";
  return `
    <article class="ch-card ch-card--${s.kind} ch-card--${s.status}">
      <div class="ch-card__rail" aria-hidden="true"><span class="ch-card__dot">${n}</span></div>
      <div class="panel ch-card__body">
        <div class="panel__bar" data-bar="${bar}"></div>
        <div class="panel__pad">
          <header class="ch-card__head">
            <div class="ch-card__meta">
              <span class="ch-card__status" data-status="${s.status}">${STAGE_STATUS[s.status]}</span>
            </div>
            <time class="ch-card__when" datetime="${s.date}">${s.date}</time>
          </header>
          <h3 class="ch-card__title">${s.title}</h3>
          <p class="ch-card__org">${s.org}${s.badge ? ` · <span class="ch-card__badge">${s.badge}</span>` : ""}</p>
          <p class="ch-card__desc">${s.detail}</p>
          <p class="lbl ch-card__lbl"><span class="lbl__i" data-icon="star"></span>Highlights</p>
          <ul class="ch-card__list">${s.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
        </div>
      </div>
    </article>`;
}

function campaignLog() {
  const workHost = $("[data-chrono-work]");
  const eduHost = $("[data-chrono-edu]");
  const work = STAGES.filter((s) => s.kind === "work");
  const edu = STAGES.filter((s) => s.kind === "edu");
  if (workHost) workHost.innerHTML = work.map((s, i) => renderStageCard(s, i, work.length)).join("");
  if (eduHost) eduHost.innerHTML = edu.map((s, i) => renderStageCard(s, i, edu.length)).join("");
  paintIcons();
}

/* --------------------------------------------------------------- FORM */
const TS_KEY = "0x4AAAAAADf6GSXHdOAcmuuH", W3_KEY = "1a23a0e7-9e4b-4318-aaef-8869bd256a32", EMAIL = "jiasen27826@gmail.com";

function contactMascot() {
  const scene = $("[data-contact-scene]");
  const mascot = $("[data-contact-mascot]");
  const bubble = $("[data-contact-bubble]");
  const prompt = $("[data-contact-prompt]");
  const form = $("[data-contact-form]");
  if (!scene || !mascot) return;

  const setPrompt = (t) => { if (prompt) prompt.textContent = t; };

  const reveal = () => scene.classList.add("is-ready");
  if (REDUCED) reveal();
  else if (gsap && ScrollTrigger) {
    ScrollTrigger.create({ trigger: scene, start: "top 86%", once: true, onEnter: reveal });
  } else reveal();

  const focusForm = () => {
    if (!form) return;
    const name = form.querySelector("[name=name]");
    const email = form.querySelector("[name=email]");
    const message = form.querySelector("[name=message]");
    const target = !name?.value?.trim() ? name : !email?.value?.trim() ? email : message;
    target?.focus({ preventScroll: false });
    form.classList.add("is-highlight");
    setTimeout(() => form.classList.remove("is-highlight"), 1400);
    if (bubble) bubble.textContent = "Your turn!";
    setPrompt("Incoming message detected…");
  };

  mascot.addEventListener("click", focusForm);

  form?.addEventListener("focusin", () => {
    scene.classList.add("is-typing");
    if (bubble && !scene.classList.contains("is-sent")) bubble.textContent = "Writing...";
    setPrompt("Composing transmission…");
  });
  form?.addEventListener("focusout", (e) => {
    if (form.contains(e.relatedTarget)) return;
    scene.classList.remove("is-typing");
    if (bubble && !scene.classList.contains("is-sent")) bubble.textContent = "Got mail?";
    if (!scene.classList.contains("is-sent")) setPrompt("Awaiting transmission…");
  });
}

function contactForm() {
  const form = $("[data-contact-form]"); if (!form) return;
  const btn = $("[data-contact-submit]", form), host = $("[data-turnstile]", form), status = $("[data-form-status]");
  const LABEL = btn ? btn.innerHTML : ""; let verified = false, sending = false, wid = null, mounted = false;
  const setStatus = (m, t) => { if (!status) return; status.textContent = m; status.classList.remove("is-ok", "is-err"); if (t) status.classList.add(t); };
  const setEnabled = (on) => { verified = on; if (!sending && btn) { btn.disabled = !on; btn.setAttribute("aria-disabled", String(!on)); } if (on) setStatus("Verified — ready to send.", "is-ok"); };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!verified) { setStatus("Clear the security check first.", "is-err"); return; }
    if (sending || !form.reportValidity()) return;
    const fd = new FormData(form); const name = (fd.get("name")||"").toString().trim(), email = (fd.get("email")||"").toString().trim(), message = (fd.get("message")||"").toString().trim();
    if (!name || !email || !message) return;
    sending = true; btn.disabled = true; btn.setAttribute("aria-disabled", "true"); btn.innerHTML = "▶ Sending…"; setStatus("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: W3_KEY, subject: `Portfolio message from ${name}`, from_name: name, name, email, replyto: email, message, botcheck: "" }) });
      const data = await res.json(); if (!res.ok || !data.success) throw new Error();
      form.reset(); setEnabled(false); if (wid !== null && window.turnstile) window.turnstile.reset(wid);
      setStatus("Message sent — quest received! +5 coins. I'll reply soon.", "is-ok"); Coins.add(5); rain(26);
      const scene = $("[data-contact-scene]"), bubble = $("[data-contact-bubble]");
      const prompt = $("[data-contact-prompt]");
      if (scene) { scene.classList.add("is-sent"); scene.classList.remove("is-typing"); }
      if (bubble) bubble.textContent = "Sent!";
      if (prompt) prompt.textContent = "Quest received — mail delivered.";
    } catch { setStatus(`Could not send. Email ${EMAIL} directly.`, "is-err"); btn.disabled = false; btn.setAttribute("aria-disabled", "false"); }
    finally { sending = false; btn.innerHTML = LABEL; if (!verified) { btn.disabled = true; btn.setAttribute("aria-disabled", "true"); } }
  });
  const mount = () => { if (mounted || !window.turnstile || !host) return; mounted = true;
    wid = window.turnstile.render(host, { sitekey: TS_KEY, theme: "dark", callback: () => setEnabled(true),
      "error-callback": () => { setEnabled(false); setStatus("Verification failed to load. Refresh or email directly.", "is-err"); },
      "expired-callback": () => { setEnabled(false); setStatus("Verification expired — clear the check again.", "is-err"); if (wid !== null) window.turnstile.reset(wid); } }); };
  const bootTs = () => { if (window.turnstile) { window.turnstile.ready(mount); return; } let n = 0; const t = setInterval(() => { if (window.turnstile) { clearInterval(t); window.turnstile.ready(mount); return; } if (++n >= 100) { clearInterval(t); setStatus(`Verification could not load. Email ${EMAIL} directly.`, "is-err"); } }, 100); };
  bootTs();
}

/* ================================================================== INIT */
function init() {
  resetToIntro();
  inject(); paintIcons();
  loadout(); kitStage(); shipReveal(); campaignLog();
  flipCard(); chrome(); introEnter(); introAmbience();
  scrollFx(); ticker();
  bugHunt(); memory(); konami(); contactMascot(); contactForm();
  ScrollTrigger?.refresh();
  resetToIntro();
  requestAnimationFrame(() => introPinST?.scroll(0));
}

starfield(); skyline();
boot(init);
