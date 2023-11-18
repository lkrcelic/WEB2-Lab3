import {drawPlayer, getPlayer, initPlayer, updatePlayerPosition} from './player.js'
import {drawAsteroids, getAsteroids, initAsteroids, removeAsteroids, updateAsteroids} from "./asteroid.js";

document.addEventListener("DOMContentLoaded", function () {
  let canvas = document.getElementById('gameCanvas');
  let ctx = canvas.getContext('2d');
  const audio = new Audio('./../explosion.mp3');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const keysPressed = {};
  let play;
  let startTime;
  let elapsedTime;
  let asteroidCreationIntervalId;
  let asteroidSpeedUpIntervalId;
  let currentInterval;
  let minInterval;

  // Initialize the game
  function initGame() {
    currentInterval = 1000;
    minInterval = 100;

    initPlayer();
    initAsteroids();
    asteroidCreationIntervalId = setInterval(initAsteroids, currentInterval);
    asteroidSpeedUpIntervalId = setInterval(setupAsteroidIntervalDecrease, 10000);

    startTime = Date.now();
    elapsedTime = 0;

    // Event listeners for keyboard input
    window.addEventListener('keydown', function (e) {
      keysPressed[e.key] = true;
    });

    window.addEventListener('keyup', function (e) {
      keysPressed[e.key] = false;
    });

    // Start game loop
    play = true;
    requestAnimationFrame(gameLoop);
  }

  function updateTimer() {
    elapsedTime = Date.now() - startTime;
  }

  function formatTime(time) {
    let date = new Date(time);
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');
    let milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  }

  function displayElapsedTime() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#FFF';
    ctx.fillText(formatTime(elapsedTime), 10, 20);
  }

  // Decrease the interval by 100 every 10 seconds until it reaches the minimum
  function setupAsteroidIntervalDecrease() {
      if (currentInterval > minInterval) {
        currentInterval -= 100;
        clearInterval(asteroidCreationIntervalId);
        asteroidCreationIntervalId = setInterval(initAsteroids, currentInterval);
      }
  }

  function checkCollision(player, asteroids) {
    for (let i = 0; i < asteroids.length; i++) {
      // Check if the player and the asteroid occupy the same space
      if (checkCollisionWithCircle(player, asteroids[i])) {
        return true;
      }
    }
    return false;
  }

  function getCenterAndRadius(object) {
    return {
      centerX: object.x + object.width / 2,
      centerY: object.y + object.height / 2,
      radius: Math.min(object.width, object.height) / 2
    };
  }

  function checkCollisionWithCircle(object1, object2) {
    let obj1 = getCenterAndRadius(object1);
    let obj2 = getCenterAndRadius(object2);

    let dx = obj1.centerX - obj2.centerX;
    let dy = obj1.centerY - obj2.centerY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance < obj1.radius + obj2.radius;
  }


  function endGame() {
    //cancelAnimationFrame(animationFrameId);
    clearInterval(asteroidCreationIntervalId);
    clearInterval(asteroidSpeedUpIntervalId);
    removeAsteroids();

    playCollisionSound()
      .then(() => {
        updateHighScore(elapsedTime);

        handleGameOver();
      });
  }

  // Function to handle game over
  function handleGameOver() {
    // Create a game over message element
    const gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'gameOverMessage';

    const formattedTime = formatTime(elapsedTime);
    gameOverMessage.innerHTML = `
        <p>Game Over!</p>
        <p>Your Time: <span id="elapsedTime">${formattedTime}</span></p>
        <p>Your Score: <span id="score">${elapsedTime}</span></p>
        <button id="restartButton">Restart</button>
    `;

    document.body.appendChild(gameOverMessage);

    // Add a click event listener to the restart button
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', () => {
      document.body.removeChild(gameOverMessage);
      initGame(); // Restart the game
    });
  }

  function updateHighScore(newTime) {
    let highScore = localStorage.getItem('highScore');
    if (!highScore || newTime > highScore) {
      localStorage.setItem('highScore', newTime);
      console.log(`New high score: ${formatTime(newTime)}`);
    }
  }

  function playCollisionSound() {
    return new Promise((resolve) => {
      audio.addEventListener('ended', () => {
        resolve();
      });
      audio.play()
    });
  }


  // Game loop
  async function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and display time
    updateTimer();
    displayElapsedTime();

    // Update and draw the player
    updatePlayerPosition(keysPressed);
    drawPlayer();

    // Update and draw asteroids
    updateAsteroids();
    drawAsteroids();
    // ... additional game loop logic ...

    // Check for collisions
    if (checkCollision(getPlayer(), getAsteroids())) {
      endGame();
      play = false;
    }

    if (play) {
      requestAnimationFrame(gameLoop);
    }
  }

  initGame();

});
