/**
 * Unit tests for ask-claude.mjs arg parsing, command construction, and JSON extraction.
 * Extracted pure functions enable testing without spawning processes.
 * Run from repo root: node --test tests/ask-claude.test.mjs
 *
 * Naming convention: method_scenario_expectedResult
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  assertNonEmptyPrompt,
  parseCliArgs,
} from '../.claude/skills/omega-claude-cli/scripts/parse-args.mjs';
import { extractJsonResponse } from '../.claude/skills/omega-claude-cli/scripts/format-output.mjs';
import {
  buildClaudeArgs,
  getExecutables,
} from '../.claude/skills/omega-claude-cli/scripts/ask-claude.mjs';

describe('parseCliArgs', () => {
  it('parses prompt and options', () => {
    const opts = parseCliArgs(['review this', '--model', 'sonnet', '--json', '--sandbox']);
    assert.strictEqual(opts.prompt, 'review this');
    assert.strictEqual(opts.model, 'sonnet');
    assert.strictEqual(opts.outputJson, true);
    assert.strictEqual(opts.sandbox, true);
  });

  it('parses timeout and help flags', () => {
    const opts = parseCliArgs(['--timeout-ms', '5000', '--help']);
    assert.strictEqual(opts.timeoutMs, 5000);
    assert.strictEqual(opts.help, true);
  });

  it('supports prompt after -- sentinel', () => {
    const opts = parseCliArgs(['--model', 'haiku', '--', '--not-a-flag', 'value']);
    assert.strictEqual(opts.model, 'haiku');
    assert.strictEqual(opts.prompt, '--not-a-flag value');
  });

  it('throws on unknown option', () => {
    assert.throws(() => parseCliArgs(['--nope']), /Unknown option/);
  });

  it('throws on invalid timeout', () => {
    assert.throws(() => parseCliArgs(['--timeout-ms', '0']), /Invalid value for --timeout-ms/);
  });

  it('throws when --model is missing value', () => {
    assert.throws(() => parseCliArgs(['--model']), /Missing value for --model/);
  });

  it('supports -m shorthand for --model', () => {
    const opts = parseCliArgs(['review this', '-m', 'sonnet']);
    assert.strictEqual(opts.model, 'sonnet');
    assert.strictEqual(opts.prompt, 'review this');
  });

  it('normalizes model casing', () => {
    const opts = parseCliArgs(['review this', '--model', 'HaIkU']);
    assert.strictEqual(opts.model, 'haiku');
  });

  it('throws on invalid model value', () => {
    assert.throws(
      () => parseCliArgs(['--model', 'gpt5']),
      /Invalid value for --model; expected one of: opus, sonnet, haiku/
    );
  });
});

describe('assertNonEmptyPrompt', () => {
  it('throws for empty prompt', () => {
    assert.throws(() => assertNonEmptyPrompt('  '), /Prompt is required/);
  });

  it('accepts non-empty prompt', () => {
    assert.doesNotThrow(() => assertNonEmptyPrompt('ok'));
  });
});

describe('buildClaudeArgs', () => {
  it('constructs minimal args when only prompt provided', () => {
    const args = buildClaudeArgs({ prompt: 'hi', model: '', outputJson: false, sandbox: false });
    assert.deepStrictEqual(args, ['-p', 'hi', '--dangerously-skip-permissions']);
  });

  it('constructs required args and optional flags', () => {
    const args = buildClaudeArgs({
      prompt: 'analyze file',
      model: 'sonnet',
      outputJson: true,
      sandbox: true,
    });
    assert.deepStrictEqual(args, [
      '-p',
      'analyze file',
      '--dangerously-skip-permissions',
      '--sandbox',
      '--model',
      'sonnet',
      '--output-format',
      'json',
    ]);
  });
});

describe('getExecutables', () => {
  it('returns Windows-first candidates', () => {
    const candidates = getExecutables(['-p', 'x'], true);
    assert.strictEqual(candidates[0].executable, 'cmd.exe');
    assert.deepStrictEqual(candidates[0].args.slice(0, 4), ['/d', '/s', '/c', 'claude']);
    assert.strictEqual(candidates[1].executable, 'cmd.exe');
    assert.deepStrictEqual(candidates[1].args.slice(0, 6), [
      '/d',
      '/s',
      '/c',
      'npx',
      '-y',
      '@anthropic-ai/claude-code',
    ]);
  });

  it('returns non-Windows candidates', () => {
    const candidates = getExecutables(['-p', 'x'], false);
    assert.strictEqual(candidates[0].executable, 'claude');
    assert.strictEqual(candidates[1].executable, 'npx');
  });
});

describe('extractJsonResponse', () => {
  it('extracts .response field when present', () => {
    assert.strictEqual(extractJsonResponse('{"response":"ok"}'), 'ok');
  });

  it('returns input when no .response field is present', () => {
    const raw = '{"foo":"bar"}';
    assert.strictEqual(extractJsonResponse(raw), raw);
  });

  it('throws SyntaxError on invalid JSON', () => {
    assert.throws(() => extractJsonResponse('not-json'), SyntaxError);
  });
});
