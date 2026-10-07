// Siemens `$'` and `$$` escapes must stay inside their string's TextMate
// scope without swallowing tokens after the actual closing quote.
"use strict";

const assert = require("assert").strict;
const grammar = require("../syntaxes/s7dcl.tmLanguage.json");
const [doubleQuoted, singleQuoted] = grammar.repository.strings.patterns;

assert.ok(doubleQuoted.match && singleQuoted.match, "both string rules match complete literals");

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
