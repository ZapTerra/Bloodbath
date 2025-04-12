// hourglass.js

document.addEventListener('DOMContentLoaded', () => {
  const sandUpper = document.querySelector('.sand-upper');
  const sandLower = document.querySelector('.sand-lower');

  // Set initial positions
  sandUpper.style.transform = 'translateY(0vh)';
  sandLower.style.transform = 'translateY(11vh)';
  sandLower.style.opacity = '1';

  let woundCount = window.currentWoundCount || 0;
  let progress = 0;
  let direction = 1;

  const duration = 60000; // 60 seconds (match your CSS)
  let startTime = null;

  const animateSand = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const percent = (elapsed % duration) / duration;

    // Move top sand (0 -> 13vh -> 0)
    const upperTranslate = percent < 0.5
      ? 13 * (percent * 2)
      : 13 * (1 - ((percent - 0.5) * 2));
    sandUpper.style.transform = `translateY(${upperTranslate.toFixed(2)}vh)`;

    // Move lower sand (11 -> -2vh -> 11)
    const lowerTranslate = percent < 0.5
      ? 11 - (13 * (percent * 2)) // 11 -> -2vh
      : -2 + (13 * ((percent - 0.5) * 2)); // -2 -> 11
    sandLower.style.transform = `translateY(${lowerTranslate.toFixed(2)}vh)`;

    // Keep it visible during the whole cycle (based on opacity stops in your keyframes)
    sandLower.style.opacity = '1';

    requestAnimationFrame(animateSand);
  };

  requestAnimationFrame(animateSand);

  // Optional: if woundCount changes dynamically
  window.addEventListener('woundCountChanged', (e) => {
    woundCount = e.detail.woundCount;
    // You can modify `duration` or sand speed here if you want:
    // For example:
    // duration = 60000 / (1 + woundCount * 0.1);
  });
});
