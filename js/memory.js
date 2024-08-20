import { shopState } from "./state.js";

const shapes = ["♠", "♥", "♦", "♣", "★", "☆", "◆", "◇"];
const gameBoard = document.getElementById("gameBoard");
let flippedCards = [];
let matchedPairs = 0;

function createBoard() {
  const shuffledShapes = [...shapes, ...shapes].sort(() => Math.random() - 0.5);

  for (let i = 0; i < 16; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.shape = shuffledShapes[i];
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  }
}

function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
    this.classList.add("flipped");
    this.textContent = this.dataset.shape;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 500);
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.shape === card2.dataset.shape) {
    matchedPairs++;
    if (matchedPairs === 8) {
      endMemoryGame(true);
    }
  } else {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    card1.textContent = "";
    card2.textContent = "";
  }
  flippedCards = [];
}

function endMemoryGame(success) {
  let reward = success ? 10 : 5; // Reward based on success
  shopState.currency += reward;
  updateCurrencyDisplay();
  showGameOverScreen(reward, success);
}

function showGameOverScreen(reward, success) {
  const gameOverScreen = document.getElementById("game-over-screen");
  gameOverScreen.classList.remove("hidden");

  const message = success
    ? `Congratulations! You earned ${reward} currency!`
    : `Good effort! You earned ${reward} currency.`;

  document.getElementById("game-over-message").textContent = message;

  document.getElementById("replay-btn").addEventListener("click", () => {
    gameOverScreen.classList.add("hidden");
    resetGame();
    createBoard();
  });

  document.getElementById("return-btn").addEventListener("click", () => {
    gameOverScreen.classList.add("hidden");
    // Logic to return to the main pet UI
  });
}

function resetGame() {
  gameBoard.innerHTML = "";
  flippedCards = [];
  matchedPairs = 0;
}

// export function updateCurrencyDisplay() {
//   const currencyElement = document.getElementById("currency-amount");

//   if (currencyElement) {
//     currencyElement.textContent = shopState.currency;
//   } else {
//     console.error("Currency display element not found.");
//   }
// }

// // Ensure that updateCurrencyDisplay is called only when necessary
// document.addEventListener("DOMContentLoaded", () => {
//   updateCurrencyDisplay();
// });
