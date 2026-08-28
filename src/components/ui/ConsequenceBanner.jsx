import { motion, AnimatePresence } from 'framer-motion';

/**
 * Consequence narrative bridge banner.
 * Slides in from left (comic caption style), holds, then exits.
 *
 * @param {{ text: string, visible: boolean }} props
 */
export default function ConsequenceBanner({ text, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: 0,
            right: 0,
            zIndex: 250,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
          initial={{ x: '-110%', skewX: '-6deg', opacity: 0 }}
          animate={{ x: 0, skewX: '0deg', opacity: 1 }}
          exit={{ x: '110%', skewX: '6deg', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 28 }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(26,108,88,0.97), rgba(13,76,60,0.97))',
            border: '3px solid #F5C842',
            borderLeft: '8px solid #F5C842',
            borderRight: '8px solid #F5C842',
            borderRadius: '4px',
            padding: '14px 32px',
            maxWidth: '70vw',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,248,231,0.1)',
          }}>
            {/* Caption label */}
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#F5C842',
              marginBottom: 6,
              opacity: 0.85,
            }}>
              ◆ MEANWHILE… ◆
            </div>
            {/* Consequence text */}
            <div style={{
              fontFamily: 'Crimson Text, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
              lineHeight: 1.5,
              color: '#FFF8E7',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}>
              "{text}"
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
