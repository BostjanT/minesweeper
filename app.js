/* const grid = document.querySelector(".grid"); */
const board = document.querySelector(".board");
const gameText = document.querySelector(".game-txt");
const restartBtn = document.getElementById("game-restart");
const flagsLeft = document.querySelector(".flags-left");
const timer = document.querySelector(".timer");
const body = document.querySelector("body");

const grid = document.createElement("div");

let width = 16;
let bombs = 10;
let flags = 0;
let squares = [];
let isGameOver = false;
let time = 0;
let bombCounter = 0;
let flaggedArray = [];
let openedArray = [];
flagsLeft.innerHTML = bombs;

let gameTimer;
let isGameStarted = false;

function startTiming() {
  time++;
  timer.innerHTML = time;
}

function start() {
  if (!isGameStarted) {
    gameTimer = setInterval(startTiming, 1000);
  }
}

function stop() {
  clearInterval(gameTimer);
}

//lets create gaming board
const createBoard = () => {
  const bombSquares = Array(bombs).fill("boom");
  const emptySquares = Array(width * width - bombs).fill("number");
  const gameSquares = emptySquares.concat(bombSquares);

  //testingArray
  squares = gameSquares
    .map((square) => {
      let random = Math.floor(Math.random() * gameSquares.length);
      return { random: random, square: square };
    })
    .sort((square1, square2) => {
      return square2.random - square1.random;
    })
    .map((squareGeneratorInfo, i) => {
      const square = document.createElement("div");
      square.id = i;
      /* square.classList.add(gameSquares[i]); */
      grid.appendChild(square);

      const squareInfoObj = {
        htmlElement: square,
        bomb: squareGeneratorInfo.square === "boom",
        wasChecked: false,
        surroundingBombs: null,
      };

      const listen2square = () => {
        showNumbers(squareInfoObj);
        openedSquares(squareInfoObj);
        if (squareInfoObj.bomb) {
          gameOver(squareInfoObj);
        }
      };

      square.addEventListener("click", listen2square);

      square.oncontextmenu = (e) => {
        e.preventDefault();
        setFlag(squareInfoObj);
        showCounter();
        flaggedSquares(squareInfoObj);
        didIwin();
      };

      return squareInfoObj;
    });

  console.log(squares);

  grid.classList.add("grid");
  board.appendChild(grid);

  // gamers board info
  function showCounter() {
    let flagCounter = bombs - flags;
    flagsLeft.innerHTML = flagCounter;
  }

  function setFlag(squareInfoObj) {
    let square = squareInfoObj.htmlElement;
    if (!squareInfoObj.wasChecked) {
      square.classList.add("flag");
      flags++;
    } else {
      square.classList.remove("flag");
      flags--;
    }
    console.log(square);
    console.log(squareInfoObj.wasChecked);
  }

  // adding numbers to the square
  for (let i = 0; i < squares.length; i++) {
    let fullWidth = width * width;
    let total = 0;
    const leftSide = i % width === 0;
    const rightSide = i % width === width - 1;
    const topRow = i < width;
    const bottomRow = i >= fullWidth - width;

    if (!squares[i].bomb) {
      //check left square
      if (!leftSide && squares[i - 1].bomb) {
        total++;
      }
      //check top right square
      if (!topRow && !rightSide && squares[i + 1 - width].bomb) {
        total++;
      }
      //check top square
      if (!topRow && squares[i - width].bomb) {
        total++;
      }
      //check top left square
      if (!topRow && !leftSide && squares[i - 1 - width].bomb) {
        total++;
      }
      //check right square
      if (!rightSide && squares[i + 1].bomb) {
        total++;
      }
      //check bottom left square
      if (!bottomRow && !leftSide && squares[i - 1 + width].bomb) {
        total++;
      }
      // check bottom right square
      if (!bottomRow && !rightSide && squares[i + 1 + width].bomb) {
        total++;
      }
      //check bottom square
      if (!bottomRow && squares[i + width].bomb) {
        total++;
      }

      squares[i].surroundingBombs = total;
    }
  }
};

createBoard();

const showNumbers = (squareInfoObj) => {
  let numbers = squareInfoObj.surroundingBombs;
  let id = squareInfoObj.htmlElement.id;
  let square = squareInfoObj.htmlElement;

  console.log(numbers);
  console.log(square);
  if (square.classList.contains("numbers") || square.classList.contains("zero"))
    return;

  if (square.classList.contains("boom")) return;
  else {
    if (numbers != null) {
      square.classList.add("numbers");

      if (numbers == 1) square.classList.add("one");
      if (numbers == 2) square.classList.add("two");
      if (numbers == 3) square.classList.add("three");
      if (numbers == 4) square.classList.add("four");
      if (numbers == 5) square.classList.add("five");

      square.innerText = numbers;
      return;
    } else {
      square.classList.add("zero");
    }
    checkSquare(squareInfoObj, id);
  }
};

function checkSquare(squareInfoObj, id) {
  id = squareInfoObj.htmlElement.id;
  let fullWidth = width * width;
  const leftSide = id % width === 0;
  const rightSide = id % width === width - 1;
  const topRow = id < width;
  const bottomRow = id >= fullWidth - width;

  if (id > 0 && !leftSide) {
    let newId = squares[parseInt(id) - 1].id;
    let newSquare = document.getElementById(newId);
    showNumbers(newSquare);
  }

  if (!topRow && !rightSide) {
    let newId = squares[parseInt(id) + 1 - width].id;
    let newSquare = document.getElementById(newId);
    showNumbers(newSquare);
  }

  if (!topRow) {
    let newId = squares[parseInt(id) - width].id;
    let newSquare = document.getElementById(newId);
    showNumbers(newSquare);
  }

  if (!topRow && !leftSide) {
    let newId = squares[parseInt(id) - 1 - width].id;
    let newSquare = document.getElementById(newId);
    showNumbers(newSquare);
  }

  if (id < fullWidth - 1 && !rightSide) {
    let newId = squares[parseInt(id) + 1].id;
    let newSquare = document.getElementById(newId);
    showNumbers(newSquare);
  }

  if (!bottomRow && !leftSide) {
    let newId = squares[parseInt(id) - 1 + width].id;
    let newSquare = document.getElementById(newId);
    showNumbers(newSquare);
  }

  if (!bottomRow) {
    let newId = squares[parseInt(id) + width].id;
    let newSquare = document.getElementById(newId);
    showNumbers(newSquare);
  }

  if (!bottomRow && !rightSide) {
    let newId = squares[parseInt(id) + 1 + width].id;
    let newSquare = document.getElementById(newId);
    showNumbers(newSquare);
  }
}

function openedSquares(squareInfoObj) {
  let square = squareInfoObj.htmlElement;
  if (
    square.classList.contains("number") ||
    square.classList.contains("zero")
  ) {
    openedArray.push(square);
  }
}

function flaggedSquares(squareInfoObj) {
  let square = squareInfoObj.htmlElement;
  if (square.classList.contains("boom") && square.classList.contains("flag")) {
    bombCounter++;
    flaggedArray.push(square);
    console.log(flaggedArray.length);
  }
}

// GAME OVER
function gameOver(squareInfoObj) {
  let square = squareInfoObj.htmlElement;
  if (squareInfoObj.bomb) {
    square.classList.add("show-boom");
    body.classList.add("over");
    body.classList.add("gradient");
    grid.style.pointerEvents = "none";
    isGameOver = true;
    isGameStarted = false;
    stop();
  }

  squares.forEach((square) => {
    if (isGameOver && square.classList.contains("boom")) {
      setTimeout(() => {
        square.classList.add("show-boom");
        square.classList.remove("flag");
      }, 300);
    }
    if (
      square.classList.contains("boom") &&
      square.classList.contains("flag")
    ) {
      square.classList.add("cross");
    }
  });
}

// restart game
function restartGame() {
  squares.forEach((square) => {
    square.htmlElement.classList.remove("show-boom");
    square.htmlElement.classList.remove("numbers");
    square.htmlElement.classList.remove("zero");
    square.htmlElement.classList.remove("flag");
    square.htmlElement.innerHTML = "";
    square.htmlElement.classList.remove("cross");
  });
  body.classList.remove("over");
  body.classList.remove("gradient");
  body.classList.remove("win");
  body.classList.remove("gameWin");
  grid.style.pointerEvents = "auto";
  isGameOver = false;
  isGameStarted = false;
  flags = 0;
  flagsLeft.innerHTML = bombs;
  grid.innerHTML = "";
  timer.innerHTML = 0;
  time = 0;
  flaggedArray = [];
  stop();
  createBoard();
}

restartBtn.addEventListener("click", restartGame);

function didIwin() {
  if ((flags == bombs || flaggedArray.length == bombs) && !isGameOver) {
    body.classList.add("win");
    body.classList.add("gameWin");
    console.log(flaggedArray.length);
    stop();
  }
}

const preventDoubleClick = (e) => {
  e.preventDefault();
  if (time === 0 && (!e.detail || e.detail == 1)) {
    start();
  }
};

grid.addEventListener("click", preventDoubleClick);
