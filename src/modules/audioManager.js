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
  audio.volume = Number(volumeControl?.value || 0.7);

  volumeControl?.addEventListener('input', (event) => {
    event.stopPropagation();
    audio.volume = Number(event.target.value);
  });

  widget.addEventListener('click', async (event) => {
    if (event.target === volumeControl) return;
    if (!isPlaying) {
      try {
        await audio.play();
        isPlaying = true;
        if (iconWrapper) iconWrapper.textContent = '🔊';
        if (eqBars) eqBars.classList.add('playing');
        console.log('मुसाफ़िर Radio is playing');
      } catch (err) {
        console.error('Playback error:', err);
      }
    } else {
      audio.pause();
      isPlaying = false;
      if (iconWrapper) iconWrapper.textContent = '☕';
      if (eqBars) eqBars.classList.remove('playing');
      console.log('मुसाफ़िर Radio is paused');
    }
  });
}