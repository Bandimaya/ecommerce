"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Zap,
  Code,
  Wifi,
  Cog,
  Brain,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/axios"
import { IMAGE_URL } from "@/lib/constants"

// --- Types ---
interface JargonItem {
  id: number
  _id?: string
  title: string
  description: string
  image: string
  alt: string
  icon: React.ComponentType<any> | any
  color: string
  accentColor: string
}

interface BreakingJargonProps {
  getCSSVar?: (varName: string, fallback?: string) => string
}

const BreakingJargon = ({ getCSSVar }: BreakingJargonProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  // New State: Tracks direction (-1 for prev, 1 for next)
  const [direction, setDirection] = useState(0) 
  const [isMobile, setIsMobile] = useState(false)
  const [data, setData] = useState<JargonItem[]>([])

  useEffect(() => {
    apiFetch('/jargon')
      .then(response => {
        setData(response)
      }).catch(error => {
        console.error('Error fetching jargon data:', error)
      })
  }, [])

  // Handle Resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // --- UPDATED HANDLERS WITH DIRECTION ---
  const handleNext = useCallback(() => {
    if (data.length === 0) return
    setDirection(1) // Set direction to Forward
    setActiveIndex((prev) => (prev + 1) % data.length)
  }, [data.length])

  const handlePrev = useCallback(() => {
    if (data.length === 0) return
    setDirection(-1) // Set direction to Backward
    setActiveIndex((prev) => (prev - 1 + data.length) % data.length)
  }, [data.length])

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleNext, handlePrev])

  // --- Logic for Circular 3D Positioning (Desktop) ---
  const getCardProps = (index: number) => {
    if (data.length === 0) return { state: "center", zIndex: 30 }

    const length = data.length
    let offset = (index - activeIndex) % length
    if (offset > length / 2) offset -= length
    if (offset < -length / 2) offset += length

    if (offset === 0) return { state: "center", zIndex: 30 }
    if (offset === 1) return { state: "right", zIndex: 20 }
    if (offset === -1) return { state: "left", zIndex: 20 }
    if (offset === 2 || offset > 2) return { state: "farRight", zIndex: 10 }
    return { state: "farLeft", zIndex: 10 }
  }

  // --- Desktop Variants ---
  const desktopVariants: any = {
    center: {
      x: "0%",
      scale: 1,
      opacity: 1,
      rotateY: 0,
      filter: "brightness(1)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
    left: {
      x: "-60%",
      scale: 0.85,
      opacity: 0.7,
      rotateY: 25,
      filter: "brightness(0.85)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
    right: {
      x: "60%",
      scale: 0.85,
      opacity: 0.7,
      rotateY: -25,
      filter: "brightness(0.85)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
    farLeft: {
      x: "-120%",
      scale: 0.7,
      opacity: 0,
      rotateY: 45,
      filter: "brightness(0.5)",
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
    farRight: {
      x: "120%",
      scale: 0.7,
      opacity: 0,
      rotateY: -45,
      filter: "brightness(0.5)",
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  }

  // --- Mobile Variants (Dynamic Direction) ---
  const mobileVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100, // If next, enter from right. If prev, enter from left.
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100, // If next, exit left. If prev, exit right.
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  }

  return (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    <section className="relative w-full py-20 overflow-hidden bg-slate-50">

      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundColor: data?.[activeIndex]?.accentColor
          }}
          transition={{ duration: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[100px]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-6"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '48px' }}
              transition={{ duration: 0.5 }}
              className="h-[2px]"
              style={{ backgroundColor: `var(--accent, #3b82f6)` }}
            />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: `var(--accent, #3b82f6)` }}
            >
              Interactive Jargon Buster
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '48px' }}
              transition={{ duration: 0.5 }}
              className="h-[2px]"
              style={{ backgroundColor: `var(--accent, #3b82f6)` }}
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            Your Guide to{' '}
            <motion.span
              animate={{ color: data?.[activeIndex]?.accentColor }}
              transition={{ duration: 0.5 }}
            >
              AI, Robotics Kits & Coding
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Easy explanations of common terms kickstart your child’s{' '}
            <motion.span
              animate={{ color: data?.[activeIndex]?.accentColor }}
              transition={{ duration: 0.5 }}
              className="font-semibold"
            >
              innovation journey.
            </motion.span>
          </motion.p>
        </div>

        {/* --- DESKTOP 3D CAROUSEL --- */}
        {!isMobile ? (
          <div className="relative h-[550px] w-full flex items-center justify-center perspective-[1200px]">

            {/* Card Iterator */}
            {data.map((item, index) => {
              const { state, zIndex } = getCardProps(index)
              const ICON_MAP = { Cpu, Zap, Code, Wifi, Cog, Brain } as const;
              type IconKey = keyof typeof ICON_MAP;
              const Icon = ICON_MAP[item.icon as IconKey];

              return (
                <motion.div
                  key={item._id}
                  variants={desktopVariants}
                  initial="farRight"
                  animate={state}
                  className="absolute w-[850px] h-[480px] rounded-3xl bg-white shadow-2xl border border-slate-100/50 overflow-hidden cursor-pointer"
                  style={{
                    zIndex,
                    transformStyle: "preserve-3d"
                  }}
                  onClick={() => {
                    if (state === 'left') handlePrev();
                    if (state === 'right') handleNext();
                  }}
                >
                  <div className="grid grid-cols-12 h-full w-full">
                    {/* Left: Image Side */}
                    <div className="col-span-5 relative h-full overflow-hidden group">
                      <div className="absolute inset-0 bg-slate-900/10 z-10 transition-colors group-hover:bg-transparent" />
                      <img
                        src={IMAGE_URL + item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6 z-20">
                        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shadow-lg text-white`}>
                          {Icon && <Icon size={24} strokeWidth={2.5} />}
                        </div>
                      </div>
                    </div>

                    {/* Right: Content Side */}
                    <div className="col-span-7 p-10 flex flex-col justify-center relative bg-white">
                      <div className="absolute top-4 right-6 text-9xl font-black text-slate-50 opacity-[0.04] pointer-events-none select-none">
                        0{item._id}
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Concept</span>
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">{item.title}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-8">{item.description}</p>
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                          <button className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${item.color}`}>
                            Explore Topic <ArrowRight size={18} />
                          </button>
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Sparkles size={16} className="text-amber-400" />
                            <span>Beginner Friendly</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Desktop Navigation Arrows */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-40 max-w-6xl mx-auto">
              <button
                onClick={handlePrev}
                className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all active:scale-95"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={handleNext}
                className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all active:scale-95"
              >
                <ChevronRight size={28} />
              </button>
            </div>

          </div>
        ) : (

          /* --- MOBILE CARD STACK (Updated with Direction) --- */
          <div className="relative w-full h-[600px] px-4">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction} // Pass direction to variants
                variants={mobileVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
              >
                <div className="relative h-1/2">
                  <img
                    src={IMAGE_URL + data?.[activeIndex]?.image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className={`inline-flex p-2 rounded-lg ${data?.[activeIndex]?.color} mb-3`}>
                    </div>
                    <h2 className="text-3xl font-bold">{data?.[activeIndex]?.title}</h2>
                  </div>
                </div>
                <div className="p-6 h-1/2 flex flex-col justify-between">
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {data?.[activeIndex]?.description}
                  </p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <button onClick={handlePrev} className="p-3 bg-slate-100 rounded-full active:scale-95 transition-transform"><ChevronLeft size={20} /></button>
                    <span className="text-sm font-bold text-slate-400">{activeIndex + 1} / {data.length}</span>
                    <button onClick={handleNext} className="p-3 bg-slate-100 rounded-full active:scale-95 transition-transform"><ChevronRight size={20} /></button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* --- NAVIGATION DOTS --- */}
        <div className="flex justify-center gap-3 mt-12 items-center">
          {data.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="group flex items-center justify-center p-1 focus:outline-none"
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx
                  ? 'w-8'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                style={{
                  backgroundColor: activeIndex === idx ? data?.[activeIndex].accentColor : undefined
                }}
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}

export default BreakingJargon