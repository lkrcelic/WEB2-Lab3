let player;
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

export function initPlayer() {
    player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 55,   // Adjust based on your image size
    height: 70,  // Adjust based on your image size
    speed: 6,
    image: new Image()
  };
  // Load player image
  player.image.src = './../img/rocket.png';
  player.image.onload = function () {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
  };

  return player;
}

export function updatePlayerPosition(keysPressed) {
  if (keysPressed['ArrowUp'] || keysPressed['w']) {
    player.y -= player.speed;
  }
  if (keysPressed['ArrowDown'] || keysPressed['s']) {
    player.y += player.speed;
  }
  if (keysPressed['ArrowLeft']  || keysPressed['a']) {
    player.x -= player.speed;
  }
  if (keysPressed['ArrowRight'] || keysPressed['d']) {
    player.x += player.speed;
  }

  validatePlayerPosition(player, canvas); // Keep the player within the canvas boundaries
}

export function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function validatePlayerPosition() {
  // Boundary check for the left edge
  if (player.x < 0) {
    player.x = 0;
  }

  // Boundary check for the right edge
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // Boundary check for the top edge
  if (player.y < 0) {
    player.y = 0;
  }

  // Boundary check for the bottom edge
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
  }
}

export function getPlayer() {
  return player;
}
