import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';

/**
 * Question / Answer panel framed in messages.png (wooden scroll).
 * Shows: title, situation, options A & B — then animates to reveal answer + explanation + concept.
 */
export default function QuestionPanel({ onAnswer }) {
  const questions     = useGameStore((s) => s.questions);
  const idx           = useGameStore((s) => s.currentQuestionIndex);
  const gamePhase     = useGameStore((s) => s.gamePhase);
  const selectedAns   = useGameStore((s) => s.selectedAnswer);
  const answerResult  = useGameStore((s) => s.answerResult);
  const buzzLock      = useGameStore((s) => s.buzzLock);
  const players       = useGameStore((s) => s.players);
  const turnIdx       = useGameStore((s) => s.currentTurnPlayerIndex);

  const q = questions[idx];
  if (!q) return null;

  const isFFF         = q.ruleset.mode === 'fastest-finger';
  const isRevealing   = gamePhase === 'answerReveal' || gamePhase === 'consequence' || gamePhase === 'pawnMoving';
  const canAnswer     = gamePhase === 'question' && (
    !isFFF || buzzLock !== null
  );
  const activeName = isFFF && buzzLock !== null
    ? players[buzzLock]?.name
    : players[turnIdx]?.name;

  function handleOption(opt) {
    if (!canAnswer) return;
    onAnswer(opt);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Frame image */}
      <img
        src="/assets/messages.png"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'fill',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Content over frame */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '14% 12% 10%',
        gap: 8,
        overflow: 'hidden',
      }}>
        {/* Question title */}
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          fontSize: 'clamp(0.6rem, 1.2vw, 0.85rem)',
          color: '#F5C842',
          letterSpacing: 1,
          textTransform: 'uppercase',
          textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          lineHeight: 1.2,
        }}>
          {q.title}
        </div>

        {/* Situation */}
        <AnimatePresence mode="wait">
          {!isRevealing ? (
            <motion.div
              key="situation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                fontFamily: 'Crimson Text, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(0.75rem, 1.4vw, 1rem)',
                color: '#FFF8E7',
                lineHeight: 1.45,
                flexShrink: 0,
              }}
            >
              {q.situation}
            </motion.div>
          ) : (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: 'Crimson Text, serif',
                fontSize: 'clamp(0.72rem, 1.3vw, 0.95rem)',
                color: '#FFF8E7',
                lineHeight: 1.4,
                flexShrink: 0,
              }}
            >
              <span style={{ color: '#F5C842', fontWeight: 700 }}>
                ✓ Correct: Option {q.correctOption}
              </span>
              <br />
              {q.explanation}
              <br />
              <span style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.7em',
                color: '#D4952A',
                letterSpacing: 1,
              }}>
                💡 {q.concept}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(245,200,66,0.3)', flexShrink: 0, margin: '2px 0' }} />

        {/* Option buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {(['A', 'B']).map((opt) => {
            const optText = opt === 'A' ? q.optionA : q.optionB;
            const isSelected = selectedAns === opt;
            const isCorrect  = q.correctOption === opt;
            let btnClass = 'option-btn';
            if (isRevealing && isCorrect)  btnClass += ' correct-reveal';
            if (isRevealing && isSelected && !isCorrect) btnClass += ' selected-wrong';
            if (!isRevealing && isSelected && answerResult === 'correct') btnClass += ' selected-correct';
            if (!isRevealing && isSelected && answerResult === 'wrong')   btnClass += ' selected-wrong';

            return (
              <button
                key={opt}
                className={btnClass}
                disabled={!canAnswer || isRevealing}
                onClick={() => handleOption(opt)}
                style={{ flex: 1, minHeight: 0 }}
              >
                <span style={{
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 700,
                  color: '#F5C842',
                  marginRight: 6,
                  fontSize: '0.8em',
                }}>
                  {opt}.
                </span>
                {optText}
              </button>
            );
          })}
        </div>

        {/* Active player indicator */}
        {!isRevealing && (
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.65rem',
            color: '#D4952A',
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            {isFFF && buzzLock === null
              ? '⚡ FASTEST FINGER — Press Q / W / E to buzz in!'
              : `${activeName}'s turn`
            }
          </div>
        )}
      </div>
    </div>
  );
}
