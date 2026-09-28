export interface NexusAIComponent {
  id: string;
  name: string;
  nameFa: string;
  category: 'hero' | 'pricing' | 'ecommerce' | 'cta' | 'features' | 'testimonials' | 'snippets' | 'headers-footers' | 'neural-ai';
  categoryLabelFa: string;
  description: string;
  version: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'enterprise';
  tags: string[];
  elementorJson: {
    version: string;
    type: 'section' | 'container' | 'widget';
    elements: any[];
    settings?: Record<string, any>;
  };
  customCss: string;
  customJs: string;
  phpSnippet?: string;
  shortcode: string;
  previewThumbnail?: string;
  previewColorGradient: string;
  author: string;
  isAiGenerated: boolean;
  aiOptimizationScore: number;
  aiPromptUsed?: string;
  crossProjectSyncToken: string;
  sharedAcrossProjectsCount: number;
  compatibility: {
    elementorVersion: string;
    phpVersion: string;
    wpVersion: string;
    kamvaCore: string;
  };
  liveDemoHtml?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatternFilterOptions {
  searchQuery: string;
  category: string;
  complexity: string;
  tag: string;
  aiOnly: boolean;
}
