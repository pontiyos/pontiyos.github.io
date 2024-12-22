document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const playerNameDropdown = document.getElementById('player-name');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const victoryScreen = document.getElementById('victory-screen');
    const tryAgainScreen = document.getElementById('try-again-screen');
    const infoScreen = document.getElementById('info-screen');
    const infoStartButton = document.getElementById('info-start-button');
    const requiredPoints = document.getElementById('required-points');
    const timeLimit = document.getElementById('time-limit');
    const scoreDisplay = document.getElementById('score-display');
    const timerDisplay = document.getElementById('timer-display');
    const gameCanvas = document.getElementById('game-canvas');
    const victoryRestartButton = document.getElementById('victory-restart-button');
    const tryAgainRestartButton = document.getElementById('try-again-restart-button');
    const ctx = gameCanvas.getContext('2d');

    // Background music setup with alternating tracks
    const musicTracks = [
        'Audio\\Christmas Chaos (Jingle Till You Drop)_M.mp3',
        'Audio\\More Christmas (Till It Breaks)_2.mp3'
    ];
    let backgroundMusic = new Audio(musicTracks[Math.floor(Math.random() * musicTracks.length)]);
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;

    function playRandomMusic() {
        backgroundMusic.pause();
        backgroundMusic = new Audio(musicTracks[Math.floor(Math.random() * musicTracks.length)]);
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();
    }

    let score = 0;
    let targets = [];
    let isPlaying = false;
    let timer = 0;
    let spawnInterval;

    const difficultySettings = {
        easy: { points: 500, time: 30 },
        medium: { points: 1000, time: 15 },
        hard: { points: 1500, time: 10 },
    };

    const positiveTargets = [
        { image: "img\\Xmas\\Target_1.webp", points: 100 },
        { image: "img\\Xmas\\Target_2.webp", points: 100 },
        { image: "img\\Xmas\\Target_3.webp", points: 100 },
    ];

    const negativeTargets = [
        { image: "img\\Xmas\\Nope_1.png", points: -50 },
        { image: "img\\Xmas\\Nope_2.webp", points: -50 },
    ];

    class Target {
        constructor(x, y, size, image, points) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.image = new Image();
            this.image.src = image;
            this.points = points; // Positive or negative points
        }

        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }

        isHit(x, y) {
            return (
                x >= this.x &&
                x <= this.x + this.size &&
                y >= this.y &&
                y <= this.y + this.size
            );
        }
    }

    startButton.addEventListener('click', () => {
        const selectedDifficulty = playerNameDropdown.value;
        if (!selectedDifficulty) {
            alert('Please select your name to start the game.');
            return;
        }
        playRandomMusic(); // Play random track when game begins
        showInfoScreen(selectedDifficulty);
    });

    function showInfoScreen(difficulty) {
        const settings = difficultySettings[difficulty];
        requiredPoints.textContent = settings.points;
        timeLimit.textContent = settings.time;
        startScreen.style.display = "none";
        infoScreen.style.display = "flex";
    }

    infoStartButton.addEventListener('click', () => {
        const selectedDifficulty = playerNameDropdown.value;
        infoScreen.style.display = "none";
        startGame(selectedDifficulty);
    });

    function startGame(difficulty) {
        score = 0;
        timer = difficultySettings[difficulty].time;
        isPlaying = true;
        targets = [];
        gameCanvas.width = window.innerWidth * 0.8;
        gameCanvas.height = window.innerHeight * 0.6;
        gameScreen.style.display = "block";
        victoryScreen.style.display = "none";
        tryAgainScreen.style.display = "none";
        updateScore();
        updateTimer();
        spawnTargets(difficulty);
        gameLoop();
        countdownTimer(difficulty);
    }

    function spawnTargets(difficulty) {
        const totalTargets = Math.ceil(difficultySettings[difficulty].points / 100) * 3; // Triple the total targets
        const spawnRate = Math.max(
            300, // Minimum spawn interval
            (difficultySettings[difficulty].time * 1000) / totalTargets
        );

        spawnInterval = setInterval(() => {
            if (!isPlaying) return;

            const x = Math.random() * (gameCanvas.width - 50);
            const y = Math.random() * (gameCanvas.height - 50);
            const size = 70;

            // Randomly choose between positive and negative targets
            const isNegative = Math.random() < 0.2; // 20% chance for negative targets
            const targetData = isNegative
                ? negativeTargets[Math.floor(Math.random() * negativeTargets.length)]
                : positiveTargets[Math.floor(Math.random() * positiveTargets.length)];

            const target = new Target(x, y, size, targetData.image, targetData.points);
            targets.push(target);
        }, spawnRate);
    }

    function updateScore() {
        scoreDisplay.textContent = `Poäng: ${score}`;
    }

    function updateTimer() {
        timerDisplay.textContent = `Tid: ${timer}`;
    }

    function countdownTimer(difficulty) {
        const timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                updateTimer();
            } else {
                clearInterval(timerInterval);
                if (score >= difficultySettings[difficulty].points) {
                    endGame();
                } else {
                    failGame();
                }
            }
        }, 1000);
    }

    function gameLoop() {
        if (!isPlaying) return;
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        targets.forEach((target) => target.draw());
        requestAnimationFrame(gameLoop);
    }

    gameCanvas.addEventListener('click', (e) => {
        if (!isPlaying) return;

        const rect = gameCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        targets.forEach((target, index) => {
            if (target.isHit(clickX, clickY)) {
                score += target.points; // Add or deduct points
                updateScore();
                targets.splice(index, 1);
                checkVictory();
            }
        });
    });

    function checkVictory() {
        if (score >= difficultySettings[playerNameDropdown.value].points) {
            endGame();
        }
    }

    function endGame() {
        isPlaying = false;
        clearInterval(spawnInterval);
        gameScreen.style.display = 'none';
        victoryScreen.style.display = 'flex';
    }

    function failGame() {
        isPlaying = false;
        clearInterval(spawnInterval);
        gameScreen.style.display = 'none';
        tryAgainScreen.style.display = 'flex';
    }

    victoryRestartButton.addEventListener('click', restartGame);
    tryAgainRestartButton.addEventListener('click', restartGame);

    function restartGame() {
        score = 0;
        isPlaying = false;
        targets = [];
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        startScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        victoryScreen.style.display = 'none';
        tryAgainScreen.style.display = 'none';
        infoScreen.style.display = 'none';
        playRandomMusic(); // Play new random track on restart
    }
});
