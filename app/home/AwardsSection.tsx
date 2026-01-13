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
        // SAFETY FIX: If we have fewer than 6 images, duplicate them logic-side
        // so the marquee is never too short for wide screens.
        let finalData = response || [];
        if (finalData.length > 0 && finalData.length < 6) {
             finalData = [...finalData, ...finalData, ...finalData]; 
        }
        setData(finalData);
      }).catch((error) => {
        console.error('Error fetching award images:', error);
      });
  }, [])

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">

      <BackgroundGrid
        color="rgba(0, 0, 0, 0.05)"
        cellSize={40}
        className="z-0"
      />

      <div className="relative z-10 container mx-auto px-4 mb-12 text-center">
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
      <div className="relative z-10 w-full overflow-hidden">

        {/* Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-20 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />

        {/* The Sliding Track */}
        {/* We use a wrapper to ensure flex behavior works efficiently */}
        <div className="marquee-wrapper select-none flex">
          
          <div className="marquee-track flex gap-8 md:gap-16 py-8">
            
            {/* 1. First Set */}
            {data.map((src: any, idx) => (
              <img
                key={`set1-${idx}`}
                src={IMAGE_URL + src.image}
                alt={`Award recognition ${idx + 1}`}
                className="flex-shrink-0 w-[180px] h-[80px] object-cover rounded-[10px] cursor-pointer transition-all duration-500 hover:scale-110"
              />
            ))}

            {/* 2. Second Set (Exact Duplicate) */}
            {data.map((src: any, idx) => (
              <img
                key={`set2-${idx}`}
                src={IMAGE_URL + src?.image}
                alt={`Award recognition ${idx + 1}`}
                className="flex-shrink-0 w-[180px] h-[80px] object-cover rounded-[10px] cursor-pointer transition-all duration-500 hover:scale-110"
              />
            ))}

          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        .marquee-track {
          display: flex;
          /* Ensure the track is wide enough to hold children horizontally */
          width: max-content;
          /* IMPORTANT: Move exactly -50% to create a perfect loop with 2 sets */
          animation: scroll 40s linear infinite;
        }
        
        /* Pause on hover */
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Move exactly half the width (the length of one full set) */
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}