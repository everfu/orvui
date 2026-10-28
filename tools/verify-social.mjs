import { spawnSync } from "node:child_process";
// Social checks share the SSR route manifest and run against real responses.
const result = spawnSync(
  "pnpm",
  [
    "exec",
    "tsx",
    "tools/docs/verify-nuxt.ts",
    process.argv[2] ?? process.env.ORVUI_NUXT_URL ?? "http://127.0.0.1:5174",
  ],
  { stdio: "inherit" },
);
process.exitCode = result.status ?? 1;
