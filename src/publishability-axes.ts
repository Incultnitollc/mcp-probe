export interface AxisScore {
  axes: {
    type: boolean;
    constraints: boolean;
    notAxis: boolean;
    mutation: boolean;
    example: boolean;
  };
  axesPassed: number;
}

const TYPE_TOKENS = /\b(string|number|integer|boolean|array|object|UTF-?8|bytes|JSON|seconds|milliseconds|ms|absolute path|relative path|URL|URI|UUID|UTF8|ASCII|base64|float|decimal|timestamp|date)\b/i;
const CONSTRAINT_TOKENS = /\b(min|max|maxLength|minLength|pattern|range|up to|at most|at least|between|chars?|characters?|bytes?|seconds?|milliseconds?|positive|non-?empty|format)\b/i;
const NOT_TOKENS = /\b(do not|don't|never|avoid|except|must not|cannot|forbidden)\b/i;
const MUTATION_TOKENS = /\b(mutating|read[- ]only|writes? to|modifies?|destructive|side[- ]?effect|deletes?|creates?|inserts?|updates?|removes?|narrows? (?:a )?read)\b/i;
const EXAMPLE_TOKENS = /\b(e\.?g\.?|example|for example|such as)\b/i;

export function scoreDescriptionAxes(description: string): AxisScore {
  const d = description ?? "";
  const axes = {
    type: TYPE_TOKENS.test(d),
    constraints: CONSTRAINT_TOKENS.test(d),
    notAxis: NOT_TOKENS.test(d),
    mutation: MUTATION_TOKENS.test(d),
    example: EXAMPLE_TOKENS.test(d),
  };
  const axesPassed = Object.values(axes).filter(Boolean).length;
  return { axes, axesPassed };
}
