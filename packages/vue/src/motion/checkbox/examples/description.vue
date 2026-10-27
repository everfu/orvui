<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "../index";
const selected = reactive<Record<string, boolean>>({ comments: true, mentions: true, digest: false });
const options = [
  { id: "comments", label: "Comments", description: "Replies to conversations you began." },
  { id: "mentions", label: "Mentions", description: "A notification when your name is tagged." },
  { id: "digest", label: "Weekly digest", description: "A Monday overview of recent activity." },
];
</script>
<template><div class="flex w-full max-w-64 flex-col gap-3">
  <Checkbox v-for="option in options" :key="option.id" v-model="selected[option.id]" :label="option.label" :description="option.description" />
  <Checkbox :model-value="false" disabled label="SMS alerts" description="Connect your phone number to begin." />
</div></template>
