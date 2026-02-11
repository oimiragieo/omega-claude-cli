# Auth and troubleshooting (omega-claude-cli)

## One-time auth

The Claude Code CLI may require sign-in. In a terminal, run:

```bash
claude
```

or, if not installed globally:

```bash
npx @anthropic-ai/claude-code
```

Complete sign-in when prompted. After that, the headless script can use Claude without asking again on this machine.

## Script fails or "claude not found"

If the headless script fails or reports that the claude command is not found:

1. Run **/omega-claude-setup** in your agent, or
2. From the project root run: `node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs`
3. Install Claude Code CLI if needed: `npm install -g @anthropic-ai/claude-code`. Ensure it is on your PATH (e.g. run `claude --version`).

## Official docs

- [Claude Code](https://code.claude.com) — install and headless
- [Anthropic](https://anthropic.com) — API and products
