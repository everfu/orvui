import { describe, expect, it } from "vitest";
import * as library from "../packages/vue/src";
import baseline from "./fixtures/runtime-defaults.json";

describe("frozen runtime prop defaults", () => {
  for (const [name, properties] of Object.entries(baseline.components)) {
    it(`preserves ${name} defaults`, () => {
      const component = (library as Record<string, any>)[name];
      expect(component, name).toBeDefined();
      for (const [key, contract] of Object.entries(properties)) {
        const definition = component.props?.[key];
        expect(definition, `${name}.${key}`).toBeDefined();
        if (contract.kind === "runtime") continue;
        let value = definition.default;
        if (typeof value === "function" && definition.type !== Function) value = value({});
        if (contract.kind === "undefined") expect(value, `${name}.${key}`).toBeUndefined();
        else if (contract.kind === "function") expect(typeof value, `${name}.${key}`).toBe("function");
        else if (contract.kind === "date") expect(value, `${name}.${key}`).toBeInstanceOf(Date);
        else expect(JSON.parse(JSON.stringify(value, (_key, entry) => typeof entry === "function" ? { __orvuiType: "function" } : entry)), `${name}.${key}`).toEqual("value" in contract ? contract.value : undefined);
      }
    });
  }
});
