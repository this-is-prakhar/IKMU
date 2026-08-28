import { create } from 'zustand';
import questionsData from '../data/questions.json';
import { applyMovement } from '../game-logic/movement.js';
import { applyScore, determineWinner } from '../game-logic/scoring.js';

const PAWN_IMAGES = ['/assets/pawn1.png', '/assets/pawn2.png', '/assets/pawn3.png'];
const PAWN_NAMES  = ['Uncle Sardar', 'Uncle Grump', 'Uncle Specs'];

const makePlayer = (id, name) => ({
  id,
  name,
  pawnIndex: id,
  pawnImage: PAWN_IMAGES[id],
  pawnName:  PAWN_NAMES[id],
  position:  0,
  score:     0,
  correct:   0,
  wrong:     0,
});

const initialState = {
  // Navigation
  screen: 'opening',    // 'opening'|'playerSetup'|'pregameStory'|'phaseTransition'|'playing'|'endScreen'

  // Players
  players: [makePlayer(0,''), makePlayer(1,''), makePlayer(2,'')],

  // Question state
  currentQuestionIndex: 0,
  questions: questionsData.questions,
  phases:    questionsData.phases,
  pregame:   questionsData.pregameSituation,

  // Turn state
  currentTurnPlayerIndex: 0,
  buzzLock: null,           // playerIndex who buzzed in (FFF mode), or null

  // Game-phase machine (within 'playing' screen)
  gamePhase: 'question',   // 'question'|'answerReveal'|'pawnMoving'|'consequence'|'phaseTransition'

  // Answer state
  selectedAnswer: null,     // 'A'|'B'
  answerResult: null,       // 'correct'|'wrong'|'skip'
  pendingMovement: null,    // { from, to, snakeFrom?, snakeTo?, ladderFrom?, ladderTo?, win }

  // Timer
  timerActive: false,
  timeLeft: 0,

  // Phase transition
  pendingPhaseId: null,

  // Win
  winner: null,

  // UI helpers
  leaderChanged: false,
  prevLeaderId: null,
};

export const useGameStore = create((set, get) => ({
  ...initialState,

  // ── Navigation ──────────────────────────────────────────────────────────────
  setScreen: (screen) => set({ screen }),

  // ── Player setup ────────────────────────────────────────────────────────────
  setPlayerName: (idx, name) => set((state) => {
    const players = [...state.players];
    players[idx] = { ...players[idx], name };
    return { players };
  }),

  startGame: () => {
    set({ screen: 'pregameStory' });
  },

  // ── Pregame → Phase 1 ────────────────────────────────────────────────────────
  beginPhase1: () => {
    set({ screen: 'phaseTransition', pendingPhaseId: 1 });
  },

  phaseTransitionDone: () => {
    set({ screen: 'playing', gamePhase: 'question' });
  },

  // ── Question answering (individual mode) ────────────────────────────────────
  submitAnswer: (answer) => {
    const state = get();
    const q     = state.questions[state.currentQuestionIndex];
    const playerIdx = state.buzzLock !== null ? state.buzzLock : state.currentTurnPlayerIndex;
    const isCorrect = answer === q.correctOption;
    const result    = isCorrect ? 'correct' : 'wrong';
    const delta     = isCorrect ? q.ruleset.correctDelta : q.ruleset.wrongDelta;

    // Update player score
    const updatedPlayers = [...state.players];
    updatedPlayers[playerIdx] = applyScore(updatedPlayers[playerIdx], result, q.ruleset);

    // Calculate movement
    const from      = updatedPlayers[playerIdx].position;
    const movement  = applyMovement(from, delta);
    updatedPlayers[playerIdx] = { ...updatedPlayers[playerIdx], position: movement.newPos };

    // Detect leader change
    const prevLead = state.players.reduce((a, b) => a.position >= b.position ? a : b);
    const newLead  = updatedPlayers.reduce((a, b) => a.position >= b.position ? a : b);
    const leaderChanged = newLead.id !== prevLead.id;

    set({
      players: updatedPlayers,
      selectedAnswer: answer,
      answerResult: result,
      gamePhase: 'answerReveal',
      pendingMovement: movement,
      timerActive: false,
      leaderChanged,
      prevLeaderId: prevLead.id,
    });

    // Check win
    if (movement.win) {
      set({ winner: updatedPlayers[playerIdx] });
    }
  },

  // ── FFF buzz-in ─────────────────────────────────────────────────────────────
  buzzIn: (playerIdx) => {
    const state = get();
    if (state.buzzLock !== null) return; // already locked
    if (state.gamePhase !== 'question') return;
    set({ buzzLock: playerIdx, timerActive: false });
  },

  // ── Timer expired (FFF: no buzz) ────────────────────────────────────────────
  timerExpired: () => {
    const state = get();
    if (state.gamePhase !== 'question') return;
    // Skip question — no movement
    set({
      selectedAnswer: null,
      answerResult: 'skip',
      gamePhase: 'answerReveal',
      timerActive: false,
      pendingMovement: null,
    });
  },

  // ── After reveal → show consequence ─────────────────────────────────────────
  showConsequence: () => set({ gamePhase: 'consequence' }),

  // ── After consequence → advance ─────────────────────────────────────────────
  advanceQuestion: () => {
    const state = get();
    const nextIdx = state.currentQuestionIndex + 1;

    if (nextIdx >= state.questions.length) {
      // Game over
      const winner = determineWinner(state.players);
      set({ screen: 'endScreen', winner });
      return;
    }

    const nextQ     = state.questions[nextIdx];
    const nextPhase = nextQ.phaseId;
    const currPhase = state.questions[state.currentQuestionIndex].phaseId;

    // Advance turn (individual mode) — FFF always stays all players
    const nextTurn = nextQ.ruleset.mode === 'fastest-finger'
      ? state.currentTurnPlayerIndex
      : (state.currentTurnPlayerIndex + 1) % 3;

    // New phase?
    if (nextPhase !== currPhase) {
      set({
        currentQuestionIndex: nextIdx,
        currentTurnPlayerIndex: nextTurn,
        buzzLock: null,
        selectedAnswer: null,
        answerResult: null,
        pendingMovement: null,
        gamePhase: 'phaseTransition',
        screen: 'phaseTransition',
        pendingPhaseId: nextPhase,
      });
    } else {
      // Start next question
      const q = state.questions[nextIdx];
      set({
        currentQuestionIndex: nextIdx,
        currentTurnPlayerIndex: nextTurn,
        buzzLock: null,
        selectedAnswer: null,
        answerResult: null,
        pendingMovement: null,
        gamePhase: 'question',
        timerActive: q.ruleset.timerSeconds > 0,
        timeLeft:    q.ruleset.timerSeconds,
      });
    }
  },

  // ── Start timer for current question ────────────────────────────────────────
  startTimer: () => {
    const state = get();
    const q = state.questions[state.currentQuestionIndex];
    if (q.ruleset.timerSeconds > 0) {
      set({ timerActive: true, timeLeft: q.ruleset.timerSeconds });
    }
  },

  tickTimer: () => {
    set((state) => {
      if (!state.timerActive) return {};
      const next = state.timeLeft - 1;
      if (next <= 0) {
        return { timerActive: false, timeLeft: 0 };
      }
      return { timeLeft: next };
    });
  },

  // ── Reset ───────────────────────────────────────────────────────────────────
  resetGame: () => set({
    ...initialState,
    players: [makePlayer(0,''), makePlayer(1,''), makePlayer(2,'')],
    questions: questionsData.questions,
    phases:    questionsData.phases,
    pregame:   questionsData.pregameSituation,
  }),
}));
