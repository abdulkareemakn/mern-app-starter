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
  },
  // Disable "Was this helpful?" feedback widget on each page
  feedback: false,
  deployment: {
    site: "https://abdulkareemakn.github.io/mern-app-starter/",
  },
});