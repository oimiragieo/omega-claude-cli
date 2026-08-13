> ## Documentation Index
>
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
>
> Use this file to discover all available pages before exploring further.

# Run Claude Code programmatically

> Use the Agent SDK to run Claude Code programmatically from the CLI, Python, or TypeScript.

**Offline snapshot:** Verified against https://code.claude.com/docs/en/headless on **2026-08-13**. Prefer the live page if anything here disagrees.

The [Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) gives you the same tools, agent loop, and context management that power Claude Code. It's available as a CLI for scripts and CI/CD, or as [Python](https://code.claude.com/docs/en/agent-sdk/python) and [TypeScript](https://code.claude.com/docs/en/agent-sdk/typescript) packages for full programmatic control.

To run Claude Code in non-interactive mode, pass `-p` with your prompt and the [CLI options](https://code.claude.com/docs/en/cli-reference) you need:

```bash
claude -p "Find and fix the bug in auth.py" --allowedTools "Read,Edit,Bash"
```

This page covers using the Agent SDK via the CLI (`claude -p`). For the Python and TypeScript SDK packages, see the [full Agent SDK documentation](https://code.claude.com/docs/en/agent-sdk/overview).

## Basic usage

Add the `-p` (or `--print`) flag to any `claude` command to run it non-interactively. Not every CLI option combines with `-p`. Options you'll combine with `-p` often include:

* `--continue` for continuing conversations
* `--allowedTools` for auto-approving tools
* `--output-format` for structured output

```bash
claude -p "What does the auth module do?"
```

Claude Code exits with code 0 on success and a non-zero code when the run fails.

### Start faster with bare mode

Add `--bare` to reduce startup time by skipping auto-discovery of hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md. Bare mode is useful for CI and scripts where you need the same result on every machine.

```bash
claude --bare -p "Summarize README.md" --allowedTools "Read"
```

In bare mode, Claude Code never reads OAuth credentials or the system keychain. For the Anthropic API, set `ANTHROPIC_API_KEY` in the environment. `--bare` is the recommended mode for scripted and SDK calls, and will become the default for `-p` in a future release.

**Note for omega-claude-cli:** the wrapper currently invokes `claude -p … --dangerously-skip-permissions` (optional `--model`, `--output-format json`, sandbox). It does not pass `--bare` by default.

### Get structured output

Use `--output-format` to control how responses are returned:

* `text` (default): plain text output
* `json`: structured JSON with `result`, session ID, and metadata
* `stream-json`: newline-delimited JSON for real-time streaming

omega-claude-cli's `--json` flag requests CLI JSON and prints the `.result` text field (with legacy `.response` fallback).

### Pipe data through Claude

```bash
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

Piped stdin is capped at **10MB** by the Claude Code CLI. (omega-claude-cli's wrapper applies its own default stdin guard of 50MB before spawning the CLI.)

## See also

* Live docs: https://code.claude.com/docs/en/headless
* CLI reference: https://code.claude.com/docs/en/cli-reference
* omega-claude-cli headless guide: `.claude/skills/omega-claude-cli/references/headless.md`
