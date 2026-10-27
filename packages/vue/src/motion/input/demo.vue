<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Eye, EyeOff, Mail, Search } from "lucide-vue-next";
import { Input } from "./index";
const form = reactive({ email: "", password: "orvui2026", query: "Kai" }), visible = ref(false);
const emailError = computed(() => form.email && !form.email.includes("@") ? "Use a valid email address." : undefined);
</script>
<template><div class="flex w-full max-w-xs flex-col gap-1">
  <Input v-model="form.email" label="Email" type="email" placeholder="you@example.com" :error="emailError" reserve-error-line><template #leftIcon><Mail /></template></Input>
  <Input v-model="form.password" label="Password" :type="visible ? 'text' : 'password'" reserve-error-line><template #rightIcon><button type="button" @click="visible = !visible" :aria-label="visible ? 'Hide password' : 'Show password'" class="pointer-events-auto"><EyeOff v-if="visible" /><Eye v-else /></button></template></Input>
  <Input v-model="form.query" label="Search" :success="form.query.length > 1" reserve-error-line><template #leftIcon><Search /></template></Input>
</div></template>
