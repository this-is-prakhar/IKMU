import { useEffect, useState, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { useTimer } from '../../hooks/useTimer.js';
import { useFastestFinger } from '../../hooks/useFastestFinger.js';
import { useSound } from '../../hooks/useSound.js';

import Board           from '../board/Board.jsx';
import Pawn            from '../board/Pawn.jsx';
import QuestionPanel   from '../panels/QuestionPanel.jsx';
import TimerPanel      from '../panels/TimerPanel.jsx';
import LeaderboardPanel from '../panels/LeaderboardPanel.jsx';
import PhaseBar        from '../panels/PhaseBar.jsx';
import PlayerCards     from '../panels/PlayerCards.jsx';
import ConsequenceBanner   from '../ui/ConsequenceBanner.jsx';
import ComicReactionBubble from '../ui/ComicReactionBubble.jsx';

export default function GameBoardScreen() {
  const players          = useGameStore((s) => s.players);
  const questions        = useGameStore((s) => s.questions);
  const currentQIdx      = useGameStore((s) => s.currentQuestionIndex);
  const gamePhase        = useGameStore((s) => s.gamePhase);
  const answerResult     = useGameStore((s) => s.answerResult);
  const pendingMovement  = useGameStore((s) => s.pendingMovement);
  const currentTurnIdx   = useGameStore((s) => s.currentTurnPlayerIndex);
  const buzzLock         = useGameStore((s) => s.buzzLock);
  const winner           = useGameStore((s) => s.winner);
  const submitAnswer     = useGameStore((s) => s.submitAnswer);
  const showConsequence  = useGameStore((s) => s.showConsequence);
  const advanceQuestion  = useGameStore((s) => s.advanceQuestion);
  const startTimer       = useGameStore((s) => s.startTimer);
  const setScreen        = useGameStore((s) => s.setScreen);

  const sounds = useSound();

  // Hooks
  useTimer();
  useFastestFinger();

  const boardRef = useRef(null);

  const q          = questions[currentQIdx];
  const isFFF      = q?.ruleset?.mode === 'fastest-finger';
  const actingPlayer = buzzLock !== null ? buzzLock : currentTurnIdx;

  // Track which player is currently animating their pawn
  const [animatingPlayer, setAnimatingPlayer] = useState(null);

  // Start timer when entering a new question (if needed)
  useEffect(() => {
    if (gamePhase === 'question' && q?.ruleset?.timerSeconds > 0) {
      const t = setTimeout(() => startTimer(), 600);
      return () => clearTimeout(t);
    }
  }, [gamePhase, currentQIdx]);

  // Play sounds on answer reveal
  useEffect(() => {
    if (gamePhase === 'answerReveal') {
      if (answerResult === 'correct') sounds.correct();
      else if (answerResult === 'wrong') sounds.wrong();

      // If there's movement, start pawn animation
      if (pendingMovement) {
        setAnimatingPlayer(actingPlayer);
      } else {
        // No movement (skip) — go straight to consequence after short delay
        const t = setTimeout(() => showConsequence(), 2500);
        return () => clearTimeout(t);
      }
    }
  }, [gamePhase]);

  // After pawn animation completes → show consequence
  const handlePawnAnimDone = useCallback(() => {
    if (pendingMovement?.snakeFrom) sounds.snake();
    else if (pendingMovement?.ladderFrom) sounds.ladder();
    setAnimatingPlayer(null);

    const t = setTimeout(() => showConsequence(), 500);
    return () => clearTimeout(t);
  }, [pendingMovement]);

  // Auto-advance after consequence display
  useEffect(() => {
    if (gamePhase === 'consequence') {
      // Check win condition
      if (winner) {
        const t = setTimeout(() => setScreen('endScreen'), 2200);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => advanceQuestion(), 3200);
      return () => clearTimeout(t);
    }
  }, [gamePhase, winner]);

  // Determine reaction type for comic bubble
  const reactionType = gamePhase === 'answerReveal' || gamePhase === 'pawnMoving'
    ? (answerResult === 'correct' ? (pendingMovement?.ladderFrom ? 'ladder' : 'correct')
       : answerResult === 'wrong'  ? (pendingMovement?.snakeFrom ? 'snake' : 'wrong')
       : null)
    : null;

  const showBubble = (gamePhase === 'answerReveal' || gamePhase === 'pawnMoving') && answerResult !== 'skip';

  return (
    <div
      className="screen"
      style={{
        background: '#0D0906',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr auto',
        gap: 0,
        overflow: 'hidden',
      }}
    >
      {/* Ambient background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/game_start.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.06,
        filter: 'blur(8px) saturate(1.5)',
        pointerEvents: 'none',
      }} />

      {/* TOP BAR — Phase bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: 'clamp(44px, 7vh, 64px)',
        padding: '0 8px',
      }}>
        <PhaseBar />
      </div>

      {/* MIDDLE ROW */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'grid',
        gridTemplateColumns: 'clamp(200px, 22vw, 280px) 1fr clamp(160px, 18vw, 220px)',
        gap: 8,
        padding: '0 8px',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* LEFT — Question panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          minHeight: 0,
          overflow: 'hidden',
        }}>
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <QuestionPanel
              onAnswer={(opt) => {
                sounds.click();
                submitAnswer(opt);
              }}
            />
          </div>
        </div>

        {/* CENTER — Board + pawns */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: 0,
        }}>
          <div ref={boardRef} style={{
            position: 'relative',
            width: '100%',
            maxWidth: 'min(100%, calc(100vh - 200px))',
            aspectRatio: '1 / 1',
          }}>
            <Board />
            {/* Pawns overlaid on board */}
            {players.map((p, i) => (
              <Pawn
                key={p.id}
                player={p}
                boardRef={boardRef}
                isActive={i === actingPlayer && gamePhase === 'question'}
                shouldAnimate={animatingPlayer === i && gamePhase === 'answerReveal'}
                pendingMovement={animatingPlayer === i ? pendingMovement : null}
                onAnimationDone={handlePawnAnimDone}
              />
            ))}
          </div>

          {/* Comic reaction bubble */}
          <ComicReactionBubble type={reactionType} visible={showBubble} />
        </div>

        {/* RIGHT — Timer + Leaderboard */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          minHeight: 0,
          overflow: 'hidden',
        }}>
          {/* Timer */}
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <TimerPanel />
          </div>

          {/* Leaderboard */}
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <LeaderboardPanel />
          </div>
        </div>
      </div>

      {/* BOTTOM — Player cards */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: 'clamp(80px, 12vh, 110px)',
        padding: '4px 8px',
        background: 'linear-gradient(180deg, transparent, rgba(13,9,6,0.6))',
      }}>
        <PlayerCards />
      </div>

      {/* Consequence banner (overlaid) */}
      <ConsequenceBanner
        text={q?.consequence ?? ''}
        visible={gamePhase === 'consequence'}
      />
    </div>
  );
}
