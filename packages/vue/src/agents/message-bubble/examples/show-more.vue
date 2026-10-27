<script setup lang="ts">
import { Bot } from "lucide-vue-next";
import {
  MessageBubble,
  MessageBubbleCollapsible,
  MessageBubbleContent,
} from "../index";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "../../message";
import { StreamingResponse } from "../../streaming-response";
const paragraphs = [
  "The release is ready for a focused rollout. The main conversation flow, keyboard navigation, error recovery, and reduced-motion behavior are all covered.",
  "I would keep advanced workflow controls out of this version. They add configuration without improving the first-run experience, and the usage data from this release will give us a better basis for those decisions.",
  "Before publishing, run the accessibility suite once more and verify the streaming behavior with a long response on a smaller viewport.",
];
</script>
<template>
  <div class="flex h-[410px] w-full max-w-xl items-start px-3 pt-14">
    <Message from="assistant"
      ><MessageAvatar><Bot /></MessageAvatar
      ><MessageContent
        ><MessageHeader
          ><span class="font-medium text-foreground/70">Assistant</span
          ><span>Summary</span></MessageHeader
        ><MessageBubble variant="soft" :animate-in="false"
          ><MessageBubbleContent class="max-w-[90%]"
            ><StreamingResponse status="complete" :show-actions="false"
              ><MessageBubbleCollapsible :collapsed-lines="4"
                ><p v-for="paragraph in paragraphs" :key="paragraph">
                  {{ paragraph }}
                </p></MessageBubbleCollapsible
              ></StreamingResponse
            ></MessageBubbleContent
          ></MessageBubble
        ></MessageContent
      ></Message
    >
  </div>
</template>
