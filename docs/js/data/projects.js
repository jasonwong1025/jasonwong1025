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
    id: "capstone",
    name: "NextGen Fitness",
    year: "2025",
    description:
      "Team capstone mobile app — AI-powered fitness with personalized workout plans, meal scanning, and a nutrition chatbot. Built with Flutter, Dart, and Android Studio.",
    language: "Dart",
    stars: 4,
    topics: ["flutter", "dart", "mobile", "ai", "capstone"],
    links: {
      repo: "https://github.com/jasonwong1025/capstone",
    },
    featured: true,
  },
  {
    id: "oodj-apuasc",
    name: "OODJ APUASC",
    year: "2026",
    description:
      "Java program for an Automobile Service Centre System — developed as an object-oriented coursework project at APU, emphasizing structured architecture and clear separation of concerns.",
    language: "Java",
    stars: 2,
    topics: ["java", "automobile-service", "assignment", "apu"],
    links: {
      repo: "https://github.com/jasonwong1025/oodj-apuasc",
    },
    featured: true,
  },
];

export function getFeaturedProjects() {
  return PROJECTS.filter((p) => p.featured);
}

export function getProjectById(id) {
  return PROJECTS.find((p) => p.id === id);
}
