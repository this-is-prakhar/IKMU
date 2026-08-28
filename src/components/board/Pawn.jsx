import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TILE_POSITIONS, BOARD_PX, TILE_PX } from '../../game-logic/boardConfig.js';
import { getMovementPath } from '../../game-logic/movement.js';

const PAWN_SIZE = 44; // px width of pawn image on board

/**
 * @param {{
 *   player: Object,
 *   boardRef: React.RefObject,
 *   isActive: boolean,
 *   onAnimationDone: () => void,
 *   pendingMovement: Object|null,
 *   shouldAnimate: boolean,
 * }} props
 */
export default function Pawn({ player, boardRef, isActive, onAnimationDone, pendingMovement, shouldAnimate }) {
  const controls   = useAnimation();
  const animating  = useRef(false);

  // Convert tile position to % of board (for responsive positioning)
  function tileToPercent(tile) {
    const pos = TILE_POSITIONS[tile] ?? TILE_POSITIONS[0];
    return {
      left: `${((pos.x - PAWN_SIZE / 2) / BOARD_PX) * 100}%`,
      top:  `${((pos.y - PAWN_SIZE) / BOARD_PX) * 100}%`,
    };
  }

  // Idle breathing animation
  useEffect(() => {
    if (!shouldAnimate) {
      controls.start({
        y: [0, -4, 0],
        transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: player.id * 0.6 },
      });
    }
  }, [shouldAnimate, player.id]);

  // Step-by-step movement animation
  useEffect(() => {
    if (!shouldAnimate || !pendingMovement || animating.current) return;

    const { newPos } = pendingMovement;
    const fromPos    = player.position; // position before movement (the store already updated it, so we animate from prev)
    // We animate: from (prevPosition = newPos - delta) to newPos
    // But store has already applied the final position including snake/ladder.
    // We animate intermediate steps then trigger snake/ladder separately.
    animating.current = true;

    (async () => {
      try {
        // Calculate path from before-movement position
        const prevPos  = pendingMovement.snakeFrom ?? pendingMovement.ladderFrom ?? newPos;
        const rawTo    = pendingMovement.snakeFrom ?? pendingMovement.ladderFrom ?? newPos;

        // Step through tiles one at a time
        if (rawTo !== fromPos) {
          const steps = getMovementPath(fromPos, rawTo);
          for (const stepTile of steps) {
            const { left, top } = tileToPercent(stepTile);
            await controls.start({
              left, top,
              transition: { duration: 0.12, ease: 'easeInOut' },
            });
            // Small bounce on each step
            await controls.start({
              y: [-3, 0],
              transition: { duration: 0.08 },
            });
          }
        }

        // Snake slide
        if (pendingMovement.snakeFrom) {
          await controls.start({ scale: 0.8, rotate: 15, transition: { duration: 0.2 } });
          const snakeDest = tileToPercent(pendingMovement.snakeTo);
          await controls.start({
            ...snakeDest,
            scale: 1, rotate: 0,
            transition: { duration: 0.7, ease: 'easeIn' },
          });
        }

        // Ladder climb
        if (pendingMovement.ladderFrom) {
          await controls.start({ scale: 1.15, y: -8, transition: { duration: 0.15 } });
          const ladderDest = tileToPercent(pendingMovement.ladderTo);
          await controls.start({
            ...ladderDest,
            scale: 1, y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
          });
        }

        // Win bounce
        if (pendingMovement.win) {
          await controls.start({
            scale: [1, 1.4, 1, 1.3, 1],
            rotate: [0, -10, 10, -5, 0],
            transition: { duration: 0.6 },
          });
        }
      } finally {
        animating.current = false;
        onAnimationDone?.();
      }
    })();
  }, [shouldAnimate, pendingMovement]);

  const { left, top } = tileToPercent(player.position);

  return (
    <motion.div
      animate={controls}
      style={{
        position: 'absolute',
        width: `${PAWN_SIZE}px`,
        height: `${PAWN_SIZE * 1.5}px`,
        left,
        top,
        zIndex: isActive ? 20 : 10 + player.id,
        filter: isActive
          ? 'drop-shadow(0 0 8px #F5C842) drop-shadow(0 4px 8px rgba(0,0,0,0.8))'
          : 'drop-shadow(0 4px 8px rgba(0,0,0,0.7))',
        cursor: 'default',
      }}
    >
      <img
        src={player.pawnImage}
        alt={`${player.name}'s pawn`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom',
          userSelect: 'none',
          WebkitUserDrag: 'none',
        }}
      />
      {/* Name tag */}
      <div style={{
        position: 'absolute',
        bottom: -16,
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        background: 'rgba(26,16,8,0.85)',
        border: '1px solid rgba(245,200,66,0.5)',
        borderRadius: 3,
        padding: '1px 5px',
        fontSize: 8,
        fontFamily: 'Cinzel, serif',
        fontWeight: 700,
        color: isActive ? '#F5C842' : '#FFF8E7',
        pointerEvents: 'none',
      }}>
        {player.name}
      </div>
    </motion.div>
  );
}
