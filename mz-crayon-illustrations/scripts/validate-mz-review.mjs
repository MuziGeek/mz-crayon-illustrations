import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) { throw new Error(`Invalid MZ crayon review: ${message}`); }
const STRUCTURES = ["single-point", "comparison", "sequence", "state", "environment", "focus"];
const ROLES = ["problem", "action", "result", "state"];
const KEYS = ["schema", "status", "judgment", "structure", "density", "metaphor", "objects", "storyFlow", "characterMode", "characterProfile", "lockedLabels", "regenerationRounds", "textRevisionRounds", "outputPath"];
function exact(value, keys, label) { if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`); const actual=Object.keys(value); const missing=keys.filter((key)=>!actual.includes(key)); const extra=actual.filter((key)=>!keys.includes(key)); if (missing.length || extra.length) fail(`${label} keys mismatch; missing=${missing.join(",")} extra=${extra.join(",")}`); }
function text(value, key) { if (typeof value !== "string" || !value.trim()) fail(`${key} is required`); }
function round(value, key) { if (!Number.isInteger(value) || value < 0 || value > 2) fail(`${key} must be 0-2`); }
async function pngSize(file) { const data=await fs.readFile(file); if (data.length<24 || data.toString("ascii",1,4)!=="PNG") fail("output is not a PNG"); return {width:data.readUInt32BE(16),height:data.readUInt32BE(20)}; }
export async function validateMzReview(review, reviewFile) {
  exact(review,KEYS,"review"); if (review.schema!=="creator.mz-crayon-review/1" || review.status!=="READY_FOR_REVIEW") fail("unexpected schema or status");
  for (const key of ["judgment","metaphor","storyFlow","outputPath"]) text(review[key],key); if (!STRUCTURES.includes(review.structure)) fail("unsupported structure"); if (!["minimal","narrative"].includes(review.density)) fail("density must be minimal or narrative");
  const min=review.density==="minimal"?1:3; const max=review.density==="minimal"?3:6; if (!Array.isArray(review.objects)||review.objects.length<min||review.objects.length>max) fail(`objects must contain ${min}-${max} items`);
  for (const [index,object] of review.objects.entries()) { exact(object,["name","role"],`objects[${index}]`); text(object.name,`objects[${index}].name`); if (!ROLES.includes(object.role)) fail("unsupported object role"); }
  if (!Array.isArray(review.lockedLabels)||review.lockedLabels.length<3||review.lockedLabels.length>6||new Set(review.lockedLabels).size!==review.lockedLabels.length) fail("lockedLabels must contain 3-6 unique labels");
  if (!["none","external"].includes(review.characterMode)) fail("characterMode must be none or external"); if (review.characterMode==="none"&&review.characterProfile!==null) fail("none requires null characterProfile");
  if (review.characterMode==="external") { exact(review.characterProfile,["id","version","extensionId","manifestHash"],"characterProfile"); for (const key of ["id","version","extensionId"]) text(review.characterProfile[key],`characterProfile.${key}`); if (!/^[0-9a-f]{64}$/.test(review.characterProfile.manifestHash)) fail("invalid characterProfile manifestHash"); }
  round(review.regenerationRounds,"regenerationRounds"); round(review.textRevisionRounds,"textRevisionRounds"); const output=path.resolve(path.dirname(reviewFile),review.outputPath); if (path.extname(output).toLowerCase()!==".png") fail("outputPath must reference a PNG"); const size=await pngSize(output); if (size.width!==1672||size.height!==941) fail(`output must be 1672x941 PNG, got ${size.width}x${size.height}`); return {ok:true,schema:review.schema,outputPath:output,...size};
}
if (process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) { const index=process.argv.indexOf("--file"); if (index<0||!process.argv[index+1]) fail("use --file <review.json>"); const file=path.resolve(process.argv[index+1]); console.log(JSON.stringify(await validateMzReview(JSON.parse(await fs.readFile(file,"utf8")),file),null,2)); }
