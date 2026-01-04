"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Play, Pause, ExternalLink } from "lucide-react";
import { stemMedia } from "../../../lib/Data";
import { cn } from "@/lib/utils";

const features = [
  { title: "Elite Hardware", description: "Learn using the #1 Best Robotics and Coding Kits in the industry.", highlight: "Robotics & Coding Kits", link: "https://home.avishkaar.cc/shop" },
  { title: "Personalized Learning", description: "Choose from personalized 1-1 or small group (1-4) sessions to fit your child's style.", highlight: "Tailored Sessions", link: "https://www.avishkaar.cc/courses" },
  { title: "Expert Mentorship", description: "Learn from expert instructors with a minimum 5+ years of hands-on experience.", highlight: "5+ Years Experience", link: "https://www.avishkaar.cc/about-us" },
  { title: "Lifetime Knowledge", description: "Get lifetime access to all the study material online, anytime, anywhere.", highlight: "Study Material", link: "https://community.avishkaar.cc/projects" },
  { title: "Global Recognition", description: "Earn STEM.org accredited certificates and regular report cards to track growth.", highlight: "Accredited Certificates", link: "https://stem.org/authenticated/" },
  { title: "Hands-on Projects", description: "Engage in hands-on projects that make learning fun and practical.", highlight: "Hands-on", link: "https://www.avishkaar.cc/projects" },
];

export const FeatureShowcase = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force play when the active index changes or when isPlaying is toggled
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented
          console.log("Autoplay prevented by browser policy.");
        });
      }
    }
  }, [activeIdx, isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full bg-white py-20 font-sans selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-bold text-slate-900 tracking-tighter"
        >
          The Avishkaar <br />
          <span className="text-blue-600 italic underline decoration-blue-200">Advantage</span>
        </motion.h2>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col">
          {features.map((feature, idx) => (
            <ScrollItem 
                key={idx} 
                index={idx} 
                feature={feature} 
                setActiveIdx={setActiveIdx} 
            />
          ))}
        </div>

        {/* Right Sticky Media Container */}
        <div className="hidden md:block sticky top-[15%] h-[600px] w-full group">
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-[12px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-slate-100 transition-all duration-500">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {stemMedia[activeIdx]?.type === "video" ? (
                  <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
                    <video
                      ref={videoRef}
                      src={stemMedia[activeIdx].url}
                      autoPlay
                      loop
                      muted // Critical for autoplay
                      playsInline // Critical for iOS autoplay
                      className="w-full h-full object-cover"
                    />
                    {/* Control HUD */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                        {isPlaying ? <Pause size={32} className="text-slate-900" /> : <Play size={32} className="text-slate-900 ml-1" />}
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
                
                {/* Floating Info Card */}
                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl">
                    <p className="text-white text-[10px] font-black tracking-[0.3em] uppercase mb-1 drop-shadow-md">
                        Current Feature
                    </p>
                    <p className="text-white text-xl font-bold drop-shadow-md">{features[activeIdx].title}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScrollItem = ({ feature, index, setActiveIdx }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-48% 0px -48% 0px" });

  useEffect(() => {
    if (isInView) setActiveIdx(index);
  }, [isInView, index, setActiveIdx]);

  return (
    <motion.div 
      ref={ref} 
      animate={isInView ? { opacity: 1, x: 10 } : { opacity: 0.2, x: 0 }}
      className="min-h-[70vh] flex flex-col justify-center transition-all duration-500 ease-out py-10"
    >
      <div className={cn(
        "w-16 h-1 mb-8 transition-all duration-500",
        isInView ? "bg-blue-600 w-24" : "bg-slate-200"
      )} />
      <span className="text-blue-600 font-mono font-black text-2xl mb-2">0{index + 1}</span>
      <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{feature.title}</h3>
      <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-8 max-w-md">
        {feature.description.split(feature.highlight)[0]}
        <span className="text-slate-900 font-bold bg-blue-50 px-2 py-0.5 rounded shadow-sm">
          {feature.highlight}
        </span>
        {feature.description.split(feature.highlight)[1]}
      </p>
      <a 
        href={feature.link} 
        target="_blank"
        className="text-blue-600 font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all group/link"
      >
        Learn More <span className="text-2xl transition-transform group-hover/link:translate-x-1">→</span>
      </a>
    </motion.div>
  );
};