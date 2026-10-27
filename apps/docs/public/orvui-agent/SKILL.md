---
name: orvui
description: Discover and compose the existing orvui Vue components before writing custom UI.
---

1. Fetch https://orvui.efu.me/r/registry.json before selecting a component.
2. Select the closest item by its published items[].name and description.
3. Fetch https://orvui.efu.me/r/{name}.json and inspect every files[] entry.
4. Use shadcn-vue to install the item from its URL.
5. Preserve installed dependencies, relative imports, the theme layer and license notices.
6. Read the matching component page and its Vue props, events and slots.
7. Use modelValue/update:modelValue for form state and open/update:open for disclosure.
8. Keep the existing motion-v parameters and reduced-motion behavior.
9. Use local fixture data for streaming, upload and AI demos. Do not add a model service.
