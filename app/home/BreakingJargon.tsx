"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, BookOpen, Cpu, Zap, Code, Wifi, Cog, Brain, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/contexts/I18nContext"

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

const BreakingJargon = ({ getCSSVar = (varName, fallback) => fallback ? `var(${varName}, ${fallback})` : `var(${varName})` }: BreakingJargonProps) => {
  const { t } = useI18n()
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
    primary: () => getCSSVar('--primary', '#3b82f6'),
    primaryForeground: () => getCSSVar('--primary-foreground', '#ffffff'),
    secondary: () => getCSSVar('--secondary', '#f1f5f9'),
    secondaryForeground: () => getCSSVar('--secondary-foreground', '#0f172a'),
    accent: () => getCSSVar('--accent', '#8b5cf6'),
    warning: () => getCSSVar('--warning', '#f59e0b'),
    foreground: () => getCSSVar('--foreground', '#020817'),
    background: () => getCSSVar('--background', '#ffffff'),
    card: () => getCSSVar('--card', '#ffffff'),
    border: () => getCSSVar('--border', '#e2e8f0'),
    mutedForeground: () => getCSSVar('--muted-foreground', '#64748b'),
    fontDisplay: () => getCSSVar('--font-display', 'system-ui, sans-serif'),
  }

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
      <section className="relative py-16 overflow-hidden" style={{ background: `linear-gradient(135deg, ${cssVars.background()} 98%, ${cssVars.primary()} 2%)` }}>
        <div className="container px-4 mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-6"
          >
            <div className="h-[2px] w-10" style={{ backgroundColor: cssVars.accent() }} />
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: cssVars.accent() }}>Stem Guide</span>
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
                className="absolute inset-0 rounded-3xl overflow-hidden border shadow-2xl bg-white"
                style={{ borderColor: cssVars.border() }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={jargonItems[activeIndex].mobileImage} alt={jargonItems[activeIndex].alt} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 p-3 rounded-xl shadow-lg" style={{ backgroundColor: getColorByType(jargonItems[activeIndex].color) }}>
                    {(() => {
                      const Icon = jargonItems[activeIndex].icon
                      return <Icon className="w-6 h-6 text-white" />
                    })()}
                  </div>
                </div>
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

          <div className="flex justify-between items-center mt-8 px-4">
            <button onClick={handlePrev} className="p-3 rounded-full border shadow-md bg-white hover:bg-slate-50 transition-colors"><ChevronLeft /></button>
            <div className="flex gap-2">
              {jargonItems.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6' : 'w-1.5'}`} style={{ backgroundColor: i === activeIndex ? getColorByType(jargonItems[i].color) : cssVars.border() }} />
              ))}
            </div>
            <button onClick={handleNext} className="p-3 rounded-full border shadow-md bg-white hover:bg-slate-50 transition-colors"><ChevronRight /></button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden" style={{ background: `linear-gradient(135deg, ${cssVars.background()} 98%, ${cssVars.primary()} 2%)` }}>
      <div className="container px-4 mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-6"
          >
            <div className="h-[2px] w-12" style={{ backgroundColor: cssVars.accent() }} />
            <span className="text-base font-semibold uppercase tracking-wider" style={{ color: cssVars.accent() }}>Interactive Jargon Buster</span>
            <div className="h-[2px] w-12" style={{ backgroundColor: cssVars.accent() }} />
          </motion.div>

          <h2 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6" style={{ fontFamily: cssVars.fontDisplay() }}>
            Your Guide to <span style={{ color: cssVars.primary() }}>STEM</span>
          </h2>
        </div>

        <div className="relative min-h-[650px] flex items-center justify-center perspective-2000">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-50 flex justify-between px-4 pointer-events-none">
            <button onClick={handlePrev} className="pointer-events-auto p-5 rounded-full bg-white border shadow-xl hover:scale-110 transition-transform"><ChevronLeft /></button>
            <button onClick={handleNext} className="pointer-events-auto p-5 rounded-full bg-white border shadow-xl hover:scale-110 transition-transform"><ChevronRight /></button>
          </div>

          <div className="relative w-full max-w-5xl h-[550px]">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const index = (activeIndex + offset + jargonItems.length) % jargonItems.length
              const item = jargonItems[index]
              const Icon = item.icon

              const getCardStyles = (off: number) => {
                const base = { x: '-50%', y: '-50%', opacity: 1, scale: 1, zIndex: 10, rotateY: 0, filter: 'blur(0px)' }
                if (off === 0) return { ...base, zIndex: 50, scale: 1.05 }
                if (Math.abs(off) === 1) return { ...base, x: off > 0 ? '10%' : '-110%', scale: 0.85, zIndex: 30, opacity: 0.6, rotateY: off > 0 ? -15 : 15, filter: 'blur(2px)' }
                return { ...base, x: off > 0 ? '60%' : '-160%', scale: 0.7, zIndex: 10, opacity: 0.3, rotateY: off > 0 ? -25 : 25, filter: 'blur(4px)' }
              }

              return (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={getCardStyles(offset)}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="absolute top-1/2 left-1/2 w-[70%] h-full rounded-[2rem] overflow-hidden border shadow-2xl bg-white cursor-pointer"
                  onClick={() => offset !== 0 && setActiveIndex(index)}
                >
                  <div className="grid grid-cols-2 h-full">
                    <div className="relative overflow-hidden group">
                      <img src={item.desktopImage} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <div className="p-3 rounded-xl mb-3 inline-block" style={{ backgroundColor: getColorByType(item.color) }}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold opacity-80">Topic 0{index + 1}</p>
                        <h3 className="text-2xl font-bold">{item.title}</h3>
                      </div>
                    </div>
                    <div className="p-10 flex flex-col justify-center">
                      <div className="mb-6">
                        {/* New Top Left Badge */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-1 w-10 rounded-full" style={{ backgroundColor: getColorByType(item.color) }} />
                          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: cssVars.mutedForeground() }}>
                            {t('home.breakingJargon.badge')}
                          </span>
                        </div>

                        <h4 className="text-4xl font-bold mb-4" style={{ color: cssVars.foreground(), fontFamily: cssVars.fontDisplay() }}>{item.title}</h4>
                        <p className="text-lg leading-relaxed" style={{ color: cssVars.mutedForeground() }}>{item.description}</p>
                      </div>
                      <div className="mt-auto space-y-4">
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: offset === 0 ? '100%' : '0%' }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full"
                            style={{ backgroundColor: getColorByType(item.color) }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 text-sm font-bold" style={{ color: cssVars.foreground() }}>
                            <Sparkles className="w-4 h-4" /> {t('home.breakingJargon.levels.beginner')}
                          </span>
                          <button className="text-sm font-bold hover:underline transition-all" style={{ color: getColorByType(item.color) }}>
                            {t('home.breakingJargon.learnMore')}
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

        <div className="flex justify-center gap-3 mt-12">
          {jargonItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-12' : 'w-2'}`}
              style={{ backgroundColor: i === activeIndex ? getColorByType(item.color) : cssVars.border() }}
              aria-label={`Go to ${item.title}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .perspective-2000 { perspective: 2000px; }
        * { backface-visibility: hidden; }
      `}</style>
    </section>
  )
}

export default BreakingJargon