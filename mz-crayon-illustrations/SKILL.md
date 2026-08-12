---
name: mz-crayon-illustrations
description: Generate review-first 16:9 knowledge illustrations with the independent Muzi personal IP in a strong hand-drawn crayon style. Use when the user explicitly requests a Muzi illustration, Muzi crayon illustration, personal-IP crayon illustration, or Muzi knowledge illustration.
---

# MZ Crayon Illustrations

Generate one-judgment-per-image personal-IP illustrations for knowledge content. Treat Muzi as an independent, cross-project knowledge narrator rather than a Munan brand mascot. Do not use this Skill for Munan tree spirits, knitted-product visuals, brand logos, or generic illustration requests that do not explicitly ask for Muzi.

## Independent scope

- Run without any content project, controller, digest, platform plan, or release gate after the user explicitly requests a Muzi illustration and provides content or a core judgment.
- When another project invokes this Skill, follow that project's permissions and release rules without treating them as dependencies of this Skill.
- Stop at local `READY_FOR_REVIEW`. Do not upload, publish, replace account avatars, or automatically retrieve external images, landmarks, brands, or facts.

## Prerequisites

1. Extract one visually explainable core judgment. Do not squeeze an entire article or several parallel ideas into one image.
2. Derive facts, named objects, and labels only from user-provided content and assets. Use generic terms or omit details that cannot be confirmed.
3. Read [Identity and action references](references/identity.md), [Style DNA](references/style-dna.md), [Composition patterns](references/composition-patterns.md), and [Action library](references/action-library.md).

## Workflow

1. Write a shot spec containing `core judgment`, `information structure`, `composition`, `density`, `original physical metaphor`, `named objects and roles`, `story flow`, `Muzi action`, `action mode`, `companion mode`, `companion rationale`, `cat pose and placement`, `3–6 locked short Chinese labels`, and `quiet-area position`. Invent the metaphor for this image; never reuse another illustration or fixed scene template.
2. First try to match one of the 16 core actions by meaning. Use `library` when the action and composition clearly match. Use `free` when a comparison, environment, sequence, or complex interaction cannot be expressed naturally by one action reference. Choose companion `include` or `exclude` using the scene rules in [Identity and action references](references/identity.md). Resolve references with `scripts/get-reference-set.ps1 -Action <id> -Companion <include|exclude>`; never load two action references.
3. Use [Prompt template](references/prompt-template.md) and assemble the prompt in this order: identity anchors, companion identity, crayon style, composition, judgment, object roles, story flow, Muzi action, cat pose, labels, and exclusions. Action references may lock only pose and hand-to-object relationships; the cat master may lock only companion identity. Neither may override Muzi identity, outfit, proportions, objects, or composition.
4. Generate a 1672×941 PNG. Muzi must actively judge, operate, connect, guide, or explain. Domain objects may carry the knowledge, but Muzi must not become a decorative corner mascot.
5. Use [QA checklist](references/qa-checklist.md) to check Muzi identity, outfit, crayon medium, active participation, anatomy, composition, roles, flow, labels, and the selected companion state. Regenerate at most twice for identity, composition, anatomy, or companion failures. If the image still fails, stop without writing a valid review. Allow at most two local text-correction rounds.
6. Validate with `scripts/validate-muzi-review.mjs --file <review.json>` and save a `creator.muzi-crayon-review/3` record with the PNG. Continue to validate historical `/1` and `/2` records, but write all new outputs as `/3`.

## MZ Visual Engine handoff

When the user supplies an `mz.visual-brief/1`, validate it first with `python scripts/validate_visual_brief.py <brief.json>`. Accept only a resolved `knowledge-illustration` brief using `mz-crayon-v2`. The brief may provide intent, content constraints, and locked labels, but it never overrides Muzi identity, outfit, companion rules, action selection, source facts, QA, or user acceptance.

The bundled `references/visual-engine/` snapshot is the versioned Engine subset for this Skill. Do not edit it by hand; replace it only with an Engine export after running `python references/visual-engine/scripts/verify_snapshot.py references/visual-engine`.

## Preserve

- Muzi identity: a rounded adult male character with a large head and small body, shoulder-length dark hair, sunglasses resting on the head, large eyes, and a calm, friendly expression. Use `assets/identity/muzi-crayon-master.png` as the identity authority.
- Companion identity: one small long-haired colorpoint Ragdoll cat with a cream coat, deep-navy/gray-brown face, ears, paws and plume tail, and muted ice-blue eyes. Use `assets/identity/muzi-crayon-cat-master.png` only when companion mode is `include`.
- Visual treatment: warm-white background with a large quiet area; uneven deep-navy crayon outlines; large mustard blocks; rust red only for annotations or key accents; muted ice blue only for included cat eyes; limited flat fills and visible wax-crayon strokes.
- Narrative: one judgment, one original physical metaphor, and one readable flow. Use 1–3 objects for `minimal` and 3–6 objects for `narrative`. The companion cat never counts as a knowledge object, carries a label, anchors an arrow, or displaces Muzi.
- Labels: include only 3–6 short Chinese labels locked from user input. Do not include internal production labels, title placeholders, or unconfirmed facts.

## Avoid

- Photo repainting, continuous gradients, realistic skin shaping, realistic hair or fabric texture, photographic depth of field, 3D, polished cel anime, or presentation grids.
- Munan knitted tree spirits, moss-green tree rings, knitting symbols, brand logos, bows, platform interfaces, text watermarks, or extra people.
- Copying any external IP character, composition, example, or visual signature.

## Resources

- [Identity and action references](references/identity.md): decide when to load the masters or one action reference.
- [Action library](references/action-library.md): define the semantic boundaries and selection rules for 16 core actions.
- [Style DNA](references/style-dna.md): define color, line, flat-fill, and exclusion rules.
- [Composition patterns](references/composition-patterns.md): map a core judgment to information structure, object roles, story flow, and composition.
- [Prompt template](references/prompt-template.md): assemble a reviewable image-generation prompt.
- [QA checklist](references/qa-checklist.md): perform pre-generation and post-generation checks.
- `references/review.schema.json`: validate new `creator.muzi-crayon-review/3` records.
- `references/review-v2.schema.json`: validate historical `/2` records.
- `references/review-v1.schema.json`: validate historical `/1` records.
- `THIRD_PARTY_NOTICES.md`: document selectively adapted Gimi methods and license terms.
- `scripts/get-reference-set.ps1`: resolve the allowed reference set.
- `scripts/validate-action-library.mjs`: validate the action manifest, files, dimensions, and hashes.
- `scripts/build-action-index.ps1`: rebuild the human-only action index; never include the index in generation references.
- `scripts/validate-muzi-review.mjs`: validate review JSON and PNG specifications.
