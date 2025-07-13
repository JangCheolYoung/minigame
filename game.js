const cardsContainer = document.getElementById('cards');
const resultDiv = document.getElementById('result');
const adBanner = document.getElementById('ad-banner');
const startBtn = document.getElementById('start-btn');

let sequence = [];
let userSequence = [];
let level = 1;
let canClick = false;

function generateSequence(length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 9) + 1);
  }
  return arr;
}

function renderCards(seq, flipped = false) {
  cardsContainer.innerHTML = '';
  seq.forEach(num => {
    const card = document.createElement('div');
    card.classList.add('card');
    if (flipped) {
      card.textContent = num;
      card.classList.add('flipped');
    } else {
      card.textContent = '?';
    }
    cardsContainer.appendChild(card);
  });
}

function showSequence() {
  renderCards(sequence, true);
  setTimeout(() => {
    renderCards(sequence.map(_ => '?'));
    canClick = true;
  }, 1500 + level * 500);
}

function startGame() {
  sequence = generateSequence(level + 2);
  userSequence = [];
  resultDiv.textContent = '';
  adBanner.style.display = 'none';
  renderCards(sequence, true);
  canClick = false;
  setTimeout(() => {
    showSequence();
  }, 1000);
}

cardsContainer.addEventListener('click', e => {
  if (!canClick) return;
  if (!e.target.classList.contains('card')) return;

  const cards = [...cardsContainer.children];
  const idx = cards.indexOf(e.target);
  if (userSequence.includes(idx)) return;

  e.target.textContent = sequence[idx];
  e.target.classList.add('flipped');
  userSequence.push(idx);

  if (userSequence.length === sequence.length) {
    canClick = false;
    checkResult();
  }
});

function checkResult() {
  let correct = true;
  for (let i = 0; i < sequence.length; i++) {
    const cardNum = cardsContainer.children[i].textContent;
    if (parseInt(cardNum) !== sequence[i]) {
      correct = false;
      break;
    }
  }

  if (correct) {
    resultDiv.textContent = `레벨 ${level} 통과! 다음 레벨로!`;
    level++;
  } else {
    resultDiv.textContent = `실패! 최종 레벨: ${level}`;
    level = 1;
  }
  adBanner.style.display = 'block';
}

startBtn.addEventListener('click', startGame);
