# DevSnapz — Student Innovation Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build: Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Stack: React + TypeScript](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Budget: ₹0](https://img.shields.io/badge/Budget-%E2%82%B90%20Zero%20Cost-1bce92)](#zero-budget-architecture)

> A free and open-source platform that replaces scattered searching with an intelligent, explainable matching ecosystem for student creators, innovators, and collaborators.

---

## 🌟 The Vision

### Problem Statement ID: 26202
- **Title:** Student Innovation-Ideas focused on the intelligent use of resources for transforming and advancements of technology with combining artificial intelligence to explore more various sources and get valuable insights.
- **Theme:** Smart Automation
- **Category:** Software

### Why DevSnapz?
Students building technical projects face a fragmented ecosystem:
- **Scattered Discovery:** Searching across disconnected platforms (job boards, Discord servers, WhatsApp groups, and campus forums) to recruit teammates.
- **Hidden Skill Gaps:** Creators struggle to analyze which competencies are actually missing from their technical stack.
- **Trial & Error Outreach:** Random messaging with no structured context or mutual compatibility.
- **Disconnected Learning:** Learning materials and tutorials are buried across the internet without connection to project goals.

**DevSnapz provides a unified, intelligent layer** that extracts project requirements, detects missing technical skills, and matches students with compatible collaborators and learning guides — with transparent, explainable reasoning.

---

## 🚀 Key Features

1. **Project Showcase Gallery:**  
   Discover active student creations, filter by technology tags, and search by help needed (*Sponsors*, *Collaborators*, *Mentoring*, *Contributors*).
2. **AI-Assisted Skill-Gap Analysis:**  
   AI analyzes project descriptions to extract required competencies and highlights gaps between what the creator knows and what the project needs.
3. **Explainable Collaborator Matchmaking:**  
   Surfaces compatible student developers with clear explanations for *why* they match (e.g. *"Matches your gap in Database & UI/UX"*).
4. **Interactive Project Hub & Role Applications:**  
   Detailed modal view for projects featuring open roles, mentorship Q&A threads, milestone sponsorship tiers, and beginner-friendly issues.
5. **Creator Management Dashboard:**  
   A unified workspace for project owners to review incoming collaborator applications (*Approve* / *Decline*), answer technical guidance questions, and track project status.
6. **Dark & Light Mode:**  
   Theme-aware user interface powered by CSS variables and Tailwind CSS.

---

## 🏗️ Architecture & Zero-Budget Stack

DevSnapz is engineered strictly under a **₹0 budget requirement**, leveraging industry-grade free and open-source tiers with zero credit card requirements:

| Component | Selected Technology | Free-Tier Guarantee |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript + Vite | 100% Free & Open Source |
| **Styling & Design** | Tailwind CSS 3.4 + CSS Variables | 100% Free & Open Source |
| **Deployment / Hosting** | Cloudflare Pages / Netlify | Unlimited bandwidth / Free static hosting |
| **Backend & Database** | Supabase (PostgreSQL) | 500 MB database, 50k MAU Auth, 0 cost |
| **Vector Similarity** | Supabase `pgvector` | Native extension inside PostgreSQL |
| **AI Requirement Inference** | Groq Cloud API (`llama-3.1-8b`) | Free tier (30 req/min, 14.4k req/day) |
| **Offline Fallback** | PostgreSQL Full-Text Search (`tsvector`) | 100% Free native database search |
| **CI / CD & Testing** | GitHub Actions & Vitest | Unlimited minutes for public open-source repos |

---

## 📂 Project Structure

```
web/
├── docs/                     # Architectural documentation & phase reports
│   └── phases/
│       └── phase-00-audit-and-requirements.md
├── public/                   # Static public assets (logo, icons)
├── src/
│   ├── components/           # UI components & platform modules
│   │   ├── Capabilities.tsx  # Landing: Core capabilities
│   │   ├── Community.tsx     # Landing: Community links
│   │   ├── CreateProjectWizard.tsx # Multi-step project creation wizard
│   │   ├── CreatorDashboard.tsx    # Multi-project creator management hub
│   │   ├── Ecosystem.tsx     # Landing: Featured ecosystem project
│   │   ├── Footer.tsx        # Brand footer
│   │   ├── Hero.tsx          # Landing: Terminal hero banner
│   │   ├── Nav.tsx           # Sticky navigation with theme toggle
│   │   ├── ProjectDetailModal.tsx  # Project modal with 5 sub-tabs
│   │   ├── ShowcaseFeed.tsx  # Showcase gallery with search & filters
│   │   ├── Stack.tsx         # Landing: Architecture stack display
│   │   └── ThemeToggle.tsx   # Light/dark theme toggle
│   ├── data/                 # Seed data and mock fixtures
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript domain models and interfaces
│   ├── App.tsx               # Root application coordinator
│   ├── index.css             # Theme variables & base Tailwind styles
│   └── main.tsx              # React DOM entry point
├── CONTRIBUTING.md           # Guide for student contributors
├── LICENSE                   # MIT License
├── package.json              # Project dependencies and npm scripts
├── tailwind.config.cjs       # Tailwind CSS configuration
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Vite bundler configuration
```

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/DevSnapz/web.git
cd web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Build output is saved to the `dist/` directory.

---

## 🗺️ Roadmap & Milestones

- [x] **Phase 0 — Project Audit & Requirement Analysis** ([Report](docs/phases/phase-00-audit-and-requirements.md))
- [x] **Phase 1 — Architecture & Open-Source Setup** (Repository organization, community guides, licensing)
- [ ] **Phase 2 — Landing Page Alignment** (Refining copy and student value proposition)
- [ ] **Phase 3 — Product UI/UX & Routing** (Client-side routing with deep-linkable URLs)
- [ ] **Phase 4 — Core Platform Backend** (Supabase Auth, PostgreSQL schema, Row Level Security)
- [ ] **Phase 5 — AI & Matching Engine** (Groq skill extraction, skill-gap analysis, explainability)
- [ ] **Phase 6 — Security, Accessibility & Testing** (Vitest test suite, RLS policies, WCAG audit)
- [ ] **Phase 7 — Production Launch & Pilot** (Cloudflare Pages deployment, campus onboarding)

---

## 🤝 Contributing

We welcome contributions from students and developers of all skill levels! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on setting up your environment, code standards, and submitting pull requests.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute.
