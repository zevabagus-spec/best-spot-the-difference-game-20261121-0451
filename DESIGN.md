# Lanternlight Twins — design notes

## Requirements, in my own words
A complete, original spot-the-difference game: two near-identical pictures
side by side in a desktop browser, mouse + keyboard, static files only, zero
network. The judge sees it mostly through screenshots, so each shot must
show both panels, gold rings on the differences already found, several still
unfound, and a counter of how many remain. Depth: differences fair but not
obvious, three scenes of rising difficulty, fun after ten finds. Polish: a
satisfying mark per find, a hint that behaves, time pressure visible in the
frame. Look: original scenes worth studying, differences hidden by design, one
style across both panels. Structure: source split into small files, one job
each, named for what they do. No local scorer exists for this bounty
(RULES.txt: "There is no local grade of this competition"), so verification is
end-to-end instead of a grade-local percentage — never invent a score.

## Approaches considered
A. Canvas-painted procedural scenes (chosen): hand-coded painters draw rich
   vector scenes; each difference is a painter branch toggled in panel B.
   Fully offline, deterministic, crisp; differences exact and fair.
B. SVG scene graphs: same richness, easier DOM hit-testing, but verbose and
   slower to iterate; canvas gives better painterly control (glows, gradients).
C. Tile/pixel-art scenes: charming but low detail density — the judge's
   "scenes worth studying" criterion favours richer pictures, and coarse
   pixels make differences too easy to spot.
Chosen A: three painters (harbour / garden / market), 10 differences each,
30 total, mixing added, removed, recoloured, moved and count-change types.

## Edge cases handled (before coding)
- Click outside both panels: ignored, no penalty. Click on an already-found
  difference: "already", no penalty, no double count. Rapid double-click on
  one difference: second click ignored.
- Click near two overlapping zones: nearest unfound difference within radius.
- Timer hits 0 mid-click: level ends, later clicks ignored.
- Hint with 0 hints left, or with nothing left to find: no-op, button disabled.
- Last difference found: level-clear overlay, timer stops, confetti.
- Restart mid-level: full state reset. Resize: click mapping uses the canvas
  bounding rect, so CSS scaling stays correct.
- Audio blocked before first gesture: context created/resumed on first input;
  screenshot scenes (?shot=) never touch audio.
- Unknown ?shot= value: falls back to the title menu.
- No network anywhere: system font stack only, art drawn in canvas, sounds
  synthesised with WebAudio oscillators, no external files.

## Verification (this session)
- node --check on every source file: clean.
- Logic test in Node (all 30 differences clickable to completion in both
  panels, miss penalty −3s, hint spend, timer expiry, post-time-up ignore):
  ALL LOGIC TESTS PASSED.
- Real renders in headless Chromium via ?shot= scenes: 4 screenshots,
  1280x720 JPEG, each under 256 KiB, visually reviewed (cover, garden,
  market, win + live menu).
- main.ts run twice: byte-identical output; dossier 565,280 bytes (< 1.5 MiB).
- Gate audit: game/ 11 files, no symlinks, index.html 2,750 bytes;
  screenshots 4 files; no http:/fetch/external reference in game/.
