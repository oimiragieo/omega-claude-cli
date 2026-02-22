---
name: omega-claude-cli
description: Use when the user wants to use Claude (Claude Code CLI) for analysis, codebases, or brainstorming. Runs headless Claude Code CLI via a Node script (no MCP). Triggers on "use Claude", "ask Claude", "analyze with Claude", "brainstorm with Claude". Do not use for general code edits that do not require Claude; use for tasks that benefit from Claude's context or a second model.
---

# Omega Claude CLI (Codex entry)

This Codex skill delegates to the canonical skill instructions at:

`./.claude/skills/omega-claude-cli/SKILL.md`

Use that file as the single source of truth for workflow, options, references, and troubleshooting. Keep this file minimal to avoid drift across duplicated docs.

## Quick run

From the project root:

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "USER_PROMPT"
```

Common options: `--model opus|sonnet|haiku`, `--json`, `--sandbox`, `--timeout-ms N`.
