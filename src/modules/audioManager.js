export function initAudioEngine() {
  const widget = document.getElementById('audioWidget');
  const audio = document.getElementById('cafeAudio');
  const iconWrapper = document.getElementById('soundIconWrapper');
  const eqBars = document.getElementById('eqBars');
  const volumeControl = document.getElementById('volumeControl');

  if (!widget || !audio) {
    console.error('Audio widget elements missing in DOM.');
    return;
  }

  audio.addEventListener('error', () => {
    console.error('Musafir Radio could not load the audio file.', audio.error);
  });

  let isPlaying = false;
  let moodPlaying = false;
  let moodTimer;
  let moodContext;
  let moodMaster;
  let currentMood;
  audio.volume = Number(volumeControl?.value || 0.7);

  const moodPatterns = {
    rain: {
      notes: [293.66, 349.23, 440, 523.25, 440, 349.23, 293.66, 261.63],
      chords: [146.83, 220, 293.66, 349.23],
      bass: 146.83,
      tempo: 520,
      type: 'sine',
    },
    night: {
      notes: [261.63, 329.63, 392, 493.88, 392, 329.63, 293.66, 329.63],
      chords: [130.81, 196, 261.63, 329.63],
      bass: 130.81,
      tempo: 680,
      type: 'triangle',
    },
    fireplace: {
      notes: [220, 261.63, 329.63, 392, 329.63, 293.66, 261.63, 220],
      chords: [110, 164.81, 220, 261.63],
      bass: 110,
      tempo: 430,
      type: 'triangle',
    },
  };

  const ensureMoodAudio = () => {
    if (moodContext) return;
    moodContext = new AudioContext();
    moodMaster = moodContext.createGain();
    moodMaster.gain.value = Number(volumeControl?.value || 0.7) * 0.12;
    moodMaster.connect(moodContext.destination);
  };

  const playTone = (frequency, type, duration, volume, detune = 0) => {
    const oscillator = moodContext.createOscillator();
    const noteGain = moodContext.createGain();
    const now = moodContext.currentTime;
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(volume, now + 0.035);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(noteGain).connect(moodMaster);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  };

  const playMoodStep = (pattern, index) => {
    const note = pattern.notes[index % pattern.notes.length];
    playTone(note, pattern.type, 0.42, 0.24);
    playTone(note * 2, 'sine', 0.28, 0.035, 4);

    if (index % 4 === 0) {
      playTone(pattern.bass, 'sine', 0.85, 0.16);
      pattern.chords.forEach((chord, chordIndex) => {
        playTone(chord, 'sine', 1.5, chordIndex === 0 ? 0.055 : 0.035, chordIndex % 2 ? -3 : 3);
      });
    }

    if (currentMood === 'rain' && index % 2 === 1) {
      playTone(note * 4, 'sine', 0.08, 0.018);
    }

    if (currentMood === 'fireplace' && index % 2 === 0) {
      playTone(pattern.bass * 2, 'triangle', 0.12, 0.06);
    }
  };

  const stopMood = () => {
    clearInterval(moodTimer);
    moodTimer = undefined;
    moodPlaying = false;
  };

  const startMood = async (mood) => {
    const pattern = moodPatterns[mood];
    if (!pattern) return;
    ensureMoodAudio();
    await moodContext.resume();
    audio.pause();
    isPlaying = false;
    stopMood();
    currentMood = mood;
    moodPlaying = true;
    let noteIndex = 0;
    playMoodStep(pattern, noteIndex);
    moodTimer = setInterval(() => playMoodStep(pattern, ++noteIndex), pattern.tempo);
    if (iconWrapper) iconWrapper.textContent = '♫';
    if (toggleButton) toggleButton.textContent = '❚❚';
    eqBars?.classList.add('playing');
  };

  const toggleButton = document.getElementById('soundToggleBtn');

  window.musafirAudio = {
    playMood: startMood,
    get isPlaying() { return isPlaying || moodPlaying; },
  };

  volumeControl?.addEventListener('input', (event) => {
    event.stopPropagation();
    audio.volume = Number(event.target.value);
    if (moodMaster) moodMaster.gain.value = Number(event.target.value) * 0.12;
  });

  widget.addEventListener('click', async (event) => {
    if (event.target === volumeControl || event.target.closest('.spotify-radio-link')) return;
    if (moodPlaying) {
      stopMood();
      if (iconWrapper) iconWrapper.textContent = '☕';
      if (toggleButton) toggleButton.textContent = '▶';
      eqBars?.classList.remove('playing');
    } else if (!isPlaying) {
      try {
        await audio.play();
        isPlaying = true;
        if (iconWrapper) iconWrapper.textContent = '🔊';
        if (toggleButton) toggleButton.textContent = '❚❚';
        if (eqBars) eqBars.classList.add('playing');
        console.log('मुसाफ़िर Radio is playing');
      } catch (err) {
        console.error('Playback error:', err);
      }
    } else {
      audio.pause();
      isPlaying = false;
      if (iconWrapper) iconWrapper.textContent = '☕';
      if (toggleButton) toggleButton.textContent = '▶';
      if (eqBars) eqBars.classList.remove('playing');
      console.log('मुसाफ़िर Radio is paused');
    }
  });
}