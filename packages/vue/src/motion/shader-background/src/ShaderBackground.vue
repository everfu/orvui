<script setup lang="ts">
import { camelize, computed, onBeforeUnmount, onMounted, ref, useAttrs, watch, type StyleValue } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { cn } from "../../../lib/utils";
import { shaderFactories, type ShaderBackgroundVariant } from "./presets";
import { createShaderSession } from "./shader-session";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{ variant?: ShaderBackgroundVariant; speed?: number; frame?: number; fallback?: string }>(), {
  variant: "mesh-gradient", fallback: "linear-gradient(135deg,#e0eaff,#9f50d3,#f75092)",
});
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null), failed = ref(false), reduce = useReducedMotion();
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) =>
  ["id", "role", "tabindex", "title"].includes(key) || /^(aria-|data-|on[A-Z])/.test(key))));
function dimension(value: unknown) {
  if (typeof value === "number") return `${value}px`;
  if (typeof value !== "string") return undefined;
  return value.trim() && Number.isFinite(Number(value)) ? `${Number(value)}px` : value;
}
const rootStyle = computed(() => [{ width: dimension(attrs.width), height: dimension(attrs.height), background: failed.value ? props.fallback : undefined }, attrs.style as StyleValue]);
const session = createShaderSession(value => { failed.value = value; });
let mounted = false;
function synchronize() {
  if (!mounted || !root.value) return;
  const input = Object.fromEntries(Object.entries(attrs).map(([key, value]) => [camelize(key), value]));
  if (props.speed !== undefined) input.speed = props.speed;
  if (props.frame !== undefined) input.frame = props.frame;
  try {
    const config = shaderFactories[props.variant](input);
    void session.update(root.value, config, {
      speed: reduce.value ? 0 : config.speed,
      minPixelRatio: input.minPixelRatio as number | undefined,
      maxPixelCount: input.maxPixelCount as number | undefined ?? (["dot-grid", "waves"].includes(props.variant) ? 6016 * 3384 : undefined),
      webGlContextAttributes: input.webGlContextAttributes as WebGLContextAttributes | undefined,
      mipmaps: input.mipmaps as string[] | undefined,
    });
  } catch { failed.value = true; }
}
watch(() => [props.variant, props.speed, props.frame, reduce.value, { ...attrs }], synchronize, { deep: true });
onMounted(() => { mounted = true; synchronize(); });
onBeforeUnmount(() => { mounted = false; session.dispose(); });
defineExpose({ get mount() { return session.renderer; }, failed });
</script>
<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="cn('relative h-full w-full overflow-hidden', attrs.class as string)"
    :style="rootStyle"
    :aria-hidden="(attrs['aria-hidden'] as boolean | undefined) ?? true"
  >
    <slot v-if="failed" name="fallback" />
  </div>
</template>
