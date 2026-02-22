# Changelog

## [Unreleased]

- **Code cleanup**: Removed `shell-escape.mjs` and `tests/shell-escape.test.mjs` — dead code never imported by `ask-claude.mjs`.
- **New scripts**: `parse-args.mjs` (pure arg parser, exported for testing) and `format-output.mjs` (pure JSON extractor, exported for testing). Both split from `ask-claude.mjs` to enable isolated unit testing without spawning processes.
- **Tests**: Added `tests/ask-claude.integration.test.mjs` to verify end-to-end `ask-claude.mjs` behavior with a stub Claude CLI (flag forwarding, JSON envelope behavior, warning on invalid JSON, and non-zero exit propagation).
- **Tooling**: Updated `npm test` to run all `tests/*.test.mjs`; added `test:ci` and `changelog:check` scripts.
- **CI**: Added `scripts/check-changelog.mjs` to enforce changelog policy on every push/PR.

- **ask-claude hardening**: Removed shell-based Windows invocation; now uses direct process spawning with Windows/non-Windows executable fallback (`claude(.cmd)` then `npx @anthropic-ai/claude-code`).
- **New flags**: Added `--sandbox`, `--timeout-ms`, and `--help` support in `ask-claude.mjs`.
- **Validation**: Added strict CLI option parsing with clear errors for unknown options and invalid/missing values.
- **Tests**: Added `tests/ask-claude.test.mjs` for argument parsing and command construction; `npm test` now runs both test suites.
- **Docs sync**: Updated README and headless skill docs to reflect supported flags and runtime behavior.
- **Reliability docs**: Added explicit failure-handling guidance for host shell runtime errors (for example `@lydell/node-pty` on Windows) and documented troubleshooting steps in `references/installation.md`.
- **Input safety**: Added stdin size guard in `ask-claude.mjs` (default 50 MB, configurable via `ASK_CLAUDE_MAX_STDIN_BYTES`) to prevent unbounded memory use.
- **Timeout behavior**: Hardened Windows timeout termination path to wait for `taskkill` completion before finalizing process result; timeout remains exit code `124`.
- **Validation**: `--model` now validates and normalizes to `opus|sonnet|haiku` in `parse-args.mjs`.
- **Tests**: Added integration coverage for timeout exit (`124`) and stdin limit rejection; added unit tests for model validation/normalization.
- **Docs**: Updated README/headless docs to include explicit timeout exit code behavior and full supported model list.
- **Skill docs**: Reduced `.agents/skills/omega-claude-cli/SKILL.md` duplication by delegating to canonical `.claude/skills/omega-claude-cli/SKILL.md`.

## 2.0.0 — Portable headless skill (no MCP)

- **Headless-only**: Portable `.claude` skill that runs the Claude Code CLI in headless mode via scripts. No MCP server or MCP configuration required.
- **Scripts**: Added `ask-claude.mjs` (prompt, `--model`, `--json`) and `verify-setup.mjs` (Node + Claude Code CLI check).
- **Commands**: /analyze, /sandbox, /brainstorm, /omega-claude, /omega-claude-setup—all invoke the headless script or verify-setup from the project root.
- **References**: installation, auth, headless, copy-and-run, cursor, codex, antigravity, vscode, copilot-cli.
- **Copy-and-run**: Documented what to copy (`.claude` and optionally `.cursor`, `.agents`, `.agent`, `.vscode`) and that paths are relative to the project root.
