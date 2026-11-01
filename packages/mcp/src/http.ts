import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/server";
import type { AiData } from "./data.js";
import { createServer } from "./server.js";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version, MCP-Session-Id",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

/** Public component knowledge only; each HTTP request owns its protocol state. */
export function createHttpHandler(data: AiData) {
  return async function handle(request: Request): Promise<Response> {
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers });
    // No long-lived GET/SSE connection on the serverless endpoint.
    if (request.method !== "POST")
      return new Response(null, {
        status: 405,
        headers: { ...headers, Allow: "POST, OPTIONS" },
      });
    const server = createServer(data, {
      onToolCall: (tool) =>
        console.info(
          JSON.stringify({
            event: "mcp.tool",
            tool,
            productVersion: data.product.version,
          }),
        ),
    });
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
      maxRequestBodySize: 64 * 1024,
    });
    try {
      await server.connect(transport);
      const response = await transport.handleRequest(request);
      const combined = new Headers(response.headers);
      for (const [key, value] of Object.entries(headers))
        combined.set(key, value);
      return new Response(response.body, {
        status: response.status,
        headers: combined,
      });
    } finally {
      await server.close();
    }
  };
}
