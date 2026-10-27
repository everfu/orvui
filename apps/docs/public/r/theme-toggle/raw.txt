<script setup lang="ts">
import { computed, watch } from "vue";
import { cn } from "../../../lib/utils";
import { Moon, Sun } from "lucide-vue-next";
import ActionSwapIcon from "../../action-swap/src/ActionSwapIcon.vue";
import { useThemeToggle, type RectStart, type ThemeVariant } from "./useThemeToggle";
const props = withDefaults(defineProps<{
  modelValue?: "light" | "dark"; variant?: ThemeVariant; start?: RectStart; iconClassName?: string;
}>(), { variant: "rectangle", start: "bottom-up" });
const emit = defineEmits(["update:modelValue", "change"]);
const theme = useThemeToggle(props);
const label = computed(() => theme.mounted.value && theme.isDark.value ? "Switch to light mode" : "Switch to dark mode");
watch([() => props.modelValue, theme.mounted], ([requested, ready], [, previouslyReady]) => {
  if (ready && requested !== undefined) theme.applyTheme(requested, previouslyReady);
}, { flush: "sync" });
function activate() {
  const current = props.modelValue ?? (theme.isDark.value ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  if (props.modelValue === undefined) theme.toggle();
  emit("update:modelValue", next);
  emit("change", next);
}
</script>
<template>
  <button type="button" :aria-label="label" @click="activate" :class="cn('flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background', $attrs.class)">
    <ActionSwapIcon v-if="theme.mounted.value" :value="theme.isDark.value ? 'dark' : 'light'" animation="blur" :class="iconClassName">
      <Sun v-if="theme.isDark.value" :class="iconClassName" /><Moon v-else :class="iconClassName" />
    </ActionSwapIcon>
    <span v-else :class="iconClassName" aria-hidden="true" />
  </button>
</template>
