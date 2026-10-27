// @vitest-environment node
import { expect, it } from "vitest";
import baseline from "../tools/catalog/public-api.json";
import {
  collectPublicApi,
  comparePublicApi,
  type PublicApiBaseline,
} from "../tools/catalog/public-api";

it("preserves the current public Vue barrels using the frozen orvui compatibility baseline", () => {
  const expected = baseline as PublicApiBaseline;
  const actual = collectPublicApi();
  expect(actual.components.length).toBeGreaterThanOrEqual(
    expected.components.length,
  );
  expect(
    comparePublicApi(expected, actual).filter(
      (item) => item.missing.length || item.changedKind.length,
    ),
  ).toEqual([]);
  expect(
    actual.components
      .find((item) => item.slug === "timeline")!
      .exports.find((item) => item.name === "TimelineEvent")!.kind,
  ).toBe("type");
  expect(
    actual.components
      .find((item) => item.slug === "timeline")!
      .exports.find((item) => item.name === "Timeline")!.kind,
  ).toBe("runtime");
});

it("reports removed exports and runtime-to-type changes as compatibility failures", () => {
  const expected = baseline as PublicApiBaseline;
  const actual = structuredClone(expected);
  const entry = actual.components[0];
  const removed = entry.exports.shift()!;
  const changed = entry.exports[0];
  changed.kind = changed.kind === "runtime" ? "type" : "runtime";
  const result = comparePublicApi(expected, actual).find(
    (item) => item.specifier === entry.specifier,
  )!;
  expect(result.missing).toEqual([removed.name]);
  expect(result.changedKind).toEqual([changed.name]);
});
