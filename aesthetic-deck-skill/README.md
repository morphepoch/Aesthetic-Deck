# Aesthetic Deck Skill 🦋

A focused skill package for creating HTML PPT decks with 12 curated **Aesthetic Deck** styles.

This skill is extracted from the broader `html-ppt0520 2` style system and aligned with the Aesthetic Deck voting showcase. It packages only the selected styles used in the Aesthetic Deck web project.

## Generation Stability Layer

Aesthetic Deck Skill is not only a style collection. It repackages selected and newly designed PPT styles with additional layout safeguards for AI-generated decks:

- **Responsive typography**: titles, body text, and lead text use bounded `clamp()` ranges to prevent oversized text from breaking layouts when titles are long or viewport height is limited.
- **Overflow-aware containers**: core containers such as `.slide`, `.card`, and `.slide-body` use rules like `overflow:hidden` and `min-height:0` to reduce content spilling outside the slide or stretching the layout.
- **Media size protection**: images and videos are constrained with `max-width`, `max-height`, and `object-fit: contain` to prevent visual assets from blowing out slide height.
- **Grid and spacing constraints**: grid gaps, card padding, and section spacing use responsive scales to avoid crowded or misaligned layouts across screens and iframe previews.
- **Short-viewport compression**: multi-level media queries compress padding, reduce heading sizes, and hide decorative chrome in short projector, preview, or embedded environments.
- **Fixed starter template**: `templates/deck.html` keeps the base document structure, CSS imports, runtime imports, and slide system consistent.
- **Theme token compatibility**: selected `guizang-ppt` themes such as `indigo-porcelain` keep their original tokens while adding an `html-ppt` compatibility mapping to avoid cross-system token failure.
- **Readability-first rule**: `SKILL.md` explicitly asks finished decks to preserve visual hierarchy and readability before decoration.

## Contents

- `SKILL.md` — skill definition and invocation guidance
- `assets/` — shared runtime, base CSS, fonts, animations, and the 12 selected themes
- `templates/deck.html` — starter HTML deck template
- `examples/` — standalone previews for the selected styles
- `references/style-guide.md` — human-readable style list
- `references/style-manifest.json` — machine-readable style manifest

## Selected Styles

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
