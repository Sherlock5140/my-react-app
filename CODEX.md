# Codex Guide

Before making changes, read:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`

Repo-specific guidance:

- Treat this as a static browser app, not a standard npm React project.
- Primary working files are `index.html` and `formulas.js`.
- Preserve current runtime architecture unless the user explicitly asks for a refactor.

After any meaningful change:

- Append an update entry to `PROJECT_CONTEXT.md`
- Do not overwrite existing entries

Use `REVIEW_PROMPT.md` when a deep audit is requested.
