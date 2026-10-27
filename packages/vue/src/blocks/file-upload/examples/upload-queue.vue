<script setup lang="ts">
import { RotateCcw } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  FileUpload,
  type FileUploadItem,
  type FileUploadVariant,
} from "../index";

const initial: FileUploadItem[] = [
  {
    id: "brand-assets",
    name: "brand-assets.zip",
    size: 18400000,
    type: "application/zip",
    progress: 100,
    status: "success",
  },
  {
    id: "release-video",
    name: "release-cut.mov",
    size: 84200000,
    type: "video/quicktime",
    progress: 58,
    status: "uploading",
  },
  {
    id: "contracts",
    name: "vendor-contract.pdf",
    size: 2800000,
    type: "application/pdf",
    progress: 32,
    status: "error",
    error: "Connection lost",
  },
];
function useUploadDemo() {
  const items = ref(initial),
    variant = ref<FileUploadVariant>("centered");
  const jobs = new Map<string, ReturnType<typeof setInterval>>();
  function stop(id: string) {
    const job = jobs.get(id);
    if (job !== undefined) clearInterval(job);
    jobs.delete(id);
  }
  function start(id: string) {
    stop(id);
    const advance = () => {
      const at = items.value.findIndex((entry) => entry.id === id);
      if (at < 0 || items.value[at].status !== "uploading") {
        stop(id);
        return;
      }
      const previous = items.value[at];
      let progress = (previous.progress ?? 0) + 7;
      progress = Math.min(100, progress + Math.random() * 12);
      const updated: FileUploadItem = {
        ...previous,
        progress,
        status: progress === 100 ? "success" : "uploading",
      };
      const snapshot = Array.from(items.value);
      snapshot[at] = updated;
      items.value = snapshot;
      if (updated.status === "success") stop(id);
    };
    jobs.set(id, setInterval(advance, 520));
  }
  function reset() {
    for (const id of jobs.keys()) stop(id);
    items.value = initial;
    start("release-video");
  }
  onMounted(() => start("release-video"));
  onBeforeUnmount(() => {
    for (const id of jobs.keys()) stop(id);
  });
  return { items, variant, start, stop, reset };
}

const { items, variant, start, stop, reset } = useUploadDemo();
const choices = [
  { id: "centered", label: "Centered" },
  { id: "default", label: "Row" },
] as const;
</script>
<template>
  <div class="flex min-h-[30rem] w-full items-center justify-center">
    <div
      class="w-full max-w-md rounded-[2rem] border border-border bg-background p-3"
    >
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <p class="text-sm font-semibold text-foreground">Upload package</p>
          <p class="text-xs text-muted-foreground">
            {{ items.filter((item) => item.status === "success").length }} of
            {{ items.length }} files ready
          </p>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="flex rounded-full border border-border bg-muted p-1">
            <button
              v-for="choice in choices"
              :key="choice.id"
              type="button"
              @click="variant = choice.id"
              :data-selected="choice.id === variant"
              class="h-7 rounded-full px-3 text-xs font-medium text-muted-foreground transition-[background-color,color,transform] duration-150 hover:text-foreground active:scale-95 data-[selected=true]:bg-background data-[selected=true]:text-foreground"
            >
              {{ choice.label }}
            </button>
          </div>
          <button
            type="button"
            @click="reset"
            class="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground active:scale-95"
            aria-label="Reset upload queue"
          >
            <RotateCcw class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <FileUpload
        v-model="items"
        :variant="variant"
        @files-added="(added) => added.forEach((item) => start(item.id))"
        @retry="start($event.id)"
        @remove="stop($event.id)"
        :max-files="5"
        :title="
          variant === 'centered' ? 'Drop files to upload' : 'Drop release files'
        "
        description="PDF, images, video or zipped assets"
      />
    </div>
  </div>
</template>
