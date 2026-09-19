import { defineMeta } from "blume";

export default defineMeta({
  title: "Architecture",
  icon: "layers",
  // Position among the top-level sidebar groups.
  order: 2,
  pages: [
    "request-lifecycle",
    "authentication",
    "shared-contracts",
    "data-and-models",
  ],
});
