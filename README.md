<p align="right"><a href="README.zh-CN.md">简体中文</a></p>

<p align="center">
  <img src="docs/readme/hero.svg" width="100%" alt="MZ Crayon Illustrations turns one source-grounded judgment into one physical metaphor, one Muzi action, and a review-ready 16:9 illustration">
</p>

# MZ Crayon Illustrations

One judgment. One physical metaphor. One readable 16:9 story.

MZ Crayon Illustrations is a review-first agent Skill for knowledge content. It preserves the independent Muzi narrator identity, derives factual labels only from user-provided material, and stops at local `READY_FOR_REVIEW`.

## Meet the action system

![Sixteen Muzi semantic actions grouped by input, judgment, execution, and expression](mz-crayon-illustrations/assets/identity/muzi-crayon-action-index.png)

The Skill chooses one of these sixteen semantic actions only when the meaning and composition genuinely fit. It switches to a controlled `free` pose for comparisons, environments, sequences, or complex interactions that one library action cannot express naturally.

| Action mode | Use it when |
| --- | --- |
| `library` | One semantic action and its hand-to-object relationship fit the judgment. |
| `free` | The image needs a comparison, environment, sequence, or multi-object interaction. |

## What stays locked

- **Muzi identity** — an independent, cross-project knowledge narrator, not a Munan mascot.
- **Visual DNA** — wax-crayon texture, warm-white space, deep-navy outlines, mustard blocks, and restrained rust-red annotations.
- **Source fidelity** — named facts, objects, and 3–6 short Chinese labels come only from user-provided content.
- **Narrative focus** — one judgment, one original physical metaphor, one readable flow.
- **Companion boundary** — the optional Ragdoll cat supports the scene but never becomes a knowledge object or replaces Muzi.

## From judgment to review

1. **Extract one judgment** — do not squeeze an entire article or several parallel ideas into one image.
2. **Design the physical story** — choose the information structure, original metaphor, object roles, Muzi action, companion state, labels, and quiet area.
3. **Generate and inspect** — create a 1672×941 PNG, then check identity, anatomy, crayon medium, composition, roles, flow, labels, and companion state.
4. **Write review evidence** — validate a `creator.muzi-crayon-review/3` record and stop at `READY_FOR_REVIEW`; repeated failures stop without a valid review.

## Install

Install the current v1.1.1 code from `main` with Codex:

```text
$skill-installer install https://github.com/MuziGeek/mz-crayon-illustrations/tree/main/mz-crayon-illustrations
```

The latest published tag is still `v1.0.0`; use `main` for the v1.1.1 Visual Engine handoff until a v1.1.1 release is published.

## First use

```text
Use $mz-crayon-illustrations to turn this article's main judgment into one 16:9 knowledge illustration.
Use $mz-crayon-illustrations to show why collecting information is not the same as retrieving it.
```

## MZ Visual Engine handoff

The Skill can accept a validated `mz.visual-brief/1` only for `knowledge-illustration + mz-crayon-v2`. The brief may carry intent, content constraints, and locked labels; it cannot override Muzi identity, companion rules, action selection, source facts, QA, or user acceptance.

## Review and release boundary

Generation, local QA, user acceptance, and external release are separate stages. The Skill never uploads, publishes, replaces account assets, retrieves unapproved external facts, invents factual labels, or claims acceptance.

## License

Code and documentation are MIT licensed. MZ/Muzi reference artwork uses the [MZ Reference Asset License 1.0](ASSET_LICENSE.md). See [NOTICE.md](NOTICE.md).
