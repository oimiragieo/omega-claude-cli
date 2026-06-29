---
name: omega-claude-cli
description: Use when the user wants to use Claude (Claude Code CLI) for analysis or brainstorming. Triggers on "use Claude", "ask Claude", "analyze with Claude", "brainstorm with Claude".
---

# Omega Claude CLI (headless)

Runs the **Claude Code CLI in headless mode** so Antigravity can call Claude from the project. No MCP required.

From the **project root**, run:

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "USER_PROMPT"
```

Optional: `--model opus|sonnet|haiku|fable|best|opusplan|sonnet[1m]|opus[1m]`, `--json`, `--sandbox`, `--timeout-ms N`. Build the prompt from the user's request and any @ file refs; return the script output.

If the script fails, run `node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs` and see references/installation.md and references/auth.md. Scripts are shared at `.claude/skills/omega-claude-cli/scripts/`.
