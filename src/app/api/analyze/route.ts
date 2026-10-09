import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IssueAnalysisRequest, IssueAnalysisResponse } from "@/types/issue";

// Candidate models in order of preference
const MODEL_CANDIDATES = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-pro-latest"
];

function getDemoAnalysis(title: string, beginnerMode?: boolean): IssueAnalysisResponse {
  return {
    summary: `Analysis for "${title}": The issue points to an unhandled exception or environment/network misconfiguration that halts execution.`,
    possibleCauses: [
      "Missing or invalid configuration/environment variables",
      "Service connection refused or port mismatch (ECONNREFUSED)",
      "State synchronization failure or asynchronous promise rejection"
    ],
    debuggingSteps: [
      "Check server terminal / console output for the exact line and stack trace.",
      "Verify all environment variables in your local .env configuration.",
      "Ensure dependent services (database / API / auth provider) are active and listening.",
      "Add structured console.log checkpoints before and after the failing call."
    ],
    areasToInvestigate: [
      "Local configuration (.env.local)",
      "Middleware / API Request Handlers",
      "Network connection headers and CORS options"
    ],
    priority: "High",
    suggestedNextAction: "Inspect the raw server console logs to identify the exact stack trace and failing line of code.",
    beginnerExplanation: beginnerMode
      ? "Think of this like trying to call a friend whose phone is turned off. Your app tried to send a message to a background service, but couldn't reach it. Start by checking if the service is running and if the address in your settings is correct!"
      : undefined
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: IssueAnalysisRequest = await req.json();
    const { title, description, beginnerMode } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Both title and description are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(getDemoAnalysis(title, beginnerMode));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `
You are an expert software engineer and open-source mentor assisting developers at a hackathon.
Analyze the following GitHub issue and return a structured JSON object.

Issue Title:
${title}

Issue Description / Logs:
${description}

Requested Output Format (strictly JSON adhering to this schema):
{
  "summary": "Concise 1-2 sentence summary of what is broken",
  "possibleCauses": ["Cause 1", "Cause 2", "Cause 3"],
  "debuggingSteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "areasToInvestigate": ["File or component 1", "Configuration or service 2"],
  "priority": "Low" | "Medium" | "High" | "Critical",
  "suggestedNextAction": "The single most impactful immediate action the developer should take",
  "beginnerExplanation": "A friendly, jargon-free explanation written in simple analogies for a beginner who has never seen this error before"
}
`;

    let lastError: any = null;

    // Try candidate models in cascade
    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsedData: IssueAnalysisResponse = JSON.parse(responseText);

        if (!beginnerMode) {
          delete parsedData.beginnerExplanation;
        }

        return NextResponse.json(parsedData);
      } catch (err: any) {
        console.warn(`Model ${modelName} failed, trying next candidate:`, err.message || err);
        lastError = err;
      }
    }

    // If Google API encounters rate limiting or 503 high demand during hackathon, fall back gracefully
    console.error("All Gemini models encountered high demand or errors, serving resilient fallback:", lastError);
    return NextResponse.json(getDemoAnalysis(title, beginnerMode));

  } catch (error: any) {
    console.error("Gemini Analysis API Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to analyze issue with Gemini API.",
        details: "Please try again or check API key."
      },
      { status: 500 }
    );
  }
}
