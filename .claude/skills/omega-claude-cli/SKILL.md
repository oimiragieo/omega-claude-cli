---
name: omega-claude-cli
description: Use when the user wants to use Claude (Claude Code CLI) for analysis, codebases, or brainstorming from another agent. Uses headless Claude Code CLI scripts (no MCP). Triggers on "use Claude", "analyze with Claude", "ask Claude", "brainstorm with Claude".
allowed-tools: Read, Grep, Bash
---

# Omega Claude CLI (headless)

This skill uses the **Claude Code CLI in headless mode** so other agents (Codex, Cursor, Copilot, etc.) can run Claude from scripts—no MCP server or MCP configuration required.

## Overview

Run Claude via the headless script: [scripts/ask-claude.mjs](./scripts/ask-claude.mjs) (from the skill root) or `.claude/skills/omega-claude-cli/scripts/ask-claude.mjs` (from the project root). It invokes `claude -p "..." --dangerously-skip-permissions` (and optional `--model`, `--json`, `--sandbox`, `--timeout-ms`) and returns the response. Requires **Node.js** and the **Claude Code CLI** to be installed. For one-time setup after copying this folder, run **/omega-claude-setup**. For install and auth, see [references/installation.md](references/installation.md) and [references/auth.md](references/auth.md).

## First-time setup

If the user has not set up Claude Code CLI yet, direct them to run **/omega-claude-setup**. That runs the verification script (`node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs`) and guides them to install Node, install Claude Code CLI, and complete one-time auth. No MCP config is needed.

## ⚠️ RULE: Running inside Claude Code (nested session)

**If the host agent IS Claude Code** (i.e. `$CLAUDECODE` is set), do NOT use `ask-claude.mjs` — it will fail with:

> `Claude Code cannot be launched inside another Claude Code session.`

This happens because `ask-claude.mjs` spawns a child process that inherits the `CLAUDECODE` env var. Use the direct CLI pattern instead:

```bash
OUT=/tmp/claude_ask_$$.txt
ERR=/tmp/claude_err_$$.txt
env -u CLAUDECODE claude --dangerously-skip-permissions -p "PROMPT" > "$OUT" 2>"$ERR" &
wait $!
cat "$OUT"
```

- `env -u CLAUDECODE` fully removes the variable so the child session starts clean.
- Background (`&`) + `wait` is required — foreground Claude CLI processes do not produce output when called from inside the Bash tool.
- Always use a unique temp file (`$$` = PID) to avoid collisions.
- Check `$ERR` if output is empty.

**Other agents (Codex, Cursor, Copilot, etc.) are NOT affected** — they don't set `CLAUDECODE`, so they use `ask-claude.mjs` as normal (see below).

## How to run Claude (headless) — for non-Claude agents

From the project root (where `.claude` lives), run:

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "USER_PROMPT"
```

Options (append to the command):

- `--model MODEL` — optional. CLI has three models: Default (Opus 4.6), Sonnet 4.5, Haiku 4.5. Use e.g. `--model sonnet` or `--model haiku`.
- `--json` — output JSON; the script prints the `.response` field if present.
- `--sandbox` — run or test code in Claude's sandbox mode.
- `--timeout-ms N` — optional timeout for automation.

Examples:

- Analysis: `node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Review @src/main.js for bugs"`
- With model: `node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Summarize this" --model sonnet`
- Stdin: `echo "Explain recursion" | node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs`

When the user says "ask Claude for feedback" (or similar), build the prompt from their request and any @ file refs, then run the script and return the script output to the user.

## When to use this skill

- **Analysis** — Use Claude's context for code or doc review from another agent.
- **Second opinion / feedback** — User wants Claude's take on code or docs from Codex, Cursor, Copilot, etc.
- **Brainstorming** — Build a prompt that includes the challenge and optional methodology and run the script.

For full headless options and examples, see [references/headless.md](references/headless.md). For copying this skill into another project, see [references/copy-and-run.md](references/copy-and-run.md). Other surfaces: [Cursor](references/cursor.md), [Codex CLI](references/codex.md), [GitHub Copilot CLI](references/copilot-cli.md), [Antigravity IDE](references/antigravity.md), [VS Code](references/vscode.md).

## Slash commands

- **/analyze** — Run the headless script with the user's prompt (and any @ refs). Example: `/analyze summarize @README.md`.
- **/omega-claude** — Use the headless script for analysis or brainstorm as appropriate.
- **/omega-claude-setup** — Verify Node and Claude Code CLI; guide the user to install and auth. No MCP.

Natural language: "use Claude to explain index.html", "ask Claude for feedback on this function", "brainstorm with Claude using design thinking".

## Auth

One-time sign-in and auth issues: [references/auth.md](references/auth.md).

## Failure handling

- If shell execution is unavailable in the host agent (for example `@lydell/node-pty` missing binary errors), report that the Claude call is blocked by runtime setup.
- Do not present fabricated Claude output. Return the real error and troubleshooting steps instead.

## Copy and run in another project

Copy the **entire** `.claude` folder (so you have `.claude/skills/omega-claude-cli/` and `.claude/commands/`) into the target project. Open that project in your agent and run from its root. Run **/omega-claude-setup** once, then "ask Claude" works. Details: [references/copy-and-run.md](references/copy-and-run.md).
