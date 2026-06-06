export const PROJECTS = [
  {
    id: "beacon",
    name: "Beacon",
    year: "2026",
    description:
      "Chrome extension for intentional browsing — focus sessions, smart site rules, and local-only analytics. No account. No cloud.",
    language: "TypeScript",
    stars: 5,
    topics: ["chrome-extension", "react", "productivity", "privacy"],
    links: {
      repo: "https://github.com/jasonwong1025/beacon",
      live: "https://jasonwong1025.github.io/beacon/",
    },
    featured: true,
  },
  {
    id: "oodj-apuasc",
    name: "OODJ APUASC",
    year: "2026",
    description:
      "Object-oriented design project built for APU coursework — Java application with structured architecture and clean separation of concerns.",
    language: "Java",
    stars: 1,
    topics: ["java", "ood", "university"],
    links: {
      repo: "https://github.com/jasonwong1025/oodj-apuasc",
    },
    featured: true,
  },
  {
    id: "profile",
    name: "Dev Profile",
    year: "2026",
    description:
      "Dynamic GitHub profile README with stats, streaks, and animated visuals — a living snapshot of my open-source presence.",
    language: "Markdown",
    stars: 0,
    topics: ["github", "profile"],
    links: {
      repo: "https://github.com/jasonwong1025/jasonwong1025",
    },
    featured: false,
  },
];

export function getFeaturedProjects() {
  return PROJECTS.filter((p) => p.featured);
}

export function getProjectById(id) {
  return PROJECTS.find((p) => p.id === id);
}
