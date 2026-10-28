import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { afterEach, expect, it, vi } from "vitest";
import { WheelPicker } from "..";

afterEach(() => vi.unstubAllGlobals());
it("centers the accepted value initially and after controlled updates in reduced mode", async () => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    })),
  );
  const wrapper = mount(WheelPicker, {
    props: {
      options: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      modelValue: "Jun",
      itemHeight: 42,
    },
  });
  await nextTick();
  await nextTick();
  const list = wrapper.find("ul").element as HTMLUListElement;
  expect(list.scrollTop).toBe(210);
  await wrapper.setProps({ modelValue: "Mar" });
  expect(list.scrollTop).toBe(84);
  await wrapper.setProps({ options: ["Mar", "Apr"], itemHeight: 36 });
  expect(list.scrollTop).toBe(0);
  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  wrapper.unmount();
});
