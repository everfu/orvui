import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import baseline from "../catalog/public-api.json";
import {
  collectPublicApi,
  comparePublicApi,
  type PublicApiBaseline,
} from "../catalog/public-api";

const api = baseline as PublicApiBaseline,
  results = comparePublicApi(api, collectPublicApi()),
  failures = results.filter(
    (item) => item.missing.length || item.changedKind.length,
  ),
  total = api.components.reduce(
    (count, item) => count + item.exports.length,
    0,
  );
const reports = resolve("artifacts/reports");
mkdirSync(reports, { recursive: true });
writeFileSync(
  resolve(reports, "api-coverage.json"),
  JSON.stringify(
    {
      product: api.product,
      baseline: "tools/catalog/public-api.json",
      total,
      rootExports: api.root.exports.length,
      modules: results,
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify(failures, null, 2));
console.log(
  `orvui public API names: ${total}; root exports: ${api.root.exports.length}; incompatible modules: ${failures.length}`,
);
if (failures.length) process.exitCode = 1;
