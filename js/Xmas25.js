document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const playerNameDropdown = document.getElementById('player-name');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const victoryScreen = document.getElementById('victory-screen');
    const tryAgainScreen = document.getElementById('try-again-screen');
    const scoreDisplay = document.getElementById('score-display');
    const timerDisplay = document.getElementById('timer-display');
    const gameCanvas = document.getElementById('game-canvas');
    const victoryRestartButton = document.getElementById('victory-restart-button');
    const tryAgainRestartButton = document.getElementById('try-again-restart-button');
    const ctx = gameCanvas.getContext('2d');

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

    let targetImages = [
        "https://img.joomcdn.net/afc5cf5439622100ffebe0d0b7ad7d816ef8cb77_original.jpeg",
         "https://m.media-amazon.com/images/I/71CNCfmeQ5L._AC_SL1500_.jpg",
          "https://target.scene7.com/is/image/Target/GUEST_9e262c98-d293-4864-9942-79ccb67099fa?wid=488&hei=488&fmt=pjpeg"
        ]; 
        
    class Target {
        constructor(x, y, size, image) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.image = new Image();
            this.image.src = image;
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
        startGame(selectedDifficulty);
    });

    function startGame(difficulty) {
        score = 0;
        timer = difficultySettings[difficulty].time;
        isPlaying = true;
        targets = [];
        gameCanvas.width = window.innerWidth * 0.8;
        gameCanvas.height = window.innerHeight * 0.6;
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        victoryScreen.style.display = 'none';
        tryAgainScreen.style.display = 'none';
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
            const size = 50;
            const image = targetImages[Math.floor(Math.random() * targetImages.length)];
            const target = new Target(x, y, size, image);

            targets.push(target);
            checkVictory();
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

    function checkVictory() {
        if (score >= difficultySettings[playerNameDropdown.value].points) {
            endGame();
        }
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
                score += 100;
                updateScore();
                targets.splice(index, 1);
                checkVictory();
            }
        });
    });

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
    }
});
