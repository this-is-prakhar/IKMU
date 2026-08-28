import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore.js';

import OpeningScreen       from './components/screens/OpeningScreen.jsx';
import PlayerSetupScreen   from './components/screens/PlayerSetupScreen.jsx';
import PregameStoryScreen  from './components/screens/PregameStoryScreen.jsx';
import PhaseTransitionCard from './components/screens/PhaseTransitionCard.jsx';
import GameBoardScreen     from './components/screens/GameBoardScreen.jsx';
import EndScreen           from './components/screens/EndScreen.jsx';

const SCREENS = {
  opening:         OpeningScreen,
  playerSetup:     PlayerSetupScreen,
  pregameStory:    PregameStoryScreen,
  phaseTransition: PhaseTransitionCard,
  playing:         GameBoardScreen,
  endScreen:       EndScreen,
};

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const Screen = SCREENS[screen] ?? OpeningScreen;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          style={{ position: 'absolute', inset: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Screen />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
