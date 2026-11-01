import data from "../../../../packages/mcp/data/manifest.json" with { type: "json" };
import { createHttpHandler } from "../../../../packages/mcp/src/http.ts";

// JSON is bundled into the function: no runtime filesystem paths or origin fetches.
export default createHttpHandler(data);

export const config = {
  path: "/mcp",
  nodeBundler: "none",
  rateLimit: {
    windowSize: 60,
    windowLimit: 100,
    aggregateBy: ["ip", "domain"],
  },
};
