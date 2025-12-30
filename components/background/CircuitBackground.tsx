"use client"

import React from 'react'

const CircuitBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Internal CSS Styles for the animation */}
      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Base class for animated lines */
        .circuit-line {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: drawLine 4s ease-out forwards;
        }
      `}</style>

      <svg
        className="w-full h-full opacity-[0.9]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">
            {/* Use CSS variables for gradient */}
            <stop offset="0%" stopColor="var(--circuit-bg-start, #ffffff)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--circuit-bg-end, #f0fdf4)" stopOpacity="1" />
          </linearGradient>

          {/* Thinner, subtler grid pattern */}
          <pattern id="grid-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="var(--circuit-grid-color, #4ade80)" opacity="0.3" />
          </pattern>
        </defs>

        {/* 1. Base Background Textures */}
        <rect width="100%" height="100%" fill="url(#bg-gradient)" />
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* 2. Complex Traces */}
        {Array.from({ length: 80 }).map((_, i) => {
          const startX = ((i * 97) % 1440);
          const startY = ((i * 67) % 900);
          const length = 80 + ((i * 10) % 400);
          const direction = i % 2 === 0 ? 1 : -1;
          const thickness = i % 7 === 0 ? 2.5 : (i % 3 === 0 ? 1.5 : 1);
          
          // Use CSS variables with fallback values
          const color = i % 5 === 0 
            ? "var(--circuit-trace-color-1, #16a34a)" 
            : (i % 2 === 0 
              ? "var(--circuit-trace-color-2, #22c55e)" 
              : "var(--circuit-trace-color-3, #4ade80)");

          const d = `
            M ${startX} ${startY} 
            L ${startX} ${startY + length * 0.2} 
            L ${startX + (40 * direction)} ${startY + length * 0.2 + 40} 
            L ${startX + (40 * direction)} ${startY + length}
            h ${30 * direction}
          `;

          const animationDelay = `${(i * 0.05).toFixed(2)}s`;

          return (
            <path
              key={`trace-${i}`}
              d={d}
              stroke={color}
              strokeWidth={thickness}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
              className="circuit-line"
              style={{ animationDelay }}
            />
          )
        })}

        {/* 3. Data Buses */}
        {Array.from({ length: 15 }).map((_, groupIndex) => {
          const groupX = ((groupIndex * 200) % 1300) + 50;
          const groupY = ((groupIndex * 150) % 800) + 50;
          const isVertical = groupIndex % 2 === 0;
          
          return (
            <g key={`bus-${groupIndex}`}>
              {Array.from({ length: 8 }).map((__, lineIndex) => {
                const animationDelay = `${(groupIndex * 0.3 + lineIndex * 0.05).toFixed(2)}s`;
                const offset = lineIndex * 12;

                const points = isVertical 
                  ? `
                      ${groupX + offset},${groupY} 
                      ${groupX + offset},${groupY + 80} 
                      ${groupX + offset + 30},${groupY + 110}
                      ${groupX + offset + 30},${groupY + 250}
                    `
                  : `
                      ${groupX},${groupY + offset}
                      ${groupX + 80},${groupY + offset}
                      ${groupX + 110},${groupY + offset + 30}
                      ${groupX + 250},${groupY + offset + 30}
                    `;

                return (
                  <polyline
                    key={`bus-line-${groupIndex}-${lineIndex}`}
                    points={points}
                    fill="none"
                    stroke={groupIndex % 3 === 0 
                      ? "var(--circuit-bus-color-1, #22c55e)" 
                      : "var(--circuit-bus-color-2, #86efac)"}
                    strokeWidth="1.2"
                    opacity="0.5"
                    strokeLinejoin="round"
                    className="circuit-line"
                    style={{ animationDelay }}
                  />
                )
              })}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default CircuitBackground