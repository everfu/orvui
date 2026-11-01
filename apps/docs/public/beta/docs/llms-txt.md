# LLMs.txt

把 orvui 的文档索引交给编码助手，按需读取指南、组件 API 与示例。

> 产品版本: 0.2.0-beta.1

<a id="files"></a>

## 可用资源

[/llms.txt](/llms.txt) 是指南、组件、模板和注册表的轻量索引。链接指向本站实际生成的 Markdown 和资源。

指南和组件页面提供「复制页面」与 Markdown 链接。下面以 Button 为例，中英文文件分别提供对应语言的说明、API 和示例。

```text
https://orvui.efu.me/llms.txt
https://orvui.efu.me/components/motion/button.md
https://orvui.efu.me/en/components/motion/button.md
```

<a id="usage"></a>

## 在助手中使用

将索引 URL 提供给能够读取网页的助手，再说明所需组件。只加载本次任务需要的文档，控制上下文大小。

```text
读取 https://orvui.efu.me/llms.txt，使用 orvui 的 Button 和 Popover 构建设置面板。
先读取相应组件的中文 Markdown，按文档中的 API 和安装方式实现。
```

<a id="next-tools"></a>

## 选择接入方式

直接读取少量文档时使用索引；需要按工具查询源码和主题时连接 [MCP](/beta/docs/mcp-server)；需要组件选用指导和离线参考时安装 [Agent Skills](/beta/docs/agent-skills)。

## 下一步

- [MCP Server](/beta/docs/mcp-server)
- [Agent Skills](/beta/docs/agent-skills)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。
