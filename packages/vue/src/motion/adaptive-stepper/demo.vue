<script setup lang="ts">
import { AdaptiveStepper, AdaptiveStepperDecrement, AdaptiveStepperIncrement, AdaptiveStepperValue } from "./index";
const limits = { min: 0, max: 3, defaultValue: 2 };
</script>
<template><div class="flex min-h-[320px] w-full items-center justify-center px-4"><AdaptiveStepper v-bind="limits" aria-label="Guests"><AdaptiveStepperDecrement /><AdaptiveStepperValue /><AdaptiveStepperIncrement /></AdaptiveStepper></div></template>
