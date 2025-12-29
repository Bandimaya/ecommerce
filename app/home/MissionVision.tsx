"use client"

import { Quote, Target, Award, Sparkles, Rocket, Lightbulb, Users, Globe, BookOpen, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useI18n } from "@/contexts/I18nContext"
import { useState, useEffect } from "react"

interface MissionVisionProps {
  getCSSVar: (varName: string, fallback?: string) => string
}

interface MissionItem {
  title: string;
  description: string;
}

interface StatItem {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

const MissionVision = ({ getCSSVar }: MissionVisionProps) => {
  const { t } = useI18n()
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mission data
  const missionItems: MissionItem[] = [
    {
      title: "Accessible Education",
      description: "Democratize STEM learning through affordable, high-quality resources and platforms."
    },
    {
      title: "Hands-on Learning",
      description: "Bridge theory and practice with interactive kits, workshops, and real-world projects."
    },
    {
      title: "Community Building",
      description: "Foster collaborative environments where learners, educators, and innovators connect."
    },
    {
      title: "Future Readiness",
      description: "Equip students with 21st-century skills for careers in emerging technologies."
    }
  ]

  // Stats data
  const stats: StatItem[] = [
    { value: "10K+", label: "Students Trained", icon: Users, color: "from-blue-500 to-cyan-500" },
    { value: "200+", label: "Partner Schools", icon: Award, color: "from-purple-500 to-pink-500" },
    { value: "4.9★", label: "Satisfaction Rate", icon: Sparkles, color: "from-amber-500 to-orange-500" },
    { value: "50+", label: "Countries Reached", icon: Globe, color: "from-emerald-500 to-teal-500" },
    { value: "500+", label: "Learning Resources", icon: BookOpen, color: "from-violet-500 to-purple-500" },
    { value: "24/7", label: "Support Available", icon: Clock, color: "from-rose-500 to-pink-500" },
  ]

  // Responsive text sizes
  const getResponsiveText = {
    heading: isMobile ? "text-3xl" : "text-4xl md:text-5xl lg:text-6xl",
    subheading: isMobile ? "text-xl" : "text-2xl",
    body: isMobile ? "text-base" : "text-lg",
    small: isMobile ? "text-sm" : "text-base"
  }

  // Responsive spacing
  const getResponsiveSpacing = {
    section: isMobile ? "py-12" : "py-16 md:py-24 lg:py-32",
    container: isMobile ? "gap-8" : "gap-12 lg:gap-20",
    card: isMobile ? "p-6" : "p-8",
    stats: isMobile ? "gap-4" : "gap-6"
  }

  return (
    <section className={`relative ${getResponsiveSpacing.section} overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30`}>
      {/* Simplified background for mobile */}
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      
      {/* Reduced floating elements on mobile */}
      {!isMobile && (
        <>
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </>
      )}

      <div className="container px-4 mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
          className="text-center mb-12 md:mb-20"
        >
          {/* Subtitle */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-4"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: isMobile ? '20px' : '40px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px] bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <span className={`${getResponsiveText.small} font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600`}>
              Our Purpose
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: isMobile ? '20px' : '40px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px] bg-gradient-to-r from-purple-500 to-blue-500"
            />
          </motion.div>
          
          {/* Main Heading */}
          <h1 className={`${getResponsiveText.heading} font-bold tracking-tight mb-4 md:mb-6`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Mission & Vision
            </span>
          </h1>
          
          {/* Description */}
          <p className={`${getResponsiveText.body} text-slate-600 max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-4 md:px-0`}>
            Driving innovation through education, empowering the next generation of thinkers, creators, and problem solvers.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className={`grid lg:grid-cols-2 ${getResponsiveSpacing.container} items-start`}>
          {/* Left Column - Mission & Vision */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
            className="space-y-8 md:space-y-12"
          >
            {/* Vision Card */}
            <div className="group relative">
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl md:rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className={`relative bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl ${getResponsiveSpacing.card} border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${getResponsiveText.subheading} font-bold text-slate-900 mb-2`}>Our Vision</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </div>
                </div>
                <p className={`${getResponsiveText.body} text-slate-700 leading-relaxed`}>
                  To establish a global ecosystem where STEM education is accessible to all,
                  creating a world where every young mind has the tools and inspiration to
                  become tomorrow's innovators and leaders in technology.
                </p>
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <Rocket className="w-4 h-4" />
                    <span className="text-sm md:text-base">Accelerating innovation since 2020</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="group relative">
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl md:rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className={`relative bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl ${getResponsiveSpacing.card} border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${getResponsiveText.subheading} font-bold text-slate-900 mb-2`}>Our Mission</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  </div>
                </div>
                <ul className="space-y-4 md:space-y-5">
                  {missionItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 md:gap-4 group/item"
                    >
                      <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 mt-0.5 flex-shrink-0">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`${getResponsiveText.small} md:text-base font-semibold text-slate-900 mb-1 group-hover/item:text-purple-600 transition-colors truncate`}>
                          {item.title}
                        </h4>
                        <p className={`${getResponsiveText.small} text-slate-600 leading-relaxed`}>
                          {item.description}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Quote & Stats */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
            className="space-y-8"
          >
            {/* Founder's Quote */}
            <div className="relative group">
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl md:rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-xl overflow-hidden">
                {/* Decorative corner - Hidden on mobile */}
                {!isMobile && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-bl-full" />
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                      <Quote className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`${getResponsiveText.subheading} font-bold text-slate-900`}>Founder's Message</h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2" />
                    </div>
                  </div>

                  <blockquote className="mb-8 md:mb-10">
                    <p className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} leading-relaxed text-slate-800 italic mb-4 md:mb-6 relative`}>
                      <span className="absolute -left-2 -top-2 text-2xl md:text-4xl text-amber-500/30">"</span>
                      Education is not just about acquiring knowledge; it's about lighting the fire of curiosity that fuels lifelong innovation and discovery.
                      <span className="absolute -right-2 -bottom-2 text-2xl md:text-4xl text-amber-500/30">"</span>
                    </p>
                    <footer>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 flex-shrink-0">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="font-bold text-sm md:text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              SC
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <cite className="not-italic font-bold text-base md:text-lg text-slate-900 block truncate">
                            Sarah Chen
                          </cite>
                          <span className="text-sm md:text-base text-slate-600 truncate block">Founder & CEO</span>
                        </div>
                      </div>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-2 md:grid-cols-3 ${getResponsiveSpacing.stats}`}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: isMobile ? 0 : -5, transition: { duration: 0.2 } }}
                  className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg ${stat.color} flex items-center justify-center mb-3 md:mb-4`}>
                    <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-slate-900 mb-1`}>{stat.value}</div>
                  <div className={`${getResponsiveText.small} text-slate-600 font-medium line-clamp-2`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
          className="mt-12 md:mt-20 pt-6 md:pt-8 border-t border-slate-200/50"
        >
          <div className="text-center">
            <p className={`${getResponsiveText.body} text-slate-600 mb-6`}>
              Ready to join our mission of transforming STEM education?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg md:rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 text-sm md:text-base">
                Explore Programs
              </button>
              <button className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-slate-700 font-semibold rounded-lg md:rounded-xl border border-slate-300 hover:border-slate-400 hover:shadow-md transition-all duration-300 text-sm md:text-base">
                Partner With Us
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MissionVision