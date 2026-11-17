# DevSnapz — Project Collaboration Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build: Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Stack: React + TypeScript](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> Discover projects, find collaborators, and connect the skills and resources needed to bring ideas to life.

---

## About DevSnapz

DevSnapz is a platform for people building technical projects. It brings project discovery, collaboration, and learning resources together in one place, helping project owners find contributors and helping developers find projects that match their interests and skills.

Projects often rely on scattered posts, chat groups, and forums to find help. DevSnapz provides a shared space to showcase work, describe what support is needed, and make it easier for people to connect around meaningful projects.

---

## Features

1. **Project Showcase Gallery:** Discover projects, filter by technology tags, and search by the kind of help needed (*Sponsors*, *Collaborators*, *Mentoring*, *Contributors*).
2. **AI-Assisted Skill-Gap Analysis:** Analyze project descriptions to identify required competencies and highlight skills that may be missing from a project team.
3. **Explainable Collaborator Matching:** Find developers whose skills and interests fit a project, with clear explanations of why they may be a good match.
4. **Interactive Project Hub & Role Applications:** Explore project details, open roles, mentorship Q&A threads, sponsorship tiers, and beginner-friendly issues.
5. **Project Management Dashboard:** Give project owners a workspace to review collaborator applications, answer questions, and track project status.
6. **Dark & Light Mode:** Switch between themes with a theme-aware interface built with CSS variables and Tailwind CSS.

---

## Technology

| Component | Technology | Notes |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite | Component-driven single-page application |
| **Styling** | Tailwind CSS 3.4, CSS Variables | Responsive, theme-aware interface |
| **Hosting** | Cloudflare Pages or Netlify | Deployment options |
| **Backend & Database** | Supabase, PostgreSQL | Database and backend services |
| **Vector Similarity** | Supabase `pgvector` | Similarity search in PostgreSQL |
| **AI Requirement Inference** | Groq Cloud API (`llama-3.1-8b`) | Automated skill extraction |
| **Search Fallback** | PostgreSQL Full-Text Search (`tsvector`) | Tag and keyword matching |
| **Testing** | Vitest | Test framework |

---

## Project Structure

```
web/
├── docs/                     # Project documentation
├── public/                   # Static public assets
├── src/
│   ├── components/           # UI components and platform modules
│   ├── data/                 # Seed data and mock fixtures
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript domain models and interfaces
│   ├── App.tsx               # Root application coordinator
│   ├── index.css             # Theme variables and base Tailwind styles
│   └── main.tsx              # React DOM entry point
├── CONTRIBUTING.md           # Contribution guide
├── LICENSE                   # MIT License
├── package.json              # Dependencies and npm scripts
├── tailwind.config.cjs       # Tailwind CSS configuration
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Vite bundler configuration
```

---

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/DevSnapz/web.git
cd web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

### 4. Build for production

```bash
npm run build
```

The production build is saved to the `dist/` directory.

---

## Development Roadmap

- [ ] Refine the project discovery experience and project details
- [ ] Add client-side routing and shareable project links
- [ ] Implement authentication and persistent project data
- [ ] Build and integrate collaborator matching and skill analysis
- [ ] Expand automated tests and accessibility coverage
- [ ] Prepare production deployment and onboarding

---

## Contributing

Contributions are welcome from developers of all experience levels. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for information about setting up the project, coding standards, and submitting changes.

---

## License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute.
