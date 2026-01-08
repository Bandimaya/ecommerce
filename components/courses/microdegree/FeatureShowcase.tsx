"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Play, Pause, ArrowRight } from "lucide-react";
import { stemMedia } from "../../../lib/Data"; // Ensure this path is correct
import { cn } from "@/lib/utils";

// 1. Added hex codes for smooth Framer Motion color interpolation
const features = [
  { 
    title: "Elite Hardware", 
    description: "Learn using the #1 Best Robotics and Coding Kits in the industry.", 
    highlight: "Robotics & Coding Kits", 
    link: "https://home.avishkaar.cc/shop",
    bgColor: "#f8fafc" // Slate 50
  },
  { 
    title: "Personalized Learning", 
    description: "Choose from personalized 1-1 or small group (1-4) sessions to fit your child's style.", 
    highlight: "Tailored Sessions", 
    link: "https://www.avishkaar.cc/courses",
    bgColor: "#eff6ff" // Blue 50
  },
  { 
    title: "Expert Mentorship", 
    description: "Learn from expert instructors with a minimum 5+ years of hands-on experience.", 
    highlight: "5+ Years Experience", 
    link: "https://www.avishkaar.cc/about-us",
    bgColor: "#eef2ff" // Indigo 50
  },
  { 
    title: "Lifetime Knowledge", 
    description: "Get lifetime access to all the study material online, anytime, anywhere.", 
    highlight: "Study Material", 
    link: "https://community.avishkaar.cc/projects",
    bgColor: "#fff7ed" // Orange 50
  },
  { 
    title: "Global Recognition", 
    description: "Earn STEM.org accredited certificates and regular report cards to track growth.", 
    highlight: "Accredited Certificates", 
    link: "https://stem.org/authenticated/",
    bgColor: "#f0fdf4" // Emerald 50
  },
  { 
    title: "Hands-on Projects", 
    description: "Engage in hands-on projects that make learning fun and practical.", 
    highlight: "Hands-on", 
    link: "https://www.avishkaar.cc/projects",
    bgColor: "#fdf2f8" // Pink 50
  },
];

export const FeatureShowcase = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Desktop Video Autoplay Logic
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => console.log("Autoplay prevented"));
    }
  }, [activeIdx, isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    // Animate background color based on active index
    <motion.div 
      animate={{ backgroundColor: features[activeIdx].bgColor }}
      transition={{ duration: 0.8, ease: "linear" }}
      className="w-full py-16 md:py-24 font-sans transition-colors duration-700"
    >
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h2 className="text-4xl md:text-7xl font-bold text-slate-900 tracking-tighter mb-4">
            The Avishkaar <br />
            <span className="text-primary italic underline decoration-primary/30">Advantage</span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-xl">
            Everything your child needs to master STEM, robotics, and coding in one ecosystem.
          </p>
        </motion.div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 px-6 max-w-7xl mx-auto">
        
        {/* --- Left Column (Scrolling Content) --- */}
        <div className="flex flex-col gap-12 md:gap-0">
          {features.map((feature, idx) => (
            <ScrollItem 
                key={idx} 
                index={idx} 
                feature={feature} 
                setActiveIdx={setActiveIdx}
                media={stemMedia[idx]} // Pass media for Mobile rendering
            />
          ))}
        </div>

        {/* --- Right Column (Sticky Desktop Media) --- */}
        <div className="hidden md:block sticky top-[15%] h-[600px] w-full self-start">
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl bg-slate-100 transition-all duration-500">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {stemMedia[activeIdx]?.type === "video" ? (
                  <div className="relative w-full h-full cursor-pointer group" onClick={togglePlay}>
                    <video
                      ref={videoRef}
                      src={stemMedia[activeIdx].url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl">
                        {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={stemMedia[activeIdx]?.url}
                    alt={features[activeIdx].title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Desktop Floating Card */}
                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl">
                  <p className="text-white text-[10px] font-black tracking-[0.3em] uppercase mb-1 drop-shadow-sm">
                    Featured
                  </p>
                  <p className="text-white text-2xl font-bold drop-shadow-md">{features[activeIdx].title}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Sub Component ---

const ScrollItem = ({ feature, index, setActiveIdx, media }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) setActiveIdx(index);
  }, [isInView, index, setActiveIdx]);

  return (
    <motion.div 
      ref={ref} 
      className={cn(
        "flex flex-col justify-center transition-all duration-500 ease-out py-6 md:py-10",
        // On desktop, use min-h to enable scroll. On mobile, auto height is better.
        "min-h-auto md:min-h-[70vh]" 
      )}
      animate={{ opacity: isInView ? 1 : 0.4 }}
    >
      {/* Mobile: Top Divider */}
      <div className={cn(
        "w-12 h-1 mb-6 transition-all duration-500 md:w-16 md:mb-8",
        isInView ? "bg-primary w-20 md:w-24" : "bg-slate-300"
      )} />

      {/* Number & Title */}
      <span className="text-primary font-mono font-black text-xl md:text-2xl mb-2">0{index + 1}</span>
      <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
        {feature.title}
      </h3>

      {/* --- MOBILE ONLY: Inline Media Card --- */}
      <div className="block md:hidden w-full aspect-[4/3] mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-slate-100 relative group">
        {media?.type === 'video' ? (
             <video
             src={media.url}
             autoPlay
             loop
             muted
             playsInline
             className="w-full h-full object-cover"
           />
        ) : (
            <img src={media?.url} alt={feature.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
      </div>

      {/* Description */}
      <p className="text-lg md:text-2xl text-slate-600 leading-relaxed mb-6 md:mb-8 max-w-md">
        {feature.description.split(feature.highlight)[0]}
        <span className="text-slate-900 font-bold bg-white/50 px-1 rounded shadow-sm">
          {feature.highlight}
        </span>
        {feature.description.split(feature.highlight)[1]}
      </p>

      {/* Link */}
      <a 
        href={feature.link} 
        target="_blank"
        className="text-primary font-bold text-lg flex items-center gap-2 hover:gap-3 transition-all group/link w-fit"
      >
        <span>Explore</span>
        <div className="bg-primary/10 p-2 rounded-full group-hover/link:bg-primary/20 transition-colors">
            <ArrowRight size={18} />
        </div>
      </a>
    </motion.div>
  );
};