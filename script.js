let audioCtx = null;
const activeOscillators = {};

const noteFrequencies = {
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
    'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
    'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 
    'E5': 659.25
};

// Safely initialize or resume AudioContext on user gesture
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function startNote(note) {
    const ctx = initAudio();
    if (!ctx || activeOscillators[note]) return;

    const frequency = noteFrequencies[note];
    if (!frequency) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = frequency;

    // Prevent pop/click sounds with a rapid ramp-up
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();

    activeOscillators[note] = { osc, gainNode };
}

function stopNote(note) {
    const active = activeOscillators[note];
    if (!active || !audioCtx) return;

    const { osc, gainNode } = active;
    
    // Smooth fade-out when releasing the key
    try {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
        osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
        // Fallback safety stop
        osc.stop();
    }
    
    delete activeOscillators[note];
}

// Map keyboard keys to their DOM elements
const keyMap = {};
document.querySelectorAll('.key').forEach(key => {
    keyMap[key.dataset.key] = key;
});

// Mouse & Touch events
document.querySelectorAll('.key').forEach(key => {
    const note = key.dataset.note;

    // Desktop
    key.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startNote(note);
    });
    key.addEventListener('mouseup', () => stopNote(note));
    key.addEventListener('mouseleave', () => stopNote(note));

    // Mobile / Touch
    key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startNote(note);
    });
    key.addEventListener('touchend', () => stopNote(note));
});

// Keyboard events
window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const keyElement = keyMap[e.key.toLowerCase()];
    
    if (keyElement) {
        keyElement.classList.add('active');
        startNote(keyElement.dataset.note);
    }
});

window.addEventListener('keyup', (e) => {
    const keyElement = keyMap[e.key.toLowerCase()];
    if (keyElement) {
        keyElement.classList.remove('active');
        stopNote(keyElement.dataset.note);
    }
});