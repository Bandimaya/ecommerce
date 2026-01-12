'use client';

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { apiFetch } from '@/lib/axios';

/**
 * MOCK DATA
 * In your actual project, you can keep this in a separate file, 
 * but for this single-file demo, it is defined here.
 */
const TESTIMONIALS = [
  {
    quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    name: "Sarah Chen",
    designation: "Product Manager at TechFlow",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4", // Mock video URL
  },
  {
    quote: "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: "Michael Rodriguez",
    designation: "CTO at InnovateSphere",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
    video: "https://www.w3schools.com/html/movie.mp4", // Mock video URL
  },
  {
    quote: "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
    name: "Emily Watson",
    designation: "Operations Director at CloudScale",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  }
];

// --- Sub-component: AnimatedTestimonials ---

const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: typeof TESTIMONIALS;
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setIsPlaying(false);
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
  };

  // Stop video when changing slides
  useEffect(() => {
    setIsPlaying(false);
  }, [active]);

  useEffect(() => {
    if (autoplay && !isPlaying) {
      const interval = setInterval(handleNext, 7000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext, isPlaying]);

  return (
    <div className="max-w-sm md:max-w-5xl mx-auto antialiased px-4 py-10">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Side: Media Display */}
        <div className="relative h-[450px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 border-4 border-white">
                {isPlaying ? (
                  <div className="relative h-full w-full">
                    <video
                      ref={videoRef}
                      src={testimonials[active].video}
                      className="h-full w-full object-cover"
                      controls
                      autoPlay
                    />
                    <button 
                      onClick={() => setIsPlaying(false)}
                      className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="relative h-full w-full group">
                    <img
                      src={testimonials[active]?.src}
                      alt={testimonials[active]?.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <button 
                        onClick={toggleVideo}
                        className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-2xl transform transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <Play className="fill-current ml-1" size={32} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Textual Content */}
        <div className="flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 mb-1">
                {testimonials[active]?.name}
              </h3>
              <p className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-8">
                {testimonials[active]?.designation}
              </p>
              
              <div className="relative">
                <Quote className="absolute -top-6 -left-8 w-16 h-16 text-slate-100 -z-10" />
                <p className="text-xl text-slate-600 leading-relaxed font-medium italic">
                  &ldquo;{testimonials[active]?.quote}&rdquo;
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex gap-6 mt-12">
            <button 
              onClick={handlePrev} 
              className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={24} />
            </button>
            <button 
              onClick={handleNext} 
              className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Main Export: ParentTestimonialsAnimated ---

export default function ParentTestimonialsAnimated() {
    const [parentTestimonials, setParentTestimonials] = React.useState<any[]>([]);

  useEffect(() => {
    apiFetch('/testimonials').then((data) => setParentTestimonials(data.filter((testimonial: any) => testimonial.testimonial_type === 'product'))).catch((err) => console.error(err));
  }, [])

  console.log(parentTestimonials)
  return (
    <section className="py-24 bg-[#fcfcfd] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        {/* --- Header Section --- */}
        <div className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Wall Of Love</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
        </div>      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            OUR <span className="text-orange-500">Happy Customers</span>
          </h2>
        </div>

        {/* Passing the local TESTIMONIALS constant */}
        <AnimatedTestimonials testimonials={parentTestimonials} autoplay={true} />
      </div>
    </section>
  );
}