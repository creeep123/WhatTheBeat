export interface StyleBreakdown {
  name: string;
  percentage: number;
  description: string;
}

export interface CoreElement {
  name: string;
  description: string;
  icon: string;
}

export interface AnalysisResult {
  styles: StyleBreakdown[];
  bpm: number;
  elements: CoreElement[];
  tags: string[];
  searchKeywords: string;
  summary: string;
}

export interface ApiResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}
