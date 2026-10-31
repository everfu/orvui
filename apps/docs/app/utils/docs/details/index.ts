import catalog from "../../../../../../tools/catalog/components.json";
import apiData from "../../../../../../tools/registry/component-docs.json";
import type { ComponentDocs } from "../../../../../../tools/registry/component-docs-types";
import { componentCopy } from "./content";
import { compositions, credits, recommendations } from "./composition-data";
import type { AgentGuide, ComponentAbout, ComponentDetailBaseline } from "./types";
export type * from "./types";
export const DETAILS_VERSION = catalog.product.version;
const api = apiData as unknown as ComponentDocs;
const entries = catalog.categories.flatMap(category => category.components.map(entry => ({ category: category.slug, entry })));
const nativeBinding: Record<string, [string,string]> = {
  "aspect-ratio": ['Bind a numeric ratio, for example :ratio="16 / 9", and place media in the default slot.', '绑定数值比例，例如 :ratio="16 / 9"，并在默认插槽放入媒体。'],
  "multi-select": ['Use modelValue as a string array with update:modelValue to own the selected values; otherwise supply defaultValue.', '通过字符串数组 modelValue 与 update:modelValue 管理选中值；非受控用法使用 defaultValue。'],
  "range-slider": ['Use modelValue with update:modelValue for a controlled value. The defaultValue prop initializes an uncontrolled slider.', '通过 modelValue 与 update:modelValue 控制数值；defaultValue 只初始化非受控滑块。'],
  "returns-calendar": ['Use the scoped default slot to customize day content while keeping the day and its return value available.', '通过带作用域的默认插槽定制日期内容，并读取日期与收益数值。'],
  "streaming-response": ['Place changing response content in the default slot and pass streaming to control the pending presentation.', '将变化中的回复内容放在默认插槽，通过 streaming 控制等待状态的呈现。'],
  "breadcrumb": ['Choose a native destination element through the as prop, and supply the corresponding link attributes.', '通过 as 属性选择原生目标元素，并提供对应的链接属性。'],
  "theme-toggle": ['Use the useThemeToggle composable when the trigger needs custom markup; retain the same theme target and transition options.', '需要自定义触发器时使用 useThemeToggle composable，并保留相同的主题目标和过渡选项。'],
};
function about(category: string, slug: string, en: boolean): ComponentAbout {
  const record = entries.find(value => value.category === category && value.entry.slug === slug)!;
  const entry = record.entry;
  const metadata = api.entries[`${category}/${slug}`]?.default;
  const main = metadata?.components.find(component => component.file === metadata.primaryFile) ?? metadata?.components[0];
  const props = main?.props.map(prop => prop.name) ?? [];
  const events = main?.events.map(event => event.name) ?? [];
  const slots = main?.slots.map(slot => slot.name) ?? [];
  const choose = (english: string, chinese: string) => en ? english : chinese;
  const copy = componentCopy[slug];
  const config = props.length ? choose(`Configure ${entry.name} through ${props.join(", ")}. The API table describes their types and defaults.`, `通过 ${props.join("、")} 配置 ${entry.name}；API 表列出其类型与默认值。`) : choose(`${entry.name} composes through its slots and native element attributes.`, `${entry.name} 通过插槽与原生元素属性组合。`);
  const feedback = events.length ? choose(`Observe ${events.join(", ")} to connect the component to application state.`, `监听 ${events.join("、")}，将组件连接到应用状态。`) : choose(`Provide content through ${slots.length ? slots.join(", ") : "the documented composition"}; application effects remain with the consumer.`, `通过${slots.length ? slots.join("、") + " 插槽" : "文档中的组合方式"}提供内容，应用副作用由调用方管理。`);
  return {
    overview: choose(copy.en, copy.zh),
    useWhen: [choose(`Use ${entry.name} when the interface needs this behavior: ${copy.en.charAt(0).toLowerCase() + copy.en.slice(1)}`, `当界面需要以下行为时使用 ${entry.name}：${copy.zh}`)],
    accessibility: choose("Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.", "为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。"),
    faq: [
      { question: choose(`How do I configure ${entry.name}?`, `如何配置 ${entry.name}？`), answer: choose(nativeBinding[slug]?.[0] ?? config, nativeBinding[slug]?.[1] ?? config) },
      { question: choose("How does it connect to application state?", "如何连接到应用状态？"), answer: feedback },
      { question: choose("Can I render it on the server?", "可以在服务端渲染吗？"), answer: choose("Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.", "可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。") },
    ],
  };
}
function guide(category: string, slug: string, en: boolean): AgentGuide | undefined {
  const spec = compositions[slug]; if (!spec) return;
  const record = entries.find(value => value.entry.slug === slug)!;
  const name = record.entry.name;
  const copy = componentCopy[slug];
  const tr = (english: string, chinese: string) => en ? english : chinese;
  const metadata = api.entries[`${category}/${slug}`]?.default;
  const names = metadata?.components.map(component => component.displayName).join(", ") ?? name;
  const note = about(category, slug, en);
  return {
    seo: { title: name, description: tr(copy.en, copy.zh) },
    introduction: tr(copy.en, copy.zh),
    composition: { tree: spec.tree, description: tr(`Compose ${name} with its public parts: ${names}. Import these names from the component barrel.`, `使用公开部件 ${names} 组合 ${name}，并从该组件的公开入口导入。`) },
    lifecycle: [
      { title: tr("Initialize", "初始化"), description: note.faq[0].answer },
      { title: tr("Update", "更新"), description: note.faq[1].answer },
      { title: tr("Dispose", "释放"), description: tr("Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.", "不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。") },
    ],
    principles: [
      { title: tr("Public composition", "公开组合"), description: tr(`Use the documented ${name} parts instead of importing private implementation files.`, `使用文档列出的 ${name} 部件，避免导入私有实现文件。`) },
      { title: tr("Application ownership", "应用所有权"), description: tr("Connect emitted updates to application state and keep network calls or persistence in the application.", "将发出的更新连接到应用状态，网络请求与持久化由应用管理。") },
      { title: tr("Accessible content", "可访问内容"), description: note.accessibility },
    ],
    implementation: { title: tr("Vue integration", "Vue 集成"), description: tr(`The Usage section composes ${names} through Vue props, events and slots. Use the package or registry example matching your installation method.`, `Usage 区域通过 Vue props、事件与插槽组合 ${names}，请选择与安装方式一致的 npm 包或复制源码示例。`) },
    connections: spec.connections.flatMap(connection => {
      const target = entries.find(value => value.entry.slug === connection); if (!target) return [];
      return [{ slug: connection, name: target.entry.name, description: tr(componentCopy[connection].en, componentCopy[connection].zh) }];
    }),
    contract: { owns: tr(`${name} owns its documented presentation and local interactions.`, `${name} 负责文档定义的呈现与局部交互。`), leaves: tr("Application data, authorization, network effects and persistence stay with the caller.", "应用数据、授权、网络副作用与持久化仍由调用方负责。") },
    guidance: { useWhen: note.useWhen[0], avoidWhen: tr("Choose another composition if its documented interaction model does not fit the task.", "如果文档定义的交互模型不适合任务，应选择其他组合。") },
  };
}
export const componentDetails: ComponentDetailBaseline[] = entries.map(({ category, entry }) => ({
  category, slug: entry.slug, name: entry.name, description: componentCopy[entry.slug].en,
  keywords: "keywords" in entry ? entry.keywords ?? [] : [], badge: entry.badge, launchedAt: entry.launchedAt,
  dates: { publishedAt: "2026-10-26", updatedAt: "2026-10-26" },
  about: about(category, entry.slug, true), guide: guide(category, entry.slug, true), credit: credits[entry.slug],
}));
export const componentDetailsBaseline = componentDetails;
export const zhAboutByCategory: Record<string, Record<string, ComponentAbout>> = Object.fromEntries(catalog.categories.map(category => [category.slug, Object.fromEntries(category.components.map(entry => [entry.slug, about(category.slug, entry.slug, false)]))]));
const chineseGuides: Record<string, AgentGuide> = Object.fromEntries(componentDetails.flatMap(record => { const value = guide(record.category, record.slug, false); return value ? [[record.slug, value]] : []; }));
export const zhGuideExtras = Object.fromEntries(Object.entries(chineseGuides).map(([slug, value]) => [slug, { lifecycle: value.lifecycle, principles: value.principles, implementation: value.implementation, contract: value.contract, guidance: value.guidance }]));
export function getComponentDetails(category: string, slug: string) { return componentDetails.find(record => record.category === category && record.slug === slug); }
export function getComponentAbout(category: string, slug: string, en = true) { return en ? getComponentDetails(category, slug)?.about : zhAboutByCategory[category]?.[slug]; }
export function getComponentGuide(category: string, slug: string, en = true) { return getComponentDetails(category, slug) ? en ? getComponentDetails(category, slug)?.guide : chineseGuides[slug] : undefined; }
export function getLocalizedDetails(category: string, slug: string, en = true) {
  const record = getComponentDetails(category, slug);
  return record ? { ...record, description: en ? record.description : componentCopy[slug].zh, about: getComponentAbout(category, slug, en)!, guide: getComponentGuide(category, slug, en) } : undefined;
}
export function relatedComponents(category: string, slug: string, limit = 3) {
  const preferred = recommendations[`${category}/${slug}`] ?? [];
  const fallback = componentDetails.filter(record => record.slug !== slug).sort((a,b) => Number(b.category === category) - Number(a.category === category)).map(record => record.slug);
  return [...new Set([...preferred, ...fallback])].slice(0, Math.max(0,limit)).flatMap(slug => { const record = componentDetails.find(record => record.slug === slug); return record ? [record] : []; });
}
