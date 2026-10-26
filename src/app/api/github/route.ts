import { NextRequest, NextResponse } from "next/server";
import { GitHubIssueImportResponse, GitHubIssueMetadata } from "@/types/issue";


// Helper to parse various GitHub issue URL formats
export function parseGitHubIssueUrl(input: string): { owner: string; repo: string; issueNumber: number } | null {
  const trimmed = input.trim();

  // Pattern 1: https://github.com/owner/repo/issues/123 or https://github.com/owner/repo/pull/123
  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/(?:issues|pull)\/(\d+)/i
  );
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2],
      issueNumber: parseInt(urlMatch[3], 10),
    };
  }

  // Pattern 2: owner/repo#123
  const shorthandMatch = trimmed.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)#(\d+)$/i);
  if (shorthandMatch) {
    return {
      owner: shorthandMatch[1],
      repo: shorthandMatch[2],
      issueNumber: parseInt(shorthandMatch[3], 10),
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid GitHub issue URL (e.g., https://github.com/owner/repo/issues/123)" },
        { status: 400 }
      );
    }

    const parsed = parseGitHubIssueUrl(url);
    if (!parsed) {
      return NextResponse.json(
        {
          error: "Invalid GitHub Issue format. Expected 'https://github.com/owner/repo/issues/123' or 'owner/repo#123'.",
        },
        { status: 400 }
      );
    }

    const { owner, repo, issueNumber } = parsed;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "IssueLens-Triage-Engine/1.0",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch Issue Data
    const issueRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      { headers }
    );

    if (issueRes.status === 404) {
      return NextResponse.json(
        {
          error: `Issue #${issueNumber} not found in repository "${owner}/${repo}". Please verify the URL or ensure the repository is public.`,
        },
        { status: 404 }
      );
    }

    if (issueRes.status === 403 || issueRes.status === 429) {
      const resetTime = issueRes.headers.get("x-ratelimit-reset");
      const resetDate = resetTime ? new Date(parseInt(resetTime, 10) * 1000).toLocaleTimeString() : "shortly";
      return NextResponse.json(
        {
          error: `GitHub API rate limit reached for unauthenticated requests (resets ${resetDate}). Configure GITHUB_TOKEN in .env.local for 5,000 requests/hr or paste manually.`,
        },
        { status: 429 }
      );
    }

    if (!issueRes.ok) {
      return NextResponse.json(
        { error: `GitHub API returned HTTP status ${issueRes.status} (${issueRes.statusText})` },
        { status: issueRes.status }
      );
    }

    const issueData = await issueRes.json();

    let fullDescription = issueData.body || "(No description provided in this issue)";

    // 2. Fetch up to 3 comments if comments exist
    if (issueData.comments && issueData.comments > 0) {
      try {
        const commentsRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=3`,
          { headers }
        );
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          if (Array.isArray(commentsData) && commentsData.length > 0) {
            fullDescription += "\n\n---\n### Top Discussion & Reproduction Context from GitHub Comments:";
            for (const comment of commentsData) {
              const commenter = comment.user?.login || "anonymous";
              fullDescription += `\n\n> **@${commenter} commented:**\n${comment.body}`;
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch issue comments, continuing with issue body:", err);
      }
    }

    const metadata: GitHubIssueMetadata = {
      owner,
      repo,
      issueNumber,
      title: issueData.title,
      author: issueData.user?.login || "unknown",
      authorAvatar: issueData.user?.avatar_url,
      state: issueData.state || "open",
      labels: Array.isArray(issueData.labels)
        ? issueData.labels.map((l: any) => (typeof l === "string" ? l : l.name))
        : [],
      commentsCount: issueData.comments || 0,
      htmlUrl: issueData.html_url || `https://github.com/${owner}/${repo}/issues/${issueNumber}`,
      createdAt: issueData.created_at,
    };

    const responsePayload: GitHubIssueImportResponse = {
      title: issueData.title,
      description: fullDescription,
      metadata,
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("Error importing GitHub issue:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import GitHub issue due to an internal error." },
      { status: 500 }
    );
  }
}
