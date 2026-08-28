import { useGameStore } from '../../store/gameStore.js';

export default function PhaseBar() {
  const questions = useGameStore((s) => s.questions);
  const phases    = useGameStore((s) => s.phases);
  const idx       = useGameStore((s) => s.currentQuestionIndex);
  const q         = questions[idx];
  if (!q) return null;

  const phase = phases.find((p) => p.id === q.phaseId);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(180deg, rgba(24, 16, 10, 0.95), rgba(14, 9, 6, 0.98))',
      border: '1.5px solid rgba(245, 200, 66, 0.35)',
      borderRadius: 10,
      padding: '0 20px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
    }}>
      {/* Question counter */}
      <div style={{
        fontFamily: 'Cinzel, serif',
        fontWeight: 700,
        fontSize: 'clamp(0.75rem, 1.4vw, 1.05rem)',
        color: '#F5C842',
        letterSpacing: 1,
        textShadow: '0 1px 4px rgba(0,0,0,0.7)',
        whiteSpace: 'nowrap',
      }}>
        QUESTION {q.id} / {questions.length}
      </div>

      {/* Phase Title */}
      <div style={{
        fontFamily: 'Cinzel Decorative, serif',
        fontWeight: 700,
        fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)',
        color: '#FFF8E7',
        textShadow: '0 1px 6px rgba(0,0,0,0.8)',
        textAlign: 'center',
      }}>
        Phase {q.phaseId}: <span style={{ color: '#F5C842' }}>{phase?.name ?? ''}</span>
      </div>

      {/* Mode Badge */}
      <div style={{
        fontFamily: 'Cinzel, serif',
        fontSize: '0.65rem',
        fontWeight: 700,
        color: q.ruleset.mode === 'fastest-finger' ? '#FF4400' : '#D4952A',
        letterSpacing: 1,
        textTransform: 'uppercase',
        background: 'rgba(0,0,0,0.3)',
        padding: '3px 10px',
        borderRadius: 12,
        border: `1px solid ${q.ruleset.mode === 'fastest-finger' ? '#FF4400' : 'rgba(212,149,42,0.4)'}`,
      }}>
        {q.ruleset.mode === 'fastest-finger' ? '⚡ FASTEST FINGER' : q.ruleset.timerSeconds > 0 ? `⏱ ${q.ruleset.timerSeconds}s TIMER` : 'UNTIMED'}
      </div>
    </div>
  );
}
