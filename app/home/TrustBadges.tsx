"use client"

import { Truck, Shield, Clock, Sparkles, LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import BackgroundDecorations from "./BackgroundDecorations"

interface TrustBadgesProps {
  getCSSVar: (varName: string, fallback?: string) => string
}

const TrustBadges = ({ getCSSVar }: TrustBadgesProps) => {
  // Helper for colors
  const c = (varName: string, fallback: string) => getCSSVar(varName, fallback)

  const badges = [
    { 
      icon: Truck, 
      title: "Free Shipping", 
      desc: "On orders $50+",
      delay: 0
    },
    { 
      icon: Shield, 
      title: "1-Year Warranty", 
      desc: "Quality guaranteed",
      delay: 0.1
    },
    { 
      icon: Clock, 
      title: "24/7 Support", 
      desc: "Live expert chat",
      delay: 0.2
    },
    { 
      icon: Sparkles, 
      title: "STEM Certified", 
      desc: "Education approved",
      delay: 0.3
    },
  ]

  return (
    <section className="relative w-full py-16 overflow-hidden">
      {/* Subtle Grid Background for the section */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ 
          backgroundImage: `radial-gradient(${c('--foreground', '#000')} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <BackgroundDecorations type="trust" />

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((badge, i) => (
            <BadgeCard 
              key={i} 
              badge={badge} 
              c={c} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Extracted Card Component for cleaner logic
const BadgeCard = ({ badge, c }: { badge: any, c: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: badge.delay, duration: 0.5 }}
      whileHover="hover"
      className="group relative"
    >
      {/* Main Card Container */}
      <div 
        className="relative h-full flex items-center p-5 rounded-lg border transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: c('--background', '#fff'),
          borderColor: c('--border', '#e2e8f0'),
        }}
      >
        {/* Hover Effect: Glowing Border */}
        <div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1px ${c('--primary', '#3b82f6')}, 0 4px 20px -5px ${c('--primary', '#3b82f6')}30`
          }}
        />

        {/* Tech Decor: Corner Markers (The "Unique" HUD look) */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-300 group-hover:border-blue-500 transition-colors" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-300 group-hover:border-blue-500 transition-colors" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-300 group-hover:border-blue-500 transition-colors" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-300 group-hover:border-blue-500 transition-colors" />

        {/* Icon Section */}
        <div className="relative mr-5">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ 
              backgroundColor: `${c('--primary', '#3b82f6')}08`, // Very subtle fill
              border: `1px solid ${c('--primary', '#3b82f6')}20`
            }}
          >
            <badge.icon 
              className="w-6 h-6 transition-colors duration-300"
              style={{ color: c('--primary', '#3b82f6') }}
            />
          </div>
          
          {/* Decorative line connecting icon to text */}
          <div className="absolute top-1/2 -right-5 w-5 h-[1px] bg-slate-100 group-hover:bg-blue-100 transition-colors" />
        </div>

        {/* Text Section */}
        <div className="flex flex-col">
          <span 
            className="font-bold text-base tracking-tight mb-0.5"
            style={{ color: c('--foreground', '#020817') }}
          >
            {badge.title}
          </span>
          <span 
            className="text-xs font-medium uppercase tracking-wider opacity-60"
            style={{ color: c('--muted-foreground', '#64748b') }}
          >
            {badge.desc}
          </span>
        </div>

        {/* Hover "Active" Indicator Dot */}
        <div 
          className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ backgroundColor: c('--primary', '#3b82f6') }}
        />
      </div>
    </motion.div>
  )
}

export default TrustBadges