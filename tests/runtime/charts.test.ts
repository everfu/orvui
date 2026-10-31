import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import {
  CandlestickChart,
  DonutChart,
  HeatCalendar,
  OrderBook,
  PriceTargetFan,
  ReturnsCalendar,
  StatusBar,
} from "../../packages/vue/src/charts";
import {
  buildBumpChart,
  bumpPath,
} from "../../packages/vue/src/charts/bump-chart/src/model";
import {
  buildComposition,
  compositionArea,
} from "../../packages/vue/src/charts/composition-chart/src/model";
import { buildDonut } from "../../packages/vue/src/charts/donut-chart/src/model";
import {
  buildFunnel,
  funnelPath,
} from "../../packages/vue/src/charts/funnel-chart/src/model";
import {
  buildLiquidityHeatmap,
  pricePosition,
} from "../../packages/vue/src/charts/liquidity-heatmap/src/model";
import {
  buildOrderBook,
  summarizeDepth,
} from "../../packages/vue/src/charts/order-book/src/model";
import { compound } from "../../packages/vue/src/charts/returns-calendar/src/utils";
import {
  cleanSankey,
  layoutSankey,
} from "../../packages/vue/src/charts/sankey-chart/src/model";
import {
  buildTreemap,
  layoutTreemap,
  TREEMAP_COLORS,
} from "../../packages/vue/src/charts/treemap/src/model";
import { buildVolumeProfile } from "../../packages/vue/src/charts/volume-profile/src/model";

const wrappers: VueWrapper[] = [];
afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
});
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
const segments = [
  { id: "a", name: "Alpha", value: 60, color: "#123456" },
  { id: "b", name: "Beta", value: 40, color: "#abcdef" },
];
const mountChart = (component: any, options: any = {}) => {
  const wrapper = mount(component, options);
  wrappers.push(wrapper);
  return wrapper;
};

describe("chart numerical compatibility", () => {
  it("cleans cycles and invalid Sankey edges while preserving value-scaled bands within the viewport", () => {
    const clean = cleanSankey(
      [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
      ],
      [
        { source: "a", target: "b", value: 6 },
        { source: "a", target: "b", value: 4 },
        { source: "b", target: "c", value: 10 },
        { source: "c", target: "a", value: 5 },
        { source: "missing", target: "a", value: 2 },
      ],
    );
    expect(clean.links).toHaveLength(2);
    expect(clean.dropped.invalid).toHaveLength(1);
    expect(clean.dropped.cycle).toHaveLength(1);
    const layout = layoutSankey(clean, {
      width: 640,
      height: 320,
      nodeWidth: 12,
      nodePadding: 16,
      colors: ["blue"],
    });
    expect(layout.columns).toBe(3);
    expect(layout.links.map((l) => l.value)).toEqual([10, 10]);
    for (const n of layout.nodes) {
      expect(n.y0).toBeGreaterThanOrEqual(0);
      expect(n.y1).toBeLessThanOrEqual(320);
      expect(n.x1).toBeLessThanOrEqual(640);
    }
    expect(layout.links[0].width).toBeCloseTo(
      layout.nodes[0].y1 - layout.nodes[0].y0,
    );
  });
  it("partitions nested treemap area exactly and keeps zero-valued data in the accessible model", () => {
    const data = [
      {
        id: "group",
        label: "Group",
        children: [
          { id: "a", label: "A", value: 3 },
          { id: "b", label: "B", value: 1 },
          { id: "zero", label: "Zero", value: 0 },
        ],
      },
    ];
    const model = buildTreemap(data, TREEMAP_COLORS, "white"),
      tiles = layoutTreemap(model.nodes, 1000, 625);
    expect(model.items).toHaveLength(3);
    expect(tiles).toHaveLength(2);
    expect(tiles.reduce((sum, t) => sum + t.width * t.height, 0)).toBe(625000);
    expect(
      (tiles[0].width * tiles[0].height) / (tiles[1].width * tiles[1].height),
    ).toBeCloseTo(3);
    expect(data[0].children[0]).not.toHaveProperty("share");
  });
  it("handles a single donut with two arcs and excludes invalid/zero segments", () => {
    const result = buildDonut(
      [...segments.slice(0, 1), { ...segments[1], value: 0 }],
      { radius: 81, thickness: 22, gap: 3 },
    );
    expect(result.total).toBe(60);
    expect(result.placed).toHaveLength(1);
    expect(result.placed[0].path.match(/ A /g)).toHaveLength(2);
  });
  it("preserves missing columns and rank gaps without drawing fabricated observations", () => {
    const composition = buildComposition(
      [
        { id: "one", name: "One", color: "red", values: [20, null, 40] },
        { id: "two", name: "Two", color: "blue", values: [80, 90, 60] },
      ],
      ["A", "B", "C"],
    );
    expect(composition.columns.map((c) => c.valid)).toEqual([
      true,
      false,
      true,
    ]);
    expect(compositionArea(composition.columns, 0).match(/M/g)).toHaveLength(2);
    const bump = buildBumpChart(
      [{ id: "a", name: "A", ranks: [1, null, 8] }],
      3,
    );
    expect(
      bumpPath(bump.rows[0].ranks, bump.x, bump.y).match(/M/g),
    ).toHaveLength(2);
    expect(bump.y(8)).toBeGreaterThan(bump.y(1));
  });
  it("computes contiguous volume value area, deterministic equal POC ties and unequal price geometry", () => {
    const model = buildVolumeProfile(
      [
        { id: "a", priceLow: 10, priceHigh: 11, volume: 5 },
        { id: "b", priceLow: 11, priceHigh: 14, volume: 5 },
        { id: "c", priceLow: 16, priceHigh: 20, volume: 1 },
      ],
      0.7,
    );
    expect(model.poc?.id).toBe("a");
    expect(model.valueArea?.share).toBeCloseTo(5 / 11);
    expect(model.rows[1].height).toBe(0.3);
    expect(() =>
      buildVolumeProfile(
        [
          { id: "a", priceLow: 0, priceHigh: 2, volume: 1 },
          { id: "b", priceLow: 1, priceHigh: 3, volume: 2 },
        ],
        0.7,
      ),
    ).toThrow("overlap");
  });
  it("merges order prices, accumulates from best quotes and weights fill prices by size", () => {
    const book = buildOrderBook(
      [
        { price: 100, size: 2 },
        { price: 100, size: 3 },
        { price: 99, size: 5 },
        { price: 0, size: 2 },
      ],
      [
        { price: 102, size: 2 },
        { price: 101, size: 1 },
      ],
      9,
    );
    expect(book.bids).toEqual([
      { price: 100, size: 5, total: 5 },
      { price: 99, size: 5, total: 10 },
    ]);
    expect(book.asks[0].price).toBe(101);
    expect(book.spread).toBe(1);
    expect(summarizeDepth(book.bids, "bid").averagePrice).toBe(99.5);
  });
  it("distinguishes missing liquidity from zero and interpolates the discrete price trace", () => {
    const model = buildLiquidityHeatmap([
      {
        id: "a",
        label: "A",
        levels: [
          { price: 100, size: 0 },
          { price: 102, size: 2 },
          { price: 102, size: 3 },
        ],
      },
      { id: "b", label: "B", levels: [{ price: 100, size: 1 }] },
    ]);
    expect(model.columns[0].levels.get(102)).toBe(5);
    expect(model.columns[0].levels.has(100)).toBe(true);
    expect(model.columns[1].levels.has(102)).toBe(false);
    expect(pricePosition(101, model.prices)).toBe(1);
    expect(pricePosition(200, model.prices)).toBeNull();
  });
  it("keeps non-monotonic funnel stages and compounds gains/losses mathematically", () => {
    const model = buildFunnel([
      { id: "a", label: "A", value: 100 },
      { id: "b", label: "B", value: 50 },
      { id: "c", label: "C", value: 75 },
    ]);
    expect(model.conversion).toBe(75);
    expect(model.rows[2].stepConversion).toBe(150);
    expect(
      funnelPath(
        model.rows.map((r) => r.proportion),
        1,
        "horizontal",
      ),
    ).not.toContain("NaN");
    expect(compound([10, -10])).toBeCloseTo(-1);
  });
});

describe("Vue chart interactions", () => {
  it("emits controlled donut focus while waiting for the parent to update", async () => {
    const wrapper = mountChart(DonutChart, {
      props: { segments, activeId: "a" },
    });
    await wrapper.findAll("button")[1].trigger("focus");
    expect(wrapper.emitted("update:activeId")).toEqual([["b"]]);
    expect(wrapper.find("[aria-live]").text()).toContain("Alpha");
    await wrapper.setProps({ activeId: "b" });
    expect(wrapper.find("[aria-live]").text()).toContain("Beta");
  });
  it("clears an uncontrolled removed identity and moves legend focus with arrow keys", async () => {
    const wrapper = mountChart(DonutChart, {
      props: { segments, defaultActiveId: "a" },
      attachTo: document.body,
    });
    const buttons = wrapper.findAll("button");
    (buttons[0].element as HTMLButtonElement).focus();
    await buttons[0].trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(document.activeElement).toBe(buttons[1].element);
    await wrapper.setProps({ segments: [segments[0]] });
    expect(wrapper.find("[aria-live]").text()).toContain("Total");
  });
  it("anchors, previews, locks and clears an activity range with exact integer counts", async () => {
    const wrapper = mountChart(HeatCalendar, {
      props: {
        weeks: 2,
        maxCount: 10,
        values: [Array(7).fill(0.5), Array(7).fill(1)],
        endDate: new Date("2026-10-25T00:00:00Z"),
      },
    });
    const cells = wrapper.findAll("[data-heat-cell]");
    await cells[0].trigger("click");
    await cells[2].trigger("pointerenter");
    expect(wrapper.find('[role="tooltip"]').text()).toContain("15 commits");
    await cells[2].trigger("click");
    expect(wrapper.emitted("update:selection")?.at(-1)).toEqual([
      { start: { w: 0, d: 0 }, end: { w: 0, d: 2 } },
    ]);
    await cells[4].trigger("click");
    expect(wrapper.emitted("update:selection")?.at(-1)).toEqual([null]);
  });
  it("keeps return selections on the month or year track and compounds the selected run", async () => {
    const wrapper = mountChart(ReturnsCalendar, {
      props: { years: [2025, 2026], returns: [[10, -10], Array(12).fill(1)] },
    });
    await wrapper.find('[data-return-cell="0-0"]').trigger("click");
    await wrapper.find('[data-return-cell="0-1"]').trigger("click");
    expect(wrapper.find('[role="tooltip"]').text()).toContain("−1.00%");
    await wrapper.find('[data-return-cell="0-12"]').trigger("click");
    await wrapper.find('[data-return-cell="0-12"]').trigger("click");
    await wrapper.find('[data-return-cell="1-12"]').trigger("click");
    expect(wrapper.emitted("update:selection")?.at(-1)).toEqual([
      { start: { y: 0, m: 12 }, end: { y: 1, m: 12 } },
    ]);
  });
  it("exposes candle keyboard crosshair and reports stable IDs after live data changes", async () => {
    const candles = [
      {
        id: "one",
        label: "A",
        open: 10,
        high: 12,
        low: 9,
        close: 11,
        volume: 2,
      },
      {
        id: "two",
        label: "B",
        open: 11,
        high: 13,
        low: 10,
        close: 12,
        volume: 3,
      },
    ];
    const wrapper = mountChart(CandlestickChart, { props: { candles } }),
      slider = wrapper.find('[role="slider"]');
    await slider.trigger("keydown", { key: "Home" });
    expect(wrapper.emitted("update:activeId")?.at(-1)).toEqual(["one"]);
    expect(slider.attributes("aria-valuetext")).toContain("A: open 10");
    await wrapper.setProps({ candles: [candles[1]] });
    expect(slider.attributes("aria-valuetext")).toContain("B: open 11");
  });
  it("inspects status rows from native range changes and dismisses on Escape", async () => {
    const wrapper = mountChart(StatusBar, {
        props: {
          data: [
            { id: "a", label: "Monday", status: "operational" },
            { id: "b", label: "Tuesday", status: "outage" },
          ],
        },
      }),
      input = wrapper.find("input");
    await input.setValue("1");
    expect(wrapper.find('[role="tooltip"]').text()).toContain("Outage");
    await input.trigger("keydown", { key: "Escape" });
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });
  it("calculates an inspected order depth and emits the selected level", async () => {
    const wrapper = mountChart(OrderBook, {
      props: {
        bids: [{ price: 99, size: 3 }],
        asks: [{ price: 101, size: 2 }],
        onLevelSelect: vi.fn(),
      },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("levelSelect")?.[0]).toEqual([
      { price: 101, size: 2, total: 2 },
      "ask",
    ]);
  });
  it("validates target history and supports keyboard scrubbing and target activation", async () => {
    const wrapper = mountChart(PriceTargetFan, {
      props: {
        current: 100,
        history: [
          { date: "2026-01-01", price: 90 },
          { date: "2026-02-01", price: 95 },
        ],
        targets: [
          { key: "High", price: 120, analysts: 4 },
          { key: "Mean", price: 110, analysts: 5 },
          { key: "Low", price: 80, analysts: 3 },
        ],
      },
    });
    await wrapper.find('[role="slider"]').trigger("keydown", { key: "Home" });
    expect(wrapper.emitted("update:active")?.at(-1)).toEqual([
      { type: "history", date: "2026-01-01" },
    ]);
    await wrapper
      .findAll('[role="button"]')[0]
      .trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:active")?.at(-1)).toEqual([
      { type: "target", key: "High" },
    ]);
  });
});

describe("visual audit regressions", () => {
  it("defaults volume profiling to the original 70 percent value area and permits disabling it", async () => {
    const { VolumeProfile } =
      await import("../../packages/vue/src/charts/volume-profile");
    const w = mountChart(VolumeProfile, {
      props: {
        data: [
          { id: "a", priceLow: 1, priceHigh: 2, volume: 20 },
          { id: "b", priceLow: 2, priceHigh: 3, volume: 80 },
        ],
      },
    });
    expect(w.text()).toContain("Value area · 70% target");
    await w.setProps({ valueArea: false });
    expect(w.text()).not.toContain("70% target");
  });
  it("keeps the resting bump glow transparent and displays whole percent annual totals", async () => {
    const { BumpChart } =
      await import("../../packages/vue/src/charts/bump-chart");
    const w = mountChart(BumpChart, {
      props: {
        series: [
          { id: "a", name: "A", ranks: [1, 2] },
          { id: "b", name: "B", ranks: [2, 1] },
        ],
        periods: ["One", "Two"],
      },
    });
    await nextTick();
    expect(
      w
        .findAll('path[stroke-width="5"]')
        .every(
          (p) =>
            p.attributes("opacity") === "0" ||
            p.attributes("style")?.includes("opacity: 0"),
        ),
    ).toBe(true);
    const calendar = mountChart(ReturnsCalendar, {
      props: { years: [2026], returns: [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]] },
    });
    expect(calendar.find('[data-return-cell="0-12"]').text()).toBe("+13%");
  });
});
