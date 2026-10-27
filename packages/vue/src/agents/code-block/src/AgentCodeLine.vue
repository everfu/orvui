<script setup lang="ts">
import type { AgentCodeToken } from "./tokens";
defineProps<{ code: string; tokens?: AgentCodeToken[] }>();
</script>
<template>
  <span
    ><template v-if="tokens"
      ><span
        v-for="(token, index) in tokens"
        :key="`${token.offset}-${index}`"
        class="text-[var(--agent-code-light)] dark:text-[var(--agent-code-dark)]"
        :style="{
          '--agent-code-light': token.light || 'currentColor',
          '--agent-code-dark': token.dark || token.light || 'currentColor',
        }"
        >{{ token.content }}</span
      ></template
    ><template v-else>{{ code }}</template></span
  >
</template>
