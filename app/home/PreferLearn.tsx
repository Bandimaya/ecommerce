"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Zap, Users, Target, Award, Star, ChevronRight, PlayCircle, Clock, BarChart } from "lucide-react"
import { apiFetch } from "@/lib/axios"
import { IMAGE_URL } from "@/lib/constants"

interface LearningPath {
  id: number
  title: string
  ageRange: string
  image: string
  alt: string
  description: string
  duration: string
  level: string
  skills: string[]
  rating: number
  enrolled: number
}

interface TabContent {
  id: string
  _id?: string
  label: string
  icon: React.ComponentType<any>
  description: string
  paths: LearningPath[]
}

interface PreferLearnProps {
  getCSSVar?: (varName: string, fallback?: string) => string
}

const PreferLearn = ({ getCSSVar = (varName, fallback) => fallback ? `var(${varName}, ${fallback})` : `var(${varName})` }: PreferLearnProps) => {
  const [activeTab, setActiveTab] = useState<string>("")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Helper to access CSS variables cleanly
  const v = (name: string, fb: string) => getCSSVar(name, fb)

  // Animation Variants for Staggered Entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 120, damping: 20 }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  }

  const [sections, setSections] = useState<string[]>([])
  const [sectionCourses, setSectionCourses] = useState([])
  const [data, setData] = useState<any>([])

  useEffect(() => {
    Promise.all([
      apiFetch('/sections'),
      apiFetch('/section-courses')
    ]).then(([sectionsData, setCoursesData]) => {
      setSections(sectionsData)
      setSectionCourses(setCoursesData)
      let mainData: any[] = []
      
      sectionsData.forEach((section: any, index: number) => {
        const courses = setCoursesData.filter((item: any) => item.sectionId?._id === section._id)
        // Assigning alternating icons for visual variety if needed
        const icon = index % 2 === 0 ? Zap : Users; 
        mainData.push({ ...section, paths: courses, icon: icon, label: section.name || section.label }) 
      })
      
      setData(mainData)

      if (mainData.length > 0) {
        setActiveTab(mainData[0]._id)
      }
    })
  }, [])

  const displayData = data.length > 0 ? data : []
  const activeTabData = displayData.find((tab: any) => tab._id === activeTab)

  return (
    <section
      className="relative py-12 sm:py-20 overflow-hidden w-full"
      ref={containerRef}
      style={{
        backgroundColor: v('--background', '#ffffff'),
        fontFamily: v('--font-display', 'system-ui, sans-serif')
      }}
    >
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${v('--primary', '#3b82f6')}15 0%, transparent 70%)`
          }}
        />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="container px-4 sm:px-6 mx-auto relative z-10 max-w-7xl">

        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          {/* Theme Badge */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-4 mb-4"
          >
            <motion.div
              className="h-[2px]"
              initial={{ width: 0 }}
              whileInView={{ width: '40px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ backgroundColor: v('--primary', '#3b82f6') }}
            />

            <span
              className="text-xs sm:text-sm font-bold uppercase tracking-widest whitespace-nowrap"
              style={{ color: v('--primary', '#3b82f6') }}
            >
              Personalized Learning
            </span>

            <motion.div
              className="h-[2px]"
              initial={{ width: 0 }}
              whileInView={{ width: '40px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ backgroundColor: v('--primary', '#3b82f6') }}
            />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span style={{ color: v('--foreground', '#020817') }}>How Would They</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Prefer to Learn?
            </span>
          </h2>

          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: v('--muted-foreground', '#64748b') }}>
            Choose the perfect learning method. Both paths lead to mastery.
          </p>
        </motion.div>

        {/* --- DYNAMIC GRID SWITCHER --- */}
        {/* Changed from Flex to Grid to handle more buttons gracefully */}
        <div className="flex justify-center mb-10 w-full">
            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2 rounded-2xl border shadow-sm backdrop-blur-md w-full max-w-5xl"
                style={{
                    backgroundColor: `color-mix(in srgb, ${v('--card', '#fff')} 80%, transparent)`,
                    borderColor: v('--border', '#e2e8f0')
                }}
            >
            {displayData.map((tab: any) => {
              const isActive = activeTab === tab._id
              const Icon = tab.icon || Sparkles 
              
              return (
                <button
                  key={tab._id}
                  onClick={() => setActiveTab(tab._id)}
                  className="relative w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 z-10 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden"
                  style={{
                    color: isActive ? v('--primary-foreground', '#ffffff') : v('--muted-foreground', '#64748b')
                  }}
                >
                  {/* Active Background Pill - Adapts to Grid Cell Size */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 rounded-xl shadow-md -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{
                        backgroundColor: v('--primary', '#3b82f6')
                      }}
                    />
                  )}
                  
                  <span className="relative z-10 flex items-center gap-2 truncate">
                     {/* Optional: Add icon back if desired */}
                     {/* <Icon className="w-4 h-4 shrink-0" /> */}
                     <span className="truncate">{tab.name || tab.label}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* --- CARDS GRID --- */}
        <AnimatePresence mode="wait">
          {activeTabData && (
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto"
            >
              {activeTabData.paths?.map((path: any) => (
                <motion.div
                  key={path._id || path.id}
                  variants={cardVariants}
                  className="h-full"
                  onMouseEnter={() => setHoveredCard(path.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover="hover"
                >
                  <Card
                    className="group relative h-full overflow-hidden border transition-all duration-300 flex flex-col hover:shadow-2xl hover:border-primary/20"
                    style={{
                      backgroundColor: v('--card', '#ffffff'),
                      borderColor: v('--border', '#e2e8f0')
                    }}
                  >
                    {/* Compact Image Section */}
                    <div className="relative h-36 overflow-hidden">
                      <motion.img
                        src={IMAGE_URL + path.image}
                        alt={path.alt || path.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform"
                        animate={hoveredCard === path.id ? { scale: 1.15 } : { scale: 1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-2 left-2">
                        <Badge className="bg-white/90 text-black backdrop-blur-md text-[10px] px-2 py-0.5 border-0 font-bold shadow-sm">
                          {path.ageRange || "8+ Yrs"}
                        </Badge>
                      </div>

                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-bold text-white">{path.rating || 4.5}</span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={hoveredCard === path.id ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-lg"
                        >
                          <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                        </motion.div>
                      </div>
                    </div>

                    <CardContent className="p-4 flex-grow flex flex-col relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300" style={{ color: v('--foreground', '#020817') }}>
                          {path.title || path.name}
                        </h3>
                      </div>

                      <p className="text-xs mb-3 line-clamp-2 leading-relaxed" style={{ color: v('--muted-foreground', '#64748b') }}>
                        {path.description}
                      </p>

                      <div className="flex items-center gap-3 mb-3 text-[11px] font-medium" style={{ color: v('--muted-foreground', '#64748b') }}>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {path.duration || "Self Paced"}
                        </div>
                        <div className="w-[1px] h-3 bg-border" />
                        <div className="flex items-center gap-1">
                          <BarChart className="w-3 h-3" />
                          {path.level || "Beginner"}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {path.skills?.slice(0, 2).map((skill: any, i: any) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[10px] rounded-md border bg-secondary/50 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors duration-300"
                            style={{
                              borderColor: v('--border', '#e2e8f0'),
                              color: v('--muted-foreground', '#64748b'),
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full h-9 text-sm font-medium rounded-lg shadow-md group/btn transition-all duration-300 overflow-hidden relative border-0"
                        style={{
                          backgroundColor: v('--primary', '#3b82f6'),
                          color: v('--primary-foreground', '#ffffff'),
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          View Details <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-black/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 z-0" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- COMPARISON SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block backdrop-blur-sm rounded-2xl p-6 border max-w-4xl mx-auto w-full shadow-sm hover:shadow-md transition-shadow duration-300"
            style={{
              backgroundColor: `color-mix(in srgb, ${v('--background', '#ffffff')} 60%, transparent)`,
              borderColor: v('--border', '#e2e8f0')
            }}
          >
            <h4 className="text-lg font-bold mb-4" style={{ color: v('--foreground', '#020817') }}>Why choose our paths?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100 transition-transform duration-200"
              >
                <div className="p-2 h-fit bg-blue-500 rounded-lg text-white shadow-sm"><Zap className="w-4 h-4" /></div>
                <div>
                  <div className="font-bold text-sm text-blue-900">DIY Kits</div>
                  <div className="text-xs text-blue-700/80">Keep kits forever, learn at your pace, hands-on.</div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100 transition-transform duration-200"
              >
                <div className="p-2 h-fit bg-purple-500 rounded-lg text-white shadow-sm"><Users className="w-4 h-4" /></div>
                <div>
                  <div className="font-bold text-sm text-purple-900">Live Classes</div>
                  <div className="text-xs text-purple-700/80">Expert mentorship, social learning, structure.</div>
                </div>
              </motion.div>
            </div>

            <div className="mt-6">
              <Button variant="link" className="text-sm gap-1 hover:no-underline group" style={{ color: v('--primary', '#3b82f6') }}>
                Need help deciding? Book a free call
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default PreferLearn