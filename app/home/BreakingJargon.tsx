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
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Users,
  Clock,
  Star
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { apiFetch } from "@/lib/axios"
import { IMAGE_URL } from "@/lib/constants"
import { Course } from "@/components/courses/microdegree/BentoGrid"
import { useRouter } from "next/navigation"

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

// Define Icon Map
const ICON_MAP = { Cpu, Zap, Code, Wifi, Cog, Brain } as const;

const BreakingJargon = ({ getCSSVar }: BreakingJargonProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [data, setData] = useState<JargonItem[]>([])

  // useEffect(() => {
  //   apiFetch('/jargon')
  //     .then(response => {
  //       setData(response)
  //     }).catch(error => {
  //       console.error('Error fetching jargon data:', error)
  //     })
  // }, [])

  // Handle Resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // --- HANDLERS ---
  const handleNext = useCallback(() => {
    if (data.length === 0) return
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % data.length)
  }, [data.length])

  const handlePrev = useCallback(() => {
    if (data.length === 0) return
    setDirection(-1)
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

  // --- Mobile Variants ---
  const mobileVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
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
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  }

  // Helper to get active mobile icon
  const activeItem = data[activeIndex];
  const ActiveIcon = activeItem ? ICON_MAP[activeItem.icon as keyof typeof ICON_MAP] : null;
  const activeId = activeItem?._id ? String(activeItem._id) : null
  const activeLinkable = Boolean(activeId)
  const [courses, setCourses] = useState<Course[]>([]);

  const activeCourse = courses[activeIndex];

  useEffect(() => {
    apiFetch('/stem-courses')
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => console.error(err))
      // .finally(() => setLoading(false));
  }, []);

  const router = useRouter();



  return (
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
              className="text-l font-bold uppercase tracking-widest"
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

        {!isMobile ? (
          <div className="relative h-[550px] w-full flex items-center justify-center perspective-[1200px]">
            {courses.map((course, index) => {
              const { state, zIndex } = getCardProps(index);

              return (
                <motion.div
                  key={course._id}
                  variants={desktopVariants}
                  initial="farRight"
                  animate={state}
                  className="w-[900px] h-[500px] rounded-3xl bg-white shadow-2xl border border-slate-100/50 overflow-hidden cursor-pointer"
                  style={{ zIndex, transformStyle: "preserve-3d" }}
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
                        src={IMAGE_URL + course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Rating Badge Overlay */}
                      <div className="absolute top-6 left-6 z-20">
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-slate-900 text-sm">{course.rating || '4.9'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Content Side */}
                    <div className="col-span-7 p-10 flex flex-col justify-center relative bg-white">
                      {/* Background Number */}
                      <div className="absolute top-4 right-6 text-9xl font-black text-slate-50 opacity-100 pointer-events-none select-none text-slate-100">
                        0{index + 1}
                      </div>

                      <div className="relative z-10 flex flex-col h-full justify-center">
                        {/* Category Tag */}
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                            {course.category || 'STEM Education'}
                          </span>
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 mb-4 leading-tight line-clamp-2">
                          {course.title}
                        </h2>

                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3 text-lg">
                          {course.description}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-6">
                          <div className="flex items-center gap-2 text-slate-500 font-medium">
                            <Clock size={18} className="text-blue-500" />
                            <span>{course.duration || '8 Weeks'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 font-medium">
                            <Users size={18} className="text-blue-500" />
                            <span>{course.students || '1.2k'} Students</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-auto">
                          <button onClick={() => router.push('/courses')} className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                            Explore Course <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Desktop Navigation Arrows */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-40 max-w-6xl mx-auto">
              <button onClick={handlePrev} className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all active:scale-95">
                <ChevronLeft size={28} />
              </button>
              <button onClick={handleNext} className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all active:scale-95">
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        ) : (
          /* --- MOBILE CARD STACK --- */
          <div className="relative w-full h-[680px] px-4">
            <AnimatePresence mode="popLayout" custom={direction}>
              {activeCourse && (
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={mobileVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
                >
                  <div className="relative h-[40%]">
                    <img
                      src={IMAGE_URL + activeCourse.image}
                      alt={activeCourse.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold">{activeCourse.rating || '4.9'}</span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">
                        {activeCourse.category || 'STEM Education'}
                      </div>
                      <h2 className="text-2xl font-bold leading-tight shadow-black drop-shadow-md">
                        {activeCourse.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-slate-600 leading-relaxed text-sm mb-6 line-clamp-4 flex-grow">
                      {activeCourse.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={16} className="text-blue-500" />
                        <span>{activeCourse.duration || '8 Weeks'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Users size={16} className="text-blue-500" />
                        <span>{activeCourse.students || '1.2k'} Students</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>Certificated</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <GraduationCap size={16} className="text-blue-500" />
                        <span>Mentorship</span>
                      </div>
                    </div>

                    <button className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-200 mb-4">
                      Explore Course
                    </button>

                    {/* Mobile Nav */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <button onClick={handlePrev} className="p-2 bg-slate-50 rounded-full border border-slate-200"><ChevronLeft size={20} /></button>
                      <span className="text-xs font-bold text-slate-400">{activeIndex + 1} / {courses.length}</span>
                      <button onClick={handleNext} className="p-2 bg-slate-50 rounded-full border border-slate-200"><ChevronRight size={20} /></button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- DESKTOP 3D CAROUSEL --- */}
        {/* {!isMobile ? (
          <div className="relative h-[550px] w-full flex items-center justify-center perspective-[1200px]">

            {data.map((item, index) => {
              const { state, zIndex } = getCardProps(index)
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];

              const itemId = item._id ? String(item._id) : null
              const isLinkable = Boolean(itemId)

              // CHECK LENGTH: Only true if description > 400 chars
              const isLongDescription = item.description.length > 400;

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

                    <div className="col-span-7 p-10 flex flex-col justify-center relative bg-white">
                      <div className="absolute top-4 right-6 text-9xl font-black text-slate-50 opacity-[0.04] pointer-events-none select-none">
                        0{item._id}
                      </div>
                      <div className="relative z-10 flex flex-col h-full justify-center">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Concept</span>
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">{item.title}</h2>

                        <div className="mb-6">
                          <p className="text-lg text-slate-600 leading-relaxed mb-2 line-clamp-3">
                            {item.description}
                          </p>

                          {isLinkable && isLongDescription && (
                            <Link
                              href={`/home/jargon/${encodeURIComponent(itemId as string)}`}
                              className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors mt-1"
                            >
                              Read full overview <ChevronRight size={14} className="ml-0.5" />
                            </Link>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                          <div className="flex items-center gap-3">
                            {isLinkable ? (
                              <Link href={`/home/jargon/${encodeURIComponent(itemId as string)}`} className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${item.color}`}>
                                Explore Topic <ArrowRight size={18} />
                              </Link>
                            ) : (
                              <button disabled className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white opacity-60 ${item.color}`}>
                                Explore Topic
                              </button>
                            )}
                          </div>

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

          <div className="relative w-full h-[650px] px-4">
            <AnimatePresence mode="popLayout" custom={direction}>
              {activeItem && (
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={mobileVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
                >
                  <div className="relative h-[45%]">
                    <img
                      src={IMAGE_URL + activeItem.image}
                      className="w-full h-full object-cover"
                      alt={activeItem.alt}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute bottom-6 left-6 text-white w-[90%]">
                      <div className={`w-12 h-12 rounded-xl ${activeItem.color} flex items-center justify-center shadow-lg text-white mb-4`}>
                        {ActiveIcon && <ActiveIcon size={24} strokeWidth={2.5} />}
                      </div>

                      <div className="flex items-center gap-2 mb-2 opacity-90">
                        <span className={`h-1.5 w-1.5 rounded-full bg-white`} />
                        <span className="text-xs font-bold uppercase tracking-wider">Core Concept</span>
                      </div>

                      <h2 className="text-3xl font-bold leading-tight">{activeItem.title}</h2>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-2 line-clamp-4">
                        {activeItem.description}
                      </p>

                      {activeLinkable && activeItem.description.length > 400 && (
                        <Link
                          href={`/home/jargon/${encodeURIComponent(activeId as string)}`}
                          className="text-sm font-semibold text-slate-400 underline underline-offset-4 decoration-slate-200 hover:text-slate-600 inline-block py-1"
                        >
                          Read full description
                        </Link>
                      )}
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {activeLinkable ? (
                            <Link href={`/home/jargon/${encodeURIComponent(activeId as string)}`} className={`px-5 py-2.5 rounded-full font-semibold text-white shadow-md text-sm ${activeItem.color}`}>
                              Explore Topic
                            </Link>
                          ) : (
                            <button disabled className={`px-5 py-2.5 rounded-full font-semibold text-white shadow-md text-sm opacity-60 ${activeItem.color}`}>Explore Topic</button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                          <Sparkles size={14} className="text-amber-400" />
                          <span>Beginner Friendly</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <button onClick={handlePrev} className="p-3 bg-slate-50 border border-slate-100 rounded-full active:scale-95 transition-transform text-slate-600 hover:bg-slate-100 cursor-pointer"><ChevronLeft size={20} /></button>
                        <span className="text-sm font-bold text-slate-400">{activeIndex + 1} / {data.length}</span>
                        <button onClick={handleNext} className="p-3 bg-slate-50 border border-slate-100 rounded-full active:scale-95 transition-transform text-slate-600 hover:bg-slate-100 cursor-pointer"><ChevronRight size={20} /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )} */}

        {/* --- NAVIGATION DOTS --- */}
        <div className="flex justify-center gap-3 mt-8 items-center">
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