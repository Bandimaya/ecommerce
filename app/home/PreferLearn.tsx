"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Zap, Users, Target, Award, Star, ChevronRight, PlayCircle, Clock, BarChart } from "lucide-react"

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
  label: string
  icon: React.ComponentType<any>
  description: string
  paths: LearningPath[]
}

interface PreferLearnProps {
  getCSSVar?: (varName: string, fallback?: string) => string
}

const PreferLearn = ({ getCSSVar = (varName, fallback) => fallback ? `var(${varName}, ${fallback})` : `var(${varName})` }: PreferLearnProps) => {
  const [activeTab, setActiveTab] = useState<string>("online-classes")
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

  const tabs: TabContent[] = [
    {
      id: "diy-kits",
      label: "DIY Kits",
      icon: Zap,
      description: "Hands-on kits for practical, self-paced learning",
      paths: [ 
        {
          id: 1,
          title: "Robotics Explorer Kit",
          ageRange: "8-14 Yrs",
          image: "https://images.avishkaar.cc/misc/home/path/paths-robotics.webp",
          alt: "Robotics",
          description: "Build and program robots with sensors.",
          duration: "8-12 wks",
          level: "Beginner",
          skills: ["Coding", "Robotics"],
          rating: 4.8,
          enrolled: 1240
        },
        {
          id: 2,
          title: "Mechanical Eng.",
          ageRange: "8+ Yrs",
          image: "https://images.avishkaar.cc/misc/home/path/paths-mechanical design.webp",
          alt: "Mechanical Design",
          description: "Learn mechanics by building models.",
          duration: "6-10 wks",
          level: "Beginner",
          skills: ["3D Design", "Physics"],
          rating: 4.6,
          enrolled: 890
        },
        {
          id: 3,
          title: "Coding Fundamentals",
          ageRange: "5-10 Yrs",
          image: "https://images.avishkaar.cc/misc/home/path/paths-coding.webp",
          alt: "Coding",
          description: "Intro to visual programming blocks.",
          duration: "4-8 wks",
          level: "Beginner",
          skills: ["Logic", "Creativity"],
          rating: 4.9,
          enrolled: 2150
        },
        {
          id: 4,
          title: "Smart Home IoT",
          ageRange: "10-16 Yrs",
          image: "https://images.avishkaar.cc/misc/home/path/paths-iot_electronics.webp",
          alt: "IoT & Electronics",
          description: "Create smart devices with sensors.",
          duration: "10-14 wks",
          level: "Intermed.",
          skills: ["IoT", "Electronics"],
          rating: 4.7,
          enrolled: 760
        }
      ]
    },
    {
      id: "online-classes",
      label: "Live Classes",
      icon: Users,
      description: "Personalized online courses with expert instructors",
      paths: [
        {
          id: 5,
          title: "Coding Bootcamp",
          ageRange: "6-12 Yrs",
          image: "https://images.avishkaar.cc/misc/home/path/paths-coding.webp",
          alt: "Coding",
          description: "Live coding sessions & projects.",
          duration: "12 wks",
          level: "All Levels",
          skills: ["Python", "JS"],
          rating: 4.9,
          enrolled: 3420
        },
        {
          id: 6,
          title: "App Development",
          ageRange: "8-15 Yrs",
          image: "https://images.avishkaar.cc/misc/home/path/paths-app-dev.webp",
          alt: "App Dev",
          description: "Build mobile apps with real utility.",
          duration: "16 wks",
          level: "Intermed.",
          skills: ["UI/UX", "Mobile"],
          rating: 4.8,
          enrolled: 1280
        },
        {
          id: 7,
          title: "Advanced Robotics",
          ageRange: "8+ Yrs",
          image: "https://images.avishkaar.cc/misc/home/path/paths-robotics.webp",
          alt: "Robotics",
          description: "Master robotics with AI concepts.",
          duration: "20 wks",
          level: "Advanced",
          skills: ["AI", "CV"],
          rating: 4.7,
          enrolled: 920
        },
        {
          id: 8,
          title: "AI & Machine Learning",
          ageRange: "12+ Yrs",
          image: "https://images.avishkaar.cc/misc/home/path/paths-ai.webp",
          alt: "AI",
          description: "Intro to AI and data science.",
          duration: "14 wks",
          level: "Intermed.",
          skills: ["ML", "Data"],
          rating: 4.8,
          enrolled: 1850
        }
      ]
    }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)

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
          {/* Theme Badge (Centered with Double Lines) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-4 mb-4"
          >
            {/* Left Line */}
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

            {/* Right Line */}
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

        {/* --- COMPACT TAB SWITCHER --- */}
        <div className="flex justify-center mb-10">
          <div
            className="p-1 rounded-full border shadow-sm backdrop-blur-md relative inline-flex"
            style={{
              backgroundColor: `color-mix(in srgb, ${v('--card', '#fff')} 80%, transparent)`,
              borderColor: v('--border', '#e2e8f0')
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-6 py-2 rounded-full text-sm sm:text-base font-bold transition-all duration-300 z-10 flex items-center gap-2"
                  style={{ color: isActive ? v('--primary-foreground', '#ffffff') : v('--muted-foreground', '#64748b') }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
            <motion.div
              className="absolute top-1 bottom-1 rounded-full shadow-md z-0"
              layoutId="activeTabBackground"
              initial={false}
              animate={{
                left: activeTab === tabs[0].id ? '4px' : '50%',
                width: 'calc(50% - 4px)',
                x: activeTab === tabs[0].id ? 0 : 0
              }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              style={{
                background: `linear-gradient(135deg, ${v('--primary', '#3b82f6')}, ${v('--accent', '#8b5cf6')})`
              }}
            />
          </div>
        </div>

        {/* --- CARDS GRID --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto"
          >
            {activeTabData?.paths.map((path) => (
              <motion.div
                key={path.id}
                variants={cardVariants}
                className="h-full"
                layout
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
                      src={path.image}
                      alt={path.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform"
                      animate={hoveredCard === path.id ? { scale: 1.15 } : { scale: 1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Floating Badge (Top Left) */}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-white/90 text-black backdrop-blur-md text-[10px] px-2 py-0.5 border-0 font-bold shadow-sm">
                        {path.ageRange}
                      </Badge>
                    </div>

                    {/* Floating Rating (Top Right) */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-bold text-white">{path.rating}</span>
                    </div>

                    {/* Hover Play Button */}
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
                        {path.title}
                      </h3>
                    </div>

                    <p className="text-xs mb-3 line-clamp-2 leading-relaxed" style={{ color: v('--muted-foreground', '#64748b') }}>
                      {path.description}
                    </p>

                    <div className="flex items-center gap-3 mb-3 text-[11px] font-medium" style={{ color: v('--muted-foreground', '#64748b') }}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {path.duration}
                      </div>
                      <div className="w-[1px] h-3 bg-border" />
                      <div className="flex items-center gap-1">
                        <BarChart className="w-3 h-3" />
                        {path.level}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {path.skills.slice(0, 2).map((skill, i) => (
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
                      {/* Button Hover Effect Layer */}
                      <div className="absolute inset-0 bg-black/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 z-0" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* --- COMPARISON SECTION (Compact) --- */}
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