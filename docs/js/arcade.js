/* ========================================================================
   WONG JIA SEN — PLAYER ONE (v2)
   Playable arcade portfolio. GSAP + ScrollTrigger. Reduced-motion aware.
   ======================================================================== */

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TOUCH = window.matchMedia("(hover: none), (pointer: coarse)").matches;
document.documentElement.classList.add("js");
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

/* --------------------------------------------------------------- DATA */
const CARD_STATS = [["Class", "Full-Stack Eng"], ["Guild", "APU"], ["Base", "KL, MY"], ["CGPA", "<b>3.63</b>"], ["Status", "<b>Available</b>"]];
const RADAR = [
  ["Craft", 92, "Clean, lasting code"],
  ["Depth", 85, "Systems, end to end"],
  ["Ship", 88, "Built & shipped in public"],
  ["Open", 96, "Ready to collaborate"],
  ["Focus", 86, "Maintainable by design"],
  ["Growth", 90, "Always leveling up"],
];
const LANGS = [
  ["English", "EN", "Fluent", 5],
  ["Mandarin", "中文", "Native", 5],
  ["Cantonese", "廣東話", "Fluent", 4],
  ["Malay", "BM", "Conversational", 3],
];
const SKILLS = [
  ["Languages", [["JavaScript", 85], ["TypeScript", 82], ["Python", 80], ["Java", 75], ["PHP", 70]]],
  ["Frontend", [["React", 82], ["Tailwind", 85], ["Flutter", 72], ["HTML / CSS", 90]]],
  ["Backend", [["Node.js", 78], ["Laravel", 75]]],
  ["Database", [["MySQL", 82], ["PostgreSQL", 72], ["Redis", 65]]],
  ["Tools", [["Git", 85], ["Docker", 68], ["Linux", 72], ["VS Code", 92]]],
];
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
  { n: "02", kind: "work", date: "Sep – Nov 2025", title: "Software Engineering Intern", org: "Codespace AI Technology", status: "cleared",
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
  if (lg) lg.innerHTML = LANGS.map(([name, cjk, lvl, pips]) => `
    <div class="lang">
      <div class="lang__top"><span class="lang__name">${name}</span><span class="lang__cjk">${cjk}</span></div>
      <span class="lang__lvl">${lvl}</span>
      <div class="lang__pips">${Array.from({ length: 5 }, (_, i) => `<span class="lang__pip${i < pips ? " on" : ""}"></span>`).join("")}</div>
    </div>`).join("");

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
  const sky = $("[data-sky]"); if (!sky) return;
  let html = "";
  for (let i = 0; i < 26; i++) { const hgt = rand(30, 100); html += `<span class="building" style="height:${hgt}%"></span>`; }
  sky.innerHTML = html;
}

/* --------------------------------------------------------------- BOOT + TITLE */
function boot(done) {
  const b = $("[data-boot]"); document.body.classList.add("boot-lock");
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
  if (!intro || !cab || !screen || !gsap || !ScrollTrigger || REDUCED) { titleIntro(); return; }

  document.body.classList.add("js-intro");
  const mobile = matchMedia("(max-width: 700px)").matches;
  let entered = false;
  // nav shows/hides with the intro's own pinned zone (so it re-hides if the user scrolls
  // back up to the cabinet), but the hero's one-time entrance (titleIntro) only ever plays once
  const enter = () => {
    document.body.classList.add("is-entered");
    if (entered) return;
    entered = true;
    titleIntro();
  };
  const leave = () => document.body.classList.remove("is-entered");

  // scale the whole cabinet (not just the screen) toward the viewport size, pivoting on the
  // screen's own center (set via .intro__cab's transform-origin) — the machine walks toward you
  // and the bezel/joystick scroll off-frame naturally as the screen fills the view
  const rect = screen.getBoundingClientRect();
  const scaleTarget = Math.max(innerWidth / rect.width, innerHeight / rect.height) * 1.15;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: intro,
      start: "top top",
      // NOTE: ScrollTrigger's pin spacer reserves (trigger's own natural height) + (end - start),
      // not just (end - start) — since .intro already costs ~1 viewport on its own (min-height:
      // 100svh), keep this additional hold short or the two stack into a huge dead scroll gap
      // before the hero appears
      end: () => "+=" + Math.round(innerHeight * (mobile ? .35 : .45)),
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onLeave: enter,
      onEnterBack: leave,
    },
  });

  tl.to(".intro__hint", { opacity: 0, y: 14, duration: .12 }, 0)
    .to(cab, { scale: scaleTarget, duration: .8, ease: "power1.in", force3D: true }, .08)
    .to(".intro__bg", { scale: 1.3, duration: .8, ease: "power1.in", force3D: true }, .08)
    .to(".intro__preview", { opacity: 0, duration: .15 }, .6)
    .to(intro, { opacity: 0, duration: .2 }, .78);

  $("[data-intro-hint]")?.addEventListener("click", () => {
    const st = tl.scrollTrigger;
    if (st) scrollTo({ top: st.end, behavior: REDUCED ? "auto" : "smooth" });
  });
}

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
function scrollFx() {
  if (!gsap || !ScrollTrigger) return;
  // parallax title
  if (!REDUCED) {
    gsap.to("[data-sky]", { yPercent: -40, ease: "none", scrollTrigger: { trigger: "#start", start: "top top", end: "bottom top", scrub: true } });
    gsap.to("[data-ground]", { yPercent: 60, ease: "none", scrollTrigger: { trigger: "#start", start: "top top", end: "bottom top", scrub: true } });
    gsap.to("[data-pcard]", { y: -60, ease: "none", scrollTrigger: { trigger: "#start", start: "top top", end: "bottom top", scrub: true } });
    // section titles slide in
    $$("[data-title]").forEach((t) => gsap.from(t, { x: -40, opacity: 0, duration: .7, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 85%" } }));
  }
  // reveals
  $$("[data-reveal]").forEach((el) => ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => REDUCED ? gsap.set(el, { opacity: 1, y: 0 }) : gsap.to(el, { y: 0, opacity: 1, duration: .7, ease: "power3.out" }) }));
  // bar fills (skills + attrs)
  $$("[data-bar-fill]").forEach((bar) => { const pct = bar.dataset.barFill + "%"; ScrollTrigger.create({ trigger: bar, start: "top 94%", once: true, onEnter: () => REDUCED ? (bar.style.width = pct) : gsap.fromTo(bar, { width: 0 }, { width: pct, duration: 1, ease: "steps(20)" }) }); });

  // directional slide-ins for character + contact
  if (!REDUCED) {
    gsap.from(".char__bio", { x: -44, opacity: 0, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".char", start: "top 80%" } });
    gsap.from(".char__radar", { x: 44, opacity: 0, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".char", start: "top 80%" } });
    gsap.from(".contact__links", { x: -44, opacity: 0, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".contact", start: "top 82%" } });
    gsap.from(".form", { x: 44, opacity: 0, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".contact", start: "top 82%" } });
    const lg = $(".lang-grid");
    if (lg) ScrollTrigger.create({ trigger: lg, start: "top 85%", once: true,
      onEnter: () => gsap.from(".lang__pip.on", { scale: 0, transformOrigin: "center", duration: .3, stagger: .015, ease: "back.out(2)" }) });
  }

  // loadout cartridges deal-in (immediateRender:false → never leaves cards hidden)
  const eqGrid = $(".eq__grid");
  if (eqGrid && !REDUCED) ScrollTrigger.create({ trigger: eqGrid, start: "top 88%", once: true,
    onEnter: () => gsap.from(".eq__grid .cart", { opacity: 0, y: 24, duration: .5, stagger: .03, ease: "power3.out", immediateRender: false }) });

  // campaign log: stagger cards in
  const chronoCards = $$(".ch-card");
  if (chronoCards.length && !REDUCED) ScrollTrigger.create({ trigger: "[data-chrono]", start: "top 82%", once: true,
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

/* --------------------------------------------------------------- LOADOUT */
const rarity = (p) => p >= 88 ? ["Legendary", "leg"] : p >= 80 ? ["Epic", "epic"] : p >= 72 ? ["Rare", "rare"] : ["Common", "com"];

const KIT = [
  { n: "JavaScript", slot: "Languages", lvl: 85, ic: "bolt", c: "#F7DF1E", used: ["Beacon", "Web apps"], fl: "My daily language for the web." },
  { n: "TypeScript", slot: "Languages", lvl: 82, ic: "braces", c: "#4FA6F0", used: ["Beacon ext"], fl: "Types keep big code honest." },
  { n: "Python", slot: "Languages", lvl: 80, ic: "snake", c: "#FFD343", used: ["Automation"], fl: "Scripts, automation, data." },
  { n: "Java", slot: "Languages", lvl: 78, ic: "coffee", c: "#F0862E", used: ["OODJ APUASC"], fl: "OOP coursework & structured apps." },
  { n: "Dart", slot: "Languages", lvl: 74, ic: "target", c: "#40C4FF", used: ["NextGen Fitness"], fl: "Flutter's language of choice." },
  { n: "PHP", slot: "Languages", lvl: 70, ic: "server", c: "#A9AEE0", used: ["Backends"], fl: "Backends that just work." },
  { n: "React", slot: "Frameworks", lvl: 82, ic: "atom", c: "#61DAFB", used: ["Beacon UI"], fl: "Component-driven interfaces." },
  { n: "Flutter", slot: "Frameworks", lvl: 76, ic: "phone", c: "#54C5F8", used: ["NextGen Fitness"], fl: "One codebase, every screen." },
  { n: "Tailwind", slot: "Frameworks", lvl: 85, ic: "wind", c: "#38BDF8", used: ["This site"], fl: "Style at the speed of thought." },
  { n: "HTML / CSS", slot: "Frameworks", lvl: 90, ic: "layout", c: "#F0764B", used: ["Every frontend"], fl: "The bones of the web." },
  { n: "Node.js", slot: "Frameworks", lvl: 78, ic: "hex", c: "#7DC552", used: ["APIs & tooling"], fl: "JavaScript on the server." },
  { n: "Laravel", slot: "Frameworks", lvl: 75, ic: "server", c: "#FF5A4A", used: ["PHP backends"], fl: "Elegant PHP backends." },
  { n: "MySQL", slot: "Data", lvl: 82, ic: "database", c: "#5B9BD5", used: ["Coursework"], fl: "Relational data, done right." },
  { n: "PostgreSQL", slot: "Data", lvl: 74, ic: "database", c: "#7C9BE0", used: ["Relational data"], fl: "The powerful elephant." },
  { n: "Redis", slot: "Data", lvl: 66, ic: "database", c: "#E05545", used: ["Caching"], fl: "Fast, in-memory speed." },
  { n: "Git", slot: "Tools", lvl: 88, ic: "branch", c: "#F0623C", used: ["Since 2023"], fl: "Version control, always." },
  { n: "Docker", slot: "Tools", lvl: 68, ic: "container", c: "#4AA6F0", used: ["Services"], fl: "Ships the same everywhere." },
  { n: "Linux", slot: "Tools", lvl: 74, ic: "terminal", c: "#FCC624", used: ["Dev & servers"], fl: "Home in the terminal." },
  { n: "VS Code", slot: "Tools", lvl: 92, ic: "editor", c: "#4A95E0", used: ["Daily driver"], fl: "Where the magic happens." },
];
const pips = (lvl) => Array.from({ length: 5 }, (_, i) => `<span class="pip${i < Math.round(lvl / 20) ? " on" : ""}"></span>`).join("");

function loadout() {
  const featEl = $("[data-eq-featured]"), tabsEl = $("[data-eq-tabs]"), gridEl = $("[data-eq-grid]");
  if (!gridEl) return;
  const slots = [...new Set(KIT.map((k) => k.slot))];

  tabsEl.innerHTML = ["All", ...slots].map((s, i) => `<button class="eq__tab${i === 0 ? " on" : ""}" data-slot="${s}" data-blip>${s}</button>`).join("");
  gridEl.innerHTML = KIT.map((k, i) => `
    <button class="cart" data-i="${i}" data-slot="${k.slot}" data-r="${rarity(k.lvl)[1]}" style="--c:${k.c}" data-blip>
      <span class="cart__ico" style="color:${k.c}">${px(k.ic)}</span>
      <span class="cart__meta"><span class="cart__name">${k.n}</span><span class="cart__pips">${pips(k.lvl)}</span></span>
    </button>`).join("");

  const setFeatured = (k) => {
    const [rl, rc] = rarity(k.lvl);
    featEl.style.setProperty("--c", k.c);
    featEl.innerHTML = `
      <div class="eqf__screen" style="--c:${k.c}">
        <span class="eqf__ico" style="color:${k.c}">${px(k.ic)}</span>
        <span class="eqf__scan"></span>
        <span class="eqf__tag" data-r="${rc}">${rl}</span>
      </div>
      <div class="eqf__body">
        <p class="eqf__slot">${k.slot} slot</p>
        <h3 class="eqf__name">${k.n}</h3>
        <div class="eqf__row">
          <div class="eqf__meter">
            <svg viewBox="0 0 90 90"><circle class="ring-bg" cx="45" cy="45" r="38"/><circle class="ring-fg" data-r="${rc}" cx="45" cy="45" r="38"/></svg>
            <span class="eqf__pct">${k.lvl}<i>%</i></span>
          </div>
          <div class="eqf__info">
            <p class="eqf__used-h">Used in</p>
            <div class="eqf__used" style="--c:${k.c}">${k.used.map((u) => `<span class="eqf__chip">${u}</span>`).join("")}</div>
            <p class="eqf__flavor">${k.fl}</p>
          </div>
        </div>
      </div>`;
    const fg = $(".ring-fg", featEl);
    if (fg) { const C = 2 * Math.PI * 38; fg.style.strokeDasharray = C;
      if (gsap && !REDUCED) gsap.fromTo(fg, { strokeDashoffset: C }, { strokeDashoffset: C * (1 - k.lvl / 100), duration: .8, ease: "power2.out" });
      else fg.style.strokeDashoffset = C * (1 - k.lvl / 100); }
  };

  const carts = $$(".cart", gridEl);
  const select = (c) => { carts.forEach((x) => x.classList.remove("sel")); c.classList.add("sel"); setFeatured(KIT[+c.dataset.i]); };
  carts.forEach((c) => {
    ["mouseenter", "focus", "click"].forEach((ev) => c.addEventListener(ev, () => select(c)));
    if (!REDUCED && !TOUCH && gsap) {
      const rx = gsap.quickTo(c, "rotationX", { duration: .3 }), ry = gsap.quickTo(c, "rotationY", { duration: .3 });
      c.addEventListener("mousemove", (e) => { const r = c.getBoundingClientRect(); ry((e.clientX - (r.left + r.width / 2)) / r.width * 16); rx(-(e.clientY - (r.top + r.height / 2)) / r.height * 16); });
      c.addEventListener("mouseleave", () => { rx(0); ry(0); });
    }
  });

  $$(".eq__tab", tabsEl).forEach((tab) => tab.addEventListener("click", () => {
    $$(".eq__tab", tabsEl).forEach((x) => x.classList.remove("on")); tab.classList.add("on");
    const s = tab.dataset.slot; let first = null;
    carts.forEach((c) => { const show = s === "All" || c.dataset.slot === s; c.classList.toggle("dim", !show); c.style.pointerEvents = show ? "" : "none"; if (show && !first) first = c; });
    if (first) select(first);
  }));

  let top = carts[0], tv = -1;
  KIT.forEach((k, i) => { if (k.lvl > tv) { tv = k.lvl; top = carts[i]; } });
  select(top);
}

/* --------------------------------------------------------------- ATTRIBUTE RADAR */
function buildRadar() {
  const host = $("[data-radar]"), read = $("[data-radar-read]");
  if (!host) return;
  const cx = 100, cy = 100, R = 74, N = RADAR.length;
  const ang = (i) => (-90 + i * 360 / N) * Math.PI / 180;
  const pt = (i, r) => [+(cx + Math.cos(ang(i)) * r).toFixed(1), +(cy + Math.sin(ang(i)) * r).toFixed(1)];
  let rings = "";
  [.25, .5, .75, 1].forEach((f) => { rings += `<polygon class="rd-ring" points="${RADAR.map((_, i) => pt(i, R * f).join(",")).join(" ")}"/>`; });
  let axes = "";
  RADAR.forEach((_, i) => { const [x, y] = pt(i, R); axes += `<line class="rd-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`; });
  const area = RADAR.map((s, i) => pt(i, R * s[1] / 100).join(",")).join(" ");
  let dots = "", labels = "";
  RADAR.forEach((s, i) => {
    const [vx, vy] = pt(i, R * s[1] / 100);
    dots += `<circle class="rd-dot" data-i="${i}" cx="${vx}" cy="${vy}" r="4"/>`;
    const [lx, ly] = pt(i, R + 15); const c = Math.cos(ang(i));
    const anchor = Math.abs(c) < .35 ? "middle" : (c > 0 ? "start" : "end");
    labels += `<text class="rd-label" data-i="${i}" x="${lx}" y="${ly + 4}" text-anchor="${anchor}">${s[0]}</text>`;
  });
  host.innerHTML = `<svg viewBox="0 0 200 200" class="rd-svg" role="img" aria-label="Engineering attribute radar"><g>${rings}${axes}</g><polygon class="rd-area" points="${area}"/>${dots}${labels}</svg>`;

  const dotEls = $$(".rd-dot", host), labelEls = $$(".rd-label", host);
  const setRead = (i) => {
    const s = RADAR[i];
    read.innerHTML = `<span class="rd-read-k">◆ ${s[0]}</span> <span class="rd-read-v">${s[1]}</span> — ${s[2]}`;
    dotEls.forEach((d) => { const on = +d.dataset.i === i; d.classList.toggle("hot", on); d.setAttribute("r", on ? 6 : 4); });
    labelEls.forEach((l) => l.classList.toggle("hot", +l.dataset.i === i));
  };
  [...dotEls, ...labelEls].forEach((el) => el.addEventListener("mouseenter", () => setRead(+el.dataset.i)));
  let hi = 0; RADAR.forEach((s, i) => { if (s[1] > RADAR[hi][1]) hi = i; }); setRead(hi);

  if (gsap && ScrollTrigger && !REDUCED) {
    const areaEl = $(".rd-area", host);
    gsap.set(areaEl, { svgOrigin: "100 100", scale: 0, opacity: 0 });
    gsap.set(dotEls, { opacity: 0 });
    ScrollTrigger.create({ trigger: host, start: "top 82%", once: true, onEnter: () => {
      gsap.to(areaEl, { scale: 1, opacity: 1, duration: .9, ease: "back.out(1.5)" });
      gsap.to(dotEls, { opacity: 1, duration: .3, stagger: .06, delay: .35 });
      gsap.from($$(".rd-ring", host), { opacity: 0, duration: .5, stagger: .08 });
    } });
  }
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
const STAGE_LABEL = { edu: "Education", work: "Work" };
const STAGE_STATUS = { cleared: "✓ Cleared", active: "● Active", "in-progress": "⟳ In progress" };

function campaignLog() {
  const host = $("[data-chrono]");
  if (!host) return;
  host.innerHTML = STAGES.map((s) => {
    const bar = s.kind === "work" ? "work.log" : "edu.log";
    const typeLbl = s.kind === "work" ? "Main quest" : "Side quest";
    return `
    <article class="ch-card ch-card--${s.kind} ch-card--${s.status}" data-reveal>
      <div class="ch-card__rail" aria-hidden="true"><span class="ch-card__dot">${s.n}</span></div>
      <div class="panel ch-card__body">
        <div class="panel__bar" data-bar="${bar}"></div>
        <div class="panel__pad">
          <header class="ch-card__head">
            <div class="ch-card__meta">
              <span class="ch-card__type">${typeLbl} · ${STAGE_LABEL[s.kind]}</span>
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
  }).join("");
  paintIcons();
}

/* --------------------------------------------------------------- FORM */
const TS_KEY = "0x4AAAAAADf6GSXHdOAcmuuH", W3_KEY = "1a23a0e7-9e4b-4318-aaef-8869bd256a32", EMAIL = "jiasen27826@gmail.com";
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
  inject(); paintIcons();
  loadout(); shipReveal(); campaignLog(); buildRadar();
  flipCard(); chrome(); scrollFx(); ticker(); introEnter(); introAmbience();
  bugHunt(); memory(); konami(); contactForm();
  ScrollTrigger?.refresh();
  addEventListener("load", () => ScrollTrigger?.refresh());
}

starfield(); skyline();
boot(init);
