---
description: Analyze files or ask Claude using omega-claude-cli headless script
argument-hint: '[prompt or @file ...]'
allowed-tools: Bash, Read
---

Use the **headless Claude Code CLI script** to analyze or answer with Claude. No MCP required.

1. Build the **prompt** from the user's input. If they referenced files (e.g. with `@path` or by name), include those refs or the file content in the prompt so Claude has context.
2. From the **project root** (where `.claude` lives), run:
   ```bash
   node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT"
   ```
   Replace `PROMPT` with the full analysis request. Optionally add `--model sonnet`, `--model haiku`, `--model fable`, etc. (aliases: `opus`, `sonnet`, `haiku`, `fable`, `best`, `opusplan`, `sonnet[1m]`, `opus[1m]`).
3. Return the script's stdout as Claude's response to the user.

If no argument was given, ask the user what they want Claude to analyze or answer.

Do not use any MCP tool; use only the script above.
