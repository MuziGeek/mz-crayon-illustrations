<p align="right"><a href="README.zh-CN.md">简体中文</a></p>

<p align="center">
  <img src="docs/readme/hero.svg" width="100%" alt="MZ Crayon Illustrations turns one source-grounded judgment into an identity-neutral 16:9 visual story">
</p>

# MZ Crayon Illustrations

One judgment. One physical metaphor. One readable 16:9 story.

MZ Crayon Illustrations is a public, review-first Skill for knowledge content. Direct use is identity-neutral and object-led. A character route is available only when a validated external Character Profile arrives through an explicitly loaded Extension.

## Public visual grammar

- **Source fidelity** — named facts, objects, and short labels come only from user-provided content.
- **Narrative focus** — one judgment, one original physical metaphor, one readable flow.
- **Crayon medium** — visible wax grain, imperfect edges, warm paper, and restrained annotation marks.
- **Identity neutrality** — no recurring personal character, companion, private palette, or authority image is bundled.
- **Review boundary** — mechanical checks and visual QA may produce `READY_FOR_REVIEW`; only the user can accept or publish.

## From judgment to review

1. Extract one judgment instead of compressing an entire article into one image.
2. Design an object-led physical story with clear roles, flow, labels, and quiet space.
3. Generate a 1672×941 PNG and inspect composition, crayon medium, source fidelity, readability, and originality.
4. Validate a `creator.mz-crayon-review/1` record and stop at `READY_FOR_REVIEW`.

## Install

Install the current v2.0.0 public interface from `main` with Codex:

```text
$skill-installer install https://github.com/MuziGeek/mz-crayon-illustrations/tree/main/mz-crayon-illustrations
```

## First use

```text
Use $mz-crayon-illustrations to turn this article's main judgment into one 16:9 knowledge illustration.
Use $mz-crayon-illustrations to show why collecting information is not the same as retrieving it.
```

## MZ Visual Engine handoff

The Skill accepts a validated `mz.visual-brief/1` for `knowledge-illustration + mz-crayon-base-v1`. It also accepts a namespaced character Preset only when the matching Extension is supplied explicitly and its hash is valid. Neither path can override source facts, format constraints, originality, QA, or user acceptance.

## License

Code, documentation, and public workflow contracts are MIT licensed. No private identity assets are distributed.
