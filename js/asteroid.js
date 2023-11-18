let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let asteroids = [];

export function createAsteroid() {
  let size = Math.random() * 110 + 30;
  let asteroid = {
    x: Math.random() * canvas.width,
    y: -300,
    width: size,
    height: size,
    speed: Math.random() * 4 + (250 / size),
    image: new Image()
  };

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
    asteroids[i].y += asteroids[i].speed;
    // Remove asteroids that move off-screen
    if (asteroids[i].y > canvas.height) {
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
