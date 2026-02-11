# VS Code and omega-claude-cli

The skill at **`.claude/skills/omega-claude-cli/`** is discovered from `.claude/skills/`. From the project root run:

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT"
```

**Run Task:** If the project has `.vscode/tasks.json` with an "Ask Claude" task, use Terminal then Run Task. The task should call the script above.

**Terminal:** Run the command above from the workspace root. Requires Node.js and Claude Code CLI (run /omega-claude-setup or verify-setup.mjs).
