<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SignUpForm, type SignUpValues } from "./index";
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
