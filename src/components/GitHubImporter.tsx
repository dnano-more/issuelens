"use client";

import { useState } from "react";
import { 
  GitPullRequest, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  X,
  Link2,
  Tag,
  MessageSquare
} from "lucide-react";
import { GitHubIssueImportResponse, GitHubIssueMetadata } from "@/types/issue";

interface GitHubImporterProps {
  onImport: (data: GitHubIssueImportResponse) => void;
  currentMetadata: GitHubIssueMetadata | null;
  onClearMetadata: () => void;
}

const SAMPLE_ISSUES = [
  { label: "facebook/react#24657", url: "https://github.com/facebook/react/issues/24657" },
  { label: "vercel/next.js#58000", url: "https://github.com/vercel/next.js/issues/58000" }
];

export function GitHubImporter({ onImport, currentMetadata, onClearMetadata }: GitHubImporterProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (targetUrl?: string) => {
    const inputUrl = (targetUrl || url).trim();
    if (!inputUrl) {
      setError("Please paste a GitHub issue URL (e.g. https://github.com/facebook/react/issues/24657)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch issue from GitHub.");
      }

      onImport(data);
      setUrl(""); // Clear input on success
    } catch (err: any) {
      setError(err.message || "Failed to connect to GitHub API.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFetch();
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
    handleFetch(sampleUrl);
  };

  return (
    <div className="mb-7 rounded-2xl border border-white/[0.1] bg-[#0c101a]/85 p-5 sm:p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
      {/* Decorative Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-indigo-400">
            {/* GitHub Octocat SVG */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Import Directly from GitHub Issue
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Live REST API
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Fetch issue title, description, and discussion comments directly into the triage buffer
            </p>
          </div>
        </div>

        {/* Quick Sample Links */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Try:
          </span>
          {SAMPLE_ISSUES.map((sample) => (
            <button
              key={sample.label}
              type="button"
              disabled={loading}
              onClick={() => handleSampleClick(sample.url)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] hover:border-indigo-500/40 border border-white/[0.06] text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-50"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* URL Input Form */}
      <div className="flex flex-col sm:flex-row gap-2.5 relative z-10">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Link2 className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste GitHub URL (e.g. https://github.com/facebook/react/issues/24657 or owner/repo#123)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06080e] border border-white/[0.09] text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <button
          type="button"
          onClick={() => handleFetch()}
          disabled={loading || !url.trim()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Fetching Issue...</span>
            </>
          ) : (
            <>
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Import Issue</span>
            </>
          )}
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mt-3.5 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-200 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Imported Metadata Card */}
      {currentMetadata && (
        <div className="mt-4 p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-100 font-mono">
                  {currentMetadata.owner}/{currentMetadata.repo}#{currentMetadata.issueNumber}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                  currentMetadata.state === 'open' 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                }`}>
                  {currentMetadata.state}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  by @{currentMetadata.author}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-slate-500" />
                  {currentMetadata.commentsCount} comments parsed
                </span>
                {currentMetadata.labels.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-500" />
                    <span>{currentMetadata.labels.slice(0, 3).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <a
              href={currentMetadata.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] flex items-center gap-1.5 transition text-[11px] font-mono"
            >
              <span>View on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClearMetadata}
              title="Clear imported issue"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
