const activateGame = (e) => {
  document.getElementById("game-container").style.display = "flex";
  document.getElementById("game-chooser").style.display = "none";
  gameMode = Number(e.id.charAt(e.id.length - 1));
};

var turn = 1;
var boardState = [];
const emptyChar = "-";
for (let i = 0; i < 9; i++) {
  boardState.push(emptyChar);
}

const renderBoard = () => {
  document.querySelectorAll(".ttt-btn").forEach((e) => {
    number = Number(e.id.charAt(e.id.length - 1));
    e.textContent = boardState[number - 1];
    if(boardState[number-1]!=emptyChar){
      e.style.backgroundColor='var(--text-primary)';
    }
  });
};

const btnClick = (e) => {
  number = Number(e.id.charAt(e.id.length - 1));

  if (gameMode == 1) {
    if (boardState[number - 1] == emptyChar) {
      boardState[number - 1] = turn == 1 ? "x" : "o";
      turn = turn == 1 ? 2 : 1;
    } else
      document.getElementById("error").innerHTML = "Invalid Turn, try Again";
  } else if (gameMode == 2) {
    if (boardState[number - 1] == emptyChar) {
      boardState[number - 1] = "x";
      player2Turn();
    }
  } else {
    if (boardState[number - 1] == emptyChar) {
      boardState[number - 1] = "x";
      aiTurn();
    }
  }

  update();
};

function gameStart() {
  document.getElementById("game-result").innerHTML = "Game On!";
  update();
}

const displayTurn = () => {
  if (turn == 1) {
    document.getElementById("playerTurn").innerHTML = "Player1 Turn";
  } else {
    document.getElementById("playerTurn").innerHTML = "Player2 Turn";
  }
};

// WINCHECK
const winCheck = () => {
  var winList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (w of winList) {
    if (
      boardState[w[0]] == boardState[w[1]] &&
      boardState[w[1]] == boardState[w[2]] &&
      boardState[w[0]] != emptyChar
    ) {
      winningSym = boardState[w[0]];
      document.getElementById("game-result").innerHTML = `Player ${
        boardState[w[0]] == "x" ? 1 : 2
      } wins`;
      document.getElementById("playerTurn").innerHTML = "Game Over";
      for (let i = 0; i < 9; i++) {
        boardState[i] = emptyChar;
      }
      boardState[w[0]] = boardState[w[1]] = boardState[w[2]] = winningSym;
      renderBoard();
      return boardState[w[0]] == "x" ? 1 : 2;
    }
  }
};

const winCheckAi = () => {
  var winList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (w of winList) {
    if (
      boardState[w[0]] == boardState[w[1]] &&
      boardState[w[1]] == boardState[w[2]] &&
      boardState[w[0]] != emptyChar
    ) {
      return boardState[w[0]] == "x" ? 1 : 2;
    }
  }
};

//DRAWCHECK
const drawCheck = () => {
  count = 0;
  for (i of boardState) {
    if (i != emptyChar) {
      count += 1;
    }
  }
  if (count == 9) {
    document.getElementById("playerTurn").innerHTML = "Game Over ";
    document.getElementById("game-result").innerHTML = "It's a Draw!";
  }
};

const update = () => {
  displayTurn();
  renderBoard();
  winCheck();
  drawCheck();
};

window.addEventListener("click", (event) => {
  if (event.target != document.getElementById("grid-box")) {
    document.getElementById("error").innerHTML = "";
  }
});

// AGAINST A DUMB COMPUTER TURN
const player2Turn = () => {
  let chosen = Math.floor(Math.random() * 9);
  if (boardState[chosen] == emptyChar) {
    boardState[chosen] = "o";
  } else {
    player2Turn();
  }
};
var bestScore = -1;
var bestMove = 0;

//AGAINST A AI TURN
const aiTurn = () => {
  for (let i = 0; i < 9; i++) {
    if (boardState[i] == emptyChar) {
      boardState[i] = "o";
      var score = minimax(false);
      boardState[i] = emptyChar;
      if (score > bestScore) {
        score = bestScore;
        bestMove = i;
      }
    }
  }
  boardState[bestMove] = "o";
};

const minimax = (isMaximising) => {
  if (winCheckAi() == 1) {
    return -1;
  } else if (winCheckAi() == 2) {
    return 1;
  } else if (!emptyChar in boardState) {
    return 0;
  }

  if (isMaximising) {
    var bestScore = -1;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] == emptyChar) {
        boardState[i] = "o";
        var score = minimax(false);
        boardState[i] = emptyChar;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
          return bestScore;
        }
      }
    }
    console.log(bestMove);
    return bestMove;
  } else {
    var bestScore = 1;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] == emptyChar) {
        boardState[i] = "x";
        var score = minimax(true);
        boardState[i] = emptyChar;
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
          return bestScore;
        }
      }
    }
    return bestMove;
  }
};

(function () {
    let buttons = document.querySelectorAll(".btn-hover");

    buttons.forEach((button) => {
      ["mouseenter", "mouseout"].forEach((evt) => {
        button.addEventListener(evt, (e) => {
          let parentOffset = button.getBoundingClientRect(),
            relX = e.pageX - parentOffset.left,
            relY = e.pageY - parentOffset.top;
  
          const span = button.getElementsByTagName("span");
  
          span[0].style.top = relY + "px";
          span[0].style.left = relX + "px";
        });
      });
    });
})();
