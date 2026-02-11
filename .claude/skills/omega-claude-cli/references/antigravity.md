# Antigravity IDE support

**Antigravity** is Google's AI-native IDE. Omega-claude-cli is available as a **workspace skill** so you can "ask Claude" (headless) from Antigravity.

## How it works

- Antigravity discovers skills from **`.agent/skills/`**.
- This repo includes **`.agent/skills/omega-claude-cli/`** with a `SKILL.md` that tells the agent when and how to run the headless Claude script.
- The agent uses the same scripts as the Claude and Codex skills: `.claude/skills/omega-claude-cli/scripts/ask-claude.mjs` and `verify-setup.mjs`.

## Requirements

**Node.js** 18+ and **Claude Code CLI** installed and authenticated. Verify from the project root:

```bash
node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs
```

## Copying to another project

1. Copy the **entire** `.claude` folder (skill + scripts).
2. Copy the **entire** `.agent` folder (so you have `.agent/skills/omega-claude-cli/SKILL.md`).
3. Open that project in Antigravity; the skill is discovered automatically.
