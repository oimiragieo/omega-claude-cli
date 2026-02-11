---
description: Use Claude via omega-claude-cli headless script (analysis, brainstorm)
argument-hint: '[request or question]'
allowed-tools: Bash, Read
---

Use the **omega-claude-cli** skill and the **headless script** for this request. No MCP.

- For **analysis** or **ask Claude** something: run `node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT"` from the project root. Include any @ file refs in the prompt.
- For **brainstorm**: run the script with a prompt that states the challenge and optional methodology (e.g. "Brainstorm 5 ideas using design thinking: ...").

Use `--model sonnet` or `--model haiku` if you want a non-default model (CLI has 3: Default/Opus 4.6, Sonnet 4.5, Haiku 4.5). Return the script output as Claude's response. See `.claude/skills/omega-claude-cli/SKILL.md` and `references/headless.md` for details.
