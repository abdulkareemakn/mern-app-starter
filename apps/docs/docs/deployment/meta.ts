import { defineMeta } from "blume";

export default defineMeta({
  title: "Deployment",
  icon: "ship",
  // Position among the top-level sidebar groups.
  order: 5,
  pages: ["docker", "production-build", "behind-a-reverse-proxy"],
});
