import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CORE_ACTIONS = [
  "collect", "read", "inspect", "compare",
  "sort", "connect", "decide", "stop-check",
  "build", "write", "test", "repair",
  "explain", "retrieve", "share", "deliver",
];

function fail(message) {
  throw new Error(`Invalid Muzi action library: ${message}`);
}

async function inspectPng(file) {
  const data = await fs.readFile(file);
  if (data.length < 24 || data.toString("ascii", 1, 4) !== "PNG") fail(`${file} is not a PNG`);
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    sha256: crypto.createHash("sha256").update(data).digest("hex").toUpperCase(),
  };
}

export async function validateActionLibrary(manifest, manifestFile) {
  if (manifest?.schema !== "creator.muzi-crayon-action-library/1") fail("unexpected schema");
  if (manifest.status !== "READY_FOR_REVIEW") fail("status must be READY_FOR_REVIEW");
  if (!Array.isArray(manifest.categories) || manifest.categories.length !== 4) fail("exactly four categories are required");

  const entries = manifest.categories.flatMap((category) => {
    if (typeof category.id !== "string" || typeof category.label !== "string") fail("each category needs id and label");
    if (!Array.isArray(category.actions) || category.actions.length !== 4) fail(`${category.id} must contain four actions`);
    return category.actions;
  });
  const ids = entries.map((entry) => entry.id);
  if (new Set(ids).size !== ids.length) fail("action ids must be unique");
  if (ids.length !== CORE_ACTIONS.length || CORE_ACTIONS.some((id) => !ids.includes(id))) fail("core action set is incomplete");
  if ("optionalActions" in manifest) fail("optionalActions is retired; companion identity must not be an action");
  if (!manifest.companion || typeof manifest.companion !== "object" || Array.isArray(manifest.companion)) {
    fail("one companion identity is required");
  }
  if (manifest.companion.id !== "ragdoll-cat") fail("companion id must be ragdoll-cat");
  if (ids.includes(manifest.companion.id)) fail("companion identity must not duplicate an action id");

  const assetsRoot = path.resolve(path.dirname(manifestFile));
  const expectedWidth = manifest.imageContract?.width;
  const expectedHeight = manifest.imageContract?.height;
  if (expectedWidth !== 1254 || expectedHeight !== 1254) fail("image contract must be 1254x1254");

  const inspected = [];
  for (const entry of [...entries, manifest.companion]) {
    for (const field of ["id", "label", "useWhen", "file", "sha256"]) {
      if (typeof entry[field] !== "string" || !entry[field].trim()) fail(`${entry.id ?? "entry"}.${field} is required`);
    }
    const file = path.resolve(assetsRoot, entry.file);
    if (!file.startsWith(`${assetsRoot}${path.sep}`)) fail(`${entry.id} file escapes the assets directory`);
    const actual = await inspectPng(file);
    if (actual.width !== expectedWidth || actual.height !== expectedHeight) {
      fail(`${entry.id} must be ${expectedWidth}x${expectedHeight}, got ${actual.width}x${actual.height}`);
    }
    if (actual.sha256 !== entry.sha256.toUpperCase()) fail(`${entry.id} sha256 mismatch`);
    inspected.push({ id: entry.id, file, ...actual });
  }

  return { ok: true, coreActionCount: entries.length, companionCount: 1, inspected };
}

if (path.basename(process.argv[1] ?? "") === path.basename(fileURLToPath(import.meta.url))) {
  const index = process.argv.indexOf("--file");
  if (index < 0 || !process.argv[index + 1]) fail("use --file <action-library.json>");
  const manifestFile = path.resolve(process.argv[index + 1]);
  const manifest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
  console.log(JSON.stringify(await validateActionLibrary(manifest, manifestFile), null, 2));
}
