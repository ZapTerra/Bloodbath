let draining = false;
let sandLevel = parseFloat(localStorage.getItem('sandLevel')) || 0;
let woundCount = parseInt(localStorage.getItem('woundCount')) || 0;

const sandUpper = document.querySelector('.sand-upper');
const sandLower = document.querySelector('.sand-lower');
const woundCountDisplay = document.querySelector('.wound-count');
const addBtn = document.querySelector('.add-wounds');
const subBtn = document.querySelector('.sub-wounds');

const MAX_VH = 13;
const BASE_DRAIN_RATE = 1 / 60;

let lastTime = null;

function updateTransforms() {
  const upperY = sandLevel * MAX_VH;
  const lowerY = 11 - upperY;

  sandUpper.style.transform = `translateY(${upperY}vh)`;
  sandLower.style.transform = `translateY(${lowerY}vh)`;
}

function updateWoundCountDisplay() {
  woundCountDisplay.textContent = woundCount;
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (draining && sandLevel < 1) {
    const rate = BASE_DRAIN_RATE * woundCount;
    sandLevel += rate * delta;
    sandLevel = Math.min(1, sandLevel);
    localStorage.setItem('sandLevel', sandLevel);
    updateTransforms();
  }

  requestAnimationFrame(loop);
}

document.addEventListener('click', (e) => {
  // Ignore clicks on UI elements
  if (e.target.closest('.wound-tracker')) return;
  draining = !draining;
});

addBtn.addEventListener('click', () => {
  woundCount = Math.min(woundCount + 1, 99);
  localStorage.setItem('woundCount', woundCount);
  updateWoundCountDisplay();
});

subBtn.addEventListener('click', () => {
  woundCount = Math.max(woundCount - 1, 0);
  localStorage.setItem('woundCount', woundCount);
  updateWoundCountDisplay();
});

// On load
updateTransforms();
updateWoundCountDisplay();
requestAnimationFrame(loop);
