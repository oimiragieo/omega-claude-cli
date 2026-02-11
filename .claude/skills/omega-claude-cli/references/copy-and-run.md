# Copy and run (portable setup)

To use omega-claude-cli in another project with no MCP, copy the right folders and run from the **project root**.

## What to copy

**Minimum (skill only):**

- Copy the **entire** `.claude/skills/omega-claude-cli` folder into the target project so you have:
  - `TARGET_PROJECT/.claude/skills/omega-claude-cli/SKILL.md`
  - `TARGET_PROJECT/.claude/skills/omega-claude-cli/scripts/ask-claude.mjs`
  - `TARGET_PROJECT/.claude/skills/omega-claude-cli/scripts/verify-setup.mjs`
  - `TARGET_PROJECT/.claude/skills/omega-claude-cli/references/*.md`

Your agent can then use the skill and run the script when you ask for Claude. You will not have slash commands unless you also copy commands.

**Recommended (skill + commands):**

- Copy the **entire** `.claude` folder into the target project:
  - `TARGET_PROJECT/.claude/skills/omega-claude-cli/` (as above)
  - `TARGET_PROJECT/.claude/commands/analyze.md`, `sandbox.md`, `brainstorm.md`, `omega-claude.md`, `omega-claude-setup.md`

Then you get /analyze, /sandbox, /brainstorm, /omega-claude, /omega-claude-setup.

**Optional (Cursor rules):**

- Copy `.cursor/rules/omega-claude-cli.mdc` and `omega-claude-tools.mdc` into `TARGET_PROJECT/.cursor/rules/`. Cursor also discovers the **skill** from `.claude/skills/`. See [cursor.md](cursor.md).

**Other surfaces (copy the same .claude folder first, then):**

- **Cursor**: no extra copy needed — Cursor discovers the skill from `.claude/skills/`. Optionally copy `.cursor/rules/`. See [cursor.md](cursor.md).
- **Codex CLI**: copy **.agents** → Codex discovers `.agents/skills/omega-claude-cli/`. See [codex.md](codex.md).
- **Antigravity IDE**: copy **.agent** → agent discovers `.agent/skills/omega-claude-cli/`. See [antigravity.md](antigravity.md).
- **VS Code**: copy **.vscode** for Run Task (Ask Claude, Verify setup). See [vscode.md](vscode.md).

## After copying

1. **Open the target project** in your agent (that project is the workspace/project root).
2. Run **/omega-claude-setup** (if you copied commands) or run manually:
   ```bash
   node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs
   ```
3. Install **Node** and **Claude Code CLI** if the script reports they are missing. Complete **one-time auth** (run `claude` in a terminal and sign in if prompted). See [installation.md](installation.md) and [auth.md](auth.md).
4. From then on, "ask Claude for feedback" (or /analyze, etc.) works: the agent runs the script from the project root and returns Claude's output.

## Path requirement

All script paths in the skill and commands are relative to the **project root** (the directory that contains `.claude`). For example:

```bash
node .claude/skills/omega-claude-cli/scripts/ask-claude.mjs "your prompt"
```

So when the agent runs this, the current working directory must be the project root. In normal use (single project open) it is. In a monorepo, use the root that contains `.claude`, or adjust the path in the command to match where you placed the skill.
