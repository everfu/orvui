import { describe, expect, it } from "vitest";
import {
  cleanSankey,
  layoutSankey,
} from "../packages/vue/src/charts/sankey-chart/src/model";
import {
  buildTreemap,
  layoutTreemap,
  type TreemapNode,
} from "../packages/vue/src/charts/treemap/src/model";
import { buildComposition } from "../packages/vue/src/charts/composition-chart/src/model";
import { buildVolumeProfile } from "../packages/vue/src/charts/volume-profile/src/model";

describe("chart model compatibility and scale", () => {
  it("lays out a long flow chain without recursive traversal or quadratic edge lookup", () => {
    const nodes = Array.from({ length: 3000 }, (_, index) => ({
      id: String(index),
      label: `Stage ${index}`,
    }));
    const links = nodes.slice(1).map((node, index) => ({
      source: String(index),
      target: node.id,
      value: 1,
    }));
    const clean = cleanSankey(nodes, links);
    const result = layoutSankey(clean, {
      width: 640,
      height: 320,
      nodeWidth: 12,
      nodePadding: 16,
      colors: ["red"],
    });
    expect(result.nodes).toHaveLength(3000);
    expect(result.links).toHaveLength(2999);
    expect(result.nodes.at(-1)?.x1).toBeCloseTo(640);
    expect(result.nodes.every((node) => node.y0 === 0 && node.y1 === 320)).toBe(
      true,
    );
    expect(result.links.every((link) => link.width === 320)).toBe(true);
  });

  it("resolves deeply nested groups and assigns the whole area to their only leaf", () => {
    let source: TreemapNode = Object.freeze({
      id: "leaf",
      label: "Leaf",
      value: 7,
    });
    for (let index = 0; index < 1200; index++)
      source = Object.freeze({
        id: `group-${index}`,
        label: "Group",
        children: Object.freeze([source]),
      });
    const model = buildTreemap([source], ["blue"], "white");
    const [tile] = layoutTreemap(model.nodes, 320, 240);
    expect(model.total).toBe(7);
    expect(model.items[0].path).toHaveLength(1201);
    expect(tile).toMatchObject({
      id: "leaf",
      width: 320,
      height: 240,
      share: 1,
      x: 0,
      y: 0,
    });
    expect(source).not.toHaveProperty("share");
  });

  it("normalizes large finite composition values without overflowing the shares", () => {
    const model = buildComposition(
      [
        { id: "a", name: "A", color: "red", values: [Number.MAX_VALUE, 0] },
        { id: "b", name: "B", color: "blue", values: [Number.MAX_VALUE, 0] },
      ],
      ["Large", "Empty"],
    );
    expect(model.columns[0].valid).toBe(true);
    expect(model.columns[0].segments.map((segment) => segment.share)).toEqual([
      50, 50,
    ]);
    expect(model.columns[1].valid).toBe(false);
  });

  it("includes zero-volume edge bins for a complete value area and keeps input order untouched", () => {
    const source = Object.freeze([
      Object.freeze({ id: "high", priceLow: 3, priceHigh: 4, volume: 0 }),
      Object.freeze({ id: "poc", priceLow: 2, priceHigh: 3, volume: 5 }),
      Object.freeze({ id: "low", priceLow: 1, priceHigh: 2, volume: 0 }),
    ]);
    const model = buildVolumeProfile(source, 1);
    expect(model.valueArea).toMatchObject({
      priceLow: 1,
      priceHigh: 4,
      volume: 5,
      share: 1,
    });
    expect(model.rows.every((row) => row.inValueArea)).toBe(true);
    expect(source.map((bin) => bin.id)).toEqual(["high", "poc", "low"]);
  });
});
