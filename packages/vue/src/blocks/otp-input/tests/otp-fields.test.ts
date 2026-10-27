import { describe, expect, it } from "vitest";
import { effectScope, nextTick, reactive } from "vue";
import { useOtpFields } from "../src/use-otp-fields";

describe("OTP field editing state", () => {
  it("keeps holes during editing and emits completion only when the code becomes full", () => {
    const scope = effectScope();
    const changed: string[] = [],
      complete: string[] = [];
    const editor = scope.run(() =>
      useOtpFields({
        length: () => 4,
        value: () => undefined,
        initial: "1234",
        masked: () => true,
        changed: (value) => changed.push(value),
        completed: (value) => complete.push(value),
      }),
    )!;
    try {
      editor.cursor.value = 1;
      editor.erase(false);
      expect(editor.fields.value).toEqual(["1", "", "3", "4"]);
      expect(editor.announcement.value).toBe("Deleted. 3 of 4 digits entered.");
      editor.insert("9");
      expect(editor.fields.value).toEqual(["1", "9", "3", "4"]);
      expect(complete).toEqual(["1934"]);
      editor.insert("8");
      expect(complete).toEqual(["1934"]);
      expect(changed).toEqual(["134", "1934", "1984"]);
    } finally {
      scope.stop();
    }
  });

  it("resizes an uncontrolled code and accepts a new authoritative value", async () => {
    const props = reactive<{ length: number; value: string | undefined }>({
      length: 4,
      value: undefined,
    });
    const scope = effectScope();
    const editor = scope.run(() =>
      useOtpFields({
        length: () => props.length,
        value: () => props.value,
        initial: "1234",
        masked: () => false,
        changed: () => {},
        completed: () => {},
      }),
    )!;
    try {
      editor.cursor.value = 3;
      props.length = 2;
      await nextTick();
      expect(editor.fields.value).toEqual(["1", "2"]);
      expect(editor.cursor.value).toBe(1);
      props.value = "9x8";
      await nextTick();
      expect(editor.fields.value).toEqual(["9", "8"]);
      editor.navigate("Home");
      expect(editor.announcement.value).toContain("9, digit 1 of 2.");
    } finally {
      scope.stop();
    }
  });
});
