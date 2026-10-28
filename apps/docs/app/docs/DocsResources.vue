<script setup lang="ts">
import { useId } from "vue";
import { motion } from "motion-v";
import { ArrowRight } from "lucide-vue-next";
import {
  useMediaQuery,
  useReducedMotion,
} from "../../../../packages/vue/src/lib/composables";
import { SPRING_PRESS } from "../../../../packages/vue/src/lib/ease";
const props = defineProps<{ en: boolean }>();
const id = useId();
const reduce = useReducedMotion();
const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
const t = (zh: string, en: string) => (props.en ? en : zh);
const path = (value: string) => `${props.en ? "/en" : ""}${value}`;
</script>
<template>
  <div class="docs-resource-stack">
    <section class="docs-start-card" :aria-labelledby="`${id}-start`">
      <div class="docs-start-hero" aria-hidden="true">
        <span>orvui</span><span class="docs-vue-badge">Vue</span>
      </div>
      <div class="docs-start-copy">
        <h2 :id="`${id}-start`">
          {{ t("开始使用 orvui", "Get started with orvui") }}
        </h2>
        <p>
          {{
            t(
              "安装 Vue 组件包，或通过 shadcn-vue 与完整源码开始。",
              "Install the Vue package, or start with shadcn-vue and the complete source.",
            )
          }}
        </p>
      </div>
      <motion.a
        :href="path('/docs/installation')"
        class="docs-install-link site-action site-action--lg site-action--primary"
        :while-press="reduce ? undefined : { scale: 0.97 }"
        :while-hover="reduce || !canHover ? undefined : { scale: 1.02 }"
        :transition="SPRING_PRESS"
      >
        <span class="docs-install-link-inner">
          {{ t("安装指南", "Installation guide")
          }}<ArrowRight :size="14" aria-hidden="true" />
        </span>
      </motion.a>
    </section>
  </div>
</template>
<style scoped>
.docs-resource-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.docs-start-card {
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: var(--background);
}
.docs-start-hero {
  display: flex;
  height: 96px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--accent) 30%, transparent),
    color-mix(in srgb, var(--accent) 10%, transparent),
    var(--card)
  );
}
.docs-start-hero > span:first-child {
  font-size: 30px;
  line-height: 36px;
  font-weight: 600;
  letter-spacing: -0.025em;
}
.docs-vue-badge {
  padding: 2px 8px;
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--background) 60%, transparent);
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.docs-start-copy {
  padding: 12px 8px;
}
.docs-start-copy h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.025em;
}
.docs-start-copy p {
  margin: 8px 0 0;
  color: var(--muted-foreground);
  font-size: 14px;
  line-height: 20px;
}
.docs-install-link {
  display: inline-flex;
  width: 100%;
  min-height: 40px;
  align-items: stretch;
  overflow: hidden;
  padding: 2px;
  border-radius: 9999px;
  background-color: var(--primary);
  background-image: linear-gradient(
    90deg,
    var(--success),
    var(--warning),
    var(--accent),
    var(--violet),
    var(--success),
    var(--warning),
    var(--accent),
    var(--violet),
    var(--success)
  );
  background-size: 200% 100%;
  color: var(--primary-foreground);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  animation: docs-rainbow-border 3s linear infinite;
}
.docs-install-link-inner {
  display: inline-flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: inherit;
  background: var(--primary);
  transition: background-color 150ms;
}
.docs-install-link-inner > svg {
  flex-shrink: 0;
}
@media (hover: hover) and (pointer: fine) {
  .docs-install-link:hover .docs-install-link-inner {
    background: color-mix(in srgb, var(--primary) 90%, transparent);
  }
}
.docs-install-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
@keyframes docs-rainbow-border {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .docs-install-link {
    animation: none;
  }
  .docs-install-link-inner {
    transition: none;
  }
}
</style>
