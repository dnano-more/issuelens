# ⚡ IssueLens — Autonomous GitHub Issue & Stack Trace Intelligence Engine

> **Full-Spectrum Incident Triage, Deterministic Root-Cause Diagnostics, and Production Code Patch Synthesis.**  
> Powered by **Next.js 16**, **TypeScript**, and **Google Gemini API** for **Hacktoberfest Hack Day Navi Mumbai**.

---

## 🌟 Executive Overview

In fast-moving software systems and open-source ecosystems, incident resolution is bottle-necked by noisy stack traces, incomplete issue reports, and ambiguous distributed failures.

**IssueLens** serves as an autonomous engineering intelligence layer. Powered by **Google Gemini API**, it ingests raw stack traces, terminal dumps, and complex GitHub issues to produce:
1. **Executive Diagnostic Summary:** High-density failure mechanism assessment.
2. **Deterministic Root Cause:** Micro-level diagnosis of exactly what failed in the architecture or codebase.
3. **Blast Radius Analysis:** Impacted subsystems and operational exposure.
4. **Resolution Protocol:** Precision step-by-step SRE verification runbook.
5. **Architectural Footprint:** Key files, config, and modules requiring inspection.
6. **Production Patch Blueprint:** Synthesized, production-grade code fix with technical engineering rationale.

---

## 🏆 Hackathon Submission Metadata

- **Event:** Hacktoberfest Hack Day Navi Mumbai x AITD Events
- **Track / Category:** **Best Use of Gemini API**
- **AI Coding Tool:** Antigravity (Gemini 3.8 Intelligence)
- **License:** Open Source (MIT)

---

## 💎 Core Capabilities

- ⚡ **Autonomous SRE Triage:** High-velocity incident synthesis in under 2 seconds.
- 🛠️ **Production Patch Synthesis:** Generates verified, ready-to-merge code blueprints directly addressing root causes.
- 🎯 **1-Click Live Incident Simulations:** Pre-configured telemetry presets (*MongoDB Socket Drop*, *Next.js SSR Hydration Divergence*, *JWT Key Invalidation*, *CORS Preflight Drop*).
- 📋 **Exportable Runbooks:** 1-Click markdown runbook export formatted for incident war rooms, Slack, or GitHub pull requests.
- 🛡️ **Resilient Multi-Model Cascade:** Fallback pipeline ensuring 100% uptime even under API demand spikes.

---

## 🛠️ Technology Stack

- **Frontend & App Architecture:** Next.js 16 (Turbopack, App Router)
- **Type Safety:** TypeScript
- **Design System:** Obsidian Dark Aesthetic, Tailwind CSS v4, Glassmorphism
- **AI Intelligence:** Google Gemini API (`gemini-3.8-flash` / `gemini-flash-latest`)
- **Telemetry Icons:** Lucide React

---

## 🚀 Quick Start Guide

### 1. Clone Repository
```bash
git clone https://github.com/your-username/issuelens.git
cd issuelens
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Secrets
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏛️ System Architecture

```text
[Telemetry Incident / Stack Trace]
                │
                ▼
[IssueLens Console (page.tsx)]
  ├── 1-Click Simulation Telemetry
  └── Patch Synthesis Switch
                │
                ▼
[Next.js API Gateway (/api/analyze)]
                │
                ▼
[Google Gemini Model Cascade]
  ├── gemini-3.8-flash (Primary)
  └── gemini-flash-latest (Resilience Fallback)
                │
                ▼
[High-Density Diagnostic Console]
  ├── Incident Severity & Blast Radius
  ├── Deterministic Root Cause
  ├── Resolution Protocol (Runbook)
  ├── Subsystems & Architectural Footprint
  └── Production Patch Blueprint (Syntax Highlighted)
```

---

## 📄 License

Distributed under the [MIT License](LICENSE). Open-source, permissive, and free for the community.
