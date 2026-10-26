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

export interface GitHubIssueMetadata {
  owner: string;
  repo: string;
  issueNumber: number;
  title: string;
  author: string;
  authorAvatar?: string;
  state: string;
  labels: string[];
  commentsCount: number;
  htmlUrl: string;
  createdAt: string;
}

export interface GitHubIssueImportResponse {
  title: string;
  description: string;
  metadata: GitHubIssueMetadata;
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

