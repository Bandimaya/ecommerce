'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Cpu, Gamepad2, Microscope, Zap, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { apiFetch } from '@/lib/axios';
import { IMAGE_URL } from '@/lib/constants';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AUTOPLAY_INTERVAL = 5000;

// --- Animation Variants ---
const contentVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5, 
      staggerChildren: 0.1,
      delayChildren: 0.2 
    }
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.7, ease: "easeOut" } 
  }
};

export default function WhyStempark() {
  const [data, setData] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    apiFetch('/stempark-features')
      .then((response) => {
        setData(response);
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

  if (data.length === 0) return null; 

  return (
    <section className="relative w-full py-12 md:py-20 lg:py-28 bg-background overflow-hidden font-sans">

      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col h-full">

        {/* --- Header Section --- */}
        <div className="flex justify-center items-center gap-3 mb-8 md:mb-16">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary" style={{fontSize: 'xx-large'}}>Why Choose us?</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
        </div>

        {/* --- Interactive Accordion --- */}
        <div
          className="flex flex-col lg:flex-row w-full gap-4 lg:h-[600px]"
          // Pausing auto-play when user interacts (hovers container)
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {data.map((feature: any) => {
            const isActive = activeId === feature._id;
            let Icon: any = feature.icon;
            
            // Dynamic Icon Resolution
            if (typeof Icon === 'string') {
              const ICON_MAP: Record<string, any> = { Cpu, Gamepad2, Microscope, Zap, ArrowRight, Sparkles, ChevronDown };
              Icon = ICON_MAP[Icon] ?? Cpu;
            }

            return (
              <motion.div
                layout // Enables the smooth width animation
                key={feature._id}
                
                // --- EVENTS ---
                // Desktop: Expand on Hover
                onMouseEnter={() => setActiveId(feature._id)}
                // Mobile: Expand on Click
                onClick={() => setActiveId(feature._id)}
                
                className={cn(
                  "relative overflow-hidden rounded-3xl cursor-pointer border transition-colors duration-300",
                  // Mobile Height Logic - Increased height for active state to accommodate reordering
                  isActive ? "h-[600px] lg:h-auto" : "h-[70px] lg:h-auto",
                  // Desktop Flex Logic (handled by layout prop, but classes set base styles)
                  isActive
                    ? "lg:flex-[3] bg-card border-primary/20 shadow-xl lg:shadow-2xl z-10"
                    : "lg:flex-[0.5] bg-muted/30 border-transparent hover:bg-muted/50"
                )}
                // --- SMOOTH SPRING TRANSITION ---
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 25,
                  mass: 0.5
                }}
              >

                {/* === ACTIVE STATE CONTENT === */}
                <AnimatePresence mode="popLayout">
                  {isActive && (
                    <div className="absolute inset-0 w-full h-full flex flex-col md:flex-row">
                      
                      {/* Left: Text Content (Mobile: Bottom Order) */}
                      <motion.div 
                        className="w-full md:w-2/5 h-[65%] md:h-full p-6 md:p-10 flex flex-col justify-between bg-card relative z-20 border-r border-border/50 order-last md:order-first overflow-y-auto md:overflow-visible scrollbar-hide"
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="space-y-3 md:space-y-4">
                          <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold px-3 py-1 bg-muted rounded-full text-muted-foreground uppercase tracking-wider border border-border/50">
                                {feature.stat || "Feature"}
                                </span>
                            </div>
                          </motion.div>

                          <div className="space-y-1 md:space-y-2">
                            <motion.p variants={itemVariants} className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
                                {feature.subtitle}
                            </motion.p>
                            <motion.h3 variants={itemVariants} className="text-xl md:text-2xl lg:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
                                {feature.title}
                            </motion.h3>
                          </div>

                          <motion.div variants={itemVariants} className="w-12 h-1 bg-primary/20 rounded-full" />

                          <motion.p variants={itemVariants} className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium">
                            {feature.description}
                          </motion.p>
                        </div>

                        {/* Functional Explore Button */}
                        <motion.div variants={itemVariants} className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border/50">
                          <Link 
                            href={`/home/features/${feature._id}`}
                            onClick={(e) => e.stopPropagation()} // Prevent triggering parent click
                            className="inline-flex items-center justify-center w-full md:w-auto gap-3 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
                          >
                            Explore This Zone
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </motion.div>

                        {/* Progress Bar */}
                        {!isPaused && (
                          <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-primary z-30"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                          />
                        )}
                      </motion.div>

                      {/* Right: Image (Mobile: Top Order) */}
                      <div className="w-full md:w-3/5 h-[35%] md:h-full relative overflow-hidden bg-muted group order-first md:order-last">
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-card/80 via-transparent to-transparent z-10 pointer-events-none" />
                        <motion.img
                          variants={imageVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                          src={IMAGE_URL + feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-110"
                        />
                        
                        {/* Image Overlay Badge */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
                            className="absolute top-4 right-4 md:top-6 md:right-6 z-20 bg-black/30 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-medium flex items-center gap-2"
                        >
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            <span>Featured Zone</span>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>


                {/* === INACTIVE STATE LABEL === */}
                <div className={cn(
                  "absolute inset-0 flex transition-all duration-500 pointer-events-none",
                  isActive ? "opacity-0" : "opacity-100 delay-100"
                )}>
                  {/* Desktop: Vertical Bar */}
                  <div className="hidden lg:flex flex-col items-center justify-center w-full h-full p-4 group-hover:bg-muted/50 transition-colors">
                    <span className="text-lg font-bold text-muted-foreground [writing-mode:vertical-rl] rotate-180 tracking-widest uppercase whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity">
                      {feature.title}
                    </span>
                    <div className="mt-8 text-muted-foreground/40 group-hover:text-primary transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Mobile: Horizontal Header Bar */}
                  <div className="lg:hidden w-full h-full flex items-center justify-between px-6 bg-muted/10">
                    <div className="flex items-center gap-4">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-bold text-foreground">{feature.title}</span>
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