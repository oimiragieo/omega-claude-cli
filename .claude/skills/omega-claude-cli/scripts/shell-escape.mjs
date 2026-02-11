#!/usr/bin/env node
/**
 * Escape a prompt for safe use inside a Windows cmd.exe double-quoted string.
 * In cmd.exe, \" is NOT an escape; use "" for a literal quote to prevent injection.
 * Used only if we ever need a shell fallback; ask-claude.mjs uses spawn(..., { shell: false }) by default.
 */
export function escapeForWindowsCmd(prompt) {
  if (typeof prompt !== 'string') return '';
  return prompt.replace(/\^/g, '^^').replace(/%/g, '^%').replace(/"/g, '""').replace(/\$/g, '\\$');
}
