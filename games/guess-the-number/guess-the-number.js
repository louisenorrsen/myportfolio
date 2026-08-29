let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const feedback = document.getElementById("feedback");
const attemptsDisplay = document.getElementById("attempts");

submitGuess.addEventListener("click", () => {
    const userGuess = parseInt(guessInput.value);
    attempts++;
    attemptsDisplay.textContent = `Attempts: ${attempts}`;

    if (userGuess < secretNumber) {
        feedback.textContent = "Higher!";
        feedback.classList.remove("correct");
        feedback.classList.add("wrong");
    } else if (userGuess > secretNumber) {
        feedback.textContent = "Lower!";
        feedback.classList.add("wrong");
        feedback.classList.remove("correct");
    } else {
        feedback.textContent = `Correct!`;
        feedback.classList.remove("wrong");
        feedback.classList.add("correct");
        attemptsDisplay.textContent = `You've guessed the number ${secretNumber} in ${attempts} guesses.`;
        if (highScores.length < 5 || attempts < highScores[highScores.length - 1].score) {
            highScores = saveHighScores("guess-the-number", attempts, true);
            alert(`New High Score! You've guessed the number in ${attempts} guesses.`);
        }
        // Reset the game
        secretNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
    }
    guessInput.value = "";
});