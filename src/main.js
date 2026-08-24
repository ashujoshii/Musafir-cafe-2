import { createIcons, icons } from 'lucide';
import { initThreeScene } from './modules/threeScene.js';
import { initAudioEngine } from './modules/audioManager.js';
import { initScrollManager } from './modules/scrollManager.js';


// Initialize Lucide Icons
createIcons({ icons });

// Initialize All Engines
document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
  initAudioEngine();
  initScrollManager();

  const openStatus = document.getElementById('openStatus');
  const closingStatus = document.getElementById('closingStatus');
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 8 && currentHour < 23.5;

  if (openStatus && closingStatus) {
    openStatus.textContent = isOpen ? 'Open Now' : 'Closed Now';
    openStatus.style.color = isOpen ? '#9be0a8' : '#f19a8f';
    closingStatus.textContent = isOpen ? 'Closes at 11:00 PM' : 'Opens at 8:00 AM';
  }

  const bookingForm = document.getElementById('bookingForm');
  const formStatus = document.getElementById('formStatus');
  const submitButton = bookingForm?.querySelector('button[type="submit"]');

  bookingForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!formStatus || !submitButton) return;

    submitButton.disabled = true;
    formStatus.textContent = 'Sending your reservation...';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(bookingForm.action, {
        method: bookingForm.method,
        body: new FormData(bookingForm),
        headers: { Accept: 'application/json' },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Reservation could not be sent.');
      }

      bookingForm.reset();
      formStatus.textContent = 'Reservation sent successfully. We will be in touch soon.';
      formStatus.className = 'form-status success';
    } catch (error) {
      formStatus.textContent = error.message || 'Something went wrong. Please try again.';
      formStatus.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
    }
  });
});