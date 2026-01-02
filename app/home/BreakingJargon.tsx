"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, BookOpen, Cpu, Zap, Code, Wifi, Cog, Brain, Sparkles } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface JargonItem {
  id: number
  title: string
  description: string
  desktopImage: string
  mobileImage: string
  alt: string
  icon: React.ComponentType<any>
  color: string
}

interface BreakingJargonProps {
  getCSSVar?: (varName: string, fallback?: string) => string
}

const BreakingJargon = ({ getCSSVar }: BreakingJargonProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const [isMobile, setIsMobile] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const jargonItems: JargonItem[] = [
    {
      id: 1,
      title: "Robotics",
      description: "Robotics is an interdisciplinary branch of engineering which combines IoT, coding, electronics, mechanical design & AI to design robots that can perform tasks autonomously or with human guidance.",
      desktopImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-desktop-robotics.webp",
      mobileImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-mobile-robotics.webp",
      alt: "Robotics",
      icon: Cpu,
      color: "blue"
    },
    {
      id: 2,
      title: "Coding",
      description: "Coding is a method for humans to communicate with machines and give it specific instructions. Coding is the process of writing computer programs which drive most things around you - machines, robots, mobile apps, digital games, websites and desktop software.",
      desktopImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-desktop-coding.webp",
      mobileImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-mobile-coding.webp",
      alt: "Coding",
      icon: Code,
      color: "purple"
    },
    {
      id: 3,
      title: "IoT",
      description: "IoT is a concept that describes the ability of various machines to communicate with each other wirelessly (mostly over the internet) and share data that allows these machines to perform and function much more intelligently and autonomously.",
      desktopImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-desktop-iot.webp",
      mobileImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-mobile-iot.webp",
      alt: "IoT",
      icon: Wifi,
      color: "green"
    },
    {
      id: 4,
      title: "Electronics",
      description: "Electronics is the process of designing circuits of various machines, understanding the power requirements of various components in it and making a suitable connection system so these components can be powered and communicate with each other effectively.",
      desktopImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-desktop-electronics.webp",
      mobileImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-mobile-electronics.webp",
      alt: "Electronics",
      icon: Zap,
      color: "yellow"
    },
    {
      id: 5,
      title: "Mechanical Design",
      description: "Mechanical Design is the process of developing the physical structure and motion of any machine so it can carry out various simple or complex physical tasks with precision, efficiency, and durability.",
      desktopImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-desktop-mechanical design.webp",
      mobileImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-mobile-mechanical design.webp",
      alt: "Mechanical Design",
      icon: Cog,
      color: "red"
    },
    {
      id: 6,
      title: "AI",
      description: "Artificial intelligence is a computer or machine's ability to mimic the problem-solving and decision-making capabilities of humans and animals, so it can begin to perform much more complex and subjective functions independently.",
      desktopImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-desktop-ai.webp",
      mobileImage: "https://images.avishkaar.cc/misc/home/jargon/jargon-mobile-ai.webp",
      alt: "AI",
      icon: Brain,
      color: "pink"
    }
  ]

  const cssVars = {
    primary: () => getCSSVar ? getCSSVar('--primary', '#3b82f6') : '#3b82f6',
    primaryForeground: () => getCSSVar ? getCSSVar('--primary-foreground', '#ffffff') : '#ffffff',
    secondary: () => getCSSVar ? getCSSVar('--secondary', '#f1f5f9') : '#f1f5f9',
    secondaryForeground: () => getCSSVar ? getCSSVar('--secondary-foreground', '#0f172a') : '#0f172a',
    accent: () => getCSSVar ? getCSSVar('--accent', '#8b5cf6') : '#8b5cf6',
    warning: () => getCSSVar ? getCSSVar('--warning', '#f59e0b') : '#f59e0b',
    foreground: () => getCSSVar ? getCSSVar('--foreground', '#020817') : '#020817',
    background: () => getCSSVar ? getCSSVar('--background', '#ffffff') : '#ffffff',
    card: () => getCSSVar ? getCSSVar('--card', '#ffffff') : '#ffffff',
    border: () => getCSSVar ? getCSSVar('--border', '#e2e8f0') : '#e2e8f0',
    mutedForeground: () => getCSSVar ? getCSSVar('--muted-foreground', '#64748b') : '#64748b',
    fontDisplay: () => getCSSVar ? getCSSVar('--font-display', 'system-ui, sans-serif') : 'system-ui, sans-serif',
  }

  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePrev = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(-1)
    setActiveIndex((prev) => (prev === 0 ? jargonItems.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }, [jargonItems.length, isAnimating])

  const handleNext = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(1)
    setActiveIndex((prev) => (prev === jargonItems.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }, [jargonItems.length, isAnimating])

  const getColorByType = (color: string) => {
    switch (color) {
      case 'blue': return cssVars.primary()
      case 'purple': return cssVars.accent()
      case 'green': return '#10b981'
      case 'yellow': return cssVars.warning()
      case 'red': return '#ef4444'
      case 'pink': return '#ec4899'
      default: return cssVars.primary()
    }
  }

  const mobileVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
    center: { x: 0, opacity: 1, scale: 1, zIndex: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      zIndex: 0
    })
  }

  if (isMobile) {
    return (
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />

        <div className="container px-4 mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-6"
          >
            <div className="h-[2px] w-10" style={{ backgroundColor: cssVars.accent() }} />
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: cssVars.accent() }}>STEM Guide</span>
            <div className="h-[2px] w-10" style={{ backgroundColor: cssVars.accent() }} />
          </motion.div>

          <div className="relative h-[580px] w-full">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={mobileVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 rounded-3xl overflow-hidden border-2 shadow-2xl bg-white/90 backdrop-blur-sm"
                style={{ borderColor: cssVars.border() }}
              >
                {/* Image section */}
                <div className="relative h-64 overflow-hidden">
                  <div 
                    className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse"
                  />
                  {/* Replace with actual image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {(() => {
                      const Icon = jargonItems[activeIndex].icon
                      return <Icon className="w-24 h-24 text-white/30" />
                    })()}
                  </div>
                  <div className="absolute top-4 left-4 p-3 rounded-xl shadow-lg bg-white/20 backdrop-blur-sm">
                    {(() => {
                      const Icon = jargonItems[activeIndex].icon
                      return <Icon className="w-6 h-6 text-white" />
                    })()}
                  </div>
                </div>
                
                {/* Content section */}
                <div className="p-6">
                  {/* Top Left Label */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-6 rounded-full" style={{ backgroundColor: getColorByType(jargonItems[activeIndex].color) }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cssVars.mutedForeground() }}>Core Technology</span>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{jargonItems[activeIndex].title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: cssVars.mutedForeground() }}>
                    {jargonItems[activeIndex].description}
                  </p>
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: cssVars.border() }}>
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                      <span style={{ color: cssVars.mutedForeground() }}>Beginner Level</span>
                      <span style={{ color: getColorByType(jargonItems[activeIndex].color) }}>Topic {activeIndex + 1}/6</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 px-4">
            <button 
              onClick={handlePrev}
              className="p-3 rounded-full border-2 shadow-lg bg-white hover:bg-slate-50 hover:scale-105 transition-all duration-300"
              style={{ borderColor: cssVars.border() }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {jargonItems.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  whileTap={{ scale: 1.2 }}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6' : 'w-2'}`}
                  style={{ backgroundColor: i === activeIndex ? getColorByType(jargonItems[i].color) : cssVars.border() }}
                />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="p-3 rounded-full border-2 shadow-lg bg-white hover:bg-slate-50 hover:scale-105 transition-all duration-300"
              style={{ borderColor: cssVars.border() }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-blue-50/10 to-purple-50/10">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-300/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/5 via-transparent to-transparent" />
      </div>

      <div className="container px-4 mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 max-w-5xl mx-auto">
<motion.div
  initial={{ scaleX: 0 }}
  whileInView={{ scaleX: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
  viewport={{ once: true }}
  className="flex justify-center items-center gap-3 mb-6"
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
    Interactive Jargon Buster
  </span>
  
  <motion.div
    initial={{ width: 0 }}
    whileInView={{ width: '48px' }}
    transition={{ duration: 0.5 }}
    className="h-[2px]"
    style={{ backgroundColor: `var(--accent)` }}
  />
</motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6"
            style={{ fontFamily: cssVars.fontDisplay() }}
          >
            Your Guide to <span style={{ background: `linear-gradient(135deg, ${cssVars.primary()}, ${cssVars.accent()})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>STEM</span>
          </motion.h2>
        </div>

        {/* Desktop Carousel */}
        <div className="relative min-h-[650px] flex items-center justify-center perspective-2000">
          {/* Navigation Buttons */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-50 flex justify-between px-4 pointer-events-none">
            <motion.button
              onClick={handlePrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="pointer-events-auto p-5 rounded-full bg-white border-2 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              style={{ borderColor: cssVars.border() }}
            >
              <ChevronLeft className="w-6 h-6 group-hover:translate-x-[-2px] transition-transform" />
            </motion.button>
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="pointer-events-auto p-5 rounded-full bg-white border-2 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              style={{ borderColor: cssVars.border() }}
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-[2px] transition-transform" />
            </motion.button>
          </div>

          {/* Carousel Cards */}
          <div className="relative w-full max-w-5xl h-[550px]">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const index = (activeIndex + offset + jargonItems.length) % jargonItems.length
              const item = jargonItems[index]
              const Icon = item.icon
              const itemColor = getColorByType(item.color)

              const getCardStyles = (off: number) => {
                const base = { x: '-50%', y: '-50%', opacity: 1, scale: 1, zIndex: 10, rotateY: 0, filter: 'blur(0px)' }
                if (off === 0) return { ...base, zIndex: 50, scale: 1.05 }
                if (Math.abs(off) === 1) return { ...base, x: off > 0 ? '10%' : '-110%', scale: 0.85, zIndex: 30, opacity: 0.7, rotateY: off > 0 ? -15 : 15, filter: 'blur(2px)' }
                return { ...base, x: off > 0 ? '60%' : '-160%', scale: 0.7, zIndex: 10, opacity: 0.4, rotateY: off > 0 ? -25 : 25, filter: 'blur(4px)' }
              }

              return (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={getCardStyles(offset)}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="absolute top-1/2 left-1/2 w-[70%] h-full rounded-[2rem] overflow-hidden border-2 shadow-2xl bg-white/95 backdrop-blur-sm cursor-pointer group/card"
                  onClick={() => offset !== 0 && setActiveIndex(index)}
                  style={{ borderColor: cssVars.border() }}
                >
                  <div className="grid grid-cols-2 h-full">
                    {/* Left side - Image */}
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse" />
                      {/* Replace with actual image */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-32 h-32 text-white/20" />
                      </div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <div className="p-3 rounded-xl mb-3 inline-block shadow-lg" style={{ backgroundColor: itemColor }}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold opacity-80">Topic 0{index + 1}</p>
                        <h3 className="text-2xl font-bold">{item.title}</h3>
                      </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="p-10 flex flex-col justify-center">
                      <div className="mb-6">
                        {/* Badge */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-1 w-10 rounded-full" style={{ backgroundColor: itemColor }} />
                          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: cssVars.mutedForeground() }}>
                            Core Technology
                          </span>
                        </div>

                        <h4 className="text-4xl font-bold mb-4" style={{ color: cssVars.foreground(), fontFamily: cssVars.fontDisplay() }}>{item.title}</h4>
                        <p className="text-lg leading-relaxed" style={{ color: cssVars.mutedForeground() }}>{item.description}</p>
                      </div>
                      <div className="mt-auto space-y-4">
                        {/* Progress bar */}
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: offset === 0 ? 1 : 0 }}
                            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
                            className="h-full origin-left will-change-transform"
                            style={{ backgroundColor: itemColor, transformOrigin: 'left' }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 text-sm font-bold" style={{ color: cssVars.foreground() }}>
                            <Sparkles className="w-4 h-4" /> Beginner Level
                          </span>
                          <button className="text-sm font-bold hover:underline transition-all group/learnmore">
                            <span className="group-hover/learnmore:translate-x-1 transition-transform inline-block" style={{ color: itemColor }}>
                              Learn More →
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center gap-3 mt-12"
        >
          {jargonItems.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndex(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-12' : 'w-2'}`}
              style={{ backgroundColor: i === activeIndex ? getColorByType(item.color) : cssVars.border() }}
              aria-label={`Go to ${item.title}`}
            />
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .perspective-2000 { perspective: 2000px; }
        * { backface-visibility: hidden; }
      `}</style>
    </section>
  )
}

export default BreakingJargon