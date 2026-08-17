import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scripts = path.dirname(fileURLToPath(import.meta.url));
const validator = path.join(scripts, "validate_visual_brief.py");

function resolvedBrief(preset = "mz-crayon-base-v1") {
  return {
    format: "mz.visual-brief/1", engineVersion: "2.0.0", status: "RESOLVED",
    request: { summary: "Explain a knowledge judgment" }, intent: {},
    asset: { profile: "knowledge-illustration" },
    style: { preset: { id: preset } },
    target: { skill: "mz-crayon-illustrations", mode: "knowledge-illustration" },
    generation: {}, provenance: {},
    engineCompat: { format: "mz.engine-compat/1", engineVersion: "2.0.0", target: "illustration", snapshotHash: "a4772aff862a3298fa2bb92ad5d4db0b3513b232b399d2e76b235334d0548eb8", sourceCatalogHash: "2f74eaa8d55b4037b702c200ace510b9b9a7680c861070be0c04ee04e9824ed0" }
  };
}

test("accepts a resolved crayon knowledge-illustration brief", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    await writeFile(file, JSON.stringify(resolvedBrief()), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects a non-crayon illustration preset", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    await writeFile(file, JSON.stringify(resolvedBrief("mz-block-v1")), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects Colorblock for knowledge illustrations", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    await writeFile(file, JSON.stringify(resolvedBrief("mz-colorblock-v1")), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects Isometric for knowledge illustrations", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    await writeFile(file, JSON.stringify(resolvedBrief("mz-isometric-v1")), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects Macro Voxel for knowledge illustrations", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    await writeFile(file, JSON.stringify(resolvedBrief("mz-voxel-macro-v1")), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects Sticker for knowledge illustrations", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    await writeFile(file, JSON.stringify(resolvedBrief("mz-sticker-v1")), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects Cartoon for knowledge illustrations", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    await writeFile(file, JSON.stringify(resolvedBrief("mz-cartoon-v1")), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects Animal Badge for knowledge illustrations", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    await writeFile(file, JSON.stringify(resolvedBrief("mz-animal-badge-v1")), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects Realistic objects for knowledge illustrations", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    await writeFile(file, JSON.stringify(resolvedBrief("mz-realistic-v1")), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects a mismatched Engine version", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "mz-brief-"));
  try {
    const file = path.join(dir, "brief.json");
    const brief = resolvedBrief();
    brief.engineVersion = "1.0.0";
    await writeFile(file, JSON.stringify(brief), "utf8");
    const result = spawnSync("python", [validator, file], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
