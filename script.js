"use strict";

function extractRowsFromBoard(board) {
  // Initialize empty arrays as constants and mutate them later to save memory
  const horizontal = [];
  const vertical = [];
  const backslash = [];
  const slash = [];

  // Loop through the board to get all lines
  for (let row = 0; row < board.length; row++) {
    // Horizontal
    horizontal.push(board[row]);

    for (let col = 0; col < board[row].length; col++) {
      // Verticals
      if (!vertical[col]) {
        vertical[col] = [];
      }
      vertical[col].push(board[row][col]);

      // Backslash
      if (row === col) {
        backslash.push(board[row][col]);
      }

      // Slash
      if (row + col === board.length - 1) {
        slash.push(board[row][col]);
      }
    }
  }

  // All the potential winning lines flatten in one array of rows
  return [...horizontal, ...vertical, backslash, slash];
}

function getRowsStatus(row) {
  // Early return if any null, because there will be no winner in this row
  if (row.includes(null)) {
    return null;
  }

  // Remove duplicates marks of the row...
  const marks = [...new Set(row)];

  // ...if only one result, this is a win, otherwise it's a draw
  return marks.length === 1 && !!marks[0] ? marks[0] : "=";
}

// A function that takes a board as a multi-dimensional array and returns the winner (if there is one) in the form of "X", "O", "Draw" or null
function getWinner(board) {
  let winner = null; // null means no winner
  let drawCounter = 0;

  // Slice the board to get all potential winning rows from any direction
  const rows = extractRowsFromBoard(board);

  // Check row results until we have a winner or ending draw
  for (const row of rows) {
    const validation = getRowsStatus(row);

    if (validation === "=") {
      // This is a potential draw, increment the counter
      drawCounter++;
    } else if (validation !== null) {
      // We have a winner, Stop the loop
      winner = validation;
      break;
    }
  }

  // If there is no winner and the draw counter is equal to the number of lines, it's a draw
  if (!winner && drawCounter === rows.length) {
    return "Draw";
  }
  return winner; // "X" or "O" (or null is there is no winner yet)
}
