import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';

/**
 * Timer panel — timer.png medallion with SVG countdown ring overlaid.
 */
export default function TimerPanel() {
  const timerActive = useGameStore((s) => s.timerActive);
  const timeLeft    = useGameStore((s) => s.timeLeft);
  const questions   = useGameStore((s) => s.questions);
  const idx         = useGameStore((s) => s.currentQuestionIndex);

  const q       = questions[idx];
  const maxTime = q?.ruleset?.timerSeconds ?? 20;
  const progress = maxTime > 0 ? timeLeft / maxTime : 0;
  const isUrgent = timeLeft <= 5 && timerActive;

  if (!timerActive && timeLeft === 0 && !(q?.ruleset?.timerSeconds > 0)) return null;

  // SVG ring params
  const R     = 36;
  const circ  = 2 * Math.PI * R;
  const dash  = circ * progress;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Medallion background */}
      <div style={{
        position: 'relative',
        width: 'min(100%, 110px)',
        aspectRatio: '278/349',
        animation: isUrgent ? 'timerUrgency 0.5s ease-in-out infinite' : undefined,
      }}>
        <img
          src="/assets/timer.png"
          alt="Timer"
          style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
        />

        {/* SVG ring overlay */}
        <svg
          style={{
            position: 'absolute',
            top: '12%', left: '14%',
            width: '72%', height: '60%',
          }}
          viewBox="0 0 90 90"
        >
          {/* Track */}
          <circle cx={45} cy={45} r={R} fill="none"
            stroke="rgba(255,255,255,0.15)" strokeWidth={6} />
          {/* Progress */}
          <motion.circle
            cx={45} cy={45} r={R}
            fill="none"
            stroke={isUrgent ? '#FF4400' : '#F5C842'}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 45 45)"
            animate={{
              stroke: isUrgent ? ['#FF4400', '#FF8800', '#FF4400'] : '#F5C842',
            }}
            transition={{ duration: 0.4, repeat: isUrgent ? Infinity : 0 }}
          />
          {/* Time text */}
          <text
            x={45} y={50}
            textAnchor="middle"
            fontFamily="Cinzel, serif"
            fontWeight="700"
            fontSize={isUrgent ? 24 : 20}
            fill={isUrgent ? '#FF4400' : '#F5C842'}
          >
            {timeLeft}
          </text>
        </svg>
      </div>

      {/* Urgency label */}
      {isUrgent && (
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 700,
            fontSize: '0.65rem',
            color: '#FF4400',
            letterSpacing: 2,
            textShadow: '0 0 8px #FF4400',
            marginTop: 2,
          }}
        >
          ⚠ HURRY!
        </motion.div>
      )}
    </div>
  );
}
