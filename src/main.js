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
  const ticketModal = document.getElementById('ticketModal');
  const closePassButton = document.getElementById('closePassBtn');

  const closeTicket = () => {
    if (ticketModal) ticketModal.hidden = true;
  };

  closePassButton?.addEventListener('click', closeTicket);
  ticketModal?.addEventListener('click', (event) => {
    if (event.target === ticketModal) closeTicket();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeTicket();
  });

  bookingForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!formStatus || !submitButton) return;

    const bookingData = new FormData(bookingForm);
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
      document.getElementById('passName').textContent = bookingData.get('Guest Name') || 'Traveler';
      document.getElementById('passGuests').textContent = `${bookingData.get('Wanderers (Guests)') || '2'} Wanderers`;
      document.getElementById('passDateTime').textContent = `${bookingData.get('Date') || 'Tonight'} · ${bookingData.get('Time') || '8:00 PM'}`;
      if (ticketModal) ticketModal.hidden = false;
    } catch (error) {
      formStatus.textContent = error.message || 'Something went wrong. Please try again.';
      formStatus.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
    }
  });

  const cursor = document.querySelector('.custom-cursor');
  const trail = document.querySelector('.cursor-trail');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  if (cursor && trail && finePointer.matches) {
    let pointerX = -100;
    let pointerY = -100;
    let trailX = pointerX;
    let trailY = pointerY;

    window.addEventListener('mousemove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      document.body.classList.add('cursor-visible');
    });

    window.addEventListener('mouseleave', () => document.body.classList.remove('cursor-visible'));

    const followPointer = () => {
      trailX += (pointerX - trailX) * 0.13;
      trailY += (pointerY - trailY) * 0.13;
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(followPointer);
    };

    followPointer();

    document.querySelectorAll('a, button, input, .glass').forEach((element) => {
      element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  const cornerCards = document.querySelectorAll('.corner-card');
  const audioLabel = document.querySelector('.audio-label strong');

  cornerCards.forEach((card) => {
    card.addEventListener('click', () => {
      cornerCards.forEach((item) => item.classList.remove('active'));
      card.classList.add('active');
      document.body.style.setProperty('--bg-dark', card.dataset.bg);
      if (audioLabel) audioLabel.textContent = `${card.dataset.label} Radio`;
      window.musafirAudio?.playMood(card.dataset.sound);
    });
  });
});