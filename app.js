const grid = document.querySelector(".grid");
const gameText = document.querySelector(".game-txt");

let width = 16;
let bombs = 20;
let squares = [];

//lets create gaming board
const createBoard = () => {
  const bombSquares = Array(bombs).fill("boom");
  const emptySquares = Array(width * width - bombs).fill("number");
  const gameSquares = emptySquares.concat(bombSquares);
  const randomSquares = gameSquares.sort(() => 0.5 - Math.random());

  /*   
  SHUFFLE ARRAY AND RETURN IT BACK

  var original = ["a", "b", "c", "d", "e", "f", "g"];
  var copy = [].concat(original);
  copy.sort(function () {
    return 0.5 - Math.random();
  });
  console.log(copy); */

  /*  console.log(randomSquares); */

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    /*in a line below we add class from the array above with its "word" and add it to the square. This is how we will change the look of the squares in the game. */
    square.classList.add(randomSquares[i]);

    grid.appendChild(square);
    squares.push(square);

    square.addEventListener("click", (e) => {
      showNumbers(square);
    });
  }

  // adding numbers to the square
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const leftSide = i % width === 0;
    const rightSide = i === width - 1;

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
  square.innerText = numbers;
  if (square.classList.contains("boom")) {
    gameText.style.border = "dotted 4px red";
    gameText.innerHTML = "GAME OVER";
  } else if (numbers == 0) {
    square.classList.add("zero");
    checkSquare(square, id);
  } else {
    square.classList.add("numbers");
  }
};

function checkSquare(square, id) {
  console.log("does this work");
  console.log(square, square.id);

  const leftSide = id % width === 0;
  const rightSide = id === width - 1;
  /*  if (id > 0 && !leftSide) checkSquare(square, id + 1);
  if (id > 15 && !rightSide) checkSquare(square, id + 1); */
}
