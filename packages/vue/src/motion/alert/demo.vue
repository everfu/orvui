<script setup lang="ts">
import { computed, ref } from "vue";
import { Alert, AlertAction, AlertClose, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "./index";
import { Button } from "../button";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import { resolveElement } from "../../lib/composables";
const messages = {
  info: { label: "Info", title: "A quick update", description: "Edits are stored in the background while you work." },
  success: { label: "Success", title: "Ready to go", description: "Your latest edits are now stored." },
  warning: { label: "Warning", title: "Storage is nearly full", description: "There is only a little storage left. Remove a few unused files to make room for your next upload." },
  destructive: { label: "Error", title: "Please try once more", description: "The latest edits could not be stored. Try saving again." },
};
type Variant = keyof typeof messages;
const selected = ref<Variant>("info"), opened = ref(true), showButton = ref<HTMLElement | null>(null);
const message = computed(() => messages[selected.value]);
function choose(value: string) { selected.value = value as Variant; opened.value = true; }
</script>
<template>
  <div class="flex w-full max-w-md flex-col items-center gap-6">
    <Tabs :model-value="selected" @update:model-value="choose" class="w-full"><TabsList aria-label="Alert variant" class="bg-muted">
      <TabsTrigger v-for="(item, variant) in messages" :key="variant" :value="variant" class="px-3 py-1.5 text-xs">{{ item.label }}</TabsTrigger>
    </TabsList></Tabs>
    <Alert v-model:open="opened" :variant="selected" :return-focus-ref="showButton ?? undefined"><AlertIcon /><AlertContent>
      <AlertTitle>{{ message.title }}</AlertTitle><AlertDescription>{{ message.description }}</AlertDescription>
      <AlertAction v-if="selected === 'destructive'"><Button size="sm" variant="outline" @click="selected = 'success'">Try again</Button></AlertAction>
    </AlertContent><AlertClose /></Alert>
    <Button :ref="node => showButton = resolveElement<HTMLElement>(node)" variant="ghost" size="sm" @click="opened = true" :disabled="opened">Show alert</Button>
  </div>
</template>
