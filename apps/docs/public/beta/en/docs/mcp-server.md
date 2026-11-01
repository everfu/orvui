# MCP Server

Query actual orvui APIs, source, styles and themes through the online MCP server. Public and read-only: connect with the server URL, without a local server or token.

> Product version: 0.2.0-beta.1

<a id="setup"></a>

## Server URL

Copy the URL below and add a remote MCP server in a coding assistant that supports Streamable HTTP. The server only provides public component knowledge; it does not read or modify your project.

```text
https://orvui.efu.me/mcp
```

This is a protocol endpoint for MCP clients; opening it in a browser does not show a documentation page. The public service limits requests to 100 per minute per IP and domain.

<a id="clients"></a>

## Connect your coding assistant

Save the configuration in your project or client settings. Use project-local `.codex/config.toml` for Codex and `.cursor/mcp.json` for Cursor; add Claude Code with the command below. Reconnect MCP and confirm that seven tools are available.

```toml
[mcp_servers.orvui]
url = "https://orvui.efu.me/mcp"
```

```json
{
  "mcpServers": {
    "orvui": {
      "url": "https://orvui.efu.me/mcp"
    }
  }
}
```

```bash
claude mcp add --transport http orvui https://orvui.efu.me/mcp
```

<a id="usage"></a>

## Usage

Discover components first, then read the APIs, theme or guide you need. Use actual catalog slugs; documentation queries support Chinese and English.

```text
list_components({})
get_component_docs({ "slug": "popover", "locale": "zh" })
get_theme_variables({ "palette": "violet", "mode": "dark" })
get_docs({ "path": "/docs/installation", "locale": "en" })
```

<a id="tools"></a>

## Component queries

`list_components`: Discover components and variants.

`get_component_docs`: Read APIs, state bindings and examples for both installation modes.

`get_component_source_code`: Read complete source closures, dependencies and licenses.

`get_component_source_styles`: Read CSS and SFC styles.

`get_theme_variables`: Read eleven palettes and light/dark modes.

`get_docs`: Read guides and component docs by public path.

`get_component_skill`: Read component selection and composition guidance on demand.

Use catalog slugs such as `button` and `popover`. Documentation queries accept `locale: zh | en`, defaulting to Chinese. The `variant` argument to `get_component_docs` uses a catalog example slug. Responses include product version and source.

<a id="versions"></a>

## Versions and availability

The online service updates with documentation deployments. Responses identify the product version; compare it with your app before applying guidance. Queries are stateless and do not retain client sessions. Unknown components, variants and paths return explicit errors. MCP requires a network; complete Skill references can be read offline.

See [Agent Skills](/beta/en/docs/agent-skills) for component workflows and the [Agent guide](/beta/en/docs/ai-agents) for direct resource access.

<a id="local-development"></a>

## Maintenance and offline fallback

Maintainers run `pnpm mcp:build` to generate data and the local package. Netlify builds bundle matching data into the function. For fully offline MCP, the `@orvui/vue-mcp` stdio entrypoint remains available; use the online URL above for normal setup.

```bash
pnpm mcp:build
pnpm mcp:dev
# Optional offline archive
pnpm mcp:pack
```

## Next steps

- [Agent Skills](/beta/en/docs/agent-skills)
- [LLMs.txt](/beta/en/docs/llms-txt)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
