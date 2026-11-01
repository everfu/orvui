<script setup lang="ts">
import { betaArchiveName } from "../../../../../tools/release-channels";
import { useDocsVersion } from "../../composables/docs-version";
const { beta } = useDocsVersion();
import { computed } from "vue";
import SiteInstallCommand from "./SiteInstallCommand.vue";
import CodePanel from "./CodePanel.vue";
import { packageName } from "../../../../../tools/distribution";
const props = withDefaults(
  defineProps<{
    slug: string;
    en: boolean;
    mode?: "registry" | "package";
    installSlugs?: string[];
    extraDependencies?: string[];
    demoDependencies?: string[];
  }>(),
  { mode: "registry" },
);
const packageInstall = computed(() =>
  beta.value ? `pnpm add ./${betaArchiveName}` : `pnpm add ${packageName}`,
);
const packageStyle = `import '${packageName}/style.css';`;
const dependencyCommand = (dependencies: string[] = []) => {
  const packages: string[] = [];
  for (const input of dependencies) {
    const name = input.trim();
    if (name && !packages.includes(name)) packages.push(name);
  }
  return packages.length === 0 ? "" : ["pnpm", "add", ...packages].join(" ");
};
const registryDependencyCommand = computed(() =>
  dependencyCommand(props.extraDependencies),
);
const packageDependencyCommand = computed(() =>
  dependencyCommand(props.demoDependencies),
);
</script>
<template>
  <div v-if="mode === 'package'" class="package-install">
    <p class="install-note">
      {{
        beta
          ? en
            ? "Install the local Beta archive. See the Beta installation guide to build it."
            : "安装本地 Beta 归档，制作方法见 Beta 安装指南。"
          : en
            ? "Install the published component package from npm in your application directory."
            : "在你的应用目录从 npm 安装已发布的组件包。"
      }}
    </p>
    <CodePanel :en="en" :code="packageInstall" label="Terminal" />
    <template v-if="packageDependencyCommand">
      <p class="install-note">
        {{ en ? "This example also needs:" : "此示例还需要：" }}
      </p>
      <CodePanel :en="en" :code="packageDependencyCommand" label="Terminal" />
    </template>
    <p class="install-note">
      {{
        en
          ? "Import the package stylesheet once in your application entry."
          : "在应用入口导入一次组件包样式。"
      }}
    </p>
    <CodePanel
      :en="en"
      :code="packageStyle"
      filename="src/main.ts"
      lang="typescript"
    />
  </div>
  <div v-else>
    <SiteInstallCommand :slug="slug" :slugs="installSlugs" :en="en" />
    <template v-if="registryDependencyCommand">
      <p class="install-note">
        {{ en ? "This example also needs:" : "此示例还需要：" }}
      </p>
      <CodePanel :en="en" :code="registryDependencyCommand" label="Terminal" />
    </template>
    <p class="install-note">
      {{
        en
          ? "On first use, import the installed src/components/orvui/styles.css in your stylesheet entry."
          : "首次使用时，将安装的 src/components/orvui/styles.css 导入项目样式入口。"
      }}
    </p>
  </div>
</template>
