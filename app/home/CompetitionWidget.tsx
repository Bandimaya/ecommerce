'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Users,
    ArrowRight,
    Check,
    ArrowLeft,
    User,
    Mail
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Hook to detect prefers-reduced-motion
const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
};

// --- Types ---
interface Event {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    thumbnail: string;
    logo: string;
    color: string;
    bgGradient: string;
    count: number;
}

interface FormData {
    name: string;
    email: string;
}

const CompetitionWidget = () => {
    const prefersReducedMotion = useReducedMotion();

    // --- Data ---
    const initialEvents: Event[] = [
        {
            id: 'evt_1',
            title: "Stem Park Makeathon 2026",
            subtitle: "Code of Duty",
            category: "Coding & Dev",
            thumbnail: "https://assets.avishkaar.cc/avishkaar-league-2025/makeathon/am25_thumbnail_1.png",
            logo: "https://assets.avishkaar.cc/avishkaar-league-2024/Misc./AM+logo.png",
            color: "#f97316", // Orange
            bgGradient: "from-orange-500/20 via-orange-100/50 to-white",
            count: 279
        },
        {
            id: 'evt_2',
            title: "International Robo League",
            subtitle: "Season '26",
            category: "Robotics",
            thumbnail: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=1000",
            logo: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
            color: "#3b82f6", // Blue
            bgGradient: "from-blue-600/20 via-blue-100/50 to-white",
            count: 142
        },
        {
            id: 'evt_3',
            title: "Future AI Summit",
            subtitle: "Gen-Z Edition",
            category: "AI & ML",
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
            logo: "https://cdn-icons-png.flaticon.com/512/1693/1693746.png",
            color: "#8b5cf6", // Violet
            bgGradient: "from-violet-600/20 via-violet-100/50 to-white",
            count: 89
        }
    ];

    // --- State ---
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [viewState, setViewState] = useState<'idle' | 'form' | 'success'>('idle');
    const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const activeEvent = events[activeIndex];

    // --- Responsive Check ---
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Handlers ---
    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % events.length);
        setViewState('idle');
    }, [events.length]);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + events.length) % events.length);
        setViewState('idle');
    }, [events.length]);

    const handleRegisterClick = () => setViewState('form');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setEvents(prev => prev.map(evt => evt.id === activeEvent.id ? { ...evt, count: evt.count + 1 } : evt));
            setViewState('success');
        }, 600);
    };

    // --- 3D Carousel Logic ---
    const getCardProps = (index: number) => {
        const length = events.length;
        let offset = (index - activeIndex) % length;
        if (offset > length / 2) offset -= length;
        if (offset < -length / 2) offset += length;

        if (offset === 0) return { state: "center", zIndex: 30 };
        if (offset === 1) return { state: "right", zIndex: 20 };
        if (offset === -1) return { state: "left", zIndex: 20 };
        return { state: offset > 0 ? "farRight" : "farLeft", zIndex: 10 };
    };

    const variants: Variants = {
        center: {
            x: "0%",
            scale: 1,
            opacity: 1,
            rotateY: 0,
            filter: "brightness(1) grayscale(0%)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transition: { type: "spring", stiffness: 260, damping: 20 }
        },
        left: {
            x: "-60%",
            scale: 0.85,
            opacity: 0.7,
            rotateY: 25,
            filter: "brightness(0.85) grayscale(100%)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            transition: { type: "spring", stiffness: 260, damping: 20 }
        },
        right: {
            x: "60%",
            scale: 0.85,
            opacity: 0.7,
            rotateY: -25,
            filter: "brightness(0.85) grayscale(100%)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            transition: { type: "spring", stiffness: 260, damping: 20 }
        },
        farLeft: {
            x: "-120%",
            scale: 0.7,
            opacity: 0,
            rotateY: 45,
            filter: "brightness(0.5) grayscale(100%)",
            transition: { type: "spring", stiffness: 260, damping: 20 }
        },
        farRight: {
            x: "120%",
            scale: 0.7,
            opacity: 0,
            rotateY: -45,
            filter: "brightness(0.5) grayscale(100%)",
            transition: { type: "spring", stiffness: 260, damping: 20 }
        }
    };

    return (
        <div className="relative w-full h-screen font-sans overflow-hidden transition-colors duration-700 bg-slate-50 theme-wrapper">
            {/* Header Section */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="absolute top-[10px] left-0 w-full flex justify-center items-center gap-3 z-30"
            >
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '48px' }}
                    transition={{ duration: 0.5 }}
                    className="h-[2px]"
                    style={{ backgroundColor: `var(--accent)` }}
                />
                <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: `var(--accent)` }}
                >
                    Live Events
                </span>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '48px' }}
                    transition={{ duration: 0.5 }}
                    className="h-[2px]"
                    style={{ backgroundColor: `var(--accent)` }}
                />
            </motion.div>

            {/* --- Dynamic Background --- */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activeEvent.bgGradient} transition-all duration-1000 ease-in-out`}></div>

            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] rounded-full bg-white opacity-40 blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vh] h-[60vh] rounded-full bg-[var(--primary)] opacity-10 blur-[120px] transition-colors duration-1000"></div>

            {/* Internal CSS for Variables */}
            <style jsx>{`
        .theme-wrapper {
          --primary: ${activeEvent.color};
          --accent: #1e293b;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>

            {/* --- Main Content Grid --- */}
            <div className="relative z-10 w-full h-full flex flex-col lg:flex-row">

                {/* === LEFT SECTION: 3D SLIDER === */}
                <div className="w-full lg:w-[60%] flex flex-col justify-center items-center relative p-6 lg:p-12 h-[50%] lg:h-full">

                    {/* Header */}
                    <div className="absolute top-6 left-6 lg:top-12 lg:left-12 z-30">
                        <h1 className="text-xl lg:text-2xl font-black tracking-tighter text-[var(--accent)] flex items-center gap-2">
                            STEM PARK <span className="bg-[var(--primary)] text-white px-2 py-0.5 rounded text-sm transition-colors duration-500">LIVE</span>
                        </h1>
                    </div>

                    {/* 3D Container */}
                    <div className="w-full max-w-4xl h-[300px] lg:h-[500px] relative flex items-center justify-center perspective-[1200px]">
                        {!isMobile ? (
                            // --- Desktop: Framer Motion 3D Carousel ---
                            <>
                                {/* Navigation Arrows: Positioned Absolute Center Left/Right */}
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-4 lg:left-0 z-40 w-12 h-12 rounded-full bg-white/50 hover:bg-white backdrop-blur-md shadow-lg flex items-center justify-center text-[var(--accent)] transition-all active:scale-95 group"
                                >
                                    <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 lg:right-0 z-40 w-12 h-12 rounded-full bg-white/50 hover:bg-white backdrop-blur-md shadow-lg flex items-center justify-center text-[var(--accent)] transition-all active:scale-95 group"
                                >
                                    <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>

                                {events.map((evt, idx) => {
                                    const { state, zIndex } = getCardProps(idx);
                                    return (
                                        <motion.div
                                            key={evt.id}
                                            variants={variants}
                                            initial="farRight"
                                            animate={state}
                                            className="absolute w-[85%] sm:w-[340px] lg:w-[380px] h-full rounded-3xl shadow-xl overflow-hidden flex flex-col bg-white cursor-pointer"
                                            style={{ zIndex, transformStyle: "preserve-3d" }}
                                            onClick={() => {
                                                if (state === 'left') handlePrev();
                                                if (state === 'right') handleNext();
                                            }}
                                        >
                                            {/* Card Image */}
                                            <div className="h-[60%] relative overflow-hidden group">
                                                <img src={evt.thumbnail} alt={evt.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-white/90 backdrop-blur text-[var(--accent)] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                        {evt.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="flex-1 p-6 flex flex-col justify-between relative bg-white">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2 opacity-50">
                                                        <img src={evt.logo} className="w-6 h-6 object-contain grayscale" />
                                                        <span className="text-xs font-bold tracking-widest">EVENT ID: {evt.id.toUpperCase()}</span>
                                                    </div>
                                                    <h2 className="text-2xl font-bold leading-tight text-slate-800">{evt.title}</h2>
                                                    <p className="text-sm font-medium text-[var(--primary)] transition-colors duration-500">{evt.subtitle}</p>
                                                </div>

                                                {/* Active Indicator Button */}
                                                <div className={`mt-4 py-3 rounded-xl flex items-center justify-center font-bold text-sm transition-colors duration-500 ${idx === activeIndex ? 'bg-[var(--primary)] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    {idx === activeIndex ? 'Viewing Details' : 'Click to View'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </>
                        ) : (
                            // --- Mobile: Simple Stack with Embedded Controls ---
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeEvent.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full rounded-3xl shadow-xl overflow-hidden flex flex-col bg-white"
                                >
                                    <div className="h-[60%] relative overflow-hidden">
                                        <img src={activeEvent.thumbnail} alt={activeEvent.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur text-[var(--accent)] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                {activeEvent.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between relative bg-white">
                                        <div>
                                            <h2 className="text-2xl font-bold leading-tight text-slate-800">{activeEvent.title}</h2>
                                            <p className="text-sm font-medium text-[var(--primary)]">{activeEvent.subtitle}</p>
                                        </div>

                                        {/* Updated Mobile Navigation Controls (Inside Card) */}
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100/50">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                                className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors active:scale-95"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <span className="text-xs font-bold text-slate-400 tracking-widest">
                                                {activeIndex + 1} / {events.length}
                                            </span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                                className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors active:scale-95"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Navigation Bar (Dots Only for Mobile) */}
                    <div className="mt-8 z-30 flex items-center justify-center w-full">
                        <div className="flex gap-2 items-center">
                            {events.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setActiveIndex(i); setViewState('idle'); }}
                                    className={`transition-all duration-300 rounded-full ${i === activeIndex
                                        ? 'w-8 h-2 bg-[var(--primary)]' // Active: Colored Pill
                                        : 'w-2 h-2 bg-slate-300'       // Inactive: Grey Dot
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* === RIGHT SECTION: INTERACTIVE PANEL === */}
                <div className="w-full lg:w-[40%] h-[50%] lg:h-full bg-white/60 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/50 flex flex-col justify-center p-6 lg:p-16 relative transition-colors duration-500 overflow-hidden">

                    {/* Background Text Faded */}
                    <div className="absolute top-10 right-10 text-9xl font-black text-slate-900/5 select-none pointer-events-none overflow-hidden">
                        2026
                    </div>

                    <div className="max-w-md mx-auto w-full relative z-10">
                        <AnimatePresence mode='wait'>
                            {/* VIEW: IDLE */}
                            {viewState === 'idle' && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="w-full"
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="flex h-3 w-3 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--primary)]"></span>
                                        </span>
                                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Registration Open</span>
                                    </div>

                                    <h2 className="text-4xl lg:text-5xl font-black text-[var(--accent)] mb-2">{activeEvent.title}</h2>
                                    <div className="flex items-center gap-2 mb-8">
                                        <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded text-sm font-bold uppercase tracking-wider">{activeEvent.category}</span>
                                        <p className="text-lg text-slate-500 font-medium">{activeEvent.subtitle}</p>
                                    </div>

                                    {/* Stats Card */}
                                    <div className="glass-card p-6 rounded-2xl mb-8 grid grid-cols-2 gap-4 shadow-sm">
                                        <div className="col-span-2 flex items-center gap-4 border-b border-slate-100 pb-4 mb-2">
                                            <div className="bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)] transition-colors duration-500">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <div className="text-3xl font-black text-slate-800 leading-none">{activeEvent.count}</div>
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Participants</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 font-bold uppercase">Format</div>
                                            <div className="font-semibold text-slate-700">Hybrid Mode</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 font-bold uppercase">Eligibility</div>
                                            <div className="font-semibold text-slate-700">Grade 6-12</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={handleRegisterClick}
                                            className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg shadow-lg hover:bg-[var(--primary)] transition-all active:scale-95 flex justify-center items-center gap-2"
                                        >
                                            Register Now <ArrowRight size={20} />
                                        </button>
                                        <p className="text-center text-xs text-slate-400">By registering, you agree to Stem Park's Terms & Conditions.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* VIEW: FORM with Floating Labels */}
                            {viewState === 'form' && (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="w-full"
                                >
                                    <button onClick={() => setViewState('idle')} className="group flex items-center gap-2 text-slate-500 font-medium mb-8 hover:text-[var(--primary)] transition-colors">
                                        <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-[var(--primary)] transition-colors duration-300">
                                            <ArrowLeft size={16} />
                                        </span>
                                        Back to Event Details
                                    </button>

                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-[var(--accent)]">Secure Your Spot</h3>
                                        <p className="text-slate-500">You are registering for <strong className="text-[var(--primary)] transition-colors duration-500">{activeEvent.title}</strong></p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name Input with Floating Label */}
                                        <div className="space-y-1">
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors duration-300" />
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder=" "
                                                    required
                                                    className="peer w-full pl-12 pr-4 pt-6 pb-2 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)] hover:border-slate-300"
                                                />
                                                <label
                                                    htmlFor="name"
                                                    className={`absolute left-12 top-4 text-slate-500 text-sm transition-all duration-200 origin-[0]
                                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                                                    peer-focus:scale-75 peer-focus:-translate-y-1.5
                                                    peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-1.5
                                                    peer-focus:text-[var(--primary)]`}
                                                >
                                                    Participant Name
                                                </label>
                                            </div>
                                            <p className="text-xs text-slate-400 ml-1">ex. Elon Musk</p>
                                        </div>

                                        {/* Email Input with Floating Label */}
                                        <div className="space-y-1">
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors duration-300" />
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder=" "
                                                    required
                                                    className="peer w-full pl-12 pr-4 pt-6 pb-2 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)] hover:border-slate-300"
                                                />
                                                <label
                                                    htmlFor="email"
                                                    className={`absolute left-12 top-4 text-slate-500 text-sm transition-all duration-200 origin-[0]
                                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                                                    peer-focus:scale-75 peer-focus:-translate-y-1.5
                                                    peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-1.5
                                                    peer-focus:text-[var(--primary)]`}
                                                >
                                                    Email Address
                                                </label>
                                            </div>
                                            <p className="text-xs text-slate-400 ml-1">ex. elon@spacex.com</p>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-bold text-lg shadow-xl shadow-[var(--primary)]/30 hover:shadow-none hover:translate-y-0.5 transition-all mt-4"
                                        >
                                            Confirm Registration
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* VIEW: SUCCESS */}
                            {viewState === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-full text-center"
                                >
                                    <div className="w-24 h-24 bg-[var(--primary)] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[var(--primary)]/40 text-white transition-colors duration-500">
                                        <Check size={48} />
                                    </div>

                                    <h2 className="text-3xl font-black text-[var(--accent)] mb-2">You're In!</h2>
                                    <p className="text-slate-500 mb-8">Get ready to innovate at {activeEvent.title}. Check your inbox for the pass.</p>

                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm inline-block min-w-[200px]">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Live Count</div>
                                        <div className="text-5xl font-black text-[var(--primary)] tracking-tighter transition-colors duration-500">{activeEvent.count}</div>
                                    </div>

                                    <button
                                        onClick={() => { setViewState('idle'); setFormData({ name: '', email: '' }); }}
                                        className="block w-full mt-8 text-[var(--primary)] font-bold hover:underline transition-colors duration-500"
                                    >
                                        Register Another Participant
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetitionWidget;   