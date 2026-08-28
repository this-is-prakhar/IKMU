import { useMemo } from 'react';
import {
  BOARD_SIZE, COLS, TILE_PX, BOARD_PX,
  getTilePosition, getTileColor, SNAKES, LADDERS
} from '../../game-logic/boardConfig.js';

// ── Tile fill gradient defs ──────────────────────────────────────────────────
function TileDefs() {
  return (
    <defs>
      {/* Paper texture filter */}
      <filter id="paper" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="2" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
        <feBlend in="SourceGraphic" in2="grey" mode="overlay" result="blend" />
        <feComposite in="blend" in2="SourceGraphic" operator="in" />
      </filter>
      {/* Gold shimmer gradient */}
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#D4A017" />
        <stop offset="40%"  stopColor="#F5C842" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
      {/* Snake body gradient */}
      <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#1A5C1A" />
        <stop offset="50%"  stopColor="#2A8B2A" />
        <stop offset="100%" stopColor="#0D3D0D" />
      </linearGradient>
      {/* Ladder wood gradient */}
      <linearGradient id="ladderWood" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#8B5A1A" />
        <stop offset="50%"  stopColor="#C8960C" />
        <stop offset="100%" stopColor="#6B3A10" />
      </linearGradient>
      {/* Rangoli motif gradient */}
      <radialGradient id="rangoli" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#F5C842" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#E86F1F" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

// ── Individual tile ──────────────────────────────────────────────────────────
function BoardTile({ tile }) {
  const { x, y } = getTilePosition(tile);
  const fill     = getTileColor(tile);
  const cx       = x - TILE_PX / 2;
  const cy       = y - TILE_PX / 2;
  const isStart  = tile === 1;
  const isFinish = tile === BOARD_SIZE;
  const isSnakeH = !!SNAKES[tile];
  const isLadB   = !!LADDERS[tile];

  return (
    <g>
      {/* Main tile rect */}
      <rect
        x={cx + 1} y={cy + 1}
        width={TILE_PX - 2} height={TILE_PX - 2}
        rx={3} ry={3}
        fill={fill}
        stroke="#F5C842"
        strokeWidth={isStart || isFinish ? 2.5 : 1}
        filter="url(#paper)"
      />
      {/* Inner border decoration */}
      <rect
        x={cx + 4} y={cy + 4}
        width={TILE_PX - 8} height={TILE_PX - 8}
        rx={2} ry={2}
        fill="none"
        stroke={isStart || isFinish ? '#F5C842' : 'rgba(245,200,66,0.2)'}
        strokeWidth={isStart || isFinish ? 1.5 : 0.5}
      />
      {/* Rangoli center dot */}
      <circle cx={x} cy={y} r={2.5} fill="rgba(245,200,66,0.25)" />

      {/* Tile number */}
      <text
        x={cx + TILE_PX - 6} y={cy + 11}
        textAnchor="end"
        fontFamily="Cinzel, serif"
        fontWeight="700"
        fontSize="8"
        fill={isStart || isFinish ? '#F5C842' : 'rgba(255,248,231,0.7)'}
      >
        {tile}
      </text>

      {/* Labels for special tiles */}
      {isStart && (
        <text x={x} y={y + 4} textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="700" fontSize="9" fill="#F5C842">
          START
        </text>
      )}
      {isFinish && (
        <>
          <text x={x} y={y} textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="700" fontSize="8" fill="#F5C842">
            FINISH
          </text>
          <text x={x} y={y + 11} textAnchor="middle" fontSize="14">🏆</text>
        </>
      )}

      {/* Snake head indicator */}
      {isSnakeH && (
        <text x={x} y={y + 6} textAnchor="middle" fontSize="18">🐍</text>
      )}
      {/* Ladder bottom indicator */}
      {isLadB && (
        <text x={x} y={y + 6} textAnchor="middle" fontSize="18">🪜</text>
      )}
    </g>
  );
}

// ── Snake path ───────────────────────────────────────────────────────────────
function SnakePath({ headTile, tailTile }) {
  const h = getTilePosition(headTile);
  const t = getTilePosition(tailTile);
  // Cubic bezier with gentle S-curve
  const mx = (h.x + t.x) / 2 + (h.y > t.y ? 40 : -40);
  const my = (h.y + t.y) / 2;
  const d  = `M ${h.x} ${h.y} C ${h.x + 20} ${my}, ${mx} ${t.y - 20}, ${t.x} ${t.y}`;

  return (
    <g>
      {/* Shadow */}
      <path d={d} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth={9} strokeLinecap="round" />
      {/* Body */}
      <path d={d} fill="none" stroke="url(#snakeGrad)" strokeWidth={7} strokeLinecap="round"
        strokeDasharray="none" />
      {/* Scale pattern overlay */}
      <path d={d} fill="none" stroke="rgba(50,180,50,0.3)" strokeWidth={3}
        strokeDasharray="8 5" strokeLinecap="round" />
      {/* Head circle */}
      <circle cx={h.x} cy={h.y} r={10} fill="#1A5C1A" stroke="#F5C842" strokeWidth={2} />
      <text x={h.x} y={h.y + 5} textAnchor="middle" fontSize="10">🐍</text>
    </g>
  );
}

// ── Ladder path ──────────────────────────────────────────────────────────────
function LadderPath({ bottomTile, topTile }) {
  const b    = getTilePosition(bottomTile);
  const top  = getTilePosition(topTile);
  const dx   = 8; // rail offset
  const RUNGS = 5;

  // Rail lines
  const leftRail  = `M ${b.x - dx} ${b.y} L ${top.x - dx} ${top.y}`;
  const rightRail = `M ${b.x + dx} ${b.y} L ${top.x + dx} ${top.y}`;

  // Rung positions (evenly spaced)
  const rungs = Array.from({ length: RUNGS }, (_, i) => {
    const t  = (i + 1) / (RUNGS + 1);
    const rx = b.x + (top.x - b.x) * t;
    const ry = b.y + (top.y - b.y) * t;
    return { rx, ry };
  });

  return (
    <g>
      {/* Rail shadows */}
      <path d={leftRail}  fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={7} strokeLinecap="round" />
      <path d={rightRail} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={7} strokeLinecap="round" />
      {/* Rails */}
      <path d={leftRail}  fill="none" stroke="url(#ladderWood)" strokeWidth={5} strokeLinecap="round" />
      <path d={rightRail} fill="none" stroke="url(#ladderWood)" strokeWidth={5} strokeLinecap="round" />
      {/* Rungs */}
      {rungs.map(({ rx, ry }, i) => (
        <g key={i}>
          <line
            x1={rx - dx - 3} y1={ry}
            x2={rx + dx + 3} y2={ry}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={5} strokeLinecap="round"
          />
          <line
            x1={rx - dx - 3} y1={ry}
            x2={rx + dx + 3} y2={ry}
            stroke="url(#ladderWood)"
            strokeWidth={4} strokeLinecap="round"
          />
          {/* Marigold flower every other rung */}
          {i % 2 === 0 && (
            <text x={rx} y={ry + 4} textAnchor="middle" fontSize="8">🌼</text>
          )}
        </g>
      ))}
      {/* Top & bottom markers */}
      <circle cx={b.x}   cy={b.y}   r={6} fill="#C8960C" stroke="#F5C842" strokeWidth={1.5} />
      <circle cx={top.x} cy={top.y} r={6} fill="#C8960C" stroke="#F5C842" strokeWidth={1.5} />
    </g>
  );
}

// ── Decorative corner motifs ─────────────────────────────────────────────────
function CornerMotif({ x, y, rotate = 0 }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`}>
      <circle r={12} fill="rgba(245,200,66,0.08)" stroke="rgba(245,200,66,0.3)" strokeWidth={1} />
      <circle r={7}  fill="rgba(232,111,31,0.15)" />
      <circle r={3}  fill="#F5C842" opacity={0.6} />
      {/* Petals */}
      {[0,72,144,216,288].map((a) => (
        <ellipse
          key={a}
          rx={4} ry={9}
          transform={`rotate(${a}) translate(0,-10)`}
          fill="rgba(245,200,66,0.2)"
          stroke="rgba(245,200,66,0.4)"
          strokeWidth={0.5}
        />
      ))}
    </g>
  );
}

// ── Main Board component ─────────────────────────────────────────────────────
export default function Board() {
  const tiles = useMemo(() => Array.from({ length: BOARD_SIZE }, (_, i) => i + 1), []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '1 / 1',
      maxWidth: BOARD_PX,
      maxHeight: BOARD_PX,
    }}>
      <svg
        viewBox={`0 0 ${BOARD_PX} ${BOARD_PX}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: 8,
          boxShadow: '0 8px 48px rgba(0,0,0,0.8), inset 0 0 0 3px rgba(245,200,66,0.3)',
        }}
        aria-label="Snakes and Ladders game board"
      >
        <TileDefs />

        {/* Board background */}
        <rect width={BOARD_PX} height={BOARD_PX} rx={8} ry={8}
          fill="#1A0D06" />
        <rect width={BOARD_PX} height={BOARD_PX} rx={8} ry={8}
          fill="url(#rangoli)" opacity={0.3} />

        {/* Grid tiles */}
        {tiles.map((t) => <BoardTile key={t} tile={t} />)}

        {/* Ladders (drawn below snakes so snakes appear on top) */}
        {Object.entries(LADDERS).map(([from, to]) => (
          <LadderPath key={`ladder-${from}`} bottomTile={Number(from)} topTile={to} />
        ))}

        {/* Snakes */}
        {Object.entries(SNAKES).map(([head, tail]) => (
          <SnakePath key={`snake-${head}`} headTile={Number(head)} tailTile={tail} />
        ))}

        {/* Corner decorative motifs */}
        <CornerMotif x={20}            y={20} />
        <CornerMotif x={BOARD_PX - 20} y={20} rotate={90} />
        <CornerMotif x={20}            y={BOARD_PX - 20} rotate={270} />
        <CornerMotif x={BOARD_PX - 20} y={BOARD_PX - 20} rotate={180} />

        {/* Outer gold border */}
        <rect x={1} y={1} width={BOARD_PX - 2} height={BOARD_PX - 2}
          rx={8} ry={8}
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth={3}
        />
      </svg>
    </div>
  );
}
