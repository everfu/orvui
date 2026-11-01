import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { loadData } from "../../packages/mcp/src/data";
import { mcpEndpointUrl } from "../distribution";

const endpoint = new URL(process.argv[2] ?? mcpEndpointUrl);
const expected = loadData();
const client = new Client({ name: "orvui-remote-verifier", version: "1.0.0" });
const requests: { method: string; status: number; bytes: number }[] = [];
const transport = new StreamableHTTPClientTransport(endpoint, {
  fetch: async (url, init) => {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.any([
        AbortSignal.timeout(30_000),
        ...(init?.signal ? [init.signal] : []),
      ]),
    });
    const body = await response.clone().arrayBuffer();
    requests.push({
      method: init?.method ?? "GET",
      status: response.status,
      bytes: body.byteLength,
    });
    return response;
  },
});
const toolNames = [
  "list_components",
  "get_component_docs",
  "get_component_source_code",
  "get_component_source_styles",
  "get_theme_variables",
  "get_docs",
  "get_component_skill",
];
async function call(name: string, args: Record<string, unknown>) {
  const result = await client.callTool({ name, arguments: args });
  assert.ok(!result.isError, `${name} failed`);
  const payload = result.structuredContent as {
    productVersion: string;
    source: string;
    data: unknown;
  };
  assert.equal(payload.productVersion, expected.product.version);
  assert.ok(payload.source.startsWith(expected.source));
  return payload.data;
}
try {
  await client.connect(transport);
  assert.equal(client.getServerVersion()?.version, expected.product.version);
  const { tools } = await client.listTools();
  assert.deepEqual(
    tools.map((tool) => tool.name).sort(),
    [...toolNames].sort(),
  );
  assert.ok(
    tools.every(
      (tool) =>
        tool.annotations?.readOnlyHint &&
        tool.annotations.destructiveHint === false,
    ),
  );
  const list = (await call("list_components", {})) as {
    slug: string;
    variants: unknown[];
  }[];
  assert.deepEqual(
    list.map((entry) => entry.slug),
    Object.keys(expected.components),
  );
  for (const locale of ["zh", "en"] as const) {
    const docs = (await call("get_component_docs", {
      slug: "button",
      locale,
    })) as { markdown: string; usage: unknown };
    assert.equal(docs.markdown, expected.components.button.docs[locale]);
    assert.deepEqual(docs.usage, expected.components.button.usage.default);
  }
  const variant = expected.components.button.variants[0];
  if (variant) {
    const docs = (await call("get_component_docs", {
      slug: "button",
      variant: variant.slug,
    })) as { api: unknown };
    assert.deepEqual(
      docs.api,
      expected.components.button.api.variants[variant.slug],
    );
  }
  const source = (await call("get_component_source_code", {
    slug: "popover",
  })) as { files: unknown[] };
  assert.deepEqual(
    source.files,
    expected.components.popover.files.map((file) => expected.files[file]),
  );
  const styles = (await call("get_component_source_styles", {
    slug: "popover",
  })) as { files: unknown[]; notices: unknown[] };
  assert.ok(styles.files.length && styles.notices.length);
  const theme = (await call("get_theme_variables", {
    palette: "violet",
    mode: "dark",
  })) as { variables: unknown };
  assert.deepEqual(theme.variables, expected.themes.violet.dark);
  const guide = (await call("get_docs", {
    path: "/docs/mcp-server",
    locale: "en",
  })) as { markdown: string };
  assert.equal(guide.markdown, expected.guides["/en/docs/mcp-server"].markdown);
  const skill = (await call("get_component_skill", {
    slug: "prompt-input",
  })) as { markdown: string };
  assert.equal(skill.markdown, expected.components["prompt-input"].skills.zh);
  for (const [name, args] of [
    ["get_component_docs", { slug: "missing" }],
    ["get_component_docs", { slug: "button", variant: "missing" }],
    ["get_docs", { path: "/../../package.json" }],
  ] as const)
    assert.equal(
      (await client.callTool({ name, arguments: args })).isError,
      true,
    );
  const options = await fetch(endpoint, {
    method: "OPTIONS",
    headers: {
      Origin: "https://client.example",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "mcp-protocol-version,content-type",
    },
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(options.status, 204);
  assert.equal(options.headers.get("Access-Control-Allow-Origin"), "*");
  assert.match(
    options.headers.get("Access-Control-Allow-Headers") ?? "",
    /MCP-Protocol-Version/i,
  );
  assert.equal(
    (await fetch(endpoint, { signal: AbortSignal.timeout(15_000) })).status,
    405,
  );
  const malformed = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: "{",
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(malformed.status, 400);
  const legacyPost = (body: unknown) =>
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "MCP-Protocol-Version": "2025-03-26",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });
  const legacy = await legacyPost({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "orvui-legacy-verifier", version: "1.0.0" },
    },
  });
  assert.equal(legacy.status, 200);
  assert.equal(legacy.headers.get("Mcp-Session-Id"), null);
  assert.equal((await legacy.json()).result.protocolVersion, "2025-03-26");
  const legacyTools = await legacyPost({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  });
  assert.equal(legacyTools.status, 200);
  assert.equal((await legacyTools.json()).result.tools.length, 7);
  const report = {
    endpoint: endpoint.href,
    verifiedAt: new Date().toISOString(),
    productVersion: expected.product.version,
    tools: toolNames,
    components: list.length,
    variants: list.flatMap((entry) => entry.variants).length,
    anonymous: true,
    bilingualDocs: true,
    sourceClosure: true,
    registeredVariantApi: true,
    legacyProtocol: true,
    cors: true,
    errorHandling: true,
    stateless: true,
    requests,
  };
  const output = resolve("artifacts/reports/ai");
  mkdirSync(output, { recursive: true });
  writeFileSync(
    resolve(output, `remote-mcp-${endpoint.hostname}.json`),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await client.close();
}
