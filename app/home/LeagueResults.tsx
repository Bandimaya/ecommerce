'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Trophy, School, ChevronLeft, ChevronRight, Award, Quote } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { apiFetch } from '@/lib/axios';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data ---
const winnersData = [
  {
    id: 1,
    team: 'KIWI KIDS ROBOS',
    event: 'IRC League 2024',
    position: 'Grand Winner',
    school: 'Kiwi Kids Academy, Jaipur',
    image: 'https://images.avishkaar.cc/misc/community/cl24/irc-p-1.jpg',
    category: 'Primary',
    description: "Displaying exceptional logic and teamwork, Kiwi Kids Robos dominated the primary category with their innovative autonomous solutions."
  },
  {
    id: 2,
    team: 'CIRCUIT CELL',
    event: 'IRC League 2024',
    position: 'First Runner Up',
    school: 'Robo Learner',
    image: 'https://images.avishkaar.cc/misc/community/cl24/irc-p-2-1.jpeg',
    category: 'Primary',
    description: "Circuit Cell impressed the judges with a highly efficient robot design that navigated the complex arena with remarkable speed."
  },
  {
    id: 3,
    team: 'TECH TITANS',
    event: 'IRC League 2024',
    position: 'Grand Winner',
    school: 'Kidshala',
    image: 'https://images.avishkaar.cc/misc/community/cl24/irc-m-1.JPG',
    category: 'Middle',
    description: "True to their name, the Tech Titans showcased a robust engineering marvel that cleared all obstacles in record time."
  },
  {
    id: 4,
    team: 'AIRVISOR',
    event: 'Makeathon 2024',
    position: 'Grand Winner',
    school: 'Amrita Kairali Vidya Bhavan',
    image: 'https://images.avishkaar.cc/misc/community/cl24/am-s-1.jpeg',
    category: 'Senior',
    description: "Airvisor's project stood out for its real-world applicability, blending advanced coding with practical mechanical design."
  },
  {
    id: 5,
    team: 'ROYAL ROGERS',
    event: 'Gaming League 2024',
    position: 'Grand Winner',
    school: 'Independent Entry',
    image: 'https://images.avishkaar.cc/misc/community/cl24/temp-winners.png',
    category: 'Junior',
    description: "Dominating the digital arena, Royal Rogers showcased superior strategy and quick reflexes to claim the top gaming title."
  },
];

export default function LeagueResults() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    apiFetch('/winners')
      .then((response) => {
        // Assuming response.data contains the winners array
        setData(response);
      })
      .catch(() => {
        // Fallback to static data on error
        console.log('Using static data due to fetch error.');
      });
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) === data.length ? 0 : prev + 1);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 < 0 ? data.length - 1 : prev - 1));
  };

  const currentWinner: any = data?.[currentIndex];

  // --- Animation Config ---
  const smoothTransition = {
    duration: 0.5,
    ease: "easeInOut"
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, x: -20, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      filter: 'blur(5px)',
      transition: { duration: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 600 : -600, // Comes from right on next, left on prev
      opacity: 0,
      scale: 0.9,
      zIndex: 0
    }),
    center: {
      zIndex: 10,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 600 : -600, // Exits opposite to entry
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }),
  };

  return (
    // "Plain Grey" professional background using Tailwind's gray-50
    <section className="relative w-full min-h-[850px] flex items-center justify-center overflow-hidden py-16 md:py-24 font-sans bg-gray-50 text-slate-900">

      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col justify-center items-center gap-3 mb-10 sm:mb-16">
          <div className="flex items-center gap-3">
            <motion.div initial={{ width: 0 }} whileInView={{ width: '40px' }} className="h-[2px] bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">League Results</span>
            <motion.div initial={{ width: 0 }} whileInView={{ width: '40px' }} className="h-[2px] bg-primary" />
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-center text-slate-900 mt-2 max-w-2xl leading-tight">
            Winners of India's Global Robotics <br className="hidden md:block" /> & STEM Challenge
          </h2>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-24">

          {/* --- RIGHT SIDE CONTENT (Image Stack) --- */}
          {/* Order-first on mobile to show image first */}
          <div className="order-first lg:order-last flex-1 w-full flex flex-col items-center">

            {/* Image Stack */}
            <div className="relative w-full flex items-center justify-center perspective-[1200px] min-h-[300px] md:min-h-[480px]">
              {/* 3. Back Card (Stack visual) */}
              <div className="absolute w-full max-w-[650px] aspect-[16/10] bg-white rounded-[1.5rem] -z-20 -rotate-[4deg] -translate-x-4 translate-y-6 border border-gray-200 shadow-sm overflow-hidden opacity-60">
                {/* Plain opacity, no fancy blends */}
                <img src={data?.[(currentIndex + 2) % data.length]?.['image']} alt="" className="w-full h-full object-cover grayscale" />
              </div>

              {/* 2. Middle Card (Stack visual) */}
              <div className="absolute w-full max-w-[650px] aspect-[16/10] bg-white rounded-[1.5rem] -z-10 rotate-[3deg] translate-x-4 translate-y-3 border border-gray-200 shadow-md overflow-hidden opacity-80">
                <img src={data?.[(currentIndex + 1) % data.length]?.['image']} alt="" className="w-full h-full object-cover" />
              </div>

              {/* 1. Main Card (Animated) */}
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  // Solid white bg, crisp border, professional shadow
                  className="absolute w-full max-w-[650px] aspect-[16/10] bg-white p-2 rounded-[1.5rem] shadow-xl border border-gray-100 cursor-grab active:cursor-grabbing origin-bottom"
                >
                  <div className="relative w-full h-full rounded-[1.2rem] overflow-hidden bg-gray-100">
                    <img src={currentWinner?.image} alt={currentWinner?.team} className="w-full h-full object-cover" />

                    {/* Gradient for text readability only */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* SOLID Tag (No Glass/Blur) */}
                    <div className="absolute top-4 left-4 px-4 py-2 bg-white rounded-full text-[11px] font-bold uppercase tracking-widest text-slate-900 shadow-md flex items-center gap-2 border border-gray-100">
                      <Quote className="w-3 h-3 text-primary" />
                      {currentWinner?.category}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls (Bottom of Image) */}
            <div className="flex items-center gap-6 mt-10 md:mt-14">
              <button
                onClick={handlePrev}
                className="group w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary hover:shadow-md transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {data.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="group w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary hover:shadow-md transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>

          {/* --- LEFT SIDE CONTENT (Text Info) --- */}
          <div className="order-last lg:order-first flex-1 w-full max-w-lg text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6 md:space-y-8"
              >
                {/* Header Tag */}
                <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="h-[2px] w-10 bg-primary"></div>
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500">
                    Hall of Fame
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  {currentWinner?.team}
                </motion.h1>

                {/* Plain Bold Text Position */}
                <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-2 text-primary">
                  <Trophy className="w-6 h-6" />
                  <h3 className="text-xl md:text-2xl font-bold">
                    {currentWinner?.position}
                  </h3>
                </motion.div>

                {/* Description Paragraph */}
                <motion.p variants={itemVariants} className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                  {currentWinner?.description}
                </motion.p>

                {/* Details Footer */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 md:gap-12 pt-6 justify-center lg:justify-start border-t border-gray-200 mt-2">
                  <div className="flex items-start gap-3 text-left">
                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                      <School className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Organization</p>
                      <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">{currentWinner?.school}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-left">
                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Event</p>
                      <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">{currentWinner?.event}</p>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}