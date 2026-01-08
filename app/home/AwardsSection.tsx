'use client';

import { useEffect, useState } from 'react';
// Adjust the path to where you saved the component
import BackgroundGrid from './marqueeBackground/BackgroundGrid';
import { apiFetch } from '@/lib/axios';
import { IMAGE_URL } from '@/lib/constants';

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
                // UPDATED: Fixed dimensions w-[180px] h-[80px], no padding, rounded-[10px]
                className="relative group flex-shrink-0 flex items-center justify-center w-[180px] h-[80px] bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-100"
              >
                <img
                  src={IMAGE_URL + src.image}
                  alt={`Award recognition ${idx + 1}`}
                  // UPDATED: w-full h-full object-cover to fill entire card with no space
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
              </div>
            ))}

            {/* 2. Second Set */}
            {data.map((src: any, idx) => (
              <div
                key={`set2-${idx}`}
                // UPDATED: Fixed dimensions w-[180px] h-[80px], no padding, rounded-[10px]
                className="relative group flex-shrink-0 flex items-center justify-center w-[180px] h-[80px] bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-100"
              >
                <img
                  src={IMAGE_URL + src?.image}
                  alt={`Award recognition ${idx + 1}`}
                  // UPDATED: w-full h-full object-cover to fill entire card with no space
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
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
            /* Adjusted calculation to account for half width + gap adjustment */
            transform: translateX(calc(-50% - 2rem));
          }
        }
      `}</style>
    </section>
  );
}