"use client"

import React, { useEffect, useState, useMemo } from 'react'

const CircuitBackground = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate paths only once to ensure consistency during renders
  // We use useMemo so the "random" lines don't jump around if the component updates
  const { traces, busLines } = useMemo(() => {
    const tracesArray = Array.from({ length: 60 }).map((_, i) => {
      const startX = ((i * 97) % 1440)
      const startY = ((i * 67) % 900)
      const length = 80 + ((i * 10) % 400)
      const direction = i % 2 === 0 ? 1 : -1
      const thickness = i % 7 === 0 ? 2 : (i % 3 === 0 ? 1.5 : 1)
      const isAccent = i % 5 === 0 // 20% of lines are accent colors
      
      const d = `
        M ${startX} ${startY} 
        L ${startX} ${startY + length * 0.2} 
        L ${startX + (40 * direction)} ${startY + length * 0.2 + 40} 
        L ${startX + (40 * direction)} ${startY + length}
        h ${30 * direction}
      `
      return { id: i, d, thickness, isAccent, startX, startY }
    })

    const busArray = Array.from({ length: 12 }).map((_, groupIndex) => {
      const groupX = ((groupIndex * 200) % 1300) + 50
      const groupY = ((groupIndex * 150) % 800) + 50
      const isVertical = groupIndex % 2 === 0
      const lines = Array.from({ length: 6 }).map((__, lineIndex) => {
        const offset = lineIndex * 10
        const points = isVertical
          ? `${groupX + offset},${groupY} ${groupX + offset},${groupY + 80} ${groupX + offset + 30},${groupY + 110} ${groupX + offset + 30},${groupY + 200}`
          : `${groupX},${groupY + offset} ${groupX + 80},${groupY + offset} ${groupX + 110},${groupY + offset + 30} ${groupX + 200},${groupY + offset + 30}`
        return { id: lineIndex, points }
      })
      return { id: groupIndex, lines }
    })

    return { traces: tracesArray, busLines: busArray }
  }, [])

  if (!mounted) return null

  return (
    // Uses var(--background) to automatically switch between white/black based on theme
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[var(--background)] transition-colors duration-300">
      
      <style jsx>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 1200; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        /* Use tokens and will-change for better performance and consistency */
        .circuit-path {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: drawLine var(--anim-deco) ease-out forwards;
          will-change: stroke-dashoffset, opacity;
        }
        .circuit-node {
          animation: pulse calc(var(--anim-deco) * 1.5) ease-in-out infinite;
          will-change: opacity, transform;
        }
        /* Respect reduced motion user preference */
        @media (prefers-reduced-motion: reduce) {
          .circuit-path, .circuit-node { animation: none !important; opacity: 1 !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>

      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 1. Dot Grid Pattern using muted theme color */}
          <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" className="fill-[var(--foreground)] opacity-[0.05]" />
          </pattern>
          
          {/* 2. Vignette Mask: Fades the circuit out at edges for a cleaner look */}
          <mask id="fade-mask">
            <radialGradient id="fade-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="60%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="black" stopOpacity="0" />
            </radialGradient>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#fade-grad)" />
          </mask>
        </defs>

        {/* Base Grid Layer */}
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* The Circuit Layer with Mask Applied */}
        <g mask="url(#fade-mask)">
          
          {/* 1. Data Buses (Subtle Background Lines) */}
          {busLines.map((group) => (
            <g key={`bus-${group.id}`}>
              {group.lines.map((line, idx) => (
                <polyline
                  key={`bus-line-${group.id}-${line.id}`}
                  points={line.points}
                  fill="none"
                  strokeWidth="1"
                  strokeLinejoin="round"
                  // Uses standard border color for subtlety
                  className="stroke-[var(--border)] opacity-20"
                />
              ))}
            </g>
          ))}

          {/* 2. Active Traces (Main Circuitry) */}
          {traces.map((trace) => {
            // Logic: Accent lines use Primary theme color, others use Foreground
            const colorClass = trace.isAccent 
              ? "stroke-[var(--primary)] opacity-60" 
              : "stroke-[var(--foreground)] opacity-10";

            return (
              <g key={`trace-${trace.id}`}>
                {/* The Line */}
                <path
                  d={trace.d}
                  strokeWidth={trace.thickness}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`circuit-path ${colorClass}`}
                  style={{ animationDelay: `${trace.id * 0.05}s` }}
                />
                
                {/* The "Node" or "Solder Point" at the start (Adds professionalism) */}
                <circle
                  cx={trace.startX}
                  cy={trace.startY}
                  r={trace.isAccent ? 3 : 1.5}
                  className={`circuit-node ${trace.isAccent ? "fill-[var(--primary)]" : "fill-[var(--foreground)]"} opacity-40`}
                />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default CircuitBackground