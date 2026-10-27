import type { HeadConfig } from "vitepress";

export const notFoundRobots: HeadConfig = [
  "meta",
  { name: "robots", content: "noindex, nofollow" },
];
