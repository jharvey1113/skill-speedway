# Skill Speedway

A 3D stock-car racing game for life skills practice. Students drive around an oval speedway and steer through the **answer gate** lane that matches the question at the top of the screen. Right answers give a speed boost. Wrong answers only slow the car for a moment, show the correct answer, and bring that question back later in the race.

The whole game is one self-contained `index.html` (Three.js from a CDN), so it runs in Chrome on a Chromebook with nothing to install.

## Races

| Race | What students practice | Levels |
|---|---|---|
| **Math Facts 500** | Addition, subtraction, times tables | Add to 10 → Times tables to 10 (6 levels) |
| **Pit Stop Pay** | Coins and bills on the track; after each lap, pull into the pit and pay the crew for tires, gas, and oil | Name coins and bills and add whole dollars → Next dollar up → Making change (5 levels) |
| **Road Sign Rally** | Road signs, traffic lights, walk signals | Find the sign → What it means → Lights and signals (3 levels) |
| **Beat the Clock 400** | Reading an analog clock and elapsed time | O'clock → Every 5 minutes → How much later? (5 levels) |
| **Word Watch Grand Prix** | Community and safety words (EXIT, PUSH, POISON, WOMEN…) | Match the word → Look-alike words → What it means (3 levels) |

## Built for students

- Steer with arrow keys, the keys 1 2 3, or by tapping an answer card
- **One-switch scanning**: the answers light up one at a time, and the student presses Space, Enter, or any tap to pick
- Two or three answer choices, and three speeds (Chill, Steady, Speedy)
- The game reads questions aloud using the best voice on the device (Google voices on Chromebooks). You can pick the voice and speed, or turn reading off
- Picture-based answers, colored lanes that match the answer cards, and no game over

## Progress tracking

- Each student makes a driver (first name only) with their own car color and number
- Levels unlock automatically at 80% or better (you can turn this off)
- **Teacher Dashboard** (PIN protected): class overview with growth arrows, a per-student accuracy chart, answer-time trend, most-missed questions, and per-student accommodations
- **CSV export** of every answer (question, right answer, student answer, seconds) for IEP data
- Progress is stored **only in the browser on that computer**. Use *Download backup* / *Restore* to move data between Chromebooks

## Run it locally

Open `index.html` through any static web server, for example:

```bash
python -m http.server 8000
```
