import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const { version } = JSON.parse(
  readFileSync(resolve("packages/mcp/package.json"), "utf8"),
) as { version: string };
const destination = resolve("artifacts/packages", version);
mkdirSync(destination, { recursive: true });
execFileSync(
  "pnpm",
  ["--dir", "packages/mcp", "pack", "--pack-destination", destination],
  { stdio: "inherit" },
);
