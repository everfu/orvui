import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { join, resolve } from "node:path";

const reports = resolve("artifacts/reports/docs-nuxt");
mkdirSync(reports, { recursive: true });
const directory = mkdtempSync(join(reports, "standalone-"));
const output = join(directory, ".output");
cpSync(resolve(process.env.ORVUI_DOCS_OUTPUT ?? "apps/docs/.output"), output, {
  recursive: true,
});
const probe = createServer();
await new Promise((done, fail) => {
  probe.once("error", fail);
  probe.listen(0, "127.0.0.1", done);
});
const port = probe.address().port;
await new Promise((done) => probe.close(done));

// Deny the production process access to the workspace, not just its source
// directory. Missing external dependencies cannot fall back to root node_modules.
const child = spawn(
  process.execPath,
  ["--permission", `--allow-fs-read=${output}`, "server/index.mjs"],
  {
    cwd: output,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: String(port),
      NITRO_HOST: "127.0.0.1",
      NITRO_PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let logs = "";
const exited = new Promise((done) => child.once("exit", done));
const paths = [
  "/",
  "/en/",
  "/guide",
  "/components/motion/switch",
  "/en/components/blocks/wallet-card",
  "/components/agents/tool-result",
  "/charts/donut-chart",
  "/r/button.json",
  "/r/button/raw.txt",
  "/components/motion/button.md",
  "/fonts/source/geist-latin-400-normal.woff2",
];
try {
  await new Promise((done, fail) => {
    const timeout = setTimeout(
      () => fail(new Error("Standalone server startup timed out")),
      20000,
    );
    child.on("error", (error) => {
      clearTimeout(timeout);
      fail(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timeout);
      fail(new Error(`Standalone server exited: ${code}\n${logs}`));
    });
    child.stdout.on("data", (chunk) => {
      logs += chunk;
      if (logs.includes("Listening on")) {
        clearTimeout(timeout);
        done();
      }
    });
    child.stderr.on("data", (chunk) => {
      logs += chunk;
    });
  });
  const origin = `http://127.0.0.1:${port}`;
  for (const path of paths) {
    const response = await fetch(origin + path, {
      headers: { accept: "text/html" },
    });
    assert.equal(response.status, 200, `${path}: standalone HTTP status`);
    const body = await response.text();
    assert.ok(body.length > 0, `${path}: standalone content`);
    if (path === "/") {
      const assets = [
        ...body.matchAll(/(?:href|src)="(\/_nuxt\/[^"?]+\.(?:js|css))"/g),
      ].map((match) => match[1]);
      assert.ok(assets.length > 0, "Standalone client assets");
      for (const asset of assets)
        assert.equal((await fetch(origin + asset)).status, 200, asset);
    }
  }
  assert.ok(!logs.includes("ERR_ACCESS_DENIED"), logs);
  const report = {
    passed: true,
    filesystemAccess: "copied .output only",
    checked: paths,
    node: process.version,
  };
  writeFileSync(
    join(reports, "standalone.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  child.kill("SIGTERM");
  await exited;
  writeFileSync(join(reports, "standalone.log"), logs);
  rmSync(directory, { recursive: true, force: true });
}
