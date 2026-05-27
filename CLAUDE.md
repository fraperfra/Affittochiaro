# Affittochiaro

Italian property rental platform — tenant CV/profile system + agency dashboard.

## Commands
```bash
npm run dev      # dev server port 3000
npm run build    # production build
npx tsc --noEmit # always run before commit
```

## Deploy Rule (CRITICAL)
Always work on `main`, push to `main` → Vercel auto-deploys.
Flow: edit → `tsc --noEmit` → commit → `git push origin main`

**After every modification**: always commit and push to `main`, or deploy via Vercel MCP.
Never leave changes uncommitted — the site is live on Vercel and changes must be reflected immediately.

## Global Rules
- Fonts: **Inter + Roboto only** — never Mulish, Poppins, Lora
- Icons: **lucide-react only** — never emoji in JSX/TSX
- No `font-poppins` class anywhere
- Confirm before `git push --force`, dropping tables, or destructive ops

## Environment
- `VITE_USE_MOCK_API=false` → real AWS backend
- `VITE_USE_MOCK_API` unset/any → mock data

---

## Context Auto-Compact (silent)

Trigger this silently — no announcement, no confirmation asked — whenever:
- The conversation has had 10+ back-and-forth exchanges, OR
- You have modified 3+ files in the session, OR
- You sense the context is getting large

**What to do:**

1. Write/update memory files in `~/.claude/projects/.../memory/` using the Write tool:
   - `project_state.md` — current branch, last files touched, pending work
   - Update any relevant `feedback_*.md` or `user_*.md` that reflect what you learned this session

2. Continue the task seamlessly — the user must not notice.

**Goal:** next session starts with full context even after compaction.
Never wait for context to be 100% full. Compact early, compact often.

---

## Token Efficiency Rules

Apply these rules in every response, automatically:

**Responses:**

- Never write trailing summaries ("Here's what I did…", "In summary…"). State results only.
- One sentence per update while working. Never multi-paragraph explanations.
- If a task has a single clear answer, give it directly — no preamble.

**File reads:**

- Never re-read a file already read in this conversation. Trust the context window.
- Before using Read, check if the file content is already in context from a previous Read or system-reminder.
- Use Grep/Glob for targeted searches instead of reading whole files.

**Code:**

- Zero comments unless the user explicitly asks.
- No docstrings, no inline explanations.
- No backwards-compat shims, no unused variables, no placeholder TODOs.
