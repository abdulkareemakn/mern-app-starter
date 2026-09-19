import { defineMeta } from "blume";

export default defineMeta({
  title: "Configuration",
  icon: "settings",
  // Position among the top-level sidebar groups.
  order: 4,
  pages: ["environment-variables", "server-configuration"],
});
