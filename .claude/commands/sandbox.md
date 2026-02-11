---
description: Run code or scripts with Claude via omega-claude-cli headless script
argument-hint: '[prompt or @file ...]'
allowed-tools: Bash, Read
---

Use the **headless Claude Code CLI script** to run or test code with Claude.

1. Build the **prompt** from the user's input (e.g. "Create and run a Python script that processes CSV data" or "Test @script.py").
2. From the **project root**, run:
   ```bash
   node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT"
   ```
3. Return the script's output to the user.

If the user did not provide a prompt, ask what they want to run or test.

Do not use MCP; use only the script above.
