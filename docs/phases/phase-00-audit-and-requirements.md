# Phase 0: Existing Project Audit & Requirement Analysis

- **Phase ID:** Phase 0
- **Status:** Completed
- **Date Completed:** October 19, 2026
- **Repository:** `devsnapz/web` (formerly `devsnapz/landing`)
- **Project Name:** DevSnapz — Student Innovation Hub
- **Budget Constraint:** Strictly ₹0 (Free and Open-Source Stack)

---

## 1. Executive Summary

DevSnapz is a free and open-source platform designed for student innovators and developers. It replaces fragmented, trial-and-error student collaboration (across WhatsApp, Discord, college noticeboards, and GitHub) with an intelligent, explainable matching ecosystem.

In Phase 0, we conducted a non-destructive audit of the existing codebase in `devsnapz/landing` (now renamed to `devsnapz/web`), mapped the project requirements against the Smart Automation proposal (Problem Statement ID 26202), performed a ₹0 budget technology evaluation, resolved the core architectural approach, and defined the Minimum Viable Product (MVP).

---

## 2. Existing Workspace Audit

### 2.1 File & Directory Inventory

```
d:\Programming\DevSnapz\web\
├── .git/                     # Git repository tracking origin (updated to devsnapz/web)
├── .vscode/                  # Workspace configuration
├── dist/                     # Production build artifacts
├── node_modules/             # Node runtime dependencies
├── public/
│   └── logo.png              # DevSnapz logo
├── src/
│   ├── components/           # UI components & early platform views
│   │   ├── Capabilities.tsx  # Marketing: Core disciplines (AI, Full-stack, Systems, DevTools)
│   │   ├── Community.tsx     # Marketing: Community links (GitHub, Discord, Email)
│   │   ├── CreateProjectWizard.tsx # Multi-step project creation form (28 KB)
│   │   ├── CreatorDashboard.tsx    # Multi-project creator management portal (21 KB)
│   │   ├── Ecosystem.tsx     # Featured project showcase card
│   │   ├── Footer.tsx        # Standard footer
│   │   ├── Hero.tsx          # Hero section with simulated terminal animation
│   │   ├── Nav.tsx           # Sticky nav with view switcher & theme toggle
│   │   ├── ProjectDetailModal.tsx  # Project modal with 5 sub-tabs (48 KB)
│   │   ├── ShowcaseFeed.tsx  # Filterable project gallery with search (15 KB)
│   │   ├── Stack.tsx         # Architecture stack showcase
│   │   └── ThemeToggle.tsx   # Light/dark mode switcher
│   ├── data/
│   │   └── initialData.ts    # Seed data with mock project
│   ├── hooks/
│   │   └── useAnimateOnScroll.ts # IntersectionObserver scroll reveal hook
│   ├── types/
│   │   └── index.ts          # TypeScript domain interfaces
│   ├── App.tsx               # Monolithic view & local storage state manager (16 KB)
│   ├── index.css             # Theme variables (light/dark) and CSS design tokens
│   └── main.tsx              # React entry point
├── .gitignore                # Node / Vite ignore rules
├── index.html                # Entry HTML with Google Fonts
├── netlify.toml              # Netlify static build deployment config
├── package.json              # Dependency manifests
├── package-lock.json         # Pinned dependency lockfile
├── postcss.config.cjs        # PostCSS configuration
├── tailwind.config.cjs       # Tailwind theme configuration
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Vite bundler configuration
```

### 2.2 Technology Stack Baseline

- **Frontend Core:** React 18.2.0, TypeScript 5.4.2, Vite 5.2.0
- **Styling & Theming:** Tailwind CSS 3.4.7 with CSS variables (`var(--bg0)`, `var(--g)`, `var(--gold)`) supporting dark and light modes.
- **Typography:** `Outfit` (Headings), `DM Sans` (Body text), `DM Mono` (Code, metadata, tags).
- **State & Storage:** Client-side React `useState` persisted to browser `localStorage` (`devsnapz_projects`, `devsnapz_applications`).
- **Icons & Media:** Zero-external-dependency inline SVGs and Dicebear avatar fallbacks.

### 2.3 Identified Technical Debt

1. **State Centralization:** `App.tsx` contains 457 lines coordinating view transitions, project CRUD, application submissions, and sponsorship simulations.
2. **Missing Real Routing:** The UI switches between `'landing' | 'explore' | 'dashboard'` using React state, preventing bookmarkable and shareable URLs.
3. **Single-Device Isolation:** `localStorage` prevents multi-user collaboration; projects created on one browser cannot be seen by another user.
4. **Hardcoded Identity:** Creator names and contact details are arbitrary strings rather than authenticated user profiles.

---

## 3. DevSnapz Vision Analysis (Problem Statement ID 26202)

According to `DevSnapz.pdf` (*Student Innovation Hub*):

1. **The Problem:**
   - Students work across disconnected platforms (job boards, chats, forums).
   - Students manually struggle to identify technical skill gaps in their projects.
   - Outreach to potential teammates is based on trial and error.
   - Learning resources are scattered and disconnected from actual project needs.
2. **The Solution:**
   - A single, intelligent layer that understands project requirements.
   - AI extracts required technical competencies from project descriptions.
   - The platform flags specific skill gaps (e.g., project has React, needs Database and UI/UX).
   - Semantic matchmaking surfaces matching student collaborators and learning materials.
   - Recommendations are **explainable** rather than opaque.
   - Direct collaboration workflows.

---

## 4. Architectural Decision: Landing vs. Platform

Three architectural alternatives were evaluated:

| Criterion | Option A: Separate Repos (`landing` + `platform`) | Option B: Single Repo (Unified `web`) | Option C: Monorepo (Turborepo/pnpm) |
| :--- | :--- | :--- | :--- |
| **Development Complexity** | High (2 repos, cross-origin CORS) | **Lowest (1 repo, 1 build pipeline)** | Very High (workspace tooling overhead) |
| **Free Deployment** | Needs 2 free hosting slots | **1 free slot (Cloudflare / Netlify)** | Complex free-tier build configs |
| **Maintenance & Onboarding** | Difficult for students | **Easiest (`git clone`, `npm install`)** | High learning curve |
| **Code Reuse** | Poor (requires splitting existing UI) | **100% reuse of existing UI & styles** | High, but requires shared packages |
| **Estimated Build Time** | 2x build pipelines | **Single fast Vite build (~2s)** | Variable |

### Decision
**Adopt Option B (Single Repository).**  
The repository has been updated to `https://github.com/DevSnapz/web`. The landing page will live at the root (`/`), while the platform routes will be accessible at `/explore`, `/projects/:id`, `/dashboard`, and `/profile`.

---

## 5. Zero-Budget (₹0) Feasibility Matrix

Every technology chosen operates strictly within verified free tiers with zero credit card requirements:

| Component | Selected Candidate | Free Tier Limit | Credit Card Required? | Fallback Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Hosting** | Cloudflare Pages / Netlify | Unlimited bandwidth (CF), 500 builds/mo | **No** | Netlify -> Cloudflare Pages |
| **Database & Auth** | Supabase | 500 MB PostgreSQL, 50,000 MAU Auth | **No** | Scheduled keep-alive GitHub Action prevents 7-day pause |
| **Vector Storage** | Supabase pgvector | Included free in Postgres | **No** | Full-Text Search (`tsvector`) |
| **AI Inference** | Groq Cloud API (`llama-3.1-8b-instant`) | 30 req/min, 14,400 req/day | **No** | Rule-based tag matching |
| **Embeddings** | Hugging Face Inference API / Client-side Transformers | Free serverless tier / WebAssembly in browser | **No** | PostgreSQL keyword search |
| **Testing & CI** | Vitest & GitHub Actions | Unlimited minutes for public open-source repos | **No** | Local execution |

---

## 6. Functional Scope: MVP vs. Post-MVP

### MVP (Release 1.0)
- [x] Responsive Landing Page with DevSnapz value proposition.
- [ ] Free GitHub & Email Authentication (Supabase Auth).
- [ ] Student Profiles (skills, university, bio, GitHub link).
- [ ] Project Publishing & Open Role Definition.
- [ ] AI Skill-Gap Analysis (Groq LLM extracts required skills; system flags missing competencies).
- [ ] Rule-Based Offline Fallback (matching tags without AI).
- [ ] Project Discovery & Filterable Gallery.
- [ ] Collaboration Request Application Workflow (submit, approve, decline).
- [ ] Explainable Matching Rationale.

### Post-MVP (Release 2.0+)
- [ ] Automated Cosine Similarity Clustering via pgvector.
- [ ] External Learning Resource automated scrapers.
- [ ] In-app real-time messaging / chat.
- [ ] Milestone sponsorship financial checkout.
- [ ] Cross-campus university verification badges.

---

## 7. Phase 0 Deliverable Sign-Off

- **Audit Completed:** Yes.
- **Git Remote Synchronized:** Yes (`https://github.com/DevSnapz/web.git`).
- **Vision & Roadmap Aligned:** Yes.
- **Next Phase:** Phase 1 — Architecture and GitHub Organization.
