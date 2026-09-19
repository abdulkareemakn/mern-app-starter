import { defineMeta } from "blume";

export default defineMeta({
  title: "Guides",
  icon: "compass",
  // Position among the top-level sidebar groups.
  order: 3,
  pages: [
    "add-an-api-route",
    "add-a-data-model",
    "add-a-client-page",
    "protect-a-route",
  ],
});
