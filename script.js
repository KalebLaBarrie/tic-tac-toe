const displayController = (() => {
  const renderMessage = (message) => {
    document.querySelector('#message').innerHTML = message;
  };

  return {
    renderMessage,
  };
})();

const Gameboard = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', ''];

  const render = () => {
    let boardHTML = '';
    gameboard.forEach((square, index) => {
      boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
    });

    document.querySelector('#gameboard').innerHTML = boardHTML;
    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
      square.addEventListener('click', Game.handleClick);
    });
  };

  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => gameboard;

  return { render, update, getGameboard };
})();

const Player = (name, mark) => {
  return {
    name,
    mark,
  };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;
  let isPlayingComputer;

  const startComputer = () => {
    isPlayingComputer = true;
    start();
  };

  const start = () => {
    if (isPlayingComputer) {
      players = [
        Player(document.querySelector('#player1').value, 'X'),
        Player('Jarvis', 'O'),
      ];
    } else {
      players = [
        Player(document.querySelector('#player1').value, 'X'),
        Player(document.querySelector('#player2').value, 'O'),
      ];
    }

    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render();
    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
      square.addEventListener('click', handleClick);
    });
  };

  const computerMove = () => {
    let availableSpots;
    let foundSpot = false;
    // console.log(value);
    while (foundSpot === false) {
      availableSpots = Math.floor(Math.random() * 9);
      value = document.querySelector(`#square-${availableSpots}`).innerHTML;

      if (value !== '') {
        foundSpot = false;
      } else {
        foundSpot = true;
        document.querySelector(`#square-${availableSpots}`).click();
        // return;
      }
    }
  };

  const handleClick = (event) => {
    if (gameOver) {
      return;
    }

    let index = parseInt(event.target.id.split('-')[1]);

    if (Gameboard.getGameboard()[index] !== '') {
      return;
    }

    Gameboard.update(index, players[currentPlayerIndex].mark);

    if (
      checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      displayController.renderMessage(
        `${players[currentPlayerIndex].name} wins`
      );
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage("It's a tie!");
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

    if (isPlayingComputer && currentPlayerIndex === 1 && gameOver === false) {
      setTimeout(() => {
        computerMove();
      }, 500);
    }
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, '');
    }

    Gameboard.render();
    gameOver = false;
    displayController.renderMessage('');
  };

  return { start, handleClick, restart, computerMove, startComputer };
})();

function checkForWin(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }

  return false;
}

function checkForTie(board) {
  return board.every((cell) => cell !== '');
}

const computerButton = document.querySelector('#computer-button');

computerButton.addEventListener('click', () => {
  document.querySelector('#player2').style.display = 'none';
  Game.startComputer();
});

const restartButton = document.querySelector('#restart-button');
restartButton.addEventListener('click', () => {
  Game.restart();
});

const startButton = document.querySelector('#start-button');

// Event Listeners
startButton.addEventListener('click', () => {
  Game.start();
});
