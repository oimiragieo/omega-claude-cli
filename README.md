# Omega Claude CLI

> Portable headless skill for running Claude Code CLI from Cursor, Codex, Copilot, Antigravity, and VS Code — no MCP server required.

A zero-dependency Node.js wrapper that lets any agent platform invoke **Claude Code CLI** in non-interactive mode. Copy one folder into your project, run one verification step, and every supported agent surface can call Claude headlessly for analysis, brainstorming, and sandbox code execution.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Reference](#cli-reference)
- [Configuration](#configuration)
- [Integration Guides](#integration-guides)
- [Deploying to Another Project](#deploying-to-another-project)
- [Usage Examples](#usage-examples)
- [Slash Commands](#slash-commands)
- [Development](#development)
- [Repository Structure](#repository-structure)
- [Resources](#resources)
- [License](#license)

---

## Features

- **Headless execution** — runs `claude -p "…" --dangerously-skip-permissions` non-interactively
- **Cross-platform** — Windows (`cmd.exe` wrapper) and Unix/macOS (direct spawn) handled automatically
- **Automatic fallback** — tries global `claude` binary, falls back to `npx @anthropic-ai/claude-code` if not found
- **Model selection** — Opus 4.6 (default), Sonnet 4.5, Haiku 4.5, or any full `claude-*` model ID
- **JSON output** — machine-readable `{"response":"…"}` envelope for automation pipelines
- **Sandbox mode** — runs code in Claude's sandboxed execution environment
- **Timeout control** — wrapper-side `--timeout-ms` with exit code `124` on expiry
- **Stdin support** — pipe large prompts from files or other commands (50 MB default limit)
- **Zero runtime dependencies** — pure Node.js stdlib; no `npm install` needed to run
- **Multi-surface** — same script shared by Claude Code, Cursor, Codex, Copilot, Antigravity, and VS Code

---

## Prerequisites

| Requirement     | Minimum version | Install                                    |
| --------------- | --------------- | ------------------------------------------ |
| Node.js         | 18+             | [nodejs.org](https://nodejs.org)           |
| Claude Code CLI | latest          | `npm install -g @anthropic-ai/claude-code` |

Claude Code CLI requires a one-time sign-in. Run `claude` in a terminal and complete the interactive authentication; credentials are cached in `~/.claude/` and reused by all subsequent headless calls.

---

## Installation

### 1. Install Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
```

Or use without a global install — the wrapper automatically falls back to `npx -y @anthropic-ai/claude-code`.

### 2. One-time authentication

```bash
claude
# Complete the sign-in prompt. This only needs to happen once.
```

### 3. Copy the skill into your project

```bash
# From the omega-claude-cli repo root:
cp -r .claude /path/to/your-project/
```

The `.claude` folder is the **only required piece**. All other folders (`.agents`, `.agent`, `.cursor`, `.vscode`) are optional integration shims for specific platforms.

### 4. Verify the setup

```bash
cd /path/to/your-project
node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs
```

Expected output when everything is ready:

```
OK  Node: v20.11.1
OK  Claude Code CLI: found
Headless mode ready. Use scripts/ask-claude.mjs to run Claude.
```

---

## Quick Start

From your **project root** (the directory containing `.claude`):

```bash
# Ask Claude a question
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Summarize this repository in three bullet points"

# Review a file
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Review src/index.js for potential bugs"

# Generate ideas
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Brainstorm 5 ways to improve CLI onboarding" --model sonnet

# Run code in Claude's sandbox
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Run this Python: print('Hello, Claude')" --sandbox
```

---

## CLI Reference

### Syntax

```
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "PROMPT" [OPTIONS]
```

The `PROMPT` argument is required unless you are piping input from stdin.

### Options

| Option         | Short | Type                | Default    | Description                                                                                     |
| -------------- | ----- | ------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| `PROMPT`       | —     | string (positional) | required   | The question or task for Claude.                                                                |
| `--model`      | `-m`  | string              | `opus`     | Model to use: `opus` (4.6), `sonnet` (4.5), `haiku` (4.5), or a full `claude-*` model ID.       |
| `--json`       | —     | boolean             | `false`    | Return a JSON envelope `{"response":"…"}` instead of plain text.                                |
| `--sandbox`    | —     | boolean             | `false`    | Execute code inside Claude's sandbox environment.                                               |
| `--timeout-ms` | —     | integer             | `0` (none) | Abort after N milliseconds. Exit code `124` on timeout. Must be a positive integer.             |
| `--help`       | `-h`  | boolean             | `false`    | Print usage and exit.                                                                           |
| `--`           | —     | sentinel            | —          | Everything after `--` is treated as part of the prompt. Useful when the prompt starts with `-`. |

### Input methods

```bash
# Positional argument (most common)
node ask-claude.mjs "Your prompt here"

# Stdin pipe
echo "Your prompt" | node ask-claude.mjs

# Pipe a file
cat src/main.js | node ask-claude.mjs "Review this code for security issues"

# Prompt containing flag-like text
node ask-claude.mjs -- --this-is-not-a-flag but-it-is-the-prompt
```

### Direct CLI equivalent

The wrapper runs the following under the hood:

```bash
claude -p "PROMPT" --dangerously-skip-permissions
# With optional additions:
#   --model sonnet
#   --output-format json
```

### Exit codes

| Code  | Meaning                                                 |
| ----- | ------------------------------------------------------- |
| `0`   | Success                                                 |
| `1`   | Error (CLI not found, invalid arguments, parse failure) |
| `124` | Timeout (`--timeout-ms` exceeded)                       |

---

## Configuration

### Environment variables

| Variable                     | Default            | Description                                                                                                                                          |
| ---------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ASK_CLAUDE_MAX_STDIN_BYTES` | `52428800` (50 MB) | Maximum bytes accepted from stdin. Prompts exceeding this limit are rejected with exit code `1`. Set to a higher value when piping very large files. |

**Internal variable (do not set manually):**

| Variable     | Description                                                                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDECODE` | Set by the Claude Code CLI when running inside an active session. If present, `ask-claude.mjs` exits with an error because nested headless calls are not supported. Use the direct CLI pattern below instead. |

**Nested-session workaround** — when `CLAUDECODE` is already set (i.e., you are inside a Claude Code session and want to call Claude headlessly), use the raw CLI directly:

```bash
env -u CLAUDECODE claude --dangerously-skip-permissions -p "YOUR PROMPT"
```

---

## Integration Guides

### Claude Code

Claude Code automatically discovers `.claude/skills/`. Use the built-in slash commands:

```
/analyze    Review this README for completeness
/brainstorm 5 ideas for improving developer onboarding
/sandbox    Run this Python snippet: print("hello")
/omega-claude-setup
```

Or invoke the script directly from a Claude Code task prompt:

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "YOUR PROMPT"
```

### Cursor IDE

Cursor reads `.claude/skills/` automatically. The `.cursor/rules/` files additionally route natural-language requests through the headless script.

1. Copy `.claude/` and `.cursor/` into your project.
2. In the Cursor agent, say: **"ask Claude to review this file"** — Cursor routes the request to `ask-claude.mjs`.
3. Or use the slash commands if the Claude Code extension is also active.

### Codex CLI (OpenAI)

Codex discovers skills under `.agents/skills/`.

1. Copy `.claude/` and `.agents/` into your project.
2. Run: `codex exec "ask Claude to summarize this project"` — Codex delegates to `ask-claude.mjs`.

Direct headless call for comparison:

```bash
codex exec "PROMPT"
```

### GitHub Copilot CLI

Copilot CLI supports headless runs with `copilot -p "…"`. Use `COPILOT_MODEL` to select a backend:

```bash
# Use Claude as the Copilot backend
COPILOT_MODEL="claude-sonnet-4.5" copilot -p "Review this function for bugs"

# PowerShell
$env:COPILOT_MODEL="claude-sonnet-4.5"; copilot -p "Review this function for bugs"
```

See [references/copilot-cli.md](.claude/skills/omega-claude-cli/references/copilot-cli.md) for the full Copilot CLI reference.

### Antigravity IDE

Antigravity discovers skills under `.agent/skills/`.

1. Copy `.claude/` and `.agent/` into your project.
2. Use natural language in the Antigravity agent: **"use Claude to analyze the auth module"** — Antigravity runs `ask-claude.mjs`.

### VS Code

Two tasks are included in `.vscode/tasks.json`:

1. Copy `.claude/` and `.vscode/` into your project.
2. Open the Command Palette → **Tasks: Run Task**.
3. Select **Ask Claude** — enter a prompt when prompted. Output appears in the integrated terminal.
4. Select **Omega Claude: Verify setup** to check Node and CLI availability.

Direct headless call from any terminal:

```bash
claude -p "PROMPT" --dangerously-skip-permissions
```

---

## Deploying to Another Project

### Minimum (required for all platforms)

```bash
cp -r omega-claude-cli/.claude /path/to/target-project/
```

This alone is sufficient for **Claude Code**, **Cursor**, and **GitHub Copilot CLI**.

### Full suite (optional, platform-specific)

```bash
# Codex CLI
cp -r omega-claude-cli/.agents /path/to/target-project/

# Antigravity IDE
cp -r omega-claude-cli/.agent /path/to/target-project/

# VS Code tasks
cp -r omega-claude-cli/.vscode /path/to/target-project/
```

After copying, run the verification script from the target project root:

```bash
cd /path/to/target-project
node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs
```

All script paths are resolved relative to the directory where you invoke Node, so the skill is portable without any path adjustments.

---

## Usage Examples

### Analysis and code review

```bash
# Summarize a project
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "List the main purpose of this project and its top-level folders in 3 short bullet points."

# Review a specific file
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Review src/auth.js for security vulnerabilities and suggest fixes."

# Compare two approaches
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Compare REST vs GraphQL for this use case: a real-time dashboard with 10 data sources." \
  --model sonnet
```

### Brainstorming

```bash
# General brainstorm
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Brainstorm 5 ways to improve a CLI tool's first-run experience. One sentence each."

# With a methodology
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Use SCAMPER to generate ideas for improving our onboarding flow."

# Domain-specific
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Generate 3 API design patterns for a high-throughput event ingestion service."
```

### Sandbox code execution

```bash
# Run a Python one-liner
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Run this Python one-liner: print('Hello from Claude sandbox')" \
  --sandbox

# Test a script
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Run and test this sorting algorithm: def bubble_sort(arr): ..." \
  --sandbox
```

### Model selection

```bash
# Opus (default) — most capable
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Deep architectural analysis"

# Sonnet — balanced speed and quality
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Summarize this PR diff" --model sonnet

# Haiku — fastest, lowest cost
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Tag this log line as error/warn/info" --model haiku

# Full model ID
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Explain this concept" --model claude-sonnet-4-5-20251022
```

### JSON output for automation

```bash
# Returns {"response":"..."}
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Extract all function names from this file" \
  --json

# Parse with jq
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Summarize in one sentence" \
  --json | jq -r '.response'
```

### Stdin input

```bash
# Pipe a file for review
cat README.md | node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "What sections are missing from this README?"

# Generate a commit message from a diff
git diff --cached | node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Write a concise conventional commit message for these changes."

# Limit stdin size for large files
ASK_CLAUDE_MAX_STDIN_BYTES=104857600 \
  cat large-schema.sql | node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Identify tables without a primary key."
```

### GitHub Actions CI/CD integration

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'

- name: Install Claude Code CLI
  run: npm install -g @anthropic-ai/claude-code

- name: Verify setup
  run: node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs

- name: Run AI code review
  run: |
    node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
      "Review the PR diff for security issues and breaking changes" \
      --model sonnet \
      --json
```

### Timeout for CI/CD

```bash
# Fail fast after 30 seconds
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Validate this config file" \
  --timeout-ms 30000

# Check exit code
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "..." --timeout-ms 10000
if [ $? -eq 124 ]; then echo "Claude timed out"; fi
```

### Combining options

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs \
  "Analyze this codebase and list the top 3 security risks" \
  --model sonnet \
  --json \
  --timeout-ms 60000
```

---

## Slash Commands

When using **Claude Code**, the following slash commands are available:

| Command                                          | Description                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `/analyze [prompt or @file …]`                   | Analyze files or answer questions with Claude. Supports `@file` references.       |
| `/brainstorm [challenge] [methodology] [domain]` | Generate ideas. Optionally specify a method (SCAMPER, design thinking) or domain. |
| `/sandbox [prompt or @file …]`                   | Run or test code in Claude's sandbox.                                             |
| `/omega-claude [request]`                        | Flexible entry point: routes to analysis or brainstorm as appropriate.            |
| `/omega-claude-setup`                            | Verify Node.js and Claude Code CLI are installed and authenticated.               |

---

## Development

### Running tests

```bash
npm test
```

Tests are written for the Node.js native test runner (`node:test`). Coverage includes:

- **Unit tests** (`tests/ask-claude.test.mjs`) — argument parsing, command construction, model normalization, platform-specific executable selection.
- **Integration tests** (`tests/ask-claude.integration.test.mjs`) — end-to-end spawning with a stub Claude CLI, timeout handling (exit code `124`), stdin forwarding, JSON envelope extraction, non-zero exit propagation.

### CI gate

```bash
npm run test:ci
# Runs: tests + eslint + prettier check + changelog format check
```

### Linting and formatting

```bash
npm run lint:fix   # ESLint with auto-fix
npm run format     # Prettier (in-place)
npm run format:check  # Prettier (check only, used in CI)
```

### GitHub Actions

The CI workflow runs on push and pull requests against Node.js **20**.

### Changelog policy

Every pull request must add at least one entry under `## [Unreleased]` in `CHANGELOG.md`. CI enforces this:

```bash
npm run changelog:check
```

### GitHub Actions

The CI workflow runs on push and pull requests against Node.js **20**.

---

## Repository Structure

```
omega-claude-cli/
├── .claude/                                  # Required — shared skill runtime
│   ├── commands/                             # Claude Code slash commands
│   │   ├── analyze.md
│   │   ├── brainstorm.md
│   │   ├── sandbox.md
│   │   ├── omega-claude.md
│   │   └── omega-claude-setup.md
│   └── skills/omega-claude-cli/
│       ├── SKILL.md                          # Skill definition and trigger rules
│       ├── scripts/
│       │   ├── ask-claude.mjs                # Main headless wrapper
│       │   ├── parse-args.mjs                # Pure CLI argument parser (exported)
│       │   ├── format-output.mjs             # JSON response extractor (exported)
│       │   └── verify-setup.mjs              # Node + CLI pre-flight check
│       └── references/                       # Reference documentation
│           ├── headless.md                   # Full headless CLI guide
│           ├── installation.md               # Node + Claude Code CLI setup
│           ├── auth.md                       # Authentication troubleshooting
│           ├── copy-and-run.md               # Portability guide
│           ├── cursor.md                     # Cursor IDE integration
│           ├── codex.md                      # Codex CLI integration
│           ├── antigravity.md                # Antigravity IDE integration
│           ├── copilot-cli.md                # GitHub Copilot CLI guide
│           └── vscode.md                     # VS Code tasks guide
├── .agents/skills/omega-claude-cli/          # Codex CLI skill entrypoint
├── .agent/skills/omega-claude-cli/           # Antigravity IDE skill entrypoint
├── .cursor/rules/                            # Cursor routing rules
│   ├── omega-claude-cli.mdc
│   └── omega-claude-tools.mdc
├── .vscode/tasks.json                        # VS Code Ask/Verify tasks
├── tests/
│   ├── ask-claude.test.mjs                   # Unit tests
│   └── ask-claude.integration.test.mjs       # Integration tests
├── scripts/
│   └── check-changelog.mjs                   # CI changelog validator
├── package.json
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## Resources

- [Claude Code — Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Cursor — Agent Skills](https://cursor.com/docs/context/skills)
- [GitHub Copilot — About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [VS Code — Use Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Codex — Agent Skills](https://developers.openai.com/codex/skills/)

---

## License

[MIT License (Non-Commercial)](LICENSE). Commercial use requires prior written permission from the copyright holder.

**Disclaimer:** Unofficial, third-party tool. Not affiliated with, endorsed by, or sponsored by Anthropic.
