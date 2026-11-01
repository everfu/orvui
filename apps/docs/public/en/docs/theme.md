# Theme setup

Load component styles first, then choose a palette and appearance mode. Override semantic CSS variables to customize the parts you need while keeping components consistent.

> Product version: 0.1.1

<a id="import-order"></a>

## Import styles in order

For source installation, import Tailwind and the generated stylesheet before your overrides. For the package, import its stylesheet once in the application entry.

```css
@import "tailwindcss";
@import "./components/orvui/styles.css";

/* Application overrides follow these imports. */
```

```typescript
import '@orvui/vue/style.css'
```

> **Tip**: Use either the generated source stylesheet or the package stylesheet to avoid importing the complete theme twice.

<a id="palettes"></a>

## Choose a palette

The theme panel offers 11 palettes. Choose one and copy its CSS to the end of your stylesheet. Palettes preserve component dimensions and interactions.

```css
:root {
  --primary: #0285f7;
  --primary-foreground: #ffffff;
}
```

<a id="appearance"></a>

## Switch light and dark modes

Apply the dark class to the root element for dark mode; remove it for light mode. Keep the initial choice consistent across first render and client hydration.

```html
<html class="dark">
  <!-- Your application -->
</html>
```

<a id="semantic-overrides"></a>

## Override semantic variables

Prefer semantic variables such as background, foreground, primary and border. Scope overrides to a container so its components inherit them without affecting the rest of the page.

```css
.account-panel {
  --primary: #0285f7;
  --primary-foreground: #ffffff;
}

.dark .account-panel {
  --primary: #5caeff;
  --primary-foreground: #151515;
}
```

> **Tip**: Use public classes, slots or semantic variables before overriding internal state selectors.

<a id="shadcn-init"></a>

## Existing shadcn-vue projects

Reuse existing tokens in a shadcn-vue project. For a new project, initialize it first, then import the complete generated orvui styles as described in the installation guide.

```bash
pnpm dlx shadcn-vue@2.8.2 init
```

<a id="theme-css"></a>

## Inspect the complete stylesheet

Inspect the complete tokens, motion animations and helpers below, or download [theme.css](/theme.css).

```css
/* Generated from the orvui theme compatibility contract. */

:root {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: #0285f7;
  --primary-foreground: #ffffff;
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(72% 0.18 195);
  --accent-foreground: var(--accent-fg);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: var(--border-strong);
}

.dark {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: #0285f7;
  --primary-foreground: #ffffff;
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(80% 0.18 195);
  --accent-foreground: var(--accent-fg);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: var(--border-strong);
}

[data-theme="violet"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(55% 0.2 290);
  --primary-foreground: oklch(99% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(55% 0.2 290);
  --accent-foreground: oklch(99% 0 0);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(55% 0.2 290 / 0.5);
}
.dark[data-theme="violet"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(72% 0.16 290);
  --primary-foreground: oklch(15% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(72% 0.16 290);
  --accent-foreground: oklch(15% 0 0);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(72% 0.16 290 / 0.55);
}

[data-theme="blue"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(55% 0.18 255);
  --primary-foreground: oklch(99% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(55% 0.18 255);
  --accent-foreground: oklch(99% 0 0);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(55% 0.18 255 / 0.5);
}
.dark[data-theme="blue"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(70% 0.15 255);
  --primary-foreground: oklch(15% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(70% 0.15 255);
  --accent-foreground: oklch(15% 0 0);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(70% 0.15 255 / 0.55);
}

[data-theme="green"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(56% 0.14 150);
  --primary-foreground: oklch(99% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(56% 0.14 150);
  --accent-foreground: oklch(99% 0 0);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(56% 0.14 150 / 0.5);
}
.dark[data-theme="green"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(72% 0.15 150);
  --primary-foreground: oklch(15% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(72% 0.15 150);
  --accent-foreground: oklch(15% 0 0);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(72% 0.15 150 / 0.55);
}

[data-theme="amber"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(74% 0.15 70);
  --primary-foreground: oklch(20% 0.02 70);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(74% 0.15 70);
  --accent-foreground: oklch(20% 0.02 70);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(74% 0.15 70 / 0.5);
}
.dark[data-theme="amber"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(80% 0.15 75);
  --primary-foreground: oklch(18% 0.02 75);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(80% 0.15 75);
  --accent-foreground: oklch(18% 0.02 75);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(80% 0.15 75 / 0.55);
}

[data-theme="blood-orange"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(60% 0.19 40);
  --primary-foreground: oklch(99% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(60% 0.19 40);
  --accent-foreground: oklch(99% 0 0);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(60% 0.19 40 / 0.5);
}
.dark[data-theme="blood-orange"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(72% 0.17 42);
  --primary-foreground: oklch(15% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(72% 0.17 42);
  --accent-foreground: oklch(15% 0 0);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(72% 0.17 42 / 0.55);
}

[data-theme="rose"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(58% 0.2 12);
  --primary-foreground: oklch(99% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(58% 0.2 12);
  --accent-foreground: oklch(99% 0 0);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(58% 0.2 12 / 0.5);
}
.dark[data-theme="rose"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(70% 0.17 12);
  --primary-foreground: oklch(15% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(70% 0.17 12);
  --accent-foreground: oklch(15% 0 0);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(70% 0.17 12 / 0.55);
}

[data-theme="red"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(55% 0.22 25);
  --primary-foreground: oklch(99% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(55% 0.22 25);
  --accent-foreground: oklch(99% 0 0);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(55% 0.22 25 / 0.5);
}
.dark[data-theme="red"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(68% 0.19 25);
  --primary-foreground: oklch(15% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(68% 0.19 25);
  --accent-foreground: oklch(15% 0 0);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(68% 0.19 25 / 0.55);
}

[data-theme="teal"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(55% 0.12 185);
  --primary-foreground: oklch(99% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(55% 0.12 185);
  --accent-foreground: oklch(99% 0 0);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(55% 0.12 185 / 0.5);
}
.dark[data-theme="teal"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(72% 0.13 185);
  --primary-foreground: oklch(15% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(72% 0.13 185);
  --accent-foreground: oklch(15% 0 0);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(72% 0.13 185 / 0.55);
}

[data-theme="indigo"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(50% 0.2 275);
  --primary-foreground: oklch(99% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(50% 0.2 275);
  --accent-foreground: oklch(99% 0 0);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(50% 0.2 275 / 0.5);
}
.dark[data-theme="indigo"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(70% 0.16 275);
  --primary-foreground: oklch(15% 0 0);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(70% 0.16 275);
  --accent-foreground: oklch(15% 0 0);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(70% 0.16 275 / 0.55);
}

[data-theme="lime"] {
  --border-strong: oklch(15% 0 0 / 0.12);
  --accent-fg: oklch(15% 0 0);
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: oklch(99% 0 0 / 0.55);
  --glass-border: oklch(15% 0 0 / 0.08);
  --glass-strong-bg: rgb(255 255 255 / 0.7);
  --glass-thin-bg: rgb(255 255 255 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(99% 0 0) 0%, oklch(96% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(72% 0.18 195) 0%, oklch(68% 0.22 295) 100%);
  --background: oklch(99% 0 0);
  --foreground: oklch(15% 0 0);
  --card: oklch(97% 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(72% 0.18 130);
  --primary-foreground: oklch(20% 0.04 130);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(72% 0.18 130);
  --accent-foreground: oklch(20% 0.04 130);
  --destructive: var(--danger);
  --border: oklch(15% 0 0 / 0.06);
  --input: var(--border);
  --ring: oklch(72% 0.18 130 / 0.5);
}
.dark[data-theme="lime"] {
  --border-strong: rgb(255 255 255 / 0.1);
  --accent-fg: #151515;
  --neon: oklch(80% 0.22 145);
  --violet: oklch(68% 0.22 295);
  --danger: oklch(62% 0.22 25);
  --success: oklch(70% 0.18 155);
  --warning: oklch(78% 0.18 75);
  --glass-bg: rgb(28 28 28 / 0.55);
  --glass-border: rgb(255 255 255 / 0.08);
  --glass-strong-bg: rgb(28 28 28 / 0.6);
  --glass-thin-bg: rgb(21 21 21 / 0.45);
  --gradient-bg: linear-gradient(135deg, oklch(19% 0 0) 0%, oklch(22% 0.008 210) 100%);
  --gradient-accent: linear-gradient(to right, oklch(80% 0.18 195) 0%, oklch(72% 0.18 295) 100%);
  --background: #151515;
  --foreground: oklch(96% 0 0);
  --card: #1c1c1c;
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(80% 0.18 130);
  --primary-foreground: oklch(18% 0.04 130);
  --secondary: var(--card);
  --secondary-foreground: var(--foreground);
  --muted: var(--card);
  --muted-foreground: oklch(62% 0 0);
  --accent: oklch(80% 0.18 130);
  --accent-foreground: oklch(18% 0.04 130);
  --destructive: var(--danger);
  --border: rgb(255 255 255 / 0.05);
  --input: var(--border);
  --ring: oklch(80% 0.18 130 / 0.55);
}

@theme inline {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-neon: var(--neon);
  --color-violet: var(--violet);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --font-sans: var(--font-geist-sans, Geist), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono, "Geist Mono"), ui-monospace, monospace;
  --font-display: var(--font-geist-sans, Geist), ui-sans-serif, system-ui, sans-serif;
}


```

<a id="next-steps"></a>

## Verify and continue

Check text, borders, focus and disabled states in both modes, then verify narrow layouts. Continue with the [motion guide](/en/docs/motion-patterns) to keep appearance and interaction consistent.


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
