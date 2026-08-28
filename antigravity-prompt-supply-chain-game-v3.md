# BUILD PROMPT — "Idhar Ka Maal Udhar: Supply Chain Snakes & Ladders"

You are an expert game designer, UX designer, front-end engineer, motion designer, and creative director. Build a polished, browser-based, single-session, shared-screen multiplayer board game inspired by Snakes & Ladders, redesigned as a competitive Supply Chain Management quiz game. It should feel like a commercial-quality party game suitable for classrooms, college competitions, workshops, and projector presentations — **fun first, educational second.**

Think: Kahoot × Jackbox Party Pack × Mario Party × Snakes & Ladders × Indian comic books × a TV game show.

Both the visual assets and the full 25-question content pack are supplied and final — see Sections 1 and 8. Nothing about them needs to be invented.

---

## 1. SUPPLIED VISUAL ASSETS — USE EXACTLY AS-IS, DO NOT RECREATE OR RESTYLE

Copy all 10 files below verbatim into `/assets/` at full original resolution. Never re-export, recompress, recolor, or "reinterpret" them — they are final art. Every generated element (board tiles, snakes, ladders, motifs, UI chrome) must be designed to visually match *these* files, not the other way around.

| File | Size | Role in the game |
|---|---|---|
| `game_start.png` | 1584×672 | **Official game logo/title banner** ("Idhar Ka Maal Udhar" bazaar shopfront art). First thing shown on the opening screen. |
| `game_start_button.png` | 1584×672 (button art on transparent canvas) | **START GAME button.** Also reuse as the **PLAY AGAIN** button on the end screen. |
| `Game_Background.png` | 1584×672 | **Bazaar background**, used on the opening screen (panning) and as an ambient backdrop layer around/behind the board. |
| `pawn1.png` | 569×672 | Player pawn — laughing turbaned elder ("Sardarji") |
| `pawn2.png` | 481×672 | Player pawn — grumpy beanie-wearing elder |
| `pawn_3.png` | 469×672 | Player pawn — startled bespectacled elder |
| `winner.png` | 385×321 | **Leaderboard / Winner crest** (gold shield, crown, laurels) — frame for the live leaderboard panel and the end-screen winner banner |
| `messages.png` | 512×376 | **Info/question panel frame** (hanging wooden scroll) — houses Situation / Option A / Option B, then Correct Answer / Explanation |
| `timer.png` | 278×349 | **Timer banner** (circular gold medallion) — build the circular countdown progress ring directly on top of this medallion |
| `Letterhead.png` | 725×353 | Secondary scroll/pillar banner — use for the **top-center question-number + phase bar**, and/or as the base for phase-transition title cards |

All three pawn portraits are elder bazaar-shopkeeper characters — keep character naming/flavor consistent with that (e.g. "Uncle" personas), don't invent unrelated character names for them.

---

## 2. VISUAL STYLE (derived from the supplied art — match this, don't default to flat "pop-art")

The real art is **warm, painterly, semi-realistic digital illustration** — soft cel/airbrush shading, visible brush texture, bold but not stark ink outlines, golden-hour bazaar lighting, ornate gilded/wood-carved UI chrome (crests, scrolls, medallions, laurels, chains). It is closer to a hand-painted storybook / premium mobile-game illustration than flat graphic-novel pop-art.

Every generated asset (board, tiles, snakes, ladders, decorative motifs, transition cards) must:
- Use the same warm golden/amber/terracotta/gilded-gold palette visible in the supplied art, plus deep saffron, peacock teal, and emerald as accent colors for contrast.
- Have soft painterly shading and a bit of paper/canvas grain — not flat vector fills.
- Use ornate gilded-frame or carved-wood chrome (like `winner.png`, `messages.png`, `timer.png`, `Letterhead.png`) for any new UI frames, so new elements don't look like a different app bolted onto the old art.
- Avoid glassmorphism, avoid flat corporate UI, avoid neon/flat pop-art unless it's clearly in dialogue with the bazaar sign lettering style seen in `game_start.png`.

**Board specifically:** an illustrated winding path of ~75–90 tiles from START to FINISH, styled with Indian block-print / rangoli / ceramic-tile / Madhubani motifs, cartoon cobras as "snakes," and bamboo ladders wrapped in marigold garlands — rendered in the same painterly finish as the supplied assets, sitting in front of (or seamlessly blended with) `Game_Background.png`.

---

## 3. GAME FLOW

### Opening Screen
- `Game_Background.png` fills the screen, slowly panning left/right for a sense of movement.
- Subtle floating particles (dust motes / marigold petals) and warm light glow over it.
- `game_start.png` (logo) centered, bounces in gently on load.
- `game_start_button.png` prominent below/over it — squishes on hover/press (spring easing).
- Clicking Start → comic-panel wipe/iris transition into Player Setup.

### Player Setup
- Exactly **3 players.** Each enters a **Name** (validated non-empty).
- Each player is auto-assigned one of `pawn1.png` / `pawn2.png` / `pawn_3.png`, shown side by side with their entered name permanently underneath for the rest of the game.
- **START QUIZ** button disabled until all 3 names entered.

### Pregame Story Beat — "Shivam Medical Store"
Before the first phase transition / Q1, show a full-screen narrative beat (scroll-reveal on a large `messages.png`-style frame, or a dedicated story card in the same painterly style) presenting the pregame backstory verbatim from the data file's `pregameSituation` field (see Section 8). This sets up the entire game's throughline — every question that follows is a beat in this same story. Give the player(s) a clear "Begin" action to proceed from here into the Phase 1 transition card.

### Game Board
- Occupies the majority of the screen, `Game_Background.png` visible behind/around it.
- 75–90 tile winding illustrated path (see style section above).
- Responsive and legible at projector distance.

### Persistent Quiz Layout
| Region | Asset frame | Content |
|---|---|---|
| Top center | `Letterhead.png` | Current question number (e.g. "Q7 / 25"), current phase name |
| Left panel | `messages.png` | Situation, Option A, Option B → after answering, animates into Correct Answer + Explanation + Concept Tested tag |
| Top right | `timer.png` | Circular countdown ring overlaid on the medallion; pulse effect when time is low; hidden when no timer is active |
| Right panel | `winner.png` | Live leaderboard: 🥇 current leader's pawn portrait, name, position, score. Animates dramatically + "NEW LEADER!" + confetti whenever the lead changes |
| Center | — | The board with animated pawns |
| Bottom | pawn portraits | 3 player cards: portrait, name, position, correct count, wrong count, score. Current turn's card is highlighted |

### The "Consequence" Narrative Bridge
Each question in the data file has a `consequence` field — a short line of story that bridges into the next question (e.g. "The trial batch arrives on time and in good condition — Shivam must now decide whether to scale up."). After revealing the Correct Answer + Explanation and animating pawn movement, briefly display this consequence line (a beat of a couple seconds, animated in like a comic caption) before advancing to the next question. This is what makes the 25 questions read as one continuous story rather than a disconnected quiz bank — treat it as a first-class part of the answer-reveal sequence, not an optional extra.

---

## 4. QUESTION RULES BY PHASE

| Questions | Mode | Timer | Correct | Wrong |
|---|---|---|---|---|
| 1–10 | Individual, in turn order | None | +5 spaces | −2 spaces |
| 11–15 | Individual, in turn order | 20s | +5 | −3 |
| 16–20 | Individual, in turn order | 15s | +5 | −3 |
| 21–25 | **Fastest Finger First** — all 3 compete; first to buzz answers, others locked out until resolved | 10s dramatic countdown | +5 | −5 |

- Questions always appear in the exact fixed order of the data file — never randomized, never reworded at runtime.
- After every answer: reveal Correct Answer + Explanation + Concept Tested in the `messages.png` panel (animated), then the Consequence bridge line, **then** animate pawn movement — never teleport.
- Each question's `ruleset` object in the data file is authoritative for timer/scoring — the engine reads it per-question rather than hardcoding these phase boundaries into game logic.

### Phase Transition Cards (full-screen, animated, before each phase's first question)
1. **Crisis & Sourcing** — Q1–5
2. **Inventory & Forecasting** — Q6–10
3. **Warehousing & Transport** — Q11–15
4. **Customer & Supply Chain Coordination** — Q16–20
5. **Recovery & Long-Term Strategy** — Q21–25

(These exact phase names and question ranges are drawn directly from the supplied question data — see `phases` array in Section 8.)

---

## 5. MOVEMENT & ANIMATION

- **Correct:** pawn moves forward exactly 5 spaces — bounce, dust puff, sparkle trail, small ladder-climb flourish if it lands near a ladder.
- **Wrong:** pawn moves backward — snake-slither animation along the path, small screen shake, dust cloud, a funny comic reaction bubble (e.g. "OOF!", "Yikes!") in the elder-uncle spirit of the pawn art.
- Never snap/teleport — always tween movement space-by-space or along the path curve.
- Buttons squish, panels slide/spring in, question cards flip like scroll panels, leaderboard re-sorts with smooth animation, idle pawns have a subtle breathing/bounce idle.

---

## 6. WIN CONDITION & END SCREEN

- Winner = first player to reach the finish tile. If nobody finishes by end of Q25: winner = player furthest along (tiebreak: higher score, then higher accuracy).
- End screen: `winner.png` crest framing the winning pawn portrait + name, final scores/positions for all 3, correct/wrong counts, accuracy %, confetti + fireworks, and `game_start_button.png` re-labeled **PLAY AGAIN** to reset full game state.
- Consider closing with a one-line callback to the story's capstone line (Q25's consequence: "Shivam has built a genuinely more resilient supply chain than the one it started with.") as a nice narrative bow, separate from the per-player stats.

---

## 7. SOUND

Wire up hooks (placeholder/generated tones with silence-safe fallback — never throw if a file is missing) for: button click, correct answer, wrong answer, countdown tick, timer urgency tick, pawn movement, snake slither, ladder climb, confetti pop, winner fanfare, background bazaar ambience loop (low volume, mutable).

---

## 8. QUESTION DATA — FINAL, USE VERBATIM

The complete, final 25-question content pack (including the pregame backstory) is provided as `data/questions.json`, attached alongside this prompt. Load it exactly as-is — **do not paraphrase, reword, reorder, or randomize any situation, option, explanation, or consequence text.** The file already matches this schema:

```json
{
  "pregameSituation": { "title": "string", "text": "string" },
  "phases": [
    { "id": 1, "name": "string", "questionRange": [1, 5] }
  ],
  "questions": [
    {
      "id": 1,
      "phaseId": 1,
      "title": "string",
      "situation": "string",
      "optionA": "string",
      "optionB": "string",
      "correctOption": "A | B",
      "explanation": "string",
      "concept": "string",
      "consequence": "string",
      "ruleset": { "timerSeconds": 0, "correctDelta": 5, "wrongDelta": -2, "mode": "individual | fastest-finger" }
    }
  ]
}
```

Every question also carries a `title` (e.g. "The First Call") — display this as a small heading in the info panel above the Situation text, since it reinforces the story-beat framing.

Because content is data-driven through this one file, a future replacement question pack (different story, different length) should be a drop-in file swap with zero changes to game logic, animation, or scoring code.

---

## 9. TECHNICAL REQUIREMENTS

- Responsive single-page web app (React + a lightweight animation library such as Framer Motion, or equivalent — modern and performant).
- Clean module separation: `game-logic/` (state machine, movement, scoring, turn order), `components/` (UI), `animations/`, `data/questions.json` (supplied, see Section 8), `assets/` (the 10 supplied files, referenced by path — never inlined/recreated).
- Single predictable state store for all game state (players, positions, scores, current question index, phase, timer, turn order, buzz-lock state).
- 60fps-target animations; must run smoothly full-screen on a classroom projector / large display.
- Fastest Finger First should support simple key bindings (e.g. 1/2/3 or Q/W/E) as a buzz-in fallback, since this is a shared-screen party game, not networked multiplayer.
- Ship playable end-to-end immediately with the 10 supplied assets + the real 25-question data file.

---

## 10. DELIVERABLE

A working, playable build using the 10 supplied assets exactly as provided, generated board/tile/snake/ladder art that visually matches their painterly bazaar style, and the complete real "Shivam Medical Store" 25-question story-driven SCM quiz loaded verbatim from `data/questions.json`.
