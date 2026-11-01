---
title: "File Upload"
description: "Manage files, previews, progress and retry actions in a queue or attachment workspace."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/file-upload"
markdown: "https://orvui.efu.me/en/components/blocks/file-upload.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# File Upload

> Manage files, previews, progress and retry actions in a queue or attachment workspace.

<a id="when-to-use"></a>

## When to use it

- Use File Upload when the interface needs this behavior: manage files, previews, progress and retry actions in a queue or attachment workspace.

<a id="install"></a>
## Install

### File Upload — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/file-upload.json
```

### Attachment Upload — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/attachment-upload.json
```

### Upload Queue — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/file-upload.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the local Beta archive; see the Beta installation guide to build it.

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
```

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### File Upload

**Registry source**

```vue
<script setup lang="ts">
import { RotateCcw } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  FileUpload,
  type FileUploadItem,
  type FileUploadVariant,
} from "@/components/orvui/blocks/file-upload";

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
```

**Package**

```vue
<script setup lang="ts">
import { RotateCcw } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { FileUpload, type FileUploadItem, type FileUploadVariant } from "@orvui/vue/blocks/file-upload";

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
```

<a id="attachment-upload"></a>
### Attachment Upload

Manage mixed attachments with previews, progress, retry actions and image inspection.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { AttachmentUpload, type AttachmentUploadItem } from "@/components/orvui/blocks/file-upload";
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
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { AttachmentUpload, type AttachmentUploadItem } from "@orvui/vue/blocks/file-upload";
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
```

<a id="upload-queue"></a>
### Upload Queue

Queue selected or dropped files and manage their upload progress individually.

**Registry source**

```vue
<script setup lang="ts">
import { RotateCcw } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  FileUpload,
  type FileUploadItem,
  type FileUploadVariant,
} from "@/components/orvui/blocks/file-upload";

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
```

**Package**

```vue
<script setup lang="ts">
import { RotateCcw } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { FileUpload, type FileUploadItem, type FileUploadVariant } from "@orvui/vue/blocks/file-upload";

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
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `FileUpload` | `v-model` | `FileUploadItem[]` | `update:modelValue` |
| `AttachmentUpload` | `v-model` | `AttachmentUploadItem[]` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### FileUpload

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `FileUploadItem[]` | — | No | — |
| `value` | `FileUploadItem[]` | — | No | — |
| `defaultValue` | `FileUploadItem[]` | `() => []` | No | — |
| `accept` | `string` | — | No | — |
| `multiple` | `boolean` | `true` | No | — |
| `maxFiles` | `number` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `variant` | `"default" \| "centered"` | `"default"` | No | — |
| `title` | `string` | `"Drop files here"` | No | — |
| `description` | `string` | `"Add files to the upload queue"` | No | — |
| `browseLabel` | `string` | `"Browse"` | No | — |
| `className` | `string` | — | No | — |
| `classNames` | `FileUploadClassNames` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[items: FileUploadItem[]]` | — |
| `valueChange` | `[items: FileUploadItem[]]` | — |
| `filesAdded` | `[items: FileUploadItem[], files: File[]]` | — |
| `remove` | `[item: FileUploadItem]` | — |
| `retry` | `[item: FileUploadItem]` | — |
| `reject` | `[files: File[]]` | — |

### AttachmentUpload

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `AttachmentUploadItem[]` | — | No | — |
| `value` | `AttachmentUploadItem[]` | — | No | — |
| `defaultValue` | `AttachmentUploadItem[]` | `() => []` | No | — |
| `playingId` | `string` | — | No | — |
| `accept` | `string` | — | No | — |
| `multiple` | `boolean` | `true` | No | — |
| `maxFiles` | `number` | `12` | No | — |
| `maxFileSize` | `number` | `500 * 1024 * 1024` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `title` | `string` | `"Drag and drop or browse files"` | No | — |
| `description` | `string` | — | No | — |
| `attachmentsLabel` | `string` | `"Attachments"` | No | — |
| `className` | `string` | — | No | — |
| `classNames` | `AttachmentUploadClassNames` | — | No | — |
| `onRetry` | `(item: AttachmentUploadItem) => void` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[items: AttachmentUploadItem[]]` | — |
| `valueChange` | `[items: AttachmentUploadItem[]]` | — |
| `filesAdded` | `[items: AttachmentUploadItem[], files: File[]]` | — |
| `filesRejected` | `[files: File[], reason: AttachmentRejectReason]` | — |
| `remove` | `[item: AttachmentUploadItem]` | — |
| `retry` | `[item: AttachmentUploadItem]` | — |
| `audioToggle` | `[item: AttachmentUploadItem]` | — |

<a id="about"></a>
## About File Upload

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure File Upload?**

Configure File Upload through modelValue, value, defaultValue, accept, multiple, maxFiles, disabled, variant, title, description, browseLabel, className, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, filesAdded, remove, retry, reject to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Feedback Widget](https://orvui.efu.me/en/components/blocks/feedback-widget): Expand a feedback trigger into a form with sending, success and retry states.
- [OTP Input](https://orvui.efu.me/en/components/blocks/otp-input): Enter or paste a fixed-length code through grouped fields with completion feedback.
- [Availability Scheduler](https://orvui.efu.me/en/components/blocks/availability-scheduler): Edit weekly availability as time ranges and copy a schedule to selected days.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/file-upload.json
- Documentation: https://orvui.efu.me/en/components/blocks/file-upload
- `packages/vue/src/blocks/file-upload/src/FileUpload.vue`
- `packages/vue/src/blocks/file-upload/src/AttachmentUpload.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
