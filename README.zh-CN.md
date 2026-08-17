<p align="right"><a href="README.md">English</a></p>

<p align="center">
  <img src="docs/readme/hero.svg" width="100%" alt="MZ Crayon Illustrations 把一个有来源依据的判断转化为身份中立的 16:9 视觉故事">
</p>

# MZ Crayon Illustrations

一个判断，一个物理隐喻，一条清晰的 16:9 故事流。

MZ Crayon Illustrations 是一个公共、评审优先的知识插画 Skill。直接调用时采用身份中立、物件叙事的路线；只有显式加载 Extension 并提供通过校验的外部 Character Profile，才会进入人物路线。

## 公共视觉语法

- **来源忠实** — 具名事实、物件和短标签只来自用户提供的内容。
- **叙事聚焦** — 一个判断、一个原创物理隐喻、一条可读故事流。
- **蜡笔媒介** — 可见蜡粒、略不规整的边缘、暖纸底与克制的批注痕迹。
- **身份中立** — 公共包不含固定个人角色、伙伴、私有配色或权威图。
- **评审边界** — 机械检查与视觉 QA 最多进入 `READY_FOR_REVIEW`；只有用户能验收或发布。

## 从判断到评审

1. 提取一个判断，不把整篇文章塞进一张图。
2. 设计以物件为主的物理故事，明确角色、流向、标签与留白。
3. 生成 1672×941 PNG，检查构图、蜡笔媒介、来源忠实、可读性与原创性。
4. 校验 `creator.mz-crayon-review/1` 记录并停在 `READY_FOR_REVIEW`。

## 安装

使用 Codex 从 `main` 安装当前 v2.0.0 公共接口：

```text
$skill-installer install https://github.com/MuziGeek/mz-crayon-illustrations/tree/main/mz-crayon-illustrations
```

## 第一次使用

```text
Use $mz-crayon-illustrations to turn this article's main judgment into one 16:9 knowledge illustration.
Use $mz-crayon-illustrations to show why collecting information is not the same as retrieving it.
```

## MZ Visual Engine 交接

Skill 接受用于 `knowledge-illustration + mz-crayon-base-v1` 的已校验 `mz.visual-brief/1`。只有显式提供匹配 Extension 且哈希有效时，才接受带命名空间的人物 Preset。两条路线都不能覆盖来源事实、格式约束、原创性、QA 或用户验收。

## 许可证

代码、文档与公共工作流契约使用 MIT 许可证。公共发行包不分发任何私有身份资产。
