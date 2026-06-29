# Headless mode (Claude Code CLI)

Omega-claude-cli uses the **Claude Code CLI in headless mode** so you can run Claude from scripts and other agents without any MCP server. No MCP configuration is required.

## Overview

Headless mode:

- Accepts prompts via command line or stdin
- Returns text or JSON
- Works in automation and with the scripts in this skill

The wrapper strips `CLAUDECODE` from the child process environment, so nested calls from inside Claude Code work without manual `env -u CLAUDECODE`.

## Basic usage

### Direct prompt

```bash
claude -p "What is machine learning?" --dangerously-skip-permissions
```

### With our script

From the project root (where `.claude` lives):

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "What is machine learning?"
```

The script runs `claude` if it's on your PATH; if not, it can fall back to `npx -y @anthropic-ai/claude-code`.

Options:

- `--model MODEL` — optional. CLI aliases: **opus** (4.8), **sonnet** (4.6), **haiku** (4.5), **fable** (5), **best**, **opusplan**, **sonnet[1m]**, **opus[1m]**, or a full `claude-*` model ID. Omit to use your account's CLI default.
- `--json` — output as JSON; script prints the `.result` text field from the CLI envelope
- `--sandbox` — run the prompt in Claude sandbox mode
- `--timeout-ms N` — fail fast in automation if Claude takes too long
- Exit codes: `0` success, `1` error, `124` timeout

### Stdin

```bash
echo "Explain this code" | node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs
```

## Configuration options (CLI)

| Option                           | Description                             | Example                                            |
| -------------------------------- | --------------------------------------- | -------------------------------------------------- |
| `--prompt`, `-p`                 | Headless prompt                         | `claude -p "query"`                                |
| `--dangerously-skip-permissions` | Non-interactive / YOLO                  | `claude -p "query" --dangerously-skip-permissions` |
| `--model`                        | Model alias or full ID                  | `claude -p "query" --model sonnet`                 |
| `--sandbox`                      | Sandbox mode for code execution/testing | `claude -p "run this test" --sandbox`              |

## Resources

- [Claude Code headless](https://code.claude.com/docs/en/headless) — CLI and Agent SDK
- [Model configuration](https://code.claude.com/docs/en/model-config) — aliases and pinned IDs
- [Authentication](auth.md) — sign-in
