# Keyframe Synth
A polyphonic browser instrument engineered directly around the Web Audio API. Play notes instantly using your physical keyboard, mouse, or touch screen with precise audio node control and smooth envelope transitions.

## Overview $ Value Proposition

Most web audio projects struggle with clicky pop artifacts during attack/release cycles or hit browser auto-play policies head-on. keyframe-synth solves this by decoupling DOM triggers from sound generation.

It handles browser AudioContext suspension states on the fly and uses rapid linear/exponential gain ramping so tone start and end points sound clean. No MP3 samples to load, no external assets to download—just pure browser signal generation.

## How It Works

**1. AudioContext Initialization:** Waits for a user gesture (keydown, click, touch) to resume or boot the browser's audio graph.
**2. Frequency Map Lookup:** Maps data attributes on DOM keys (e.g., ```bashC4```, ```bashA4```) directly to exact Hertz values (*A4 = 440 Hz*).
**3. Oscillator Ramping:** On activation, spins up a triangle waveform oscillator and ramps gain from ```bash0``` to ```bash0.4``` over ```bash10ms``` to eliminate attack clicks.
**4. Smooth Decay Release:** On key release, executes an exponential decay down to ```text0.0001``` over ```text80ms``` before shutting down and destroying the active oscillator object to prevent memory leaks.

## Key Features

• **Polyphonic Voice Allocation:** Play single notes or full chords simultaneously without voice stealing.
• **Zero Audio Pop Artifacts:** Envelope gain nodes ramp dynamically during attack and decay stages.
• **Unified Event Routing:** Mouse, touch, and mapped QWERTY keyboard bindings trigger identical state machines.
• **AudioContext Auto-Resume:** Gracefully unlocks web audio when browsers enforce autoplay security policies.

## Tech Stack Breakdown

1. **Language:** Vanilla JavaScript (ES6+)
2. **Audio Engine:** Native Web Audio API (AudioContext, OscillatorNode, GainNode)
3. **Styling:** Standard CSS (Flexbox layout, absolute positioning for black keys, dynamic state pseudo-classes)
4. **Markup:** HTML5 using semantic custom data attributes (data-note, data-key)

## Quick Start (Browser & Local)

### Option 1: Direct in GitHub Browser

1. Press the . (dot) key on your keyboard while viewing this repo to launch GitHub's web editor instantly.
2. Use GitHub Codespaces by clicking *Code > Codespaces > Create codespace* on main.
3. Right-click ```bashindex.html``` and launch via your preferred live server extension.

### Option 2: Run Locally

1. Clone the repository or download the files.
2. Open ```textindex.html``` directly in any standard browser (Chrome, Firefox, Safari, Edge).
3. Tap your keyboard (keys A through K, and numbers 4, 5, 6, 8) or click keys with your mouse to play sound.

## Repository Structure

```bash
keyframe-synth/
├── .github/
│   └── workflows/
│       └── code-health.yml       # Automated HTML/CSS/JS sanity linter
├── index.html                    # Layout structure and DOM key note mapping
├── style.css                     # Key positioning and active state aesthetics
├── script.js                     # Web Audio API engine, events, oscillator nodes
├── .gitignore                    # System file ignore rules
└── LICENSE                       # MIT License
```

## Roadmap

[ ] Add dynamic waveform selector (Sine, Square, Sawtooth, Triangle).

[ ] Implement an octave switch control to shift frequencies up or down.

[ ] Add an ADSR slider panel to tweak attack and release timing on the fly.

```text"Sound in a browser shouldn't require a megabyte of audio samples when a few lines of math can synthesize it from scratch."```
