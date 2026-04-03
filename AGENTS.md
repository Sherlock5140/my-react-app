# AI Start Here

Read these files before analyzing or editing this repo:

1. `PROJECT_CONTEXT.md`
2. `CLAUDE.md` if using Claude Code
3. `CODEX.md` if using Codex
4. `GEMINI.md` if using Gemini
5. `REVIEW_PROMPT.md` when a full audit/review is requested

Core rules:

- This is a static frontend project. Do not assume Vite, Next.js, TypeScript, or a build step.
- Main source files are `index.html` and `formulas.js`.
- After any logic, UI, storage, rate, or architecture change, append a new entry to `PROJECT_CONTEXT.md`.
- Never overwrite another editor's log entry. Add a follow-up entry instead.
- Before writing `Updated at`, use Taiwan local time: `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'`.
