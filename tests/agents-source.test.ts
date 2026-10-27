import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import {
  ApprovalCard,
  FileDiff,
  ToolResult,
  ToolApproval,
  StreamingResponse,
  TodoList,
  MessageScroller,
  Message,
  MessageContent,
  AgentActivity,
  ReasoningText,
} from "../packages/vue/src/agents";
enableAutoUnmount(afterEach);
const descriptor = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "animate",
);
beforeAll(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
  window.matchMedia = vi.fn().mockReturnValue({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterAll(() => {
  if (descriptor)
    Object.defineProperty(Element.prototype, "animate", descriptor);
});
afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});
describe("agent source state transitions", () => {
  it("auto advances single questions after 240ms and clears the single-selection custom answer", async () => {
    vi.useFakeTimers();
    const w = mount(ApprovalCard, {
      props: {
        questions: [
          {
            id: "one",
            title: "One",
            options: [{ value: "yes", label: "Yes" }],
            allowCustom: true,
          },
          { id: "two", title: "Two", allowCustom: true },
        ],
        defaultAnswers: { one: { selected: [], custom: "Before" } },
      },
    });
    await w.get("[role=radio]").trigger("click");
    expect(w.emitted("update:answers")?.at(-1)).toEqual([
      { one: { selected: ["yes"], custom: "" } },
    ]);
    expect(w.emitted("update:step")).toBeUndefined();
    await vi.advanceTimersByTimeAsync(239);
    expect(w.emitted("update:step")).toBeUndefined();
    await vi.advanceTimersByTimeAsync(1);
    expect(w.emitted("update:step")?.at(-1)).toEqual([1]);
  });
  it("uses the source status result when an approval result node is omitted", () => {
    const w = mount(ApprovalCard, { props: { status: "approved" } });
    expect(w.get("p.mt-1").text()).toBe("Approved");
  });
  it("reopens a file diff or tool result when a fresh stream starts", async () => {
    const file = mount(FileDiff, { props: { file: "a.ts", lines: [] } });
    await file.setProps({ status: "complete" });
    expect(file.get("button[aria-expanded]").attributes("aria-expanded")).toBe(
      "false",
    );
    await file.setProps({ status: "streaming" });
    expect(file.get("button[aria-expanded]").attributes("aria-expanded")).toBe(
      "true",
    );
    const tool = mount(ToolResult, { props: { tool: "test", title: "Run" } });
    await tool.setProps({ status: "error" });
    expect(tool.get("button[aria-expanded]").attributes("aria-expanded")).toBe(
      "false",
    );
    await tool.setProps({ status: "running" });
    expect(tool.get("button[aria-expanded]").attributes("aria-expanded")).toBe(
      "true",
    );
  });
  it("closes details when tool approval leaves pending and exposes optional choices only when provided", async () => {
    const w = mount(ToolApproval, {
      props: {
        tool: "terminal.run",
        defaultOpen: true,
        parameters: [{ id: "dir", label: "Directory", value: "project" }],
      },
    });
    expect(w.get("button[aria-expanded]").attributes("aria-expanded")).toBe(
      "true",
    );
    expect(
      w.findAll("button").some((button) => button.text() === "Always allow"),
    ).toBe(false);
    await w.setProps({ status: "approving" });
    expect(w.emitted("update:open")?.at(-1)).toEqual([false]);
    expect(w.attributes("aria-busy")).toBe("true");
  });
  it("counts only completed tasks and reopens after a completed run becomes active", async () => {
    const w = mount(TodoList, {
      props: {
        items: [
          { id: "one", title: "One", status: "completed" },
          { id: "two", title: "Two", status: "cancelled" },
        ],
      },
    });
    expect(w.text()).toContain("1 of 2 tasks completed");
    await w.setProps({
      items: [
        { id: "one", title: "One", status: "completed" },
        { id: "two", title: "Two", status: "completed" },
      ],
    });
    expect(w.emitted("update:open")?.at(-1)).toEqual([false]);
    await w.setProps({
      items: [{ id: "one", title: "One", status: "in-progress" }],
    });
    expect(w.emitted("update:open")?.at(-1)).toEqual([true]);
  });
  it("hides completion actions during streaming and keeps sources mounted within a named disclosure", async () => {
    const retry = vi.fn(),
      w = mount(StreamingResponse, {
        props: {
          status: "streaming",
          copyText: "Answer",
          sources: [{ id: "source", title: "Source" }],
          onRetry: retry,
        },
        slots: { default: "Answer" },
      });
    expect(w.find('button[aria-label="Helpful"]').exists()).toBe(false);
    await w.setProps({ status: "complete" });
    await nextTick();
    await w.get('button[aria-label="Helpful"]').trigger("click");
    expect(w.emitted("update:feedback")?.at(-1)).toEqual(["up"]);
    await w.get("button[aria-expanded]").trigger("click");
    expect(w.emitted("update:sourcesOpen")?.at(-1)).toEqual([true]);
    await w.get('button[aria-label="Retry response"]').trigger("click");
    expect(retry).toHaveBeenCalledOnce();
  });
  it("renders inferred activity labels and summary without an explicit render-node prop", async () => {
    const w = mount(AgentActivity, {
      props: {
        items: [
          { id: "one", type: "trace", kind: "message", label: "Started" },
        ],
        status: "complete",
        defaultOpen: true,
        summary: null,
      },
    });
    expect(w.get("button[aria-expanded]").text()).toContain(
      "0 tool calls, 1 message",
    );
    await w.setProps({ status: "working" });
    expect(w.get("[role=status]").text()).toContain("Working through the run…");
    expect(w.get("[role=region]").attributes("style")).toContain(
      "height: 208px",
    );
  });
  it("retains the default reasoning glyph when the optional indicator is omitted", () => {
    const w = mount(ReasoningText, { props: { indicator: null } });
    expect(w.find("[aria-label=Reasoning]").exists()).toBe(true);
  });
  it("keeps viewport handlers on the section and live-log semantics on its content", async () => {
    const scroll = vi.fn(),
      w = mount(
        defineComponent({
          setup: () => () =>
            h(
              MessageScroller,
              {
                followOutput: false,
                label: "Transcript",
                viewportProps: { onScroll: scroll },
                contentClassName: "min-h-full",
                contentProps: { class: "native-transcript" },
              },
              {
                default: () =>
                  h(
                    Message,
                    { from: "user" },
                    { default: () => h(MessageContent, {}, () => "Question") },
                  ),
              },
            ),
        }),
      );
    expect(w.get("section").attributes("aria-label")).toBe("Transcript");
    expect(w.get("[role=log]").element.parentElement?.tagName).toBe("SECTION");
    expect(w.get("[role=log]").classes()).toContain("native-transcript");
    await w.get("section").trigger("scroll");
    expect(scroll).toHaveBeenCalledOnce();
    expect(
      w.find('button[aria-label="Scroll to latest message"]').exists(),
    ).toBe(false);
  });
});
