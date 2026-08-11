import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateActionLibrary } from "./validate-action-library.mjs";

const groups = [
  ["collect", "read", "inspect", "compare"],
  ["sort", "connect", "decide", "stop-check"],
  ["build", "write", "test", "repair"],
  ["explain", "retrieve", "share", "deliver"],
];

function png1254(marker) {
  const png = Buffer.alloc(25);
  png.write("\x89PNG\r\n\x1a\n", 0, "binary");
  png.writeUInt32BE(13, 8); png.write("IHDR", 12, "ascii");
  png.writeUInt32BE(1254, 16); png.writeUInt32BE(1254, 20); png[24] = marker;
  return png;
}

async function fixture() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "muzi-actions-"));
  const categories = [];
  let marker = 1;
  for (let categoryIndex = 0; categoryIndex < groups.length; categoryIndex += 1) {
    const actions = [];
    for (const id of groups[categoryIndex]) {
      const data = png1254(marker++);
      const file = `${id}.png`;
      await fs.writeFile(path.join(dir, file), data);
      actions.push({ id, label: id, useWhen: id, file, sha256: crypto.createHash("sha256").update(data).digest("hex") });
    }
    categories.push({ id: `group-${categoryIndex}`, label: `group-${categoryIndex}`, actions });
  }
  const companionData = png1254(marker++);
  await fs.writeFile(path.join(dir, "ragdoll-cat.png"), companionData);
  const manifest = {
    schema: "creator.muzi-crayon-action-library/1",
    status: "READY_FOR_REVIEW",
    imageContract: { width: 1254, height: 1254, format: "png" },
    categories,
    companion: {
      id: "ragdoll-cat",
      label: "ragdoll-cat",
      useWhen: "scene-selected visual companion",
      file: "ragdoll-cat.png",
      sha256: crypto.createHash("sha256").update(companionData).digest("hex"),
    },
  };
  const file = path.join(dir, "action-library.json");
  await fs.writeFile(file, JSON.stringify(manifest));
  return { dir, file, manifest };
}

test("accepts the complete four-by-four action library", async () => {
  const item = await fixture();
  try {
    const result = await validateActionLibrary(item.manifest, item.file);
    assert.equal(result.ok, true);
    assert.equal(result.coreActionCount, 16);
    assert.equal(result.companionCount, 1);
    assert.equal(result.inspected.length, 17);
  } finally {
    await fs.rm(item.dir, { recursive: true, force: true });
  }
});

test("rejects retired optional actions and a missing companion identity", async () => {
  const retired = await fixture();
  const missing = await fixture();
  retired.manifest.optionalActions = [];
  delete missing.manifest.companion;
  try {
    await assert.rejects(validateActionLibrary(retired.manifest, retired.file), /optionalActions is retired/);
    await assert.rejects(validateActionLibrary(missing.manifest, missing.file), /companion identity is required/);
  } finally {
    await Promise.all([retired, missing].map((item) => fs.rm(item.dir, { recursive: true, force: true })));
  }
});

test("rejects a hash mismatch and an incomplete category", async () => {
  const badHash = await fixture();
  const incomplete = await fixture();
  badHash.manifest.categories[0].actions[0].sha256 = "0".repeat(64);
  incomplete.manifest.categories[0].actions.pop();
  try {
    await assert.rejects(validateActionLibrary(badHash.manifest, badHash.file), /sha256 mismatch/);
    await assert.rejects(validateActionLibrary(incomplete.manifest, incomplete.file), /must contain four actions/);
  } finally {
    await Promise.all([badHash, incomplete].map((item) => fs.rm(item.dir, { recursive: true, force: true })));
  }
});
