<div align="center">

# IssueLens

### Autonomous GitHub Issue & Stack Trace Intelligence Engine

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-3.8_Flash-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Full-Spectrum Incident Triage • Deterministic Root-Cause Diagnostics • Production Code Patch Synthesis</b><br />
  Built for <b>Hacktoberfest Hack Day Navi Mumbai</b> | <i>Best Use of Gemini API Track</i>
</p>

---

</div>

## Overview

In fast-paced software development and open-source contribution, debugging is frequently bottle-necked by noisy stack traces, cryptic error payloads, and unstructured GitHub issues.

**IssueLens** serves as an autonomous engineering intelligence layer. Powered by **Google Gemini API**, it transforms raw error logs and complex GitHub issues into high-density actionable engineering diagnostics in under 2 seconds:

- **Executive Diagnostic Summary:** High-density breakdown of the failure mechanism.
- **Deterministic Root Cause:** Micro-level diagnosis of what broke in the architecture or codebase.
- **Severity & Blast Radius:** Objective operational risk classification (Critical, High, Medium, Low).
- **Resolution Protocol:** Step-by-step SRE verification checklist and runbook.
- **Architectural Footprint:** Subsystems, configuration keys, and target source files to audit.
- **Production Patch Blueprint:** Synthesized, ready-to-merge code fix with technical engineering rationale.

---

## Hackathon Submission

| Field | Detail |
|---|---|
| **Project Name** | IssueLens |
| **Event** | Hacktoberfest Hack Day Navi Mumbai x AITD Events |
| **Prize Category** | **Best Use of Gemini API** |
| **AI Coding Tool** | Antigravity (Gemini 3.8 Intelligence) |
| **Technologies** | Next.js 16, TypeScript, Google Gemini API, Tailwind CSS v4, Lucide Icons |
| **License** | Open Source (MIT License) |

---

## Core Capabilities

- **Direct GitHub Issue Ingestion:** Paste any public GitHub issue URL (`https://github.com/owner/repo/issues/123` or `owner/repo#123`) to fetch title, reproduction logs, and top discussion comments via GitHub REST API.
- **High-Velocity SRE Triage:** Deep-parses distributed stack traces and unhandled exceptions in real time.
- **Code Patch Synthesis:** Automatically drafts targeted code patches directly in the output terminal.
- **1-Click Live Incident Simulations:** Pre-loaded telemetry presets (*MongoDB Socket Drop*, *Next.js SSR Hydration Divergence*, *JWT Key Expiration*, *CORS Preflight Drop*) for instant judge evaluation.
- **Exportable Runbooks:** 1-Click markdown export formatted for incident war rooms, GitHub PR comments, or Slack alerts.
- **Resilient Multi-Model Cascade:** Robust fallback pipeline (`gemini-3.8-flash` -> `gemini-flash-latest` -> `gemini-2.5-flash-lite`) ensuring 100% uptime even under API traffic spikes.

---

## System Architecture

```text
[GitHub Issue URL / Telemetry Incident / Stack Trace]
                        |
                        v
          [IssueLens Console (Next.js 16)]
            +-- GitHub Issue URL Importer (/api/github)
            +-- 1-Click Incident Simulation Presets
            +-- Production Patch Blueprint Toggle
                        |
                        v
          [Next.js API Gateway (/api/analyze)]
                        |
                        v
          [Google Gemini Intelligence Cascade]
            +-- Primary:  gemini-3.8-flash
            +-- Fallback: gemini-flash-latest
                        |
                        v
          [High-Density Diagnostic Console]
            +-- Severity Tag & Blast Radius Indicator
            +-- Deterministic Root Cause Analysis
            +-- Precision Resolution Protocol (Runbook)
            +-- Architectural Footprint & Subsystems
            +-- Production Code Patch Blueprint
```

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **AI Intelligence:** [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/issuelens.git
cd issuelens
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Credentials
Create `.env.local` by copying `.env.example`:
```bash
cp .env.example .env.local
```

Add your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License

This project is licensed under the [MIT License](LICENSE) - free and open for the community.
