'use client';

import React from 'react';
import Link from 'next/link';
import { motion, easeInOut } from 'framer-motion';

export default function NotFound() {
  // Animation variants for floating parts
  const floatVariants = (delay: number) => ({
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: easeInOut
      }
    }
  });

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] flex items-center justify-center relative overflow-hidden font-sans text-white">
      
      {/* --- BACKGROUND LAYER --- */}
      {/* Blueprint Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* Cosmic Nebula Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* --- 3D FLOATING SCENE --- */}
      <div className="relative flex flex-col items-center scale-75 md:scale-100">
        
        {/* Central 404 Component Stack */}
        <div className="relative z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-4 text-[12rem] font-black tracking-tighter leading-none"
          >
            {/* The "4" with Circuit Texture */}
            <motion.span variants={floatVariants(0)} initial="initial" animate="animate" 
               className="relative text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              4
              <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/circuit-board.png")' }} />
            </motion.span>

            {/* Central IoT Hub (The "0") */}
            <motion.div variants={floatVariants(0.5)} initial="initial" animate="animate" className="relative w-48 h-48">
                {/* Main CPU / PCB Circle */}
                <div className="absolute inset-0 border-4 border-cyan-500/50 rounded-lg bg-slate-900 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/microfab.png')] opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border-2 border-cyan-400 rounded-full animate-spin-slow flex items-center justify-center">
                            <div className="w-16 h-16 border-t-2 border-white rounded-full" />
                        </div>
                    </div>
                </div>
                {/* Floating Microchips attached to cables */}
                <div className="absolute -top-10 -right-10 w-12 h-12 bg-gray-800 border border-gray-600 rounded rotate-12 flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 bg-cyan-400/20 rounded-sm border border-cyan-400/40" />
                </div>
            </motion.div>

            {/* The Second "4" */}
            <motion.span variants={floatVariants(1)} initial="initial" animate="animate" 
               className="relative text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              4
            </motion.span>
          </motion.div>

          {/* Floating IoT Components Around the Text */}
          <motion.div variants={floatVariants(0.2)} initial="initial" animate="animate" className="absolute -left-32 top-0">
             <div className="w-16 h-16 bg-slate-800 border border-slate-600 rounded-lg shadow-xl flex items-center justify-center rotate-[-15deg]">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                </div>
             </div>
          </motion.div>

          {/* Floating Padlock (Security Component) */}
          <motion.div variants={floatVariants(0.8)} initial="initial" animate="animate" className="absolute -right-24 bottom-10 opacity-60 grayscale hover:grayscale-0 transition-all">
             <div className="w-14 h-14 bg-slate-700 border border-slate-500 rounded flex flex-col items-center pt-2">
                <div className="w-6 h-4 border-2 border-slate-400 rounded-t-full" />
                <div className="w-2 h-2 bg-slate-400 rounded-full mt-2" />
             </div>
          </motion.div>
        </div>

        {/* --- BOTTOM UI: ROBOT & STATUS --- */}
        <div className="mt-12 flex items-end gap-12 relative w-full justify-center">
            
            {/* The Helper Bot */}
            <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center"
            >
                <div className="w-24 h-16 bg-gradient-to-b from-orange-100 to-orange-300 rounded-2xl relative shadow-xl border-b-4 border-orange-400">
                    <div className="flex justify-center gap-4 pt-4">
                        <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" />
                        <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" />
                    </div>
                    {/* Antennas */}
                    <div className="absolute -top-4 left-4 w-1 h-4 bg-orange-300" />
                    <div className="absolute -top-4 right-4 w-1 h-4 bg-orange-300" />
                </div>
                {/* Robot Sign */}
                <div className="mt-2 bg-stone-800 px-4 py-2 border-2 border-stone-600 rotate-2 rounded shadow-lg">
                    <span className="text-[10px] font-mono text-stone-300 uppercase leading-none block">Lost Connection.</span>
                    <span className="text-[10px] font-mono text-stone-300 uppercase leading-none block">Our Bots Looking.</span>
                </div>
                {/* Robot Legs */}
                <div className="flex gap-8 mt-1">
                    <div className="w-2 h-4 bg-orange-400 rounded-full" />
                    <div className="w-2 h-4 bg-orange-400 rounded-full" />
                </div>
            </motion.div>

            {/* Error Message Glass Panel */}
            <div className="bg-cyan-500/5 backdrop-blur-md border border-cyan-500/20 p-4 rounded-lg transform -skew-x-6 shadow-2xl">
                <h3 className="text-red-500 font-mono text-xs mb-1 uppercase tracking-widest animate-pulse">Critical Error: Page_Not_Found</h3>
                <p className="text-cyan-100/60 text-[10px] max-w-[150px] font-mono leading-tight">
                    The requested IoT gateway is unresponsive. Signal lost in cyber-sector 7G.
                </p>
            </div>
        </div>

        {/* --- RETURN BUTTON --- */}
        <div className="mt-16">
          <Link href="/">
            <button className="relative group px-10 py-3 overflow-hidden rounded-full transition-all cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em] text-white">
                  Return to Home
                </span>
            </button>
          </Link>
        </div>

      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}