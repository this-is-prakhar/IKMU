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
  const players             = useGameStore((s) => s.players);
  const questions           = useGameStore((s) => s.questions);
  const currentQIdx         = useGameStore((s) => s.currentQuestionIndex);
  const gamePhase           = useGameStore((s) => s.gamePhase);
  const questionResults     = useGameStore((s) => s.questionResults);
  const pendingMovements    = useGameStore((s) => s.pendingMovements);
  const winner              = useGameStore((s) => s.winner);
  const submitPlayerAnswer  = useGameStore((s) => s.submitPlayerAnswer);
  const showConsequence     = useGameStore((s) => s.showConsequence);
  const advanceQuestion     = useGameStore((s) => s.advanceQuestion);
  const startTimer          = useGameStore((s) => s.startTimer);
  const setScreen           = useGameStore((s) => s.setScreen);

  const sounds = useSound();

  // Hooks
  useTimer();
  useFastestFinger();

  const boardRef = useRef(null);

  const q = questions[currentQIdx];

  // Track which player is currently animating their pawn
  const [animatingPlayer, setAnimatingPlayer] = useState(null);
  const [activeMovement, setActiveMovement]  = useState(null);

  // Start timer when entering a question phase
  useEffect(() => {
    if (gamePhase === 'question' && q?.ruleset?.timerSeconds > 0) {
      const t = setTimeout(() => startTimer(), 400);
      return () => clearTimeout(t);
    }
  }, [gamePhase, currentQIdx]);

  // Handle answer reveal & sequential pawn animation
  useEffect(() => {
    if (gamePhase === 'answerReveal') {
      const hasAnyCorrect = questionResults.some((r) => r.isCorrect);
      if (hasAnyCorrect) sounds.correct();
      else sounds.wrong();

      if (pendingMovements && pendingMovements.length > 0) {
        // Queue pawn animations for each player
        let moveQueue = [...pendingMovements];
        const runNextAnimation = () => {
          if (moveQueue.length === 0) {
            setAnimatingPlayer(null);
            setActiveMovement(null);
            setTimeout(() => showConsequence(), 600);
            return;
          }
          const currentMove = moveQueue.shift();
          setAnimatingPlayer(currentMove.playerIdx);
          setActiveMovement(currentMove);
        };
        runNextAnimation();
      } else {
        const t = setTimeout(() => showConsequence(), 2500);
        return () => clearTimeout(t);
      }
    }
  }, [gamePhase]);

  const handlePawnAnimDone = useCallback(() => {
    if (activeMovement?.snakeFrom) sounds.snake();
    else if (activeMovement?.ladderFrom) sounds.ladder();

    // Move to next player's animation if any
    setAnimatingPlayer(null);
    setActiveMovement(null);
    setTimeout(() => showConsequence(), 600);
  }, [activeMovement]);

  // Auto-advance after consequence display
  useEffect(() => {
    if (gamePhase === 'consequence') {
      if (winner) {
        const t = setTimeout(() => setScreen('endScreen'), 2200);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => advanceQuestion(), 3400);
      return () => clearTimeout(t);
    }
  }, [gamePhase, winner]);

  // Comic reaction type
  const hasLadder = pendingMovements.some((m) => m.ladderFrom);
  const hasSnake  = pendingMovements.some((m) => m.snakeFrom);
  const reactionType = gamePhase === 'answerReveal'
    ? (hasLadder ? 'ladder' : hasSnake ? 'snake' : questionResults.some((r) => r.isCorrect) ? 'correct' : 'wrong')
    : null;

  return (
    <div
      className="screen"
      style={{
        background: '#0B0704',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr auto',
        gap: 6,
        padding: 6,
        overflow: 'hidden',
      }}
    >
      {/* Background artwork — clearly visible */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/game_start.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.42,
        filter: 'brightness(0.7) saturate(1.2)',
        pointerEvents: 'none',
      }} />

      {/* Radial vignette overlay for warmth */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11,7,4,0.75) 100%)',
        pointerEvents: 'none',
      }} />

      {/* TOP BAR — Phase bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: 'clamp(40px, 6vh, 56px)',
      }}>
        <PhaseBar />
      </div>

      {/* MIDDLE ROW */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'grid',
        gridTemplateColumns: 'clamp(220px, 24vw, 300px) 1fr clamp(170px, 19vw, 240px)',
        gap: 8,
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* LEFT — Question panel */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <QuestionPanel
            onAnswer={(playerIdx, opt) => {
              sounds.click();
              submitPlayerAnswer(playerIdx, opt);
            }}
          />
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
            maxWidth: 'min(100%, calc(100vh - 190px))',
            aspectRatio: '1 / 1',
          }}>
            <Board />
            {/* Pawns overlaid on board */}
            {players.map((p, i) => (
              <Pawn
                key={p.id}
                player={p}
                boardRef={boardRef}
                isActive={gamePhase === 'question'}
                shouldAnimate={animatingPlayer === i && gamePhase === 'answerReveal'}
                pendingMovement={animatingPlayer === i ? activeMovement : null}
                onAnimationDone={handlePawnAnimDone}
              />
            ))}
          </div>

          {/* Comic reaction bubble */}
          <ComicReactionBubble type={reactionType} visible={gamePhase === 'answerReveal'} />
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
          <div style={{ flexShrink: 0 }}>
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
        height: 'clamp(75px, 11vh, 100px)',
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
