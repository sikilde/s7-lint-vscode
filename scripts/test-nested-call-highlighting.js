// A quoted SCL FUNCTION call must keep its function highlighting when it
// appears as an instruction argument rather than as a top-level statement.
"use strict";

const assert = require("assert").strict;
const path = require("path");

const { BlockIndex } = require("../out/analysis/blockIndex");
const { buildDocumentIndex } = require("../out/analysis/documentIndex");
const { loadRuleSet } = require("../out/rules/loadRules");

const text = `FUNCTION_BLOCK "FB_Test"
VAR
  sString : String[100];
END_VAR
BEGIN
  #sString := "fcDInt_To_String_v1"(#_iState);
  #sString := CONCAT(IN1 := #sString, IN2 := "fcDInt_To_String_v1"(#_SQL_DefaultRetData.Data.RetCode));
  #sString := "ordinary string";
END_FUNCTION_BLOCK
`;
const file = path.join(__dirname, "nested-call-highlighting.scl");
const ruleSet = loadRuleSet(path.join(__dirname, "..", "resources"));
const blockIndex = new BlockIndex();
blockIndex.rebuild([{ path: file, text }]);
const index = buildDocumentIndex(text, ruleSet, blockIndex, file);
const quotedFunctionSpans = index.spans.filter((span) => {
  const line = text.split(/\r?\n/)[span.line - 1] ?? "";
  return line.slice(span.startCol - 1, span.startCol - 1 + span.length) === '"fcDInt_To_String_v1"';
});

assert.equal(quotedFunctionSpans.length, 2, "both quoted function references get semantic spans");
assert.ok(quotedFunctionSpans.every((span) => span.tokenType === "function"), "top-level and nested quoted calls are functions");
const ordinaryStringLine = text.split(/\r?\n/).findIndex((line) => line.includes('"ordinary string"')) + 1;
const ordinaryString = index.spans.find((span) => {
  const line = text.split(/\r?\n/)[span.line - 1] ?? "";
  return span.line === ordinaryStringLine && line.slice(span.startCol - 1, span.startCol - 1 + span.length) === '"ordinary string"';
});
assert.equal(ordinaryString?.tokenType, "string", "a quoted string value remains highlighted as a string");

console.log("Nested quoted-call highlighting regressions passed.");
