import React, { useMemo } from 'react';

const STAR_COUNT = 250;

const Starfield = () => {
  const stars = useMemo(() => {
    const result = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const size = 1 + Math.random() * 2;
      const isGold = Math.random() < 0.15;
      result.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: size,
        height: size,
        opacity: 0.3 + Math.random() * 0.7,
        animationDuration: `${2 + Math.random() * 4}s`,
        animationDelay: `${Math.random() * 4}s`,
        background: isGold ? 'rgba(255,215,0,0.9)' : '#fff',
      });
    }
    return result;
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="star-dot"
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.width,
            height: s.height,
            borderRadius: '50%',
            background: s.background,
            opacity: s.opacity,
            animationDuration: s.animationDuration,
            animationDelay: s.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;
