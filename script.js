"use strict";

function winningScenarios(board) {
  const horizontal = [...board].map((row, r) =>
    row.map((_, c) => c + r * row.length)
  );
  const vertical = [...board].map((row, r) =>
    row.map((_, c) => r + c * row.length)
  );
  const line = new Array(board.length).fill(0);
  const diagonal = [
    line.map((_, i) => i * board.length + i),
    line.map((_, i) => board.length - 1 + i * (board.length - 1)),
  ];

  return [...horizontal, ...vertical, ...diagonal];
}

function returnResult(inProgress, winner) {
  // In progress if there is no winner and there are still null entries
  if (inProgress && !winner.length) {
    return "Game in progress";
  }
  // It's a Draw if the total of win is even, AND not all by the same player
  if (winner.length % 2 === 0 && [...new Set(winner)].length !== 1) {
    return "Draw";
  }
  // Only one Winner
  if (winner.length === 1) {
    return `Winner is ${winner[0]}`;
  }
  // Edge case: multiple winners. Count the biggest score to find the greatest winner
  const greatWinner = winner
    .reduce((acc, player) => {
      const count = winner.filter((p) => p === player).length;
      return [...acc, { player, count }];
    }, [])
    .sort((a, b) => b.count - a.count)[0];

  return `Winner is ${greatWinner.player} (x${greatWinner.count} wins)`;
}

// Board is a square multiple array. Entries are either "X", "O", or null
function getWinner(board) {
  // flatten the board
  const flatBoard = board.reduce((acc, val) => acc.concat(val), []);

  // Board analysis results
  let inProgress = false;
  const winner = [];

  // Check for winning scenarios
  winningScenarios(board).forEach((scenario) => {
    // Build a list of the entries in the board that match the scenario
    const entries = scenario.map((index) => flatBoard[index]);

    // Check if all entries are the same by removing duplicates
    const uniqueEntries = [...new Set(entries)];

    // If there is a null entry, the game is still in progress
    if (uniqueEntries.includes(null)) {
      inProgress = true; // still in progress
      return;
    }

    // If there is only one entry and it is not null, we have a winner
    if (uniqueEntries.length === 1) {
      winner.push(uniqueEntries[0]);
      return;
    }
  });

  // Return the result
  returnResult(inProgress, winner);
}
