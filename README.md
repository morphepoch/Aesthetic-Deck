<p align="right">
  <a href="./README.md">English</a> | <a href="./README-CN.md">简体中文</a>
</p>

# Aesthetic Deck 🦋

A curated PPT style voting and preview system for exploring **AI & Aesthetics** in presentation design.

Live demo: https://extraordinary-llama-d25dda.netlify.app/

## What Is Aesthetic Deck?

**Aesthetic Deck** is a web-based PPT style showcase and voting system.

It brings together a set of deck visual styles that I personally selected, redesigned, and wrapped into reusable HTML-based PPT templates. The goal is not only to compare styles, but also to explore how AI-generated presentations can develop stronger visual taste, clearer structure, and more expressive interface language.

This project belongs to my broader **Metamorphosis** space: a code-and-thought archive for **AI & Aesthetics**.

## What It Explores

- **AI & visual aesthetics**: how layout, color, typography, texture, and motion shape the feeling of a deck.
- **Deck style systems**: how different visual languages can be packaged as reusable presentation templates.
- **Human preference feedback**: how voting results can help compare which styles feel more appealing, readable, or expressive.

## Features

- PPT style gallery with iframe-based live preview
- Like / unlike voting interaction
- Results page ranked by vote count
- Result cards linking back to the corresponding style preview
- Curated and redesigned PPT style templates
- Static-site friendly deployment for Netlify or GitHub Pages

## Screenshot

Second page: voting results.

![Voting results screenshot](./assets/results-screenshot.png)

## Project Structure

```text
Aesthetic-Deck/
  index.html              # voting and preview page
  results.html            # voting results page
  reset.html              # reset utility page
  harness-engineering.html
  js/                     # voting, storage, Firebase, and UI logic
  styles/                 # page and results styling
  ppt-styles/             # curated PPT style templates
  aesthetic-deck-skill/   # packaged skill with the 12 selected styles
  assets/                 # README screenshots and project assets
```

## Aesthetic Deck Skill

The 12 selected styles are also packaged as a reusable skill:

- `aesthetic-deck-skill/`
- `aesthetic-deck-skill/SKILL.md`

The skill includes the selected theme CSS files, shared deck runtime assets, a starter deck template, and standalone examples for the current style set.

## Current PPT Styles

The current style set includes selected and redesigned templates such as:

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

This repository is part of my ongoing exploration of **AI & Aesthetics**:

- AI & verbal aesthetics
- AI & visual aesthetics
- AI & logical aesthetics

**Aesthetic Deck** currently focuses on the visual side: how presentation styles can become reusable, comparable, and aesthetically expressive.
