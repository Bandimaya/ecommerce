"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BackgroundDecorationsProps {
  type?: "hero" | "programs" | "newsletter" | "testimonials" | "trust" | "products" | "mission"
  colorVariant?: "primary" | "accent" | "muted" | "border" | "custom"
  customColor?: string
  opacity?: number
  intensity?: "light" | "medium" | "strong"
}

const BackgroundDecorations = ({ 
  type = "hero", 
  colorVariant = "primary",
  customColor,
  opacity = 0.15,
  intensity = "medium"
}: BackgroundDecorationsProps) => {
  
  // Get opacity based on intensity
  const getOpacity = () => {
    switch (intensity) {
      case "light": return opacity * 0.7
      case "strong": return opacity * 1.5
      default: return opacity
    }
  }

  // Get color based on variant
  const getColor = () => {
    if (customColor) return customColor;
    
    switch (colorVariant) {
      case "accent":
        return '#8b5cf6' // Purple
      case "muted":
        return '#64748b' // Slate 500
      case "border":
        return '#e2e8f0' // Slate 200
      case "primary":
      default:
        return '#3b82f6' // Blue 500
    }
  }

  const color = getColor()
  const currentOpacity = getOpacity()
  const prefersReducedMotion = useReducedMotion()

  // Abstracted SVG component
  const DecorationSVG = ({ 
    className = "", 
    strokeWidth = 2, 
    dashArray = "8,4",
    rotate = 0
  }: {
    className?: string
    strokeWidth?: number
    dashArray?: string
    rotate?: number
  }) => (
    <svg 
      width="822.2" 
      height="301.9" 
      viewBox="0 0 822.2 301.9" 
      className={cn("pointer-events-none", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        d="M752.5,51.9c-4.5,3.9-8.9,7.8-13.4,11.8c-51.5,45.3-104.8,92.2-171.7,101.4c-39.9,5.5-80.2-3.4-119.2-12.1 c-32.3-7.2-65.6-14.6-98.9-13.9c-66.5,1.3-128.9,35.2-175.7,64.6c-11.9,7.5-23.9,15.3-35.5,22.8c-40.5,26.4-82.5,53.8-128.4,70.7 c-2.1,0.8-4.2,1.5-6.2,2.2L0,301.9c3.3-1.1,6.7-2.3,10.2-3.5c46.1-17,88.1-44.4,128.7-70.9c11.6-7.6,23.6-15.4,35.4-22.8 c46.7-29.3,108.9-63.1,175.1-64.4c33.1-0.6,66.4,6.8,98.6,13.9c39.1,8.7,79.6,17.7,119.7,12.1C634.8,157,688.3,110,740,64.6 c4.5-3.9,9-7.9,13.4-11.8C773.8,35,797,16.4,822.2,1l-0.7-1C796.2,15.4,773,34,752.5,51.9z"
      />
    </svg>
  )

  // Floating particles component (deterministic positions to avoid SSR/CSR mismatch)
  const FloatingParticles = ({ count = 5, size = 2 }) => {
    const pxSize = `${Math.max(1, size)}px`

    // Deterministic placement so server and client match exactly
    const place = (i: number) => {
      const left = ((i * 37) % 100) + 0.5 // pseudo-spread
      const top = ((i * 53 + 11) % 100) + 0.5
      const delay = (i % 5) * 0.2
      const repeatDelay = ((i % 7) * 0.45) + 0.6
      return {
        left: `${left}%`,
        top: `${top}%`,
        delay,
        repeatDelay,
      }
    }

    return (
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: count }).map((_, i) => {
          const pos = place(i)
          return (
            <motion.div
              key={`particle-${count}-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: currentOpacity * 0.3, scale: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.8,
                delay: prefersReducedMotion ? 0 : pos.delay,
                repeat: prefersReducedMotion ? 0 : Infinity,
                repeatType: "reverse",
                repeatDelay: prefersReducedMotion ? 0 : pos.repeatDelay,
              }}
              className="absolute rounded-full will-change-transform"
              style={{
                backgroundColor: color,
                width: pxSize,
                height: pxSize,
                left: pos.left,
                top: pos.top,
                opacity: 0,
              }}
            />
          )
        })}
      </div>
    )
  }

  // Glow effect component
  const GlowEffect = ({ position = "center" }) => {
    const positions = {
      center: "inset-0",
      top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
      bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
      left: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
      right: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: currentOpacity * 0.2, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className={cn("absolute w-96 h-96 rounded-full blur-3xl pointer-events-none", positions[position as keyof typeof positions])}
        style={{
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
        }}
      />
    )
  }

  // Programs Section Decorations
  if (type === "programs") {
    return (
      <>
        {/* Main decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          {/* --- ADDED IMAGE: Desktop Top Right Texture --- */}
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: currentOpacity * 0.8 }} // Very subtle opacity
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500&auto=format&fit=crop" // Placeholder: Collaborative work
            alt=""
            className="absolute -top-20 -right-20 w-[500px] h-[500px] object-cover rounded-full blur-sm mix-blend-overlay hidden lg:block"
          />

           {/* --- ADDED IMAGE: Mobile Bottom Texture --- */}
           <motion.img
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: currentOpacity * 0.6, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=500&auto=format&fit=crop" // Placeholder: Education/Studying
            alt=""
            className="absolute bottom-0 left-0 w-full h-64 object-cover blur-sm mix-blend-overlay lg:hidden mask-image:linear-gradient(to top, black, transparent)"
          />
          
          {/* Top Left - Desktop SVG */}
          <motion.div
            initial={{ x: -100, y: -50, opacity: 0 }}
            whileInView={{ x: 0, y: 0, opacity: currentOpacity }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.2, type: "spring" }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute top-8 left-8 hidden lg:block"
          >
            <DecorationSVG 
              className="w-72 h-36" 
              strokeWidth={2}
              dashArray="12,6"
            />
          </motion.div>

          {/* Bottom Right - Desktop SVG */}
          <motion.div
            initial={{ x: 100, y: 50, opacity: 0 }}
            whileInView={{ x: 0, y: 0, opacity: currentOpacity }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.4, type: "spring" }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute bottom-8 right-8 hidden lg:block"
          >
            <DecorationSVG 
              className="w-56 h-28" 
              strokeWidth={2}
              dashArray="12,6"
              rotate={180}
            />
          </motion.div>

          {/* Mobile Center SVG */}
          <motion.div
            initial={{ scale: 0, rotate: 45, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: currentOpacity * 0.7 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden"
          >
            <DecorationSVG 
              className="w-48 h-24" 
              strokeWidth={3}
            />
          </motion.div>

          {/* Mobile Corners SVGs */}
          <motion.div
            initial={{ x: -30, y: -30, opacity: 0 }}
            whileInView={{ x: 0, y: 0, opacity: currentOpacity * 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="absolute top-6 left-6 lg:hidden"
          >
            <DecorationSVG 
              className="w-20 h-10" 
              strokeWidth={2}
            />
          </motion.div>

          <motion.div
            initial={{ x: 30, y: 30, opacity: 0 }}
            whileInView={{ x: 0, y: 0, opacity: currentOpacity * 0.5 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="absolute bottom-6 right-6 lg:hidden"
          >
            <DecorationSVG 
              className="w-20 h-10" 
              strokeWidth={2}
              rotate={180}
            />
          </motion.div>

          {/* Glow Effects */}
          <GlowEffect position="top" />
          <GlowEffect position="bottom" />

          {/* Floating Particles */}
          <FloatingParticles count={8} size={1} />
        </div>

        {/* Subtle gradient overlays */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, ${color}10 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, ${color}10 0%, transparent 50%)
            `,
          }}
        />
      </>
    )
  }

  // Hero Section Decorations
  if (type === "hero") {
    return (
      <>
        {/* Main decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
           {/* --- ADDED IMAGE: Hero Background Texture --- */}
           <motion.img
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: currentOpacity * 0.4, scale: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1080&auto=format&fit=crop" // Placeholder: Abstract technology/globe
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-[2px] mix-blend-soft-light"
          />

          {/* Bottom Left - Desktop SVG */}
          <motion.div
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: currentOpacity * 1.5 }}
            transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 60 }}
            className="absolute bottom-0 left-0 hidden lg:block"
          >
            <DecorationSVG 
              className="w-[800px] h-[300px]" 
              strokeWidth={3}
              dashArray="15,5"
            />
          </motion.div>

          {/* Top Right - Desktop SVG */}
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: currentOpacity * 1.5 }}
            transition={{ duration: 1.2, delay: 0.5, type: "spring", stiffness: 60 }}
            className="absolute top-0 right-0 hidden lg:block"
          >
            <DecorationSVG 
              className="w-[700px] h-[280px]" 
              strokeWidth={3}
              dashArray="15,5"
              rotate={180}
            />
          </motion.div>

          {/* Mobile SVGs */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: currentOpacity }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.2 }}
            className="absolute top-8 right-4 lg:hidden"
          >
            <DecorationSVG 
              className="w-48 h-24" 
              strokeWidth={4}
            />
          </motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: currentOpacity }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.4 }}
            className="absolute bottom-8 left-4 lg:hidden"
          >
            <DecorationSVG 
              className="w-56 h-28" 
              strokeWidth={4}
            />
          </motion.div>

          {/* Glow Effects */}
          <GlowEffect position="center" />

          {/* Floating Particles */}
          <FloatingParticles count={12} size={2} />
        </div>

        {/* Background gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 10% 10%, ${color}15 0%, transparent 40%),
              radial-gradient(ellipse at 90% 90%, ${color}15 0%, transparent 40%)
            `,
          }}
        />
      </>
    )
  }

  // Newsletter Section Decorations
  if (type === "newsletter") {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated SVG */}
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: currentOpacity }}
            transition={{ duration: 1, type: "spring", stiffness: 60 }}
            viewport={{ once: true }}
            className="absolute top-6 left-6 hidden lg:block"
          >
            <DecorationSVG 
              className="w-56 h-28" 
              strokeWidth={2}
              dashArray="20,10"
            />
          </motion.div>

          <motion.div
            initial={{ rotate: 180, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: currentOpacity }}
            transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 60 }}
            viewport={{ once: true }}
            className="absolute bottom-6 right-6 hidden lg:block"
          >
            <DecorationSVG 
              className="w-48 h-24" 
              strokeWidth={2}
              dashArray="20,10"
              rotate={180}
            />
          </motion.div>

          {/* Mobile Center */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: currentOpacity * 0.8 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden"
          >
            <DecorationSVG 
              className="w-64 h-32" 
              strokeWidth={3}
            />
          </motion.div>

          {/* Glow Effects */}
          <GlowEffect position="center" />

          {/* Enhanced Floating Particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: currentOpacity * 0.4, scale: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.8,
                  delay: i * 0.1,
                  repeat: prefersReducedMotion ? 0 : Infinity,
                  repeatType: "reverse",
                  repeatDelay: prefersReducedMotion ? 0 : Math.random() * 3 + 2
                }}
                className="absolute rounded-full will-change-transform"
                style={{
                  backgroundColor: color,
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Background gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${color}10 0%, transparent 70%)`,
          }}
        />
      </>
    )
  }

  // Testimonials Section Decorations
  if (type === "testimonials") {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Pattern */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: currentOpacity * 0.7 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            viewport={{ once: true }}
            className="absolute top-8 left-1/2 -translate-x-1/2"
          >
            <DecorationSVG 
              className="w-80 h-40 lg:w-96 lg:h-48" 
              strokeWidth={2}
              dashArray="25,15"
            />
          </motion.div>

          {/* Bottom Pattern */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: currentOpacity * 0.7 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <DecorationSVG 
              className="w-72 h-36 lg:w-80 lg:h-40" 
              strokeWidth={2}
              dashArray="25,15"
              rotate={180}
            />
          </motion.div>

          {/* Side decorations for desktop */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: currentOpacity * 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute top-1/3 left-4 hidden lg:block"
          >
            <DecorationSVG 
              className="w-40 h-20" 
              strokeWidth={1.5}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: currentOpacity * 0.5 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="absolute bottom-1/3 right-4 hidden lg:block"
          >
            <DecorationSVG 
              className="w-40 h-20" 
              strokeWidth={1.5}
              rotate={180}
            />
          </motion.div>

          {/* Glow Effects */}
          <GlowEffect position="top" />
          <GlowEffect position="bottom" />
        </div>
      </>
    )
  }

  // Trust Badges Section Decorations
  if (type === "trust") {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: currentOpacity * 0.8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
            className="absolute top-4 left-4"
          >
            <DecorationSVG 
              className="w-40 h-20 lg:w-56 lg:h-28" 
              strokeWidth={2}
              dashArray="10,5"
            />
          </motion.div>

          {/* Bottom Right */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: currentOpacity * 0.8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.3 }}
            viewport={{ once: true, margin: "-50px" }}
            className="absolute bottom-4 right-4"
          >
            <DecorationSVG 
              className="w-36 h-18 lg:w-48 lg:h-24" 
              strokeWidth={2}
              dashArray="10,5"
              rotate={180}
            />
          </motion.div>

          {/* Mobile Center */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: currentOpacity * 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute bottom-1/3 left-1/2 -translate-x-1/2 lg:hidden"
          >
            <DecorationSVG 
              className="w-48 h-24" 
              strokeWidth={3}
            />
          </motion.div>
        </div>
      </>
    )
  }

  // Products Section Decorations
  if (type === "products") {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: currentOpacity }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute top-8 left-8 hidden lg:block"
          >
            <DecorationSVG 
              className="w-80 h-40" 
              strokeWidth={2}
              dashArray="12,6"
            />
          </motion.div>

          {/* Bottom Right */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: currentOpacity }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute bottom-8 right-8 hidden lg:block"
          >
            <DecorationSVG 
              className="w-64 h-32" 
              strokeWidth={2}
              dashArray="12,6"
              rotate={180}
            />
          </motion.div>

          {/* Mobile Center */}
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: currentOpacity * 0.7 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden"
          >
            <DecorationSVG 
              className="w-72 h-36" 
              strokeWidth={3}
            />
          </motion.div>

          {/* Mobile Top Left */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: currentOpacity * 0.5 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="absolute top-12 left-4 lg:hidden"
          >
            <DecorationSVG 
              className="w-32 h-16" 
              strokeWidth={2}
            />
          </motion.div>

          {/* Glow Effects */}
          <GlowEffect position="center" />
        </div>
      </>
    )
  }

  // Mission Section Decorations
  if (type === "mission") {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none">
          {/* Left Side */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: currentOpacity }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
            className="absolute top-1/4 left-8 hidden lg:block"
          >
            <DecorationSVG 
              className="w-72 h-36" 
              strokeWidth={2}
              dashArray="15,8"
            />
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: currentOpacity }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.3 }}
            viewport={{ once: true, margin: "-50px" }}
            className="absolute bottom-1/4 right-8 hidden lg:block"
          >
            <DecorationSVG 
              className="w-64 h-32" 
              strokeWidth={2}
              dashArray="15,8"
              rotate={180}
            />
          </motion.div>

          {/* Mobile Top Center */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: currentOpacity * 0.8 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="absolute top-12 left-1/2 -translate-x-1/2 lg:hidden"
          >
            <DecorationSVG 
              className="w-64 h-32" 
              strokeWidth={3}
            />
          </motion.div>

          {/* Mobile Bottom Center */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: currentOpacity * 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:hidden"
          >
            <DecorationSVG 
              className="w-56 h-28" 
              strokeWidth={3}
              rotate={180}
            />
          </motion.div>

          {/* Glow Effects */}
          <GlowEffect position="center" />
          <FloatingParticles count={6} size={1} />
        </div>
      </>
    )
  }

  return null
}

export default BackgroundDecorations