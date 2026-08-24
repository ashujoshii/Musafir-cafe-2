import { createIcons, icons } from 'lucide';
import { initThreeScene } from './modules/threeScene.js';
import { initAudioEngine } from './modules/audioManager.js';
import { initScrollManager } from './modules/scrollManager.js';
import { initTiltAndGlow } from './modules/tiltGlow.js';

// Initialize Lucide Icons
createIcons({ icons });

// Initialize All Engines
document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
  initAudioEngine();
  initScrollManager();
  initTiltAndGlow();
});