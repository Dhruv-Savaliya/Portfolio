import React, { useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { sound } from '../../lib/audio';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  magneticStrength?: number;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  target?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  magneticStrength = 0.35,
  variant = 'primary',
  href,
  target,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { tension: 350, friction: 25 },
  }));

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    api.start({ x: deltaX, y: deltaY, scale: 1.04 });
  };

  const handleMouseEnter = () => {
    sound.playHover();
  };

  const handleMouseLeave = () => {
    api.start({ x: 0, y: 0, scale: 1 });
  };

  const handleClick = () => {
    sound.playClick();
    if (onClick) onClick();
  };

  const variantStyles = {
    primary: 'bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]',
    secondary: 'bg-white/5 text-slate-200 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 hover:text-white',
    ghost: 'text-slate-400 hover:text-cyan-400 bg-transparent',
  };

  const content = (
    <animated.div
      ref={buttonRef}
      style={{
        transform: scale.to((s) => `translate3d(${x.get()}px, ${y.get()}px, 0) scale(${s})`),
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full cursor-pointer transition-colors duration-200 select-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </animated.div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
};
