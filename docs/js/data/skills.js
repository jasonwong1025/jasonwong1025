export const SKILLS = {
  languages: ["JavaScript", "TypeScript", "Python", "Java", "PHP"],
  frontend: ["React", "HTML/CSS", "Tailwind", "Flutter"],
  backend: ["Node.js", "Laravel"],
  data: ["MySQL", "PostgreSQL", "Redis"],
  tools: ["Git", "Docker", "Linux", "VS Code"],
};

export const SKILL_CATEGORIES = [
  { id: "languages", label: "Languages" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "data", label: "Data" },
  { id: "tools", label: "Tools" },
];

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

export const EDUCATION_TIMELINE = [
  {
    year: "Feb 2026 — Present",
    title: "BSc (Hons.) Software Engineering @ APU",
    description:
      "Pursuing a Bachelor's in Software Engineering at Asia Pacific University, Kuala Lumpur.",
  },
  {
    year: "Aug 2023 — Oct 2025",
    title: "Diploma in ICT @ APU",
    description:
      "Completed a Diploma in Information and Communication Technology at Asia Pacific University. Graduated with CGPA 3.63.",
  },
];

export const WORK_TIMELINE = [
  {
    year: "Oct 2025 — Present",
    title: "Part-time @ Codespace AI Technology",
    description:
      "Working part-time at Codespace AI Technology Sdn Bhd, continuing hands-on development after the internship.",
  },
  {
    year: "Sep — Oct 2025",
    title: "Internship @ Codespace AI Technology",
    description:
      "Completed an internship at Codespace AI Technology Sdn Bhd, gaining practical industry experience in software development.",
  },
];
