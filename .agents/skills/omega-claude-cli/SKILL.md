---
name: omega-claude-cli
description: Use when the user wants to use Claude (Claude Code CLI) for analysis, codebases, or brainstorming. Runs headless Claude Code CLI via a Node script (no MCP). Triggers on "use Claude", "ask Claude", "analyze with Claude", "brainstorm with Claude". Do not use for general code edits that do not require Claude; use for tasks that benefit from Claude's context or a second model.
---

# Omega Claude CLI (headless)

This skill follows the [Agent Skills](https://agentskills.io) open standard. Codex discovers it from **REPO** scope at `$REPO_ROOT/.agents/skills/`. It runs the **Claude Code CLI in headless mode** so Codex can call Claude from the project—no MCP server or MCP configuration required.

## Overview

From the **project root** (the directory that contains `.claude` and `.agents`), run the headless script. It invokes `claude -p "..." --dangerously-skip-permissions` with optional model/JSON/sandbox/timeout flags and returns the response. Requires **Node.js** and **Claude Code CLI** to be installed.

## How to run Claude

**Input:** A user prompt (and optional @ file refs). **Output:** The script's stdout (Claude's response).

From the project root, run:

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "USER_PROMPT"
```

Optional flags (append to the command):

- `--model MODEL` — optional. CLI has three models: Default (Opus 4.6), Sonnet 4.5, Haiku 4.5. Use e.g. `--model sonnet` or `--model haiku`.
- `--json` — output JSON; the script prints the `.response` field if present.
- `--sandbox` — run the prompt in Claude sandbox mode.
- `--timeout-ms N` — optional timeout for automation.

Examples:

- Analysis: `node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Review @src/main.js for bugs"`
- With model: `node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Summarize this" --model sonnet`
- Stdin: `echo "Explain recursion" | node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs`

1. Build the prompt from the user's request and any @ file refs. 2. Run the command above from the project root. 3. Return the script's stdout to the user as Claude's response.

## When to use this skill

- **Analysis** — Use Claude's context for code or doc review.
- **Second opinion / feedback** — User wants Claude's take on code or docs.
- **Brainstorming** — Build a prompt that includes the challenge and optional method (e.g. SCAMPER) and run the script.

## If Claude Code CLI is not set up

If the script fails (e.g. "claude not found"), direct the user to install Node.js and Claude Code CLI and complete one-time auth. Setup can be verified by running from project root:

```bash
node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs
```

Full installation and auth details live in the skill at `.claude/skills/omega-claude-cli/references/installation.md` and `references/auth.md` (same repo).

## Shared scripts

Scripts are shared with the Claude skill: `.claude/skills/omega-claude-cli/scripts/`. No duplicate copies are required for Codex.
