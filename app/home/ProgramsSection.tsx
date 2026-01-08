"use client"
import { useState, useEffect } from "react"
import { ArrowRight, Sparkles, Users, BookOpen, Rocket, ChevronRight, BarChart3, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import BackgroundDecorations from "./BackgroundDecorations"
import { apiFetch } from "@/lib/axios"
import { IMAGE_URL } from "@/lib/constants"

interface ProgramsSectionProps {
  getCSSVar?: (varName: string, fallback?: string) => string
}

// --------------------------------------------------------------------------
// Animation Variants for Staggered Entrance
// --------------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 50,
      damping: 15
    }
  }
} as const

// --------------------------------------------------------------------------
// UPDATED: Compact Professional Card
// --------------------------------------------------------------------------
const ProgramCard = ({ program }: { program: any }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:border-slate-300 transition-all duration-500 overflow-hidden cursor-pointer"
    >
      {/* 1. Header Image Area with Hover Zoom */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-500 z-10" />

        {/* Floating Category Badge - Glassmorphism */}
        <div className="absolute top-3 left-3 z-20">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md shadow-sm text-slate-700",
            "border border-white/50 tracking-wide"
          )}>
            {/* <program.icon className={cn("w-3.5 h-3.5", `text-${program.color}-600`)} /> */}
            {program.subtitle}
          </span>
        </div>

        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          src={IMAGE_URL + program.image}
          alt={program.title}
          className="w-full h-full object-cover transform will-change-transform"
        />
      </div>

      {/* 2. Content Body */}
      <div className="flex flex-col flex-grow p-5">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors mb-2 line-clamp-1">
            {program.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {program.description}
          </p>
        </div>

        {/* Features as Interactive Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {program.features.slice(0, 3).map((feature: string, i: number) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-600 tracking-wide transition-colors group-hover:bg-slate-100 group-hover:border-slate-200"
            >
              {feature}
            </span>
          ))}
          {program.features.length > 3 && (
            <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-400 group-hover:bg-slate-100">
              +{program.features.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Stats with subtle Icons */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {program.stats?.[1]?.value}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
              {program.stats?.[0]?.value}
            </div>
          </div>

          <Link href={`/programs/${program.id}`}>
            {/* Button: Neutral Slate/Black on hover, avoiding primary colors */}
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
              "bg-white border border-slate-200 text-slate-400 shadow-sm",
              "group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white group-hover:shadow-md group-hover:scale-105"
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

  const [programsData, setProgramsData] = useState([])

  useEffect(() => {
    apiFetch('/programs')
      .then((data) => setProgramsData(data))
      .catch((error) => console.error('Error fetching programs:', error))
  }, [])

  return (
    <section className="relative py-20 bg-slate-50/50 overflow-hidden">
      <BackgroundDecorations type="programs" />

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: isMobile ? '24px' : '40px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-[2px]"
              style={{ backgroundColor: `var(--accent)` }}
            />
            <span
              className={`${getResponsiveText.small} font-bold uppercase tracking-[0.2em]`}
              style={{ color: `var(--accent)` }}
            >
              Our Programs
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: isMobile ? '24px' : '40px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-[2px]"
              style={{ backgroundColor: `var(--accent)` }}
            />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center max-w-2xl">
            Empowering growth through <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">diverse learning paths.</span>
          </h2>
        </motion.div>

        {/* Staggered Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-7xl mx-auto"
        >
          {programsData.map((program: any) => (
            <ProgramCard key={program._id} program={program} />
          ))}
        </motion.div>

        {/* Minimalist Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-0 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <h4 className="text-lg font-bold text-slate-900">Not sure where to start?</h4>
            </div>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
              Our academic counselors are here to help you find the perfect path for your goals. Get a personalized roadmap today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
            <Button
              variant="outline"
              className="flex-1 md:flex-none border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-all"
            >
              View All Programs
            </Button>
            {/* Primary Action: Neutral Slate-900 Background */}
            <Button className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-slate-900/20 transition-all font-medium">
              Talk to an Expert <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default ProgramsSection