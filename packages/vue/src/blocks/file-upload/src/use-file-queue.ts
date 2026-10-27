import { computed } from "vue";
import { createFileUploadItem, type FileUploadItem } from "./types";
import { acceptsUpload, useFileDrop, useUploadList } from "./queue-state";
type Options = {
  modelValue?: FileUploadItem[];
  value?: FileUploadItem[];
  defaultValue: FileUploadItem[];
  accept?: string;
  multiple: boolean;
  maxFiles?: number;
  disabled: boolean;
};
export function useFileQueue(
  options: Options,
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
  const maxReached = computed(
    () =>
      options.maxFiles !== undefined && items.value.length >= options.maxFiles,
  );
  function add(files: File[]) {
    if (options.disabled || !files.length) return;
    const available =
      options.maxFiles === undefined
        ? files.length
        : options.maxFiles - items.value.length;
    const limit = Math.max(
      0,
      options.multiple ? available : Math.min(1, available),
    );
    const accepted = files
        .filter((file) => acceptsUpload(file, options.accept))
        .slice(0, limit),
      rejected = files.filter((file) => !accepted.includes(file));
    if (rejected.length) emit("reject", rejected);
    const added = accepted.map(createFileUploadItem);
    if (added.length) {
      commit([...items.value, ...added]);
      emit("filesAdded", added, accepted);
    }
  }
  function remove(item: FileUploadItem) {
    commit(items.value.filter((entry) => entry.id !== item.id));
    emit("remove", item);
  }
  function retry(item: FileUploadItem) {
    const next: FileUploadItem = {
      ...item,
      error: undefined,
      progress: 0,
      status: "uploading",
    };
    commit(items.value.map((entry) => (entry.id === item.id ? next : entry)));
    emit("retry", next);
  }
  return {
    items,
    maxReached,
    add,
    remove,
    retry,
    ...useFileDrop(
      () => options.disabled,
      () => maxReached.value,
      add,
    ),
  };
}
