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
    rain: { notes: [261.63, 329.63, 392, 329.63], tempo: 900, type: 'sine' },
    night: { notes: [196, 246.94, 293.66, 369.99, 293.66], tempo: 1100, type: 'triangle' },
    fireplace: { notes: [220, 261.63, 293.66, 329.63, 293.66, 261.63], tempo: 700, type: 'sawtooth' },
  };

  const ensureMoodAudio = () => {
    if (moodContext) return;
    moodContext = new AudioContext();
    moodMaster = moodContext.createGain();
    moodMaster.gain.value = Number(volumeControl?.value || 0.7) * 0.16;
    moodMaster.connect(moodContext.destination);
  };

  const playMoodNote = (pattern, index) => {
    const oscillator = moodContext.createOscillator();
    const noteGain = moodContext.createGain();
    const now = moodContext.currentTime;
    oscillator.type = pattern.type;
    oscillator.frequency.value = pattern.notes[index % pattern.notes.length];
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.72);
    oscillator.connect(noteGain).connect(moodMaster);
    oscillator.start(now);
    oscillator.stop(now + 0.75);
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
    playMoodNote(pattern, noteIndex);
    moodTimer = setInterval(() => playMoodNote(pattern, ++noteIndex), pattern.tempo);
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
    if (moodMaster) moodMaster.gain.value = Number(event.target.value) * 0.16;
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