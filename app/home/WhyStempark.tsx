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

const AUTOPLAY_INTERVAL = 5000; // 5 Seconds

export default function WhyStempark() {
  const [data, setData] = useState([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    apiFetch('/stempark-features')
      .then((response) => {
        setData(response);
        // Set initial active ID once data is loaded
        if (response && response.length > 0) {
            setActiveId(response[0]._id);
        }
      })
      .catch(() => {
        console.log('Failed to fetch stempark features.');
      });
  }, [])

  // --- Auto-Play Logic ---
  useEffect(() => {
    if (isPaused || data.length === 0) return;

    const timer = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = data.findIndex((f: any) => f._id === currentId);
        const nextIndex = (currentIndex + 1) % data.length;
        return data?.[nextIndex]?.['_id'];
      });
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, activeId, data.length]);

  // Don't render until we have data or handle loading state if preferred
  if (data.length === 0) return null; 

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
          // UPDATED: 'lg:h-[600px]' fixes height on desktop, mobile uses 'h-auto' to stack naturally
          className="flex flex-col lg:flex-row w-full gap-4 lg:h-[600px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {data.map((feature: any) => {
            const isActive = activeId === feature._id;
            let Icon: any = feature.icon;
            if (typeof Icon === 'string') {
              const ICON_MAP: Record<string, any> = { Cpu, Gamepad2, Microscope, Zap, ArrowRight, Sparkles, ChevronDown };
              Icon = ICON_MAP[Icon] ?? Cpu;
            }

            return (
              <motion.div
                layout // Smooth layout transitions
                key={feature._id}
                onClick={() => setActiveId(feature._id)}
                // UPDATED: Allow click interaction on mobile AND desktop
                className={cn(
                  "relative overflow-hidden rounded-3xl cursor-pointer border transition-all duration-500",
                  // MOBILE STYLES: Active gets large height, Inactive gets small height (header only)
                  isActive ? "h-[550px] lg:h-auto" : "h-[80px] lg:h-auto",
                  // DESKTOP STYLES: Flex-grow logic
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
                      <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-card relative z-20 h-[50%] md:h-full">
                        <div>
                          <div className="flex items-center gap-4 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                              <Icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className="text-[10px] md:text-xs font-bold px-2 py-1 bg-muted rounded text-muted-foreground uppercase tracking-wider">
                              {feature.stat}
                            </span>
                          </div>

                          <h3 className="text-xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
                            {feature.title}
                          </h3>
                          <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest mb-3 md:mb-4">
                            {feature.subtitle}
                          </p>

                          <p className="text-muted-foreground leading-relaxed text-sm md:text-base line-clamp-3 md:line-clamp-none">
                            {feature.description}
                          </p>
                        </div>

                        <div className="mt-4 md:mt-0">
                          <button className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors group">
                            Explore Zone
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>

                        {/* === PROGRESS TIMER BAR === */}
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
                      <div className="w-full md:w-3/5 h-[50%] md:h-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-card via-transparent to-transparent z-10" />
                        <img
                          src={IMAGE_URL + feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover transition-transform duration-[5000ms] scale-105"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>


                {/* === INACTIVE STATE LABEL (Visible when NOT active) === */}
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
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Mobile: Horizontal Header Bar */}
                  {/* This ensures user sees the title to click on mobile */}
                  <div className="lg:hidden w-full h-full flex items-center justify-between px-6 bg-muted/10">
                    <div className="flex items-center gap-4">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-base font-bold text-foreground">{feature.title}</span>
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