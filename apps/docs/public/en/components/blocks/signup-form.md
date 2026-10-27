---
title: "Sign Up Form"
description: "Move through registration fields with local validation and explicit submission states."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/signup-form"
markdown: "https://orvui.efu.me/en/components/blocks/signup-form.md"
license: "MIT"
productVersion: "0.1.0"
---

# Sign Up Form

> Move through registration fields with local validation and explicit submission states.

## Install

### Sign Up Form — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/signup-form.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

After npm publication, use the package command below. Before publication, install the verified local archive.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add ./orvui-vue-0.1.0.tgz
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Sign Up Form

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SignUpForm, type SignUpValues } from "@/components/orvui/blocks/signup-form";
const error = ref<string>();
let timer: ReturnType<typeof setTimeout> | undefined,
  finish: (() => void) | undefined,
  disposed = false;
async function submit(values: SignUpValues) {
  error.value = undefined;
  await new Promise<void>((resolve) => {
    finish = resolve;
    timer = setTimeout(() => {
      finish = undefined;
      resolve();
    }, 1200);
  });
  if (disposed) return;
  if (values.email.toLowerCase().startsWith("taken@")) {
    error.value = "This address belongs to an existing demo account.";
    throw new Error("Demo account already exists");
  }
}
onBeforeUnmount(() => {
  disposed = true;
  clearTimeout(timer);
  finish?.();
});
</script>
<template>
  <div class="flex w-full justify-center py-4">
    <SignUpForm
      description="Use taken@example.com to preview a rejected signup."
      :error-message="error"
      :on-submit="submit"
      ><template #footer
        >Have a workspace already?
        <button
          type="button"
          class="font-medium text-foreground underline underline-offset-4"
        >
          Sign in
        </button></template
      ></SignUpForm
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SignUpForm, type SignUpValues } from "@orvui/vue/blocks/signup-form";
const error = ref<string>();
let timer: ReturnType<typeof setTimeout> | undefined,
  finish: (() => void) | undefined,
  disposed = false;
async function submit(values: SignUpValues) {
  error.value = undefined;
  await new Promise<void>((resolve) => {
    finish = resolve;
    timer = setTimeout(() => {
      finish = undefined;
      resolve();
    }, 1200);
  });
  if (disposed) return;
  if (values.email.toLowerCase().startsWith("taken@")) {
    error.value = "This address belongs to an existing demo account.";
    throw new Error("Demo account already exists");
  }
}
onBeforeUnmount(() => {
  disposed = true;
  clearTimeout(timer);
  finish?.();
});
</script>
<template>
  <div class="flex w-full justify-center py-4">
    <SignUpForm
      description="Use taken@example.com to preview a rejected signup."
      :error-message="error"
      :on-submit="submit"
      ><template #footer
        >Have a workspace already?
        <button
          type="button"
          class="font-medium text-foreground underline underline-offset-4"
        >
          Sign in
        </button></template
      ></SignUpForm
    >
  </div>
</template>
```

## API Reference

### SignUpForm

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `SignUpValues` | `options.values` | No | — |
| `values` | `SignUpValues` | — | No | — |
| `defaultValues` | `Partial<SignUpValues>` | — | No | — |
| `validate` | `(values: SignUpValues) => SignUpErrors` | `defaultValidate` | No | — |
| `status` | `"success" \| "idle" \| "loading" \| "error"` | `localStatus.value` | No | — |
| `errorMessage` | `string` | — | No | — |
| `title` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Create your account"` | No | — |
| `description` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Start building in under a minute."` | No | — |
| `submitLabel` | `string` | `"Create account"` | No | — |
| `footer` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `strengthMeter` | `boolean` | `true` | No | — |
| `className` | `string` | — | No | — |
| `classNames` | `SignUpFormClassNames` | — | No | — |
| `onSubmit` | `(values: SignUpValues) => void \| Promise<void>` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[values: SignUpValues]` | — |
| `valuesChange` | `[values: SignUpValues]` | — |
| `success` | `[values: SignUpValues]` | — |
| `error` | `[error: unknown]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `footer` | `() => VNodeChild` | — | — |

## About Sign Up Form

Move through registration fields with local validation and explicit submission states.

### When to use it

- Use Sign Up Form when the interface needs this behavior: move through registration fields with local validation and explicit submission states.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Sign Up Form?**

Configure Sign Up Form through modelValue, values, defaultValues, validate, status, errorMessage, title, description, submitLabel, footer, strengthMeter, className, classNames, onSubmit. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valuesChange, success, error to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/signup-form.json
- Documentation: https://orvui.efu.me/en/components/blocks/signup-form
- `packages/vue/src/blocks/signup-form/src/SignUpForm.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
