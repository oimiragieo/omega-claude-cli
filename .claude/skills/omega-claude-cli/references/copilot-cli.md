# GitHub Copilot CLI (headless)

The **GitHub Copilot CLI** (`copilot`) runs as a headless agent from the terminal. You can set **`COPILOT_MODEL`** to use Claude or other backends.

**Agent Skills** (including omega-claude-cli) work with Copilot. Copilot discovers project skills from **`.github/skills`** or **`.claude/skills`**. This repo stores the skill at **`.claude/skills/omega-claude-cli/`**.

## Install

```bash
npm install -g @github/copilot
```

## Headless (print mode)

```bash
copilot -p "Your prompt here"
```

## Selecting a model

Set **`COPILOT_MODEL`** (e.g. `claude-sonnet-4.5`, `gpt-5`, `claude-3-5-sonnet`). PowerShell:

```powershell
$env:COPILOT_MODEL="claude-sonnet-4.5"; copilot -p "Your prompt here"
```

## Relation to omega-claude-cli

This repo's **omega-claude-cli** skill uses the **Claude Code CLI** headless script (`ask-claude.mjs`). The **Copilot CLI** is a separate headless agent that can use Claude (or other models) via `COPILOT_MODEL`. Use omega-claude-cli when you want "ask Claude" from Codex, Cursor, or VS Code via the Claude Code CLI script.
