# GitHub Copilot instructions

## Commit messages

- Never add a `Co-authored-by:` trailer that credits GitHub Copilot, Copilot Chat,
  Copilot Workspace, or any automation agent.
- Never add a `Signed-off-by:` trailer on behalf of another person or tool.
- Write commit messages as a single human author only. One short subject line in
  the imperative mood, then an optional body that explains *why* the change was
  made.
- Do not invent issue references, co-authors, or reviewer credits.

## Repository conventions

- This is a Next.js 14 App Router project using plain JavaScript.
- Preserve the existing content-verification policy: never invent ECU facts,
  addresses, programme details, staff names, awards, or statistics. If a fact is
  not present in `data/` or a cited official source, leave it out.
- Keep Arabic (`ar`) and Chinese (`zh`) routes functional. The `lang` attribute for
  Chinese is `zh-Hans`.
- Public pages must not expose editorial workflow language such as "verify",
  "awaiting approval", "unverified", or internal record counts.
- All security headers live in `next.config.js`; `vercel.json` only carries cache
  headers. Do not move them back.
