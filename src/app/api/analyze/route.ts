import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IssueAnalysisRequest, IssueAnalysisResponse } from "@/types/issue";

const MODEL_CANDIDATES = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-pro-latest"
];

function getDemoAnalysis(title: string): IssueAnalysisResponse {
  return {
    summary: `Runtime execution failure identified in "${title}". The application encountered a blocking exception during upstream service handoff or configuration hydration.`,
    severity: "High",
    blastRadius: "Service-wide disruption; blocking incoming client requests and dependent upstream handshakes.",
    rootCause: "Target service listener unreachable at configured socket/port, or critical environment secret missing during runtime initialization.",
    resolutionProtocol: [
      "Verify target service daemon state and socket availability on the configured port.",
      "Audit active runtime environment variables against required schema specifications.",
      "Check network ingress/egress security policies and connection pool timeouts.",
      "Implement resilient retry backoff with circuit breaker logic to prevent cascade crashes."
    ],
    affectedSubsystems: [
      "Runtime Configuration (.env / process.env)",
      "Database / Client Connection Pool",
      "Core Ingress / Egress Handlers"
    ],
    immediateMitigation: "Inspect raw container/daemon logs and verify socket connectivity before triggering subsequent deployments.",
    codePatch: {
      language: "typescript",
      snippet: `// Recommended Resilient Connection Guard
const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await initializeConnection();
    } catch (err) {
      console.warn(\`[Connection Attempt \${i + 1}/\${retries} Failed]: Retrying in \${delay}ms...\`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Target service unreachable after maximum retry threshold.");
};`,
      explanation: "Wraps socket initialization in exponential retry logic to avoid instantaneous crash loops during service warm-ups."
    },
    isDemo: true
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: IssueAnalysisRequest = await req.json();
    const { title, description, includePatch = true } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Both issue headline and technical description/logs are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(getDemoAnalysis(title));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `
You are a Principal Software Architect and Site Reliability Engineer (SRE).
Conduct a rigorous, professional root-cause triage of this issue/incident.
Do NOT use patronizing or beginner language. Deliver an authoritative, high-density technical analysis.

Issue Title / Incident Headline:
${title}

Stack Trace / Technical Logs / Context:
${description}

Generate a strictly valid JSON response matching this schema:
{
  "summary": "High-density technical summary of the failure mechanism (1-2 sentences)",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "blastRadius": "Concise assessment of impacted subsystems, user flows, and operational exposure",
  "rootCause": "Exact deterministic diagnosis of what failed in the codebase, architecture, or environment",
  "resolutionProtocol": [
    "Precision step 1",
    "Precision step 2",
    "Precision step 3",
    "Precision step 4"
  ],
  "affectedSubsystems": [
    "Subsystem/Module 1",
    "Configuration/File 2",
    "Network/Service 3"
  ],
  "immediateMitigation": "The exact immediate runbook command, config check, or code adjustment to restore service",
  "codePatch": {
    "language": "typescript or relevant language",
    "snippet": "Production-ready clean code fix or patch blueprint resolving this issue",
    "explanation": "Technical rationale for why this patch permanently solves the vulnerability or failure"
  }
}
`;

    let lastError: any = null;

    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.15,
          },
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsedData: IssueAnalysisResponse = JSON.parse(responseText);

        if (!includePatch) {
          delete parsedData.codePatch;
        }

        return NextResponse.json(parsedData);
      } catch (err: any) {
        console.warn(`Model ${modelName} fallback trigger:`, err.message || err);
        lastError = err;
      }
    }

    console.error("All Gemini candidates failed, using fallback:", lastError);
    return NextResponse.json(getDemoAnalysis(title));

  } catch (error: any) {
    console.error("IssueLens Engine Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to execute triage intelligence.",
        details: "Please verify GEMINI_API_KEY or connection."
      },
      { status: 500 }
    );
  }
}
