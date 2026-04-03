# Claude Code Guide

Before making changes, read:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`

Repo-specific guidance:

- This repo uses React UMD inside `index.html`, not a bundled React app.
- Do not propose Vite/Next/TypeScript migration unless explicitly requested.
- Keep edits practical and directly usable in a static-hosted environment.

After any meaningful change:

- Append an update entry to `PROJECT_CONTEXT.md`
- Do not overwrite existing entries

Use `REVIEW_PROMPT.md` when a deep audit is requested.
