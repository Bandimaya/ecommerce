"use client";
import React from 'react';
import { motion } from 'framer-motion';

const ProfessionalLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--background)] transition-colors duration-500 z-[9999]">
      <div className="relative flex flex-col items-center">
        
        {/* Hardware-Accelerated Loader Container */}
        <div className="relative w-16 h-16 mb-6">
          
          {/* Static Track - Low opacity ring for depth */}
          <div className="absolute inset-0 rounded-full border-[3px] border-[var(--muted)] opacity-20" />

          {/* High-Performance Spinner */}
          <motion.div
            className="absolute inset-0 rounded-full border-[3px] border-t-[var(--primary)] border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ willChange: "transform" }} // Forces GPU acceleration
          />

          {/* Secondary Fluid Ring - Google Style */}
          <motion.div
            className="absolute inset-2 rounded-full border-[2px] border-t-transparent border-r-[var(--primary-light)] border-b-transparent border-l-transparent opacity-60"
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ willChange: "transform" }}
          />

          {/* Center Glow Pulse */}
          <motion.div 
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[var(--primary)] blur-md opacity-20"
          />
        </div>

        {/* Brand Text with Staggered Entrance */}
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-lg font-semibold tracking-[0.2em] text-[var(--foreground)]"
          >
            STEM<span className="text-[var(--primary)]">PARK</span>
          </motion.h1>
        </div>

        {/* Minimalist Subtext */}
        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-2 text-[10px] uppercase font-medium tracking-[0.3em] text-[var(--foreground)] opacity-60"
        >
          Loading Assets
        </motion.p>
      </div>

      {/* Ultra-Light Background Orbs (No Blur to save performance) */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[var(--primary)] rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[var(--primary-light)] rounded-full mix-blend-multiply filter blur-3xl" />
      </div>
    </div>
  );
};

export default ProfessionalLoader;