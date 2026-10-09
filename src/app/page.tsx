"use client";

import { IssueLensLogo } from "@/components/Logo";


import { useState } from "react";
import { 
  Sparkles, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldAlert, 
  ArrowRight, 
  Cpu, 
  FolderGit2, 
  Zap,
  RotateCcw,
  Code2,
  Activity,
  Layers,
  Wrench,
  Flame,
  FileCode2
} from "lucide-react";
import { ISSUE_PRESETS, IssuePreset } from "@/data/presets";
import { IssueAnalysisResponse } from "@/types/issue";

export default function IssueLensDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [includePatch, setIncludePatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IssueAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedAnalysis, setCopiedAnalysis] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleApplyPreset = (preset: IssuePreset) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please specify both the incident title and technical context/logs.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, includePatch }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete diagnostic analysis.");
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected triage exception occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!result) return;
    const textToCopy = `
# IssueLens Diagnostic Report
Incident: ${title}
Severity: ${result.severity}
Blast Radius: ${result.blastRadius}

## Summary
${result.summary}

## Deterministic Root Cause
${result.rootCause}

## Immediate Mitigation
${result.immediateMitigation}

## Resolution Protocol
${result.resolutionProtocol.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}

## Affected Subsystems
${result.affectedSubsystems.map((a) => `- ${a}`).join("\n")}

${result.codePatch ? `## Recommended Code Patch (${result.codePatch.language})\n\`\`\`${result.codePatch.language}\n${result.codePatch.snippet}\n\`\`\`\nRationale: ${result.codePatch.explanation}` : ""}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopiedAnalysis(true);
    setTimeout(() => setCopiedAnalysis(false), 2000);
  };

  const handleCopyCode = () => {
    if (!result?.codePatch?.snippet) return;
    navigator.clipboard.writeText(result.codePatch.snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setResult(null);
    setError(null);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10";
      case "High":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10";
      case "Medium":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient Visual Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-80 right-[-10%] w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-[-10%] w-[500px] h-[300px] bg-cyan-600/10 rounded-full blur-[130px]" />
      </div>

      {/* Enterprise Header */}
      <header className="border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <IssueLensLogo className="w-9 h-9" />
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                IssueLens
              </span>
              <span className="text-[11px] font-mono tracking-widest text-indigo-400 uppercase font-semibold">
                Intelligence Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/[0.08] text-xs font-mono text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Gemini 3.8 Flash • Online</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 font-medium">
                Hacktoberfest 2026
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Command Title Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Autonomous Root-Cause & Triage Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2.5">
            Full-Spectrum Issue & Exception Intelligence
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Ingest complex stack traces, distributed failures, or GitHub issues. Synthesizes deterministic root causes, mitigation runbooks, and production-ready patch blueprints in seconds.
          </p>
        </div>

        {/* 1-Click Telemetry Incidents (Quick Presets) */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Simulate Live Incidents (1-Click Evaluation)
            </span>
            {(title || description) && (
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Buffer
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ISSUE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className="text-left p-3.5 rounded-xl border border-white/[0.08] bg-[#0c101a]/70 hover:bg-[#111726] hover:border-indigo-500/40 transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-indigo-500/5 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/[0.05] text-indigo-300 border border-white/[0.06]">
                    {p.tag}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${p.severity === 'Critical' ? 'text-rose-400' : p.severity === 'High' ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {p.severity}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                  {p.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Incident Ingestion Terminal */}
        <form onSubmit={handleAnalyze} className="mb-10">
          <div className="rounded-2xl border border-white/[0.1] bg-[#0b0f19]/80 p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Incident Descriptor / Issue Headline
                </label>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017"
                className="w-full px-4 py-3 rounded-xl bg-[#06080e] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                  Stack Trace / Telemetry Logs / Reproduction Context
                </label>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Paste raw stack traces, terminal dumps, or GitHub issue context..."
                className="w-full px-4 py-3 rounded-xl bg-[#06080e] border border-white/[0.08] text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition leading-relaxed"
              />
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includePatch}
                  onChange={(e) => setIncludePatch(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200">
                    Generate Production Patch Blueprint
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Synthesizes production-grade code fix with architectural rationale
                  </p>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-500/20 ring-1 ring-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-white" />
                    <span>Synthesizing Root Cause...</span>
                  </>
                ) : (
                  <>
                    <span>Run Deep Triage Protocol</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="mb-8 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Triage Protocol Aborted</p>
              <p className="text-xs text-rose-200/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* High-End Diagnostic Report Console */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Diagnostics Header */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0c101a]/90 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Incident Severity:
                </span>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${getSeverityBadge(result.severity)}`}>
                  {result.severity} Priority
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-400 font-mono text-[11px]">Radius:</span>
                  <span className="font-medium text-slate-200">{result.blastRadius}</span>
                </div>
              </div>

              <button
                onClick={handleCopyAnalysis}
                className="self-start sm:self-auto text-xs font-mono font-semibold px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] flex items-center gap-2 transition cursor-pointer"
              >
                {copiedAnalysis ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAnalysis ? "Runbook Copied!" : "Export Runbook"}
              </button>
            </div>

            {/* Primary Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Executive Summary */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0f19]/70 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400 mb-3">
                  <Activity className="w-4 h-4" />
                  Executive Diagnostic Summary
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Immediate Runbook Action */}
              <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-[#0b0f19]/80 to-transparent backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-300 mb-3">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Immediate Mitigation Runbook
                </div>
                <p className="text-sm text-slate-100 font-medium leading-relaxed">
                  {result.immediateMitigation}
                </p>
              </div>
            </div>

            {/* Deterministic Root Cause */}
            <div className="p-6 rounded-2xl border border-amber-500/25 bg-amber-500/[0.03] backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
                <AlertTriangle className="w-4 h-4" />
                Deterministic Root Cause Analysis
              </div>
              <p className="text-sm text-amber-100/90 leading-relaxed font-mono text-xs sm:text-sm">
                {result.rootCause}
              </p>
            </div>

            {/* Resolution Protocol (Numbered Runbook) */}
            <div className="p-6 sm:p-7 rounded-2xl border border-white/[0.08] bg-[#0b0f19]/70 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Resolution Protocol & Verification Steps
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {result.resolutionProtocol.length} Checkpoints
                </span>
              </div>
              <div className="space-y-3">
                {result.resolutionProtocol.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#06080e]/80 border border-white/[0.04]">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Affected Subsystems */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0b0f19]/70 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3.5">
                <Layers className="w-4 h-4" />
                Architectural Footprint & Affected Subsystems
              </div>
              <div className="flex flex-wrap gap-2.5">
                {result.affectedSubsystems.map((sub, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#06080e] border border-cyan-500/20 font-mono text-cyan-300 font-medium"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Production Code Patch Blueprint (if generated) */}
            {result.codePatch && (
              <div className="rounded-2xl border border-indigo-500/30 bg-[#06080e] overflow-hidden shadow-2xl">
                <div className="px-5 py-3.5 bg-[#0c101a] border-b border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span>Recommended Patch Blueprint ({result.codePatch.language})</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs font-mono px-3 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? "Snippet Copied" : "Copy Snippet"}
                  </button>
                </div>

                <div className="p-5 font-mono text-xs overflow-x-auto text-indigo-200/90 leading-relaxed bg-[#05070c]">
                  <pre>{result.codePatch.snippet}</pre>
                </div>

                {result.codePatch.explanation && (
                  <div className="p-4 bg-[#090d16] border-t border-white/[0.06] text-xs text-slate-400 flex items-start gap-2.5">
                    <Wrench className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <span className="text-slate-200 font-semibold">Engineering Rationale: </span>
                      {result.codePatch.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-white/[0.06] bg-[#05070c] py-6 mt-16 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono">
            IssueLens Core • Hacktoberfest Hack Day Navi Mumbai
          </p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-indigo-400">Gemini 3.8 Intelligence</span>
            <span>•</span>
            <span className="text-emerald-400">MIT Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}