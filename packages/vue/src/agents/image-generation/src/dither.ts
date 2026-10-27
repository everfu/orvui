interface Dot {
  x: number;
  y: number;
}

/** Creates a responsive lattice and owns its animation and pointer subscriptions. */
export function createDitherField(
  canvas: HTMLCanvasElement,
  interactive: boolean,
  reduce: boolean,
  canHover: boolean,
) {
  const brush = canvas.getContext("2d");
  if (!brush) return () => {};
  let disposed = false;
  let width = 208,
    height = 208,
    color = "currentColor";
  let dots: Dot[] = [];
  let pointer: Dot | null = null;
  let focus: Dot = { x: width / 2, y: height / 2 };
  let frame: number | undefined;
  let last: number | undefined;
  const followsPointer = interactive && canHover && !reduce;

  const render = (time: number) => {
    frame = undefined;
    if (disposed) return;
    const elapsed =
      last === undefined ? 1000 / 60 : Math.min(100, Math.max(0, time - last));
    last = time;
    const goal = pointer ?? {
      x: width * (0.5 + (reduce ? 0 : 0.12 * Math.sin(time / 1700))),
      y: height * (0.5 + (reduce ? 0 : 0.1 * Math.cos(time / 2100))),
    };
    const response = reduce
      ? 1
      : 1 - Math.pow(pointer ? 0.84 : 0.955, elapsed * 0.06);
    focus.x += (goal.x - focus.x) * response;
    focus.y += (goal.y - focus.y) * response;
    const reach = Math.min(width, height) * 0.38;
    brush.clearRect(0, 0, width, height);
    brush.fillStyle = color;
    for (const dot of dots) {
      const dx = dot.x - focus.x,
        dy = dot.y - focus.y;
      const distance = Math.hypot(dx, dy);
      const phase = Math.min(1, distance / reach);
      const intensity = 0.5 + 0.5 * Math.cos(phase * Math.PI);
      const offset = intensity * intensity * 9;
      const ratio = distance > 0 ? offset / distance : 0;
      brush.globalAlpha = 0.17 + intensity * 0.72;
      brush.beginPath();
      brush.arc(
        dot.x + dx * ratio,
        dot.y + dy * ratio,
        0.65 + intensity * 0.85,
        0,
        Math.PI * 2,
      );
      brush.fill();
    }
    brush.globalAlpha = 1;
    if (!reduce) frame = requestAnimationFrame(render);
  };
  const resize = () => {
    if (disposed) return;
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width || canvas.clientWidth || 208;
    height = bounds.height || canvas.clientHeight || 208;
    const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    brush.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    color = getComputedStyle(canvas).color;
    const columns = Math.ceil(width / 10),
      rows = Math.ceil(height / 10);
    const left = (width - columns * 10) / 2,
      top = (height - rows * 10) / 2;
    dots = Array.from({ length: (columns + 1) * (rows + 1) }, (_, index) => ({
      x: left + (index % (columns + 1)) * 10,
      y: top + Math.floor(index / (columns + 1)) * 10,
    }));
    focus = { x: width / 2, y: height / 2 };
    if (frame !== undefined) cancelAnimationFrame(frame);
    last = undefined;
    render(0);
  };
  const move = (event: PointerEvent) => {
    if (!followsPointer) return;
    const box = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  const leave = () => {
    pointer = null;
  };
  const observer =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
  canvas.addEventListener("pointermove", move, { passive: true });
  canvas.addEventListener("pointerleave", leave);
  observer?.observe(canvas);
  resize();
  return () => {
    if (disposed) return;
    disposed = true;
    if (frame !== undefined) cancelAnimationFrame(frame);
    observer?.disconnect();
    canvas.removeEventListener("pointermove", move);
    canvas.removeEventListener("pointerleave", leave);
    dots = [];
  };
}
