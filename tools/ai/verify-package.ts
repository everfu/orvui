import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import {
  StdioClientTransport,
  getDefaultEnvironment,
} from "@modelcontextprotocol/client/stdio";

// Keep consumer installations and their evidence inside this project.
const root = fileURLToPath(new URL("../../", import.meta.url));
const { version } = JSON.parse(
  readFileSync(resolve(root, "packages/mcp/package.json"), "utf8"),
) as { version: string };
const archive = resolve(
  process.argv[2] ??
    resolve(root, `artifacts/packages/${version}/orvui-vue-mcp-${version}.tgz`),
);
const output = resolve(root, "artifacts/reports/ai");
mkdirSync(output, { recursive: true });
const consumer = mkdtempSync(resolve(output, "consumer-"));
writeFileSync(
  resolve(consumer, "package.json"),
  JSON.stringify({
    private: true,
    type: "module",
    dependencies: { "@orvui/vue-mcp": `file:${archive}` },
  }),
);
execFileSync(
  "pnpm",
  [
    "--dir",
    consumer,
    "--ignore-workspace",
    "install",
    "--offline",
    "--ignore-scripts",
  ],
  { cwd: root, stdio: "inherit" },
);
const blocker = resolve(consumer, "deny-network.cjs");
writeFileSync(
  blocker,
  `const deny=()=>{throw new Error('Network access disabled during offline package verification')};
globalThis.fetch=deny;
for(const module of ['node:http','node:https'])for(const key of ['get','request'])require(module)[key]=deny;
for(const key of ['connect','createConnection'])require('node:net')[key]=deny;
require('node:net').Socket.prototype.connect=deny;
require('node:tls').connect=deny;
require('node:dns').lookup=deny;
require('node:module').syncBuiltinESMExports();\n`,
);
const transport = new StdioClientTransport({
  command: resolve(consumer, "node_modules/.bin/orvui-mcp"),
  env: {
    ...getDefaultEnvironment(),
    NODE_OPTIONS: `--require ${JSON.stringify(blocker)}`,
  },
  cwd: consumer,
  stderr: "pipe",
});
let errors = "";
transport.stderr?.on("data", (chunk) => {
  errors += String(chunk);
});
const client = new Client({ name: "orvui-offline-consumer", version: "1.0.0" });
try {
  await client.connect(transport);
  const tools = await client.listTools();
  if (tools.tools.length !== 7)
    throw new Error("Expected seven tools from the installed package.");
  const calls = [
    ["list_components", {}],
    ["get_component_docs", { slug: "button", locale: "en" }],
    ["get_component_source_code", { slug: "popover" }],
    ["get_component_source_styles", { slug: "popover" }],
    ["get_theme_variables", { palette: "violet", mode: "dark" }],
    ["get_docs", { path: "/docs/installation", locale: "en" }],
    ["get_component_skill", { slug: "prompt-input" }],
  ] as const;
  for (const [name, args] of calls) {
    const result = await client.callTool({ name, arguments: args });
    const payload = result.structuredContent as
      Record<string, unknown> | undefined;
    if (result.isError || payload?.productVersion !== version)
      throw new Error(`Installed package query failed: ${name}`);
  }
  const failure = await client.callTool({
    name: "get_component_docs",
    arguments: { slug: "missing" },
  });
  if (!failure.isError)
    throw new Error("Expected a clear error for an unknown component.");
  if (errors) throw new Error(`Unexpected server diagnostics: ${errors}`);
  const pid = transport.pid;
  await client.close();
  if (pid) {
    try {
      process.kill(pid, 0);
      throw new Error("MCP child did not exit after disconnect.");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
    }
  }
  const report = {
    productVersion: version,
    archive,
    consumer,
    tools: tools.tools.map((tool) => tool.name),
    queries: calls.length,
    offline: true,
    differentWorkingDirectory: true,
    cleanExit: true,
  };
  writeFileSync(
    resolve(output, "offline-package.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await client.close();
}
