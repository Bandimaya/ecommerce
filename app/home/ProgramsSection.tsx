"use client"
import { useState, useEffect } from "react"
import { ArrowRight, Sparkles, Users, BookOpen, Target, Zap, Globe, Rocket, ChevronRight, BarChart3, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import BackgroundDecorations from "./BackgroundDecorations"

interface ProgramsSectionProps {
  getCSSVar?: (varName: string, fallback?: string) => string
}

// --------------------------------------------------------------------------
// UPDATED: Compact Professional Card
// --------------------------------------------------------------------------
const ProgramCard = ({ program, index }: { program: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden"
    >
      {/* 1. Compact Header Image Area */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
        
        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 backdrop-blur-sm shadow-sm text-slate-700",
            "border border-slate-100"
          )}>
            <program.icon className={cn("w-3.5 h-3.5", `text-${program.color}-600`)} />
            {program.subtitle}
          </span>
        </div>

        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Content Body - High Density */}
      <div className="flex flex-col flex-grow p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
            {program.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {program.description}
          </p>
        </div>

        {/* Features as Pills (Space saving) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {program.features.slice(0, 3).map((feature: string, i: number) => ( // Show top 3 only
            <span 
              key={i} 
              className="px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-600 tracking-wide"
            >
              {feature}
            </span>
          ))}
          {program.features.length > 3 && (
            <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-400">
              +{program.features.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Actions - Pushed to bottom */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Compact Stats Row */}
             <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Users className="w-3.5 h-3.5" />
                {program.stats[1].value}
             </div>
             <div className="w-px h-3 bg-slate-200" />
             <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <BarChart3 className="w-3.5 h-3.5" />
                {program.stats[0].value}
             </div>
          </div>

          <Link href={`/programs/${program.id}`}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
              "bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white"
            )}>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// Reusable Section Header (Kept similar but refined spacing)
// --------------------------------------------------------------------------
const SectionHeader = ({
  badge,
  title,
  description,
  align = "center",
  maxWidth = "4xl", // Reduced max width for tighter reading
}: any) => {
  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto"
  };

  return (
    <div className={cn("mb-12 md:mb-16 relative z-10", alignClasses[align])} style={{ maxWidth }}>
      {/* Refined Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4"
      >
        <Sparkles className="w-3 h-3" />
        {badge}
      </motion.div>

      {/* Tighter Typography */}
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4"
      >
        <span className="block text-slate-900">{title.part1}</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
          {title.part2}
        </span>
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-slate-500 text-lg leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  )
}

// --------------------------------------------------------------------------
// Main Programs Section
// --------------------------------------------------------------------------
const ProgramsSection = ({ getCSSVar }: ProgramsSectionProps) => {
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getResponsiveText = {
    small: isMobile ? "text-sm" : "text-base"
  }

  const programs = [
    {
      id: 'stem-clubs',
      title: 'STEM Clubs & Workshops',
      subtitle: 'Hands-on Learning',
      description: 'Engage in practical STEM projects through interactive clubs. Robotics, coding, and science experiments.',
      icon: Rocket,
      color: 'purple',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a783?q=80&w=2070&auto=format&fit=crop',
      stats: [
        { label: 'Active Clubs', value: '50+ Clubs' },
        { label: 'Students', value: '200+ Students' },
      ],
      features: ['Robotics', 'Coding', 'Science', 'Teamwork'],
    },
    {
      id: 'academic-support',
      title: 'Academic Excellence',
      subtitle: 'Tutoring',
      description: 'One-on-one and group tutoring sessions to help students excel in math, science, and languages.',
      icon: BookOpen,
      color: 'amber',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop',
      stats: [
        { label: 'Success', value: '95% Pass' },
        { label: 'Tutors', value: '100+ Tutors' },
      ],
      features: ['Math', 'Science', 'Homework Help', 'Prep'],
    },
    {
      id: 'summer-camps',
      title: 'Summer Adventures',
      subtitle: 'Seasonal Camps',
      description: 'Immersive summer programs combining education with outdoor activities and creative exploration.',
      icon: Globe,
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop',
      stats: [
        { label: 'Weeks', value: '8 Weeks' },
        { label: 'Campers', value: '500+ Kids' },
      ],
      features: ['Outdoor', 'Arts', 'STEM', 'Trips'],
    },
    {
      id: 'teacher-training',
      title: 'Educator Training',
      subtitle: 'Professional Dev',
      description: 'Comprehensive certification programs for educators to master modern teaching methodologies.',
      icon: Users,
      color: 'emerald',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
      stats: [
        { label: 'Certified', value: '300+ Grads' },
        { label: 'Schools', value: '50+ Partners' },
      ],
      features: ['Pedagogy', 'Tech', 'Management', 'Cert'],
    }
  ]

  return (
    <section className="relative py-20 bg-slate-50/50 overflow-hidden">
      <BackgroundDecorations type="programs" />

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        
           {/* Subtitle */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-6"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: isMobile ? '24px' : '48px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px]"
              style={{ backgroundColor: `var(--accent)` }}
            />

            <span
              className={`${getResponsiveText.small} font-semibold uppercase tracking-widest`}
              style={{ color: `var(--accent)` }}
            >
              Our Programs
            </span>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: isMobile ? '24px' : '48px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px]"
              style={{ backgroundColor: `var(--accent)` }}
            />
          </motion.div>

        {/* Compact Grid - Changed to grid-cols-4 for large screens to emphasize 'Small & Pro' */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-7xl mx-auto">
          {programs.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} />
          ))}
        </div>

        {/* Minimalist Footer CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-lg"
        >
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1">Not sure where to start?</h4>
            <p className="text-slate-500 text-sm">Our academic counselors are here to guide you.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none border-slate-200 hover:bg-slate-50">
              View All Programs
            </Button>
            <Button className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white">
              Talk to an Expert <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default ProgramsSection