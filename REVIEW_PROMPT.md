# Review Prompt

Use this when asking an AI to fully audit this repo:

```text
This is a static frontend app that uses React 18 UMD + ReactDOM UMD + Babel Standalone inside index.html.
Do not assume Vite, Next.js, TypeScript, or a build step.

Before reviewing, read:
1. AGENTS.md
2. PROJECT_CONTEXT.md

Please audit the app as a senior frontend engineer.

Required checks:
- JavaScript / React logic errors
- Calculation correctness and rounding issues
- XSS / clipboard / input injection risks
- LocalStorage safety and backward compatibility
- Network failure / CDN failure edge cases
- Mobile layout and standalone/PWA behavior
- Unhandled Promise rejection paths

Output format:
1. Critical issues
2. Medium issues
3. Code quality score /10
4. Top 3 priorities
```
