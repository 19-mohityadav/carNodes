import React, { useEffect, useRef, useState } from 'react';

/**
 * CSS 3D car orbit carousel.
 * — A real Renault Arkana image sits in the CENTER, tilted in 3D space.
 * — 4 SVG car silhouettes orbit around it on a 3D perspective ring.
 * — Hover pauses the rotation; click a silhouette to select that model.
 */

const CAR_SVGS = [
  {
    label: 'Audi R8 / Camry',
    color: '#B89B5E',
    svg: (
      <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M15 52 C18 44 28 32 48 28 C62 24 80 22 100 22 C120 22 140 24 158 30 C172 34 180 42 185 52 L185 58 L15 58 Z"
          fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M48 28 C55 24 68 18 85 16 C100 14 115 14 130 16 C145 18 158 24 166 28"
          stroke="currentColor" strokeWidth="1.5" fill="none" />
        <ellipse cx="48" cy="63" rx="14" ry="14" fill="#333" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="48" cy="63" rx="6" ry="6" fill="#888" />
        <ellipse cx="155" cy="63" rx="14" ry="14" fill="#333" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="155" cy="63" rx="6" ry="6" fill="#888" />
        <line x1="14" y1="58" x2="186" y2="58" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15 52 C12 54 10 57 10 58" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M185 52 C188 54 190 57 190 58" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    label: 'TT QUATTRO',
    color: '#3D5066',
    svg: (
      <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M20 54 C24 44 38 30 62 26 C78 22 95 21 112 22 C132 23 150 28 165 38 C175 44 180 50 182 54 L182 60 L20 60 Z"
          fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M62 26 C68 20 82 14 100 13 C118 12 135 16 148 24"
          stroke="currentColor" strokeWidth="1.5" fill="none" />
        <ellipse cx="52" cy="64" rx="13" ry="13" fill="#333" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="52" cy="64" rx="5.5" ry="5.5" fill="#888" />
        <ellipse cx="150" cy="64" rx="13" ry="13" fill="#333" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="150" cy="64" rx="5.5" ry="5.5" fill="#888" />
        <line x1="19" y1="60" x2="183" y2="60" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'RS LINE',
    color: '#444444',
    svg: (
      <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12 50 C16 40 30 26 55 22 C72 18 92 17 112 18 C138 19 162 24 175 36 C182 42 185 48 185 52 L185 58 L12 58 Z"
          fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M55 22 C60 18 72 12 95 11 C116 10 138 14 155 22"
          stroke="currentColor" strokeWidth="1.5" fill="none" />
        <ellipse cx="48" cy="62" rx="14" ry="14" fill="#222" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="48" cy="62" rx="5.5" ry="5.5" fill="#666" />
        <ellipse cx="158" cy="62" rx="14" ry="14" fill="#222" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="158" cy="62" rx="5.5" ry="5.5" fill="#666" />
        <line x1="11" y1="58" x2="186" y2="58" stroke="currentColor" strokeWidth="1.5" />
        <rect x="165" y="40" width="15" height="6" rx="2" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    label: 'GT500',
    color: '#FF3B30',
    svg: (
      <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M10 54 C14 44 26 32 50 27 C68 23 88 22 108 22 C132 22 158 26 174 36 C183 42 188 50 188 54 L188 60 L10 60 Z"
          fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M50 27 C56 22 68 16 90 14 C112 12 138 16 158 26"
          stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M10 54 C8 55 7 58 7 60" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M188 54 C190 55 191 58 191 60" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <ellipse cx="50" cy="64" rx="14" ry="14" fill="#111" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="50" cy="64" rx="5.5" ry="5.5" fill="#666" />
        <ellipse cx="160" cy="64" rx="14" ry="14" fill="#111" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="160" cy="64" rx="5.5" ry="5.5" fill="#666" />
        <line x1="9" y1="60" x2="189" y2="60" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function CarouselOrbit({ onSelectVehicle, activeIndex }) {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);
  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const rotRef = useRef(0);
  const floatRef = useRef(0);

  const CARS = CAR_SVGS.length;
  const RADIUS = 270;   // orbit radius (px)
  const SPEED = 0.016;  // degrees per ms
  const FLOAT_SPEED = 0.0018; // float oscillation speed

  useEffect(() => {
    const animate = (ts) => {
      const delta = lastRef.current ? ts - lastRef.current : 0;
      lastRef.current = ts;

      if (!isPaused) {
        rotRef.current = (rotRef.current + SPEED * delta) % 360;
        setRotation(rotRef.current);
      }

      // Always animate the float
      floatRef.current += FLOAT_SPEED * delta;
      setFloatOffset(Math.sin(floatRef.current) * 8);

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused]);

  const handleCarClick = (idx) => {
    const targetAngle = (360 / CARS) * idx;
    rotRef.current = -targetAngle;
    setRotation(-targetAngle);
    onSelectVehicle(idx);
  };

  return (
    <div
      className="relative w-full flex flex-col items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── OUTER PERSPECTIVE STAGE ── */}
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          height: 360,
          perspective: '1000px',
          perspectiveOrigin: '50% 52%',
          position: 'relative',
        }}
      >

        {/* ─────────────────────────────────
            CENTER: Central Web3 Node Emblem (No Car Photo)
        ───────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        </div>

        {/* ─────────────────────────────────
            ROTATING ORBIT RING
        ───────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transform: `rotateX(14deg) rotateY(${rotation}deg)`,
            zIndex: 10,
          }}
        >
          {/* Visible orbit ring disc */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: RADIUS * 2 + 8,
              height: RADIUS * 2 + 8,
              marginLeft: -(RADIUS + 4),
              marginTop: -(RADIUS + 4),
              borderRadius: '50%',
              border: '1.5px solid rgba(184,155,94,0.30)',
              boxShadow: '0 0 30px rgba(184,155,94,0.08)',
              transform: 'rotateX(90deg)',
              pointerEvents: 'none',
            }}
          />

          {/* Car silhouettes on the orbit */}
          {CAR_SVGS.map((car, idx) => {
            const angleStep = 360 / CARS;
            const angle = angleStep * idx;

            const normalizedRot = ((rotation % 360) + 360) % 360;
            const carWorldAngle = ((angle - normalizedRot) % 360 + 360) % 360;
            const isFront = carWorldAngle < 55 || carWorldAngle > 305;

            return (
              <div
                key={idx}
                onClick={() => handleCarClick(idx)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 196,
                  height: 88,
                  marginLeft: -98,
                  marginTop: -44,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    color: car.color,
                    opacity: isFront ? 1 : 0.38,
                    transform: isFront ? 'scale(1.15)' : 'scale(0.88)',
                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                    filter: isFront
                      ? `drop-shadow(0 8px 20px ${car.color}66)`
                      : 'none',
                  }}
                >
                  {car.svg}
                </div>

                {/* Label below silhouette */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: -22,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    opacity: isFront ? 1 : 0.35,
                    transition: 'opacity 0.35s',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isFront ? car.color : '#6E6259',
                    }}
                  >
                    {car.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ground shadow under the whole stage */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '65%',
            height: 26,
            borderRadius: '100%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      </div>

      {/* Hint text */}
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#6E6259',
          marginTop: 28,
        }}
      >
        {isPaused
          ? '● Click a model to select · Orbit paused'
          : '● Hover to pause · Click silhouette to select'}
      </p>
    </div>
  );
}