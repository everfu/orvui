import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h } from "vue";
import {
  BumpChart,
  BumpChartLegend,
  BumpChartPlot,
} from "..";

const series = [
  { id: "alpha", name: "Alpha", ranks: [2, 1], color: "#8b5cf6" },
  { id: "beta", name: "Beta", ranks: [1, null], color: "#0d9488" },
];
const periods = ["Apr", "May"];
const mounted: VueWrapper[] = [];
function chart(options: Parameters<typeof mount<typeof BumpChart>>[1] = {}) {
  const wrapper = mount(BumpChart, {
    ...options,
    props: { series, periods, ...options.props },
  });
  mounted.push(wrapper);
  return wrapper;
}
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => {
  for (const wrapper of mounted.splice(0)) wrapper.unmount();
});

describe("BumpChart source parity", () => {
  it.each([
    { series, periods: [] },
    { series: [{ id: "empty", name: "Empty", ranks: [null] }], periods },
  ])(
    "keeps empty rankings out of the tab order and omits the plot table",
    (props) => {
      const wrapper = chart({
        props,
        slots: {
          default: () =>
            h(BumpChartPlot, { className: "py-8", id: "empty-plot" }),
        },
      });
      const empty = wrapper.get("#empty-plot");
      expect(empty.element.tagName).toBe("DIV");
      expect(empty.text()).toBe("No rankings yet");
      expect(empty.classes()).toContain("py-8");
      expect(empty.classes()).not.toContain("py-16");
      expect(wrapper.find("[tabindex]").exists()).toBe(false);
      expect(wrapper.find("table").exists()).toBe(false);
    },
  );

  it("allows the public root, plot and legend className props to override defaults", () => {
    const wrapper = chart({
      props: { series, periods, className: "w-96" },
      slots: {
        default: () => [
          h(BumpChartPlot, {
            className: "overflow-x-visible",
            id: "custom-plot",
            title: "Custom rankings",
          }),
          h(BumpChartLegend, {
            className: "grid-cols-1 sm:grid-cols-4",
            id: "custom-legend",
          }),
        ],
      },
    });
    expect(wrapper.classes()).toContain("w-96");
    expect(wrapper.classes()).not.toContain("w-full");
    expect(wrapper.get("#custom-plot").classes()).toContain(
      "overflow-x-visible",
    );
    expect(wrapper.get("#custom-plot").classes()).not.toContain(
      "overflow-x-auto",
    );
    expect(wrapper.get("#custom-plot").attributes("title")).toBe(
      "Custom rankings",
    );
    expect(wrapper.get("#custom-legend").classes()).toContain("grid-cols-1");
    expect(wrapper.get("#custom-legend").classes()).not.toContain(
      "grid-cols-2",
    );
    expect(wrapper.get("#custom-legend").classes()).toContain("sm:grid-cols-4");
    expect(wrapper.get("#custom-legend").classes()).not.toContain(
      "sm:grid-cols-3",
    );
  });

  it("preserves the source minimum plot width as periods grow while keeping exact rank headers", async () => {
    const wrapper = chart();
    const plot = wrapper.get('section[tabindex="0"]');
    expect(plot.attributes("aria-label")).toContain("scroll horizontally");
    expect(plot.classes()).toContain("overflow-x-auto");
    expect(plot.get("div.relative").attributes("style")).toContain(
      "min-width: 560px",
    );
    expect(
      wrapper.findAll('thead th[scope="col"]').map((cell) => cell.text()),
    ).toEqual(["Series", "Apr", "May"]);
    expect(
      wrapper.findAll('tbody th[scope="row"]').map((cell) => cell.text()),
    ).toEqual(["Alpha", "Beta"]);
    expect(wrapper.findAll("tbody td").map((cell) => cell.text())).toEqual([
      "2",
      "1",
      "1",
      "No data",
    ]);
    await wrapper.setProps({
      periods: Array.from({ length: 9 }, (_, i) => `P${i + 1}`),
    });
    expect(plot.get("div.relative").attributes("style")).toContain(
      "min-width: 576px",
    );
    expect(wrapper.findAll('thead th[scope="col"]')).toHaveLength(10);
  });

  it("keeps controlled pinning under parent control and clears it through the legend Escape event", async () => {
    const wrapper = chart({ props: { series, periods, active: null } });
    const alpha = wrapper.get('button[aria-label="Highlight Alpha"]');
    await alpha.trigger("click");
    expect(wrapper.emitted("activeChange")).toEqual([["alpha"]]);
    expect(alpha.attributes("aria-pressed")).toBe("false");
    await wrapper.setProps({ active: "alpha" });
    expect(alpha.attributes("aria-pressed")).toBe("true");
    await alpha.trigger("keydown", { key: "Escape" });
    expect(wrapper.emitted("activeChange")).toEqual([["alpha"], [null]]);
    expect(alpha.attributes("aria-pressed")).toBe("true");
    await wrapper.setProps({ active: null });
    expect(alpha.attributes("aria-pressed")).toBe("false");
  });
});
