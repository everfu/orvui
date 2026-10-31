import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { expect, it } from "vitest";
import {
  provideSitePreferences,
  useSitePreferences,
} from "../apps/docs/app/composables/preferences";

it("shares a shell palette across independent controls without resetting when a scene unmounts", async () => {
  const visible = ref(true);
  const Consumer = defineComponent({
    setup() {
      const { colorTheme, setColorTheme } = useSitePreferences();
      return () =>
        h(
          "button",
          { onClick: () => setColorTheme("violet") },
          colorTheme.value,
        );
    },
  });
  const wrapper = mount(
    defineComponent({
      setup() {
        provideSitePreferences();
        return () =>
          h("div", [h(Consumer), visible.value ? h(Consumer) : null]);
      },
    }),
  );
  await wrapper.findAll("button")[1].trigger("click");
  expect(wrapper.findAll("button").map((button) => button.text())).toEqual([
    "violet",
    "violet",
  ]);
  expect(document.documentElement.dataset.theme).toBe("violet");
  visible.value = false;
  await nextTick();
  expect(document.documentElement.dataset.theme).toBe("violet");
  visible.value = true;
  await nextTick();
  expect(wrapper.findAll("button")[1].text()).toBe("violet");
  wrapper.unmount();
  expect(document.documentElement.dataset.theme).toBeUndefined();
});
