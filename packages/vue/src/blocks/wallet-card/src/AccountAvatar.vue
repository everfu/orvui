<script setup lang="ts">
import { computed } from "vue";
import { RenderNode } from "../../shared";
import { diceBearGlassUrl } from "./utils";
import type { WalletAccount } from "./WalletCard.vue";
const props = defineProps<{ account?: WalletAccount }>();
const url = computed(() =>
  props.account
    ? diceBearGlassUrl(props.account.id || props.account.address)
    : "",
);
</script>
<template>
  <RenderNode v-if="account?.avatar" :node="account.avatar" /><img
    v-else-if="account"
    :src="url"
    :alt="account.name"
    class="h-7 w-7 shrink-0 rounded-full bg-muted"
  />
</template>
