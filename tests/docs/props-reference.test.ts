import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import PropsReference from "../../apps/docs/app/components/docs/PropsReference.vue";
import type { ApiComponent } from "../../apps/docs/app/utils/docs/component-docs-types";

const mounted: VueWrapper[] = [];
afterEach(() => {
  for (const wrapper of mounted.splice(0)) wrapper.unmount();
});
const sample: ApiComponent = {
  displayName: "Sample",
  aliases: ["Sample"],
  file: "Sample.vue",
  diagnostics: [],
  props: [
    {
      name: "modelValue",
      type: "string",
      required: true,
      defaultValue: null,
      defaultSource: null,
      description: "Selected value.",
      sourceFile: "Sample.vue",
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      defaultValue: "false",
      defaultSource: "boolean-cast",
      description: "",
      sourceFile: "Sample.vue",
    },
  ],
  events: [
    {
      name: "update:modelValue",
      signature: "[value: string]",
      declaration: "typed",
      description: "",
    },
  ],
  slots: [
    {
      name: "default",
      signature: "(scope: { value: string }) => VNodeChild",
      declaration: "typed",
      bindings: [{ name: "value", expression: "props.modelValue" }],
      description: "",
    },
  ],
};
function render(props: {
  category: string;
  slug: string;
  variant?: string;
  en?: boolean;
  docs?: ApiComponent[];
}) {
  const wrapper = mount(PropsReference, { props });
  mounted.push(wrapper);
  return wrapper;
}
describe("PropsReference", () => {
  it("shows source props, requiredness, defaults, event signatures and slot bindings without placeholder types", () => {
    const wrapper = render({
      category: "fixture",
      slug: "sample",
      docs: [sample],
    });
    const rows = wrapper.findAll('[data-api-kind="prop"]');
    expect(rows[0].get(".api-name").text()).toBe("modelValue");
    expect(rows[1].get(".api-name").text()).toBe("disabled?");
    expect(rows[1].get(".api-default").text()).toBe("false");
    expect(wrapper.get('[data-api-kind="event"]').text()).toContain(
      "[value: string]",
    );
    expect(wrapper.get('[data-api-kind="slot"]').text()).toContain(
      "作用域参数: value",
    );
    expect(wrapper.findAll("h4").map((heading) => heading.text())).toEqual([
      "事件",
      "插槽",
    ]);
    expect(wrapper.text()).not.toContain("unknown");
  });
  it("uses the actual variant mapping and updates when the route variant changes", async () => {
    const wrapper = render({
      category: "motion",
      slug: "range-slider",
      variant: "inline",
      en: true,
    });
    expect(
      wrapper
        .findAll('[data-api-kind="prop"] .api-name')
        .map((name) => name.text()),
    ).toContain("formatValueText?");
    expect(
      wrapper
        .findAll('[data-api-kind="prop"] .api-name')
        .map((name) => name.text()),
    ).not.toContain("bars?");
    await wrapper.setProps({ variant: "wave" });
    expect(
      wrapper
        .findAll('[data-api-kind="prop"] .api-name')
        .map((name) => name.text()),
    ).toContain("bars?");
    expect(wrapper.findAll("h4").map((heading) => heading.text())).toContain(
      "Events",
    );
  });
  it("labels compound parts and keeps native attributes/React types out of the generated own-prop tables", () => {
    const wrapper = render({
      category: "motion",
      slug: "image-viewer",
      variant: "morphing",
      en: true,
    });
    expect(wrapper.findAll("h3").map((heading) => heading.text())).toContain(
      "ImageViewerThumbnail",
    );
    expect(wrapper.findAll("h3").map((heading) => heading.text())).toContain(
      "ImageViewerContent",
    );
    expect(wrapper.text()).not.toContain("ReactNode");
    expect(
      wrapper
        .findAll('[data-api-kind="prop"] .api-name')
        .map((name) => name.text()),
    ).not.toContain("onVnodeMounted?");
  });
  it("omits the table for an unmapped entry rather than choosing an unrelated component", () => {
    const wrapper = render({ category: "missing", slug: "missing" });
    expect(wrapper.find(".props-reference").exists()).toBe(false);
  });
});
