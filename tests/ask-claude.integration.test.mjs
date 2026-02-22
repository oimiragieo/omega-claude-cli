/**
 * Integration tests for ask-claude.mjs.
 * Creates a stub claude executable, injects it into PATH, and runs the script end-to-end
 * to verify flag forwarding, JSON envelope behavior, and non-zero exit propagation.
 * Run from repo root: node --test tests/ask-claude.integration.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const SCRIPT_PATH = path.resolve('.claude/skills/omega-claude-cli/scripts/ask-claude.mjs');

function makeClaudeStubDir() {
  const dir = mkdtempSync(path.join(tmpdir(), 'claude-stub-'));
  const stubJsPath = path.join(dir, 'claude-stub.mjs');
  const shimPath = path.join(dir, process.platform === 'win32' ? 'claude.cmd' : 'claude');

  writeFileSync(
    stubJsPath,
    `#!/usr/bin/env node
const mode = process.env.CLAUDE_STUB_MODE || 'echo';
const args = process.argv.slice(2);
if (mode === 'json') {
  process.stdout.write(JSON.stringify({ response: 'stub response' }));
} else if (mode === 'invalid-json') {
  process.stdout.write('not-json');
} else if (mode === 'json-missing-response') {
  process.stdout.write(JSON.stringify({ ok: true }));
} else if (mode === 'error') {
  process.stderr.write('stub failure');
  process.exit(2);
} else if (mode === 'sleep') {
  setTimeout(() => {
    process.stdout.write('done');
  }, Number.parseInt(process.env.CLAUDE_STUB_SLEEP_MS || '1000', 10));
} else {
  process.stdout.write(JSON.stringify({ args }));
}
`
  );

  if (process.platform === 'win32') {
    writeFileSync(shimPath, `@echo off\r\n"${process.execPath}" "${stubJsPath}" %*\r\n`);
  } else {
    writeFileSync(shimPath, `#!/usr/bin/env bash\n"${process.execPath}" "${stubJsPath}" "$@"\n`);
    chmodSync(shimPath, 0o755);
  }

  return dir;
}

function runAskClaude(args, mode, extraEnv = {}) {
  const stubDir = makeClaudeStubDir();
  const env = {
    ...process.env,
    CLAUDE_STUB_MODE: mode,
    ...extraEnv,
    PATH: `${stubDir}${path.delimiter}${process.env.PATH || ''}`,
  };

  const result = spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    cwd: path.resolve('.'),
    env,
    encoding: 'utf8',
    timeout: 10000,
  });

  rmSync(stubDir, { recursive: true, force: true });
  return result;
}

describe('ask-claude integration', () => {
  it('forwards prompt and required flags to claude', () => {
    const result = runAskClaude(['hello world'], 'echo');

    assert.equal(result.status, 0);
    const parsed = JSON.parse(result.stdout);
    assert.deepEqual(parsed.args, ['-p', 'hello world', '--dangerously-skip-permissions']);
  });

  it('returns response text when --json is used', () => {
    const result = runAskClaude(['--json', 'prompt text'], 'json');

    assert.equal(result.status, 0);
    assert.equal(result.stdout, 'stub response');
  });

  it('returns warning and non-zero exit for invalid json in --json mode', () => {
    const result = runAskClaude(['--json', 'prompt text'], 'invalid-json');

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Warning: Claude did not return valid JSON/);
  });

  it('returns warning and non-zero exit when json lacks response field in --json mode', () => {
    const result = runAskClaude(['--json', 'prompt text'], 'json-missing-response');

    assert.equal(result.status, 1);
    assert.match(result.stderr, /missing required \.response field/i);
  });

  it('propagates claude non-zero exit and stderr', () => {
    const result = runAskClaude(['prompt text'], 'error');

    assert.equal(result.status, 2);
    assert.match(result.stderr, /stub failure/);
  });

  it('reads prompt from stdin when no arg provided', () => {
    const stubDir = makeClaudeStubDir();
    const env = {
      ...process.env,
      CLAUDE_STUB_MODE: 'echo',
      PATH: `${stubDir}${path.delimiter}${process.env.PATH || ''}`,
    };

    const result = spawnSync(process.execPath, [SCRIPT_PATH], {
      cwd: path.resolve('.'),
      env,
      encoding: 'utf8',
      input: 'prompt from stdin',
      timeout: 10000,
    });

    rmSync(stubDir, { recursive: true, force: true });

    assert.equal(result.status, 0);
    const parsed = JSON.parse(result.stdout);
    assert.deepEqual(parsed.args, ['-p', 'prompt from stdin', '--dangerously-skip-permissions']);
  });

  it('returns 124 when claude request times out', () => {
    const start = Date.now();
    const result = runAskClaude(['--timeout-ms', '50', 'prompt text'], 'sleep', {
      CLAUDE_STUB_SLEEP_MS: '2000',
    });

    assert.equal(result.status, 124);
    assert.match(result.stderr, /timed out/i);
    assert.ok(Date.now() - start < 1500);
  });

  it('rejects oversized stdin input before invoking claude', () => {
    const stubDir = makeClaudeStubDir();
    const env = {
      ...process.env,
      CLAUDE_STUB_MODE: 'echo',
      ASK_CLAUDE_MAX_STDIN_BYTES: '32',
      PATH: `${stubDir}${path.delimiter}${process.env.PATH || ''}`,
    };

    const result = spawnSync(process.execPath, [SCRIPT_PATH], {
      cwd: path.resolve('.'),
      env,
      encoding: 'utf8',
      input: 'x'.repeat(128),
      timeout: 10000,
    });

    rmSync(stubDir, { recursive: true, force: true });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /exceeds/i);
    assert.equal(result.stdout, '');
  });
});
