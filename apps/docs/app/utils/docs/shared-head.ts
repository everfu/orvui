export type DocsHeadConfig =
  [string, Record<string, string>] | [string, Record<string, string>, string];

export const notFoundRobots: DocsHeadConfig = [
  "meta",
  { name: "robots", content: "noindex, nofollow" },
];
