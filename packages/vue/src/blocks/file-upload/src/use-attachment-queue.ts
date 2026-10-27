import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useUploadList, useFileDrop } from "./queue-state";
import type { AttachmentUploadItem } from "./attachment-types";
type Options = {
  modelValue?: AttachmentUploadItem[];
  value?: AttachmentUploadItem[];
  defaultValue: AttachmentUploadItem[];
  maxFiles: number;
  multiple: boolean;
  maxFileSize: number;
  disabled: boolean;
};
export function useAttachmentQueue(
  options: Options,
  reduced: () => boolean,
  emit: (event: any, ...args: any[]) => void,
) {
  const { items, commit } = useUploadList(
    () => options.modelValue,
    () => options.value,
    options.defaultValue,
    (next) => {
      emit("update:modelValue", next);
      emit("valueChange", next);
    },
  );
  const preview = ref<AttachmentUploadItem | null>(null),
    uploading = ref(new Set<string>()),
    complete = ref(new Set<string>()),
    removing = ref(new Set<string>());
  const owned = new Set<string>(),
    jobs = new Set<ReturnType<typeof setTimeout>>();
  const maxReached = computed(() => items.value.length >= options.maxFiles),
    uploadOrder = computed(() => [...uploading.value]);
  function schedule(callback: () => void, delay: number) {
    const timer = setTimeout(() => {
      jobs.delete(timer);
      callback();
    }, delay);
    jobs.add(timer);
  }
  function release(item: AttachmentUploadItem) {
    for (const url of new Set([item.previewUrl, item.href]))
      if (url && owned.delete(url)) URL.revokeObjectURL(url);
  }
  function add(files: File[]) {
    if (options.disabled || !files.length) return;
    const available = Math.max(0, options.maxFiles - items.value.length);
    if (!available) {
      emit("filesRejected", files, "max-files");
      return;
    }
    const selected = files.slice(
      0,
      options.multiple ? available : Math.min(1, available),
    );
    const oversized = selected.filter(
        (file) => file.size > options.maxFileSize,
      ),
      accepted = selected.filter((file) => file.size <= options.maxFileSize);
    if (oversized.length) emit("filesRejected", oversized, "too-large");
    if (selected.length < files.length)
      emit("filesRejected", files.slice(selected.length), "max-files");
    const added = accepted.map<AttachmentUploadItem>((file, index) => {
      const kind = file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("audio/")
            ? "audio"
            : "file",
        url = URL.createObjectURL(file);
      owned.add(url);
      return {
        id: `${Date.now()}-${index}-${file.name}`,
        name: file.name,
        kind,
        size: file.size,
        previewUrl: kind === "image" ? url : undefined,
        href: url,
        currentTime: kind === "audio" ? 0 : undefined,
        duration: kind === "audio" ? 0 : undefined,
        file,
      };
    });
    if (!added.length) return;
    commit([...items.value, ...added]);
    const ids = added.map((item) => item.id);
    ids.forEach((id) => uploading.value.add(id));
    schedule(
      () => {
        ids.forEach((id) => {
          uploading.value.delete(id);
          complete.value.add(id);
        });
        schedule(() => ids.forEach((id) => complete.value.delete(id)), 1000);
      },
      reduced() ? 140 : 900,
    );
    emit("filesAdded", added, accepted);
  }
  function remove(item: AttachmentUploadItem) {
    if (removing.value.has(item.id)) return;
    removing.value.add(item.id);
    schedule(
      () => {
        release(item);
        if (preview.value?.id === item.id) preview.value = null;
        uploading.value.delete(item.id);
        complete.value.delete(item.id);
        commit(items.value.filter((entry) => entry.id !== item.id));
        emit("remove", item);
        removing.value.delete(item.id);
      },
      reduced() ? 140 : 420,
    );
  }
  watch(items, (next, previous) => {
    const retained = new Set(next.map((item) => item.id));
    if (preview.value && !retained.has(preview.value.id)) preview.value = null;
    for (const item of previous) if (!retained.has(item.id)) release(item);
  });
  onBeforeUnmount(() => {
    for (const url of owned) URL.revokeObjectURL(url);
    owned.clear();
    for (const timer of jobs) clearTimeout(timer);
    jobs.clear();
  });
  return {
    items,
    preview,
    uploading,
    complete,
    removing,
    maxReached,
    uploadOrder,
    add,
    remove,
    ...useFileDrop(
      () => options.disabled,
      () => maxReached.value,
      add,
    ),
  };
}
