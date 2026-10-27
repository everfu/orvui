<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { AnimatePresence } from "motion-v";
import { Bot, RotateCcw, User } from "lucide-vue-next";
import { MessageBubble, MessageBubbleContent } from "../index";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "../../message";
import { StreamingResponse } from "../../streaming-response";
const step = ref(0),
  run = ref(0);
const replies = [
  "Absolutely. I’ll keep it concise and lead with what changed.",
  "Do you want the tone to feel more technical or more customer-facing?",
];
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  run.value++;
  step.value = 0;
  later(650, () => {
    step.value = 1;
  });
  later(1550, () => {
    step.value = 2;
  });
}
onMounted(replay);
</script>
<template>
  <div class="flex h-[410px] w-full max-w-xl flex-col justify-center px-3">
    <MessageGroup :key="run" spacing="default"
      ><Message from="user"
        ><MessageAvatar class="bg-foreground text-background"
          ><User /></MessageAvatar
        ><MessageContent
          ><MessageHeader
            ><span class="font-medium text-foreground/70">You</span
            ><span>Now</span></MessageHeader
          ><MessageBubble variant="solid"
            ><MessageBubbleContent
              >Can you turn these notes into a launch
              update?</MessageBubbleContent
            ></MessageBubble
          ><MessageFooter>Delivered</MessageFooter></MessageContent
        ></Message
      ><AnimatePresence mode="popLayout"
        ><Message
          v-for="(reply, index) in replies.slice(0, step)"
          :key="index"
          from="assistant"
          ><MessageAvatar :placeholder="index > 0"
            ><Bot v-if="index === 0" /></MessageAvatar
          ><MessageContent
            ><MessageHeader v-if="index === 0"
              ><span class="font-medium text-foreground/70">Assistant</span
              ><span>Just now</span></MessageHeader
            ><MessageBubble variant="soft"
              ><MessageBubbleContent
                ><StreamingResponse status="complete" :show-actions="false">{{
                  reply
                }}</StreamingResponse></MessageBubbleContent
              ></MessageBubble
            ></MessageContent
          ></Message
        ></AnimatePresence
      ></MessageGroup
    >
    <div class="flex h-11 items-end justify-center">
      <button
        type="button"
        @click="replay"
        class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw class="size-3.5" />Replay
      </button>
    </div>
  </div>
</template>
