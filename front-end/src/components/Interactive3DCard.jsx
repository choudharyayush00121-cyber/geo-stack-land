import React, { useState, useRef } from 'react';

/**
 * Interactive3DCard
 * Provides a responsive 3D perspective tilt effect with specular glare and depth pop-out on hover.
 */
export default function Interactive3DCard({
  children,
  className = '',
  maxTilt = 10,
  scale = 1.02,
  glare = true,
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
  });
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 80%)'
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 2 - 1; // -1 to 1
    const yPercent = (y / rect.height) * 2 - 1; // -1 to 1

    const rotateX = -yPercent * maxTilt;
    const rotateY = xPercent * maxTilt;

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.1s ease-out'
    });

    if (glare) {
      const glareX = ((x / rect.width) * 100).toFixed(1);
      const glareY = ((y / rect.height) * 100).toFixed(1);
      setGlareStyle({
        opacity: 0.7,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(6, 182, 212, 0.22) 0%, rgba(255,255,255,0.06) 40%, transparent 80%)`
      });
    }
  };

  const handleMouseEnter = () => {
    setTransformStyle((prev) => ({
      ...prev,
      transition: 'transform 0.15s ease-out'
    }));
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
    });
    if (glare) {
      setGlareStyle((prev) => ({
        ...prev,
        opacity: 0
      }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={transformStyle}
      className={`relative preserve-3d group cursor-pointer ${className}`}
      {...props}
    >
      {/* 3D specular glare reflection */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-30 transition-opacity duration-300"
          style={glareStyle}
        />
      )}
      {children}
    </div>
  );
}
