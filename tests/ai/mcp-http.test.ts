// @vitest-environment node
import { afterAll, beforeAll, expect, it, vi } from "vitest";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { createAiData } from "../../tools/ai/build";
import { createHttpHandler } from "../../packages/mcp/src/http";

let handle: ReturnType<typeof createHttpHandler>;
const log = vi.spyOn(console, "info").mockImplementation(() => {});
beforeAll(() => {
  handle = createHttpHandler(createAiData());
});
afterAll(() => {
  log.mockRestore();
});
const endpoint = new URL("https://orvui.example/mcp");
function connect(name: string) {
  const client = new Client({ name, version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(endpoint, {
    fetch: async (url, options) => handle(new Request(url, options)),
  });
  return { client, transport };
}

it("connects an anonymous real HTTP client and serves every tool from fresh request state", async () => {
  const { client, transport } = connect("http-test");
  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(7);
    expect(tools.every((tool) => tool.annotations?.readOnlyHint)).toBe(true);
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
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toMatchObject({
        productVersion: client.getServerVersion()?.version,
      });
    }
    expect(
      (
        await client.callTool({
          name: "get_component_docs",
          arguments: { slug: "missing" },
        })
      ).isError,
    ).toBe(true);
    expect(
      log.mock.calls.some(
        ([entry]) => JSON.parse(String(entry)).tool === "get_component_docs",
      ),
    ).toBe(true);
  } finally {
    await client.close();
  }
});

it("isolates concurrent clients without requiring a persistent session", async () => {
  const clients = [connect("first"), connect("second")];
  try {
    await Promise.all(
      clients.map(({ client, transport }) => client.connect(transport)),
    );
    const responses = await Promise.all(
      clients.map(({ client }, index) =>
        client.callTool({
          name: "get_component_docs",
          arguments: { slug: index ? "popover" : "button" },
        }),
      ),
    );
    expect(
      responses.map(
        (response) => (response.structuredContent as { source: string }).source,
      ),
    ).toEqual([
      "https://orvui.efu.me/components/motion/button",
      "https://orvui.efu.me/components/motion/popover",
    ]);
  } finally {
    await Promise.all(clients.map(({ client }) => client.close()));
  }
});

it("answers browser preflight and rejects long-lived GET connections", async () => {
  const options = await handle(
    new Request(endpoint, {
      method: "OPTIONS",
      headers: {
        Origin: "https://client.example",
        "Access-Control-Request-Headers": "mcp-protocol-version,content-type",
      },
    }),
  );
  expect(options.status).toBe(204);
  expect(options.headers.get("Access-Control-Allow-Origin")).toBe("*");
  expect(options.headers.get("Access-Control-Allow-Headers")).toMatch(
    /MCP-Protocol-Version/i,
  );
  const get = await handle(
    new Request(endpoint, { headers: { Accept: "text/event-stream" } }),
  );
  expect(get.status).toBe(405);
  expect(get.headers.get("Allow")).toBe("POST, OPTIONS");
});

it("leaves protocol parsing to the SDK and bounds request size", async () => {
  const request = (
    body: string,
    accept = "application/json, text/event-stream",
  ) =>
    new Request(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: accept },
      body,
    });
  expect((await handle(request("{"))).status).toBe(400);
  expect((await handle(request("{}", "application/json"))).status).toBe(406);
  const large = await handle(
    request(JSON.stringify({ payload: "a".repeat(65 * 1024) })),
  );
  expect(large.status).toBe(413);
  expect(large.headers.get("Cache-Control")).toBe("no-store");
});

it("accepts legacy MCP handshakes and subsequent requests on independent invocations", async () => {
  const post = (body: unknown) =>
    handle(
      new Request(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          "MCP-Protocol-Version": "2025-03-26",
        },
        body: JSON.stringify(body),
      }),
    );
  const initialize = await post({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "legacy-client", version: "1.0.0" },
    },
  });
  expect(initialize.status).toBe(200);
  expect(initialize.headers.get("Mcp-Session-Id")).toBeNull();
  const list = await post({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  });
  expect(list.status).toBe(200);
  expect((await list.json()).result.tools).toHaveLength(7);
});
