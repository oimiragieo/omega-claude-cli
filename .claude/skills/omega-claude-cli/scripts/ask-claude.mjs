#!/usr/bin/env node
/**
 * Headless Claude Code CLI wrapper.
 * Usage:
 *   node ask-claude.mjs "your prompt" [--model MODEL] [--json] [--sandbox] [--timeout-ms N]
 *   echo "prompt" | node ask-claude.mjs [--model MODEL] [--json] [--sandbox] [--timeout-ms N]
 */
import { spawn } from 'child_process';
import path from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';

const USAGE =
  'Usage: node ask-claude.mjs "prompt" [--model MODEL] [--json] [--sandbox] [--timeout-ms N]';

export function parseCliArgs(argv) {
  const opts = {
    model: '',
    outputJson: false,
    sandbox: false,
    timeoutMs: 0,
    help: false,
    prompt: '',
  };

  const promptParts = [];
  let readPromptVerbatim = false;

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];

    if (readPromptVerbatim) {
      promptParts.push(token);
      continue;
    }

    if (token === '--') {
      readPromptVerbatim = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      opts.help = true;
      continue;
    }
    if (token === '--json') {
      opts.outputJson = true;
      continue;
    }
    if (token === '--sandbox') {
      opts.sandbox = true;
      continue;
    }
    if (token === '--model' || token === '-m') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --model');
      }
      opts.model = value;
      i++;
      continue;
    }
    if (token === '--timeout-ms') {
      const value = argv[i + 1];
      const parsed = Number.parseInt(value || '', 10);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error('Invalid value for --timeout-ms; expected a positive integer');
      }
      opts.timeoutMs = parsed;
      i++;
      continue;
    }
    if (token.startsWith('-')) {
      throw new Error(`Unknown option: ${token}`);
    }
    promptParts.push(token);
  }

  opts.prompt = promptParts.join(' ').trim();
  return opts;
}

export function buildClaudeArgs({ prompt, model, outputJson, sandbox }) {
  const cliArgs = ['-p', prompt.trim(), '--dangerously-skip-permissions'];
  if (sandbox) cliArgs.push('--sandbox');
  if (model) cliArgs.push('--model', model);
  if (outputJson) cliArgs.push('--output-format', 'json');
  return cliArgs;
}

export function getExecutables(cliArgs, isWin) {
  if (isWin) {
    return [
      {
        executable: 'cmd.exe',
        args: ['/d', '/s', '/c', 'claude', ...cliArgs],
        notFoundPattern: /not recognized as an internal or external command/i,
      },
      {
        executable: 'cmd.exe',
        args: ['/d', '/s', '/c', 'npx', '-y', '@anthropic-ai/claude-code', ...cliArgs],
        notFoundPattern: /not recognized as an internal or external command/i,
      },
    ];
  }
  return [
    { executable: 'claude', args: cliArgs },
    { executable: 'npx', args: ['-y', '@anthropic-ai/claude-code', ...cliArgs] },
  ];
}

function runCandidate(candidate, runOptions, timeoutMs) {
  return new Promise((resolve) => {
    let proc;
    try {
      proc = spawn(candidate.executable, candidate.args, runOptions);
    } catch (err) {
      if (err && (err.code === 'ENOENT' || err.code === 'EINVAL')) {
        resolve({ enoent: true });
        return;
      }
      resolve({
        code: 1,
        stdout: '',
        stderr: `Failed to start ${candidate.executable}: ${err && err.message ? err.message : String(err)}`,
        timedOut: false,
      });
      return;
    }
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let timer = null;
    let settled = false;

    function finish(value) {
      if (settled) return;
      settled = true;
      resolve(value);
    }

    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');

    proc.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    proc.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        timedOut = true;
        proc.kill();
      }, timeoutMs);
    }

    proc.on('error', (err) => {
      if (timer) clearTimeout(timer);
      if (err && err.code === 'ENOENT') {
        finish({ enoent: true });
        return;
      }
      finish({
        code: 1,
        stdout,
        stderr:
          (stderr ? stderr + '\n' : '') + `Failed to run ${candidate.executable}: ${err.message}`,
        timedOut,
      });
    });

    proc.on('close', (code) => {
      if (timer) clearTimeout(timer);
      finish({ code: code ?? 1, stdout, stderr, timedOut });
    });
  });
}

async function runWithFallback(candidates, runOptions, timeoutMs) {
  for (const candidate of candidates) {
    const result = await runCandidate(candidate, runOptions, timeoutMs);
    if (result.enoent) continue;
    const combined = `${result.stderr || ''}\n${result.stdout || ''}`;
    if (
      result.code !== 0 &&
      candidate.notFoundPattern &&
      candidate.notFoundPattern.test(combined)
    ) {
      continue;
    }
    return result;
  }
  return { code: 1, stdout: '', stderr: 'Claude Code CLI not found on PATH.', timedOut: false };
}

export function extractJsonResponse(stdout) {
  const parsed = JSON.parse(stdout);
  if (parsed && typeof parsed === 'object' && 'response' in parsed) {
    return String(parsed.response ?? '');
  }
  return stdout;
}

function printFailure(stderr, stdout, timedOut) {
  const combined = (stderr || stdout || '').trim();
  if (timedOut) {
    console.error(
      combined ||
        'Claude request timed out. Try a shorter prompt or set a larger timeout with --timeout-ms.'
    );
    return;
  }
  console.error(combined);
  const hint =
    combined.toLowerCase().includes('not found') ||
    combined.toLowerCase().includes('command not found')
      ? '\nHint: Is the Claude Code CLI installed and authenticated? Run: node .claude/skills/omega-claude-cli/scripts/verify-setup.mjs'
      : '';
  if (hint) console.error(hint);
}

async function run(promptText, opts) {
  if (!promptText || !promptText.trim()) {
    console.error(USAGE);
    process.exit(1);
  }

  const cliArgs = buildClaudeArgs({
    prompt: promptText,
    model: opts.model,
    outputJson: opts.outputJson,
    sandbox: opts.sandbox,
  });
  const runOptions = {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
    shell: false,
  };
  const candidates = getExecutables(cliArgs, process.platform === 'win32');
  const result = await runWithFallback(candidates, runOptions, opts.timeoutMs);

  if (result.code !== 0) {
    printFailure(result.stderr, result.stdout, result.timedOut);
    process.exit(result.timedOut ? 124 : (result.code ?? 1));
  }

  if (opts.outputJson) {
    try {
      process.stdout.write(extractJsonResponse(result.stdout));
    } catch (e) {
      process.stderr.write(
        'Warning: Claude did not return valid JSON; raw output below. (' +
          (e && e.message ? e.message : 'parse error') +
          ')\n'
      );
      process.stdout.write(result.stdout);
      process.exit(1);
    }
    return;
  }

  process.stdout.write(result.stdout);
}

export function isEntryPoint() {
  if (!process.argv[1]) return false;
  return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

async function main() {
  let opts;
  try {
    opts = parseCliArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err && err.message ? err.message : String(err));
    console.error(USAGE);
    process.exit(1);
  }

  if (opts.help) {
    console.log(USAGE);
    process.exit(0);
  }

  if (opts.prompt) {
    await run(opts.prompt, opts);
    return;
  }

  const rl = createInterface({ input: process.stdin });
  const lines = [];
  rl.on('line', (line) => lines.push(line));
  rl.on('close', async () => {
    await run(lines.join('\n'), opts);
  });
}

if (isEntryPoint()) {
  await main();
}
