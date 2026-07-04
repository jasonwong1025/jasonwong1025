/* ========================================================================
   WONG JIA SEN — PROSE & CODE · interactions
   Lenis smooth scroll + GSAP ScrollTrigger. Reduced-motion aware.
   ======================================================================== */

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TOUCH = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const EASE = "power4.out";

document.documentElement.classList.add("js");
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/* --------------------------------------------------------------- DATA */
const PROJECTS = [
  { name: "Beacon", year: "2026", language: "TypeScript", role: "Solo",
    desc: "A Chrome extension for intentional browsing — focus sessions, smart site rules, and local-only analytics. No account. No cloud.",
    topics: ["chrome-extension", "react", "privacy"],
    repo: "https://github.com/jasonwong1025/beacon", live: "https://jasonwong1025.github.io/beacon/" },
  { name: "NextGen Fitness", year: "2025", language: "Dart · Flutter", role: "Team capstone",
    desc: "An AI-powered fitness app with personalized workout plans, meal scanning, and a nutrition chatbot. Built with Flutter, Dart, and Android Studio.",
    topics: ["flutter", "mobile", "ai"],
    repo: "https://github.com/jasonwong1025/capstone", live: null },
  { name: "OODJ APUASC", year: "2026", language: "Java", role: "Coursework",
    desc: "An Automobile Service Centre System in Java — object-oriented coursework at APU built around structured architecture and clear separation of concerns.",
    topics: ["java", "oop", "apu"],
    repo: "https://github.com/jasonwong1025/oodj-apuasc", live: null },
];

const TOOLKIT = [
  ["Languages", ["JavaScript", "TypeScript", "Python", "Java", "PHP"]],
  ["Frontend", ["React", "HTML / CSS", "Tailwind", "Flutter"]],
  ["Backend", ["Node.js", "Laravel"]],
  ["Data", ["MySQL", "PostgreSQL", "Redis"]],
  ["Tools", ["Git", "Docker", "Linux", "VS Code"]],
];

const RECORD = [
  { year: "Oct 2025 — Now", title: "Software Engineer, Codespace AI Technology", tag: "Work",
    desc: "Building AI-powered solutions part-time, continuing hands-on development after the internship." },
  { year: "Sep — Oct 2025", title: "Software Engineering Intern, Codespace AI", tag: "Work",
    desc: "Worked on AI features and real-world software development." },
  { year: "Feb 2026 — Now", title: "BSc (Hons.) Software Engineering, APU", tag: "Education",
    desc: "Bachelor's in Software Engineering at Asia Pacific University, Kuala Lumpur." },
  { year: "Aug 2023 — Oct 2025", title: "Diploma in ICT, APU", tag: "Education",
    desc: "Diploma in Information & Communication Technology. Graduated with CGPA 3.63." },
];

const TOKENS = ["const", "{ }", "=>", "git push", "async", "return", "<Ship/>", ";", "0x1F", "npm run",
  "[ ]", "#", "// todo", "await", "∞", "λ", "e", "a", "f", "g", "n", "s", "r", "z", "d", "m"];

/* --------------------------------------------------------------- INJECT */
function injectEntries() {
  const host = $("[data-entries]");
  if (!host) return;
  host.innerHTML = PROJECTS.map((p, i) => {
    const tone = i % 2 === 0 ? "panel--bone" : "panel--ink";
    const flip = i % 2 === 1 ? " entry--flip" : "";
    const mono = p.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
    const no = "Nº " + String(i + 1).padStart(2, "0");
    const live = p.live ? `<a class="entry__link" href="${p.live}" target="_blank" rel="noopener noreferrer" data-link>Live ↗</a>` : "";
    return `
    <article class="entry ${tone}${flip}" data-entry>
      <div class="entry__grid">
        <div class="entry__media" data-cur-open>
          <span class="entry__media-mark">${mono}</span>
          <span class="entry__media-tag">Preview — image coming soon</span>
        </div>
        <div class="entry__body">
          <p class="entry__no">${no}</p>
          <h3 class="entry__name">${p.name}</h3>
          <p class="entry__meta">${p.year} · ${p.language} · ${p.role}</p>
          <p class="entry__desc">${p.desc}</p>
          <div class="entry__topics">${p.topics.map((t) => `<span class="entry__topic">${t}</span>`).join("")}</div>
          <div class="entry__links">
            <a class="entry__link" href="${p.repo}" target="_blank" rel="noopener noreferrer" data-link>View code ↗</a>
            ${live}
          </div>
        </div>
      </div>
    </article>`;
  }).join("");
}

function injectToolkit() {
  const host = $("[data-toolkit]");
  if (!host) return;
  host.innerHTML = TOOLKIT.map(([cat, items]) => `
    <div class="tk-row">
      <span class="tk-row__cat">${cat}</span>
      <div class="tk-row__items">
        ${items.map((it) => `<span class="tk-item" data-word="${it}">${it}</span>`).join("")}
      </div>
    </div>`).join("");
}

function injectRecord() {
  const host = $("[data-record]");
  if (!host) return;
  host.innerHTML = RECORD.map((r) => `
    <li class="rec__item" data-fade>
      <span class="rec__year">${r.year}</span>
      <div><div class="rec__title">${r.title}</div><p class="rec__desc">${r.desc}</p></div>
      <span class="rec__tag">${r.tag}</span>
    </li>`).join("");
}

function injectTokens() {
  const host = $("[data-tokens]");
  if (!host || REDUCED) return;
  host.innerHTML = TOKENS.map((t, i) => {
    const serif = t.length === 1 && /[a-z]/.test(t) ? " token--serif" : "";
    const x = Math.random() * 96 + 2;
    const y = Math.random() * 92 + 2;
    return `<span class="token${serif}" data-token style="left:${x}%;top:${y}%">${t}</span>`;
  }).join("");
}

/* --------------------------------------------------------------- LENIS */
let lenis = null;
function smoothScroll() {
  if (REDUCED || !Lenis) return;
  document.body.classList.add("lenis");
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on("scroll", () => ScrollTrigger && ScrollTrigger.update());
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { offset: 0 });
  else (typeof target === "string" ? $(target) : target)?.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
}

/* --------------------------------------------------------------- CURSOR */
function cursor() {
  if (TOUCH || REDUCED || !gsap) return;
  const el = $("[data-cur]");
  const label = $("[data-cur-label]");
  if (!el) return;
  const xTo = gsap.quickTo(el, "x", { duration: .5, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: .5, ease: "power3" });
  window.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });

  const bind = () => {
    $$("[data-link]").forEach((n) => {
      if (n.dataset.cb) return; n.dataset.cb = "1";
      n.addEventListener("mouseenter", () => el.classList.add("is-hover"));
      n.addEventListener("mouseleave", () => el.classList.remove("is-hover"));
    });
    $$("[data-cur-open]").forEach((n) => {
      if (n.dataset.co) return; n.dataset.co = "1";
      n.addEventListener("mouseenter", () => { el.classList.add("is-open"); if (label) label.textContent = "Open"; });
      n.addEventListener("mouseleave", () => { el.classList.remove("is-open"); if (label) label.textContent = ""; });
    });
  };
  bind();
  window.__bindCur = bind;
}

/* --------------------------------------------------------------- MAGNETIC */
function magnetic() {
  if (TOUCH || REDUCED || !gsap) return;
  $$("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: .5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: .5, ease: "power3" });
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * .3);
      yTo((e.clientY - (r.top + r.height / 2)) * .3);
    });
    el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
  });
}

/* --------------------------------------------------------------- PRELOADER */
function preloader(done) {
  const pre = $("[data-pre]");
  document.body.classList.add("pre-lock");
  if (!pre || REDUCED || !gsap) {
    if (pre) pre.classList.add("is-done");
    document.body.classList.remove("pre-lock");
    return done();
  }
  const line = $("[data-pre-line]");
  const count = $("[data-pre-count]");
  const st = { v: 0 };
  gsap.timeline()
    .to(st, { v: 100, duration: 1.4, ease: "power2.inOut", onUpdate() {
      count.textContent = Math.round(st.v);
      line.style.width = st.v + "%";
    } })
    .to(pre, { yPercent: -100, duration: .9, ease: "power4.inOut", delay: .15,
      onComplete() { pre.classList.add("is-done"); document.body.classList.remove("pre-lock"); done(); } });
}

/* --------------------------------------------------------------- LINES */
function wrapLines() {
  $$("[data-line]").forEach((el) => {
    if (el.parentElement.classList.contains("line-mask")) return;
    const m = document.createElement("span");
    m.className = "line-mask";
    el.parentNode.insertBefore(m, el);
    m.appendChild(el);
  });
}

/* --------------------------------------------------------------- HERO */
function heroReveal() {
  if (!gsap) return;
  const lines = $$(".cover__title [data-line]");
  const tl = gsap.timeline({ delay: .1 });
  if (!REDUCED) {
    gsap.set(lines, { yPercent: 115 });
    tl.to(lines, { yPercent: 0, duration: 1.1, ease: EASE, stagger: .12 })
      .from(".cover .eyebrow", { y: 16, opacity: 0, duration: .7 }, "-=.7")
      .from(".cover__sub", { y: 18, opacity: 0, duration: .7 }, "-=.5")
      .from(".cover__cta > *", { y: 16, opacity: 0, duration: .6, stagger: .1 }, "-=.5")
      .from(".cover__scroll", { opacity: 0, duration: .6 }, "-=.3");
  }
  // token ambient drift + parallax
  if (!REDUCED) {
    $$("[data-token]").forEach((t) => {
      const depth = 0.3 + Math.random() * 1.2;
      t._depth = depth;
      gsap.to(t, { x: `random(-40,40)`, y: `random(-40,40)`, duration: 6 + Math.random() * 6,
        repeat: -1, yoyo: true, ease: "sine.inOut" });
    });
    const cover = $("#cover");
    cover?.addEventListener("mousemove", (e) => {
      const cx = (e.clientX / window.innerWidth - .5) * 2;
      const cy = (e.clientY / window.innerHeight - .5) * 2;
      $$("[data-token]").forEach((t) => {
        gsap.to(t, { xPercent: cx * 12 * (t._depth || 1), yPercent: cy * 12 * (t._depth || 1), duration: 1, ease: "power2.out", overwrite: "auto" });
      });
    });
    // parallax tokens on scroll
    gsap.to(".tokens", { yPercent: 30, ease: "none", scrollTrigger: { trigger: "#cover", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".cover__inner", { yPercent: 12, opacity: .3, ease: "none", scrollTrigger: { trigger: "#cover", start: "top top", end: "bottom top", scrub: true } });
  }
}

/* --------------------------------------------------------------- REVEALS */
function reveals() {
  if (!gsap || !ScrollTrigger) return;

  // line-reveal titles (skip cover, handled separately)
  $$("[data-reveal-lines]").forEach((c) => {
    const lines = $$("[data-line]", c);
    if (!lines.length) {
      if (REDUCED) return;
      gsap.set(c, { opacity: 0, y: 22 });
      ScrollTrigger.create({ trigger: c, start: "top 85%", once: true,
        onEnter: () => gsap.to(c, { y: 0, opacity: 1, duration: .9, ease: EASE }) });
      return;
    }
    if (REDUCED) return;
    gsap.set(lines, { yPercent: 115 });
    ScrollTrigger.create({ trigger: c, start: "top 82%", once: true,
      onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1, ease: EASE, stagger: .12 }) });
  });

  if (REDUCED) return;

  $$("[data-fade]").forEach((el) => {
    if ($(".cover", document)?.contains(el)) return; // cover handled by hero
    ScrollTrigger.create({ trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: .9, ease: EASE }) });
  });

  // entries: media parallax + body fade
  $$("[data-entry]").forEach((entry) => {
    const media = $(".entry__media", entry);
    const body = $(".entry__body", entry);
    gsap.set(body, { opacity: 0, y: 30 });
    ScrollTrigger.create({ trigger: entry, start: "top 78%", once: true,
      onEnter: () => gsap.to(body, { opacity: 1, y: 0, duration: 1, ease: EASE }) });
    if (media) {
      gsap.fromTo(media, { yPercent: 8 }, { yPercent: -8, ease: "none",
        scrollTrigger: { trigger: entry, start: "top bottom", end: "bottom top", scrub: true } });
    }
  });
}

/* --------------------------------------------------------------- TOOLKIT */
function toolkitHover() {
  const word = $("[data-toolkit-word]");
  if (!word) return;
  $$(".tk-item").forEach((it) => {
    it.addEventListener("mouseenter", () => { word.textContent = it.dataset.word; word.style.opacity = ".12"; });
    it.addEventListener("mouseleave", () => { word.style.opacity = "0"; });
  });
}

/* --------------------------------------------------------------- NAV / RAIL */
function navAndRail() {
  const bar = $("[data-nav]");
  const menu = $("[data-nav-menu]");
  const railNow = $("[data-rail-now]");
  const railFill = $("[data-rail-fill]");

  // smooth anchor scroll
  $$("[data-link][href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1 && $(id)) {
        e.preventDefault();
        scrollToTarget(id);
        bar?.classList.remove("is-open");
        menu?.classList.remove("is-open");
        menu?.setAttribute("aria-expanded", "false");
      }
    });
  });

  menu?.addEventListener("click", () => {
    const open = bar.classList.toggle("is-open");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
  });

  $("[data-scroll-top]")?.addEventListener("click", () => scrollToTarget("#cover"));

  if (!ScrollTrigger) return;
  $$("[data-panel]").forEach((sec) => {
    const name = sec.dataset.panel;
    const link = $(`.nav__links a[href="#${sec.id}"]`);
    ScrollTrigger.create({ trigger: sec, start: "top 50%", end: "bottom 50%",
      onToggle: (self) => { if (self.isActive && railNow) railNow.textContent = name; link?.classList.toggle("is-active", self.isActive); } });
  });

  if (railFill) {
    gsap.to(railFill, { height: "100%", ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .3 } });
  }
}

/* --------------------------------------------------------------- FORM */
const TURNSTILE_SITEKEY = "0x4AAAAAADf6GSXHdOAcmuuH";
const WEB3FORMS_KEY = "1a23a0e7-9e4b-4318-aaef-8869bd256a32";
const EMAIL = "jiasen27826@gmail.com";

function contactForm() {
  const form = $("[data-contact-form]");
  if (!form) return;
  const btn = $("[data-contact-submit]", form);
  const host = $("[data-turnstile]", form);
  const status = $("[data-form-status]");
  const LABEL = btn ? btn.innerHTML : "";
  let verified = false, sending = false, widgetId = null, mounted = false;

  const setStatus = (m, tone) => { if (!status) return; status.textContent = m; status.classList.remove("is-ok", "is-err"); if (tone) status.classList.add(tone); };
  const setEnabled = (on) => { verified = on; if (!sending && btn) { btn.disabled = !on; btn.setAttribute("aria-disabled", String(!on)); } if (on) setStatus("Verified — ready to send.", "is-ok"); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!verified) { setStatus("Complete the security check above before sending.", "is-err"); return; }
    if (sending || !form.reportValidity()) return;
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();
    if (!name || !email || !message) return;

    sending = true; btn.disabled = true; btn.setAttribute("aria-disabled", "true"); btn.innerHTML = "Sending…"; setStatus("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject: `Portfolio message from ${name}`, from_name: name, name, email, replyto: email, message, botcheck: "" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Send failed");
      form.reset(); setEnabled(false);
      if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
      setStatus("Message sent — I'll get back to you soon.", "is-ok");
    } catch {
      setStatus(`Could not send. Email ${EMAIL} directly.`, "is-err");
      btn.disabled = false; btn.setAttribute("aria-disabled", "false");
    } finally {
      sending = false; btn.innerHTML = LABEL;
      if (!verified) { btn.disabled = true; btn.setAttribute("aria-disabled", "true"); }
    }
  });

  const mount = () => {
    if (mounted || !window.turnstile || !host) return;
    mounted = true;
    widgetId = window.turnstile.render(host, {
      sitekey: TURNSTILE_SITEKEY, theme: "light",
      callback: () => setEnabled(true),
      "error-callback": () => { setEnabled(false); setStatus("Verification failed to load. Refresh or email directly.", "is-err"); },
      "expired-callback": () => { setEnabled(false); setStatus("Verification expired — complete the check again.", "is-err"); if (widgetId !== null) window.turnstile.reset(widgetId); },
    });
  };
  const boot = () => {
    if (window.turnstile) { window.turnstile.ready(mount); return; }
    let n = 0; const t = setInterval(() => {
      if (window.turnstile) { clearInterval(t); window.turnstile.ready(mount); return; }
      if (++n >= 100) { clearInterval(t); setStatus(`Verification could not load. Email ${EMAIL} directly.`, "is-err"); }
    }, 100);
  };
  boot();
}

/* ================================================================== INIT */
function init() {
  injectEntries();
  injectToolkit();
  injectRecord();
  injectTokens();

  wrapLines();
  smoothScroll();
  heroReveal();
  cursor();
  magnetic();
  reveals();
  toolkitHover();
  navAndRail();
  contactForm();
  window.__bindCur?.();

  ScrollTrigger?.refresh();
  window.addEventListener("load", () => ScrollTrigger?.refresh());
}

preloader(init);
