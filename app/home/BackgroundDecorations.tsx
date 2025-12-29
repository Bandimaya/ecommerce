"use client"

import { motion } from "framer-motion"

interface BackgroundDecorationsProps {
  type?: "hero" | "programs" | "newsletter" | "testimonials" | "trust" | "products" | "mission"
  colorVariant?: "primary" | "accent" | "muted" | "border" | "custom"
  customColor?: string
  opacity?: number
}

const BackgroundDecorations = ({ 
  type = "hero", 
  colorVariant = "primary",
  customColor,
  opacity = 0.15 
}: BackgroundDecorationsProps) => {
  
  const getCSSVar = (varName: string, fallback?: string) => {
    if (typeof window === 'undefined') return fallback || ''
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim() || fallback || ''
  }

  // Get color based on variant
  const getStrokeColor = () => {
    if (customColor) return customColor;
    
    switch (colorVariant) {
      case "accent":
        return getCSSVar('--accent', getCSSVar('--primary', '#8b5cf6'));
      case "muted":
        return getCSSVar('--muted-foreground', getCSSVar('--border', '#64748b'));
      case "border":
        return getCSSVar('--border', '#e2e8f0');
      case "primary":
      default:
        return getCSSVar('--primary', '#3b82f6');
    }
  }

  // Common SVG path for all decorations
  const svgPath = "M752.5,51.9c-4.5,3.9-8.9,7.8-13.4,11.8c-51.5,45.3-104.8,92.2-171.7,101.4c-39.9,5.5-80.2-3.4-119.2-12.1 c-32.3-7.2-65.6-14.6-98.9-13.9c-66.5,1.3-128.9,35.2-175.7,64.6c-11.9,7.5-23.9,15.3-35.5,22.8c-40.5,26.4-82.5,53.8-128.4,70.7 c-2.1,0.8-4.2,1.5-6.2,2.2L0,301.9c3.3-1.1,6.7-2.3,10.2-3.5c46.1-17,88.1-44.4,128.7-70.9c11.6-7.6,23.6-15.4,35.4-22.8 c46.7-29.3,108.9-63.1,175.1-64.4c33.1-0.6,66.4,6.8,98.6,13.9c39.1,8.7,79.6,17.7,119.7,12.1C634.8,157,688.3,110,740,64.6 c4.5-3.9,9-7.9,13.4-11.8C773.8,35,797,16.4,822.2,1l-0.7-1C796.2,15.4,773,34,752.5,51.9z"

  const strokeColor = getStrokeColor()

  // Hero Section - Full featured with enhanced animations
  if (type === "hero") {
    return (
      <>
        {/* Bottom Left - Desktop (Enhanced) */}
        <motion.figure
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: opacity * 1.5 }}
          transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 50 }}
          whileHover={{ opacity: opacity * 2 }}
          className="absolute bottom-0 left-0 hidden sm:block z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-[600px] sm:w-[700px] md:w-[800px] lg:w-[900px] xl:w-[1000px] h-auto">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeDasharray="10,5"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Top Right - Desktop (Enhanced) */}
        <motion.figure
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: opacity * 1.5 }}
          transition={{ duration: 1.2, delay: 0.5, type: "spring", stiffness: 50 }}
          whileHover={{ opacity: opacity * 2 }}
          className="absolute top-0 right-0 hidden sm:block z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-[600px] sm:w-[700px] md:w-[800px] lg:w-[900px] xl:w-[1000px] h-auto rotate-180">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeDasharray="10,5"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Top Right */}
        <motion.figure
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: opacity }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-8 right-4 sm:hidden z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-48 h-24">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Bottom Left */}
        <motion.figure
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: opacity }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-8 left-4 sm:hidden z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-56 h-28">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Center Glow Effect - Subtle gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: opacity * 0.3 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${strokeColor}20 0%, transparent 70%)`,
          }}
        />
      </>
    )
  }

  // Trust Badges Section
  if (type === "trust") {
    return (
      <>
        {/* Top Left - Desktop & Mobile */}
        <motion.figure
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: opacity * 0.8 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          className="absolute top-4 left-4 z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-32 h-16 sm:w-48 sm:h-24">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="6,3"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Bottom Right - Desktop & Mobile */}
        <motion.figure
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: opacity * 0.8 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, margin: "-50px" }}
          className="absolute bottom-4 right-4 z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-28 h-14 sm:w-40 sm:h-20 rotate-180">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="6,3"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile Bottom Center (Additional for mobile) */}
        <motion.figure
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: opacity * 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute bottom-1/3 left-1/2 -translate-x-1/2 sm:hidden z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-40 h-20">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>
      </>
    )
  }

  // Products Section
  if (type === "products") {
    return (
      <>
        {/* Top Right - Desktop */}
        <motion.figure
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: opacity }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="absolute top-8 left-4 sm:left-8 z-0 pointer-events-none hidden sm:block"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-64 h-32">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="8,4"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Bottom Left - Desktop */}
        <motion.figure
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: opacity }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="absolute bottom-8 right-4 sm:right-8 z-0 pointer-events-none hidden sm:block"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-48 h-24 rotate-180">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="8,4"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Center */}
        <motion.figure
          initial={{ rotate: -180, opacity: 0 }}
          whileInView={{ rotate: 0, opacity: opacity * 0.7 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:hidden z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-56 h-28">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Top Left */}
        <motion.figure
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: opacity * 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute top-12 left-4 sm:hidden z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-24 h-12">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>
      </>
    )
  }

  // Mission Section
  if (type === "mission") {
    return (
      <>
        {/* Left - Desktop Only */}
        <motion.figure
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: opacity }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          className="absolute top-1/4 left-4 hidden lg:block z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-56 h-28">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="12,6"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Right - Desktop Only */}
        <motion.figure
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: opacity }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, margin: "-50px" }}
          className="absolute bottom-1/4 right-4 hidden lg:block z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-48 h-24 rotate-180">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="12,6"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Top Center */}
        <motion.figure
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: opacity * 0.8 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="absolute top-8 left-1/2 -translate-x-1/2 lg:hidden z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-48 h-24">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Bottom Center */}
        <motion.figure
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: opacity * 0.8 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden z-0 pointer-events-none rotate-180"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-40 h-20">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>
      </>
    )
  }

  // Programs Section
  if (type === "programs") {
    return (
      <>
        {/* Top Left - Desktop */}
        <motion.figure
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: opacity }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="absolute top-8 left-4 sm:left-8 z-0 pointer-events-none hidden sm:block"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-64 h-32">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="8,4"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Bottom Right - Desktop */}
        <motion.figure
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: opacity }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="absolute bottom-8 right-4 sm:right-8 z-0 pointer-events-none hidden sm:block rotate-180"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-48 h-24">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="8,4"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Diagonal Pattern */}
        <motion.figure
          initial={{ rotate: 45, scale: 0, opacity: 0 }}
          whileInView={{ rotate: 0, scale: 1, opacity: opacity * 0.7 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:hidden z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-40 h-20">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Corner Accents */}
        <motion.figure
          initial={{ x: -20, y: -20, opacity: 0 }}
          whileInView={{ x: 0, y: 0, opacity: opacity * 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="absolute top-4 left-4 sm:hidden z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-16 h-8">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        <motion.figure
          initial={{ x: 20, y: 20, opacity: 0 }}
          whileInView={{ x: 0, y: 0, opacity: opacity * 0.5 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute bottom-4 right-4 sm:hidden z-0 pointer-events-none rotate-180"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-16 h-8">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>
      </>
    )
  }

  // Newsletter Section
  if (type === "newsletter") {
    return (
      <>
        {/* Animated SVG for newsletter */}
        <motion.figure
          initial={{ rotate: -180, opacity: 0 }}
          whileInView={{ rotate: 0, opacity: opacity }}
          transition={{ duration: 1, type: "spring", stiffness: 60 }}
          viewport={{ once: true }}
          className="absolute top-4 left-4 z-0 pointer-events-none hidden sm:block"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-48 h-24">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="15,5"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        <motion.figure
          initial={{ rotate: 180, opacity: 0 }}
          whileInView={{ rotate: 0, opacity: opacity }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 60 }}
          viewport={{ once: true }}
          className="absolute bottom-4 right-4 z-0 pointer-events-none hidden sm:block rotate-180"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-40 h-20">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="15,5"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Center Animated */}
        <motion.figure
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: opacity * 0.8 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:hidden z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-56 h-28">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Mobile - Floating Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: opacity * 0.3 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="absolute inset-0 sm:hidden z-0 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }} />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full" style={{ backgroundColor: strokeColor }} />
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }} />
        </motion.div>
      </>
    )
  }

  // Testimonials Section
  if (type === "testimonials") {
    return (
      <>
        {/* Top Pattern */}
        <motion.figure
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: opacity * 0.7 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-0 pointer-events-none"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-64 h-32 sm:w-96 sm:h-48">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="20,10"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>

        {/* Bottom Pattern */}
        <motion.figure
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: opacity * 0.7 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-0 pointer-events-none rotate-180"
        >
          <svg width="822.2" height="301.9" viewBox="0 0 822.2 301.9" 
            className="w-56 h-28 sm:w-80 sm:h-40">
            <path
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="20,10"
              strokeLinecap="round"
              d={svgPath}
            />
          </svg>
        </motion.figure>
      </>
    )
  }

  return null
}

export default BackgroundDecorations