// @vitest-environment node
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, it, vi } from "vitest";

it("allows layout completion without a presence owner and retains owned exit callbacks", async () => {
  const entry = createRequire(import.meta.url).resolve("motion-v");
  const { ProjectionFeature } = await import(
    pathToFileURL(
      resolve(dirname(entry), "../es/features/layout/projection.mjs"),
    ).href
  );
  let complete = () => {};
  const presence: { onMotionExitComplete?: (...args: unknown[]) => void } = {};
  const state = {
    options: { layoutId: "docs-compat", animatePresenceContext: presence },
    isExiting: false,
    presenceContainer: null,
    visualElement: {
      projection: {
        isPresent: false,
        setOptions(options: { onExitComplete: () => void }) {
          complete = options.onExitComplete;
        },
      },
    },
  };
  new ProjectionFeature(state).setOptions();
  expect(() => complete()).not.toThrow();
  const owned = vi.fn();
  presence.onMotionExitComplete = owned;
  complete();
  expect(owned).toHaveBeenCalledExactlyOnceWith(null, state);
});
