import {
  beforeAll,
  afterEach,
  afterAll,
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import { h, ref, defineComponent, nextTick } from "vue";
import {
  OTPInput,
  BloomMenu,
  SignUpForm,
  FileUpload,
  AttachmentUpload,
} from "../packages/vue/src/blocks";
const wrappers: VueWrapper[] = [];
const nativeAnimate = Element.prototype.animate;
function render(component: any, options: any = {}) {
  const wrapper = mount(component, { attachTo: document.body, ...options });
  wrappers.push(wrapper);
  return wrapper;
}
async function settle() {
  await flushPromises();
  for (let i = 0; i < 5; i++) await nextTick();
}
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  if (nativeAnimate)
    vi.spyOn(Element.prototype, "animate").mockImplementation(function (
      this: Element,
      ...args: Parameters<Element["animate"]>
    ) {
      const animation = nativeAnimate.apply(this, args);
      void animation.finished.catch(() => undefined);
      return animation;
    });
});
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
  vi.useRealTimers();
});
afterAll(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("source form and upload interactions", () => {
  it("edits a middle OTP digit without collapsing later slots and announces deletions", async () => {
    const w = render(OTPInput, { props: { defaultValue: "1234", length: 4 } }),
      input = w.get("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowRight" });
    await input.trigger("keydown", { key: "Delete" });
    expect(
      w.findAll("[data-filled]").map((e) => e.attributes("data-filled")),
    ).toEqual(["true", "false", "true", "true"]);
    expect(w.emitted("change")?.at(-1)).toEqual(["134"]);
    expect(w.text()).toContain("Deleted. 3 of 4 digits entered.");
    await input.trigger("keydown", { key: "9" });
    expect(w.emitted("complete")).toEqual([["1934"]]);
    expect((input.element as HTMLInputElement).value).toBe("");
    await input.trigger("keydown", { key: "2" });
    expect(w.emitted("complete")).toHaveLength(1);
  });
  it("fills an OTP from the active slot on paste and caps pointer jumps at the first hole", async () => {
    const w = render(OTPInput, {
        props: { defaultValue: "12", length: 6, mask: true },
      }),
      input = w.get("input");
    await w.get("fieldset").trigger("mousedown", { clientX: 9999 });
    await input.trigger("paste", {
      clipboardData: { getData: () => "a3b456" },
    });
    expect(w.emitted("complete")).toEqual([["123456"]]);
    expect(w.text()).toContain("6 of 6 digits entered.");
    expect(w.text()).not.toContain("123456");
    await w.setProps({ disabled: true });
    await input.trigger("keydown", { key: "Delete" });
    expect(w.emitted("change")).toHaveLength(1);
  });
  it("navigates the Bloom grid in rows of three and restores the remounted trigger", async () => {
    const w = render(BloomMenu);
    await w.get("[aria-haspopup=menu]").trigger("click");
    await settle();
    let items = w.findAll("[role=menuitem]");
    expect(document.activeElement).toBe(items[0].element);
    await items[0].trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[3].element);
    await items[3].trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(items[5].element);
    await items[5].trigger("click");
    await settle();
    expect(w.emitted("select")).toEqual([["Link"]]);
    expect(document.activeElement?.getAttribute("aria-haspopup")).toBe("menu");
  });
  it("keeps controlled registration values unchanged until the parent accepts and submits only once while pending", async () => {
    const values = {
      name: "Ada",
      email: "ada@example.com",
      password: "correct horse battery staple",
      confirmPassword: "correct horse battery staple",
      terms: true,
    };
    let done!: () => void;
    const submit = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            done = resolve;
          }),
      ),
      w = render(SignUpForm, {
        props: { modelValue: values, onSubmit: submit },
      });
    await w.get("input").setValue("Grace");
    expect(w.emitted("update:modelValue")?.at(-1)?.[0]).toMatchObject({
      name: "Grace",
    });
    expect((w.get("input").element as HTMLInputElement).value).toBe("Ada");
    await w.get("form").trigger("submit");
    await w.get("form").trigger("submit");
    expect(submit).toHaveBeenCalledOnce();
    expect(w.get("button[type=submit]").attributes("aria-busy")).toBe("true");
    done();
    await settle();
    expect(w.text()).toContain("Account created");
  });
  it("resets a failed upload before retry and keeps success progress at 100%", async () => {
    const w = render(FileUpload, {
      props: {
        defaultValue: [
          {
            id: "a",
            name: "brief.pdf",
            size: 100,
            status: "error",
            error: "Offline",
            progress: 55,
          },
          {
            id: "b",
            name: "done.zip",
            size: 100,
            status: "success",
            progress: 5,
          },
        ],
      },
    });
    await w.get('[aria-label="Retry brief.pdf"]').trigger("click");
    expect(w.emitted("retry")?.[0]?.[0]).toMatchObject({
      status: "uploading",
      progress: 0,
      error: undefined,
    });
    expect(
      w
        .get('[aria-label="done.zip upload progress"]')
        .attributes("aria-valuenow"),
    ).toBe("100");
  });
  it("appends one file in single selection mode and disables a full queue", async () => {
    const w = render(FileUpload, {
        props: {
          multiple: false,
          maxFiles: 2,
          defaultValue: [{ id: "existing", name: "old.txt", size: 1 }],
        },
      }),
      input = w.get("input");
    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [new File(["1"], "one.txt"), new File(["2"], "two.txt")],
    });
    await input.trigger("change");
    expect(
      (w.emitted("update:modelValue")?.[0]?.[0] as any[]).map(
        (item) => item.name,
      ),
    ).toEqual(["old.txt", "one.txt"]);
    expect(w.text()).toContain("Upload limit reached");
    expect(w.get("button").attributes("disabled")).toBeDefined();
  });
  it("shows attachment upload, completion and delayed removal while releasing owned URLs", async () => {
    vi.useFakeTimers();
    const create = vi
        .spyOn(URL, "createObjectURL")
        .mockReturnValue("blob:orvui-test"),
      revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {}),
      w = render(AttachmentUpload),
      input = w.get("input");
    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [new File(["image"], "photo.png", { type: "image/png" })],
    });
    await input.trigger("change");
    expect(create).toHaveBeenCalledOnce();
    expect(w.find("[role=progressbar]").exists()).toBe(true);
    await vi.advanceTimersByTimeAsync(140);
    expect(w.get("[role=status]").attributes("aria-label")).toBe(
      "Upload complete for photo.png",
    );
    await vi.advanceTimersByTimeAsync(1000);
    await w.get('[aria-label="Remove photo.png"]').trigger("click");
    expect(w.get("[role=status]").attributes("aria-label")).toBe(
      "Removing photo.png",
    );
    expect(w.emitted("remove")).toBeUndefined();
    await vi.advanceTimersByTimeAsync(140);
    expect(w.emitted("remove")).toHaveLength(1);
    expect(revoke).toHaveBeenCalledWith("blob:orvui-test");
    create.mockRestore();
    revoke.mockRestore();
  });
  it("rejects attachments with the correct capacity and size reason and cancels pending work on unmount", async () => {
    vi.useFakeTimers();
    const w = render(AttachmentUpload, {
        props: { maxFiles: 1, maxFileSize: 1 },
      }),
      input = w.get("input"),
      large = new File(["large"], "large.txt"),
      extra = new File(["1"], "extra.txt");
    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [large, extra],
    });
    await input.trigger("change");
    expect(w.emitted("filesRejected")).toEqual([
      [[large], "too-large"],
      [[extra], "max-files"],
    ]);
    expect(w.emitted("filesAdded")).toBeUndefined();
    w.unmount();
    wrappers.splice(wrappers.indexOf(w), 1);
    expect(vi.getTimerCount()).toBe(0);
  });
  it("names the attachment preview dialog and releases the scroll lock on Escape", async () => {
    const w = render(AttachmentUpload, {
      props: {
        defaultValue: [
          {
            id: "image",
            name: "flower.svg",
            kind: "image",
            previewUrl:
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"/>',
          },
        ],
      },
    });
    const trigger = w.get('[aria-label="Preview flower.svg"]');
    (trigger.element as HTMLElement).focus();
    await trigger.trigger("click");
    await settle();
    expect(
      document.querySelector("[role=dialog]")?.getAttribute("aria-label"),
    ).toBe("Preview of flower.svg");
    expect(document.body.style.overflow).toBe("hidden");
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    await settle();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger.element);
  });
});
