import { getDailyProgress, saveDailyProgress } from '../../js/dailies.js';
const gameName = 'multi-challenge';

let selectedTable = null;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const pregameContainer = document.querySelector('#pregameContainer');
const gameContainer = document.querySelector('#gameContainer');
const result = document.querySelector('#result');

const questionElement = document.querySelector('#question');
const answerButtons = document.querySelectorAll('.answer-button');

const progressElement = document.querySelector('#progress');
const scoreElement = document.querySelector('#score');
const feedbackElement = document.querySelector('#feedback');

const finalScoreElement = document.querySelector('#final-score');

const restartButton = document.querySelector('#restart-button');
const chooseTableButton = document.querySelector('#choose-table-button');

const tableButtons = document.querySelectorAll('[data-table]');

function updateTableStars() {
  tableButtons.forEach((button) => {
    const table = Number(button.dataset.table);
    const stars = getDailyProgress(gameName, table);

    const starsElement = button.querySelector('.stars');

    if (!starsElement) {
      return;
    }

    starsElement.innerHTML = '<span class="filled">' + '★'.repeat(stars) + '</span>' + '<span class="empty">' + '☆'.repeat(3 - stars) + '</span>';
  });
}

function showElement(element) {
  element.classList.remove('is-hidden');
}

function hideElement(element) {
  element.classList.add('is-hidden');
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createQuestions(table) {
  const questions = [];

  // 0 till 11 = 12 frågor
  for (let multiplier = 0; multiplier <= 11; multiplier++) {
    questions.push({
      multiplier,
      answer: table * multiplier,
    });
  }

  return questions;
}

function createAnswerOptions(table, correctAnswer) {
  const answers = new Set();

  // Det korrekta svaret ska alltid finnas.
  answers.add(correctAnswer);

  while (answers.size < 3) {
    const multiplier = Math.floor(Math.random() * 12);
    const answer = table * multiplier;

    answers.add(answer);
  }

  return shuffle([...answers]);
}

function showResult() {
  hideElement(gameContainer);
  showElement(result);

  finalScoreElement.textContent = `${score} out of ${questions.length} correct!`;

  const starsEarned = score >= 12 ? 3 : score >= 8 ? 2 : score >= 4 ? 1 : 0;

  saveDailyProgress('multi-challenge', selectedTable, starsEarned);

  updateTableStars();
}

function checkAnswer(selectedAnswer, correctAnswer) {
  // Förhindra flera klick på samma fråga.
  answerButtons.forEach((button) => {
    button.disabled = true;
  });

  const selectedButton = [...answerButtons].find((button) => Number(button.dataset.answer) === selectedAnswer);

  if (selectedAnswer === correctAnswer) {
    score++;
    selectedButton.classList.add('correct');
  } else {
    selectedButton.classList.add('wrong');
    answerButtons.forEach((button) => {
      if (Number(button.dataset.answer) === correctAnswer) {
        button.classList.add('correct');
      }
    });
  }

  scoreElement.textContent = `Correct Answers: ${score}`;

  setTimeout(() => {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
      showResult();
    } else {
      showQuestion();
    }
  }, 1000);
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  const multiplier = currentQuestion.multiplier;
  const correctAnswer = currentQuestion.answer;

  questionElement.textContent = `${selectedTable} × ${multiplier}`;

  progressElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  scoreElement.textContent = `Correct Answers: ${score}`;

  feedbackElement.textContent = '';

  const answers = createAnswerOptions(selectedTable, correctAnswer);

  answerButtons.forEach((button, index) => {
    button.classList.remove('correct', 'wrong');
    button.disabled = false;
    button.dataset.answer = answers[index];
    button.textContent = answers[index];

    button.disabled = false;

    button.onclick = () => {
      checkAnswer(Number(button.dataset.answer), correctAnswer);
    };
  });
}

function startGame() {
  currentQuestionIndex = 0;
  score = 0;

  // Skapa alla 12 frågor.
  questions = createQuestions(selectedTable);

  // Slumpa ordningen på frågorna.
  shuffle(questions);

  hideElement(pregameContainer);
  hideElement(result);
  showElement(gameContainer);

  showQuestion();
}

updateTableStars();

tableButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedTable = Number(button.dataset.table);

    startGame();
  });
});

restartButton.addEventListener('click', () => {
  startGame();
});

chooseTableButton.addEventListener('click', () => {
  hideElement(result);
  hideElement(gameContainer);
  showElement(pregameContainer);
});
