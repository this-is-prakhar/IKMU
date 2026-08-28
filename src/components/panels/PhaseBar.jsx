import { useGameStore } from '../../store/gameStore.js';

/**
 * Top-center phase bar framed in Letterhead.png.
 * Shows: current phase name + question number.
 */
export default function PhaseBar() {
  const questions = useGameStore((s) => s.questions);
  const phases    = useGameStore((s) => s.phases);
  const idx       = useGameStore((s) => s.currentQuestionIndex);
  const q         = questions[idx];
  if (!q) return null;

  const phase = phases.find((p) => p.id === q.phaseId);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        src="/assets/Letterhead.png"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'fill',
          pointerEvents: 'none',
        }}
      />
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '0 18%',
      }}>
        {/* Question number */}
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          fontSize: 'clamp(0.8rem, 1.6vw, 1.1rem)',
          color: '#F5C842',
          textShadow: '0 1px 6px rgba(0,0,0,0.7)',
          whiteSpace: 'nowrap',
        }}>
          Q{q.id} / {questions.length}
        </div>
        {/* Divider */}
        <div style={{ width: 1, height: '40%', background: 'rgba(245,200,66,0.4)' }} />
        {/* Phase name */}
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontWeight: 600,
          fontSize: 'clamp(0.7rem, 1.3vw, 0.95rem)',
          color: '#FFF8E7',
          textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          textAlign: 'center',
        }}>
          Phase {q.phaseId}: {phase?.name ?? ''}
        </div>
        {/* Timer mode badge */}
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.6rem',
          fontWeight: 700,
          color: q.ruleset.mode === 'fastest-finger' ? '#FF4400' : '#D4952A',
          letterSpacing: 1,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {q.ruleset.mode === 'fastest-finger' ? '⚡ FFF' : q.ruleset.timerSeconds > 0 ? `⏱ ${q.ruleset.timerSeconds}s` : 'No Timer'}
        </div>
      </div>
    </div>
  );
}
