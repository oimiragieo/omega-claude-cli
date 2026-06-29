/**
 * Pure JSON output extractor for ask-claude.mjs.
 * When --json is used, Claude CLI returns structured JSON (--output-format json).
 * Exported for unit testing without spawning a process.
 */

/**
 * Extract the response text from Claude CLI's JSON stdout.
 * Prefers the `.result` field (current CLI envelope); falls back to legacy `.response`.
 *
 * @param {string} stdout - raw stdout from claude CLI (expected to be JSON when --json is used)
 * @returns {string} response text. Note: if the field is null, returns an empty string.
 * @throws {SyntaxError} if stdout is not valid JSON
 * @throws {Error} if stdout JSON has neither .result nor .response
 */
export function extractJsonResponse(stdout) {
  const parsed = JSON.parse(stdout);
  if (parsed && typeof parsed === 'object') {
    if ('result' in parsed) {
      return String(parsed.result ?? '');
    }
    if ('response' in parsed) {
      return String(parsed.response ?? '');
    }
  }
  throw new Error('Claude JSON output missing required .result or .response field');
}
