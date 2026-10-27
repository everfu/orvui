<script setup lang="ts">
import { ref } from "vue";
import { motion } from "motion-v";
import {
  Accessibility,
  Bell,
  CircleGauge,
  MousePointer2,
  PanelTopOpen,
  RefreshCw,
  Rows3,
  Sparkles,
  Zap,
} from "lucide-vue-next";
import { useReducedMotion } from "../../../../packages/vue/src/lib/composables";
import {
  EASE_IN_OUT,
  EASE_OUT,
  SPRING_PRESS,
} from "../../../../packages/vue/src/lib/ease";
import { localize, bi } from "./site-page-data";
import {
  motionDecisions,
  motionRecipes,
  motionTimings,
  reducedMotionCode,
} from "./site-motion-data";
import SiteMotionDemo from "./SiteMotionDemo.vue";
const props = withDefaults(defineProps<{ en?: boolean }>(), { en: false });
const t = (zh: string, en: string) => (props.en ? en : zh);
const replay = ref(0),
  reduce = useReducedMotion();
const icons = { MousePointer2, Bell, Sparkles, PanelTopOpen, Rows3 };
</script>
<template>
  <div class="motion-guide mt-12 space-y-20">
    <section id="decision-framework" class="scroll-mt-24">
      <p class="guide-eyebrow">{{ t("判断框架", "Decision framework") }}</p>
      <h2 class="guide-title">
        {{ t("动起来之前的四个问题", "Four questions before motion") }}
      </h2>
      <p class="guide-description">
        {{
          t(
            "最好的动效决定，往往发生在设置时长或弹簧参数之前。",
            "The best animation decision is often made before touching a duration or spring value.",
          )
        }}
      </p>
      <div class="mt-6 divide-y divide-border border-y border-border">
        <article
          v-for="decision in motionDecisions"
          :key="decision.number"
          class="grid gap-3 py-5 sm:grid-cols-[3rem_10rem_minmax(0,1fr)] sm:gap-5 sm:py-6"
        >
          <span class="font-mono text-xs text-muted-foreground tabular-nums">{{
            decision.number
          }}</span>
          <h3 class="text-sm font-medium text-foreground">
            {{ localize(decision.title, en) }}
          </h3>
          <div>
            <p class="text-sm leading-6 text-muted-foreground">
              {{ localize(decision.body, en) }}
            </p>
            <p class="mt-2 text-xs leading-5 text-muted-foreground">
              {{ localize(decision.note, en) }}
            </p>
          </div>
        </article>
      </div>
    </section>
    <section id="motion-tokens" class="scroll-mt-24">
      <p class="guide-eyebrow">{{ t("动效令牌", "Motion tokens") }}</p>
      <h2 class="guide-title">
        {{ t("处处使用同一种语言", "Use one language everywhere") }}
      </h2>
      <p class="guide-description">
        {{
          t(
            "orvui 将有意图的动效保存在共享令牌中。按用途选择，让组件彼此协调，而非以完全相同的方式移动。",
            "orvui keeps deliberate motion in shared tokens. Choose by purpose so components feel related without moving identically.",
          )
        }}
      </p>
      <div class="mt-6 overflow-hidden rounded-2xl border border-border">
        <div
          class="flex items-start justify-between gap-4 border-b border-border bg-card px-5 py-4"
        >
          <div>
            <p class="text-sm font-medium text-foreground">
              {{ t("对比曲线", "Compare the curves") }}
            </p>
            <p class="mt-1 text-xs leading-5 text-muted-foreground">
              {{
                t(
                  "相同距离、相同时长，不同用途。",
                  "Same distance and duration. Different jobs.",
                )
              }}
            </p>
          </div>
          <motion.button
            type="button"
            @click="replay++"
            :while-press="reduce ? undefined : { scale: 0.97 }"
            :transition="SPRING_PRESS"
            class="site-action site-action--lg"
            ><RefreshCw class="size-3" aria-hidden="true" />{{
              t("重播", "Replay")
            }}</motion.button
          >
        </div>
        <div class="grid gap-px bg-border md:grid-cols-2">
          <div
            v-for="track in [
              {
                label: 'EASE_OUT',
                value: '[0.16, 1, 0.3, 1]',
                ease: EASE_OUT,
                description: bi(
                  '进入和退出立即响应，再平稳结束。',
                  'Entrances and exits respond immediately, then settle quietly.',
                ),
              },
              {
                label: 'EASE_IN_OUT',
                value: '[0.77, 0, 0.175, 1]',
                ease: EASE_IN_OUT,
                description: bi(
                  '屏幕上已有的对象自然地加速与减速。',
                  'Objects already on screen accelerate and decelerate naturally.',
                ),
              },
            ]"
            :key="track.label"
            class="bg-background p-5"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="font-mono text-xs font-medium text-foreground">{{
                track.label
              }}</span
              ><span class="font-mono text-[10px] text-muted-foreground">{{
                track.value
              }}</span>
            </div>
            <div class="mt-8 h-2 w-48 max-w-full rounded-full bg-card p-0.5">
              <motion.div
                :key="track.label + replay"
                :initial="{ opacity: 0.5, transform: 'translateX(0px)' }"
                :animate="{
                  opacity: 1,
                  transform: reduce ? 'translateX(0px)' : 'translateX(176px)',
                }"
                :transition="{
                  duration: reduce ? 0.18 : 0.9,
                  ease: track.ease,
                }"
                class="size-1 rounded-full bg-foreground"
              />
            </div>
            <p class="mt-6 text-sm leading-6 text-muted-foreground">
              {{ localize(track.description, en) }}
            </p>
          </div>
        </div>
        <div
          class="grid gap-px border-t border-border bg-border sm:grid-cols-2"
        >
          <div
            v-for="token in [
              {
                icon: MousePointer2,
                title: 'SPRING_PRESS',
                body: bi(
                  '为按钮和其他可按压表面提供快速、有分量的反馈。',
                  'Fast, weighted feedback for buttons and other pressable surfaces.',
                ),
              },
              {
                icon: CircleGauge,
                title: 'SPRING_LAYOUT',
                body: bi(
                  '用于需要持续空间运动的共享表面与指示器。',
                  'Shared surfaces and indicators that need continuous spatial movement.',
                ),
              },
            ]"
            :key="token.title"
            class="flex gap-3 bg-card p-5"
          >
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background"
              ><component
                :is="token.icon"
                class="size-3.5 text-foreground"
                aria-hidden="true"
            /></span>
            <div>
              <p class="font-mono text-xs text-foreground">{{ token.title }}</p>
              <p class="mt-1 text-xs leading-5 text-muted-foreground">
                {{ localize(token.body, en) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="timing" class="scroll-mt-24">
      <p class="guide-eyebrow">{{ t("时长", "Timing") }}</p>
      <h2 class="guide-title">
        {{ t("快到足以感觉即时", "Fast enough to feel immediate") }}
      </h2>
      <p class="guide-description">
        {{
          t(
            "时长取决于大小、距离和频率。这些范围是起点，不是必须机械达到的指标。",
            "Duration depends on size, distance, and frequency. These ranges are starting points, not targets to hit mechanically.",
          )
        }}
      </p>
      <div class="mt-6 border-y border-border">
        <div
          class="hidden grid-cols-[1fr_8rem_1.4fr] gap-4 border-b border-border bg-card px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:grid"
        >
          <span>{{ t("交互", "Interaction") }}</span
          ><span>{{ t("范围", "Range") }}</span
          ><span>{{ t("期望感受", "Desired feel") }}</span>
        </div>
        <div
          v-for="timing in motionTimings"
          :key="timing.use.en"
          class="grid gap-1 border-b border-border px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_8rem_1.4fr] sm:items-center sm:gap-4"
        >
          <span class="text-sm font-medium text-foreground">{{
            localize(timing.use, en)
          }}</span
          ><span class="font-mono text-xs text-foreground">{{
            localize(timing.range, en)
          }}</span
          ><span class="text-sm text-muted-foreground">{{
            localize(timing.feel, en)
          }}</span>
        </div>
      </div>
      <div class="mt-5 flex gap-3 border-l border-border py-1 pl-4">
        <Zap
          class="mt-0.5 size-4 shrink-0 text-foreground"
          aria-hidden="true"
        />
        <p class="text-sm leading-6 text-muted-foreground">
          {{
            t(
              "界面动效默认控制在 300ms 以内。更长的动效适合解释性演示、有意图的手势和大范围空间变化。",
              "Under 300ms is the default for interface motion. Longer motion belongs to explanatory demos, deliberate gestures, and large spatial changes.",
            )
          }}
        </p>
      </div>
    </section>
    <section id="recipes" class="scroll-mt-24">
      <p class="guide-eyebrow">{{ t("配方", "Recipes") }}</p>
      <h2 class="guide-title">
        {{ t("可以复制的模式", "Patterns you can copy") }}
      </h2>
      <p class="guide-description">
        {{
          t(
            "每个配方都把目的与可用于生产的令牌、减少动态效果状态和具体失败模式联系起来。",
            "Each recipe connects a purpose to a production token, a reduced-motion state, and a concrete failure mode.",
          )
        }}
      </p>
      <div class="mt-6 divide-y divide-border border-y border-border">
        <article
          v-for="recipe in motionRecipes"
          :key="recipe.demo"
          class="py-8"
        >
          <div
            class="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(18rem,1.2fr)] lg:items-stretch lg:gap-8"
          >
            <div class="flex flex-col">
              <div class="flex items-center gap-3">
                <span
                  class="flex size-8 items-center justify-center rounded-lg border border-border bg-card"
                  ><component
                    :is="icons[recipe.icon as keyof typeof icons]"
                    class="size-3.5 text-foreground"
                    aria-hidden="true" /></span
                ><span
                  class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >{{ localize(recipe.eyebrow, en) }}</span
                >
              </div>
              <h3 class="mt-5 text-lg font-medium text-foreground">
                {{ localize(recipe.title, en) }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                {{ localize(recipe.description, en) }}
              </p>
              <div class="mt-6 grid gap-3 text-xs leading-5">
                <div
                  v-for="rule in [
                    { label: t('目的', 'Purpose'), value: recipe.purpose },
                    { label: t('避免', 'Avoid'), value: recipe.avoid },
                  ]"
                  :key="rule.label"
                  class="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3"
                >
                  <span class="font-mono uppercase text-muted-foreground">{{
                    rule.label
                  }}</span
                  ><span class="text-muted-foreground">{{
                    localize(rule.value, en)
                  }}</span>
                </div>
              </div>
            </div>
            <div
              class="flex min-h-48 items-center justify-center rounded-2xl border border-border bg-card/60 p-6"
            >
              <SiteMotionDemo :demo="recipe.demo" :en="en" />
            </div>
          </div>
          <details class="recipe-code mt-6 border-t border-border">
            <summary
              class="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 text-xs font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {{ t("查看配方", "View recipe")
              }}<span
                class="font-mono text-muted-foreground transition-transform"
                >+</span
              >
            </summary>
            <pre
              class="overflow-x-auto border-t border-border bg-card p-5 font-mono text-xs leading-6 text-foreground"
            ><code>{{ recipe.code }}</code></pre>
          </details>
        </article>
      </div>
    </section>
    <section id="accessibility" class="scroll-mt-24">
      <p class="guide-eyebrow">{{ t("可访问性", "Accessibility") }}</p>
      <h2 class="guide-title">
        {{
          t("减少动态效果是一种设计状态", "Reduced motion is a designed state")
        }}
      </h2>
      <p class="guide-description">
        {{
          t(
            "不要移除全部过渡。保留帮助理解的反馈，移除可能引起不适的运动。",
            "Do not remove every transition. Keep feedback that helps comprehension and remove movement that can cause discomfort.",
          )
        }}
      </p>
      <div class="mt-6 grid border-y border-border lg:grid-cols-[0.9fr_1.1fr]">
        <div
          class="border-b border-border py-6 lg:border-r lg:border-b-0 lg:pr-8"
        >
          <Accessibility class="size-5 text-foreground" aria-hidden="true" />
          <h3 class="mt-8 text-base font-medium text-foreground">
            {{ t("保留含义，移除位移。", "Keep meaning. Remove travel.") }}
          </h3>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">
            {{
              t(
                "保留透明度、颜色和即时状态变化。去掉视差、大幅变换、反复缩放和弹簧过冲。",
                "Preserve opacity, color, and instant state changes. Drop parallax, large transforms, repeated scale, and spring overshoot.",
              )
            }}
          </p>
        </div>
        <pre
          class="overflow-x-auto bg-card/60 p-5 font-mono text-xs leading-6 text-foreground sm:p-6"
        ><code>{{ reducedMotionCode }}</code></pre>
      </div>
    </section>
  </div>
</template>
<style scoped>
.guide-eyebrow {
  font-family: var(--font-geist-mono), monospace;
  font-size: 11px;
  line-height: 1.5;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted-foreground);
}
.guide-title {
  margin-top: 0.5rem;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.75rem;
  letter-spacing: -0.025em;
  color: var(--foreground);
}
.guide-description {
  margin-top: 0.5rem;
  max-width: 42rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: var(--muted-foreground);
}
.recipe-code summary::-webkit-details-marker {
  display: none;
}
.recipe-code[open] summary span {
  transform: rotate(45deg);
}
</style>
