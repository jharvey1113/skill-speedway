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
| **Word Watch Grand Prix** | Community and safety words (EXIT, PUSH, POISON, WOMEN…) | Match the word → Listen and find (word is only spoken) → Listen: look-alikes → What it means (4 levels) |
| **Spell It 300** | Spelling everyday words (bread, grocery, medicine…): drive through each letter in order, and every letter lights up green or red | See it, spell it → Hear it, spell it → Longer words (4 levels) |
| **Typing Turbo 500** | Keyboarding, Nitro Type style: every correct key moves the car. The computer cars type close to the student's own recent speed | Short words → Longer sentences with capitals and punctuation (4 levels) |

## Built for students

- Steer with arrow keys, the keys 1 2 3, or by tapping an answer card
- **One-switch scanning**: the answers light up one at a time, and the student presses Space, Enter, or any tap to pick
- Two or three answer choices, and three speeds (Chill, Steady, Speedy)
- The game reads questions aloud using the best voice on the device (Google voices on Chromebooks). You can pick the voice and speed, or turn reading off
- Picture-based answers, colored lanes that match the answer cards, and no game over

## Progress tracking

- Each student makes a driver (first name only) with their own car color and number
- Levels unlock automatically at 80% or better (you can turn this off)
- **Teacher Dashboard** (teacher PIN: 2026): class overview with growth arrows, a per-student accuracy chart, answer-time trend, most-missed questions, and per-student accommodations
- Typing races track words per minute and accuracy, and the dashboard shows WPM growth
- **CSV export** of every answer (question, right answer, student answer, seconds) for IEP data
- **Class sheets:** a teacher connects the game to a Google Sheet in their own Drive ([setup guide](TEACHER-SETUP.md), about 5 minutes). Students open the class link, tap their name, and every race from any Chromebook lands in the sheet's Roster, Races and Answers tabs. Offline races wait on the device and upload later
- Without a class sheet, progress stays in the browser on that computer (use *Download backup* / *Restore* to move it)

## Run it locally

Open `index.html` through any static web server, for example:

```bash
python -m http.server 8000
```
