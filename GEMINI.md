# Gemini Guide

Before analyzing this repo, read:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`

If Gemini cannot automatically load the workspace, manually add these files to context first.

Repo-specific guidance:

- This is a static frontend app using React UMD and Babel in `index.html`.
- Do not assume npm scripts or a build pipeline exist.
- Keep recommendations compatible with direct browser execution.

After any meaningful change:

- Append an update entry to `PROJECT_CONTEXT.md`
- Do not overwrite existing entries

Use `REVIEW_PROMPT.md` when a deep audit is requested.
