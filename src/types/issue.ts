export interface IssueAnalysisRequest {
  title: string;
  description: string;
  includePatch?: boolean;
}

export interface CodePatch {
  language: string;
  snippet: string;
  explanation: string;
}

export interface IssueAnalysisResponse {
  summary: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  blastRadius: string;
  rootCause: string;
  resolutionProtocol: string[];
  affectedSubsystems: string[];
  immediateMitigation: string;
  codePatch?: CodePatch;
  isDemo?: boolean;
}
