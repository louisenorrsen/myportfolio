import { getHighScores, saveHighScores } from "../../js/highscore.js";

let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

let highScores = getHighScores("guess-the-number");

const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const highscoreButton = document.getElementById("highscoreButton");
const feedback = document.getElementById("feedback");
const attemptsDisplay = document.getElementById("attempts");

highscoreButton.addEventListener("click", () => {
    alert(`High Scores:\n${highScores.map((score, index) => 
        `${index + 1}. ${score.date}: ${score.score} guesses`).join("\n")}`);
});

submitGuess.addEventListener("click", () => {
    const userGuess = parseInt(guessInput.value);
    console.log(`User guessed: ${userGuess}, Secret number: ${secretNumber}`);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        feedback.textContent = "Please enter a valid number between 1 and 100.";
        feedback.classList.remove("correct", "wrong");
        return;
    }
    attempts++;
    attemptsDisplay.textContent = `Guesses: ${attempts}`;
    if (userGuess < secretNumber) {
        feedback.textContent = "Higher! ⬆";
        feedback.classList.remove("correct");
        feedback.classList.add("wrong");
    } else if (userGuess > secretNumber) {
        feedback.textContent = "Lower! ⬇";
        feedback.classList.add("wrong");
        feedback.classList.remove("correct");
    } else {
        feedback.textContent = `Correct! ❤`;
        feedback.classList.remove("wrong");
        feedback.classList.add("correct");
        if (highScores.length < 5 || attempts < highScores[highScores.length - 1].score) {
            highScores = saveHighScores("guess-the-number", attempts, true);
            alert(`New High Score! You've guessed the number in ${attempts} guesses.`);
        }
        attemptsDisplay.textContent = `You've guessed the number ${secretNumber} in ${attempts} guesses.`;
        // Reset the game
        secretNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
    }
    guessInput.value = "";
});