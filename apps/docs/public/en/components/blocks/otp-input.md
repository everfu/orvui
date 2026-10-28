---
title: "OTP Input"
description: "Enter or paste a fixed-length code through grouped fields with completion feedback."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/otp-input"
markdown: "https://orvui.efu.me/en/components/blocks/otp-input.md"
license: "MIT"
productVersion: "0.1.0"
---

# OTP Input

> Enter or paste a fixed-length code through grouped fields with completion feedback.

Enter or paste a fixed-length code through grouped fields with completion feedback.

## When to use it

- Use OTP Input when the interface needs this behavior: enter or paste a fixed-length code through grouped fields with completion feedback.

## Install

### OTP Input — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/otp-input.json
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### OTP Input

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { OTPInput, type OTPStatus } from "@/components/orvui/blocks/otp-input";
const code = ref("");
const verification = ref<OTPStatus>("idle");
function verify(value: string) {
  verification.value = value === "123456" ? "success" : "error";
}
function reset() {
  verification.value = "idle";
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <OTPInput
      v-model="code"
      :status="verification"
      label="Verification code"
      hint="Enter 123456 to verify."
      success-message="Verified."
      error-message="Wrong code, try again."
      @change="reset"
      @complete="verify"
    />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { OTPInput, type OTPStatus } from "@orvui/vue/blocks/otp-input";
const code = ref("");
const verification = ref<OTPStatus>("idle");
function verify(value: string) {
  verification.value = value === "123456" ? "success" : "error";
}
function reset() {
  verification.value = "idle";
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <OTPInput
      v-model="code"
      :status="verification"
      label="Verification code"
      hint="Enter 123456 to verify."
      success-message="Verified."
      error-message="Wrong code, try again."
      @change="reset"
      @complete="verify"
    />
  </div>
</template>
```

## API Reference

### OTPInput

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `length` | `number` | `6` | No | — |
| `modelValue` | `string` | `props.value` | No | — |
| `value` | `string` | — | No | — |
| `defaultValue` | `string` | `""` | No | — |
| `label` | `string` | — | No | — |
| `hint` | `string` | — | No | — |
| `successMessage` | `string` | — | No | — |
| `errorMessage` | `string` | — | No | — |
| `status` | `"success" \| "idle" \| "error"` | `"idle"` | No | — |
| `mask` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `autoFocus` | `boolean` | `false` | No | — |
| `ariaLabel` | `string` | `"One-time passcode"` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[value: string]` | — |
| `change` | `[value: string]` | — |
| `complete` | `[value: string]` | — |

## About OTP Input

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure OTP Input?**

Configure OTP Input through length, modelValue, value, defaultValue, label, hint, successMessage, errorMessage, status, mask, disabled, autoFocus, ariaLabel, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change, complete to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/otp-input.json
- Documentation: https://orvui.efu.me/en/components/blocks/otp-input
- `packages/vue/src/blocks/otp-input/src/OTPInput.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
