import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';

export default function TimerPanel() {
  const timerActive = useGameStore((s) => s.timerActive);
  const timeLeft    = useGameStore((s) => s.timeLeft);
  const questions   = useGameStore((s) => s.questions);
  const idx         = useGameStore((s) => s.currentQuestionIndex);

  const q        = questions[idx];
  const maxTime  = q?.ruleset?.timerSeconds ?? 20;
  const progress = maxTime > 0 ? timeLeft / maxTime : 0;
  const isUrgent = timeLeft <= 5 && timerActive;

  if (maxTime === 0) {
    return (
      <div style={{
        width: '100%',
        background: 'linear-gradient(160deg, rgba(22, 14, 8, 0.94), rgba(12, 8, 5, 0.96))',
        border: '1.5px solid rgba(245, 200, 66, 0.25)',
        borderRadius: 10,
        padding: '6px 12px',
        textAlign: 'center',
        fontFamily: 'Cinzel, serif',
        fontSize: '0.65rem',
        color: 'rgba(245,237,208,0.5)',
      }}>
        ⏱ UNTIMED ROUND
      </div>
    );
  }

  // SVG ring params
  const R    = 34;
  const circ = 2 * Math.PI * R;
  const dash = circ * progress;

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(160deg, rgba(22, 14, 8, 0.94), rgba(12, 8, 5, 0.96))',
      border: `2px solid ${isUrgent ? '#FF4400' : 'rgba(245, 200, 66, 0.35)'}`,
      borderRadius: 12,
      padding: '8px 12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      transition: 'border-color 0.3s ease',
    }}>
      {/* SVG Ring */}
      <div style={{ position: 'relative', width: 76, height: 76 }}>
        <svg width="76" height="76" viewBox="0 0 80 80">
          <circle cx={40} cy={40} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={6} />
          <motion.circle
            cx={40} cy={40} r={R}
            fill="none"
            stroke={isUrgent ? '#FF4400' : '#F5C842'}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 40 40)"
            animate={{
              stroke: isUrgent ? ['#FF4400', '#FF8800', '#FF4400'] : '#F5C842',
            }}
            transition={{ duration: 0.4, repeat: isUrgent ? Infinity : 0 }}
          />
          <text
            x={40} y={46}
            textAnchor="middle"
            fontFamily="Cinzel, serif"
            fontWeight="700"
            fontSize={isUrgent ? 22 : 19}
            fill={isUrgent ? '#FF4400' : '#F5C842'}
          >
            {timeLeft}
          </text>
        </svg>
      </div>

      {/* Label */}
      <div style={{
        fontFamily: 'Cinzel, serif',
        fontWeight: 700,
        fontSize: '0.62rem',
        color: isUrgent ? '#FF4400' : '#D4952A',
        letterSpacing: 1.5,
        marginTop: 2,
      }}>
        {isUrgent ? '⚠ HURRY!' : 'TIME REMAINING'}
      </div>
    </div>
  );
}
