const colors = ['red', 'blue', 'green', 'yellow'];
let sequence = [];
let playerSequence = [];
let canClick = false;
let flashInterval = 700; // domyślne dla łatwego

const buttons = document.querySelectorAll('.color-button');
const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const body = document.body;

const errorOverlay = document.getElementById('error-overlay');
const retryBtn = document.getElementById('retry-btn');

startBtn.addEventListener('click', startGame);

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!canClick) return;
    const color = btn.dataset.color;
    playerSequence.push(color);
    flashButton(color);
    checkSequence();
  });
});

difficultyRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      if (radio.value === 'hard') {
        flashInterval = 400;
        body.classList.add('hard');
      } else {
        flashInterval = 700;
        body.classList.remove('hard');
      }
    }
  });
});

retryBtn.addEventListener('click', () => {
  errorOverlay.classList.add('hidden');
  startGame();
});

function startGame() {
  sequence = [];
  playerSequence = [];
  status.textContent = '';
  canClick = false;
  nextRound();
}

function nextRound() {
  playerSequence = [];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(randomColor);
  playSequence();
}

function playSequence() {
  canClick = false;
  let i = 0;
  const interval = setInterval(() => {
    if (i >= sequence.length) {
      clearInterval(interval);
      canClick = true;
      return;
    }
    flashButton(sequence[i]);
    i++;
  }, flashInterval);
}

function flashButton(color) {
  const btn = Array.from(buttons).find(b => b.dataset.color === color);
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), flashInterval / 2);
}

function checkSequence() {
  const currentIndex = playerSequence.length - 1;
  if (playerSequence[currentIndex] !== sequence[currentIndex]) {
    canClick = false;
    showError();
    return;
  }
  if (playerSequence.length === sequence.length) {
    status.textContent = 'Dobrze! Następna runda...';
    setTimeout(() => {
      status.textContent = '';
      nextRound();
    }, 1000);
  }
}

function showError() {
  errorOverlay.classList.remove('hidden');
  status.textContent = '';
}
