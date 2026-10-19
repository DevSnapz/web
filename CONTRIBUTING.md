# Contributing to DevSnapz

Welcome to **DevSnapz — Student Innovation Hub**! We are thrilled that you want to contribute. DevSnapz is a free and open-source platform created to help student developers showcase projects, find co-builders, and bridge technical skill gaps.

Whether you are fixing a typo, adding a new feature, improving documentation, or designing components, all contributions are warmly welcomed!

---

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors regardless of experience level, background, or identity. Please:
- Be respectful and considerate.
- Welcome beginners and offer constructive feedback.
- Focus on what is best for the student community.

---

## How to Get Started

### 1. Prerequisites
Ensure you have the following installed locally:
- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/) (version 9.x or higher)
- [Git](https://git-scm.com/)

### 2. Fork and Clone
1. Fork the repository on GitHub: [devsnapz/web](https://github.com/DevSnapz/web).
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/web.git
   cd web
   ```
3. Set the upstream remote:
   ```bash
   git remote add upstream https://github.com/DevSnapz/web.git
   ```

### 3. Install Dependencies & Run
Install the dependencies and start the local development server:
```bash
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## Development Workflow

### Creating a Branch
Always branch off the latest `main`:
```bash
git checkout main
git pull upstream main
git checkout -b feat/your-feature-name
# or for bug fixes:
git checkout -b fix/issue-description
```

### Coding Conventions
- **TypeScript:** Use strict types. Avoid `any` wherever possible. Define reusable interfaces in `src/types/`.
- **Styling:** Use Tailwind CSS utility classes. Avoid inline style attributes. For theme-dependent colors, use CSS variables defined in `tailwind.config.cjs` (e.g., `text-g`, `text-ink0`, `bg-bg1`, `border-ink3`).
- **Icons:** Use lightweight inline SVGs with appropriate `aria-hidden` or `aria-label` attributes.
- **Zero-Budget:** Do not introduce dependencies that require paid API subscriptions or commercial licenses.

### Commit Messages
We follow conventional commit format:
- `feat: add student profile public card component`
- `fix: resolve mobile navigation backdrop blur clipping`
- `docs: update setup instructions in README`
- `style: refine theme toggle button padding`
- `refactor: extract project filter logic into custom hook`

### Submitting a Pull Request (PR)
1. Ensure your changes compile without errors:
   ```bash
   npm run build
   ```
2. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
3. Open a Pull Request against `devsnapz/web` on GitHub:
   - Provide a clear title and description of your changes.
   - Reference any related issues (e.g., `Closes #12`).
   - Include screenshots or screen recordings for UI changes.

---

## Community & Questions

Have questions or need guidance?
- **Discord:** [Join our Discord](https://discord.gg/HKtj4rxZEF)
- **GitHub Discussions:** [Open an Idea / Discussion](https://github.com/DevSnapz/web/discussions)
- **Email:** devsnapz@gmail.com

Thank you for building DevSnapz with us!
