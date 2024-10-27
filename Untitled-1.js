// Cell, GameBoard, and GameController classes as you've provided...
let Cell = () => {
  let value = null
  const addToken = (player) => {
    value = player.marker
  }
  const getValue = () => value
  return {
    getValue,
    addToken,
  }
}

let GameBoard = () => {
  const row = 3
  const column = 3
  const board = []

  for (let i = 0; i < row; i++) {
    board[i] = []
    for (let j = 0; j < column; j++) {
      board[i].push(Cell())
    }
  }

  const addMarker = (row, column, player) => {
    board[row][column].addToken(player)
  }

  const getBoard = () => board

  const printBoard = () => {
    let boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    )
    console.log(boardWithCellValues)
  }

  return {
    addMarker,
    getBoard,
    printBoard,
  }
}

let GameController = (
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) => {
  const players = [
    { player: playerOneName, marker: "O" },
    { player: playerTwoName, marker: "X" },
  ]
  let board = GameBoard()
  let activePlayer = players[0]

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  const printNewRound = () => {
    board.printBoard()
    console.log(`${activePlayer.player}'s turn.`)
  }

  const checkWinner = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (let combo of winningCombos) {
      const [a, b, c] = combo
      if (
        board.getBoard()[Math.floor(a / 3)][a % 3].getValue() &&
        board.getBoard()[Math.floor(a / 3)][a % 3].getValue() ===
          board.getBoard()[Math.floor(b / 3)][b % 3].getValue() &&
        board.getBoard()[Math.floor(a / 3)][a % 3].getValue() ===
          board.getBoard()[Math.floor(c / 3)][c % 3].getValue()
      ) {
        return board.getBoard()[Math.floor(a / 3)][a % 3].getValue()
      }
    }

    if (
      board
        .getBoard()
        .flat()
        .every((cell) => cell.getValue() !== null)
    ) {
      return "tie"
    }

    return null
  }

  const playRound = (index) => {
    const row = Math.floor(index / 3)
    const col = index % 3

    if (board.getBoard()[row][col].getValue() === null) {
      board.addMarker(row, col, activePlayer)
      updateGameBoard()

      const winner = checkWinner()
      if (winner) {
        if (winner === "tie") {
          updateStatus("It's a tie!")
        } else {
          updateStatus(`${activePlayer.player} wins!`)
        }
        disableBoard()
      } else {
        switchPlayerTurn()
        updateStatus(`${activePlayer.player}'s turn.`)
      }
    }
  }

  const updateGameBoard = () => {
    const cells = document.querySelectorAll(".cell")
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      cell.textContent = board.getBoard()[row][col].getValue() || ""
    })
  }

  const updateStatus = (message) => {
    document.getElementById("status").textContent = message
  }

  const disableBoard = () => {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.removeEventListener("click", cellClickHandler)
    })
  }

  const restartGame = () => {
    board = GameBoard()
    activePlayer = players[0]
    updateGameBoard()
    updateStatus(`${activePlayer.player}'s turn.`)
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("click", cellClickHandler)
    })
  }

  const cellClickHandler = function () {
    const index = parseInt(this.getAttribute("data-index"))
    playRound(index)
  }

  // Initialize the game
  updateStatus(`${activePlayer.player}'s turn.`)
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("click", cellClickHandler)
  })

  document.getElementById("restartBtn").addEventListener("click", restartGame)

  return {
    playRound,
    getActivePlayer,
  }
}

const game = GameController()
