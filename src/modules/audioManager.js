export function initAudioEngine() {
  const widget = document.getElementById('audioWidget');
  const audio = document.getElementById('cafeAudio');
  const iconWrapper = document.getElementById('soundIconWrapper');
  const eqBars = document.getElementById('eqBars');

  if (!widget || !audio) {
    console.error('Audio widget elements missing in DOM.');
    return;
  }

  let isPlaying = false;

  widget.addEventListener('click', async () => {
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