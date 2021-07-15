class Board {
  // bomb: 1
  // empty: 0
  // clear: 2
  // flag: 3
  // flag and bomb: 4
  constructor(size, nBombs) {
    this.size = size;
    this.board = [];
    this.nBombs = nBombs;
    this.threatMap = [];
    for (let i = 0; i < size; i++) {
      this.board.push([]);
      this.threatMap.push([]);
      for (let j = 0; j < size; j++) {
        this.board[i].push(0);
        this.threatMap[i].push(0);
      }
    }
    this.started = false;
    this.lost = false;
    this.won = false;
  }

  restart() {
    this.clearBoard();
    this.started = false;
    this.lost = false;
    this.won = false;
  }

  calcThreatMap() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] == 1) {
          this.threatMap[i][j] = -1;
          continue;
        }
        let sum = 0;
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            try {
              let newNumber = this.board[i + y][j + x];
              if (newNumber == 1) sum += 1;
            } catch (e) {
              continue;
            }
          }
        }
        this.threatMap[i][j] = sum;
      }
    }
  }

  clearNeighbors(row, col) {
    let checkNext = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (
          (i == 0 && j == 0) ||
          i + row < 0 ||
          i + row >= this.size ||
          j + col < 0 ||
          j + col >= this.size
        )
          continue;
        if (
          this.threatMap[row + i][col + j] == 0 &&
          this.board[row + i][col + j] == 0
        ) {
          checkNext.push({ row: row + i, col: col + j });
        }
        if (this.board[row + i][col + j] == 0) {
          this.board[row + i][col + j] = 2;
        }
      }
    }
    for (let c of checkNext) {
      this.clearNeighbors(c.row, c.col);
    }
  }

  generateBoard() {
    this.clearBoard();
    this.addBombs(this.nBombs);
    this.calcThreatMap();
  }

  checkBoard() {
    let gameover = true;
    for (let i = 0; i < this.size; i++) {
      if (!gameover) break;
      for (let j = 0; j < this.size; j++) {
        if (
          this.board[i][j] == 0 ||
          this.board[i][j] == 1 ||
          this.board[i][j] == 3
        ) {
          gameover = false;
          break;
        }
      }
    }
    if (gameover) {
      this.won = true;
    }
  }

  makeMove(row, col) {
    if (!this.started) {
      do {
        this.generateBoard();
        if (this.threatMap[row][col] == 0) {
          this.started = true;
        }
      } while (!this.started);
    }
    if (!this.lost && !this.won) {
      if (this.board[row][col] == 0) {
        this.board[row][col] = 2;
        if (this.threatMap[row][col] == 0) {
          this.clearNeighbors(row, col);
        }
      } else if (this.board[row][col] == 1) {
        this.lost = true;
      }
      this.checkBoard();
    }
  }

  flag(row, col) {
    if (!this.won)
      switch (this.board[row][col]) {
        case 0:
          this.board[row][col] = 3;
          break;
        case 1:
          this.board[row][col] = 4;
          break;
        case 3:
          this.board[row][col] = 0;
          break;
        case 4:
          this.board[row][col] = 1;
          break;
      }
    this.checkBoard();
  }

  show(ctx, x, y, w, h) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        switch (this.board[i][j]) {
          case 0:
            ctx.fillStyle = "rgb(25, 20, 20)";
            break;
          case 1:
            ctx.fillStyle = "rgb(25, 20, 20)";
            if (this.lost) {
              ctx.fillStyle = "rgb(180, 30, 50)";
            }
            break;
          case 2:
            ctx.font = 0.9 * (w / this.size) + "px Courier New";
            ctx.fillStyle = "rgb(245, 230, 220)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
              this.threatMap[i][j] != 0 ? this.threatMap[i][j] : "",
              ((j + 0.5) * w) / this.size,
              ((i + 0.56) * h) / this.size
            );
            ctx.fillStyle = "rgba(205, 200, 195, 0)";
            break;
          case 3:
            ctx.fillStyle = "rgb(80, 120, 100)";
            break;
          case 4:
            if (this.lost) ctx.fillStyle = "rgb(120, 30, 80)";
            else ctx.fillStyle = "rgb(80, 120, 100)";
            break;
          default:
            ctx.fillStyle = "rgb(0, 255, 255)";
            break;
        }

        ctx.beginPath();
        ctx.rect(
          x + (j * w) / this.size,
          y + (i * h) / this.size,
          w / this.size,
          h / this.size
        );
        ctx.fill();
      }
    }

    ctx.strokeStyle = "rgb(40, 35, 35)";
    for (let i = 1; i < this.size; i++) {
      ctx.beginPath();
      ctx.moveTo(x + (i * w) / this.size, y);
      ctx.lineTo(x + (i * w) / this.size, y + h);
      ctx.stroke();
    }
    for (let j = 1; j < this.size; j++) {
      ctx.beginPath();
      ctx.moveTo(x, y + (j * h) / this.size);
      ctx.lineTo(x + w, y + (j * h) / this.size);
      ctx.stroke();
    }
    if (this.won) {
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.font = 0.2 * w + "px Courier New";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("You win!", w / 2, h / 2);
      let temp = {
        strokeStyle: ctx.strokeStyle,
        lineWidth: ctx.lineWidth,
      };
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgb(25, 20, 20)";
      ctx.strokeText("You win!", w / 2, h / 2);
      ctx.lineWidth = temp.lineWidth;
      ctx.strokeStyle = temp.strokeStyle;
    }
  }

  clearBoard() {
    this.board = [];
    for (let i = 0; i < this.size; i++) {
      this.board.push([]);
      for (let j = 0; j < this.size; j++) {
        this.board[i].push(0);
      }
    }
  }

  addBombs(nBombs) {
    for (let i = 0; i < nBombs; i++) {
      let found = false;
      do {
        let pos = {
          row: Math.floor(Math.random() * this.size),
          col: Math.floor(Math.random() * this.size),
        };
        if (this.board[pos.row][pos.col] == 0) {
          found = true;
          this.board[pos.row][pos.col] = 1;
        }
      } while (!found);
    }
    this.calcThreatMap();
  }
}
