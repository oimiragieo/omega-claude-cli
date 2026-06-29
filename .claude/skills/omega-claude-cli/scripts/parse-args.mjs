/**
 * Pure argument parser for ask-claude.mjs.
 * Strict flag handling: throws on unknown options, missing values, and invalid types.
 * Exported for unit testing without spawning a process.
 */
const VALID_ALIASES = new Set(['sonnet', 'haiku', 'opus', 'fable', 'best', 'opusplan', 'default']);
const CONTEXT_SUFFIX = '[1m]';
const CONTEXT_ALIAS_BASES = new Set(['sonnet', 'opus']);
const FULL_MODEL_ID_PATTERN = /^claude-(opus|sonnet|haiku|fable)(-[a-z0-9.]+)*$/;

/**
 * @param {string} value
 * @returns {string}
 */
export function normalizeModel(value) {
  const normalized = value.toLowerCase();
  if (VALID_ALIASES.has(normalized)) {
    return normalized;
  }
  if (normalized.endsWith(CONTEXT_SUFFIX)) {
    const base = normalized.slice(0, -CONTEXT_SUFFIX.length);
    if (CONTEXT_ALIAS_BASES.has(base)) {
      return normalized;
    }
  }
  if (FULL_MODEL_ID_PATTERN.test(normalized)) {
    return normalized;
  }
  throw new Error(
    'Invalid value for --model; expected an alias (opus, sonnet, haiku, fable, best, opusplan, default, sonnet[1m], opus[1m]) or a full claude-* model id'
  );
}

export function assertNonEmptyPrompt(prompt) {
  if (!prompt || !prompt.trim()) {
    throw new Error('Prompt is required');
  }
}

/**
 * Parse CLI argv into structured options.
 * The `--` sentinel passes everything after it verbatim as the prompt.
 *
 * @param {string[]} argv - process.argv.slice(2)
 * @returns {{ prompt: string, model: string, outputJson: boolean, sandbox: boolean, timeoutMs: number, help: boolean }}
 */
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
      opts.model = normalizeModel(value);
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
