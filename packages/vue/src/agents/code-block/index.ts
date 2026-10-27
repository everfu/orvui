export { default as CodeBlock } from "./src/CodeBlock.vue";
export { default as AgentCode } from "./src/AgentCode.vue";
export { default as AgentCodeLine } from "./src/AgentCodeLine.vue";
export * from "./src/tokens";
export type { AgentCodeLanguage } from "./src/AgentCode.vue";

export type * from "./src/api-types";

export type CodeBlockStatus = NonNullable<
  import("./src/api-types").CodeBlockProps["status"]
>;
