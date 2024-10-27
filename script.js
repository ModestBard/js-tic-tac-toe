const GameBoard = (() => {
  const board = Array(9).fill(null)
  const getBoard = () => board
  const makeMove = (index, mark) =>
    board[index] === null ? ((board[index] = mark), true) : false
  const reset = () => board.fill(null)

  return { getBoard, makeMove, reset }
})()

const Player = (name, mark) => ({ name, mark })

const DisplayController = (() => {
  const boardDiv = document.getElementById("board")
  const messageDiv = document.getElementById("message")
  const resetButton = document.getElementById("reset")
  const player1Input = document.getElementById("player1")
  const player2Input = document.getElementById("player2")
  const startBtn = document.getElementById("start")
  const gameDiv = document.getElementById("game")
  const setupDiv = document.getElementById("setup")

  const renderBoard = () => {
    boardDiv.innerHTML = ""
    const board = GameBoard.getBoard()

    board.forEach((mark, index) => {
      const cell = document.createElement("button")
      cell.classList.add("cell")
      cell.textContent = mark
      cell.addEventListener("click", () => Game.handleMove(index))
      boardDiv.appendChild(cell)
    })
  }

  const message = (msg) => {
    messageDiv.textContent = msg
  }

  const bindRestartButton = () => {
    resetButton.addEventListener("click", Game.restart)
  }

  const bindStartButton = () => {
    startBtn.addEventListener("click", () => {
      const player1Name = player1Input.value || "Player 1"
      const player2Name = player2Input.value || "Player 2"
      Game.start(player1Name, player2Name)
      setupDiv.style.display = "none"
      gameDiv.style.display = "block"
    })
  }

  return { renderBoard, message, bindRestartButton, bindStartButton }
})()

const Game = (() => {
  let gameStatus = false
  let player1
  let player2
  let currentPlayer

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]

  const start = (player1Name, player2Name) => {
    player1 = Player(player1Name, "X")
    player2 = Player(player2Name, "O")
    currentPlayer = player1
    gameStatus = true
    GameBoard.reset()
    DisplayController.renderBoard()
    DisplayController.message(
      `${currentPlayer.name}'s turn (${currentPlayer.mark})`
    )
  }

  const checkWin = () => {
    const board = GameBoard.getBoard()
    return winConditions.some((combo) => {
      return combo.every((index) => {
        return board[index] === currentPlayer.mark
      })
    })
  }

  const checkTie = () => {
    return GameBoard.getBoard().every((cell) => cell !== null)
  }

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1
    DisplayController.message(
      `${currentPlayer.name}'s turn (${currentPlayer.mark})`
    )
  }

  const handleMove = (index) => {
    if (!gameStatus) return
    if (GameBoard.makeMove(index, currentPlayer.mark)) {
      DisplayController.renderBoard()
      if (checkWin()) {
        gameStatus = false
        DisplayController.message(`${currentPlayer.name} wins!`)
        return
      }
      if (checkTie()) {
        gameStatus = false
        DisplayController.message("It's a tie!")
        return
      }
      switchPlayer()
    }
  }

  const restart = () => {
    start(player1.name, player2.name)
  }

  return {
    start,
    handleMove,
    restart,
  }
})()

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
  DisplayController.bindRestartButton()
  DisplayController.bindStartButton()
})
