import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) { throw new Error(`Invalid Muzi crayon review: ${message}`); }

const CORE_ACTIONS = [
  "collect", "read", "inspect", "compare",
  "sort", "connect", "decide", "stop-check",
  "build", "write", "test", "repair",
  "explain", "retrieve", "share", "deliver",
];

const STRUCTURES = ["single-point", "comparison", "sequence", "state", "environment", "focus"];
const COMPOSITIONS = [
  "centered", "side-by-side", "character-action", "object-closeup",
  "environment-metaphor", "mini-metaphor", "sequence",
  "information-focus", "emotion-closeup",
];
const OBJECT_ROLES = ["problem", "action", "result", "state"];
const IDENTITY_CHECKS = [
  "faceAndHair", "sunglasses", "outfitAndProportion", "crayonStyle", "activeParticipation",
];

const V1_KEYS = [
  "schema", "status", "judgment", "metaphor", "muziAction",
  "lockedLabels", "textRevisionRounds", "outputPath",
];
const V2_KEYS = [
  "schema", "status", "judgment", "structure", "composition", "density",
  "metaphor", "objects", "storyFlow", "actionMode", "actionReference",
  "muziAction", "lockedLabels", "identityChecks", "regenerationRounds",
  "textRevisionRounds", "outputPath",
];
const V3_KEYS = [...V2_KEYS, "companion", "companionChecks"];
const COMPANION_CHECKS = ["identity", "subordinateScale", "passiveRole"];

function requireExactKeys(value, allowed, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value);
  const missing = allowed.filter((key) => !actual.includes(key));
  const extra = actual.filter((key) => !allowed.includes(key));
  if (missing.length) fail(`${label} is missing: ${missing.join(", ")}`);
  if (extra.length) fail(`${label} has unsupported fields: ${extra.join(", ")}`);
}

function requireText(value, key) {
  if (typeof value !== "string" || !value.trim()) fail(`${key} is required`);
  return value.trim();
}

function validateLabels(value) {
  if (!Array.isArray(value) || value.length < 3 || value.length > 6) {
    fail("lockedLabels must contain 3-6 items");
  }
  const labels = value.map((label) => String(label).trim());
  if (labels.some((label) => !label) || new Set(labels).size !== labels.length) {
    fail("lockedLabels must be non-empty and unique");
  }
  if (labels.some((label) => /^(?:封面|内页|图\d+|card\s*\d+)$/i.test(label))) {
    fail("lockedLabels cannot contain internal production labels");
  }
  return labels;
}

function validateRound(value, key) {
  if (!Number.isInteger(value) || value < 0 || value > 2) fail(`${key} must be an integer from 0 to 2`);
}

function validateV1(review) {
  requireExactKeys(review, V1_KEYS, "v1 review");
  for (const key of ["judgment", "metaphor", "muziAction", "outputPath"]) requireText(review[key], key);
  if (!CORE_ACTIONS.includes(review.muziAction)) fail(`muziAction must be one of: ${CORE_ACTIONS.join(", ")}`);
  validateRound(review.textRevisionRounds, "textRevisionRounds");
}

function validateV2(review) {
  requireExactKeys(review, V2_KEYS, "v2 review");
  for (const key of ["judgment", "metaphor", "storyFlow", "muziAction", "outputPath"]) requireText(review[key], key);

  if (!STRUCTURES.includes(review.structure)) fail(`structure must be one of: ${STRUCTURES.join(", ")}`);
  if (!COMPOSITIONS.includes(review.composition)) fail(`composition must be one of: ${COMPOSITIONS.join(", ")}`);
  if (!["minimal", "narrative"].includes(review.density)) fail("density must be minimal or narrative");

  const minObjects = review.density === "narrative" ? 3 : 1;
  const maxObjects = review.density === "narrative" ? 6 : 3;
  if (!Array.isArray(review.objects) || review.objects.length < minObjects || review.objects.length > maxObjects) {
    fail(`${review.density} objects must contain ${minObjects}-${maxObjects} items`);
  }
  const names = review.objects.map((object, index) => {
    requireExactKeys(object, ["name", "role"], `objects[${index}]`);
    const name = requireText(object.name, `objects[${index}].name`);
    if (!OBJECT_ROLES.includes(object.role)) fail(`objects[${index}].role must be one of: ${OBJECT_ROLES.join(", ")}`);
    return name;
  });
  if (new Set(names).size !== names.length) fail("objects names must be unique");

  if (!["library", "free"].includes(review.actionMode)) fail("actionMode must be library or free");
  if (review.actionMode === "library" && !CORE_ACTIONS.includes(review.actionReference)) {
    fail(`library actionReference must be one of: ${CORE_ACTIONS.join(", ")}`);
  }
  if (review.actionMode === "free" && review.actionReference !== null) {
    fail("free actionReference must be null");
  }

  requireExactKeys(review.identityChecks, IDENTITY_CHECKS, "identityChecks");
  for (const key of IDENTITY_CHECKS) {
    if (review.identityChecks[key] !== true) fail(`identityChecks.${key} must be true`);
  }

  validateRound(review.regenerationRounds, "regenerationRounds");
  validateRound(review.textRevisionRounds, "textRevisionRounds");
}

function validateV3(review) {
  requireExactKeys(review, V3_KEYS, "v3 review");
  const v2Shape = Object.fromEntries(V2_KEYS.map((key) => [key, review[key]]));
  v2Shape.schema = "creator.muzi-crayon-review/2";
  validateV2(v2Shape);

  requireExactKeys(review.companion, ["mode", "rationale", "poseAndPlacement"], "companion");
  if (!["include", "exclude"].includes(review.companion.mode)) fail("companion.mode must be include or exclude");
  requireText(review.companion.rationale, "companion.rationale");

  if (review.companion.mode === "include") {
    requireText(review.companion.poseAndPlacement, "companion.poseAndPlacement");
    requireExactKeys(review.companionChecks, COMPANION_CHECKS, "companionChecks");
    for (const key of COMPANION_CHECKS) {
      if (review.companionChecks[key] !== true) fail(`companionChecks.${key} must be true`);
    }
  } else {
    if (review.companion.poseAndPlacement !== null) fail("excluded companion poseAndPlacement must be null");
    if (review.companionChecks !== null) fail("excluded companionChecks must be null");
  }
}

async function pngSize(file) {
  const data = await fs.readFile(file);
  if (data.length < 24 || data.toString("ascii", 1, 4) !== "PNG") fail("output is not a PNG");
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

export async function validateMuziReview(review, reviewFile) {
  if (review?.schema === "creator.muzi-crayon-review/1") validateV1(review);
  else if (review?.schema === "creator.muzi-crayon-review/2") validateV2(review);
  else if (review?.schema === "creator.muzi-crayon-review/3") validateV3(review);
  else fail("schema must be creator.muzi-crayon-review/1, creator.muzi-crayon-review/2, or creator.muzi-crayon-review/3");

  if (review.status !== "READY_FOR_REVIEW") fail("status must be READY_FOR_REVIEW");
  const labels = validateLabels(review.lockedLabels);
  const output = path.resolve(path.dirname(reviewFile), review.outputPath);
  if (path.extname(output).toLowerCase() !== ".png") fail("outputPath must reference a PNG");
  const { width, height } = await pngSize(output);
  if (width !== 1672 || height !== 941) fail(`output must be 1672x941 PNG, got ${width}x${height}`);
  return { ok: true, schema: review.schema, outputPath: output, width, height, labels };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const index = process.argv.indexOf("--file");
  if (index < 0 || !process.argv[index + 1]) fail("use --file <review.json>");
  const reviewFile = path.resolve(process.argv[index + 1]);
  const review = JSON.parse(await fs.readFile(reviewFile, "utf8"));
  console.log(JSON.stringify(await validateMuziReview(review, reviewFile), null, 2));
}
