let score = 0;
let level = 1;

let correctStreak = 0;
let wrongAnswers = 0;

let correctAnswer = 0;
let startTime = 0;

let gameOver = false;

const difficulty = [
  { name: 'Tal inom 10', type: 'within', max: 10 },
  { name: 'Tal inom 20', type: 'within', max: 20 },
  { name: 'Utan tiotalsövergång', type: 'noCrossTen', min: 10, max: 49 },
  { name: 'Med tiotalsövergång', type: 'crossTen', min: 10, max: 49 },
  { name: 'Räkna med tiotal', type: 'tens' },
  { name: 'Tvåsiffriga tal', type: 'twoDigit' },
  { name: 'Svårare tal inom 100', type: 'withinHundred' },
  { name: 'Hundratal', type: 'hundreds' },
];

const currentDifficulty = difficulty[Math.min(level - 1, difficulty.length - 1)];
const minNumber = currentDifficulty.min;
const maxNumber = currentDifficulty.max;

// HTML elements
const startButton = document.getElementById('startButton');
const submitButton = document.getElementById('submitAnswer');
const userAnswer = document.getElementById('answerInput');
const questionDisplay = document.getElementById('question');
const scoreDisplay = document.getElementById('scoreValue');
const gameInstructions = document.getElementById('game-instructions');
const pregameContainer = document.getElementById('pregameContainer');
const gameContainer = document.getElementById('gameContainer');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOperator() {
  return Math.random() < 0.5 ? '+' : '-';
}

function getCurrentDifficulty() {
  const index = Math.min(level - 1, difficulty.length - 1);
  return difficulty[index];
}

function generateQuestion() {
  const currentDifficulty = getCurrentDifficulty();
  let question;

  switch (currentDifficulty.type) {
    case 'within':
      question = generateWithin(currentDifficulty.max);
      break;
    case 'noCrossTen':
      question = generateNoCrossTen(currentDifficulty.min, currentDifficulty.max);
      break;
    case 'crossTen':
      question = generateCrossTen(currentDifficulty.min, currentDifficulty.max);
      break;
    case 'tens':
      question = generateTens();
      break;
    case 'twoDigit':
      question = generateTwoDigit();
      break;
    case 'withinHundred':
      question = generateWithinHundred();
      break;
    case 'hundreds':
      question = generateHundreds();
      break;
  }

  correctAnswer = question.answer;

  questionDisplay.textContent = `${question.num1} ${question.operator} ${question.num2}`;

  answerInput.value = '';

  answerInput.focus();

  startTime = performance.now();
}

function generateWithin(max) {
  const operator = getRandomOperator();
  let num1, num2;
  if (operator === '+') {
    num1 = getRandomNumber(0, max);
    num2 = getRandomNumber(0, max - num1);
    return { num1, num2, operator, answer: num1 + num2 };
  }
  num1 = getRandomNumber(0, max);
  num2 = getRandomNumber(0, num1);
  return { num1, num2, operator, answer: num1 - num2 };
}

function generateNoCrossTen(min, max) {
  const operator = getRandomOperator();
  let num1, num2;
  if (operator === '+') {
    do {
      num1 = getRandomNumber(min, max);
    } while (num1 % 10 === 9);

    const ones = num1 % 10;
    const maxSecond = 9 - ones;
    num2 = getRandomNumber(1, Math.max(1, maxSecond));

    return { num1, num2, operator, answer: num1 + num2 };
  }

  do {
    num1 = getRandomNumber(min, max);
  } while (num1 % 10 === 0);

  const ones = num1 % 10;
  num2 = getRandomNumber(1, ones);

  return { num1, num2, operator, answer: num1 - num2 };
}

function generateCrossTen(min, max) {
  const operator = getRandomOperator();
  let num1, num2;

  if (operator === '+') {
    do {
      num1 = getRandomNumber(min, max);
    } while (num1 % 10 === 0);

    const ones = num1 % 10;

    const minSecond = 10 - ones;

    num2 = getRandomNumber(minSecond, 9);

    return { num1, num2, operator, answer: num1 + num2 };
  }

  do {
    num1 = getRandomNumber(min, max);
  } while (num1 % 10 === 9);

  const ones = num1 % 10;

  const minSecond = ones + 1;

  num2 = getRandomNumber(minSecond, 9);

  return { num1, num2, operator, answer: num1 - num2 };
}

function generateTens() {
  const operator = getRandomOperator();
  let num1, num2;

  if (operator === '+') {
    do {
      num1 = getRandomNumber(20, 89);
    } while (Math.floor((100 - num1) / 10) < 1);

    const maxTens = Math.floor((100 - num1) / 10);

    num2 = getRandomNumber(1, maxTens) * 10;

    return { num1, num2, operator, answer: num1 + num2 };
  }

  num1 = getRandomNumber(20, 99);

  const maxTens = Math.floor(num1 / 10);

  num2 = getRandomNumber(1, maxTens) * 10;

  return { num1, num2, operator, answer: num1 - num2 };
}

function generateTwoDigit() {
  const operator = getRandomOperator();
  let num1, num2;

  if (operator === '+') {
    num1 = getRandomNumber(20, 70);

    const maxSecond = Math.min(30, 100 - num1);

    num2 = getRandomNumber(10, maxSecond);

    return { num1, num2, operator, answer: num1 + num2 };
  }

  num1 = getRandomNumber(30, 99);

  num2 = getRandomNumber(10, Math.min(30, num1));

  return { num1, num2, operator, answer: num1 - num2 };
}

function generateWithinHundred() {
  const operator = getRandomOperator();
  let num1, num2;

  if (operator === '+') {
    num1 = getRandomNumber(20, 89);

    num2 = getRandomNumber(10, 100 - num1);

    return { num1, num2, operator, answer: num1 + num2 };
  }

  num1 = getRandomNumber(20, 99);

  num2 = getRandomNumber(10, num1);

  return { num1, num2, operator, answer: num1 - num2 };
}

function generateHundreds() {
  const operator = getRandomOperator();
  let num1, num2;

  num1 = getRandomNumber(100, 500);

  if (operator === '+') {
    num2 = getRandomNumber(10, 99);

    return { num1, num2, operator, answer: num1 + num2 };
  }

  num2 = getRandomNumber(10, Math.min(99, num1));

  return { num1, num2, operator, answer: num1 - num2 };
}

function checkAnswer() {
  if (gameOver) {
    return;
  }

  if (userAnswer.value.trim() === '') {
    return;
  }

  const answer = Number(userAnswer.value);

  if (answer === correctAnswer) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }
}

function handleCorrectAnswer() {
    const responseTime = performance.now() - startTime;

    correctStreak++;

    const points = calculatePoints(responseTime);

    score += points;

    if (correctStreak >= 5) {
        increaseLevel();
    }

    updateGameInfo();

    setTimeout(() => {
        generateQuestion();
    }, 300);
}

function handleWrongAnswer() {
    wrongAnswers++;

    correctStreak = 0;

    updateGameInfo();
    
    if (wrongAnswers >= 3) {
        endGame();
        return;
    }

    setTimeout(() => {
        generateQuestion();
    }, 800);
}

function calculatePoints(responseTime) {
    const basePoints = 50 + ((level - 1) * 25);

    let speedBonus = 0;

    if (responseTime < 2000) {
        speedBonus = 50;
    } else if (responseTime < 4000) {
        speedBonus = 30;
    } else if (responseTime < 7000) {
        speedBonus = 15;
    }

    return basePoints + speedBonus;
}

function increaseLevel() {
    correctStreak = 0;

    if (level < difficulty.length) {
        level++;
    }
}

function updateGameInfo() {
    scoreDisplay.textContent = score;
}

function endGame() {
    gameOver = true;
}

function switchUI(){
    pregameContainer.style.display = "none";
    gameContainer.style.display = "flex";
}

startButton.addEventListener("click", () => {
    updateGameInfo();
    generateQuestion();
    switchUI();
})

submitButton.addEventListener("click", () => {
    checkAnswer();
})