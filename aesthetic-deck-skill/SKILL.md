---
name: "aesthetic-deck"
description: "Creates curated aesthetic HTML PPT decks with 12 selected styles. Invoke for Aesthetic Deck, PPT style selection, or AI & visual aesthetics slides."
---

# Aesthetic Deck Skill

Aesthetic Deck is a focused HTML PPT skill for creating presentation decks with 12 curated visual styles selected from the Aesthetic Deck voting space.

Use this skill when the user asks for:
- Aesthetic Deck style slides
- AI & Aesthetics presentation design
- PPT style selection or visual style exploration
- a tasteful HTML deck using one of the curated Aesthetic Deck themes

## Curated Style Set

The skill includes exactly 12 selected styles:

1. `neon-drift` — 霓虹漂移
2. `pitch-deck-vc` — 融资路演
3. `dimensional-layering` — 维度层叠
4. `art-deco` — 装饰艺术
5. `holographic-fluid` — 全息流体
6. `arctic` — 极地酷寒
7. `engineering-whiteprint` — 工程白印
8. `aurora` — 极光
9. `glassmorphism` — 玻璃态
10. `indigo-porcelain` — 靛蓝青瓷
11. `organic-blob` — 有机团块
12. `grain-texture` — 颗粒肌理

## How to Author

Start from `templates/deck.html`, then switch the theme link to one of the selected theme files:

```html
<link rel="stylesheet" id="theme-link" href="../assets/themes/neon-drift.css">
```

Use shared assets:
- `assets/fonts.css`
- `assets/base.css`
- `assets/runtime.js`
- `assets/animations/animations.css`

Use `references/style-guide.md` and `references/style-manifest.json` to choose a style.

## Style Selection Guidance

- Product pitch / business storytelling: `pitch-deck-vc`, `glassmorphism`, `art-deco`
- Technical sharing / engineering culture: `engineering-whiteprint`, `arctic`, `indigo-porcelain`
- Futuristic / AI / creative launch: `neon-drift`, `holographic-fluid`, `aurora`
- Soft expressive visual narrative: `organic-blob`, `grain-texture`, `dimensional-layering`

## Completion Standard

A finished deck should:
- use one of the 12 selected styles
- keep a clear visual hierarchy
- make the PPT feel designed rather than merely generated
- preserve readability before decoration
- be directly previewable as static HTML

## Examples

Standalone examples for the 12 selected styles live in `examples/*.html`.
