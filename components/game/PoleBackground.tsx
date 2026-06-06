'use client';

export function PoleBackground() {
  return (
    <svg
      viewBox="0 0 400 600"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D1B4E" />
          <stop offset="100%" stopColor="#1a3a8f" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d6a1f" />
          <stop offset="100%" stopColor="#1a4d0f" />
        </linearGradient>
        <linearGradient id="poleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7B3F00" />
          <stop offset="40%" stopColor="#C67C3E" />
          <stop offset="100%" stopColor="#8B4513" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="600" fill="url(#skyGrad)" />

      {/* Stars */}
      {[
        [30, 40], [80, 20], [150, 35], [220, 15], [290, 45], [350, 25],
        [60, 80], [180, 65], [320, 70], [390, 50], [10, 100], [240, 90],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.5} fill="white" opacity={0.7} />
      ))}

      {/* Bandeirolas (bunting flags) */}
      {Array.from({ length: 9 }).map((_, i) => {
        const colors = ['#FF3333', '#FFD700', '#00AA44', '#FF6600', '#AA00FF', '#00AAFF', '#FF3333', '#FFD700', '#00AA44'];
        const x1 = i * 50;
        const x2 = (i + 1) * 50;
        const midX = (x1 + x2) / 2;
        return (
          <g key={i}>
            <line x1={x1} y1={30} x2={x2} y2={30} stroke="#888" strokeWidth={1} opacity={0.6} />
            <polygon
              points={`${x1 + 2},30 ${x2 - 2},30 ${midX},52`}
              fill={colors[i]}
              opacity={0.9}
            />
          </g>
        );
      })}
      {/* Second row bandeirolas */}
      {Array.from({ length: 9 }).map((_, i) => {
        const colors = ['#00AAFF', '#FF3333', '#FFD700', '#00AA44', '#FF6600', '#AA00FF', '#00AAFF', '#FF3333', '#FFD700'];
        const x1 = i * 50 + 400;
        const x2 = (i + 1) * 50 + 400;
        const midX = (x1 + x2) / 2;
        return (
          <g key={i}>
            <line x1={x1 - 400} y1={55} x2={x2 - 400} y2={55} stroke="#888" strokeWidth={1} opacity={0.6} />
            <polygon
              points={`${x1 - 400 + 2},55 ${x2 - 400 - 2},55 ${midX - 400},77`}
              fill={colors[i]}
              opacity={0.8}
            />
          </g>
        );
      })}

      {/* Ground */}
      <rect x="0" y="520" width="400" height="80" fill="url(#groundGrad)" />
      {/* Grass blades */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={i}
          x1={i * 22 + 5}
          y1={520}
          x2={i * 22 + 8}
          y2={508}
          stroke="#3d8b2d"
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}

      {/* Dirt patch at pole base */}
      <ellipse cx="200" cy="525" rx="25" ry="8" fill="#6B4226" opacity={0.6} />
    </svg>
  );
}
