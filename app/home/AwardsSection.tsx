'use client';

import { useEffect, useState } from 'react';
// Adjust the path to where you saved the component
import BackgroundGrid from '../home/marqueeBackground/BackgroundGrid';
import { apiFetch } from '@/lib/axios';

// --- Data: Reliable Award Images from Unsplash ---
const AWARD_IMAGES = [
  "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=400", // Golden Trophy
  "https://images.unsplash.com/photo-1614036417651-7913396db871?auto=format&fit=crop&q=80&w=400", // Gold Medal
  "https://images.unsplash.com/photo-1565514020176-dbf22384914e?auto=format&fit=crop&q=80&w=400", // Winning Cup
  "https://images.unsplash.com/photo-1590071089561-2087ff8f9871?auto=format&fit=crop&q=80&w=400", // Podium
  "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=400", // Star Award
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=400", // Runner / Sport
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=400", // Achievement
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400", // Writing/Certificate
  "https://images.unsplash.com/photo-1565514020176-dbf22384914e?auto=format&fit=crop&q=80&w=400", // Cup
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400", // Team Success
];

export default function AwardsSection() {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    apiFetch('/award-images')
      .then((response) => {
        setData(response);
      }).catch((error) => {
        console.error('Error fetching award images:', error);
      });
  }, [])
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">

      {/* --- REPLACEMENT: Background Component --- */}
      <BackgroundGrid
        color="rgba(0, 0, 0, 0.05)" // Or "var(--border-color)"
        cellSize={40}
        className="z-0"
      />

      <div className="relative z-10 container mx-auto px-4 mb-12 text-center">

        {/* Header Section */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">
            Shining Globally
          </h2>
          <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
            Honored for Excellence in AI & Innovation Labs, Robotics Kits & STEM Learning
          </p>
          <div className="w-24 h-1.5 bg-indigo-500 mx-auto rounded-full mt-6 opacity-80"></div>
        </div>

      </div>

      {/* Marquee Slider Container */}
      <div className="relative z-10 w-full">

        {/* Gradient Fades for Smooth Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />

        {/* The Sliding Track */}
        <div className="marquee-container flex overflow-hidden select-none">
          <div className="marquee-track flex gap-8 md:gap-16 py-8">

            {/* 1. First Set */}
            {data.map((src: any, idx) => (
              <div
                key={`set1-${idx}`}
                className="relative group flex-shrink-0 flex items-center justify-center w-[180px] md:w-[240px] aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-100"
              >
                <img
                  src={src.image}
                  alt={`Award recognition ${idx + 1}`}
                  // Removed 'filter grayscale' and 'opacity-80' to maintain full color
                  className="w-full h-full object-contain mix-blend-multiply transition-all duration-500"
                />
              </div>
            ))}

            {/* 2. Second Set */}
            {data.map((src: any, idx) => (
              <div
                key={`set2-${idx}`}
                className="relative group flex-shrink-0 flex items-center justify-center w-[180px] md:w-[240px] aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-100"
              >
                <img
                  src={src?.image}
                  alt={`Award recognition ${idx + 1}`}
                  // Removed 'filter grayscale' and 'opacity-80' to maintain full color
                  className="w-full h-full object-contain mix-blend-multiply transition-all duration-500"
                />
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        /* --- Marquee Logic --- */
        .marquee-track {
          width: max-content;
          animation: scroll 40s linear infinite;
        }
        
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}