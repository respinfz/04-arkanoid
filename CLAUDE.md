# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is an **Arkanoid game** to be built with plain HTML, CSS, and JavaScript — **zero dependencies** (no build tools, no npm packages, no bundler). As of now the game itself is **not implemented yet**: the repo only contains the spec-driven workflow scaffolding and game assets. There is no `index.html`, no game loop, and no `specs/` directory yet.

The repo is also not currently a git repository — `git init` will be needed before using the `/spec-impl` workflow described below, which relies on git branches.

Because there is no code yet, do not assume any existing architecture. When implementation starts, look for a `specs/` folder — it is the source of truth for what has been built and how it's organized.

## Development workflow: spec-driven

This repo uses a two-phase, spec-driven workflow imported as custom skills (see `skills-lock.json`, sourced from `Klerith/fernando-skills`):

- **`/spec <description>`** (`.agents/skills/spec/SKILL.md`) — turns a feature description into a written spec through a clarifying-questions phase, then writes `specs/NN-slug.md` (numbered sequentially, using `.agents/skills/spec/template.md` as the structure). New specs start in `Draft` state and must be manually marked `Approved` by a human before implementation.
- **`/spec-impl <NN-slug>`** (`.agents/skills/spec-impl/SKILL.md`) — implements an `Approved` spec. It refuses to run on any other state (`Draft`, `In review`, `Implemented`, `Obsolete`). On success it creates/switches to a git branch named `spec-NN-slug` (controlled by `AutoCreateBranch` in `specs/.spec-config.yml`, default `true`), then implements the plan **one step at a time**, pausing after each step for review. It never commits automatically.

Practical implications for any agent working here:
- Don't write game code directly unless a corresponding approved spec exists (or the user explicitly asks to skip the process).
- Check `specs/` for the current state of the project before making architectural assumptions — it reflects intended scope/data model/plan even before code exists.
- Never mark a spec `Approved` — that transition is made by the human.

## Assets available for implementation

- `assets/spritesheet-breakout.png` — the sprite sheet image.
- `assets/spritesheet.js` — plain `<script>`-style helper (no exports/modules) that loads the sheet onto an offscreen canvas and draws from it:
  - `loadSpritesheet(cb)` — loads the image once, queues/fires callbacks when ready.
  - `drawSprite(ctx, name, x, y, w, h)` — draws by logical name (`'paddle'`, `'ball'`, or `'block_<color>'`, e.g. `'block_red'`).
  - `drawFrame(ctx, frame, x, y, w, h)` — draws an explicit `{sx, sy, sw, sh}` frame, used for animations.
  - `SPRITES` — static frame coordinates for `paddle`, `ball`, and `blocks.{gray,red,yellow,cyan,magenta,hotpink,green}`.
  - `EXPLOSION_FRAMES` — 4-frame explosion animation per block color, paired with `EXPLOSION_DURATION` (150ms).
- `assets/sounds/ball-bounce.mp3`, `assets/sounds/break-sound.mp3` — sound effects for the ball bouncing and blocks breaking.

Any future game code should reuse these rather than introducing new asset-loading abstractions or a bundler.
