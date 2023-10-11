"use strict";

// Returns the Winner mark (if there is one) in the form of "X", "O"
// An ongoing game = 1
// A draw = 0
function checkLine(board, start, increments) {
  const firstMark = board[start.row][start.col]; // Starting point of the line
  let isWinning = true; // A flag to check if the line is winning or not

  // Loop as the board length, but not nessessarily following the array order
  for (let i = 0; i < board.length; i++) {
    const row = start.row + increments.row * i;
    const col = start.col + increments.col * i;
    const currentMark = board[row][col];

    if (currentMark === null) {
      return 1; // If there is a null mark, then the game is not finished yet but there is maybe a winner anyway
    }

    if (currentMark !== firstMark) {
      isWinning = false;
      break;
    }
  }

  // At the end of the loop, if isWinning is still true, then we have a winner or otherwise it's a draw
  return isWinning ? firstMark : 0;
}

// Return the result as a human readable string
function returnResult(result) {
  switch (result) {
    case "draw":
      return `It's a draw`;
    case "notFinished":
      return "The game is not finish yet";
    default:
      return `Winner is ${result}`;
  }
}

// A function that takes a Tic Tac Toe board as a multi-dimensional array and returns the result.
// The board must be filled following:
//    players are "X" and "O"
//    empty cells are represented by null
function getWinner(board) {
  // Check all lines in every direction
  const perpendicular = new Array();
  const diagonal = [
    checkLine(board, { row: 0, col: 0 }, { row: 1, col: 1 }), // Check backslash lines
    checkLine(board, { row: 0, col: 2 }, { row: 1, col: -1 }), // Check slash lines
  ];

  for (let i = 0; i < board.length; i++) {
    perpendicular.push(
      checkLine(board, { row: i, col: 0 }, { row: 0, col: 1 }), // Check horizontal lines
      checkLine(board, { row: 0, col: i }, { row: 1, col: 0 }) // Check vertical lines
    );
  }

  // Merge the two arrays,
  // remove duplicates,
  // and sort them to facilitate the next steps, in the following order:
  // "X", "O", null, "Draw"
  const allLinesResults = [...diagonal, ...perpendicular];
  const result = [...new Set(allLinesResults)].sort().reverse();

  // Analyze the result and return the appropriate message
  // ----------------------------

  // Early return when Draw or not finished
  if (typeof result[0] !== "string") {
    return returnResult(["draw", "notFinished"][result[0]]);
  }

  // Extract all winners
  const winners = allLinesResults.filter((item) => typeof item === "string");

  // If there is only one winner, return it
  if (winners.length === 1) {
    return returnResult(result[0]);
  }

  // Following code is to handle the edge case of multiple winners
  // ----------------------------

  // If there is multiple winners, return the one with the most wins
  const victoryCount = winners.reduce(
    (acc, cur) => ({ ...acc, [cur]: (acc[cur] || 0) + 1 }),
    {}
  );
  const victories = Object.values(victoryCount);

  // Same number of wins for both players means a draw
  if (
    victories.length > 1 &&
    victories.every((item) => item === victories[0])
  ) {
    return returnResult("draw");
  }

  // Finally, return the winner with the most wins
  const maxVictoryCount = Math.max(...victories);
  const winner = Object.entries(victoryCount).filter(
    (item) => item[1] === maxVictoryCount
  )[0][0];
  return returnResult(winner);
}
