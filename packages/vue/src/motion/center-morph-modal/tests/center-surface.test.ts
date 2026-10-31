import { afterEach, expect, it, vi } from "vitest";
import { h, nextTick } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import {
  CenterMorphModal,
  CenterMorphModalTrigger,
  CenterMorphModalContent,
} from "..";
const wrappers: VueWrapper[] = [];
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});
async function render() {
  const wrapper = mount(CenterMorphModal, {
    attachTo: document.body,
    slots: {
      default: () => [
        h(CenterMorphModalTrigger, {}, () =>
          h("button", { id: "opener" }, "Open"),
        ),
        h(CenterMorphModalContent, { ariaLabel: "Details" }, () =>
          h("button", "Action"),
        ),
      ],
    },
  });
  wrappers.push(wrapper);
  const opener = wrapper.get('[aria-haspopup="dialog"]');
  (opener.element as HTMLElement).focus();
  await opener.trigger("click");
  await vi.waitFor(
    () =>
      expect(
        document.querySelector<HTMLElement>('[role="dialog"]')?.style.clipPath,
      ).toMatch(/^inset\(0%/),
    { timeout: 3000 },
  );
  return { wrapper, opener };
}
function escape() {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    }),
  );
}

it("retains the closing surface without retaining modal interaction and removes it when the clip finishes", async () => {
  const { opener } = await render();
  const panel = document.querySelector<HTMLElement>('[role="dialog"]')!;
  escape();
  await nextTick();
  expect(document.querySelector('[role="dialog"]')).toBe(panel);
  expect(panel.style.pointerEvents).toBe("none");
  expect(panel.closest<HTMLElement>("[inert]")?.inert).toBe(true);
  expect(document.activeElement).toBe(opener.element);
  await vi.waitFor(
    () => expect(document.querySelector('[role="dialog"]')).toBeNull(),
    { timeout: 3000 },
  );
  expect(document.body.style.overflow).not.toBe("hidden");
});

it("reverses an interrupted exit without letting the old completion remove the reopened surface", async () => {
  const { opener } = await render();
  escape();
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 50));
  await opener.trigger("click");
  await new Promise((resolve) => setTimeout(resolve, 550));
  const panel = document.querySelector<HTMLElement>('[role="dialog"]')!;
  expect(panel).not.toBeNull();
  expect(panel.closest("[inert]")).toBeNull();
  expect(panel.style.clipPath).toMatch(/^inset\(0%/);
  expect(document.activeElement?.textContent).toBe("Action");
});
