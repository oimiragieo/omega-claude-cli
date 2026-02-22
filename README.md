# Omega Claude CLI (portable skill for Codex, Cursor, Copilot, Antigravity, VS Code)

You get a **portable skill** so **Codex**, **Cursor**, **Copilot**, and others can use the **Claude Code CLI** in headless mode. You don't need an MCP server or MCP config. **The `.claude` folder is required.** It holds the scripts and skill that run Claude. The other folders (`.agents`, `.agent`, `.cursor`, `.vscode`) only tell each agent to use that skill; they don't work alone. Copy `.claude` first, then copy the folder for your agent if you use Codex, Antigravity, or VS Code.

## What this is

| Path                                 | Purpose                                                                                                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **.claude/skills/omega-claude-cli/** | Skill and headless scripts (`ask-claude.mjs`, `verify-setup.mjs`), plus docs for installation, auth, headless, codex, antigravity, vscode, copy-and-run. No MCP. |
| **.claude/commands/**                | Slash commands in Claude: /analyze, /sandbox, /brainstorm, /omega-claude, /omega-claude-setup.                                                                   |
| **.agents/skills/omega-claude-cli/** | Same headless workflow for **Codex CLI** (OpenAI).                                                                                                               |
| **.agent/skills/omega-claude-cli/**  | Same headless workflow for **Antigravity IDE** (Google).                                                                                                         |
| **.cursor/rules/**                   | Extra rules so **Cursor** uses the headless script when you say "ask Claude".                                                                                    |
| **.cursor/rules/**                   | Extra rules so **Cursor** uses the headless script when you say “ask Claude”.                                                                                    |
| **.vscode/tasks.json**               | **VS Code** tasks: Ask Claude, Verify setup.                                                                                                                     |
| **references/copilot-cli.md**        | **GitHub Copilot CLI** headless usage (`copilot -p "..."`, `COPILOT_MODEL`, PowerShell).                                                                         |

Everything runs with **Node** and the **Claude Code CLI** (e.g. `claude -p "..." --dangerously-skip-permissions`). No extra npm deps; no build step.

## Quick start (in a new project)

**1. Copy the skill into your project.**  
Copy the **entire** `.claude` folder into your project. **This folder is required.** The scripts (`ask-claude.mjs`, `verify-setup.mjs`) and skill instructions live here. The `.agents`, `.agent`, `.cursor`, and `.vscode` folders only point their agents at this skill; if you copy one of those without `.claude`, it won't work. Copying `.claude` alone is enough for Cursor and GitHub Copilot.

**2. Run setup once (only if needed).**  
You need **Node** to run the scripts either way; install it if you don't have it. Run the setup step only if you don't have the **Claude Code CLI** installed yet or haven't signed in. From the project root:

```bash
node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs
```

If you use an agent with slash commands, run **/omega-claude-setup** in the chat instead. When the script asks, install the Claude Code CLI and run `claude` in a terminal once to sign in.

**3. Use it.**

- **In your agent:** Say “ask Claude to analyze this” or use **/analyze**, **/brainstorm**, or **/sandbox**.
- **From a terminal:**  
  `node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Your prompt"`  
  See **Analyze and brainstorm** below for example prompts.

**Using Codex, Antigravity, or VS Code?** You still need **.claude** (step 1). Then copy the matching folder as well: **.agents** (Codex), **.agent** (Antigravity), **.vscode** (VS Code tasks). Details: [copy-and-run.md](.claude/skills/omega-claude-cli/references/copy-and-run.md).

## Analyze and brainstorm

From the **project root**, run the headless script with a prompt. In Claude use **/analyze** or **/brainstorm**; in Codex or Copilot say “ask Claude to analyze…” / “use Claude to brainstorm…”.

**Script (all surfaces):** The Claude Code CLI has three models: **Default** (Opus 4.6), **Sonnet** (4.5), **Haiku** (4.5). Omit `--model` for default, or use e.g. `--model sonnet` or `--model haiku`.

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT" [--model opus|sonnet|haiku] [--json] [--sandbox] [--timeout-ms 120000]
```

### Analyze

Use it for code or doc review, summaries, and Q&A. You can reference files in the prompt (e.g. “Summarize README.md” or “Review the scripts in .claude/skills/…”).

**Example (tested):**

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "List the main purpose of this project and its top-level folders in 3 short bullet points." [--model sonnet]
```

### Brainstorm

Use it for idea generation. Include the challenge and, if you want, a method (e.g. SCAMPER, design thinking) or domain.

**Example (tested):**

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Brainstorm 3 short ideas for improving a CLI tool's first-run experience. One sentence each." [--model sonnet]
```

### Sandbox

Add **`--sandbox`** to run or test code in Claude’s sandbox. In Claude use **/sandbox**; in Codex or Copilot say “ask Claude to run this code.”.

**Example (tested):**

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Run a simple Python one-liner: print('Hello')" --sandbox
```

Add `--json` for machine-readable output and `--timeout-ms` to cap runtime for automation. See [references/headless.md](.claude/skills/omega-claude-cli/references/headless.md).
Timeouts exit with code `124`.

## Headless CLI verification

From the project root you can run each agent’s CLI in headless (non-interactive) mode with a single prompt. The commands below assume that CLI is on your PATH.

| Agent                     | Headless command                                    | Notes                                                                                                                                                                                                                                                                                  |
| ------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude Code**           | `claude -p "PROMPT" --dangerously-skip-permissions` | Use the script for cross-platform invocation: `node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT"`.                                                                                                                                                                  |
| **Codex**                 | `codex exec "PROMPT"`                               | Non-interactive; can be slow when using tools (e.g. web search).                                                                                                                                                                                                                       |
| **Cursor**                | `cursor-agent -p "PROMPT"`                          | Cursor CLI in WSL (install: `curl https://cursor.com/install -fsS \| bash`). Use `-p` for headless. From Windows: `wsl bash -lc "cursor-agent -p 'PROMPT'"`.                                                                                                                           |
| **GitHub Copilot**        | `copilot -p "PROMPT"`                               | Install: `npm install -g @github/copilot`. Set `COPILOT_MODEL` for backend (e.g. `claude-sonnet-4.5`, `gpt-5`, `claude-3-5-sonnet`). PowerShell: `$env:COPILOT_MODEL="…"; copilot -p "…"`. See [references/copilot-cli.md](.claude/skills/omega-claude-cli/references/copilot-cli.md). |
| **Antigravity / VS Code** | —                                                   | No standalone headless CLI in PATH; use the IDE or Run Task/terminal.                                                                                                                                                                                                                  |

## Requirements

- **Node.js** 18+ to run the scripts.
- **Claude Code CLI** (e.g. `npm install -g @anthropic-ai/claude-code`) and one-time sign-in if prompted.

## Repository contents

| Path             | Purpose                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `.claude/`       | **Required.** Skill, commands, and headless scripts. All other agent folders depend on this. |
| `.agents/`       | Codex CLI skill; tells Codex to use the scripts in `.claude/`.                               |
| `.agent/`        | Antigravity IDE skill; tells Antigravity to use the scripts in `.claude/`.                   |
| `.cursor/rules/` | Cursor IDE rules; Cursor also reads `.claude/skills/`.                                       |
| `.vscode/`       | VS Code tasks (Ask Claude, Verify setup); runs the script in `.claude/`.                     |
| `README.md`      | This file.                                                                                   |
| `CHANGELOG.md`   | Version history.                                                                             |
| `LICENSE`        | License terms.                                                                               |

No MCP server. The skill doesn't depend on any npm packages; a **package.json** exists for development (lint, format, tests). Scripts live under `.claude/skills/omega-claude-cli/scripts/` and are shared by Claude, Codex, Copilot, and Antigravity. **Tests:** `npm test` (Node 18+). **CI:** GitHub Actions runs tests and lint on push/PR.

## Resources (Agent Skills docs)

- **[Claude Code — Extend Claude with skills](https://code.claude.com/docs/en/skills)**
- **[Cursor — Agent Skills](https://cursor.com/docs/context/skills)**
- **[GitHub Copilot — About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills#creating-and-adding-skills)** (Copilot coding agent, Copilot CLI, VS Code Insiders)
- **[VS Code — Use Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)**
- **[Codex — Agent Skills](https://developers.openai.com/codex/skills/)**

## License

[MIT License (Non-Commercial)](LICENSE). Commercial use prohibited without prior written permission from the copyright holder.

**Disclaimer:** Unofficial, third-party tool. Not affiliated with, endorsed by, or sponsored by Anthropic.
