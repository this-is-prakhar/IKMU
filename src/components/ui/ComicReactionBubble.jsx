import { motion, AnimatePresence } from 'framer-motion';

const REACTIONS = {
  correct: ['✨ Sahi Baat!', '🌟 Ekdum Correct!', '🥳 Wah Ustaad!', '💯 Mast!'],
  wrong:   ['😬 OOF!', '🐍 Aiyaiyai!', '😅 Yikes, Uncle!', '💀 Galti Ho Gayi!'],
  snake:   ['🐍 Saanp Ne Pakad Liya!', '😱 Arre Baap Re!'],
  ladder:  ['🪜 Seedhi Mili!', '🎉 Chhadh Gaye Upar!'],
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @param {{ type: 'correct'|'wrong'|'snake'|'ladder'|null, visible: boolean }} props
 */
export default function ComicReactionBubble({ type, visible }) {
  const text = type ? getRandom(REACTIONS[type] ?? REACTIONS.wrong) : '';

  return (
    <AnimatePresence>
      {visible && type && (
        <motion.div
          key={`${type}-${text}`}
          style={{
            position: 'absolute',
            top: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 300,
            background: type === 'correct' || type === 'ladder'
              ? 'linear-gradient(135deg, #2A7A1A, #3AA030)'
              : 'linear-gradient(135deg, #8B1A1A, #CC2222)',
            border: `4px solid ${type === 'correct' || type === 'ladder' ? '#F5C842' : '#FF6644'}`,
            borderRadius: '20px 20px 20px 4px',
            padding: '14px 28px',
            fontFamily: 'Cinzel, serif',
            fontWeight: 700,
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: '#FFF8E7',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
          initial={{ scale: 0, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 10, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        >
          {text}
          {/* Tail */}
          <div style={{
            position: 'absolute',
            bottom: -16,
            left: 24,
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '0px solid transparent',
            borderTop: `16px solid ${type === 'correct' || type === 'ladder' ? '#3AA030' : '#CC2222'}`,
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
