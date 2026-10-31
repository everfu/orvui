import { expect, it } from "vitest";
import { positionPopover } from "../src/geometry";

const viewport = { width: 390, height: 844 };
const content = { width: 288, height: 156 };
const options = {
  side: "bottom" as const,
  align: "start" as const,
  gap: 14,
  radius: 16,
};

it("keeps the requested alignment and gap when the panel fits", () => {
  const trigger = { left: 28, top: 200, width: 112, height: 40 };
  const { geometry, side } = positionPopover(
    trigger,
    content,
    viewport,
    options,
  );
  expect(side).toBe("bottom");
  expect(trigger.left + geometry.left + geometry.panel.x).toBe(28);
  expect(trigger.top + geometry.top + geometry.panel.y).toBe(254);
  expect(geometry.panel.w).toBe(288);
  expect(geometry.panel.h).toBe(156);
});

it("opens above a low trigger and clamps its right edge inside the viewport", () => {
  const trigger = { left: 250, top: 780, width: 112, height: 40 };
  const { geometry, side } = positionPopover(
    trigger,
    content,
    viewport,
    options,
  );
  expect(side).toBe("top");
  const left = trigger.left + geometry.left + geometry.panel.x;
  const top = trigger.top + geometry.top + geometry.panel.y;
  expect(left).toBe(90);
  expect(top + geometry.panel.h + options.gap).toBe(trigger.top);
  expect(left + geometry.panel.w).toBe(viewport.width - 12);
});

it("chooses the larger side and limits tall content without covering the trigger", () => {
  const trigger = { left: 20, top: 120, width: 112, height: 40 };
  const { geometry, availableHeight } = positionPopover(
    trigger,
    { width: 288, height: 900 },
    { width: 320, height: 480 },
    options,
  );
  expect(availableHeight).toBe(294);
  expect(geometry.panel.h).toBe(294);
  const top = trigger.top + geometry.top + geometry.panel.y;
  expect(top).toBe(174);
  expect(top + geometry.panel.h).toBe(468);
});
