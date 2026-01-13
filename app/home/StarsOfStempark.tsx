'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Quote, ArrowRight, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { apiFetch } from '@/lib/axios';
import { IMAGE_URL } from '@/lib/constants';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Data ---
const starsData = [
    {
        id: 'mihir',
        name: 'Mihir Vardhan',
        role: 'Alumni • University of Illinois',
        image: 'https://images.avishkaar.cc/misc/home/stars/stars-of-avishkaar-desktop-mihir-vardhan.webp',
        quote: "I've been building since I was a child. Avishkaar helped me get my robots into the Prime Minister's house.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Valid Video
    },
    {
        id: 'nishka',
        name: 'Nishka Arora',
        role: 'Alumni • AI Researcher',
        image: 'https://images.avishkaar.cc/misc/home/stars/stars-of-avishkaar-desktop-nishka-arora.webp',
        quote: "Imagine a world where education is personalized by AI. That is the future I am building today.",
        videoUrl: "",
    },
    {
        id: 'rishabh',
        name: 'Rishabh Garg',
        role: 'Alumni • Future Engineer',
        image: 'https://images.avishkaar.cc/misc/home/stars/stars-of-avishkaar-desktop-rishabh-garg.webp',
        quote: "I attended a workshop in 6th grade and never looked back. My dream is to build a human quadcopter.",
        videoUrl: "",
    },
    {
        id: 'sanchi-s',
        name: 'Sanchi Sinha',
        role: 'Student • NUIG Ireland',
        image: 'https://images.avishkaar.cc/misc/home/stars/stars-of-avishkaar-desktop-sanchi-sinha.webp',
        quote: "My dream project is to use technology to save lives. Innovation starts with a single step.",
        videoUrl: "",
    },
    {
        id: 'aarav',
        name: 'Aarav Wadhwani',
        role: 'Winner • Avishkaar League',
        image: 'https://images.avishkaar.cc/misc/home/stars/stars-of-avishkaar-desktop-aarav-wadhwani.webp',
        quote: "We won the 1st position at Avishkaar League when we were just 12. That fueled my passion forever.",
        videoUrl: "",
    }
];

export default function StarsOfAvishkaar() {
    // 1. Initialize data immediately with static data to ensure content is present
    const [data, setData] = useState(starsData);

    // 2. Find the first index that has a video URL available
    const initialIndex = starsData.findIndex(star => star.videoUrl && star.videoUrl.trim() !== "");

    // 3. Set the currentIndex to that valid index (fallback to 0 if none found)
    const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        // Keep existing fetch logic but ensure it updates state correctly
        apiFetch('/stars')
            .then((response) => {
                if (response && response.length > 0) {
                    setData(response);
                    // Optional: Re-calculate index if data changes significantly
                }
            })
            .catch(() => {
                console.log("Error fetching stars data, using static data.");
                // We already have static data set, so no action needed here
            });
    }, []);

    const resumeTimer = useRef<NodeJS.Timeout | null>(null);
    const activeStar: any = data?.[currentIndex];

    // --- Auto-Rotation Effect ---
    useEffect(() => {
        if (isVideoOpen || !isAutoPlay) return;

        const timer = setInterval(() => {
            handleNext();
        }, 8000);

        return () => clearInterval(timer);
    }, [currentIndex, isVideoOpen, isAutoPlay]);


    // --- Logic to Resume Autoplay after Interaction ---
    const handleManualInteraction = () => {
        setIsAutoPlay(false);
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
        resumeTimer.current = setTimeout(() => {
            if (!isVideoOpen) setIsAutoPlay(true);
        }, 2000);
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % data.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 < 0 ? data.length - 1 : prev - 1));
    };

    const slideVariants = {
        hidden: (direction: number) => ({ opacity: 0, x: direction > 0 ? 50 : -50 }),
        visible: { opacity: 1, x: 0 },
        exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -50 : 50 })
    };

    // Helper to generate correct embed URL
    const getVideoSrc = (url: string) => {
        if (!url) return "";
        return `${IMAGE_URL}${url}`;
    };

    // --- Reusable Navigation Component ---
    const NavigationControls = ({ mobile = false }) => (
        <div className={cn(
            "flex flex-col gap-6 border-t border-border bg-background/50 backdrop-blur-sm",
            mobile ? "p-6 lg:hidden" : "hidden lg:flex p-10 mt-auto"
        )}>
            {/* Top Row: Counter & Chevrons */}
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Student {currentIndex + 1} of {data.length}
                    </span>
                    <div className="h-1 w-24 bg-muted mt-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            handlePrev();
                            handleManualInteraction();
                        }}
                        className="w-12 h-12 rounded-full border border-input bg-card flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => {
                            handleNext();
                            handleManualInteraction();
                        }}
                        className="w-12 h-12 rounded-full border border-input bg-card flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Bottom Row: Circle Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide">
                {data.map((star: any, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                                handleManualInteraction();
                            }}
                            className="group relative flex-shrink-0 cursor-pointer"
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300",
                                isActive ? "border-transparent scale-100" : "border-muted opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                            )}>
                                <img src={IMAGE_URL + star?.image} alt="" className="w-full h-full object-cover" />
                            </div>

                            {/* Active Ring Animation */}
                            {isActive && (
                                <svg className="absolute -top-[3px] -left-[3px] w-[62px] h-[62px] -rotate-90 pointer-events-none" viewBox="0 0 60 60">
                                    <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" className="text-muted" strokeWidth="2" />
                                    {isAutoPlay && !isVideoOpen && (
                                        <motion.circle
                                            key={currentIndex}
                                            cx="30" cy="30" r="28" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 8, ease: "linear" }}
                                        />
                                    )}
                                    {!isAutoPlay && (
                                        <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeDasharray="1 0" />
                                    )}
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    console.log(getVideoSrc(activeStar.video))

    return (
        <section className="relative w-full h-auto lg:min-h-[850px] bg-background font-sans overflow-hidden flex flex-col py-8 lg:py-0">

            {/* --- HEADER --- */}
            <div className="container mx-auto px-4 md:px-6 mb-8 lg:mb-12 pt-8 lg:pt-12">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-4 mb-4">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '40px' }}
                            transition={{ duration: 0.6 }}
                            className="h-[3px] bg-primary rounded-full"
                        />
                        <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-primary">
                            stars of stempark
                        </span>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '40px' }}
                            transition={{ duration: 0.6 }}
                            className="h-[3px] bg-primary rounded-full"
                        />
                    </div>

                    <p className="mt-4 text-muted-foreground max-w-xl text-sm md:text-lg">
                        Veteran young innovators who are now making their mark across the globe.
                    </p>
                </div>
            </div>

            {/* --- MAIN CARD CONTAINER --- */}
            <div className="flex-1 w-full h-full flex flex-col lg:flex-row">

                {/* --- LEFT SIDE: VISUALS --- */}
                <div className="relative w-full lg:w-[60%] h-[45vh] lg:h-auto bg-muted overflow-hidden group">
                    <AnimatePresence mode="wait" initial={false}>
                        {!isVideoOpen ? (
                            /* IMAGE STATE WITH PLAY BUTTON */
                            <motion.div
                                key={`img-${activeStar?.id || 'default'}`}
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                                className="relative w-full h-full"
                            >
                                <img
                                    src={IMAGE_URL + activeStar?.image}
                                    alt={activeStar?.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Gradient Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden"></div>

                                {/* Floating Play Button - THIS IS KEPT AS REQUESTED */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        onClick={() => {
                                            // Explicitly handle video open logic
                                            if (activeStar?.video) {
                                                setIsVideoOpen(true);
                                                setIsAutoPlay(false);
                                            }
                                        }}
                                        className="relative group/btn transform transition-transform duration-300 hover:scale-110 cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-background/30 rounded-full animate-ping opacity-50"></div>
                                        <div className="relative w-24 h-24 bg-background/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white shadow-2xl group-hover/btn:bg-primary group-hover/btn:border-primary transition-colors">
                                            <Play className="w-10 h-10 fill-current ml-1" />
                                        </div>
                                        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/90 text-sm font-bold tracking-[0.2em] uppercase opacity-0 group-hover/btn:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/btn:translate-y-0">
                                            Play Story
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            /* VIDEO PLAYER STATE */
                            <motion.div
                                key="video-player"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black z-30 flex items-center justify-center"
                            >
                                <button
                                    onClick={() => {
                                        setIsVideoOpen(false);
                                        handleManualInteraction();
                                    }}
                                    className="absolute top-6 left-6 lg:left-auto lg:right-6 z-40 p-3 bg-background/10 hover:bg-background/20 text-white rounded-full transition-colors backdrop-blur-md border border-white/10"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {activeStar?.video ? (
                                    <video
                                        width="640"
                                        height="360"
                                        controls
                                        autoPlay={false}
                                    >
                                        <source src={getVideoSrc(activeStar.video)} />
                                    </video>
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <p>Video content loading...</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- MOBILE NAVIGATION --- */}
                <NavigationControls mobile={true} />

                {/* --- RIGHT SIDE: CONTENT --- */}
                <div className="relative w-full lg:w-[40%] h-auto lg:h-auto bg-card flex flex-col">

                    {/* Content Section */}
                    <div className="flex-1 px-8 lg:px-12 flex flex-col justify-center py-8">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeStar?.id || 'content'}
                                custom={direction}
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="relative"
                            >
                                {/* Decorative Quote */}
                                <Quote className="absolute -top-10 -left-4 text-muted/40 w-24 h-24 rotate-180 -z-10" />

                                {/* Name */}
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-2 tracking-tight leading-[1.1]">
                                    {activeStar?.name}
                                </h2>

                                {/* Role */}
                                <div className="flex items-center gap-2 text-primary mb-8">
                                    <GraduationCap className="w-5 h-5" />
                                    <span className="font-semibold text-lg">{activeStar?.role}</span>
                                </div>

                                {/* Quote Text */}
                                <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed border-l-4 border-primary pl-6 mb-8">
                                    "{activeStar?.quote}"
                                </p>

                                <button
                                    onClick={() => {
                                        if (activeStar?.videoUrl) {
                                            setIsVideoOpen(true);
                                            setIsAutoPlay(false);
                                        }
                                    }}
                                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors group"
                                >
                                    <span>Watch Story</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* --- DESKTOP NAVIGATION --- */}
                    <NavigationControls mobile={false} />

                </div>
            </div>
        </section>
    );
}