/* ========================================================================
   WONG JIA SEN — BUILD MANIFEST · interactions
   GSAP + ScrollTrigger + Draggable. All motion reduced-motion aware.
   ======================================================================== */

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Draggable = window.Draggable;
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TOUCH = window.matchMedia("(hover: none), (pointer: coarse)").matches;

document.documentElement.classList.add("js");

if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
if (gsap && Draggable) gsap.registerPlugin(Draggable);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/* ------------------------------------------------------------------ DATA */
const PROJECTS = [
  {
    id: "beacon", name: "Beacon", year: "2026", language: "TypeScript",
    description: "Chrome extension for intentional browsing — focus sessions, smart site rules, and local-only analytics. No account. No cloud.",
    topics: ["chrome-extension", "react", "productivity", "privacy"],
    repo: "https://github.com/jasonwong1025/beacon", live: "https://jasonwong1025.github.io/beacon/",
  },
  {
    id: "capstone", name: "NextGen Fitness", year: "2025", language: "Dart",
    description: "Team capstone mobile app — AI-powered fitness with personalized workout plans, meal scanning, and a nutrition chatbot. Built with Flutter, Dart, and Android Studio.",
    topics: ["flutter", "dart", "mobile", "ai"],
    repo: "https://github.com/jasonwong1025/capstone", live: null,
  },
  {
    id: "oodj", name: "OODJ APUASC", year: "2026", language: "Java",
    description: "Java program for an Automobile Service Centre System — object-oriented coursework at APU, emphasizing structured architecture and clear separation of concerns.",
    topics: ["java", "oop", "coursework", "apu"],
    repo: "https://github.com/jasonwong1025/oodj-apuasc", live: null,
  },
];

const STACK = [
  ["JavaScript", "languages"], ["TypeScript", "languages"], ["Python", "languages"], ["Java", "languages"], ["PHP", "languages"],
  ["React", "frontend"], ["HTML / CSS", "frontend"], ["Tailwind", "frontend"], ["Flutter", "frontend"],
  ["Node.js", "backend"], ["Laravel", "backend"],
  ["MySQL", "data"], ["PostgreSQL", "data"], ["Redis", "data"],
  ["Git", "tools"], ["Docker", "tools"], ["Linux", "tools"], ["VS Code", "tools"],
];

const TIMELINE = [
  { kind: "work", year: "Oct 2025 — Now", title: "Software Engineer · Codespace AI Technology", desc: "Part-time software engineer building AI-powered solutions and continuing hands-on development after the internship." },
  { kind: "work", year: "Sep — Oct 2025", title: "SE Intern · Codespace AI Technology", desc: "Internship working on AI features and real-world software development." },
  { kind: "edu", year: "Feb 2026 — Now", title: "BSc (Hons.) Software Engineering · APU", desc: "Bachelor's in Software Engineering at Asia Pacific University, Kuala Lumpur." },
  { kind: "edu", year: "Aug 2023 — Oct 2025", title: "Diploma in ICT · APU", desc: "Diploma in Information & Communication Technology. Graduated with CGPA 3.63." },
];

/* --------------------------------------------------------------- INJECT */
function injectStack() {
  const grid = $("[data-stack-grid]");
  if (!grid) return;
  grid.innerHTML = STACK.map(([name, cat]) => `
    <li class="tech" data-cat="${cat}" data-cursor-hover>
      <span class="tech__name">${name}</span>
      <span class="tech__cat">${cat}</span>
    </li>`).join("");
}

function injectProjects() {
  const wrap = $("[data-work-cards]");
  if (!wrap) return;
  wrap.innerHTML = PROJECTS.map((p, i) => {
    const idx = String(i + 1).padStart(2, "0");
    const live = p.live ? `<a class="pcard__link pcard__link--live" href="${p.live}" target="_blank" rel="noopener noreferrer" data-cursor-hover>Live ↗</a>` : "";
    return `
    <article class="pcard">
      <div class="pcard__top">
        <span class="pcard__idx">BUILD / ${idx}</span>
        <span class="pcard__lang">${p.language}</span>
      </div>
      <div class="pcard__body">
        <h3 class="pcard__name">${p.name}</h3>
        <p class="pcard__year">${p.year}</p>
        <p class="pcard__desc">${p.description}</p>
        <div class="pcard__topics">${p.topics.map((t) => `<span class="pcard__topic">${t}</span>`).join("")}</div>
      </div>
      <div class="pcard__links">
        <a class="pcard__link" href="${p.repo}" target="_blank" rel="noopener noreferrer" data-cursor-hover>Code ↗</a>
        ${live}
      </div>
    </article>`;
  }).join("");
}

function injectTimeline() {
  const tl = $("[data-timeline]");
  if (!tl) return;
  tl.innerHTML = TIMELINE.map((e) => `
    <li class="tl" data-reveal>
      <span class="tl__year">${e.year}</span>
      <div>
        <div class="tl__title">${e.title}</div>
        <div class="tl__desc">${e.desc}</div>
      </div>
      <span class="tl__tag tl__tag--${e.kind}">${e.kind === "edu" ? "Edu" : "Work"}</span>
    </li>`).join("");
}

/* ------------------------------------------------------------- PRELOADER */
function preloader(done) {
  const boot = $("[data-boot]");
  if (!boot) return done();
  const fill = $("[data-boot-fill]");
  const count = $("[data-boot-count]");
  const log = $("[data-boot-log]");
  const steps = ["resolving deps", "bundling ui", "linking gsap", "warming grid", "ready"];

  if (REDUCED || !gsap) {
    boot.classList.add("is-done");
    return done();
  }

  const state = { v: 0 };
  gsap.to(state, {
    v: 100, duration: 1.5, ease: "power2.inOut",
    onUpdate() {
      const v = Math.round(state.v);
      count.textContent = String(v).padStart(3, "0");
      fill.style.width = v + "%";
      log.textContent = steps[Math.min(steps.length - 1, Math.floor(v / 20))];
    },
    onComplete() {
      gsap.to(boot, {
        yPercent: -100, duration: .7, ease: "power4.inOut", delay: .15,
        onComplete() { boot.classList.add("is-done"); done(); },
      });
    },
  });
}

/* ---------------------------------------------------------------- CURSOR */
function cursor() {
  if (TOUCH || REDUCED || !gsap) return;
  const el = $("[data-cursor]");
  if (!el) return;
  const xTo = gsap.quickTo(el, "x", { duration: .18, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: .18, ease: "power3" });
  window.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });
  window.addEventListener("mousedown", () => el.classList.add("is-down"));
  window.addEventListener("mouseup", () => el.classList.remove("is-down"));

  const bind = () => {
    $$("[data-cursor-hover]").forEach((n) => {
      if (n.dataset.cbound) return; n.dataset.cbound = "1";
      n.addEventListener("mouseenter", () => el.classList.add("is-hover"));
      n.addEventListener("mouseleave", () => el.classList.remove("is-hover"));
    });
    $$("[data-cursor-drag]").forEach((n) => {
      if (n.dataset.dbound) return; n.dataset.dbound = "1";
      n.addEventListener("mouseenter", () => el.classList.add("is-drag"));
      n.addEventListener("mouseleave", () => el.classList.remove("is-drag"));
    });
  };
  bind();
  window.__cursorBind = bind;
}

/* -------------------------------------------------------------- MAGNETIC */
function magnetic() {
  if (TOUCH || REDUCED || !gsap) return;
  $$("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: .4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: .4, ease: "power3" });
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
  });
}

/* ----------------------------------------------------------- SPLIT WORDS */
function splitWords(el) {
  const text = el.textContent.trim();
  el.innerHTML = text.split(/\s+/).map((w) =>
    `<span class="reveal-word"><span>${w}</span></span>`
  ).join(" ");
  return $$(".reveal-word > span", el);
}

/* ---------------------------------------------------------------- THEME */
function theme() {
  const btn = $("[data-theme-toggle]");
  const label = $("[data-theme-label]");
  const sync = () => { if (label) label.textContent = (document.documentElement.dataset.theme || "light").toUpperCase(); };
  sync();
  btn?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
    ScrollTrigger?.refresh();
  });
}

/* ------------------------------------------------------------------- NAV */
function nav() {
  const bar = $("[data-nav]");
  const burger = $("[data-nav-burger]");
  const links = $$("[data-nav-links] a");

  burger?.addEventListener("click", () => {
    const open = bar.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  links.forEach((a) => a.addEventListener("click", () => {
    bar.classList.remove("is-open");
    burger?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  }));

  // active-section highlight
  if (!ScrollTrigger) return;
  $$("[data-section]").forEach((sec) => {
    const id = sec.id;
    const link = $(`[data-nav-links] a[href="#${id}"]`);
    if (!link) return;
    ScrollTrigger.create({
      trigger: sec, start: "top 45%", end: "bottom 45%",
      onToggle: (self) => link.classList.toggle("is-active", self.isActive),
    });
  });
}

/* --------------------------------------------------------------- PROGRESS */
function progress() {
  const bar = $("[data-progress]");
  if (!bar || !gsap) return;
  gsap.to(bar, {
    width: "100%", ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: .3 },
  });
}

/* ------------------------------------------------------------------ HERO */
function hero() {
  if (!gsap) return;
  const words = $$("[data-hero-word]");
  const tl = gsap.timeline({ delay: .1 });

  if (!REDUCED) {
    gsap.set(words, { yPercent: 115 });
    tl.to(words, { yPercent: 0, duration: 1, ease: "power4.out", stagger: .1 })
      .from("[data-hero-lede]", { y: 24, opacity: 0, duration: .7, ease: "power3.out" }, "-=.4")
      .from(".hero__cta .btn", { y: 20, opacity: 0, duration: .5, stagger: .1, ease: "power3.out" }, "-=.4")
      .from(".hero__top .chip", { y: -16, opacity: 0, duration: .5, stagger: .1 }, "-=.7")
      .from(".sticker", { scale: 0, rotate: 0, opacity: 0, duration: .5, stagger: .08, ease: "back.out(2)" }, "-=.3");

    // parallax drift on title
    gsap.to("[data-hero-title]", {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true },
    });
  }

  // draggable stickers
  if (Draggable && !TOUCH) {
    Draggable.create("[data-drag]", {
      type: "x,y", bounds: "#home",
      inertia: !!window.InertiaPlugin,
      onPress() { gsap.to(this.target, { scale: 1.08, duration: .2 }); },
      onRelease() { gsap.to(this.target, { scale: 1, duration: .3 }); },
    });
  }
}

/* ---------------------------------------------------------------- REVEAL */
function reveals() {
  if (!gsap || !ScrollTrigger) return;

  // word-by-word statements
  $$("[data-reveal-words]").forEach((el) => {
    if (REDUCED) return;
    const spans = splitWords(el);
    gsap.set(spans, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el, start: "top 82%",
      onEnter: () => gsap.to(spans, { yPercent: 0, duration: .9, ease: "power4.out", stagger: .04 }),
    });
  });

  if (REDUCED) return;

  $$("[data-reveal]").forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: .8, ease: "power3.out" }),
    });
  });

  $$("[data-reveal-stagger]").forEach((wrap) => {
    const kids = Array.from(wrap.children);
    ScrollTrigger.create({
      trigger: wrap, start: "top 85%",
      onEnter: () => gsap.to(kids, { y: 0, opacity: 1, duration: .7, ease: "power3.out", stagger: .07 }),
    });
  });
}

/* ------------------------------------------------------------- STACK FILTER */
function stackFilter() {
  const btns = $$("[data-stack-filters] .pill");
  const items = $$(".tech");
  btns.forEach((b) => b.addEventListener("click", () => {
    btns.forEach((x) => x.classList.remove("is-active"));
    b.classList.add("is-active");
    const f = b.dataset.filter;
    items.forEach((it) => {
      const match = f === "all" || it.dataset.cat === f;
      it.classList.toggle("is-dim", !match);
    });
  }));
}

/* --------------------------------------------------------- WORK HORIZONTAL */
function workReel() {
  if (!gsap || !ScrollTrigger) return;
  const pin = $("[data-work-pin]");
  const track = $("[data-work-track]");
  if (!pin || !track) return;

  const build = () => {
    const wide = window.innerWidth > 760;
    if (!wide || REDUCED) return; // vertical fallback = natural flow on mobile
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--pad")) || 0);
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 64),
      ease: "none",
      scrollTrigger: {
        trigger: pin, start: "top top",
        end: () => "+=" + (track.scrollWidth - window.innerWidth + 64),
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
  };
  build();

  // mobile: let cards scroll horizontally by touch (no pin)
  if (window.innerWidth <= 760) {
    track.style.overflowX = "auto";
    track.style.flexWrap = "nowrap";
  }
}

/* -------------------------------------------------------------- MARQUEES */
function marquee(trackSel, speed) {
  const track = $(trackSel);
  if (!track || !gsap) return;
  // duplicate content for seamless loop
  track.innerHTML += track.innerHTML;
  const half = track.scrollWidth / 2;
  let dir = 1;
  const tween = gsap.to(track, {
    x: -half, duration: half / speed, ease: "none", repeat: -1,
    modifiers: { x: (x) => (parseFloat(x) % half) + "px" },
  });
  if (REDUCED) { tween.pause(); return; }

  if (ScrollTrigger) {
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => {
        const d = self.direction;
        if (d !== dir) { dir = d; gsap.to(tween, { timeScale: d, duration: .3 }); }
        tween.timeScale(d * (1 + Math.min(2.5, Math.abs(self.getVelocity() / 400))));
      },
    });
  }
}

/* ----------------------------------------------------------------- COUNTS */
function counters() {
  if (!gsap || !ScrollTrigger) return;
  $$("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const pad = el.textContent.replace(/[^0]/g, "").length;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => {
        if (REDUCED) { el.textContent = end.toFixed(dec) + suffix; return; }
        gsap.to(obj, {
          v: end, duration: 1.4, ease: "power2.out",
          onUpdate() {
            let s = dec ? obj.v.toFixed(dec) : String(Math.round(obj.v));
            if (pad && !dec) s = s.padStart(pad, "0");
            el.textContent = s + suffix;
          },
        });
      },
    });
  });
}

/* ------------------------------------------------------------------ FORM */
const TURNSTILE_SITEKEY = "0x4AAAAAADf6GSXHdOAcmuuH";
const WEB3FORMS_KEY = "1a23a0e7-9e4b-4318-aaef-8869bd256a32";
const EMAIL = "jiasen27826@gmail.com";

function contactForm() {
  const form = $("[data-contact-form]");
  if (!form) return;
  const btn = $("[data-contact-submit]", form);
  const host = $("[data-turnstile]", form);
  const status = $("[data-form-status]");
  const SUBMIT_LABEL = btn ? btn.innerHTML : "";
  let verified = false, sending = false, widgetId = null, mounted = false;

  const setStatus = (msg, tone) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove("is-ok", "is-err");
    if (tone) status.classList.add(tone);
  };
  const setEnabled = (on) => {
    verified = on;
    if (!sending && btn) { btn.disabled = !on; btn.setAttribute("aria-disabled", String(!on)); }
    if (on) setStatus("Verified — ready to send.", "is-ok");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!verified) { setStatus("Complete the security check above before sending.", "is-err"); return; }
    if (sending) return;
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();
    if (!name || !email || !message) return;

    sending = true;
    btn.disabled = true; btn.setAttribute("aria-disabled", "true");
    btn.innerHTML = "Sending…";
    setStatus("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio message from ${name}`,
          from_name: name, name, email, replyto: email, message, botcheck: "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Send failed");

      form.reset();
      setEnabled(false);
      if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
      setStatus("Message sent — I'll get back to you soon.", "is-ok");
    } catch {
      setStatus(`Could not send. Email ${EMAIL} directly.`, "is-err");
      btn.disabled = false; btn.setAttribute("aria-disabled", "false");
    } finally {
      sending = false;
      btn.innerHTML = SUBMIT_LABEL;
      if (!verified) { btn.disabled = true; btn.setAttribute("aria-disabled", "true"); }
    }
  });

  const mount = () => {
    if (mounted || !window.turnstile || !host) return;
    mounted = true;
    widgetId = window.turnstile.render(host, {
      sitekey: TURNSTILE_SITEKEY,
      theme: "auto",
      callback: () => setEnabled(true),
      "error-callback": () => { setEnabled(false); setStatus("Verification failed to load. Refresh or email directly.", "is-err"); },
      "expired-callback": () => {
        setEnabled(false);
        setStatus("Verification expired — complete the check again.", "is-err");
        if (widgetId !== null) window.turnstile.reset(widgetId);
      },
    });
  };
  const boot = () => {
    if (window.turnstile) { window.turnstile.ready(mount); return; }
    let n = 0;
    const t = setInterval(() => {
      if (window.turnstile) { clearInterval(t); window.turnstile.ready(mount); return; }
      if (++n >= 100) { clearInterval(t); setStatus(`Verification could not load. Email ${EMAIL} directly.`, "is-err"); }
    }, 100);
  };
  boot();
}

/* -------------------------------------------------------------- SCROLL TOP */
function scrollTop() {
  $("[data-scroll-top]")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
  });
}

/* ================================================================== BOOT */
function init() {
  injectStack();
  injectProjects();
  injectTimeline();

  theme();
  nav();
  cursor();          // bind base cursor
  window.__cursorBind?.();
  magnetic();
  progress();
  hero();
  reveals();
  stackFilter();
  workReel();
  counters();
  contactForm();
  scrollTop();

  marquee("[data-ticker-track]", 90);
  marquee("[data-footer-track]", 70);

  // rebind cursor to freshly injected nodes
  window.__cursorBind?.();

  ScrollTrigger?.refresh();
  window.addEventListener("load", () => ScrollTrigger?.refresh());
}

preloader(init);
