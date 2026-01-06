"use client";

import React from 'react';
import HeaderLeadForm from './HeaderLeadForm';
import { ChevronRight, ShieldCheck, Star } from 'lucide-react'; 
import { motion } from 'framer-motion';

export default function HeroBanner() {
  return (
    <div className="relative w-full min-h-[600px] lg:h-[85vh] flex items-center overflow-hidden bg-[#0a0a0a]">

      {/* 1. Background Layer */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source
            media="(min-width:750px)"
            srcSet="https://images.avishkaar.cc/misc/shop/microdegree-page-banner.png"
          />
          <img
            loading="eager" 
            className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
            src="https://images.avishkaar.cc/misc/shop/microdegree-page-banner-mobile.png"
            alt="Microdegrees - Robotics and Coding for Kids"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/40 lg:to-transparent"></div>
        <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
      </div>

      {/* 2. Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 text-white space-y-8 text-center lg:text-left">

            {/* Trust Badge */}
            <div className="flex justify-center lg:justify-start items-center gap-3">
               <motion.div initial={{ width: 0 }} whileInView={{ width: '40px' }} className="h-[2px] bg-orange-500" />
               <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-orange-400">
                 India's Top Rated Robotics Platform
               </span>
               <motion.div initial={{ width: 0 }} whileInView={{ width: '40px' }} className="h-[2px] bg-orange-500" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Future Innovators <br className="hidden lg:block" />
              Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500">
                Nurtured Here
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Transform screen time into <span className="text-white border-b-2 border-orange-500">skill-building time</span>. Expert-led coding & robotics for ages 8-15.
            </p>

            {/* Feature Quick-Tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                <span>Certified Instructors</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                <span>4.8/5 Rating</span>
              </div>
            </div>

            {/* REMOVED: The mobile "HeaderLeadForm" block was deleted here.
               The form will now only render in the Right Column below.
            */}
          </div>

          {/* Right Column: Lead Form (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 justify-end w-full animate-fade-in-up">
            <div className="w-full max-w-md">
              <HeaderLeadForm />
            </div>
          </div>

        </div>
      </div>

      {/* Tailwind Custom Animations */}
      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate linear;
        }
      `}</style>
    </div>
  );
}