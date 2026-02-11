---
description: Brainstorm ideas with Claude via omega-claude-cli headless script
argument-hint: '[challenge or question] [methodology] [domain]'
allowed-tools: Bash, Read
---

Use the **headless Claude Code CLI script** to brainstorm with Claude.

1. Build the **prompt** from the user's input. Include the main challenge or question. Optionally add methodology (e.g. "Use SCAMPER" or "Use design thinking") and domain (e.g. "software", "product") in the prompt text.
2. From the **project root**, run:
   ```bash
   node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT"
   ```
   Example prompt: "Brainstorm 10 ideas using SCAMPER for: how to reduce signup friction in our app."
3. Return the script's output (Claude's ideas) to the user.

If no argument was given, ask what they want to brainstorm about.

Do not use MCP; use only the script above.
