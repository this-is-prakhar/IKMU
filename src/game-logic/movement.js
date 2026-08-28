import { BOARD_SIZE, SNAKES, LADDERS } from './boardConfig.js';

/**
 * Apply a movement delta to a position.
 * Returns movement details including starting tile, landing tile (after delta step),
 * and final tile (after snake or ladder, if triggered).
 *
 * @param {number} currentPos  Current tile (0 = start)
 * @param {number} delta       Spaces to move (positive=forward, negative=backward)
 * @returns {{
 *   from: number,
 *   landingTile: number,
 *   finalTile: number,
 *   newPos: number,
 *   snakeFrom?: number,
 *   snakeTo?: number,
 *   ladderFrom?: number,
 *   ladderTo?: number,
 *   win: boolean
 * }}
 */
export function applyMovement(currentPos, delta) {
  let landingTile = currentPos + delta;

  // Clamp: can't go below 0
  if (landingTile < 0) landingTile = 0;

  // Bounce back if exceeding BOARD_SIZE
  if (landingTile > BOARD_SIZE) {
    landingTile = BOARD_SIZE - (landingTile - BOARD_SIZE);
    if (landingTile < 1) landingTile = 1;
  }

  // Win condition: reached or exceeded finish
  if (landingTile >= BOARD_SIZE) {
    return {
      from: currentPos,
      landingTile: BOARD_SIZE,
      finalTile: BOARD_SIZE,
      newPos: BOARD_SIZE,
      win: true,
    };
  }

  // Check ladder at landingTile
  if (LADDERS[landingTile]) {
    const ladderFrom = landingTile;
    const ladderTo   = LADDERS[landingTile];
    return {
      from: currentPos,
      landingTile,
      finalTile: ladderTo,
      newPos: ladderTo,
      ladderFrom,
      ladderTo,
      win: ladderTo >= BOARD_SIZE,
    };
  }

  // Check snake at landingTile
  if (SNAKES[landingTile]) {
    const snakeFrom = landingTile;
    const snakeTo   = SNAKES[landingTile];
    return {
      from: currentPos,
      landingTile,
      finalTile: snakeTo,
      newPos: snakeTo,
      snakeFrom,
      snakeTo,
      win: false,
    };
  }

  return {
    from: currentPos,
    landingTile,
    finalTile: landingTile,
    newPos: landingTile,
    win: landingTile >= BOARD_SIZE,
  };
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
