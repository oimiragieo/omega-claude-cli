# Cursor IDE and Agent Skills

Cursor discovers skills from **`.claude/skills/`**. This repo has the skill at **`.claude/skills/omega-claude-cli/`**, so Cursor discovers it with no extra setup.

From the project root, run:

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT"
```

Optional: copy **`.cursor/rules/omega-claude-cli.mdc`** and **omega-claude-tools.mdc** into another project. Copy the entire `.claude` folder to use the skill elsewhere.
