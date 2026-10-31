import { afterEach, describe, expect, it, vi } from "vitest";
import {
  appearanceBootstrap,
  readStoredAppearance,
  type Appearance,
} from "../apps/docs/app/utils/docs/appearance";

function storageWith(values: Record<string, string>) {
  const entries = new Map(Object.entries(values));
  return {
    getItem: vi.fn((key: string) => entries.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => entries.set(key, value)),
  };
}

function bootstrap(storage: ReturnType<typeof storageWith>, systemDark = false) {
  const browser = {
    localStorage: storage,
    matchMedia: () => ({ matches: systemDark }),
  };
  new Function("window", "document", appearanceBootstrap)(browser, document);
}

afterEach(() => {
  document.documentElement.classList.remove("dark");
});

describe("renamed appearance preference", () => {
  it.each([
    [{ "orvui-theme": "light", "iui-theme": "dark" }, "light", false],
    [{ "orvui-theme": "dark", "iui-theme": "light" }, "dark", false],
    [{ "orvui-theme": "system", "iui-theme": "light" }, "system", false],
    [{ "iui-theme": "light" }, "light", true],
    [{ "orvui-theme": "invalid", "iui-theme": "dark" }, "dark", true],
    [{ "orvui-theme": "", "iui-theme": "system" }, "system", true],
    [{ "orvui-theme": "invalid", "iui-theme": "invalid" }, "dark", false],
    [{}, "dark", false],
  ] as Array<[Record<string, string>, Appearance, boolean]>)(
    "uses valid current preferences before legacy values %j",
    (values, expected, migrated) => {
      const storage = storageWith(values);
      expect(readStoredAppearance(storage)).toBe(expected);
      if (migrated) {
        expect(storage.setItem).toHaveBeenCalledExactlyOnceWith(
          "orvui-theme",
          expected,
        );
        expect(storage.getItem("iui-theme")).toBe(values["iui-theme"]);
      } else expect(storage.setItem).not.toHaveBeenCalled();

      for (const systemDark of [false, true]) {
        const bootStorage = storageWith(values);
        bootstrap(bootStorage, systemDark);
        expect(document.documentElement.classList.contains("dark")).toBe(
          expected === "dark" || (expected === "system" && systemDark),
        );
        expect(bootStorage.getItem("orvui-theme")).toBe(
          migrated ? expected : values["orvui-theme"] ?? null,
        );
      }
    },
  );

  it("keeps a valid legacy appearance when migration writes are blocked", () => {
    const storage = storageWith({ "iui-theme": "light" });
    storage.setItem.mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(readStoredAppearance(storage)).toBe("light");
    expect(() => bootstrap(storage)).not.toThrow();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("uses the same dark default when storage reads or access are blocked", () => {
    const storage = storageWith({});
    storage.getItem.mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(readStoredAppearance(storage)).toBe("dark");
    bootstrap(storage);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    document.documentElement.classList.remove("dark");
    const browser = Object.defineProperty({}, "localStorage", {
      get() {
        throw new DOMException("blocked", "SecurityError");
      },
    });
    expect(() =>
      new Function("window", "document", appearanceBootstrap)(browser, document),
    ).not.toThrow();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
