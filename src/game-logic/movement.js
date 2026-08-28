import { BOARD_SIZE, SNAKES, LADDERS } from './boardConfig.js';

/**
 * Apply a movement delta to a position.
 * Returns the final position after applying snakes/ladders.
 *
 * @param {number} currentPos  Current tile (0 = start)
 * @param {number} delta       Spaces to move (positive=forward, negative=backward)
 * @returns {{ newPos: number, snakeFrom?: number, snakeTo?: number, ladderFrom?: number, ladderTo?: number, win: boolean }}
 */
export function applyMovement(currentPos, delta) {
  let raw = currentPos + delta;

  // Clamp: can't go below 1 (but if at 0 and moving back, stay at 0)
  if (raw < 0) raw = 0;

  // Can't exceed BOARD_SIZE (bounce back from finish)
  if (raw > BOARD_SIZE) {
    raw = BOARD_SIZE - (raw - BOARD_SIZE); // bounce
    if (raw < 1) raw = 1;
  }

  // Win condition: exactly hit finish
  if (raw >= BOARD_SIZE) {
    return { newPos: BOARD_SIZE, win: true };
  }

  // Check snake
  if (SNAKES[raw]) {
    const snakeFrom = raw;
    const snakeTo   = SNAKES[raw];
    return { newPos: snakeTo, snakeFrom, snakeTo, win: false };
  }

  // Check ladder
  if (LADDERS[raw]) {
    const ladderFrom = raw;
    const ladderTo   = LADDERS[raw];
    return { newPos: ladderTo, ladderFrom, ladderTo, win: false };
  }

  return { newPos: raw, win: false };
}

/**
 * Build an array of intermediate tile positions for step-by-step pawn animation.
 * Returns tiles the pawn visits from start (exclusive) to end (inclusive).
 */
export function getMovementPath(from, to) {
  if (from === to) return [to];
  const direction = to > from ? 1 : -1;
  const path = [];
  for (let pos = from + direction; direction > 0 ? pos <= to : pos >= to; pos += direction) {
    path.push(pos);
  }
  return path;
}
