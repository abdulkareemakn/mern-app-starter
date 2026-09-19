import { defineMeta } from "blume";

export default defineMeta({
  title: "Getting started",
  icon: "rocket",
  // Position among the top-level sidebar groups.
  order: 1,
  pages: [
    "prerequisites",
    "installation",
    "project-structure",
    "development-workflow",
  ],
});
