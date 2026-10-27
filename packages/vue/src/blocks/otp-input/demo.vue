<script setup lang="ts">
import { ref } from "vue";
import { OTPInput, type OTPStatus } from "./index";
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
