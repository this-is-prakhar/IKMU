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

  // Per-question player answers: { 0: 'A'|'B'|null, 1: 'A'|'B'|null, 2: 'A'|'B'|null }
  playerAnswers: { 0: null, 1: null, 2: null },
  activeAnsweringPlayer: 0, // In standard mode, which player is currently selecting

  // Buzz-in state (FFF mode)
  buzzLock: null,           // playerIndex who buzzed in, or null

  // Game-phase machine
  gamePhase: 'question',   // 'question'|'answerReveal'|'consequence'|'phaseTransition'

  // Results after question evaluation
  questionResults: [],      // Array of { playerIdx, answer, isCorrect, delta, movement }
  pendingMovements: [],     // Array of movement objects for pawn animation

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
    const state = get();
    const q = state.questions[state.currentQuestionIndex];
    set({
      screen: 'playing',
      gamePhase: 'question',
      playerAnswers: { 0: null, 1: null, 2: null },
      activeAnsweringPlayer: 0,
      buzzLock: null,
      timerActive: q.ruleset.timerSeconds > 0,
      timeLeft: q.ruleset.timerSeconds,
    });
  },

  // ── Set player choice ────────────────────────────────────────────────────────
  submitPlayerAnswer: (playerIdx, answer) => {
    const state = get();
    if (state.gamePhase !== 'question') return;

    const updatedAnswers = { ...state.playerAnswers, [playerIdx]: answer };
    const q = state.questions[state.currentQuestionIndex];
    const isFFF = q.ruleset.mode === 'fastest-finger';

    if (isFFF) {
      // In FFF mode, once the buzzed player submits, evaluate immediately
      set({ playerAnswers: updatedAnswers });
      get().evaluateQuestion(updatedAnswers);
    } else {
      // In standard mode, check if all 3 players answered
      const nextUnanswered = [0, 1, 2].find((i) => updatedAnswers[i] === null);
      set({
        playerAnswers: updatedAnswers,
        activeAnsweringPlayer: nextUnanswered !== undefined ? nextUnanswered : state.activeAnsweringPlayer,
      });

      if (nextUnanswered === undefined) {
        // All 3 players answered → evaluate!
        get().evaluateQuestion(updatedAnswers);
      }
    }
  },

  setActiveAnsweringPlayer: (idx) => set({ activeAnsweringPlayer: idx }),

  // ── FFF buzz-in ─────────────────────────────────────────────────────────────
  buzzIn: (playerIdx) => {
    const state = get();
    if (state.buzzLock !== null) return; // already locked
    if (state.gamePhase !== 'question') return;
    set({ buzzLock: playerIdx, activeAnsweringPlayer: playerIdx, timerActive: false });
  },

  // ── Evaluate question for all players ───────────────────────────────────────
  evaluateQuestion: (answersToUse) => {
    const state = get();
    const q = state.questions[state.currentQuestionIndex];
    const answers = answersToUse || state.playerAnswers;
    const isFFF = q.ruleset.mode === 'fastest-finger';

    const updatedPlayers = [...state.players];
    const questionResults = [];
    const pendingMovements = [];

    // Track previous leader
    const prevLead = state.players.reduce((a, b) => (a.position >= b.position ? a : b));

    if (isFFF) {
      // In FFF mode, only the buzzed player is evaluated
      const buzzedIdx = state.buzzLock;
      if (buzzedIdx !== null) {
        const pAnswer = answers[buzzedIdx];
        const isCorrect = pAnswer === q.correctOption;
        const delta = isCorrect ? q.ruleset.correctDelta : q.ruleset.wrongDelta;
        const result = isCorrect ? 'correct' : 'wrong';

        updatedPlayers[buzzedIdx] = applyScore(updatedPlayers[buzzedIdx], result, q.ruleset);
        const from = state.players[buzzedIdx].position;
        const movement = applyMovement(from, delta);
        updatedPlayers[buzzedIdx] = { ...updatedPlayers[buzzedIdx], position: movement.newPos };

        questionResults.push({ playerIdx: buzzedIdx, answer: pAnswer, isCorrect, delta, movement });
        pendingMovements.push({ playerIdx: buzzedIdx, ...movement });
      }
    } else {
      // Standard mode: evaluate all 3 players
      [0, 1, 2].forEach((idx) => {
        const pAnswer = answers[idx];
        const isCorrect = pAnswer === q.correctOption;
        const delta = pAnswer !== null
          ? (isCorrect ? q.ruleset.correctDelta : q.ruleset.wrongDelta)
          : q.ruleset.wrongDelta; // Unanswered treated as wrong
        const result = isCorrect ? 'correct' : 'wrong';

        updatedPlayers[idx] = applyScore(updatedPlayers[idx], result, q.ruleset);
        const from = state.players[idx].position;
        const movement = applyMovement(from, delta);
        updatedPlayers[idx] = { ...updatedPlayers[idx], position: movement.newPos };

        questionResults.push({ playerIdx: idx, answer: pAnswer, isCorrect, delta, movement });
        pendingMovements.push({ playerIdx: idx, ...movement });
      });
    }

    const newLead = updatedPlayers.reduce((a, b) => (a.position >= b.position ? a : b));
    const leaderChanged = newLead.id !== prevLead.id;

    // Check if anyone won
    const winnerPlayer = updatedPlayers.find((p) => p.position >= 81);

    set({
      players: updatedPlayers,
      gamePhase: 'answerReveal',
      questionResults,
      pendingMovements,
      timerActive: false,
      leaderChanged,
      prevLeaderId: prevLead.id,
      winner: winnerPlayer || state.winner,
    });
  },

  // ── Timer expired ───────────────────────────────────────────────────────────
  timerExpired: () => {
    const state = get();
    if (state.gamePhase !== 'question') return;
    // Auto-evaluate current answers (unanswered count as wrong)
    get().evaluateQuestion();
  },

  // ── Show consequence banner ──────────────────────────────────────────────────
  showConsequence: () => set({ gamePhase: 'consequence' }),

  // ── Advance to next question ─────────────────────────────────────────────────
  advanceQuestion: () => {
    const state = get();
    const nextIdx = state.currentQuestionIndex + 1;

    if (nextIdx >= state.questions.length || state.winner) {
      // Game over
      const winner = state.winner || determineWinner(state.players);
      set({ screen: 'endScreen', winner });
      return;
    }

    const nextQ     = state.questions[nextIdx];
    const nextPhase = nextQ.phaseId;
    const currPhase = state.questions[state.currentQuestionIndex].phaseId;

    if (nextPhase !== currPhase) {
      set({
        currentQuestionIndex: nextIdx,
        playerAnswers: { 0: null, 1: null, 2: null },
        activeAnsweringPlayer: 0,
        buzzLock: null,
        gamePhase: 'phaseTransition',
        screen: 'phaseTransition',
        pendingPhaseId: nextPhase,
      });
    } else {
      set({
        currentQuestionIndex: nextIdx,
        playerAnswers: { 0: null, 1: null, 2: null },
        activeAnsweringPlayer: 0,
        buzzLock: null,
        gamePhase: 'question',
        timerActive: nextQ.ruleset.timerSeconds > 0,
        timeLeft: nextQ.ruleset.timerSeconds,
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
