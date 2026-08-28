import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TILE_POSITIONS, BOARD_PX } from '../../game-logic/boardConfig.js';
import { getMovementPath } from '../../game-logic/movement.js';

const PAWN_SIZE = 44;

export default function Pawn({ player, boardRef, isActive, onAnimationDone, pendingMovement, shouldAnimate }) {
  const controls  = useAnimation();
  const animating = useRef(false);

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

  // 2-Phase movement animation
  useEffect(() => {
    if (!shouldAnimate || !pendingMovement || animating.current) return;

    animating.current = true;

    (async () => {
      try {
        const { from, landingTile, ladderFrom, ladderTo, snakeFrom, snakeTo, win } = pendingMovement;

        // Phase 1: Step tile-by-tile from 'from' to 'landingTile'
        if (landingTile !== from) {
          const steps = getMovementPath(from, landingTile);
          for (const stepTile of steps) {
            const { left, top } = tileToPercent(stepTile);
            await controls.start({
              left, top,
              transition: { duration: 0.14, ease: 'easeInOut' },
            });
            await controls.start({
              y: [-4, 0],
              transition: { duration: 0.08 },
            });
          }
        }

        // Phase 2: Ladder climb from landingTile to ladderTo
        if (ladderFrom && ladderTo) {
          await new Promise((r) => setTimeout(r, 250));
          await controls.start({ scale: 1.2, y: -10, transition: { duration: 0.2 } });
          const dest = tileToPercent(ladderTo);
          await controls.start({
            ...dest,
            scale: 1, y: 0,
            transition: { duration: 0.65, ease: 'easeOut' },
          });
        }

        // Phase 2 (alt): Snake slither from landingTile to snakeTo
        if (snakeFrom && snakeTo) {
          await new Promise((r) => setTimeout(r, 250));
          await controls.start({ scale: 0.8, rotate: 18, transition: { duration: 0.2 } });
          const dest = tileToPercent(snakeTo);
          await controls.start({
            ...dest,
            scale: 1, rotate: 0,
            transition: { duration: 0.75, ease: 'easeIn' },
          });
        }

        // Phase 3: Win celebration bounce
        if (win) {
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
