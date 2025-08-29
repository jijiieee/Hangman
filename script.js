const categories = {
  fruits: ['apple', 'banana', 'orange', 'mango', 'pear'],
  computers: ['keyboard', 'monitor', 'mouse', 'laptop', 'printer'],
  animals: ['elephant', 'giraffe', 'zebra', 'penguin', 'kangaroo'],
  sports: ['soccer', 'tennis', 'baseball', 'badminton', 'hockey'],
  countries: ['canada', 'brazil', 'japan', 'india', 'germany'],
  colors: ['purple', 'pink', 'orange', 'yellow', 'magenta']
};

const categorySelect = document.getElementById('category');
const startGameBtn = document.getElementById('startGameBtn');
const gameArea = document.getElementById('gameArea');
const wordDisplay = document.getElementById('wordDisplay');
const message = document.getElementById('message');
const livesDisplay = document.getElementById('lives');
const letterInput = document.getElementById('letterInput');
const guessBtn = document.getElementById('guessBtn');
const playAgainBtn = document.getElementById('playAgain');
const hangmanParts = document.querySelectorAll('#hangman .part:not(.base)');

let chosenWord = '';
let displayedWord = [];
let lives = 6;
let guessedLetters = [];

categorySelect.addEventListener('change', () => {
  startGameBtn.disabled = !categorySelect.value;
});

startGameBtn.addEventListener('click', startGame);

guessBtn.addEventListener('click', guessLetter);

letterInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') guessLetter();
});

playAgainBtn.addEventListener('click', resetGame);

function startGame() {
  const category = categorySelect.value;
  const arr = categories[category];
  chosenWord = arr[Math.floor(Math.random() * arr.length)].toLowerCase();
  displayedWord = Array(chosenWord.length).fill('_');
  lives = 6;
  guessedLetters = [];
  message.textContent = '';
  livesDisplay.textContent = `Lives: ${lives}`;
  updateDisplay();
  gameArea.style.display = 'block';
  categorySelect.disabled = true;
  startGameBtn.disabled = true;
  letterInput.value = '';
  letterInput.focus();
  playAgainBtn.style.display = 'none';
  updateHangman();
}

function updateDisplay() {
  wordDisplay.textContent = displayedWord.join(' ');
}

function updateHangman() {
  const wrongCount = categories['fruits'].includes(chosenWord)
    ? (6 - lives) // dummy
    : (6 - lives);
  hangmanParts.forEach((part, i) => {
    part.style.display = i < (6 - lives) ? 'block' : 'none';
  });
}

function guessLetter() {
  const letter = letterInput.value.toLowerCase();
  letterInput.value = '';
  if (!letter.match(/^[a-z]$/)) {
    message.textContent = 'Enter a valid letter.';
    return;
  }
  if (guessedLetters.includes(letter)) {
    message.textContent = 'Already guessed!';
    return;
  }
  guessedLetters.push(letter);

  if (chosenWord.includes(letter)) {
    chosenWord.split('').forEach((ch, i) => {
      if (ch === letter) displayedWord[i] = letter;
    });
    message.textContent = 'Nice!';
  } else {
    lives--;
    message.textContent = `Wrong! Lives left: ${lives}`;
  }

  livesDisplay.textContent = `Lives: ${lives}`;
  updateDisplay();
  updateHangman();
  checkGameEnd();
}

function checkGameEnd() {
  if (!displayedWord.includes('_')) {
    message.textContent = 'You won!';
    endGame();
  } else if (lives <= 0) {
    message.textContent = `You lost! Word was: ${chosenWord}`;
    displayedWord = chosenWord.split('');
    updateDisplay();
    endGame();
  }
}

function endGame() {
  guessBtn.disabled = true;
  letterInput.disabled = true;
  playAgainBtn.style.display = 'inline-block';
}

function resetGame() {
  gameArea.style.display = 'none';
  categorySelect.disabled = false;
  categorySelect.value = '';
  startGameBtn.disabled = true;
  message.textContent = '';
  wordDisplay.textContent = '';
  livesDisplay.textContent = '';
  guessBtn.disabled = false;
  letterInput.disabled = false;
  updateHangman();
}
