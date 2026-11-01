<script setup lang="ts">
import { ref } from "vue";
import { ArrowUpRight, Check, Plus } from "lucide-vue-next";
import { Button } from "../../../../../packages/vue/src/motion/button";
import { Switch } from "../../../../../packages/vue/src/motion/switch";
import { RangeSlider } from "../../../../../packages/vue/src/motion/range-slider";
import SiteLogo from "./SiteLogo.vue";
defineProps<{ en: boolean }>();
const enabled = ref(true),
  value = ref(64),
  saved = ref(false);
</script>
<template>
  <div
    class="guide-preview"
    role="group"
    :aria-label="
      en ? 'Interactive orvui component preview' : 'orvui 组件交互预览'
    "
  >
    <div class="guide-preview-brand">
      <div class="guide-preview-motif" aria-hidden="true"><i /><i /><i /></div>
      <SiteLogo class="guide-preview-logo" />
      <p>{{ en ? "Yours to compose." : "组件，随你组合。" }}</p>
      <span>Vue · TypeScript · Motion</span>
    </div>
    <div class="guide-preview-controls">
      <div class="guide-preview-actions">
        <Button size="sm" @click="saved = !saved"
          ><Check v-if="saved" :size="14" aria-hidden="true" /><Plus
            v-else
            :size="14"
            aria-hidden="true"
          />{{
            saved
              ? en
                ? "Added"
                : "已添加"
              : en
                ? "Add component"
                : "添加组件"
          }}</Button
        >
        <Button
          variant="secondary"
          size="icon"
          :aria-label="en ? 'Reset preview' : '重置预览'"
          @click="
            saved = false;
            enabled = true;
            value = 64;
          "
          ><ArrowUpRight aria-hidden="true" :size="16"
        /></Button>
      </div>
      <div class="guide-preview-setting">
        <div>
          <strong>{{ en ? "Notifications" : "消息通知" }}</strong
          ><span>{{
            enabled
              ? en
                ? "Stay in the loop"
                : "不错过重要更新"
              : en
                ? "Quiet for now"
                : "暂时保持安静"
          }}</span>
        </div>
        <Switch
          v-model="enabled"
          :aria-label="en ? 'Preview notifications' : '预览消息通知'"
        />
      </div>
      <div class="guide-preview-slider">
        <div>
          <span>{{ en ? "Volume" : "音量" }}</span
          ><output>{{ value }}%</output>
        </div>
        <RangeSlider
          v-model="value"
          :step="1"
          :aria-label="en ? 'Preview volume' : '预览音量'"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.guide-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  min-height: 332px;
  margin-top: 24px;
  padding: 32px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--muted);
}
.guide-preview-brand {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 0;
}
.guide-preview-logo {
  --orvui-logo-height: 34px;
  margin-top: 105px;
}
.guide-preview-brand p {
  margin: 16px 0 8px;
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.035em;
}
.guide-preview-brand > span:last-child {
  color: var(--muted-foreground);
  font-size: 12px;
  line-height: 20px;
}
.guide-preview-motif {
  position: absolute;
  top: -108px;
  left: -100px;
  width: 290px;
  height: 240px;
  transform: rotate(-28deg);
  pointer-events: none;
}
.guide-preview-motif i {
  position: absolute;
  inset: 0;
  border: 1px dashed var(--border-strong);
  border-radius: 24px;
}
.guide-preview-motif i:nth-child(2) {
  inset: 28px;
}
.guide-preview-motif i:nth-child(3) {
  inset: 56px;
}
.guide-preview-controls {
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  max-width: 320px;
  width: 100%;
}
.guide-preview-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.guide-preview-setting,
.guide-preview-slider {
  padding: 18px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--background);
}
.guide-preview-setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.guide-preview-setting > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.guide-preview-setting strong {
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
}
.guide-preview-setting span,
.guide-preview-slider > div {
  font-size: 12px;
  line-height: 18px;
  color: var(--muted-foreground);
}
.guide-preview-slider > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.guide-preview-slider output {
  color: var(--foreground);
  font-variant-numeric: tabular-nums;
}
@media (max-width: 600px) {
  .guide-preview {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }
  .guide-preview-brand {
    min-height: 110px;
  }
  .guide-preview-logo {
    --orvui-logo-height: 28px;
    margin-top: 24px;
  }
  .guide-preview-brand p {
    margin-top: 12px;
  }
  .guide-preview-controls {
    max-width: none;
  }
  .guide-preview-motif {
    top: -190px;
    left: 75px;
  }
}
</style>
