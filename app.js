const grid = document.querySelector(".grid");
const gameText = document.querySelector(".game-txt");
const restartBtn = document.getElementById("game-restart");
const flagsLeft = document.querySelector(".flags-left");
const timer = document.querySelector(".timer");

let width = 16;
let bombs = 40;
let flags = 0;
let squares = [];
let isGameOver = false;
let time = 0;
flagsLeft.innerHTML = bombs;

let gameTimer;

function startTiming() {
  time++;
  timer.innerHTML = time;
}

function start() {
  gameTimer = setInterval(startTiming, 1000);
}

function stop() {
  clearInterval(gameTimer);
}

/* const gameTimer = () => {
  setTimeout(() => {
    time++;
    timer.innerHTML = time;
    gameTimer();
  }, 1000);
};

function stopTimer() {
  clearTimeout(gameTimer);
} */

//lets create gaming board
const createBoard = () => {
  const bombSquares = Array(bombs).fill("boom");
  const emptySquares = Array(width * width - bombs).fill("number");
  const gameSquares = emptySquares.concat(bombSquares);

  const testingArray = gameSquares.map((square) => {
    let random = Math.floor(Math.random() * gameSquares.length);
    return { random: random, square: square };
  });

  const randomSquares = testingArray.sort((square1, square2) => {
    return square2.random - square1.random;
  });

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    /*in a line below we add class from the array above with its "word" and add it to the square. This is how we will change the look of the squares in the game. */
    square.classList.add(testingArray[i].square);

    grid.appendChild(square);
    squares.push(square);

    square.addEventListener("click", (e) => {
      showNumbers(square);
      if (square.classList.contains("boom")) {
        gameOver(square);
        didIwin(square);
      }
    });

    square.oncontextmenu = (e) => {
      e.preventDefault();
      setFlag(square);
      showCounter();
    };
  }

  // gamers board info
  const showCounter = () => {
    let flagCounter = bombs - flags;
    flagsLeft.innerHTML = flagCounter;
  };

  const setFlag = (square) => {
    if (!square.classList.contains("flag")) {
      square.classList.add("flag");
      flags++;
      console.log(flags);
    } else {
      square.classList.remove("flag");
      flags--;
      console.log(flags);
    }
  };

  // adding numbers to the square
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const leftSide = i % width === 0;
    const rightSide = i % width === width - 1;

    if (squares[i].classList.contains("number")) {
      if (i > 0 && !leftSide && squares[i - 1].classList.contains("boom"))
        total++;
      if (
        i > 15 &&
        !rightSide &&
        squares[i + 1 - width].classList.contains("boom")
      )
        total++;
      if (i > 16 && squares[i - width].classList.contains("boom")) total++;
      if (
        i > 17 &&
        !leftSide &&
        squares[i - 1 - width].classList.contains("boom")
      )
        total++;
      if (i < 255 && !rightSide && squares[i + 1].classList.contains("boom"))
        total++;
      if (
        i < 239 &&
        !leftSide &&
        squares[i - 1 + width].classList.contains("boom")
      )
        total++;
      if (
        i < 238 &&
        !rightSide &&
        squares[i + 1 + width].classList.contains("boom")
      )
        total++;
      if (
        i < 239 &&
        !rightSide &&
        squares[i + width].classList.contains("boom")
      )
        total++;

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
  const leftSide = id % width === 0;
  const rightSide = id % width === width - 1;
  setTimeout(() => {
    if (id > 0 && !leftSide) {
      let newId = squares[parseInt(id) - 1].id;
      let newSquare = document.getElementById(newId);
      showNumbers(newSquare);
    }

    if (id > 15 && !rightSide) {
      let newId = squares[parseInt(id) + 1 - width].id;
      let newSquare = document.getElementById(newId);
      showNumbers(newSquare);
    }

    if (id > 16) {
      let newId = squares[parseInt(id) - width].id;
      let newSquare = document.getElementById(newId);
      showNumbers(newSquare);
    }

    if (id > 17 && !leftSide) {
      let newId = squares[parseInt(id) - 1 - width].id;
      let newSquare = document.getElementById(newId);
      showNumbers(newSquare);
    }

    if (id < 255 && !rightSide) {
      let newId = squares[parseInt(id) + 1].id;
      let newSquare = document.getElementById(newId);
      showNumbers(newSquare);
    }

    if (id < 240 && !leftSide) {
      let newId = squares[parseInt(id) - 1 + width].id;
      let newSquare = document.getElementById(newId);
      showNumbers(newSquare);
    }
    if (id < 239) {
      let newId = squares[parseInt(id) + width].id;
      let newSquare = document.getElementById(newId);
      showNumbers(newSquare);
    }
    if (id < 238 && !rightSide) {
      let newId = squares[parseInt(id) + 1 + width].id;
      let newSquare = document.getElementById(newId);
      showNumbers(newSquare);
    }
  }, 50);
}

// GAME OVER
const gameOver = (square) => {
  if (square.classList.contains("boom")) {
    square.classList.add("show-boom");
    gameText.innerHTML = "GAME OVER";
    grid.style.pointerEvents = "none";
    isGameOver = true;
    /* clearTimeout(gameTimer); */
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
};

// restart game
const restartGame = () => {
  squares.forEach((square) => {
    square.classList.remove("show-boom");
    square.classList.remove("numbers");
    square.classList.remove("zero");
    square.classList.remove("flag");
    square.innerHTML = "";
    square.classList.remove("cross");
    gameText.innerHTML = "";
    grid.style.pointerEvents = "auto";
    isGameOver = false;
    flags = 0;
    flagsLeft.innerHTML = bombs;
    grid.innerHTML = "";
    timer.innerHTML = 0;
    time = 0;
  });
  createBoard();
};

restartBtn.addEventListener("click", restartGame);

const didIwin = (square) => {
  if (
    flags === bombs &&
    !isGameOver &&
    square.classList.contains("boom") &&
    square.classList.contains("flag")
  ) {
    gameText.innerHTML = "YOU WON THE GAME";
  }
};

grid.addEventListener("click", (e) => {
  e.preventDefault();
  if (time === 0) {
    start();
  }
});
