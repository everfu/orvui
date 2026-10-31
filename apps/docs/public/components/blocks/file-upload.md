---
title: "File Upload"
description: "在队列或附件工作区管理文件、预览、进度与重试操作。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/file-upload"
markdown: "https://orvui.efu.me/components/blocks/file-upload.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# File Upload

> 在队列或附件工作区管理文件、预览、进度与重试操作。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 File Upload：在队列或附件工作区管理文件、预览、进度与重试操作。

<a id="install"></a>
## 安装

### File Upload — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/file-upload.json
```

### Attachment Upload — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/attachment-upload.json
```

### Upload Queue — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/file-upload.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

npm 发布后使用下方命令；发布前可安装验证后的本地归档。

```bash
pnpm add @orvui/vue
```

```bash
pnpm add ./orvui-vue-0.1.0.tgz
```

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### File Upload

**复制源码**

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

**组件包**

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

管理混合附件，查看预览、进度、重试操作与图片详情。

**复制源码**

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

**组件包**

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

将选择或拖入的文件加入队列，并分别管理上传进度。

**复制源码**

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

**组件包**

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
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `FileUpload` | `v-model` | `FileUploadItem[]` | `update:modelValue` |
| `AttachmentUpload` | `v-model` | `AttachmentUploadItem[]` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### FileUpload

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `FileUploadItem[]` | — | 否 | — |
| `value` | `FileUploadItem[]` | — | 否 | — |
| `defaultValue` | `FileUploadItem[]` | `() => []` | 否 | — |
| `accept` | `string` | — | 否 | — |
| `multiple` | `boolean` | `true` | 否 | — |
| `maxFiles` | `number` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `variant` | `"default" \| "centered"` | `"default"` | 否 | — |
| `title` | `string` | `"Drop files here"` | 否 | — |
| `description` | `string` | `"Add files to the upload queue"` | 否 | — |
| `browseLabel` | `string` | `"Browse"` | 否 | — |
| `className` | `string` | — | 否 | — |
| `classNames` | `FileUploadClassNames` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[items: FileUploadItem[]]` | — |
| `valueChange` | `[items: FileUploadItem[]]` | — |
| `filesAdded` | `[items: FileUploadItem[], files: File[]]` | — |
| `remove` | `[item: FileUploadItem]` | — |
| `retry` | `[item: FileUploadItem]` | — |
| `reject` | `[files: File[]]` | — |

### AttachmentUpload

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `AttachmentUploadItem[]` | — | 否 | — |
| `value` | `AttachmentUploadItem[]` | — | 否 | — |
| `defaultValue` | `AttachmentUploadItem[]` | `() => []` | 否 | — |
| `playingId` | `string` | — | 否 | — |
| `accept` | `string` | — | 否 | — |
| `multiple` | `boolean` | `true` | 否 | — |
| `maxFiles` | `number` | `12` | 否 | — |
| `maxFileSize` | `number` | `500 * 1024 * 1024` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `title` | `string` | `"Drag and drop or browse files"` | 否 | — |
| `description` | `string` | — | 否 | — |
| `attachmentsLabel` | `string` | `"Attachments"` | 否 | — |
| `className` | `string` | — | 否 | — |
| `classNames` | `AttachmentUploadClassNames` | — | 否 | — |
| `onRetry` | `(item: AttachmentUploadItem) => void` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[items: AttachmentUploadItem[]]` | — |
| `valueChange` | `[items: AttachmentUploadItem[]]` | — |
| `filesAdded` | `[items: AttachmentUploadItem[], files: File[]]` | — |
| `filesRejected` | `[files: File[], reason: AttachmentRejectReason]` | — |
| `remove` | `[item: AttachmentUploadItem]` | — |
| `retry` | `[item: AttachmentUploadItem]` | — |
| `audioToggle` | `[item: AttachmentUploadItem]` | — |

<a id="about"></a>
## 关于 File Upload

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 File Upload？**

通过 modelValue、value、defaultValue、accept、multiple、maxFiles、disabled、variant、title、description、browseLabel、className、classNames 配置 File Upload；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、filesAdded、remove、retry、reject，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Feedback Widget](https://orvui.efu.me/components/blocks/feedback-widget): 将反馈触发器展开为表单，包含发送、成功和重试状态。
- [OTP Input](https://orvui.efu.me/components/blocks/otp-input): 通过分组输入框键入或粘贴固定长度验证码，并获取完成反馈。
- [Availability Scheduler](https://orvui.efu.me/components/blocks/availability-scheduler): 使用时间区间编辑每周可用时间，并将安排复制到指定日期。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/file-upload.json
- 文档: https://orvui.efu.me/components/blocks/file-upload
- `packages/vue/src/blocks/file-upload/src/FileUpload.vue`
- `packages/vue/src/blocks/file-upload/src/AttachmentUpload.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
