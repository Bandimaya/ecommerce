'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

export default function StemParkShowcase() {
  const [activeIndex, setActiveIndex] = useState(0); // Initialize at 0 for dynamic lists
  const [isMobile, setIsMobile] = useState(false);
  const [videoList, setVideoList] = useState<string[]>([]); // Define type if TS, otherwise []
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    setLoading(true);
    apiFetch('/videos')
      .then((data) => {
        // Ensure we are extracting the ID correctly. Adjust 'youtubeId' if your API key is different
        const ids = Array.isArray(data) ? data.map((video: any) => video.youtubeId) : [];
        setVideoList(ids);
      })
      .catch((err) => {
        console.error("Failed to fetch videos:", err);
        setVideoList([]); // Fallback to empty
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Responsive Check ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Keyboard Navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (videoList.length === 0) return; // Guard clause
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoList.length]); // Add dependency

  const handleNext = useCallback(() => {
    if (videoList.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % videoList.length);
  }, [videoList.length]);

  const handlePrev = useCallback(() => {
    if (videoList.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + videoList.length) % videoList.length);
  }, [videoList.length]);

  // --- 3D Logic: Updated to use dynamic videoList.length ---
  const getCardProps = (index: number) => {
    const length = videoList.length;
    if (length === 0) return { state: "exitLeft", zIndex: 0 };

    let offset = (index - activeIndex) % length;
    
    // Handle wrap-around logic for negative/positive large numbers
    if (offset > length / 2) offset -= length;
    if (offset < -length / 2) offset += length;

    if (offset === 0) return { state: "center", zIndex: 50 };
    if (offset === -1) return { state: "left", zIndex: 40 };
    if (offset === 1) return { state: "right", zIndex: 40 };
    if (offset === -2) return { state: "farLeft", zIndex: 30 };
    if (offset === 2) return { state: "farRight", zIndex: 30 };
    
    // Any card further away than 2 spots goes to "exit"
    if (offset > 2) return { state: "exitRight", zIndex: 10 };
    return { state: "exitLeft", zIndex: 10 };
  };

  const variants: Variants = {
    center: {
      x: 0, scale: 1, opacity: 1, rotateY: 0, filter: "brightness(1)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      zIndex: 50,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 }
    },
    left: {
      x: -340, scale: 0.85, opacity: 0.9, rotateY: 15, filter: "brightness(0.7)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
      zIndex: 40,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 }
    },
    right: {
      x: 340, scale: 0.85, opacity: 0.9, rotateY: -15, filter: "brightness(0.7)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
      zIndex: 40,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 }
    },
    farLeft: {
      x: -620, scale: 0.7, opacity: 0.6, rotateY: 30, filter: "brightness(0.5)",
      boxShadow: "none",
      zIndex: 30,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 }
    },
    farRight: {
      x: 620, scale: 0.7, opacity: 0.6, rotateY: -30, filter: "brightness(0.5)",
      boxShadow: "none",
      zIndex: 30,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 }
    },
    exitLeft: {
      x: -900, scale: 0.5, opacity: 0, rotateY: 45, filter: "brightness(0)",
      zIndex: 10,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 }
    },
    exitRight: {
      x: 900, scale: 0.5, opacity: 0, rotateY: -45, filter: "brightness(0)",
      zIndex: 10,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 }
    }
  };

  return (
    <section className="relative w-full py-24 overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backgroundColor: 'var(--primary)' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-10 blur-[120px]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-[100%]">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-6"
          >
            <div className="h-[2px] w-12 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Innovation Gallery</span>
            <div className="h-[2px] w-12 bg-primary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4"
          >
            STEM Park <span className="text-primary">Real Results.</span>
          </motion.h2>
        </div>

        {/* --- DESKTOP 3D CAROUSEL --- */}
        {!isMobile ? (
          loading ? (
            <div className="relative h-[650px] w-full flex items-center justify-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-[340px] aspect-[9/16] rounded-[2.5rem] bg-foreground border-[6px] border-foreground overflow-hidden m-4">
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black shadow-inner">
                    <Skeleton className="w-full h-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative h-[650px] w-full flex items-center justify-center perspective-[1500px]">
              {videoList.length > 0 ? (
                <>
                  {videoList.map((id, index) => {
                    const { state, zIndex } = getCardProps(index);
                    const isActive = state === "center";

                    return (
                      <motion.div
                        key={`${id}-${index}`} // Use index in key if IDs might duplicate, otherwise just id
                        variants={variants}
                        initial="exitRight"
                        animate={state}
                        className="absolute w-[340px] aspect-[9/16] rounded-[2.5rem] bg-foreground border-[6px] border-foreground overflow-hidden cursor-pointer"
                        style={{ zIndex, transformStyle: "preserve-3d" }}
                        onClick={() => {
                          const offset = (index - activeIndex) % videoList.length;
                          // Ensure we only click visible neighbors
                          if (Math.abs(offset) <= 2) setActiveIndex(index);
                        }}
                      >
                        <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black shadow-inner">
                          <iframe
                            className={`w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            src={`https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&controls=1&showinfo=0`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                          />
                          {!isActive && <div className="absolute inset-0 z-20 bg-transparent" />}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-40 pointer-events-none rounded-[2rem]" />
                        </div>
                      </motion.div>
                    );
                  })}
                  <div className="absolute top-1/2 left-8 md:left-24 -translate-y-1/2 z-50">
                    <button
                      onClick={handlePrev}
                      className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-2xl flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all active:scale-95"
                    >
                      <ChevronLeft size={32} />
                    </button>
                  </div>
                  <div className="absolute top-1/2 right-8 md:right-24 -translate-y-1/2 z-50">
                    <button
                      onClick={handleNext}
                      className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-2xl flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all active:scale-95"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground">No videos available.</div>
              )}
            </div>
          )
        ) : (

          /* --- MOBILE VIEW --- */
          <div className="flex flex-col items-center justify-center w-full px-4">
            <div className="relative w-full max-w-[340px] aspect-[9/16] z-20">
              {loading ? (
                <div className="absolute inset-0 bg-foreground rounded-[2.5rem] p-2 shadow-2xl border-4 border-muted">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : videoList.length > 0 ? (
                <AnimatePresence mode="popLayout" custom={activeIndex}>
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 100, scale: 0.9, rotate: 5 }}
                    animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, x: -100, scale: 0.9, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute inset-0 bg-foreground rounded-[2.5rem] p-2 shadow-2xl border-4 border-muted"
                  >
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black">
                      <iframe
                        className="w-full h-full object-cover"
                        // FIX: Used videoList instead of videos
                        src={`https://www.youtube.com/embed/${videoList[activeIndex]}?modestbranding=1&rel=0&controls=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex items-center justify-center h-full border rounded-[2.5rem]">No videos</div>
              )}
            </div>

            <div className="flex gap-8 mt-8 z-20">
              <button
                onClick={handlePrev}
                disabled={videoList.length === 0}
                className="w-16 h-16 rounded-full shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-300 active:scale-95 bg-white text-slate-900 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={handleNext}
                disabled={videoList.length === 0}
                className="w-16 h-16 rounded-full shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-300 active:scale-95 bg-white text-slate-900 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="https://www.youtube.com/@Avishkaar/shorts"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all"
          >
            View Channel
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}