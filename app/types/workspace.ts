export interface SoVDataPoint {
  date: string;
  deepseek: number;
  doubao: number;
  kimi: number;
  average: number;
}

export interface ContentTask {
  id: string;
  title: string;
  type: 'article' | 'faq' | 'case_study';
  status: 'pending' | 'generating' | 'review' | 'published';
  priority: 'P0' | 'P1' | 'P2';
  reason: string;
  generatedContent?: string;
  createdAt: string;
}

export interface DistributionChannel {
  id: string;
  name: string;
  icon: string;
  weight: 'High' | 'Medium' | 'Low';
  status: 'connected' | 'disconnected';
  audience: string;
}

export interface WorkspaceState {
  sovHistory: SoVDataPoint[];
  contentTasks: ContentTask[];
  channels: DistributionChannel[];
  isLoading: boolean;
}
