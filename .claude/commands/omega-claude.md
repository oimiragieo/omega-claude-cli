---
description: Use Claude via omega-claude-cli headless script (analysis, brainstorm)
argument-hint: '[request or question]'
allowed-tools: Bash, Read
---

Use the **omega-claude-cli** skill and the **headless script** for this request. No MCP.

- For **analysis** or **ask Claude** something: run `node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT"` from the project root. Include any @ file refs in the prompt.
- For **brainstorm**: run the script with a prompt that states the challenge and optional methodology (e.g. "Brainstorm 5 ideas using design thinking: ...").

Use `--model sonnet`, `--model haiku`, `--model fable`, etc. if you want a non-default model (aliases: `opus`, `sonnet`, `haiku`, `fable`, `best`, `opusplan`, `sonnet[1m]`, `opus[1m]`). Return the script output as Claude's response. See `.claude/skills/omega-claude-cli/SKILL.md` and `references/headless.md` for details.
