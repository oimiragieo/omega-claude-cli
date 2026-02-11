# Codex CLI support

Omega-claude-cli is available as a **Codex Agent Skill**, so you can "ask Claude" from **Codex** (OpenAI's terminal coding agent).

## Using it in Codex

1. Open this project (or a project that has copied both `.claude` and `.agents`) and run **Codex** from the project root.
2. When you want Claude's help, say e.g. "ask Claude to review this file" or "use Claude to brainstorm ideas". Codex will match the **omega-claude-cli** skill and run the headless script.
3. You can also invoke the skill explicitly: type **$** or use **/skills** and choose **omega-claude-cli**.

## Requirements

**Node.js** 18+ and **Claude Code CLI** installed and authenticated. Run from project root to verify:

```bash
node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs
```

## Copying to another project

1. Copy the **entire** `.claude` folder (skill + commands + scripts).
2. Copy the **entire** `.agents` folder (so you have `.agents/skills/omega-claude-cli/SKILL.md`).
3. Run from that project's root; run the verify-setup script once if needed.

Codex picks up the skill from `.agents/skills`; both use the same headless scripts under `.claude/skills/omega-claude-cli/scripts/`.
