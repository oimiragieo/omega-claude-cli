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

## Troubleshooting

### `@lydell/node-pty` missing binary (`conpty.node`) on Windows

If your host agent fails all shell commands with an error like:
`The @lydell/node-pty package could not find ... @lydell/node-pty-win32-x64/conpty.node`,
the issue is with the host CLI runtime, not this skill script.

Try:

1. Reinstall the host CLI without omitting optional dependencies.
2. Ensure `node_modules` was not copied from WSL/Linux/macOS onto Windows.
3. Reinstall dependencies on the current OS (`npm ci` or `npm install`).
4. Update installed extensions (for Gemini CLI: `/extensions update ...`).
5. Retry:
   - `node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs`
   - `node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "Say hello"`

If these two commands succeed in a normal terminal but fail inside the agent shell tool, repair/reinstall the host agent CLI runtime.
