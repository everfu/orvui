# @orvui/vue-mcp

Read-only orvui component knowledge. Connect to the public remote MCP at
`https://orvui.efu.me/mcp` using Streamable HTTP. No token or local installation
is required. The online endpoint is a stateless Netlify Function, limited to
100 requests per minute per IP and domain.

The local stdio package remains an offline fallback and requires Node.js 22.18+.

From the repository root:

```sh
pnpm install
pnpm mcp:build
pnpm mcp:dev
```

Configure your MCP client with `node` and the absolute path to
`packages/mcp/dist/cli.js`. After installing a local archive, use the
`orvui-mcp` executable instead. `pnpm mcp:pack` creates the local archive in
`artifacts/packages/<version>/`. No registry publication is required.
Run `pnpm mcp:verify` from the repository root after packing to install that
archive offline in an isolated consumer and verify all tools, network-free
startup and clean disconnection through the installed executable.

The seven tools are `list_components`, `get_component_docs`,
`get_component_source_code`, `get_component_source_styles`, `get_theme_variables`,
`get_docs` and `get_component_skill`. Component queries use canonical catalog
slugs. Documentation accepts `locale: "zh" | "en"` (default `"zh"`);
`get_component_docs` accepts a registered example `variant` slug.
`get_docs` accepts a published site path such as `/docs/installation`.

All results identify their product version and public source. The online server
updates with documentation deployments; `pnpm mcp:verify:remote` verifies the
public endpoint with a real HTTP MCP client. The local snapshot works offline
and from any working directory. Neither transport inspects
or modifies the consuming app, installs components, changes client configuration,
or upgrades dependencies. Rebuild the local fallback or deploy the site after
updating the source. The consuming app must use a matching component version.

The data preserves actual source closures, third-party notices and canonical
theme values. Source style queries include both standalone CSS and SFC style
blocks. Source queries return the complete dependency closure and notices.

The companion `orvui` skill lives in `skills/orvui` in the repository. Run
`pnpm ai:build` to generate its component references and offline download archive.
See the bilingual website guides at `/docs/mcp-server` and `/docs/agent-skills`.
