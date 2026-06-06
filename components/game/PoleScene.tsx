'use client';

import { useEffect, useState } from 'react';
import { PoleBackground } from './PoleBackground';
import { PoleCharacter } from './PoleCharacter';
import { useGameStore } from '@/store/gameStore';

const POLE_TOP_Y = 60;
const POLE_BOTTOM_Y = 490;
const TOTAL_STEPS = 10;

export function PoleScene() {
  const phase = useGameStore((s) => s.phase);
  const step = useGameStore((s) => s.characterStep);
  const [pose, setPose] = useState<'idle' | 'climbing' | 'falling'>('idle');

  useEffect(() => {
    if (phase === 'CLIMBING') {
      setPose('climbing');
      const t = setTimeout(() => setPose('idle'), 700);
      return () => clearTimeout(t);
    }
    if (phase === 'FALLING') {
      setPose('falling');
    }
    if (phase === 'SHOWING_QUESTION' || phase === 'ANSWER_FEEDBACK' || phase === 'SHOWING_SPONSOR') {
      setPose('idle');
    }
    if (phase === 'WIN') {
      setPose('climbing');
    }
  }, [phase]);

  const notches = Array.from({ length: TOTAL_STEPS - 1 }, (_, i) => {
    const y = POLE_BOTTOM_Y - ((i + 1) / TOTAL_STEPS) * (POLE_BOTTOM_Y - POLE_TOP_Y);
    return y;
  });

  const trophyY = POLE_TOP_Y - 20;

  return (
    <div className="relative w-full h-full select-none">
      <svg
        viewBox="0 0 400 600"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <PoleBackground />

        {/* Pole shadow */}
        <ellipse cx="205" cy="524" rx="6" ry="3" fill="#000" opacity={0.3} />

        {/* Main pole */}
        <rect
          x="194"
          y={POLE_TOP_Y}
          width="12"
          height={POLE_BOTTOM_Y - POLE_TOP_Y}
          fill="url(#poleGrad2)"
          rx="2"
        />
        <defs>
          <linearGradient id="poleGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7B3F00" />
            <stop offset="40%" stopColor="#C67C3E" />
            <stop offset="70%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#7B3F00" />
          </linearGradient>
        </defs>

        {/* Grease shine streaks */}
        <rect x="197" y={POLE_TOP_Y + 20} width="2" height="60" fill="white" opacity={0.15} rx="1" />
        <rect x="201" y={POLE_TOP_Y + 40} width="1" height="40" fill="white" opacity={0.1} rx="1" />

        {/* Step notches */}
        {notches.map((y, i) => (
          <rect
            key={i}
            x="190"
            y={y - 1}
            width="20"
            height="2"
            fill={step > i + 1 ? '#FFD700' : '#5c3010'}
            opacity={0.5}
            rx="1"
          />
        ))}

        {/* Trophy at top */}
        <g transform={`translate(200, ${trophyY})`}>
          <text fontSize="22" textAnchor="middle" y="8" style={{ filter: 'drop-shadow(0 0 4px #FFD700)' }}>
            🏆
          </text>
        </g>

        {/* Character — translated to pole center x=200 */}
        <g transform="translate(200, 0)">
          <PoleCharacter step={step} pose={pose} />
        </g>

        {/* Step counter bubbles on right */}
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const bubbleY =
            POLE_BOTTOM_Y - (i / TOTAL_STEPS) * (POLE_BOTTOM_Y - POLE_TOP_Y) - (POLE_BOTTOM_Y - POLE_TOP_Y) / TOTAL_STEPS / 2;
          const active = i < step;
          return (
            <g key={i}>
              <circle cx="235" cy={bubbleY} r="8" fill={active ? '#FFD700' : '#333'} opacity={0.8} />
              <text
                x="235"
                y={bubbleY + 4}
                textAnchor="middle"
                fontSize="9"
                fill={active ? '#333' : '#888'}
                fontWeight="bold"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
