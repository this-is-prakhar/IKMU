import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PETALS = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 6 + Math.random() * 10,
  delay: Math.random() * 8,
  duration: 10 + Math.random() * 12,
  drift: (Math.random() - 0.5) * 120,
  rotate: Math.random() * 360,
  // Alternate between marigold petals (orange) and dust (cream)
  color: i % 3 === 0 ? '#F5C842' : i % 3 === 1 ? '#E86F1F' : '#FFF8E7',
}));

export default function ParticleLayer() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
      {PETALS.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '110%',
            width:  p.size,
            height: p.size * 1.4,
            borderRadius: '50% 50% 50% 10%',
            background: `radial-gradient(ellipse at 30% 30%, ${p.color}cc, ${p.color}44)`,
            boxShadow: `0 0 4px ${p.color}66`,
          }}
          animate={{
            y:       [0, -(window.innerHeight + 200)],
            x:       [0, p.drift],
            rotate:  [p.rotate, p.rotate + 540],
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay:    p.delay,
            repeat:   Infinity,
            ease:     'linear',
          }}
        />
      ))}
    </div>
  );
}
