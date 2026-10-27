<script setup lang="ts">
defineProps<{ en: boolean }>();
</script>

<template>
  <span class="language-flag" aria-hidden="true">
    <svg v-if="en" viewBox="0 0 60 40" focusable="false">
      <path fill="#012169" d="M0 0h60v40H0z" />
      <path stroke="#fff" stroke-width="8" d="m0 0 60 40M60 0 0 40" />
      <path stroke="#c8102e" stroke-width="3" d="m0 0 60 40M60 0 0 40" />
      <path stroke="#fff" stroke-width="13" d="M30 0v40M0 20h60" />
      <path stroke="#c8102e" stroke-width="8" d="M30 0v40M0 20h60" />
    </svg>
    <svg v-else viewBox="0 0 30 20" focusable="false">
      <path fill="#ee1c25" d="M0 0h30v20H0z" />
      <path
        fill="#ffde00"
        d="m5 2 0.67 2.07h2.18l-1.76 1.28 0.67 2.07L5 6.14 3.24 7.42l0.67-2.07-1.76-1.28h2.18z"
      />
      <g fill="#ffde00">
        <path d="m10 1.4.23.7h.74l-.6.44.23.7-.6-.43-.6.43.23-.7-.6-.44h.74z" />
        <path d="m12 3.4.23.7h.74l-.6.44.23.7-.6-.43-.6.43.23-.7-.6-.44h.74z" />
        <path d="m12 6.4.23.7h.74l-.6.44.23.7-.6-.43-.6.43.23-.7-.6-.44h.74z" />
        <path d="m10 8.4.23.7h.74l-.6.44.23.7-.6-.43-.6.43.23-.7-.6-.44h.74z" />
      </g>
    </svg>
  </span>
</template>

<style scoped>
.language-flag {
  display: inline-flex;
  width: 21px;
  height: 14px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.08);
}
.language-flag > svg {
  width: 100%;
  height: 100%;
}
</style>
