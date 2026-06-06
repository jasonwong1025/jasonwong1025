export const SKILLS = {
  languages: ["JavaScript", "TypeScript", "Python", "Java", "PHP"],
  frontend: ["React", "HTML/CSS", "Tailwind", "Flutter"],
  backend: ["Node.js", "Laravel", "REST APIs"],
  data: ["MySQL", "PostgreSQL", "Redis"],
  tools: ["Git", "Docker", "Linux", "VS Code"],
};

export const SKILLS_FLAT = [
  ...SKILLS.languages,
  ...SKILLS.frontend,
  ...SKILLS.backend,
  ...SKILLS.data,
  ...SKILLS.tools,
];

export const VALUES = [
  {
    key: "Craft",
    value: "Clean, maintainable code over clever one-liners. Software that reads well and lasts.",
  },
  {
    key: "Depth",
    value: "Understanding systems end-to-end — from polished UI to solid APIs and data layers.",
  },
  {
    key: "Growth",
    value: "Always exploring new languages, tools, and patterns. Student mindset, builder energy.",
  },
  {
    key: "Open",
    value: "Available for collaboration, freelance, and open-source. Let's build something useful.",
  },
];

export const TIMELINE = [
  {
    year: "2023 — Present",
    title: "Software Engineering @ APU",
    description:
      "Pursuing a degree in Software Engineering at Asia Pacific University, Kuala Lumpur. Coursework spans OOD, web development, and full-stack projects.",
  },
  {
    year: "2026",
    title: "Beacon — Chrome Extension",
    description:
      "Shipped a privacy-first productivity extension with focus sessions, site rules, and local analytics. React + TypeScript + Manifest V3.",
  },
  {
    year: "Ongoing",
    title: "Open Source & Learning",
    description:
      "Building in public on GitHub — experimenting with TypeScript, React, Laravel, Flutter, and whatever solves the problem at hand.",
  },
];
