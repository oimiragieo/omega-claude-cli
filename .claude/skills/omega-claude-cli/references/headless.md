# Headless mode (Claude Code CLI)

Omega-claude-cli uses the **Claude Code CLI in headless mode** so you can run Claude from scripts and other agents without any MCP server. No MCP configuration is required.

## Overview

Headless mode:

- Accepts prompts via command line or stdin
- Returns text or JSON
- Works in automation and with the scripts in this skill

## Basic usage

### Direct prompt

```bash
claude -p "What is machine learning?" --dangerously-skip-permissions
```

### With our script (no MCP)

From the project root (where `.claude` lives):

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "What is machine learning?"
```

The script runs `claude` if it's on your PATH; if not, it can fall back to `npx -y @anthropic-ai/claude-code`.

Options:

- `--model MODEL` — optional. The CLI has three models: **Default** (Opus 4.6, recommended), **Sonnet** (Sonnet 4.5), **Haiku** (Haiku 4.5). Use e.g. `--model sonnet` or `--model haiku` to override the default.
- `--json` — output as JSON (script prints the `.response` field if present)
- `--sandbox` — run the prompt in Claude sandbox mode
- `--timeout-ms N` — fail fast in automation if Claude takes too long

### Stdin

```bash
echo "Explain this code" | node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs
```

## Configuration options (CLI)

| Option                           | Description                                | Example                                            |
| -------------------------------- | ------------------------------------------ | -------------------------------------------------- |
| `--prompt`, `-p`                 | Headless prompt                            | `claude -p "query"`                                |
| `--dangerously-skip-permissions` | Non-interactive / YOLO                     | `claude -p "query" --dangerously-skip-permissions` |
| `--model`                        | Model (sonnet, haiku; default is Opus 4.6) | `claude -p "query" --model sonnet`                 |
| `--sandbox`                      | Sandbox mode for code execution/testing    | `claude -p "run this test" --sandbox`              |

## Resources

- [Claude Code headless](https://code.claude.com/docs/en/headless) — CLI and Agent SDK
- [Authentication](auth.md) — sign-in
