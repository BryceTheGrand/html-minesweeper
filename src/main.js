let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let gameSize = 20;
let nBombs = Math.floor(0.15 * gameSize * gameSize);
let gameBoard = new Board(gameSize, nBombs);
let canvasDOM = canvas.getBoundingClientRect();
let restartButton = document.getElementById("restart");
restartButton.addEventListener("click", () => {
  gameBoard.restart();
});

let numberBombsSlider = document.getElementById("number-bombs");
numberBombsSlider.addEventListener("change", () => {
  nBombs = Math.floor((numberBombsSlider.value / 100) * gameSize * gameSize);
  gameBoard = new Board(gameSize, nBombs);
});

let boardSizeSlider = document.getElementById("board-size");
boardSizeSlider.addEventListener("change", () => {
  gameSize = boardSizeSlider.value;
  nBombs = Math.floor((numberBombsSlider.value / 100) * gameSize * gameSize);
  gameBoard = new Board(gameSize, nBombs);
});

canvas.addEventListener("click", (evt) => {
  let pos = getPos(evt);
  gameBoard.makeMove(pos.y, pos.x);
});

canvas.addEventListener("contextmenu", (evt) => {
  evt.preventDefault();
  let pos = getPos(evt);
  gameBoard.flag(pos.y, pos.x);
});

window.addEventListener("resize", () => {
  canvasDOM = canvas.getBoundingClientRect();
});

function getPos(evt) {
  return {
    x: Math.floor((gameSize * (evt.clientX - canvasDOM.x)) / canvasDOM.width),
    y: Math.floor((gameSize * (evt.clientY - canvasDOM.y)) / canvasDOM.height),
  };
}

function setup() {
  window.requestAnimationFrame(loop);
}

function background(r, g, b) {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
  ctx.fill();
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
  ctx.stroke();
}

function loop() {
  background(60, 55, 55);

  ctx.strokeStyle = "rgba(250, 245, 240, 0.6)";
  ctx.lineWidth = 2;
  gameBoard.show(ctx, 0, 0, canvas.width, canvas.height);
  roundedRect(1, 1, canvas.width - 2, canvas.height - 2, canvas.width * 0.02);

  window.requestAnimationFrame(loop);
}

setup();
