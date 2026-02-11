/**
 * Unit tests for Windows cmd.exe prompt escaping (shell-escape.mjs).
 * Run from repo root: node --test tests/shell-escape.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { escapeForWindowsCmd } from '../.claude/skills/omega-claude-cli/scripts/shell-escape.mjs';

describe('escapeForWindowsCmd', () => {
  it('escapes double quotes (cmd.exe use "" not \\)', () => {
    assert.strictEqual(escapeForWindowsCmd('say "hello"'), 'say ""hello""');
  });

  it('escapes percent', () => {
    assert.strictEqual(escapeForWindowsCmd('path %PATH%'), 'path ^%PATH^%');
  });

  it('escapes caret', () => {
    assert.strictEqual(escapeForWindowsCmd('a^b'), 'a^^b');
  });

  it('escapes double quote as "" for cmd.exe', () => {
    assert.strictEqual(escapeForWindowsCmd('backslash"quote'), 'backslash""quote');
  });

  it('escapes dollar for consistency', () => {
    assert.strictEqual(escapeForWindowsCmd('$HOME'), '\\$HOME');
  });

  it('returns empty string for non-string', () => {
    assert.strictEqual(escapeForWindowsCmd(null), '');
    assert.strictEqual(escapeForWindowsCmd(undefined), '');
  });

  it('leaves safe text unchanged', () => {
    assert.strictEqual(escapeForWindowsCmd('hello world'), 'hello world');
    assert.strictEqual(escapeForWindowsCmd('prompt with spaces'), 'prompt with spaces');
  });

  it('handles mixed special chars', () => {
    const out = escapeForWindowsCmd('test "quoted" and %VAR% and ^caret');
    assert.ok(out.includes('""'));
    assert.ok(out.includes('^%'));
    assert.ok(out.includes('^^'));
  });
});
