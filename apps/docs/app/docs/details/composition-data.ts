export const compositions: Record<string,{tree:string;connections:string[]}> = {
  "combobox": {
    "tree": "Combobox\n├── ComboboxTrigger\n│   └── ComboboxInput\n└── ComboboxContent\n    └── ComboboxList\n        ├── ComboboxEmpty\n        ├── ComboboxGroup\n        │   ├── ComboboxLabel\n        │   └── ComboboxItem\n        └── ComboboxSeparator",
    "connections": []
  },
  "animated-sidebar": {
    "tree": "AnimatedSidebarProvider\n├── AnimatedSidebar\n│   ├── AnimatedSidebarHeader\n│   ├── AnimatedSidebarContent\n│   │   └── AnimatedSidebarMenu\n│   ├── AnimatedSidebarFooter\n│   └── AnimatedSidebarRail\n└── AnimatedSidebarInset",
    "connections": [
      "ai-sidebar"
    ]
  },
  "message-bubble": {
    "tree": "Message\n├── MessageAvatar\n└── MessageContent\n    └── MessageBubble\n        └── MessageBubbleContent",
    "connections": [
      "message",
      "streaming-response"
    ]
  },
  "message": {
    "tree": "MessageGroup\n└── Message\n    ├── MessageAvatar\n    └── MessageContent\n        ├── MessageHeader\n        ├── MessageBubble\n        └── MessageFooter",
    "connections": [
      "message-bubble",
      "message-scroller",
      "agent-activity"
    ]
  },
  "message-scroller": {
    "tree": "MessageScroller\n└── MessageGroup\n    └── Message\n        └── MessageContent",
    "connections": [
      "message",
      "prompt-input",
      "streaming-response"
    ]
  },
  "prompt-input": {
    "tree": "Chat\n├── MessageScroller\n│   └── MessageGroup\n└── PromptInput",
    "connections": [
      "message-scroller",
      "tool-approval",
      "approval-card"
    ]
  },
  "todo-list": {
    "tree": "Message\n└── MessageContent\n    └── TodoList",
    "connections": [
      "agent-activity",
      "loading-states",
      "tool-result"
    ]
  },
  "code-block": {
    "tree": "StreamingResponse\n└── CodeBlock",
    "connections": [
      "file-diff",
      "tool-result",
      "streaming-response"
    ]
  },
  "approval-card": {
    "tree": "Message\n└── MessageContent\n    └── ApprovalCard",
    "connections": [
      "tool-approval",
      "message",
      "todo-list"
    ]
  },
  "file-diff": {
    "tree": "ToolResult\n└── ToolResultOutput\n    └── FileDiff",
    "connections": [
      "code-block",
      "tool-result",
      "agent-activity"
    ]
  },
  "tool-result": {
    "tree": "ToolResult\n└── ToolResultOutput",
    "connections": [
      "tool-approval",
      "code-block",
      "agent-activity"
    ]
  },
  "streaming-response": {
    "tree": "Message\n└── MessageContent\n    └── MessageBubble\n        └── StreamingResponse",
    "connections": [
      "message",
      "citations",
      "code-block"
    ]
  },
  "image-generation": {
    "tree": "Message\n└── MessageContent\n    └── ImageGeneration\n        └── GeneratedMedia",
    "connections": [
      "message",
      "streaming-response",
      "prompt-input"
    ]
  },
  "tool-approval": {
    "tree": "Message\n└── MessageContent\n    └── ToolApproval\n        └── ToolApprovalCode",
    "connections": [
      "approval-card",
      "agent-activity",
      "tool-result"
    ]
  },
  "citations": {
    "tree": "StreamingResponse\n├── Citation\n└── Citations\n    ├── CitationStack\n    └── CitationList",
    "connections": [
      "streaming-response",
      "message"
    ]
  },
  "agent-activity": {
    "tree": "Message\n└── MessageContent\n    └── AgentActivity",
    "connections": [
      "loading-states",
      "todo-list",
      "tool-result"
    ]
  },
  "loading-states": {
    "tree": "Message\n└── MessageContent\n    ├── ThinkingShimmer\n    ├── AgentProgress\n    └── ReasoningText",
    "connections": [
      "agent-activity",
      "todo-list",
      "streaming-response"
    ]
  },
  "ai-sidebar": {
    "tree": "AnimatedSidebarProvider\n├── AnimatedSidebar\n│   ├── AnimatedSidebarContent\n│   │   └── AISidebar\n│   │       ├── Folder or project\n│   │       └── File or bookmark\n│   └── AnimatedSidebarRail\n└── AnimatedSidebarInset",
    "connections": [
      "message-scroller",
      "prompt-input"
    ]
  }
};
export const credits: Record<string, { name: string; url: string; avatar?: string }> = {};
export const recommendations: Record<string,string[]> = {
  "motion/timeline": [
    "arc-picker",
    "card",
    "tilt-card"
  ],
  "motion/alert": [
    "aspect-ratio",
    "date-range-picker",
    "card"
  ],
  "motion/collapsible": [
    "expandable-control",
    "tooltip",
    "aspect-ratio"
  ],
  "motion/aspect-ratio": [
    "alert",
    "arc-picker",
    "image-viewer"
  ],
  "motion/arc-picker": [
    "color-picker",
    "range-slider",
    "wheel-picker"
  ],
  "motion/sortable-stack": [
    "date-range-picker",
    "color-selector",
    "image-viewer"
  ],
  "motion/image-viewer": [
    "color-selector",
    "combobox",
    "file-tree"
  ],
  "motion/date-range-picker": [
    "card",
    "sortable-stack",
    "color-picker"
  ],
  "motion/card": [
    "date-range-picker",
    "color-selector",
    "checkbox"
  ],
  "motion/color-picker": [
    "arc-picker",
    "adaptive-stepper",
    "range-slider"
  ],
  "motion/color-selector": [
    "context-menu",
    "sortable-stack",
    "image-viewer"
  ],
  "motion/breadcrumb": [
    "context-menu",
    "image-viewer",
    "date-range-picker"
  ],
  "motion/tilt-card": [
    "marquee",
    "theme-toggle",
    "shader-background"
  ],
  "motion/button": [
    "select",
    "switch",
    "checkbox"
  ],
  "motion/expanding-arrow-button": [
    "action-swap",
    "expandable-control",
    "card"
  ],
  "motion/expandable-control": [
    "popover",
    "theme-toggle",
    "card"
  ],
  "motion/adaptive-stepper": [
    "color-picker",
    "center-morph-modal",
    "select"
  ],
  "motion/marquee": [
    "cylinder-carousel",
    "tilt-card",
    "theme-toggle"
  ],
  "motion/tabs": [
    "shared-layout-bg",
    "dock",
    "scroll-animation"
  ],
  "motion/switch": [
    "checkbox",
    "radio",
    "select"
  ],
  "motion/input": [
    "checkbox",
    "select",
    "radio"
  ],
  "motion/select": [
    "radio",
    "checkbox",
    "input"
  ],
  "motion/combobox": [
    "multi-select",
    "sortable-stack",
    "image-viewer"
  ],
  "motion/multi-select": [
    "combobox",
    "select",
    "tooltip"
  ],
  "motion/checkbox": [
    "radio",
    "input",
    "select"
  ],
  "motion/radio": [
    "checkbox",
    "select",
    "input"
  ],
  "motion/bottom-sheet": [
    "tooltip",
    "popover",
    "morphing-modal"
  ],
  "motion/pull-to-refresh": [
    "wheel-picker",
    "color-selector",
    "animated-sidebar"
  ],
  "motion/shared-layout-bg": [
    "preview-rail",
    "dock",
    "scroll-animation"
  ],
  "motion/bounce-sidebar": [
    "radio",
    "animated-sidebar",
    "preview-rail"
  ],
  "motion/animated-sidebar": [
    "image-viewer",
    "combobox",
    "file-tree"
  ],
  "motion/file-tree": [
    "context-menu",
    "image-viewer",
    "color-selector"
  ],
  "motion/preview-rail": [
    "dock",
    "scroll-animation",
    "shared-layout-bg"
  ],
  "motion/dock": [
    "tabs",
    "shared-layout-bg",
    "preview-rail"
  ],
  "motion/tooltip": [
    "popover",
    "morphing-modal",
    "drawer"
  ],
  "motion/context-menu": [
    "color-selector",
    "file-tree",
    "popover"
  ],
  "motion/popover": [
    "morphing-modal",
    "drawer",
    "tooltip"
  ],
  "motion/morphing-modal": [
    "popover",
    "drawer",
    "tooltip"
  ],
  "motion/center-morph-modal": [
    "popover",
    "select",
    "color-picker"
  ],
  "motion/text-animation": [
    "number",
    "action-swap",
    "loader"
  ],
  "motion/number": [
    "action-swap",
    "text-animation",
    "loader"
  ],
  "motion/animated-badge": [
    "loader",
    "action-swap",
    "animated-toast-stack"
  ],
  "motion/action-swap": [
    "text-animation",
    "number",
    "animated-badge"
  ],
  "motion/animated-toast-stack": [
    "animated-badge",
    "loader",
    "text-animation"
  ],
  "motion/theme-toggle": [
    "shader-background",
    "cylinder-carousel",
    "tilt-card"
  ],
  "motion/bouncy-accordion": [
    "table",
    "sortable-stack",
    "popover"
  ],
  "motion/drawer": [
    "popover",
    "morphing-modal",
    "tooltip"
  ],
  "motion/scroll-animation": [
    "tabs",
    "shared-layout-bg",
    "preview-rail"
  ],
  "motion/range-slider": [
    "wheel-picker",
    "switch",
    "input"
  ],
  "motion/wheel-picker": [
    "range-slider",
    "checkbox",
    "radio"
  ],
  "motion/table": [
    "input",
    "select",
    "checkbox"
  ],
  "motion/shader-background": [
    "cylinder-carousel",
    "tilt-card",
    "marquee"
  ],
  "motion/cylinder-carousel": [
    "marquee",
    "shader-background",
    "tilt-card"
  ],
  "motion/loader": [
    "animated-badge",
    "text-animation",
    "number"
  ],
  "charts/sankey-chart": [
    "treemap",
    "funnel-chart",
    "returns-calendar"
  ],
  "charts/treemap": [
    "sankey-chart",
    "donut-chart",
    "composition-chart"
  ],
  "charts/candlestick-chart": [
    "volume-profile",
    "price-target-fan",
    "order-book"
  ],
  "charts/donut-chart": [
    "composition-chart",
    "treemap",
    "status-bar"
  ],
  "charts/volume-profile": [
    "candlestick-chart",
    "order-book",
    "composition-chart"
  ],
  "charts/status-bar": [
    "composition-chart",
    "bump-chart",
    "funnel-chart"
  ],
  "charts/composition-chart": [
    "status-bar",
    "liquidity-heatmap",
    "bump-chart"
  ],
  "charts/funnel-chart": [
    "bump-chart",
    "liquidity-heatmap",
    "sankey-chart"
  ],
  "charts/liquidity-heatmap": [
    "order-book",
    "bump-chart",
    "composition-chart"
  ],
  "charts/bump-chart": [
    "status-bar",
    "composition-chart",
    "funnel-chart"
  ],
  "charts/order-book": [
    "liquidity-heatmap",
    "candlestick-chart",
    "volume-profile"
  ],
  "charts/heat-calendar": [
    "returns-calendar",
    "price-target-fan",
    "treemap"
  ],
  "charts/returns-calendar": [
    "heat-calendar",
    "price-target-fan",
    "treemap"
  ],
  "charts/price-target-fan": [
    "heat-calendar",
    "returns-calendar",
    "candlestick-chart"
  ],
  "agents/voice-orb": [
    "approval-card",
    "agent-activity",
    "message-bubble"
  ],
  "agents/message-bubble": [
    "message",
    "streaming-response",
    "message-scroller"
  ],
  "agents/message": [
    "message-scroller",
    "chat-app",
    "message-bubble"
  ],
  "agents/message-scroller": [
    "message",
    "chat-app",
    "tool-result"
  ],
  "agents/prompt-input": [
    "chat-app",
    "streaming-response",
    "citations"
  ],
  "agents/todo-list": [
    "code-block",
    "file-diff",
    "tool-result"
  ],
  "agents/code-block": [
    "file-diff",
    "tool-result",
    "streaming-response"
  ],
  "agents/approval-card": [
    "tool-approval",
    "chat-app",
    "tool-result"
  ],
  "agents/file-diff": [
    "code-block",
    "tool-result",
    "message"
  ],
  "agents/tool-result": [
    "file-diff",
    "code-block",
    "todo-list"
  ],
  "agents/streaming-response": [
    "code-block",
    "citations",
    "chat-app"
  ],
  "agents/image-generation": [
    "chat-app",
    "loading-states",
    "code-block"
  ],
  "agents/tool-approval": [
    "approval-card",
    "agent-activity",
    "tool-result"
  ],
  "agents/citations": [
    "message",
    "todo-list",
    "streaming-response"
  ],
  "agents/agent-activity": [
    "tool-result",
    "tool-approval",
    "loading-states"
  ],
  "agents/loading-states": [
    "todo-list",
    "message",
    "prompt-input"
  ],
  "agents/ai-sidebar": [
    "chat-app",
    "citations",
    "message-scroller"
  ],
  "agents/chat-app": [
    "message",
    "prompt-input",
    "code-block"
  ],
  "blocks/infinite-masonry": [
    "notification-stack",
    "expandable-tabs",
    "bloom-menu"
  ],
  "blocks/notification-stack": [
    "expandable-action-bar",
    "project-folder",
    "morphing-search"
  ],
  "blocks/project-folder": [
    "card-folder",
    "expandable-action-bar",
    "notification-stack"
  ],
  "blocks/card-folder": [
    "project-folder",
    "wallet-card",
    "expandable-action-bar"
  ],
  "blocks/knockout-bracket": [
    "otp-input",
    "not-found",
    "dynamic-island"
  ],
  "blocks/availability-scheduler": [
    "otp-input",
    "file-upload",
    "feedback-widget"
  ],
  "blocks/swap": [
    "wallet-card",
    "prediction-market",
    "dynamic-island"
  ],
  "blocks/dynamic-island": [
    "swipeable-list",
    "not-found",
    "expandable-tabs"
  ],
  "blocks/command-palette": [
    "expandable-tabs",
    "expandable-action-bar",
    "overflow-actions"
  ],
  "blocks/morphing-search": [
    "expandable-action-bar",
    "expandable-tabs",
    "morphing-tabs"
  ],
  "blocks/expandable-action-bar": [
    "expandable-tabs",
    "overflow-actions",
    "bloom-menu"
  ],
  "blocks/overflow-actions": [
    "expandable-action-bar",
    "expandable-tabs",
    "bloom-menu"
  ],
  "blocks/expandable-tabs": [
    "expandable-action-bar",
    "bloom-menu",
    "overflow-actions"
  ],
  "blocks/morphing-tabs": [
    "expandable-tabs",
    "morphing-search",
    "expandable-action-bar"
  ],
  "blocks/swipeable-list": [
    "dynamic-island",
    "not-found",
    "signup-form"
  ],
  "blocks/file-upload": [
    "feedback-widget",
    "otp-input",
    "availability-scheduler"
  ],
  "blocks/prediction-market": [
    "wallet-card",
    "swap",
    "feedback-widget"
  ],
  "blocks/wallet-card": [
    "swap",
    "prediction-market",
    "card-folder"
  ],
  "blocks/otp-input": [
    "feedback-widget",
    "availability-scheduler",
    "file-upload"
  ],
  "blocks/signup-form": [
    "swipeable-list",
    "feedback-widget",
    "project-folder"
  ],
  "blocks/bloom-menu": [
    "expandable-tabs",
    "expandable-action-bar",
    "overflow-actions"
  ],
  "blocks/feedback-widget": [
    "otp-input",
    "file-upload",
    "availability-scheduler"
  ],
  "blocks/not-found": [
    "dynamic-island",
    "swipeable-list",
    "knockout-bracket"
  ]
};
