const _reportedIssues = new Set<string>();

export function isDevelopmentRuntime(): boolean {
  if (typeof location === 'undefined') return false;
  return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

interface RuntimeIssueOptions {
  details?: unknown;
  dedupeKey?: string;
  throwInDev?: boolean;
}

export function reportRuntimeIssue(
  code: string,
  message: string,
  options: RuntimeIssueOptions = {},
): void {
  const key = options.dedupeKey || code;
  if (_reportedIssues.has(key)) return;
  _reportedIssues.add(key);

  const prefix = `[TLL Runtime:${code}]`;
  if (options.details !== undefined) {
    console.error(prefix, message, options.details);
  } else {
    console.error(prefix, message);
  }

  if (options.throwInDev && isDevelopmentRuntime()) {
    throw new Error(`${prefix} ${message}`);
  }
}

export function resetRuntimeDiagnosticsForTests(): void {
  _reportedIssues.clear();
}
