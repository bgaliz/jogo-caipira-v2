'use client';

import { motion } from 'framer-motion';

type Pose = 'idle' | 'climbing' | 'falling';

interface Props {
  step: number;
  pose: Pose;
}

const POLE_TOP_Y = 60;
const POLE_BOTTOM_Y = 490;
const TOTAL_STEPS = 10;

function getY(step: number) {
  return POLE_BOTTOM_Y - (step / TOTAL_STEPS) * (POLE_BOTTOM_Y - POLE_TOP_Y);
}

function IdleCharacter() {
  return (
    <g>
      {/* Head */}
      <circle cx="0" cy="-28" r="10" fill="#FDBCB4" stroke="#333" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="-3" cy="-30" r="1.5" fill="#333" />
      <circle cx="3" cy="-30" r="1.5" fill="#333" />
      {/* Smile */}
      <path d="M-3,-25 Q0,-22 3,-25" fill="none" stroke="#333" strokeWidth="1.2" />
      {/* Hat (chapéu de palha) */}
      <ellipse cx="0" cy="-38" rx="12" ry="3" fill="#D4A017" />
      <rect x="-7" y="-45" width="14" height="9" rx="3" fill="#D4A017" />
      {/* Body */}
      <rect x="-7" y="-18" width="14" height="18" rx="2" fill="#E53935" />
      {/* Arms hugging pole */}
      <path d="M-7,-12 Q-14,-10 -10,-5" fill="none" stroke="#FDBCB4" strokeWidth="4" strokeLinecap="round" />
      <path d="M7,-12 Q14,-10 10,-5" fill="none" stroke="#FDBCB4" strokeWidth="4" strokeLinecap="round" />
      {/* Legs */}
      <path d="M-3,0 L-5,16" stroke="#1565C0" strokeWidth="5" strokeLinecap="round" />
      <path d="M3,0 L5,16" stroke="#1565C0" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function ClimbingCharacter() {
  return (
    <g>
      {/* Head */}
      <circle cx="0" cy="-28" r="10" fill="#FDBCB4" stroke="#333" strokeWidth="1.5" />
      {/* Eyes wide open (effort) */}
      <circle cx="-3" cy="-30" r="2" fill="#333" />
      <circle cx="3" cy="-30" r="2" fill="#333" />
      {/* Determined mouth */}
      <path d="M-3,-25 L3,-25" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      {/* Sweat drop */}
      <ellipse cx="8" cy="-35" rx="2" ry="3" fill="#88CCFF" opacity="0.8" />
      {/* Hat tilted */}
      <ellipse cx="2" cy="-38" rx="12" ry="3" fill="#D4A017" transform="rotate(8)" />
      <rect x="-5" y="-45" width="14" height="9" rx="3" fill="#D4A017" transform="rotate(8)" />
      {/* Body */}
      <rect x="-7" y="-18" width="14" height="18" rx="2" fill="#E53935" />
      {/* Arms reaching up */}
      <path d="M-7,-14 Q-16,-20 -12,-28" fill="none" stroke="#FDBCB4" strokeWidth="4" strokeLinecap="round" />
      <path d="M7,-14 Q16,-20 12,-28" fill="none" stroke="#FDBCB4" strokeWidth="4" strokeLinecap="round" />
      {/* Legs bent */}
      <path d="M-3,0 Q-8,8 -5,16" stroke="#1565C0" strokeWidth="5" strokeLinecap="round" />
      <path d="M3,0 Q8,8 5,16" stroke="#1565C0" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function FallingCharacter() {
  return (
    <g transform="rotate(45)">
      {/* Head */}
      <circle cx="0" cy="-28" r="10" fill="#FDBCB4" stroke="#333" strokeWidth="1.5" />
      {/* Eyes as X (shocked) */}
      <line x1="-5" y1="-32" x2="-2" y2="-29" stroke="#333" strokeWidth="1.5" />
      <line x1="-5" y1="-29" x2="-2" y2="-32" stroke="#333" strokeWidth="1.5" />
      <line x1="2" y1="-32" x2="5" y2="-29" stroke="#333" strokeWidth="1.5" />
      <line x1="2" y1="-29" x2="5" y2="-32" stroke="#333" strokeWidth="1.5" />
      {/* Open mouth */}
      <ellipse cx="0" cy="-23" rx="3" ry="4" fill="#333" />
      {/* Hat flying off */}
      <ellipse cx="12" cy="-45" rx="10" ry="2.5" fill="#D4A017" transform="rotate(-20 12 -45)" />
      <rect x="7" y="-52" width="12" height="8" rx="3" fill="#D4A017" transform="rotate(-20 12 -48)" />
      {/* Body */}
      <rect x="-7" y="-18" width="14" height="18" rx="2" fill="#E53935" />
      {/* Arms flailing out */}
      <path d="M-7,-10 L-20,-5" stroke="#FDBCB4" strokeWidth="4" strokeLinecap="round" />
      <path d="M7,-10 L20,-5" stroke="#FDBCB4" strokeWidth="4" strokeLinecap="round" />
      {/* Legs flailing */}
      <path d="M-3,0 L-10,14" stroke="#1565C0" strokeWidth="5" strokeLinecap="round" />
      <path d="M3,0 L10,14" stroke="#1565C0" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

export function PoleCharacter({ step, pose }: Props) {
  const y = getY(step);

  return (
    <motion.g
      animate={{ y }}
      transition={
        pose === 'falling'
          ? { type: 'tween', ease: 'easeIn', duration: 0.7 }
          : { type: 'spring', stiffness: 130, damping: 16 }
      }
    >
      {pose === 'idle' && <IdleCharacter />}
      {pose === 'climbing' && <ClimbingCharacter />}
      {pose === 'falling' && <FallingCharacter />}
    </motion.g>
  );
}
