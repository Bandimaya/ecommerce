  "use client"

  import { ArrowRight, Sparkles, Shield, Clock, Users, Play } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import Link from "next/link"
  import { motion } from "framer-motion"
  import { useState, useEffect } from "react"
  import BackgroundDecorations from "./BackgroundDecorations"

  interface HeroSectionProps {
    getCSSVar: (varName: string, fallback?: string) => string
    handleWatchVideo: () => void
  }

  const HeroSection = ({ getCSSVar, handleWatchVideo }: HeroSectionProps) => {
    const [isMobile, setIsMobile] = useState(false)
    
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])
    
    const cssVars = {
      accent: () => getCSSVar('--accent', '#8b5cf6'),
      warning: () => getCSSVar('--warning', '#f59e0b'),
      primaryForeground: () => getCSSVar('--primary-foreground', '#ffffff'),
      background: () => getCSSVar('--background', '#ffffff'),
      border: () => getCSSVar('--border', '#e2e8f0'),
      fontDisplay: () => getCSSVar('--font-display', 'system-ui, sans-serif'),
    }

    return (
      <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center overflow-hidden p-2.5 sm:p-5 md:p-10 rounded-t-3xl mx-0 sm:mx-2 md:mx-4 mt-0 sm:mt-2 md:mt-4">
        {/* Grey Shade Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${'/assets/hero-bg.jpg'})`,
              transform: isMobile ? 'scale(1.1)' : 'scale(1.05)',
              transition: 'transform 0.3s ease-out'
            }}
          />

          {/* Grey gradient overlay - 60% grey tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 via-gray-700/50 to-gray-900/60 opacity-95" />

          {/* Accent color overlay for branding - 40% opacity */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-warning/20 opacity-40" />

          {/* Animated gradient overlay */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(
            45deg,
            transparent 30%,
            ${cssVars.warning()} 50%,
            transparent 70%
          )`,
              backgroundSize: '400% 400%',
            }}
          />
        </div>

        {/* Professional Background Decorations */}
        <BackgroundDecorations type="hero" />

        {/* Enhanced Wave SVG at bottom without shadow */}
        <motion.figure
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-0 left-0 w-full z-10 pointer-events-none"
        >
          <svg
            width="100%"
            height="80"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="sm:h-[120px] md:h-[150px]"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              d="M0,80 L0,20 Q720,80 1440,20 L1440,80 Z"
              fill={cssVars.background()}
              stroke={cssVars.border()}
              strokeWidth="3"
              strokeOpacity="0.25"
            />
          </svg>
        </motion.figure>

        <div className="container relative z-30 px-4 sm:px-6 lg:px-8 w-full">
          <div className="py-6 sm:py-8 md:py-12 flex flex-col items-center sm:items-start text-center sm:text-start">
            <div className="w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 text-white my-3 sm:mt-0">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="py-4 sm:py-6 md:py-8"
              >
                {/* Animated Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block bg-white/20 backdrop-blur-lg border border-white/30 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full mb-6 sm:mb-8 max-w-full"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-0 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg"
                    style={{ color: cssVars.primaryForeground() }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="badge rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-0 sm:mr-2"
                      style={{
                        backgroundColor: `${cssVars.accent()}40`,
                        color: cssVars.primaryForeground(),
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      Featured
                    </motion.span>
                    Inspiring the <b className="whitespace-nowrap">next generation</b> of innovators
                  </motion.p>
                </motion.div>

                {/* Animated Title */}
                <motion.h1
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight sm:leading-tight md:leading-tight drop-shadow-lg px-2 sm:px-0"
                  style={{
                    color: '#ffffff',
                    fontFamily: cssVars.fontDisplay(),
                    textShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  Build. Learn.{' '}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{ color: cssVars.warning() }}
                    className="relative inline-block"
                  >
                    Create Amazing Things.
                    {/* Thick underline effect */}
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="absolute -bottom-2 left-0 w-full h-2 rounded-full"
                      style={{ backgroundColor: cssVars.warning() }}
                    />
                  </motion.span>
                </motion.h1>

                {/* Animated Description */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-95 px-2 sm:px-0 max-w-2xl mx-auto sm:mx-0 drop-shadow-md"
                  style={{ color: '#f1f5f9' }}
                >
                  Premium STEM kits, 3D printer rentals, and hands-on programs designed to spark curiosity and build real-world skills.
                </motion.p>

                {/* Animated Buttons */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-8 sm:mt-10 px-4 sm:px-0"
                >
                  {/* Primary Button */}
                  <Link href="/shop" className="w-full sm:w-auto">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="gap-3 px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 w-full sm:w-auto justify-center group relative overflow-hidden"
                        style={{
                          backgroundColor: cssVars.accent(),
                          color: cssVars.primaryForeground()
                        }}
                      >
                        {/* Slanted light grey shade effect */}
                        <motion.div
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: `linear-gradient(
                          135deg,
                          transparent 0%,
                          rgba(255, 255, 255, 0.4) 25%,
                          rgba(255, 255, 255, 0.2) 50%,
                          transparent 100%
                        )`,
                            transform: 'translateX(-100%) skewX(-15deg)',
                          }}
                          animate={{
                            x: ['0%', '100%', '100%', '0%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.5, 0.51, 1]
                          }}
                        />

                        {/* Additional subtle shine effect */}
                        <motion.div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: `linear-gradient(
                          90deg,
                          transparent 0%,
                          rgba(255, 255, 255, 0.6) 50%,
                          transparent 100%
                        )`,
                            transform: 'translateX(-100%)',
                          }}
                          animate={{
                            x: ['0%', '200%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.5
                          }}
                        />

                        <span className="relative z-10 text-base sm:text-lg font-semibold">Shop Now</span>
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </Link>

                  {/* Video Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <button
                      onClick={handleWatchVideo}
                      className="relative group flex items-center justify-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-1 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto backdrop-blur-lg border border-white/30"
                      style={{
                        backgroundColor: `${cssVars.background()}30`,
                        color: '#ffffff',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {/* Icon */}
                      <div className="relative flex-shrink-0">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: `${cssVars.accent()}40` }}
                        />
                        <div
                          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${cssVars.accent()}60` }}
                        >
                          <Play
                            className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5"
                            fill="currentColor"
                          />
                        </div>
                      </div>

                      {/* Text */}
                      <span className="text-sm leading-none font-medium drop-shadow-sm whitespace-nowrap">
                        Watch Our Story
                      </span>
                    </button>
                  </motion.div>
                </motion.div>

                {/* Animated Trust Indicators */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t px-4 sm:px-0"
                  style={{ borderColor: '#ffffff30' }}
                >
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base">
                    {[
                      { icon: Shield, text: "Quality Guaranteed" },
                      { icon: Clock, text: "Same Day Dispatch" },
                      { icon: Users, text: "1000+ Happy Learners" },
                      { icon: Sparkles, text: "STEM Certified" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm flex-nowrap"
                      >
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: cssVars.warning() }} />
                        <span className="drop-shadow-sm whitespace-nowrap" style={{ color: '#ffffff' }}>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  export default HeroSection