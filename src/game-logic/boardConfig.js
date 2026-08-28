// Board configuration: 81-tile (9×9) serpentine Snakes & Ladders grid
// Tile 1 = bottom-left, Tile 81 = top-right (FINISH)
// Even rows (0,2,4,6,8): left→right; Odd rows (1,3,5,7): right→left

export const BOARD_SIZE = 81;   // 9×9
export const COLS = 9;
export const TILE_PX = 60;      // Pixel size of each tile in the SVG
export const BOARD_PX = COLS * TILE_PX; // 540

/**
 * Get the screen (SVG-pixel) center of a tile.
 * @param {number} tile  1-based tile number
 * @returns {{ x: number, y: number, row: number, col: number }}
 */
export function getTilePosition(tile) {
  const zeroIdx = tile - 1;
  const row     = Math.floor(zeroIdx / COLS);          // 0 = bottom row
  const posInRow = zeroIdx % COLS;
  const col      = row % 2 === 0 ? posInRow : (COLS - 1 - posInRow);

  const x = col * TILE_PX + TILE_PX / 2;
  const y = BOARD_PX - (row * TILE_PX + TILE_PX / 2);  // y flipped (1=bottom)
  return { x, y, row, col };
}

/**
 * Pre-computed lookup table: tile → {x, y}
 */
export const TILE_POSITIONS = {};
for (let t = 1; t <= BOARD_SIZE; t++) {
  TILE_POSITIONS[t] = getTilePosition(t);
}
// Position 0 = off-board (START)
TILE_POSITIONS[0] = { x: -40, y: BOARD_PX - 30 };

// ── Snakes: head tile → tail tile (you slide DOWN) ──────────────────────────
export const SNAKES = {
  54: 26,
  63: 41,
  72: 32,
  46: 15,
  79: 58,
  34:  8,
};

// ── Ladders: bottom tile → top tile (you climb UP) ──────────────────────────
export const LADDERS = {
   5: 27,
  14: 43,
  23: 55,
  38: 64,
  48: 72,
  68: 80,
};

// Tile color palette (cycling, warm bazaar tones)
const PALETTE = [
  '#C8640A', // deep terracotta
  '#C8960C', // warm amber-gold
  '#B5510A', // burnt sienna
  '#1A6B5C', // deep teal
  '#8B2635', // burgundy
  '#9B5E1A', // copper-brown
];

export function getTileColor(tile) {
  // Special tiles
  if (tile === 1)           return '#2E5C1A'; // START — deep green
  if (tile === BOARD_SIZE)  return '#8B1A1A'; // FINISH — deep crimson
  if (SNAKES[tile])         return '#7A1A1A'; // Snake head — dark red
  if (LADDERS[tile])        return '#1A4A2E'; // Ladder bottom — dark green
  return PALETTE[(tile - 1) % PALETTE.length];
}
