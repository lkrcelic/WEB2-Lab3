let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let asteroids = [];

export function createAsteroid(canvas, ctx) {
  let size = Math.random() * 150 + 40;
  let randomValue = Math.random(); // Single call to Math.random()

  // Use the same random value for both spawn edge and direction
  let spawnEdge = Math.floor(randomValue * 4); // 0 - top, 1 - right, 2 - bottom, 3 - left
  let rndNumber = (randomValue < 0.5) ? -1 : 1; // Reuse random value for direction

  let asteroid = {
    x: 0, y: 0,
    width: size,
    height: size,
    speedX: (Math.random() * 3) * (120 / size), // Horizontal speed
    speedY: (Math.random() * 3) * (120 / size), // Vertical speed
    image: new Image()
  };

  switch (spawnEdge) {
    case 0: // Top
      asteroid.x = Math.random() * canvas.width;
      asteroid.y = -size;
      asteroid.speedX *= rndNumber;
      break;
    case 1: // Right
      asteroid.x = canvas.width + size;
      asteroid.y = Math.random() * canvas.height;
      asteroid.speedX *= -1;
      asteroid.speedY *= rndNumber;
      break;
    case 2: // Bottom
      asteroid.x = Math.random() * canvas.width;
      asteroid.y = canvas.height + size;
      asteroid.speedY *= -1;
      asteroid.speedX *= rndNumber;
      break;
    case 3: // Left
      asteroid.x = -size;
      asteroid.y = Math.random() * canvas.height;
      asteroid.speedX *= 1;
      asteroid.speedY *= rndNumber;
      break;
  }

  // Load asteroid image
  asteroid.image.src = './../img/asteroid.png';
  asteroid.image.onload = function () {
    ctx.drawImage(asteroid.image, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
  };

  return asteroid;
}

export function initAsteroids() {
  let asteroid = createAsteroid(canvas, ctx);
  asteroids.push(asteroid);
}

export function updateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    let asteroid = asteroids[i];

    // Update position
    asteroid.x += asteroid.speedX;
    asteroid.y += asteroid.speedY;

    // Check if the asteroid has moved off-screen
    if (asteroid.x + asteroid.width < 0 || // Left edge
      asteroid.x > canvas.width ||      // Right edge
      asteroid.y + asteroid.height < 0 || // Top edge
      asteroid.y > canvas.height) {      // Bottom edge
      asteroids.splice(i, 1);
      i--;
    }
  }
}


export function drawAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    let ast = asteroids[i];
    ctx.drawImage(ast.image, ast.x, ast.y, ast.width, ast.height);
  }
}

export function getAsteroids() {
  return asteroids;
}

export function removeAsteroids() {
  asteroids = [];
}
