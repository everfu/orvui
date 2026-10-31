import {
  beforeAll,
  afterAll,
  afterEach,
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { ref, h, nextTick, defineComponent } from "vue";
import {
  OTPInput,
  FileUpload,
  AvailabilityScheduler,
  defaultWeek,
  clampRange,
  buildOptions,
  MorphingTabs,
  SwipeableList,
  SignUpForm,
  passwordStrength,
  PredictionMarket,
  MorphingSearchChips,
} from "../../packages/vue/src/blocks";
import {
  PromptInput,
  ApprovalCard,
  ToolApproval,
  TodoList,
  Citations,
  Citation,
  AISidebar,
} from "../../packages/vue/src/agents";
import {
  moveResource,
  renameResource,
  type SidebarResource,
} from "../../packages/vue/src/agents/ai-sidebar/src/tree";
const animateDescriptor = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "animate",
);
const wrappers: VueWrapper[] = [];
const render = (component: any, options: any = {}) => {
  const wrapper = mount(component, { attachTo: document.body, ...options });
  wrappers.push(wrapper);
  return wrapper;
};
beforeAll(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollIntoView = vi.fn();
  HTMLElement.prototype.scrollTo = vi.fn();
});
afterAll(() => {
  if (animateDescriptor)
    Object.defineProperty(Element.prototype, "animate", animateDescriptor);
});
afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
  vi.useRealTimers();
  document.body.innerHTML = "";
});
describe("Vue form and input contracts", () => {
  it("sanitizes an OTP, completes once per full code, and allows paste", async () => {
    const w = render(OTPInput, { props: { length: 4 } });
    const input = w.get("input");
    await input.setValue("1a2b34");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["1234"]);
    expect(w.emitted("complete")).toEqual([["1234"]]);
    await input.setValue("1234");
    expect(w.emitted("complete")).toHaveLength(1);
    await input.setValue("12");
    await input.setValue("9876");
    expect(w.emitted("complete")?.at(-1)).toEqual(["9876"]);
  });
  it("keeps a controlled OTP driven by its parent", async () => {
    const w = render(OTPInput, {
      props: { modelValue: "12", length: 4, mask: true },
    });
    await w.get("input").setValue("9876");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["9876"]);
    await w.setProps({ modelValue: "4567" });
    expect((w.get("input").element as HTMLInputElement).value).toBe("");
    expect(w.findAll("[data-filled=true]")).toHaveLength(4);
    expect(w.text()).not.toContain("4567");
  });
  it("accepts matching files, enforces queue capacity, and emits removal", async () => {
    const added = new File(["pdf"], "brief.pdf", { type: "application/pdf" });
    const rejected = new File(["png"], "cover.png", { type: "image/png" });
    const w = render(FileUpload, { props: { accept: ".pdf", maxFiles: 1 } });
    const input = w.get("input");
    Object.defineProperty(input.element, "files", {
      value: [added, rejected],
      configurable: true,
    });
    await input.trigger("change");
    expect((w.emitted("filesAdded")?.[0][0] as any[])[0].name).toBe(
      "brief.pdf",
    );
    expect(w.emitted("reject")?.[0]).toEqual([[rejected]]);
    await w.get('[aria-label="Remove brief.pdf"]').trigger("click");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([[]]);
    expect(w.emitted("remove")).toHaveLength(1);
  });
  it("submits a trimmed prompt with its model and respects composition", async () => {
    const w = render(PromptInput, {
      props: { models: [{ value: "vue", label: "Vue assistant" }] },
    });
    await w.get("textarea").setValue("  Build a component  ");
    await w
      .get("textarea")
      .trigger("keydown", { key: "Enter", isComposing: true });
    expect(w.emitted("submit")).toBeUndefined();
    await w.get("textarea").trigger("keydown", { key: "Enter" });
    expect(w.emitted("submit")).toEqual([["Build a component", "vue"]]);
    expect((w.get("textarea").element as HTMLTextAreaElement).value).toBe("");
    await w.setProps({ loading: true, onStop: vi.fn() });
    await w.get('[aria-label="Stop generating"]').trigger("click");
    expect(w.emitted("stop")).toHaveLength(1);
  });
  it("validates a sign-up before invoking an asynchronous submission", async () => {
    const submit = vi.fn().mockResolvedValue(undefined);
    const w = render(SignUpForm, { props: { onSubmit: submit } });
    await w.get("form").trigger("submit");
    expect(submit).not.toHaveBeenCalled();
    expect(w.text()).toContain("Enter your name.");
    const inputs = w.findAll("input");
    await inputs[0].setValue("Alex");
    await inputs[1].setValue("alex@example.com");
    await inputs[2].setValue("correct horse battery staple");
    await inputs[3].setValue("correct horse battery staple");
    await w.get("[role=checkbox]").trigger("click");
    await w.get("form").trigger("submit");
    await nextTick();
    expect(submit).toHaveBeenCalledOnce();
    expect(w.text()).toContain("Account created");
  });
  it("keeps password length dominant in the upstream strength heuristic", () => {
    expect(passwordStrength("aA1!")).toBe(0);
    expect(passwordStrength("aaaaaaaa")).toBe(1);
    expect(passwordStrength("aA1!abcdefghijklmnop")).toBe(4);
  });
  it("preserves off-grid scheduler values and repairs reversed same-day ranges", () => {
    const sparse = buildOptions(720);
    expect(clampRange("09:00", "17:00", sparse)).toEqual({
      start: "09:00",
      end: "17:00",
    });
    expect(clampRange("23:30", "09:00", buildOptions(30))).toEqual({
      start: "23:00",
      end: "23:30",
    });
    const w = defaultWeek();
    expect(w.mon.ranges[0].id).toBe("mon-0");
    expect(w.sun.enabled).toBe(false);
  });
  it("copies scheduler hours without sharing range objects or ids", async () => {
    const w = render(AvailabilityScheduler);
    await w
      .get('[aria-label="Copy Monday hours to other days"]')
      .trigger("click");
    const target = document.querySelector<HTMLButtonElement>(
      '[role=checkbox][aria-label="Saturday"]',
    );
    expect(target).toBeTruthy();
    target!.click();
    await nextTick();
    const apply = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    ).find((b) => b.textContent?.trim() === "Apply")!;
    apply.click();
    await nextTick();
    const result = w.emitted("update:modelValue")?.at(-1)?.[0] as ReturnType<
      typeof defaultWeek
    >;
    expect(result.sat.enabled).toBe(true);
    expect(result.sat.ranges[0].start).toBe("09:00");
    expect(result.sat.ranges[0].id).not.toBe(result.mon.ranges[0].id);
  });
  it("guards market orders against insufficient balance and computes quoted shares", async () => {
    const w = render(PredictionMarket, {
      props: {
        authenticated: true,
        balance: 5,
        defaultValue: { amount: "10" },
        outcomes: [{ id: "yes", label: "Yes", price: 0.25 }],
      },
    });
    expect(w.text()).toContain("Insufficient balance");
    await w.findAll("button").at(-1)!.trigger("click");
    expect(w.emitted("trade")).toBeUndefined();
    await w.get("input").setValue("4");
    await w.findAll("button").at(-1)!.trigger("click");
    await vi.waitFor(() => expect(w.emitted("trade")).toHaveLength(1));
    const trade = w.emitted("trade")?.[0];
    expect(trade?.[1]).toMatchObject({ valid: true, shares: 16, payout: 16 });
  });
});
describe("composed keyboard interactions", () => {
  it("selects and reorders morphing tabs with the keyboard", async () => {
    const w = render(MorphingTabs, {
      props: {
        items: [
          { id: "a", label: "Alpha", content: "A" },
          { id: "b", label: "Beta", content: "B" },
          { id: "c", label: "Gamma", content: "C" },
        ],
      },
    });
    await w.findAll("[role=tab]")[0].trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["b"]);
    await w
      .findAll("[role=tab]")[1]
      .trigger("keydown", { key: "ArrowRight", altKey: true });
    expect(w.emitted("orderChange")?.at(-1)).toEqual([["a", "c", "b"]]);
  });
  it("commits one pointer drag after its spring settles", async () => {
    const w = render(MorphingTabs, {
      props: {
        items: [
          { id: "a", label: "Alpha", content: "A" },
          { id: "b", label: "Beta", content: "B" },
          { id: "c", label: "Gamma", content: "C" },
        ],
      },
    });
    const tab = w.findAll(".cursor-grab")[0];
    await tab.trigger("pointerdown", { button: 0, pointerId: 7, clientX: 20 });
    await tab.trigger("pointermove", { button: 0, pointerId: 7, clientX: 300 });
    await tab.trigger("pointerup", { button: 0, pointerId: 7, clientX: 300 });
    await vi.waitFor(
      () => expect(w.emitted("orderChange")?.at(-1)).toEqual([["b", "a", "c"]]),
      { timeout: 2500 },
    );
  });
  it("reveals swipe actions with arrow keys and closes after acting", async () => {
    const w = render(SwipeableList, {
      props: {
        items: [
          {
            id: "mail",
            title: "Hello",
            rightActions: [
              { id: "delete", label: "Delete", icon: "×", tone: "danger" },
            ],
          },
        ],
      },
    });
    await w
      .get('button[aria-label="Actions for Hello"]')
      .trigger("keydown", { key: "ArrowLeft" });
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([
      { id: "mail", side: "right" },
    ]);
    await w.findAll("button")[0].trigger("click");
    expect(w.emitted("action")?.[0][0]).toMatchObject({
      side: "right",
      action: { id: "delete" },
    });
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([null]);
  });
  it("uses a two-step backspace before deleting a search chip", async () => {
    const w = render(MorphingSearchChips, {
      props: { defaultChips: ["Vue", "Motion"], suggestions: ["Nuxt"] },
    });
    const input = w.get("input[role=combobox]");
    await input.trigger("keydown", { key: "Backspace" });
    expect(w.emitted("update:chips")).toBeUndefined();
    await input.trigger("keydown", { key: "Backspace" });
    expect(w.emitted("update:chips")?.at(-1)).toEqual([["Vue"]]);
    await input.setValue("Nuxt");
    await input.trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:chips")?.at(-1)).toEqual([["Vue", "Nuxt"]]);
  });
  it("collects multi-step approval answers and submits once complete", async () => {
    const w = render(ApprovalCard, {
      props: {
        questions: [
          {
            id: "framework",
            title: "Framework?",
            options: [{ value: "vue", label: "Vue" }],
          },
          {
            id: "features",
            title: "Features?",
            multiple: true,
            options: [
              { value: "motion", label: "Motion" },
              { value: "a11y", label: "Accessibility" },
            ],
          },
        ],
      },
    });
    await w.get("[role=radio]").trigger("click");
    await w.get('button[aria-label="Next question"]').trigger("click");
    await vi.waitFor(() =>
      expect(w.findAll("[role=checkbox]")).toHaveLength(2),
    );
    await w.findAll("[role=checkbox]")[0].trigger("click");
    await w.findAll("[role=checkbox]")[1].trigger("click");
    await w.get('button[aria-label="Submit response"]').trigger("click");
    expect(w.emitted("submit")?.[0][0]).toEqual({
      framework: { selected: ["vue"], custom: "" },
      features: { selected: ["motion", "a11y"], custom: "" },
    });
  });
  it("exposes tool permission choices as separate caller-owned events", async () => {
    const w = render(ToolApproval, { props: { tool: "Terminal" } });
    await w
      .findAll("button")
      .find((b) => b.text() === "Deny")!
      .trigger("click");
    expect(w.emitted("deny")).toHaveLength(1);
    expect(w.emitted("approve")).toBeUndefined();
    await w.setProps({ status: "denied" });
    expect(w.text()).toContain("Denied");
  });
  it("collapses a todo list once the final task completes", async () => {
    const w = render(TodoList, {
      props: { items: [{ id: "a", title: "Build", status: "in-progress" }] },
    });
    await w.setProps({
      items: [{ id: "a", title: "Build", status: "completed" }],
    });
    expect(w.emitted("update:open")?.at(-1)).toEqual([false]);
    expect(w.get("button").attributes("aria-expanded")).toBe("false");
  });
  it("connects inline citations to mounted source rows", async () => {
    const App = defineComponent({
      setup: () => () =>
        h("div", [
          h(Citation, {
            citationId: "vue",
            index: 1,
            idPrefix: "test-sources",
          }),
          h(Citations, {
            citations: [{ id: "vue", title: "Vue", url: "https://vuejs.org" }],
            idPrefix: "test-sources",
          }),
        ]),
    });
    const w = render(App);
    expect(w.get("a").attributes("href")).toBe("#test-sources-vue");
    expect(document.getElementById("test-sources-vue")).toBeTruthy();
    await w.get("a").trigger("click");
    await nextTick();
    expect(w.get("button").attributes("aria-expanded")).toBe("true");
  });
});
describe("resource tree operations", () => {
  const tree: SidebarResource[] = [
    {
      id: "folder",
      label: "Project",
      kind: "folder",
      children: [{ id: "file", label: "Readme", kind: "file" }],
    },
    { id: "other", label: "Other", kind: "file" },
  ];
  it("rejects moving a parent into its child, keeps disabled resources fixed, and renames immutably", () => {
    expect(
      moveResource(tree, {
        itemId: "folder",
        targetId: "file",
        position: "inside",
      }),
    ).toBeNull();
    expect(
      moveResource(
        [{ id: "disabled", label: "Locked", kind: "file", disabled: true }],
        { itemId: "disabled", targetId: null, position: "after" },
      ),
    ).toBeNull();
    const renamed = renameResource(tree, "file", "Guide");
    expect(renamed[0].children?.[0].label).toBe("Guide");
    expect(tree[0].children?.[0].label).toBe("Readme");
  });
  it("moves a child out while preserving its identity", () => {
    const next = moveResource(tree, {
      itemId: "file",
      targetId: "folder",
      position: "after",
    })!;
    expect(next.map((i) => i.id)).toEqual(["folder", "file", "other"]);
    expect(next[0].children).toEqual([]);
  });
  it("rolls back a rejected optimistic sidebar move", async () => {
    const move = vi.fn().mockRejectedValue(new Error("Network unavailable"));
    const w = render(AISidebar, {
      props: {
        defaultItems: tree,
        defaultExpandedIds: ["folder"],
        onMove: move,
      },
    });
    const file = w
      .findAll("[role=treeitem]")
      .find((r) => r.attributes("data-resource-id") === "file")!;
    await file.trigger("keydown", {
      key: "ArrowLeft",
      altKey: true,
      shiftKey: true,
    });
    await nextTick();
    await nextTick();
    expect(move).toHaveBeenCalledWith({
      itemId: "file",
      targetId: "folder",
      position: "after",
    });
    expect(w.emitted("moveError")).toHaveLength(1);
    expect(w.emitted("update:items")?.at(-1)).toEqual([tree]);
  });
});

describe("specialized visual state contracts", () => {
  it("reveals card details independently and toggles the source purse surface", async () => {
    const { CardFolder } =
      await import("../../packages/vue/src/blocks/card-folder");
    const w = render(CardFolder, {
      props: {
        title: "Personal",
        cardNumber: "4242424242429012",
        expiry: "09/28",
        cvv: "123",
      },
      slots: { card: "Payment card" },
    });
    expect(w.findAll('svg[viewBox="0 0 384 110"] path')).toHaveLength(2);
    await w.get('[aria-label="Show card details"]').trigger("click");
    expect(w.emitted("update:detailsVisible")?.at(-1)).toEqual([true]);
    await w.findAll("button")[0].trigger("click");
    expect(w.emitted("update:open")?.at(-1)).toEqual([true]);
    expect(w.find('[data-slot="card-folder-back"]').exists()).toBe(true);
  });
  it("renders an image while refining and exposes a caller-owned retry on errors", async () => {
    const { ImageGeneration } =
      await import("../../packages/vue/src/agents/image-generation");
    const retry = vi.fn();
    const w = render(ImageGeneration, {
      props: { status: "refining", onRetry: retry },
      slots: {
        default:
          '<img alt="Generated landscape" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />',
      },
    });
    expect(w.get("img").attributes("alt")).toBe("Generated landscape");
    expect(w.find("canvas").exists()).toBe(true);
    await w.setProps({ status: "error" });
    await w
      .findAll("button")
      .find((b) => b.text().includes("Try again"))!
      .trigger("click");
    expect(retry).toHaveBeenCalledOnce();
  });
});
