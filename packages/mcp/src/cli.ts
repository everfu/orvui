#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { loadData } from "./data.js";
import { createServer } from "./server.js";

async function main() {
  const server = createServer(loadData());
  await server.connect(new StdioServerTransport());
  const close = async () => {
    await server.close();
    process.exitCode = 0;
  };
  process.once("SIGINT", close);
  process.once("SIGTERM", close);
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
