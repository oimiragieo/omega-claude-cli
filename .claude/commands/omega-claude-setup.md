---
description: Verify omega-claude-cli headless setup (Node, Claude Code CLI). No MCP required.
allowed-tools: Bash, Read
---

Run the omega-claude-cli headless setup so that "ask Claude" works via CLI scripts (no MCP).

1. **Run the verification script** from the project root (where .claude lives):

   ```bash
   node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs
   ```

   If the script is not at that path, find the workspace root that contains `.claude/skills/omega-claude-cli/scripts/verify-setup.mjs` and run it from there.

2. **If Node is missing or too old**: Tell the user to install Node 18+ from https://nodejs.org and try again.

3. **If Claude Code CLI is missing**: Tell the user to install it (e.g. `npm install -g @anthropic-ai/claude-code`) or follow `.claude/skills/omega-claude-cli/references/installation.md`, then run the verification script again.

4. **Auth**: Remind the user that one-time sign-in may be required. They should run `claude` (or `npx @anthropic-ai/claude-code`) in a terminal once and complete sign-in if prompted. Point to `.claude/skills/omega-claude-cli/references/auth.md` for auth issues.

No MCP configuration is needed. The headless script `scripts/ask-claude.mjs` will run Claude. Summarize the verification output for the user and any remaining steps (install Claude Code CLI, complete auth).
