# Project Context

Read this file before editing code, formulas, storage logic, or UI behavior.

## Project Overview

- Repo: `my-react-app`
- Current app shape: single-page shopping calculator / travel shopping helper
- Stack: static HTML + React 18 UMD + ReactDOM UMD + Babel Standalone + Tailwind CDN
- No package manager, no bundler, no TypeScript, no server build pipeline detected

## Source of Truth

| File | Purpose |
|------|---------|
| `index.html` | Main UI, React components, styles, app bootstrapping |
| `formulas.js` | Shared constants, calculation rules, storage helpers, rate fetching |
| `ORIGINAL_FORMULAS_BACKUP.txt` | Backup reference only, not the primary runtime file |

## Technical Notes

- The app runs directly in the browser from `index.html`.
- React is loaded from CDN and JSX is transpiled in-browser by Babel Standalone.
- Tailwind is loaded from CDN; there is no local Tailwind config file.
- Any performance or UX changes should respect the "no build step" architecture.

## Editing Rules

1. Do not assume hidden framework tooling exists.
2. Prefer small, direct edits over architecture rewrites.
3. If changing calculations, verify both UI display and copy/export text paths.
4. If changing storage keys or saved data shape, preserve backward compatibility unless explicitly asked not to.
5. If changing UI behavior, document the user-facing effect in the update log.
6. If adding new AI guidance files, keep them consistent with this file.

## Review Focus

When auditing this repo, prioritize:

- Calculation correctness
- React state consistency inside `index.html`
- Local storage safety and fallback handling
- Clipboard / share / screenshot flows
- Mobile layout and PWA behavior
- CDN/runtime failure edge cases

## Update Log

Rules:

- Add one new entry per completed session/commit.
- Do not overwrite another editor's entry.
- If correcting a previous entry, add a follow-up entry.
- Use Taiwan local time.

Entry format:

- `YYYY-MM-DD`
  `Updated at: YYYY-MM-DD HH:MM CST`
  `Updated by: Codex | Claude Code | Gemini | User`
  `Type: Bug Fix | Optimization | UI | Data | Docs | Infra | Review`
  `Summary: ...`
  `Files: ...`

- 2026-04-03
  Updated at: 2026-04-03 20:02 CST
  Updated by: Codex
  Type: Docs, Infra
  Summary: Added reusable AI collaboration framework files tailored to this static React UMD project, including role-specific entry files and review guidance.
  Files: `AGENTS.md`, `PROJECT_CONTEXT.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `REVIEW_PROMPT.md`
