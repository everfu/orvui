# DESIGN.md · Preview

Guide your coding assistant with orvui’s semantic themes, component composition and interaction style.

> Product version: 0.1.1

<a id="add-to-project"></a>

## Add to your project

Download [DESIGN.md](/orvui-agent/en/DESIGN.md) for visual and interaction guidance. Update the relevant sections when customizing your theme.

Save the file under its standard name in the project root, matching the prompts and references below. If the file already exists, open the download link above and merge the sections you need.

```bash
curl -fsSL https://orvui.efu.me/orvui-agent/en/DESIGN.md -o DESIGN.md
```

<a id="usage"></a>

## Connect to your assistant

DESIGN.md is not automatically discovered by every assistant. Reference it from [AGENTS.md](/en/docs/agents-md), editor rules or your prompt.

```markdown
Follow [DESIGN.md](./DESIGN.md) for visual and interaction decisions. Use orvui semantic colors and public components.
```

<a id="included"></a>

## What’s included

Semantic colors and default light/dark values, eleven palettes, layout and hierarchy, composition, motion, keyboard and focus, and SSR/hydration. Theme values are read directly from library definitions.

<a id="preview"></a>

## File preview

```markdown
# orvui DESIGN.md

Product version: 0.1.1

Keep generated interfaces consistent with orvui. Reference this file from AGENTS.md, editor rules or your prompt; do not assume agents automatically discover DESIGN.md.

## Semantic theme

Use semantic utilities such as bg-background, text-foreground, bg-card, border-border and ring-ring with their CSS variables. Let themes control appearance and palette rather than hardcoding page colors. See [Theming](https://orvui.efu.me/en/docs/theme).

Palettes: `default`, `violet`, `blue`, `green`, `amber`, `blood-orange`, `rose`, `red`, `teal`, `indigo`, `lime`.

These default values come directly from the library for handoff and verification. Reference semantic variables in implementations. Update this file when customizing your project's theme.

| Variable | Light | Dark |
| --- | --- | --- |
| `--background` | `oklch(99% 0 0)` | `#151515` |
| `--foreground` | `oklch(15% 0 0)` | `oklch(96% 0 0)` |
| `--card` | `oklch(97% 0 0)` | `#1c1c1c` |
| `--card-foreground` | `oklch(15% 0 0)` | `oklch(96% 0 0)` |
| `--popover` | `oklch(97% 0 0)` | `#1c1c1c` |
| `--popover-foreground` | `oklch(15% 0 0)` | `oklch(96% 0 0)` |
| `--primary` | `#0285f7` | `#0285f7` |
| `--primary-foreground` | `#ffffff` | `#ffffff` |
| `--muted` | `oklch(97% 0 0)` | `#1c1c1c` |
| `--muted-foreground` | `oklch(50% 0 0)` | `oklch(62% 0 0)` |
| `--border` | `oklch(15% 0 0 / 0.06)` | `rgb(255 255 255 / 0.05)` |
| `--ring` | `oklch(15% 0 0 / 0.12)` | `rgb(255 255 255 / 0.1)` |

## Layout and hierarchy

- Preserve the chosen components' typography, spacing, corners, borders and shadows. Compose layouts through public props and slots rather than resetting every component's dimensions.
- The default theme maps fonts to Geist and Geist Mono. Respect the application's font setup and retain readable text and code hierarchy.
- Use content order, whitespace and surface hierarchy to organize information. Reserve the primary color for primary actions, selection and focus. Reflow narrow layouts rather than shrinking the entire interface.

## Composition and motion

- Use orvui's public components and composition parts with their actual state bindings. Preserve geometry, springs and transitions; avoid wrappers that duplicate animation.
- Custom interactions use shared springs and whilePress. Honor prefers-reduced-motion by reducing displacement and overshoot while retaining understandable state feedback. See [Animation](https://orvui.efu.me/en/docs/motion-patterns).

## Accessibility and server rendering

- Preserve keyboard operation, visible focus, accessible names, disabled and validation feedback, and overlay focus management and dismissal.
- Check text, border and focus contrast in both appearances. Keep targets usable by touch and contain content and code within mobile viewports.
- Use deterministic initial state and per-instance IDs in Vue/Nuxt. Create browser resources after mounting and release them on unmount to avoid hydration mismatches.

## Source and licenses

Preserve actual provenance, copyright and applicable licenses for code and assets, including the Paper Design shader license and font OFL. See [LICENSE](https://orvui.efu.me/licenses/MIT.txt) and [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt).

```

## Next steps

- [Theme setup](/en/docs/theme)
- [Motion that explains, not distracts](/en/docs/motion-patterns)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
