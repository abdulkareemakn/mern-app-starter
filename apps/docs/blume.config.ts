import { defineConfig } from "blume";

export default defineConfig({
  title: "MERN starter docs",
  description:
    "Documentation for the MERN course starter: React, Vite, TanStack Router, Express 5, MongoDB, TypeScript, and Better Auth in one pnpm workspace.",
  // Content lives in apps/docs/docs. Folders become sidebar groups; see
  // apps/docs/README.md for the authoring conventions.
  content: {
    root: "docs",
  },
  // Collapsible sidebar groups keep the eight top-level sections tidy.
  navigation: {
    sidebar: {
      display: "group",
    },
    github: { owner: "abdulkareemakn", repo: "mern-app-starter", dir: "apps/docs" },
  },
  deployment: {
    site: "https://abdulkareemakn.github.io/mern-app-starter/",
  },
});
