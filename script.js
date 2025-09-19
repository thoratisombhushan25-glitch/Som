const gridElement = document.getElementById('gameGrid');
const challengeTextElement = document.getElementById('challengeText');
const answerInputElement = document.getElementById('answerInput');
const submitButton = document.getElementById('submitAnswer');
const feedbackMessageElement = document.getElementById('feedbackMessage');
const timeLeftElement = document.getElementById('timeLeft');
const currentScoreElement = document.getElementById('currentScore');
const startGameButton = document.getElementById('startGame');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartGameButton = document.getElementById('restartGame');
const teamNameElement = document.getElementById('teamName');

let gridSize = 5; // 5x5 grid
let currentSquareIndex = 0;
let score = 0;
let timer;
let timeLeft = 180; // 3 minutes in seconds
let gameStarted = false;

// Define your challenges here.
// Each object represents a square. 'type' could be 'riddle', 'trivia', 'bonus', 'penalty'.
// For simplicity, I'll use just riddles and a bonus for now.
const challenges = [
    { question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo", type: "riddle" },
    { question: "What has an eye but cannot see?", answer: "needle", type: "riddle" },
    { question: "I have cities, but no houses; forests, but no trees; and water, but no fish. What am I?", answer: "map", type: "riddle" },
    { question: "What is full of holes but still holds water?", answer: "sponge", type: "riddle" },
    { question: "I am always in front of you but can’t be seen. What am I?", answer: "future", type: "riddle" },
    { question: "Bonus! +5 points instantly!", answer: "", type: "bonus" },
    { question: "What has to be broken before you can use it?", answer: "egg", type: "riddle" },
    { question: "What is always coming, but never arrives?", answer: "tomorrow", type: "riddle" },
    { question: "What can be caught, but not thrown?", answer: "cold", type: "riddle" },
    { question: "What question can you never answer yes to?", answer: "are you asleep yet", type: "riddle" },
    { question: "What has legs, but cannot walk?", answer: "table", type: "riddle" },
    { question: "What has to be broken before you can use it?", answer: "egg", type: "riddle" }, // Duplicated for example length
    { question: "What is always coming, but never arrives?", answer: "tomorrow", type: "riddle" }, // Duplicated
    { question: "What can be caught, but not thrown?", answer: "cold", type: "riddle" }, // Duplicated
    { question: "Bonus! +5 points instantly!", answer: "", type: "bonus" },
    { question: "What has an eye but cannot see?", answer: "needle", type: "riddle" }, // Duplicated
    { question: "I have cities, but no houses; forests, but no trees; and water, but no fish. What am I?", answer: "map", type: "riddle" }, // Duplicated
    { question: "What is full of holes but still holds water?", answer: "sponge", type: "riddle" }, // Duplicated
    { question: "I am always in front of you but can’t be seen. What am I?", answer: "future", type: "riddle" }, // Duplicated
    { question: "What question can you never answer yes to?", answer: "are you asleep yet", type: "riddle" }, // Duplicated
    { question: "What has legs, but cannot walk?", answer: "table", type: "riddle" }, // Duplicated
    { question: "What has to be broken before you can use it?", answer: "egg", type: "riddle" }, // Duplicated
    { question: "What is always coming, but never arrives?", answer: "tomorrow", type: "riddle" }, // Duplicated
    { question: "Bonus! +5 points instantly!", answer: "", type: "bonus" },
    { question: "What can be caught, but not thrown?", answer: "cold", type: "riddle" }, // Duplicated

];

function initializeGrid() {
    gridElement.innerHTML = ''; // Clear existing grid
    for (let i = 0; i < gridSize * gridSize; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.dataset.index = i;
        gridElement.appendChild(square);
    }
}

function updateGridDisplay() {
    const squares = document.querySelectorAll('.grid-square');
    squares.forEach((square, index) => {
        square.classList.remove('current', 'solved');
        if (index < currentSquareIndex) {
            square.classList.add('solved');
        }
        if (index === currentSquareIndex) {
            square.classList.add('current');
        }
        // Display something in solved squares like a checkmark
        if (square.classList.contains('solved') && !square.textContent) {
             square.innerHTML = '&#10003;'; // Checkmark
        } else if (!square.classList.contains('solved') && !square.classList.contains('current')) {
            square.textContent = '?'; // Unsolved
        }
        // For current square, clear content as challenge is in challenge area
        if (square.classList.contains('current')) {
            square.textContent = '';
        }
    });
}


function displayChallenge() {
    if (currentSquareIndex >= challenges.length) {
        endGame();
        return;
    }

    const currentChallenge = challenges[currentSquareIndex];
    challengeTextElement.textContent = currentChallenge.question;
    answerInputElement.value = '';
    feedbackMessageElement.textContent = '';
    answerInputElement.focus();

    if (currentChallenge.type === "bonus") {
        score += 5;
        currentScoreElement.textContent = score;
        feedbackMessageElement.textContent = "Bonus! +5 points!";
        setTimeout(() => {
            currentSquareIndex++;
            updateGridDisplay();
            displayChallenge();
        }, 1000); // Auto-advance after bonus
    }
}

function checkAnswer() {
    const userAnswer = answerInputElement.value.trim().toLowerCase();
    const currentChallenge = challenges[currentSquareIndex];

    if (currentChallenge.type === "bonus") {
        // Should have already advanced
        return;
    }

    if (userAnswer === currentChallenge.answer.toLowerCase()) {
        score += 10;
        currentScoreElement.textContent = score;
        feedbackMessageElement.textContent = "Correct! +10 points!";
        currentSquareIndex++;
        updateGridDisplay();
        setTimeout(displayChallenge, 500); // Show next challenge after a short delay
    } else {
        feedbackMessageElement.textContent = "Wrong attempt. Try again!";
    }
    answerInputElement.value = ''; // Clear input for next attempt
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeLeftElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function startGame() {
    gameStarted = true;
    startGameButton.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gridElement.style.display = 'grid'; // Show grid
    document.querySelector('.challenge-area').style.display = 'block'; // Show challenge area

    // Prompt for team name (simple for now, could be a modal)
    const team = prompt("Enter your team name (2-3 players):");
    teamNameElement.textContent = team || "Team Alpha";

    currentSquareIndex = 0;
    score = 0;
    timeLeft = 180; // Reset time
    currentScoreElement.textContent = score;
    timeLeftElement.textContent = "03:00";
    feedbackMessageElement.textContent = '';

    initializeGrid();
    updateGridDisplay();
    displayChallenge();
    startTimer();
}

function endGame() {
    gameStarted = false;
    clearInterval(timer);
    challengeTextElement.textContent = "Game Over!";
    answerInputElement.style.display = 'none';
    submitButton.style.display = 'none';
    feedbackMessageElement.textContent = '';
    gridElement.style.display = 'none'; // Hide grid
    document.querySelector('.challenge-area').style.display = 'none'; // Hide challenge area

    gameOverScreen.style.display = 'block';
    finalScoreElement.textContent = score;
}

function restartGame() {
    answerInputElement.style.display = 'block';
    submitButton.style.display = 'block';
    startGame(); // Simply restart the game
}


// Event Listeners
startGameButton.addEventListener('click', startGame);
submitButton.addEventListener('click', checkAnswer);
answerInputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});
restartGameButton.addEventListener('click', restartGame);


// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    // Hide game elements until start
    gridElement.style.display = 'none';
    document.querySelector('.challenge-area').style.display = 'none';
});
