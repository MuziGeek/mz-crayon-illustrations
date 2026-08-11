import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateMuziReview } from "./validate-muzi-review.mjs";

function png1672x941() {
  const png = Buffer.alloc(24);
  png.write("\x89PNG\r\n\x1a\n", 0, "binary");
  png.writeUInt32BE(13, 8); png.write("IHDR", 12, "ascii");
  png.writeUInt32BE(1672, 16); png.writeUInt32BE(941, 20);
  return png;
}

function v1Review(overrides = {}) {
  return {
    schema: "creator.muzi-crayon-review/1",
    status: "READY_FOR_REVIEW",
    judgment: "关系让信息可用",
    metaphor: "用线绳连接两张卡片",
    muziAction: "connect",
    lockedLabels: ["收集", "连接", "复用"],
    textRevisionRounds: 1,
    outputPath: "image.png",
    ...overrides,
  };
}

function v2Review(overrides = {}) {
  return {
    schema: "creator.muzi-crayon-review/2",
    status: "READY_FOR_REVIEW",
    judgment: "关系让信息可用",
    structure: "sequence",
    composition: "sequence",
    density: "narrative",
    metaphor: "木子把散落记录接成可复用路径",
    objects: [
      { name: "记录卡", role: "problem" },
      { name: "连接线", role: "action" },
      { name: "资料盒", role: "result" },
    ],
    storyFlow: "散落记录 → 木子连接 → 资料入盒",
    actionMode: "library",
    actionReference: "connect",
    muziAction: "木子双手拉紧连接线，把记录卡接到资料盒",
    lockedLabels: ["收集", "连接", "复用"],
    identityChecks: {
      faceAndHair: true,
      sunglasses: true,
      outfitAndProportion: true,
      crayonStyle: true,
      activeParticipation: true,
    },
    regenerationRounds: 1,
    textRevisionRounds: 1,
    outputPath: "image.png",
    ...overrides,
  };
}

function v3Review(overrides = {}) {
  return {
    ...v2Review(),
    schema: "creator.muzi-crayon-review/3",
    companion: {
      mode: "exclude",
      rationale: "高密度序列需要保留标签和安静区域",
      poseAndPlacement: null,
    },
    companionChecks: null,
    ...overrides,
  };
}

async function fixture(review) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "muzi-review-"));
  await fs.writeFile(path.join(dir, "image.png"), png1672x941());
  const file = path.join(dir, "review.json");
  await fs.writeFile(file, JSON.stringify(review));
  return { dir, file, review };
}

async function withFixture(review, callback) {
  const item = await fixture(review);
  try { return await callback(item); }
  finally { await fs.rm(item.dir, { recursive: true, force: true }); }
}

test("keeps v1 review compatibility", async () => {
  await withFixture(v1Review(), async ({ review, file }) => {
    const result = await validateMuziReview(review, file);
    assert.equal(result.ok, true);
    assert.equal(result.schema, "creator.muzi-crayon-review/1");
  });
});

test("accepts a v2 library-action narrative review", async () => {
  await withFixture(v2Review(), async ({ review, file }) => {
    const result = await validateMuziReview(review, file);
    assert.equal(result.ok, true);
    assert.equal(result.schema, "creator.muzi-crayon-review/2");
  });
});

test("accepts a v2 free-pose minimal review", async () => {
  const review = v2Review({
    structure: "focus",
    composition: "information-focus",
    density: "minimal",
    objects: [{ name: "关键卡片", role: "result" }],
    storyFlow: "木子的视线与手势 → 关键卡片 → 结论标签",
    actionMode: "free",
    actionReference: null,
    muziAction: "木子侧身托起关键卡片，并用另一只手引导读者视线",
  });
  await withFixture(review, async ({ file }) => {
    assert.equal((await validateMuziReview(review, file)).ok, true);
  });
});

test("accepts a v3 review with an excluded companion", async () => {
  const review = v3Review();
  await withFixture(review, async ({ file }) => {
    const result = await validateMuziReview(review, file);
    assert.equal(result.ok, true);
    assert.equal(result.schema, "creator.muzi-crayon-review/3");
  });
});

test("accepts a v3 review with an included passive companion", async () => {
  const review = v3Review({
    structure: "focus",
    composition: "emotion-closeup",
    density: "minimal",
    objects: [{ name: "关键卡片", role: "result" }],
    companion: {
      mode: "include",
      rationale: "低密度反思场景适合用陪伴角色呼应情绪",
      poseAndPlacement: "布偶猫坐在木子脚边，抬头看向木子，不触碰卡片",
    },
    companionChecks: {
      identity: true,
      subordinateScale: true,
      passiveRole: true,
    },
  });
  await withFixture(review, async ({ file }) => {
    assert.equal((await validateMuziReview(review, file)).ok, true);
  });
});

test("rejects action-mode conflicts", async () => {
  const cases = [
    v2Review({ actionMode: "library", actionReference: null }),
    v2Review({ actionMode: "free", actionReference: "connect" }),
  ];
  for (const review of cases) {
    await withFixture(review, async ({ file }) => {
      await assert.rejects(validateMuziReview(review, file), /actionReference/);
    });
  }
});

test("rejects unknown composition, density mismatches, and duplicate objects", async () => {
  const cases = [
    [v2Review({ composition: "poster-grid" }), /composition must be one of/],
    [v2Review({
      density: "minimal",
      objects: [
        { name: "记录卡", role: "problem" },
        { name: "连接线", role: "action" },
        { name: "资料盒", role: "result" },
        { name: "状态灯", role: "state" },
      ],
    }), /minimal objects must contain 1-3/],
    [v2Review({ objects: [
      { name: "记录卡", role: "problem" },
      { name: "记录卡", role: "action" },
      { name: "资料盒", role: "result" },
    ] }), /objects names must be unique/],
  ];
  for (const [review, pattern] of cases) {
    await withFixture(review, async ({ file }) => {
      await assert.rejects(validateMuziReview(review, file), pattern);
    });
  }
});

test("rejects failed identity checks and missing story flow", async () => {
  const failedIdentity = v2Review({ identityChecks: { ...v2Review().identityChecks, sunglasses: false } });
  const missingFlow = v2Review({ storyFlow: "" });
  await withFixture(failedIdentity, async ({ file }) => {
    await assert.rejects(validateMuziReview(failedIdentity, file), /identityChecks\.sunglasses must be true/);
  });
  await withFixture(missingFlow, async ({ file }) => {
    await assert.rejects(validateMuziReview(missingFlow, file), /storyFlow is required/);
  });
});

test("rejects invalid v3 companion states", async () => {
  const missingPose = v3Review({
    companion: { mode: "include", rationale: "适合陪伴", poseAndPlacement: null },
    companionChecks: { identity: true, subordinateScale: true, passiveRole: true },
  });
  const failedScale = v3Review({
    companion: { mode: "include", rationale: "适合陪伴", poseAndPlacement: "猫坐在木子脚边" },
    companionChecks: { identity: true, subordinateScale: false, passiveRole: true },
  });
  const excludedWithChecks = v3Review({
    companion: { mode: "exclude", rationale: "序列图不加入陪伴角色", poseAndPlacement: null },
    companionChecks: { identity: true, subordinateScale: true, passiveRole: true },
  });
  for (const [review, pattern] of [
    [missingPose, /companion\.poseAndPlacement is required/],
    [failedScale, /companionChecks\.subordinateScale must be true/],
    [excludedWithChecks, /excluded companionChecks must be null/],
  ]) {
    await withFixture(review, async ({ file }) => {
      await assert.rejects(validateMuziReview(review, file), pattern);
    });
  }
});

test("rejects invalid labels and output dimensions", async () => {
  const badLabels = v2Review({ lockedLabels: ["图1", "图2", "图3"] });
  await withFixture(badLabels, async ({ file }) => {
    await assert.rejects(validateMuziReview(badLabels, file), /internal production labels/);
  });

  const item = await fixture(v2Review());
  try {
    await fs.writeFile(path.join(item.dir, "image.png"), Buffer.from("not png"));
    await assert.rejects(validateMuziReview(item.review, item.file), /not a PNG/);
  } finally {
    await fs.rm(item.dir, { recursive: true, force: true });
  }
});
