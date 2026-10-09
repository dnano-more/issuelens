import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IssueAnalysisRequest, IssueAnalysisResponse } from "@/types/issue";

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
      // Fallback demo mode if API key is not yet configured by the user
      return NextResponse.json({
        summary: `[Demo Mode] Analysis for "${title}": The issue indicates a failure or misconfiguration that requires methodical debugging.`,
        possibleCauses: [
          "Missing or invalid configuration/environment variables",
          "Network timeout or database service unreachable",
          "Unhandled exception or unhandled promise rejection in the handler"
        ],
        debuggingSteps: [
          "Check the server console stack trace for the exact file and line number.",
          "Verify the relevant environment variables in your .env file.",
          "Test connectivity to dependent services independently (e.g. database or third-party APIs).",
          "Add targeted logging around the failing function block."
        ],
        areasToInvestigate: [
          "Environment configurations (.env.local)",
          "Authentication/request handler middleware",
          "Database connection pool setup"
        ],
        priority: "High",
        suggestedNextAction: "Inspect the raw server logs to identify the exact stack trace and failing line of code.",
        beginnerExplanation: beginnerMode
          ? "Think of this like trying to call someone whose phone number is missing from your contacts. Your app tried to talk to a service, but the connection details were missing or rejected. Check your setup settings first!"
          : undefined,
        isDemo: true
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash which is fast, lightweight, and supports JSON output
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData: IssueAnalysisResponse = JSON.parse(responseText);

    if (!beginnerMode) {
      delete parsedData.beginnerExplanation;
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Analysis API Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to analyze issue with Gemini API.",
        details: "Please ensure GEMINI_API_KEY is valid or try again."
      },
      { status: 500 }
    );
  }
}
