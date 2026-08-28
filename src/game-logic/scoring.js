/**
 * Scoring utilities.
 * The ruleset per question drives all scoring — no hardcoded phase logic here.
 */

/**
 * Apply a question result to a player object.
 * Returns an updated player (immutable).
 *
 * @param {Object} player   Player state object
 * @param {'correct'|'wrong'|'skip'} result
 * @param {Object} ruleset  { correctDelta, wrongDelta }
 * @returns {Object} updated player
 */
export function applyScore(player, result, ruleset) {
  if (result === 'skip') return player;
  const delta = result === 'correct' ? ruleset.correctDelta : ruleset.wrongDelta;
  return {
    ...player,
    score:   player.score + delta,
    correct: player.correct + (result === 'correct' ? 1 : 0),
    wrong:   player.wrong  + (result === 'wrong'    ? 1 : 0),
  };
}

/**
 * Sort players for leaderboard display.
 * Primary: higher position; Secondary: higher score; Tertiary: accuracy.
 */
export function sortLeaderboard(players) {
  return [...players].sort((a, b) => {
    if (b.position !== a.position) return b.position - a.position;
    if (b.score    !== a.score)    return b.score    - a.score;
    const accA = a.correct + a.wrong > 0 ? a.correct / (a.correct + a.wrong) : 0;
    const accB = b.correct + b.wrong > 0 ? b.correct / (b.correct + b.wrong) : 0;
    return accB - accA;
  });
}

/**
 * Determine the winning player at game end.
 * Win: reached BOARD_SIZE. Else: furthest, then score, then accuracy.
 */
export function determineWinner(players) {
  return sortLeaderboard(players)[0];
}

/**
 * Calculate accuracy percentage string.
 */
export function accuracy(player) {
  const total = player.correct + player.wrong;
  if (total === 0) return '—';
  return `${Math.round((player.correct / total) * 100)}%`;
}
