import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "get-reference-set.ps1");
const powershell = process.platform === "win32" ? "powershell.exe" : "pwsh";

function resolveSet(action, companion) {
  const args = ["-NoProfile", "-File", script, "-Action", action];
  if (companion) args.push("-Companion", companion);
  const result = spawnSync(powershell, args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${result.stdout}${result.stderr}`.trim());
  return JSON.parse(result.stdout);
}

function references(result) {
  return [result.master, result.fullBodyStyle, result.actionReference, result.companionReference].filter(Boolean);
}

test("library action with excluded companion returns three references", () => {
  const result = resolveSet("connect", "exclude");
  assert.equal(result.schema, "creator.muzi-crayon-reference-set/3");
  assert.equal(result.actionMode, "library");
  assert.equal(result.action, "connect");
  assert.equal(result.companionMode, "exclude");
  assert.equal(result.companion, null);
  assert.equal(result.companionReference, null);
  assert.ok(fs.existsSync(result.master));
  assert.ok(fs.existsSync(result.fullBodyStyle));
  assert.ok(fs.existsSync(result.actionReference));
  assert.equal(references(result).length, 3);
  assert.doesNotMatch(result.actionReference, /action-index/i);
});

test("library action with included companion returns four references", () => {
  const result = resolveSet("connect", "include");
  assert.equal(result.actionMode, "library");
  assert.equal(result.companionMode, "include");
  assert.equal(result.companion, "ragdoll-cat");
  assert.ok(fs.existsSync(result.companionReference));
  assert.match(result.companionReference, /cat-master\.png$/i);
  assert.equal(references(result).length, 4);
  assert.doesNotMatch(result.companionReference, /action-index/i);
});

test("free and legacy master with excluded companion return two references", () => {
  for (const action of ["free", "master"]) {
    const result = resolveSet(action, "exclude");
    assert.equal(result.actionMode, "free");
    assert.equal(result.action, null);
    assert.equal(result.actionReference, null);
    assert.equal(result.companionMode, "exclude");
    assert.equal(result.companionReference, null);
    assert.ok(fs.existsSync(result.master));
    assert.ok(fs.existsSync(result.fullBodyStyle));
    assert.equal(references(result).length, 2);
  }
});

test("free with included companion returns three references", () => {
  const result = resolveSet("free", "include");
  assert.equal(result.actionMode, "free");
  assert.equal(result.actionReference, null);
  assert.equal(result.companionMode, "include");
  assert.ok(fs.existsSync(result.companionReference));
  assert.equal(references(result).length, 3);
});

test("legacy lifestyle-cat maps to free pose with included companion", () => {
  const result = resolveSet("lifestyle-cat", "exclude");
  assert.equal(result.actionMode, "free");
  assert.equal(result.actionReference, null);
  assert.equal(result.companionMode, "include");
  assert.equal(result.companion, "ragdoll-cat");
  assert.equal(result.legacyAlias, "lifestyle-cat");
  assert.equal(references(result).length, 3);
});

test("list exposes only the sixteen core actions", () => {
  const result = spawnSync(powershell, [
    "-NoProfile", "-File", script, "-List",
  ], { encoding: "utf8" });
  assert.equal(result.status, 0);
  const entries = JSON.parse(result.stdout);
  assert.equal(entries.length, 16);
  assert.equal(entries.some((entry) => entry.id === "lifestyle-cat"), false);
  assert.equal(entries.some((entry) => entry.id === "ragdoll-cat"), false);
});

test("unknown action fails closed", () => {
  const result = spawnSync(powershell, [
    "-NoProfile", "-File", script, "-Action", "unknown-pose",
  ], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /Unknown Muzi action/);
});

test("unknown companion mode fails closed", () => {
  const result = spawnSync(powershell, [
    "-NoProfile", "-File", script, "-Action", "free", "-Companion", "sometimes",
  ], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /Companion/);
});
