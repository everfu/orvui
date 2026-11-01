import { computed, inject, type InjectionKey, type Ref } from "vue";
import {
  versionHref,
  type ReleaseChannel,
} from "../../../../tools/release-channels";
export const docsVersionKey: InjectionKey<Ref<ReleaseChannel>> =
  Symbol("docs-version");
export function useDocsVersion() {
  const channel = inject(
    docsVersionKey,
    computed<ReleaseChannel>(() => "stable"),
  );
  const beta = computed(() => channel.value === "beta");
  const href = (value: string) => versionHref(value, channel.value);
  const prefix = computed(() => (beta.value ? "/beta" : ""));
  return { channel, beta, href, prefix };
}
