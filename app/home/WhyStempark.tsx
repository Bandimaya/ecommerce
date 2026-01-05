'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Cpu, Gamepad2, Microscope, Zap, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { apiFetch } from '@/lib/axios';
import { IMAGE_URL } from '@/lib/constants';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data ---
const stemparkFeatures = [
  {
    id: 'robotics',
    title: 'Robotics Arena',
    subtitle: 'Build. Code. Compete.',
    description: 'A 5000 sq. ft. high-tech arena where students engineer combat bots and compete in national-level tournaments.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600',
    icon: Cpu,
    stat: '50+ Bots',
  },
  {
    id: 'vr-zone',
    title: 'VR Innovation Lab',
    subtitle: 'Immersive Learning',
    description: 'Step into the metaverse. Design 3D environments and explore complex space simulations in our state-of-the-art VR zone.',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?auto=format&fit=crop&q=80&w=1600',
    icon: Gamepad2,
    stat: '8K VR Tech',
  },
  {
    id: 'science',
    title: 'Quantum Hub',
    subtitle: 'Applied Physics',
    description: 'Move beyond textbooks. Witness levitation, chemical reactions, and quantum mechanics in action through hands-on experiments.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1600',
    icon: Microscope,
    stat: '100+ Demos',
  },
  {
    id: 'maker',
    title: 'The Maker Space',
    subtitle: 'Rapid Prototyping',
    description: 'An industrial-grade workshop equipped with 3D Printers, Laser Cutters, and CNC machines. Dream it, build it.',
    image: 'https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?auto=format&fit=crop&q=80&w=1600',
    icon: Zap,
    stat: 'Ind. Grade',
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 Seconds

export default function WhyStempark() {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiFetch('/stempark-features')
      .then((response) => {
        setData(response);
      })
      .catch(() => {
        // Fallback to static data on error
        console.log('Failed to fetch stempark features, using static data.');
      });
  }, [])
  const [activeId, setActiveId] = useState<string>(data?.[0]?.['_id']);
  const [isPaused, setIsPaused] = useState(false);

  // --- Auto-Play Logic ---
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = data.findIndex((f: any) => f._id === currentId);
        const nextIndex = (currentIndex + 1) % data.length;
        return data?.[nextIndex]?.['_id'];
      });
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, activeId]); // Restart timer when activeId changes manually or pause state changes

  return (
    <section className="relative w-full py-20 lg:py-28 bg-background overflow-hidden font-sans">

      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col h-full">

        {/* --- Header Section --- */}
        <div className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Why Choose us?</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
        </div>

        {/* --- Interactive Accordion --- */}
        <div
          className="flex flex-col lg:flex-row w-full gap-4 lg:h-[600px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {data.map((feature: any) => {
            const isActive = activeId === feature._id;

            return (
              <motion.div
                layout // Smooth layout transitions
                key={feature._id}
                onClick={() => setActiveId(feature._id)}
                onMouseEnter={() => window.innerWidth >= 1024 && setActiveId(feature._id)}
                className={cn(
                  "relative overflow-hidden rounded-3xl cursor-pointer border transition-all duration-500",
                  isActive
                    ? "lg:flex-[3] bg-card border-primary/20 shadow-2xl z-10"
                    : "lg:flex-[0.5] bg-muted/30 border-transparent hover:bg-muted/50"
                )}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >

                {/* === ACTIVE STATE CONTENT === */}
                <AnimatePresence mode="popLayout">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
                    >
                      {/* Left: Text */}
                      <div className="w-full md:w-2/5 p-8 flex flex-col justify-between bg-card relative z-20 h-[45%] md:h-full">
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                              <feature.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-muted rounded text-muted-foreground uppercase tracking-wider">
                              {feature.stat}
                            </span>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
                            {feature.title}
                          </h3>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                            {feature.subtitle}
                          </p>

                          <p className="text-muted-foreground leading-relaxed text-sm md:text-base line-clamp-3 md:line-clamp-none">
                            {feature.description}
                          </p>
                        </div>

                        <div className="mt-6 md:mt-0">
                          <button className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors group">
                            Explore Zone
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>

                        {/* === PROGRESS TIMER BAR === */}
                        {/* Only show if not paused (or you can keep it styled differently when paused) */}
                        {!isPaused && (
                          <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-primary z-30"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                          />
                        )}
                      </div>

                      {/* Right: Image */}
                      <div className="w-full md:w-3/5 h-[55%] md:h-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-card via-transparent to-transparent z-10" />
                        <img
                          src={IMAGE_URL + feature.image}
                          alt={feature.title}
                          // fill
                          className="object-cover transition-transform duration-[5000ms] scale-105"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>


                {/* === INACTIVE STATE LABEL === */}
                <div className={cn(
                  "absolute inset-0 flex transition-opacity duration-300 pointer-events-none",
                  isActive ? "opacity-0" : "opacity-100"
                )}>
                  {/* Desktop: Vertical Bar */}
                  <div className="hidden lg:flex flex-col items-center justify-center w-full h-full p-4">
                    <span className="text-lg font-bold text-muted-foreground [writing-mode:vertical-rl] rotate-180 tracking-widest uppercase whitespace-nowrap">
                      {feature.title}
                    </span>
                    <div className="mt-8 text-muted-foreground/40">
                      <feature.icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Mobile: Horizontal Bar (Header) */}
                  <div className="lg:hidden w-full h-[80px] flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                      <feature.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-lg font-bold text-foreground">{feature.title}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}   