import { defineMeta } from "blume";

export default defineMeta({
  title: "Reference",
  icon: "list-checks",
  // Position among the top-level sidebar groups.
  order: 6,
  pages: ["commands", "api-endpoints", "security-checklist"],
});
