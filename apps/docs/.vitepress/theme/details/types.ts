export interface GuideConnection {
  slug: string;
  name: string;
  description: string;
}
export interface GuideSection {
  title: string;
  description: string;
}
export interface AgentGuide {
  seo: { title: string; description: string };
  introduction: string;
  composition: { description: string; tree: string };
  lifecycle: [GuideSection, GuideSection, GuideSection];
  principles: [GuideSection, GuideSection, GuideSection];
  implementation: GuideSection;
  connections: GuideConnection[];
  contract: { owns: string; leaves: string };
  guidance: { useWhen: string; avoidWhen: string };
}
export interface ComponentFaq {
  question: string;
  answer: string;
}
export interface ComponentAbout {
  overview: string;
  useWhen: string[];
  accessibility: string;
  faq: ComponentFaq[];
}
export interface ComponentDetailBaseline {
  category: string;
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  badge?: string;
  launchedAt?: string;
  guide?: AgentGuide;
  about: ComponentAbout;
  credit?: { name: string; url: string; avatar?: string };
  dates: { publishedAt: string; updatedAt: string };
}
export interface GuideTranslation {
  introduction: string;
  description: string;
  connections: Record<string, string>;
}
