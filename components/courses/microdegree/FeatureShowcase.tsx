"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Play, Pause, ArrowRight } from "lucide-react";
import { stemMedia } from "../../../lib/Data"; 
import { cn } from "@/lib/utils";

const features = [
  { 
    title: "STEM Innovation Labs", 
    description: "State-of-the-art physical environments designed to foster creativity and scientific inquiry.", 
    highlight: "Innovation Labs", 
    link: "/innovation-labs",
    bgColor: "#f8fafc" // Slate 50
  },
  { 
    title: "AI & Robotics Kits", 
    description: "Proprietary hardware kits that bridge the gap between abstract coding and real-world robotics.", 
    highlight: "Hardware Kits", 
    link: "/shop",
    bgColor: "#eff6ff" // Blue 50
  },
  { 
    title: "Professional Certification", 
    description: "Every course completion is backed by industry-recognized STEMPARK global certifications.", 
    highlight: "Global Certifications", 
    link: "/certifications",
    bgColor: "#f0fdf4" // Emerald 50
  },
  { 
    title: "Advanced AI Curriculum", 
    description: "Learn Machine Learning and Data Science through our specialized age-appropriate pathways.", 
    highlight: "Machine Learning", 
    link: "/curriculum",
    bgColor: "#eef2ff" // Indigo 50
  },
  { 
    title: "Experiential Learning", 
    description: "Our 'Learn by Doing' philosophy ensures students build 21st-century problem-solving skills.", 
    highlight: "Learn by Doing", 
    link: "/about",
    bgColor: "#fff7ed" // Orange 50
  },
  { 
    title: "Future-Ready Mentors", 
    description: "Direct access to experts from the tech industry guiding students through complex projects.", 
    highlight: "Industry Experts", 
    link: "/mentors",
    bgColor: "#fdf2f8" // Pink 50
  },
];

export const FeatureShowcase = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <motion.div 
      animate={{ backgroundColor: features[activeIdx].bgColor }}
      transition={{ duration: 0.8, ease: "linear" }}
      className="w-full py-16 md:py-24 font-sans transition-colors duration-700"
    >
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            The STEMPARK <br />
            <span className="text-primary italic">Experience</span>
          </h2>
          <p className="text-slate-600 text-lg md:text-2xl max-w-2xl leading-relaxed">
            Empowering the next generation of innovators through integrated technology, 
            expert mentorship, and hands-on discovery.
          </p>
        </motion.div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 px-6 max-w-7xl mx-auto">
        
        {/* --- Left Column (Text Content) --- */}
        <div className="flex flex-col">
          {features.map((feature, idx) => (
            <ScrollItem 
                key={idx} 
                index={idx} 
                feature={feature} 
                setActiveIdx={setActiveIdx}
                media={stemMedia[idx]} 
            />
          ))}
        </div>

        {/* --- Right Column (Sticky Media) --- */}
        <div className="hidden md:block sticky top-[15%] h-[550px] w-full self-start">
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-[12px] border-white shadow-2xl bg-slate-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
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
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white p-5 rounded-full shadow-2xl">
                        {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
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
                
                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white/70 text-xs font-bold tracking-[0.4em] uppercase mb-2">
                    STEMPARK Advantage 0{activeIdx + 1}
                  </p>
                  <p className="text-white text-3xl font-black">{features[activeIdx].title}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ScrollItem = ({ feature, index, setActiveIdx, media }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (isInView) setActiveIdx(index);
  }, [isInView, index, setActiveIdx]);

  return (
    <motion.div 
      ref={ref} 
      className="flex flex-col justify-center py-12 md:py-20 min-h-auto md:min-h-[70vh]"
      animate={{ opacity: isInView ? 1 : 0.3, x: isInView ? 0 : -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn(
        "h-1.5 mb-8 transition-all duration-700",
        isInView ? "bg-primary w-24" : "bg-slate-300 w-12"
      )} />

      <span className="text-primary font-black text-2xl mb-4">0{index + 1}</span>
      <h3 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
        {feature.title}
      </h3>

      {/* Mobile Inline Media */}
      <div className="block md:hidden w-full aspect-video mb-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200 relative">
        {media?.type === 'video' ? (
             <video src={media.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        ) : (
            <img src={media?.url} alt={feature.title} className="w-full h-full object-cover" />
        )}
      </div>

      <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-10 max-w-lg">
        {feature.description.split(feature.highlight)[0]}
        <span className="text-slate-900 font-extrabold border-b-4 border-primary/20">
          {feature.highlight}
        </span>
        {feature.description.split(feature.highlight)[1]}
      </p>

      <a 
        href={feature.link} 
        className="group flex items-center gap-4 text-primary font-black text-xl uppercase tracking-widest"
      >
        <span>Discover More</span>
        <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowRight size={20} />
        </div>
      </a>
    </motion.div>
  );
};