
let level = 1;
let board = document.getElementById("board");
let timerEl = document.getElementById("timer");
let levelInfo = document.getElementById("level-info");
let resultBox = document.getElementById("result");
let resultMsg = document.getElementById("result-message");
let scoreInfo = document.getElementById("score-info");
let timer;
let timeLimit = 30;
let flippedCards = [];
let matched = 0;
let score = 0;
let gameOver = false;

function getGridSize(level) {
  const sizes = [
    [2, 2], [2, 3], [2, 4], [3, 4], [4, 4], [4, 5], [4, 6], [5, 6]
  ];
  return sizes[Math.min(level - 1, sizes.length - 1)];
}

function startGame() {
  gameOver = false;
  resultBox.classList.add("hidden");
  board.innerHTML = "";
  flippedCards = [];
  matched = 0;
  scoreInfo.textContent = "점수: " + score;
  levelInfo.textContent = "레벨: " + level;
  const [rows, cols] = getGridSize(level);
  board.style.gridTemplateColumns = `repeat(${cols}, minmax(50px, 1fr))`;
  let numPairs = (rows * cols) / 2;
  let numbers = [];
  for (let i = 1; i <= numPairs; i++) {
    numbers.push(i);
    numbers.push(i);
  }
  numbers = numbers.sort(() => Math.random() - 0.5);

  numbers.forEach((num) => {
    const card = document.createElement("div");
    card.className = "card";
    const inner = document.createElement("div");
    inner.className = "card-inner";
    inner.innerHTML = `
      <div class="card-front">${num}</div>
      <div class="card-back">?</div>
    `;
    card.appendChild(inner);
    card.addEventListener("click", () => flipCard(card, num));
    board.appendChild(card);
  });

  const revealTime = Math.min(3000 + (level - 1) * 500, 6500);
  document.querySelectorAll(".card").forEach(c => c.classList.add("flip"));
  setTimeout(() => {
    document.querySelectorAll(".card").forEach(c => c.classList.remove("flip"));
    startTimer();
  }, revealTime);
}

function flipCard(card, num) {
  if (gameOver) return;
  if (card.classList.contains("flip") || flippedCards.length >= 2) return;
  card.classList.add("flip");
  flippedCards.push({ card, num });

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.num === second.num) {
      matched += 1;
      score += 10;
      scoreInfo.textContent = "점수: " + score;
      flippedCards = [];
      if (matched === board.children.length / 2) {
        clearInterval(timer);
        gameOver = true;
        showResult("성공! 다음 레벨로!");
        level++;
        setTimeout(startGame, 2000);
      }
    } else {
      setTimeout(() => {
        first.card.classList.remove("flip");
        second.card.classList.remove("flip");
        flippedCards = [];
      }, 1000);
    }
  }
}

function startTimer() {
  let time = timeLimit;
  timerEl.textContent = `남은 시간: ${time}초`;
  timer = setInterval(() => {
    time -= 1;
    timerEl.textContent = `남은 시간: ${time}초`;
    if (time === 0) {
      clearInterval(timer);
      gameOver = true;
      showResult("시간 초과! 실패!");
    }
  }, 1000);
}

function showResult(msg) {
  resultMsg.textContent = msg;
  resultBox.classList.remove("hidden");
}
window.onload = startGame;
