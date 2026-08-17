---
name: mz-crayon-illustrations
description: Generate review-first 16:9 knowledge illustrations using object-led physical metaphors and a neutral public crayon system. Use when the user asks for a crayon knowledge illustration, article illustration, visual explanation, or supplies a resolved mz.visual-brief/1 for the knowledge-illustration profile. A character is used only through an explicit validated external Character Profile.
---

# MZ Crayon Illustrations

Generate one-judgment-per-image knowledge illustrations. Default to object-led narrative with no recurring mascot or bundled private identity.

## Scope

- Derive facts, named objects, and 3–6 locked labels only from user-provided content and assets.
- Stop at local `READY_FOR_REVIEW`. Do not upload, publish, retrieve external facts or images, or accept an asset for the user.
- When another project invokes this Skill, preserve that project's permissions and release gates.

## Workflow

1. Read [Composition patterns](references/composition-patterns.md), [public Style DNA](references/style-dna.md), [Prompt template](references/prompt-template.md), and [QA checklist](references/qa-checklist.md).
2. Write a shot spec with one core judgment, information structure, density, original physical metaphor, 1–6 named objects and roles, story flow, 3–6 locked labels, and quiet-area position.
3. Default `characterMode` to `none`. Use `external` only when a resolved Engine brief contains a validated explicit `characterProfile`; never discover or infer an identity pack.
4. Generate a 1672×941 PNG. Objects and their physical relationships must carry the knowledge; an external character, when allowed, must participate rather than decorate a corner.
5. Run the QA checklist. Regenerate at most twice for composition, anatomy, character-profile, or medium failures and allow at most two local text-correction rounds. Stop without a valid review after the limit.
6. Save `creator.mz-crayon-review/1` and validate it with `node scripts/validate-mz-review.mjs --file <review.json>`.

## MZ Visual Engine handoff

Validate a supplied brief with `python scripts/validate_visual_brief.py <brief.json>`. Accept a resolved `knowledge-illustration` handoff using the public `mz-crayon-base-v1` or an explicitly loaded namespaced Extension Preset for that profile. A brief never weakens source facts, originality, format, QA, retry, or user-acceptance rules.

The bundled `references/visual-engine/` directory is a versioned Engine Snapshot. Replace it only through Engine export and verify it after replacement.

## Preserve

- Public treatment: neutral clean canvas, charcoal dry-media outlines, restrained semantic accents, limited flat fills, visible but controlled crayon grain, and generous quiet space.
- Narrative: one judgment, one original metaphor, and one readable flow. Use 1–3 objects for `minimal` and 3–6 for `narrative`.
- External character: require a validated Character Profile and explicit Extension provenance. Never bundle or echo private asset paths into public outputs.
- Keep generated output outside this Skill directory.

## Avoid

- Fixed mascots, bundled private identities, identity imitation, unconfirmed facts, extra labels, logos, watermarks, or third-party visual signatures.
- Photo repainting, continuous gradients, realistic material rendering, photographic depth of field, 3D, polished cel anime, or presentation grids.

## Resources

- [Composition patterns](references/composition-patterns.md)
- [Style DNA](references/style-dna.md)
- [Prompt template](references/prompt-template.md)
- [QA checklist](references/qa-checklist.md)
- `references/review.schema.json`
- `scripts/validate-mz-review.mjs`
- `scripts/validate_visual_brief.py`
