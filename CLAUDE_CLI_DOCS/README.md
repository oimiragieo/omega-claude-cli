# Claude Code CLI docs (offline snapshot)

This folder is an **offline reference mirror** of [Claude Code documentation](https://code.claude.com/docs). It is **not** the source of truth for model names, aliases, or CLI behavior.

**Snapshot note:** Key pages last verified against live docs via Exa on **2026-08-13**. Alias resolutions change by provider and Claude Code version. Prefer live docs:

- [Model configuration](https://code.claude.com/docs/en/model-config) — aliases (`opus`, `sonnet`, `haiku`, `fable`, `best`, `opusplan`, `sonnet[1m]`, `opus[1m]`) and provider resolution table
- [CLI reference](https://code.claude.com/docs/en/cli-reference)
- [Headless / Agent SDK](https://code.claude.com/docs/en/headless)
- [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview)

**Anthropic API (Aug 2026):** `opus` → Opus 5, `sonnet` → Sonnet 5, `haiku` → Haiku 4.5, `fable` → Fable 5. Other providers may still resolve `opus`/`sonnet` to 4.x versions — see the live provider table.

To refresh: fetch the index at `https://code.claude.com/docs/llms.txt` and update the relevant pages.

The **omega-claude-cli** skill docs (`README.md`, `.claude/skills/omega-claude-cli/`) are maintained separately and track the headless wrapper behavior.
