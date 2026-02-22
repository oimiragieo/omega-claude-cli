/**
 * Pure JSON output extractor for ask-claude.mjs.
 * When --json is used, Claude CLI returns structured JSON (--output-format json).
 * Exported for unit testing without spawning a process.
 */

/**
 * Extract the response text from Claude CLI's JSON stdout.
 * If the output has a `.response` field, returns its string value.
 * Otherwise returns the raw stdout so the caller can decide what to do with it.
 *
 * @param {string} stdout - raw stdout from claude CLI (expected to be JSON when --json is used)
 * @returns {string} response text, or the original stdout if no .response field is present. Note: if .response is null, it returns an empty string.
 * @throws {SyntaxError} if stdout is not valid JSON
 */
export function extractJsonResponse(stdout) {
  const parsed = JSON.parse(stdout);
  if (parsed && typeof parsed === 'object' && 'response' in parsed) {
    // String(null ?? '') is ''
    return String(parsed.response ?? '');
  }
  return stdout;
}
