const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let birdY = 150;
let birdVelocity = 0;
const gravity = 0.5;
const jump = -8;

let pipes = [];
const pipeWidth = 50;
const pipeGap = 140;
const pipeSpeed = 2;

let score = 0;
let isGameOver = false;
let isGameStarted = false;

// Vogel zeichnen (mit runden Kanten)
function drawBird() {
  ctx.fillStyle = '#FFD700'; // Goldgelb
  ctx.beginPath();
  ctx.arc(70, birdY + 10, 10, 0, Math.PI * 2);
  ctx.fill();
}

// Hindernisse zeichnen (modernes Grün)
function drawPipes() {
  ctx.fillStyle = '#4CAF50'; // Grüner Farbton
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
  });
}

// Punkteanzeige modernisiert
function drawScore() {
  ctx.fillStyle = '#000';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, 40);
}

// Kollisionserkennung
function checkCollision() {
  if (birdY < 0 || birdY + 20 > canvas.height) {
    return true;
  }

  for (let pipe of pipes) {
    if (
      60 < pipe.x + pipeWidth &&
      60 + 20 > pipe.x &&
      (birdY < pipe.top || birdY + 20 > pipe.top + pipeGap)
    ) {
      return true;
    }
  }
  return false;
}

// Spiel aktualisieren
function update() {
  if (!isGameStarted) {
    ctx.fillStyle = '#000';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);
    return;
  }

  if (isGameOver) {
    ctx.fillStyle = '#FF0000';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 30);
    return;
  }

  birdVelocity += gravity;
  birdY += birdVelocity;

  // Hindernisse bewegen
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;
  });

  // Neue Hindernisse erzeugen
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 150) {
    let topHeight = Math.random() * (canvas.height - pipeGap - 40) + 20;
    pipes.push({
      x: canvas.width,
      top: topHeight
    });
  }

  // Hindernisse entfernen, wenn sie außerhalb sind
  if (pipes[0].x < -pipeWidth) {
    pipes.shift();
    score++;
  }

  // Kollision prüfen
  if (checkCollision()) {
    isGameOver = true;
  }

  // Bildschirm löschen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  requestAnimationFrame(update);
}

// Steuerung
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (isGameOver) {
      // Spiel zurücksetzen
      birdY = 150;
      birdVelocity = 0;
      pipes = [];
      score = 0;
      isGameOver = false;
      isGameStarted = false;
    } else if (!isGameStarted) {
      isGameStarted = true;
      update();
    } else {
      birdVelocity = jump;
    }
  }
});

update();
