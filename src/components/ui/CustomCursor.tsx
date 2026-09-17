import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined') {
      isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    if (isTouchDevice.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, input, select, textarea, [role="button"], [role="progressbar"]');
        setIsHovered(!!interactive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (isTouchDevice.current || !isVisible) return null;

  return (
    <>
      {/* Outer Follower Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-100 ease-out hidden md:block"
        style={{
          transform: `translate3d(${pos.x - (isHovered ? 24 : 16)}px, ${pos.y - (isHovered ? 24 : 16)}px, 0)`,
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
          borderRadius: '50%',
          border: isHovered ? '1.5px solid #356DFF' : '1px solid rgba(8, 11, 16, 0.25)',
          backgroundColor: isHovered ? 'rgba(53, 109, 255, 0.08)' : 'transparent',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s',
        }}
      />
      {/* Center Precision Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block"
        style={{
          transform: `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: isHovered ? '#356DFF' : '#080B10',
          transition: 'background-color 0.15s',
        }}
      />
    </>
  );
}
