# MZ Crayon Illustrations

一个评审优先的 Agent Skill，把一个清晰的知识判断转化为原创 16:9 Muzi 蜡笔插画。

![Muzi 动作库](mz-crayon-illustrations/assets/identity/muzi-crayon-action-index.png)

## 它会保持什么

- 稳定的 Muzi 讲述者身份，以及可选的布偶猫伙伴。
- 强烈蜡笔质感、暖白留白、深海军蓝轮廓、芥末黄块面和克制批注。
- 一张图只表达一个判断、一个物理隐喻和一条清晰叙事流。
- 标签与事实只来自用户提供的内容，不自行编造。

Skill 会在真正匹配时选择 16 个语义动作之一；遇到比较、环境、序列或复杂互动时，使用受控自由动作。它会验证结构化评审记录，并停在 `READY_FOR_REVIEW`。

## 安装

```text
$skill-installer install https://github.com/MuziGeek/mz-crayon-illustrations/tree/v1.0.0/mz-crayon-illustrations
```

## 示例

```text
Use $mz-crayon-illustrations to turn this article's main judgment into one 16:9 knowledge illustration.
Use $mz-crayon-illustrations to show why collecting information is not the same as retrieving it.
```

## 发布边界

Skill 不会自动上传、发布、替换账号资产、编造事实标签或声称用户验收。生成、本地 QA 与外部发布是彼此独立的阶段。

## 许可证

代码与文档使用 MIT 许可证；MZ/Muzi 参考图像使用 [MZ Reference Asset License 1.0](ASSET_LICENSE.md)。具体见 [NOTICE.md](NOTICE.md)。

[English](README.md)
