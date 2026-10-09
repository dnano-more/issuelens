"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Bug, 
  HelpCircle, 
  ArrowRight, 
  Cpu, 
  FolderGit2, 
  Zap,
  RotateCcw
} from "lucide-react";
import { ISSUE_PRESETS, IssuePreset } from "@/data/presets";
import { IssueAnalysisResponse } from "@/types/issue";

export default function HomePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IssueAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleApplyPreset = (preset: IssuePreset) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please fill in both the issue title and description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, beginnerMode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze issue.");
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `
# Issue Analysis: ${title}
Priority: ${result.priority}

## Summary
${result.summary}

${result.beginnerExplanation ? `## Beginner's Guide\n${result.beginnerExplanation}\n` : ""}
## Possible Causes
${result.possibleCauses.map((c) => `- ${c}`).join("\n")}

## Debugging Steps
${result.debuggingSteps.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}

## Areas to Investigate
${result.areasToInvestigate.map((a) => `- ${a}`).join("\n")}

## Immediate Next Action
${result.suggestedNextAction}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setResult(null);
    setError(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "High":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Medium":
        return "bg-sky-500/15 text-sky-400 border-sky-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                IssueLens
              </span>
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Gemini API
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
              Open Source
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              MIT License
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Understand GitHub Issues in Seconds
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Paste any cryptic bug, error stack trace, or GitHub issue. Powered by Google Gemini to give you a step-by-step debugging roadmap and beginner-friendly clarity.
          </p>
        </div>

        {/* 1-Click Presets */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Quick-Test Presets (1-Click Demo)
            </span>
            {(title || description) && (
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" /> Clear Form
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ISSUE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className="text-left p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/40 transition group cursor-pointer"
              >
                <div className="text-[10px] font-medium text-indigo-400 mb-1">
                  {p.category}
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                  {p.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="mb-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Issue Title / Error Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Issue Description / Logs / Stack Trace
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Paste the issue details, error message, or console logs here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Toggle & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={beginnerMode}
                  onChange={(e) => setBeginnerMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200">
                    Explain Like I'm a Beginner
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Translates technical jargon into plain-English analogies
                  </p>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze with Gemini</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Analysis Error</p>
              <p className="text-xs text-rose-200/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Result Dashboard */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400">Severity Assessment:</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityColor(result.priority)}`}>
                  {result.priority} Priority
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="self-start sm:self-auto text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied to Clipboard!" : "Copy Full Analysis"}
              </button>
            </div>

            {/* Beginner Explanation Card (if enabled) */}
            {result.beginnerExplanation && (
              <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold text-sm">
                  <HelpCircle className="w-4 h-4" />
                  Beginner's Plain-English Analogy
                </div>
                <p className="text-sm text-amber-100/90 leading-relaxed">
                  {result.beginnerExplanation}
                </p>
              </div>
            )}

            {/* Grid of Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Summary */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-2.5">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  Issue Summary
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Immediate Next Action */}
              <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5">
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300 mb-2.5">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Suggested Next Action
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {result.suggestedNextAction}
                </p>
              </div>

              {/* Root Causes */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
                  <Bug className="w-4 h-4 text-rose-400" />
                  Likely Root Causes
                </div>
                <ul className="space-y-2">
                  {result.possibleCauses.map((cause, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Investigate */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
                  <FolderGit2 className="w-4 h-4 text-sky-400" />
                  Key Files & Areas to Investigate
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.areasToInvestigate.map((area, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-sky-300"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Debugging Steps */}
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Step-by-Step Debugging Roadmap
              </div>
              <div className="space-y-3">
                {result.debuggingSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-850">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-black/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Built for <span className="text-slate-300 font-medium">Hacktoberfest Hack Day Navi Mumbai</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-indigo-400">Best Use of Gemini API Track</span>
            <span>•</span>
            <span className="text-emerald-400">MIT Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
