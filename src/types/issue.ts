export interface IssueAnalysisRequest {
  title: string;
  description: string;
  beginnerMode?: boolean;
}

export interface IssueAnalysisResponse {
  summary: string;
  possibleCauses: string[];
  debuggingSteps: string[];
  areasToInvestigate: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  suggestedNextAction: string;
  beginnerExplanation?: string;
}
