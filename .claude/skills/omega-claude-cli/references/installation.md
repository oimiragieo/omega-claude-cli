# Installation and configuration (omega-claude-cli)

Omega-claude-cli uses the **Claude Code CLI in headless mode**. No MCP server or MCP configuration is required.

## Quick setup (after copying .claude)

1. Run **/omega-claude-setup** in your agent, or
2. From the project root run: `node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs`
3. If Node or Claude Code CLI is missing, install them (see Prerequisites). Complete one-time auth if prompted (see [auth.md](auth.md)).

## Prerequisites

1. **Node.js** (v18 or higher): [nodejs.org](https://nodejs.org).
2. **Claude Code CLI** installed: [code.claude.com](https://code.claude.com) or npm.

Install Claude Code CLI:

```bash
npm install -g @anthropic-ai/claude-code
```

Or use it via npx (no global install):

```bash
npx @anthropic-ai/claude-code -p "Your prompt" --dangerously-skip-permissions
```

## Verify installation

From the project root:

```bash
node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs
```

Then run the headless script once to confirm:

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Say hello"
```

## One-time auth

Run `claude` (or `npx @anthropic-ai/claude-code`) in a terminal and complete sign-in when prompted. See [auth.md](auth.md).
