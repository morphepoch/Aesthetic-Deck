<p align="right">
  <a href="./README.md">English</a> | <a href="./README-CN.md">简体中文</a>
</p>

# Aesthetic Deck 🦋

一个用于探索 **AI & Aesthetics** 在 PPT 风格设计中如何落地的样式空间。

线上演示：https://extraordinary-llama-d25dda.netlify.app/

## Aesthetic Deck 是什么？

**Aesthetic Deck** 是一个基于 Web 的 PPT 风格样式空间。

这里收录了作者日常喜欢与常用的 PPT 风格，也收录了我自己新增设计、重新封装的样式。你可以在这里预览不同风格，并对喜欢的风格进行投票。

它不只是一个投票页面，也是在探索 AI 生成演示文稿时，如何拥有更稳定的视觉品味、更清晰的结构表达，以及更有辨识度的界面语言。

这个项目属于我的 **Metamorphosis** 空间：一个关于 **AI & Aesthetics** 的代码与思考档案。

## 它在探索什么？

- **AI 与视觉美学**：布局、色彩、字体、质感和动效如何共同影响一份 deck 的气质。
- **Deck 风格系统**：不同视觉语言如何被封装成可复用的演示模板。
- **人的偏好反馈**：通过投票结果比较哪些风格更吸引人、更易读、更有表达力。

## 功能

- PPT 风格列表与 iframe 实时预览
- 点赞 / 取消点赞交互
- 按票数排序的结果页
- 结果卡片可跳回对应风格预览
- 自己筛选、重新设计并封装的 PPT 样式模板
- 支持 Netlify 或 GitHub Pages 等静态站点部署

## 截图

第二页：投票结果。

![投票结果截图](./assets/results-screenshot.png)

## 项目结构

```text
Aesthetic-Deck/
  index.html              # 投票与预览页面
  results.html            # 投票结果页面
  reset.html              # 重置工具页面
  harness-engineering.html
  js/                     # 投票、存储、Firebase 与 UI 逻辑
  styles/                 # 页面与结果页样式
  ppt-styles/             # 已封装的 PPT 风格模板
  aesthetic-deck-skill/   # 打包后的 Aesthetic Deck skill
  assets/                 # README 截图与项目素材
```

## Aesthetic Deck Skill

这 12 个筛选出的风格也被单独打包成了一个可复用 skill：

- `aesthetic-deck-skill/`
- `aesthetic-deck-skill/SKILL.md`

这个 skill 包含已筛选主题的 CSS 文件、基础 deck runtime、起始模板，以及当前 12 个风格的 standalone 示例。

## 当前 PPT 风格

当前风格集合包括：

- Neon Drift
- Pitch Deck VC
- Dimensional Layering
- Art Deco
- Holographic Fluid
- Arctic
- Engineering Whiteprint
- Aurora
- Glassmorphism
- Indigo Porcelain
- Organic Blob
- Grain Texture

## Notes

这个仓库是我关于 **AI & Aesthetics** 持续探索的一部分：

- AI & verbal aesthetics
- AI & visual aesthetics
- AI & logical aesthetics

**Aesthetic Deck** 目前聚焦视觉美学：让演示风格变得可复用、可比较，也更具有审美表达。
