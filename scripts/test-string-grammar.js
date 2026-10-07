// Siemens `$'` and `$$` escapes must stay inside their string's TextMate
// scope without swallowing tokens after the actual closing quote.
"use strict";

const assert = require("assert").strict;
const grammar = require("../syntaxes/s7dcl.tmLanguage.json");
const [doubleQuoted, singleQuoted] = grammar.repository.strings.patterns;
const booleanOperators = grammar.repository["scl-boolean-operators"];
const wordOperators = grammar.repository["scl-word-operators"];

assert.ok(doubleQuoted.match && singleQuoted.match, "both string rules match complete literals");
assert.ok(booleanOperators.name.startsWith("keyword.control."), "boolean operators use keyword coloring");
for (const operator of ["AND", "OR", "XOR"]) {
  assert.ok(new RegExp(booleanOperators.match).test(operator), `${operator} uses the boolean keyword rule`);
}
assert.ok(wordOperators.name.startsWith("keyword.operator."), "NOT and MOD retain operator coloring");
for (const operator of ["NOT", "MOD"]) {
  assert.ok(new RegExp(wordOperators.match).test(operator), `${operator} uses the operator rule`);
}

for (const [rule, source, expected] of [
  [singleQuoted, "'It$'s!' + #value", "'It$'s!'"],
  [singleQuoted, "'$$' + #value", "'$$'"],
  [doubleQuoted, '"It$"s!" + #value', '"It$"s!"'],
  [doubleQuoted, '"$$" + #value', '"$$"'],
]) {
  const match = new RegExp(rule.match).exec(source);
  assert.equal(match?.[0], expected, `string grammar matches ${JSON.stringify(expected)} as one literal`);
}

console.log("Escaped-quote string grammar regressions passed.");
