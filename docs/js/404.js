/* 404 — connection lost screen */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, c = document) => c.querySelector(s);

document.documentElement.classList.add("js");

const LOG_LINES = [
  "scanning bus for missing sector…",
  "ERR: handshake failed — no response from host",
  "trace: cable integrity 0% — both ends live",
  "recovery: reroute player to index.html",
];

function starfield() {
  const cv = $("[data-stars]");
  if (!cv || REDUCED) return;
  const ctx = cv.getContext("2d");
  let w, h, stars;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const cols = ["#C9CCF5", "#34E1E8", "#FF4FA3", "#FFC23C", "#9B7BFF"];
  const resize = () => {
    w = cv.width = innerWidth * DPR;
    h = cv.height = innerHeight * DPR;
    cv.style.width = innerWidth + "px";
    cv.style.height = innerHeight + "px";
    stars = Array.from({ length: Math.min(120, Math.floor(innerWidth / 12)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: (Math.random() * 1.4 + .5) * DPR,
      t: Math.random() * 6,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    stars.forEach((st, i) => {
      st.t += .03;
      ctx.globalAlpha = Math.max(.12, .45 + Math.sin(st.t) * .35);
      ctx.fillStyle = cols[i % cols.length];
      ctx.fillRect(st.x, st.y, st.s, st.s);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };
  resize();
  addEventListener("resize", resize);
  draw();
}

function showPath() {
  const el = $("[data-e404-path]");
  if (!el) return;
  const path = location.pathname + location.search + location.hash;
  el.textContent = path || "/";
  el.title = path;
}

function typeLog() {
  const log = $("[data-e404-log]");
  if (!log) return;
  if (REDUCED) {
    log.textContent = `> ${LOG_LINES[LOG_LINES.length - 1]}`;
    return;
  }
  let line = 0;
  let char = 0;
  log.textContent = "> ";
  const tick = () => {
    const current = LOG_LINES[line];
    if (char < current.length) {
      log.textContent += current[char++];
      setTimeout(tick, 22 + Math.random() * 18);
      return;
    }
    line++;
    if (line < LOG_LINES.length) {
      char = 0;
      log.textContent += "\n> ";
      setTimeout(tick, 380);
      return;
    }
  };
  setTimeout(tick, 600);
}

function entrance() {
  const cab = $("[data-e404-cab]");
  if (!cab) return;
  requestAnimationFrame(() => cab.classList.add("is-live"));
}

function escHome(e) {
  if (e.key === "Escape") location.href = "/";
}

starfield();
showPath();
typeLog();
entrance();
addEventListener("keydown", escHome);
