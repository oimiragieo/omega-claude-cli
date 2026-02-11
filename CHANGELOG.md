# Changelog

## [Unreleased]

- **ask-claude hardening**: Removed shell-based Windows invocation; now uses direct process spawning with Windows/non-Windows executable fallback (`claude(.cmd)` then `npx @anthropic-ai/claude-code`).
- **New flags**: Added `--sandbox`, `--timeout-ms`, and `--help` support in `ask-claude.mjs`.
- **Validation**: Added strict CLI option parsing with clear errors for unknown options and invalid/missing values.
- **Tests**: Added `tests/ask-claude.test.mjs` for argument parsing and command construction; `npm test` now runs both test suites.
- **Docs sync**: Updated README and headless skill docs to reflect supported flags and runtime behavior.

## 2.0.0 — Portable headless skill (no MCP)

- **Headless-only**: Portable `.claude` skill that runs the Claude Code CLI in headless mode via scripts. No MCP server or MCP configuration required.
- **Scripts**: Added `ask-claude.mjs` (prompt, `--model`, `--json`) and `verify-setup.mjs` (Node + Claude Code CLI check).
- **Commands**: /analyze, /sandbox, /brainstorm, /omega-claude, /omega-claude-setup—all invoke the headless script or verify-setup from the project root.
- **References**: installation, auth, headless, copy-and-run, cursor, codex, antigravity, vscode, copilot-cli.
- **Copy-and-run**: Documented what to copy (`.claude` and optionally `.cursor`, `.agents`, `.agent`, `.vscode`) and that paths are relative to the project root.
