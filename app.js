const grid = document.querySelector(".grid");
const gameText = document.querySelector(".game-txt");
const restartBtn = document.getElementById("game-restart");
const flagsLeft = document.querySelector(".flags-left");
const timer = document.querySelector(".timer");
const body = document.querySelector("body");

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

  const testingArray = gameSquares
    .map((square) => {
      let random = Math.floor(Math.random() * gameSquares.length);
      return { random: random, square: square };
    })
    .sort((square1, square2) => {
      return square2.random - square1.random;
    });

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    /*in a line below we add class from the array above with its "word" and add it to the square. This is how we will change the look of the squares in the game. */
    square.classList.add(testingArray[i].square);

    grid.appendChild(square);
    squares.push(square);

    const listen2square = () => {
      showNumbers(square);
      openedSquares(square);
      if (square.classList.contains("boom")) {
        gameOver(square);
        didIwin();
      }
    };
    square.addEventListener("click", listen2square);

    square.oncontextmenu = (e) => {
      e.preventDefault();
      setFlag(square);
      showCounter();
      flaggedSquares(square);
    };
  }

  // gamers board info
  function showCounter() {
    let flagCounter = bombs - flags;
    flagsLeft.innerHTML = flagCounter;
  }

  function setFlag(square) {
    if (!square.classList.contains("flag")) {
      square.classList.add("flag");
      flags++;
    } else {
      square.classList.remove("flag");
      flags--;
    }
  }

  // adding numbers to the square
  for (let i = 0; i < squares.length; i++) {
    let fullWidth = width * width;
    let total = 0;
    const leftSide = i % width === 0;
    const rightSide = i % width === width - 1;
    const topRow = i < width;
    const bottomRow = i >= fullWidth - width;

    if (squares[i].classList.contains("number")) {
      //check left square
      if (!leftSide && squares[i - 1].classList.contains("boom")) {
        total++;
      }
      //check top right square
      if (
        !topRow &&
        !rightSide &&
        squares[i + 1 - width].classList.contains("boom")
      ) {
        total++;
      }
      //check top square
      if (!topRow && squares[i - width].classList.contains("boom")) {
        total++;
      }
      //check top left square
      if (
        !topRow &&
        !leftSide &&
        squares[i - 1 - width].classList.contains("boom")
      ) {
        total++;
      }
      //check right square
      if (!rightSide && squares[i + 1].classList.contains("boom")) {
        total++;
      }
      //check bottom left square
      if (
        !bottomRow &&
        !leftSide &&
        squares[i - 1 + width].classList.contains("boom")
      ) {
        total++;
      }
      // check bottom right square
      if (
        !bottomRow &&
        !rightSide &&
        squares[i + 1 + width].classList.contains("boom")
      ) {
        total++;
      }
      //check bottom square
      if (!bottomRow && squares[i + width].classList.contains("boom")) {
        total++;
      }

      squares[i].setAttribute("data", total);
    }
  }
};

createBoard();

const showNumbers = (square) => {
  let numbers = square.getAttribute("data");
  let id = square.id;

  if (square.classList.contains("numbers") || square.classList.contains("zero"))
    return;

  if (square.classList.contains("boom")) return;
  else {
    if (numbers != 0) {
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
    checkSquare(square, id);
  }
};

function checkSquare(square, id) {
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

function openedSquares(square) {
  if (
    square.classList.contains("number") ||
    square.classList.contains("zero")
  ) {
    openedArray.push(square);
  }
}

function flaggedSquares(square) {
  if (square.classList.contains("boom") && square.classList.contains("flag")) {
    bombCounter++;
    flaggedArray.push(square);
    console.log(flaggedArray.length);
  }
}

// GAME OVER
function gameOver(square) {
  if (square.classList.contains("boom")) {
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
    square.classList.remove("show-boom");
    square.classList.remove("numbers");
    square.classList.remove("zero");
    square.classList.remove("flag");
    square.innerHTML = "";
    square.classList.remove("cross");
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
    flaggedArray.length = 0;
  });
  stop();
  createBoard();
}

restartBtn.addEventListener("click", restartGame);

function didIwin() {
  if ((flags == bombs || flaggedArray.length == bombs) && !isGameOver) {
    body.classList.add("win");
    body.classList.add("gameWin");
    console.log(flaggedArray.length);
  }
}

const preventDoubleClick = (e) => {
  e.preventDefault();
  if (time === 0 && (!e.detail || e.detail == 1)) {
    start();
  }
};

grid.addEventListener("click", preventDoubleClick);
