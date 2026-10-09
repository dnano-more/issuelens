# 🔍 IssueLens — AI GitHub Issue Analyzer

> **Turn cryptic GitHub issues and error stack traces into structured debugging roadmaps in seconds.**  
> Built with **Next.js 16**, **TypeScript**, and **Google Gemini API** for **Hacktoberfest Hack Day Navi Mumbai**.

---

## 🌟 Overview

When contributing to open-source or joining a new project, GitHub issues can feel overwhelming. Vague descriptions, wall-of-text stack traces, and unfamiliar errors often intimidate beginners and slow down experienced engineers.

**IssueLens** solves this by analyzing GitHub issues with **Google Gemini API**, extracting:
1. **Clear Summary:** What is actually broken in plain words.
2. **Likely Root Causes:** Key reasons why the failure occurred.
3. **Debugging Roadmap:** Step-by-step actions to resolve the problem.
4. **Key Files & Areas:** Specific files, middleware, or config to inspect.
5. **Beginner's Analogy:** A friendly, jargon-free explanation for first-time contributors.
6. **Suggested Next Action:** The single highest-leverage immediate step.

---

## 🏆 Hackathon Track

- **Event:** Hacktoberfest Hack Day Navi Mumbai x AITD Events
- **Category:** **Best Use of Gemini API**
- **AI Coding Tool:** Antigravity

---

## ✨ Features

- ⚡ **Instant AI Triage:** Delivers comprehensive issue breakdown in under 2 seconds.
- 🎓 **"Explain Like I'm a Beginner" Toggle:** Bridges the knowledge gap by translating complex technical errors into relatable real-world analogies.
- 🎯 **1-Click Demo Presets:** Pre-configured realistic issues (MongoDB ECONNREFUSED, Next.js Hydration Mismatch, JWT Expiration, CORS Errors) for instant evaluation.
- 📋 **1-Click Copy:** Export the full markdown debugging plan directly into your clipboard for PR discussions or notes.
- 🛡️ **Graceful Fallbacks:** Built-in interactive demo mode even before adding your API key.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI Engine:** Google Gemini API (`@google/generative-ai` / `gemini-1.5-flash`)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/issuelens.git
cd issuelens
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture

```text
[User / GitHub Issue]
         │
         ▼
[Next.js Client UI (page.tsx)]
  ├── 1-Click Presets (presets.ts)
  └── Beginner Mode Toggle
         │
         ▼
[Next.js API Route (/api/analyze)]
         │
         ▼
[Google Gemini API (gemini-1.5-flash)]
         │
         ▼
[Structured Output Card]
  ├── Severity & Priority Badge
  ├── Beginner Analogy (if enabled)
  ├── Possible Root Causes
  ├── Key Files to Investigate
  └── Step-by-Step Debugging Roadmap
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - feel free to use, modify, and contribute!
