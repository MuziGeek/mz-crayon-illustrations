# 提示词模板

每张图单独组装，顺序固定为：木子身份锚点 → 陪伴角色身份 → 蜡笔风格 → 构图 → 核心判断 → 物件与分工 → 故事动线 → 木子动作 → 小猫姿态 → 标签 → 禁用项。身份和穿搭约束优先于动作、构图与场景。

```text
Use case: independent review-first Muzi knowledge illustration
Asset type: one judgment, one 1672×941 16:9 PNG

Identity references:
- The identity master locks Muzi's rounded adult male face, shoulder-length dark hair, sunglasses resting on the head, large eyes, calm friendly expression, and adult big-head/small-body proportions.
- The full-body master locks the black varsity jacket, charcoal loose straight-leg trousers, black-and-white sneakers, and full-body proportions.
- Action mode: <library | free>.
- Action reference: <one core action id | none>. When present, it controls only pose, balance, and hand-to-prop relation. Do not copy its props, scene, labels, or composition. It must never override identity, outfit, proportions, palette, or line style.

Companion reference:
- Companion mode: <include | exclude>.
- Companion rationale: <why this scene benefits from the cat or why it must stay clear>.
- When included, the cat master locks one small long-haired colorpoint Ragdoll: cream long coat, deep-navy/gray-brown face, ears, paws and plume tail, and muted ice-blue eyes. It controls identity only, never pose or composition.
- When excluded, include no cat or cat-like mascot.

Style DNA:
strong hand-drawn wax-crayon anime illustration; warm-white background; uneven deep-navy crayon outer lines; mustard flat color blocks; rust-red annotations or key accents only; warm white, skin tone and gray-brown supporting colors; muted ice blue only in included cat eyes; limited flat fills and visible wax-crayon strokes; about one-third calm negative space

Composition:
- Information structure: <single-point | comparison | sequence | state | environment | focus>.
- Composition pattern: <centered | side-by-side | character-action | object-closeup | environment-metaphor | mini-metaphor | sequence | information-focus | emotion-closeup>.
- Density: <minimal | narrative>.
- Framing: <full body / at least two-thirds body / half-body close-up> at <position>, with quiet area at <side>.

Reader takeaway: <one approved or user-provided judgment sentence>.
Original physical metaphor: <new physical relationship, not a reused scene>.

Named objects and roles:
- <object>: <problem | action | result | state>
<repeat for 1–3 minimal objects or 3–6 narrative objects>

Muzi action: <complete description of body, hands, gaze, and relation to the main object>.
Story flow: <A → B → C using gaze, gesture, arrows, or path; minimal shots still state the visual route>.
Muzi must actively judge, operate, connect, guide, or explain. Domain objects may carry the knowledge, but Muzi cannot be a decorative corner mascot.

Cat pose and placement: <complete description when included | none when excluded>. Keep the cat inside Muzi's character group and at no more than about one-third of Muzi's visible character area. The cat may echo gaze or emotion but must not hold props, touch the main object, carry a label, anchor an arrow, occupy quiet space, count as a named object, or become a story-flow node.

Chinese labels, exact and locked from user input: <3–6 short labels>. Attach every label to its corresponding object or story-flow node. No other text.

Constraints:
- minimal density has 1–3 named objects; narrative density has 3–6 named objects
- use size, position, line weight, and whitespace for hierarchy; do not add colors for density
- use only facts, named objects, and labels available in the user's input or supplied assets
- no automatic external landmark, brand, interface, image, or fact lookup
- include at most one companion cat; explicit user choice overrides automatic selection
- otherwise include it only for lifestyle, companionship, emotion, personal reflection, or minimal-density reading, inspecting, writing, or explaining; exclude it for comparison, sequence, narrative density, stop-check, or strict technical diagrams

Avoid:
photo texture, gradients, realistic skin, individual realistic fur strands, collars, bows, cat clothing, extra cats, 3D, polished cel anime, PPT grid, soft-blue/soft-orange Gimi palette, warm storybook watercolor, product-proposal flat style, Gimi horse-hood character or any Gimi IP anchor, Munan tree spirit, moss green, knit symbols, logos, watermarks, platform UI, extra people, unconfirmed facts, unauthorized text
```

空间、流程和手物关系优先全身或至少三分之二身；只有情绪、阅读、审视等确需细节时才使用半身近景。若标签无法可靠渲染，保留人物与构图，只按已锁定原文做最多两轮局部修订；不得为修字重构身份或改写标签。
