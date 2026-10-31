import { describe, expect, it } from "vitest";
import expected from "../../tools/catalog/component-contract.json";
import type { ComponentDocs } from "../../apps/docs/app/utils/docs/component-docs-types";
import metadata from "../../apps/docs/app/data/component-docs.json";
const docs = metadata as unknown as ComponentDocs;
describe("frozen public component members", () => {
  for (const [key, variants] of Object.entries(expected.entries)) {
    it(`retains the documented props, events and slots for ${key}`, () => {
      for (const [variant, components] of Object.entries(variants)) {
        const current =
          variant === "default"
            ? docs.entries[key]?.default
            : docs.entries[key]?.variants[variant];
        expect(current, `${key}/${variant}`).toBeDefined();
        if (!current) throw new Error(`Missing ${key}/${variant}`);
        for (const original of components) {
          const component = current.components.find((component) =>
            component.aliases.some((alias) => original.aliases.includes(alias)),
          );
          expect(component, `${key}/${variant}/${original.name}`).toBeDefined();
          if (!component) continue;
          expect(
            component.props.map((prop) => prop.name),
            original.name,
          ).toEqual(
            expect.arrayContaining(original.props.map((prop) => prop.name)),
          );
          expect(
            component.events.map((event) => event.name),
            original.name,
          ).toEqual(expect.arrayContaining(original.events));
          expect(
            component.slots.map((slot) => slot.name),
            original.name,
          ).toEqual(expect.arrayContaining(original.slots));
          for (const property of original.props) {
            const actual = component.props.find(
              (prop) => prop.name === property.name,
            )!;
            if (!property.required)
              expect(
                actual.required,
                `${original.name}.${property.name} must stay optional`,
              ).toBe(false);
            if (
              property.type === "boolean" &&
              property.defaultValue === "undefined"
            )
              expect(
                actual.defaultValue,
                `${original.name}.${property.name} must retain an explicit undefined default`,
              ).toBe("undefined");
          }
        }
      }
    });
  }
});
