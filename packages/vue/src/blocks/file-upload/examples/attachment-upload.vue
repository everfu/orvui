<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { AttachmentUpload, type AttachmentUploadItem } from "../index";
const items = ref<AttachmentUploadItem[]>([
  {
    id: "brief",
    name: "launch-brief.pdf",
    kind: "file",
    size: 32400000,
    href: "data:application/pdf,orvui%20launch%20brief",
    status: "failed",
    error: "Upload failed",
  },
  {
    id: "flowers",
    name: "orange-flowers.jpg",
    kind: "image",
    size: 9800000,
    previewUrl:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "voice-note",
    name: "launch-note.m4a",
    kind: "audio",
    currentTime: 12,
    duration: 48,
  },
]);
const playing = ref<string>(),
  jobs = new Set<ReturnType<typeof setTimeout>>();
let clock: ReturnType<typeof setInterval> | undefined;
watch(playing, (id) => {
  clearInterval(clock);
  if (id)
    clock = setInterval(() => {
      items.value = items.value.map((item) =>
        item.id === id && item.duration
          ? {
              ...item,
              currentTime: Math.min(item.duration, (item.currentTime ?? 0) + 1),
            }
          : item,
      );
    }, 1000);
});
watch(items, (current) => {
  const active = current.find((item) => item.id === playing.value);
  if (active?.duration && (active.currentTime ?? 0) >= active.duration)
    playing.value = undefined;
});
function retry(item: AttachmentUploadItem) {
  items.value = items.value.map((entry) =>
    entry.id === item.id
      ? { ...entry, status: "uploading", error: undefined }
      : entry,
  );
  for (const [delay, status] of [
    [900, "complete"],
    [1900, "idle"],
  ] as const) {
    const timer = setTimeout(() => {
      jobs.delete(timer);
      items.value = items.value.map((entry) =>
        entry.id === item.id ? { ...entry, status } : entry,
      );
    }, delay);
    jobs.add(timer);
  }
}
onBeforeUnmount(() => {
  clearInterval(clock);
  for (const timer of jobs) clearTimeout(timer);
  jobs.clear();
});
</script>
<template>
  <div class="w-full max-w-2xl px-3 py-6 sm:px-6">
    <AttachmentUpload
      v-model="items"
      @retry="retry"
      :playing-id="playing"
      @audio-toggle="playing = playing === $event.id ? undefined : $event.id"
      attachments-label="Attachments:"
    />
  </div>
</template>
