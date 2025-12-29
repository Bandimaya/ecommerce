"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Zap, Users, Target, Award, Star, ChevronRight, PlayCircle } from "lucide-react"

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

  const cssVars = {
    primary: () => getCSSVar('--primary', '#3b82f6'),
    'primary-foreground': () => getCSSVar('--primary-foreground', '#ffffff'),
    secondary: () => getCSSVar('--secondary', '#f8fafc'),
    accent: () => getCSSVar('--accent', '#8b5cf6'),
    warning: () => getCSSVar('--warning', '#f59e0b'),
    foreground: () => getCSSVar('--foreground', '#020817'),
    'muted-foreground': () => getCSSVar('--muted-foreground', '#64748b'),
    border: () => getCSSVar('--border', '#e2e8f0'),
    card: () => getCSSVar('--card', '#ffffff'),
    'font-display': () => getCSSVar('--font-display', 'system-ui, sans-serif'),
    background: () => getCSSVar('--background', '#ffffff'),
    success: () => getCSSVar('--success', '#10b981'),
  }

  const tabs: TabContent[] = [
    {
      id: "diy-kits",
      label: "DIY Kits",
      icon: Zap,
      description: "Hands-on kits for practical, self-paced learning with physical components",
      paths: [
        {
          id: 1,
          title: "Robotics Explorer Kit",
          ageRange: "Ages 8-14",
          image: "https://images.avishkaar.cc/misc/home/path/paths-robotics.webp",
          alt: "Robotics",
          description: "Build and program your own robots with sensors and motors",
          duration: "8-12 weeks",
          level: "Beginner to Intermediate",
          skills: ["Programming", "Electronics", "Mechanics"],
          rating: 4.8,
          enrolled: 1240
        },
        {
          id: 2,
          title: "Mechanical Engineering",
          ageRange: "Ages 8+",
          image: "https://images.avishkaar.cc/misc/home/path/paths-mechanical design.webp",
          alt: "Mechanical Design",
          description: "Learn mechanical principles through building working models",
          duration: "6-10 weeks",
          level: "Beginner",
          skills: ["3D Design", "Physics", "Problem Solving"],
          rating: 4.6,
          enrolled: 890
        },
        {
          id: 3,
          title: "Coding Fundamentals",
          ageRange: "Ages 5-10",
          image: "https://images.avishkaar.cc/misc/home/path/paths-coding.webp",
          alt: "Coding",
          description: "Introduction to coding with visual programming blocks",
          duration: "4-8 weeks",
          level: "Beginner",
          skills: ["Logic", "Creativity", "Sequencing"],
          rating: 4.9,
          enrolled: 2150
        },
        {
          id: 4,
          title: "Smart Home IoT",
          ageRange: "Ages 10-16",
          image: "https://images.avishkaar.cc/misc/home/path/paths-iot_electronics.webp",
          alt: "IoT & Electronics",
          description: "Create smart devices with sensors and connectivity",
          duration: "10-14 weeks",
          level: "Intermediate",
          skills: ["Electronics", "Programming", "IoT"],
          rating: 4.7,
          enrolled: 760
        }
      ]
    },
    {
      id: "online-classes",
      label: "Live Classes",
      icon: Users,
      description: "Personalized online courses with expert instructors and interactive sessions",
      paths: [
        {
          id: 5,
          title: "Coding Bootcamp",
          ageRange: "Ages 6-12",
          image: "https://images.avishkaar.cc/misc/home/path/paths-coding.webp",
          alt: "Coding",
          description: "Live coding sessions with project-based learning",
          duration: "12 weeks",
          level: "All Levels",
          skills: ["Python", "JavaScript", "Game Dev"],
          rating: 4.9,
          enrolled: 3420
        },
        {
          id: 6,
          title: "App Development",
          ageRange: "Ages 8-15",
          image: "https://images.avishkaar.cc/misc/home/path/paths-app-dev.webp",
          alt: "App Dev",
          description: "Build mobile apps with real-world applications",
          duration: "16 weeks",
          level: "Intermediate",
          skills: ["UI/UX", "Mobile Dev", "Testing"],
          rating: 4.8,
          enrolled: 1280
        },
        {
          id: 7,
          title: "Advanced Robotics",
          ageRange: "Ages 8+",
          image: "https://images.avishkaar.cc/misc/home/path/paths-robotics.webp",
          alt: "Robotics",
          description: "Master robotics with AI and computer vision",
          duration: "20 weeks",
          level: "Advanced",
          skills: ["AI", "CV", "Advanced Programming"],
          rating: 4.7,
          enrolled: 920
        },
        {
          id: 8,
          title: "AI & Machine Learning",
          ageRange: "Ages 12+",
          image: "https://images.avishkaar.cc/misc/home/path/paths-ai.webp",
          alt: "AI",
          description: "Introduction to artificial intelligence concepts",
          duration: "14 weeks",
          level: "Intermediate+",
          skills: ["ML", "Data Science", "Algorithms"],
          rating: 4.8,
          enrolled: 1850
        }
      ]
    }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <section
      className="relative py-12 sm:py-20 md:py-32 overflow-hidden"
      ref={containerRef}
      style={{
        backgroundColor: `color-mix(in srgb, ${cssVars.background()} 95%, ${cssVars.primary()} 5%)`,
        fontFamily: cssVars['font-display']()
      }}
    >
      {/* Slant Line Pattern Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              165deg,
              color-mix(in srgb, ${cssVars.background()} 98%, ${cssVars.primary()} 2%) 0%,
              color-mix(in srgb, ${cssVars.background()} 97%, ${cssVars.accent()} 3%) 25%,
              color-mix(in srgb, ${cssVars.background()} 96%, ${cssVars.primary()} 4%) 50%,
              color-mix(in srgb, ${cssVars.background()} 97%, ${cssVars.accent()} 3%) 75%,
              color-mix(in srgb, ${cssVars.background()} 98%, ${cssVars.primary()} 2%) 100%
            )`,
          }}
        />

        <div 
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                ${cssVars.primary()},
                ${cssVars.primary()} 1px,
                transparent 1px,
                transparent 40px
              ),
              repeating-linear-gradient(
                -45deg,
                ${cssVars.accent()},
                ${cssVars.accent()} 1px,
                transparent 1px,
                transparent 40px
              )
            `,
            backgroundSize: '56px 56px',
            backgroundPosition: '0 0, 0 0',
          }}
        />

        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(
                45deg,
                transparent 49%,
                ${cssVars.primary()} 49%,
                ${cssVars.primary()} 51%,
                transparent 51%
              ),
              linear-gradient(
                -45deg,
                transparent 49%,
                ${cssVars.accent()} 49%,
                ${cssVars.accent()} 51%,
                transparent 51%
              )
            `,
            backgroundSize: '80px 80px',
          }}
        />

        <div 
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 39px,
                ${cssVars.primary()} 39px,
                ${cssVars.primary()} 40px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 39px,
                ${cssVars.accent()} 39px,
                ${cssVars.accent()} 40px
              )
            `,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10" />
        
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(
              90deg,
              transparent 0%,
              ${cssVars.primary()} 25%,
              ${cssVars.accent()} 50%,
              ${cssVars.primary()} 75%,
              transparent 100%
            )`,
            animation: 'shimmer 3s infinite',
          }}
        />
        
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>

      <div className="absolute top-1/4 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-300/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container px-4 sm:px-6 mx-auto relative z-10 max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-24 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-3 sm:mb-4"
          >
            <motion.div
              className="h-[2px]"
              style={{ backgroundColor: cssVars.accent(), width: '40px' }}
            />
            <span
              className="text-sm sm:text-base font-semibold uppercase tracking-wider"
              style={{ color: cssVars.accent() }}
            >
              Personalized Learning
            </span>
            <motion.div
              className="h-[2px]"
              style={{ backgroundColor: cssVars.accent(), width: '40px' }}
            />
          </motion.div>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">
              <span style={{ color: cssVars.foreground() }} className="block">How Would Your Child</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 block">
                Prefer to Learn?
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: cssVars['muted-foreground']() }}>
              Choose the perfect learning method that matches your child's style and pace.
              Both paths lead to the same destination: mastery and confidence.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mt-8 sm:mt-12">
            {[
              { value: "10K+", label: "Students Enrolled", icon: Users },
              { value: "4.8★", label: "Average Rating", icon: Star },
              { value: "95%", label: "Completion Rate", icon: Target },
              { value: "50+", label: "Expert Mentors", icon: Award }
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center min-w-[40%] sm:min-w-0"
                >
                  <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: cssVars.primary() }} />
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold" style={{ color: cssVars.foreground() }}>{stat.value}</div>
                  </div>
                  <div className="text-xs sm:text-sm font-medium" style={{ color: cssVars['muted-foreground']() }}>{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <div className="flex flex-col items-center mb-12 sm:mb-16">
          <div className="w-full max-w-md mx-auto px-2 sm:px-0">
            <div
              className="inline-flex p-1 rounded-2xl border mb-6 sm:mb-8 relative w-full"
              style={{
                backgroundColor: `color-mix(in srgb, ${cssVars.background()} 10%, transparent)`,
                borderColor: cssVars.border(),
              }}
            >
              <div className="relative flex w-full">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="relative flex-1 px-3 sm:px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 z-10"
                      style={{
                        color: isActive ? cssVars['primary-foreground']() : cssVars['muted-foreground']()
                      }}
                    >
                      <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-20">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </div>
                    </button>
                  )
                })}

                <motion.div
                  layoutId="activeTab"
                  className="absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] rounded-xl"
                  style={{
                    background: `linear-gradient(to right, ${cssVars.primary()}, ${cssVars.accent()})`,
                    boxShadow: `0 2px 8px -1px ${cssVars.accent()}4D`,
                  }}
                  animate={{
                    x: activeTab === 'diy-kits' ? '0%' : '100%'
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`desc-${activeTab}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center px-4 sm:px-0"
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4" style={{ color: cssVars.foreground() }}>
                  {activeTabData?.description}
                </h3>
                <p className="text-xs sm:text-sm md:text-base" style={{ color: cssVars['muted-foreground']() }}>
                  Select your preferred learning style to explore available paths
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {activeTabData?.paths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  onMouseEnter={() => setHoveredCard(path.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="h-full"
                >
                  <Card 
                    className="group relative h-full overflow-hidden border hover:shadow-lg sm:hover:shadow-xl transition-all duration-500 backdrop-blur-sm"
                    style={{ backgroundColor: `color-mix(in srgb, ${cssVars.card()} 90%, transparent)`, borderColor: cssVars.border() }}
                  >
                    <div 
                      className="absolute -inset-2 sm:-inset-4 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{ background: `linear-gradient(to bottom right, ${cssVars.primary()}0D, ${cssVars.accent()}0D)` }}
                    />

                    <div className="relative">
                      <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-lg">
                        <motion.img
                          src={path.image}
                          alt={path.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          animate={hoveredCard === path.id ? { scale: 1.05 } : { scale: 1 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <motion.button
                          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <PlayCircle className="w-4 h-4" style={{ color: cssVars.accent() }} />
                        </motion.button>
                      </div>

                      <CardContent className="p-4 sm:p-6">
                        <div className="mb-3 sm:mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{ borderColor: cssVars.border(), color: cssVars['muted-foreground']() }}
                            >
                              {path.ageRange}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs sm:text-sm font-semibold" style={{ color: cssVars['muted-foreground']() }}>{path.rating}</span>
                            </div>
                          </div>

                          <CardTitle className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 line-clamp-2 transition-colors" style={{ color: cssVars.foreground() }}>
                            {path.title}
                          </CardTitle>

                          <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2" style={{ color: cssVars['muted-foreground']() }}>
                            {path.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div>
                            <div className="text-xs mb-1" style={{ color: cssVars['muted-foreground']() }}>Duration</div>
                            <div className="text-xs sm:text-sm font-semibold" style={{ color: cssVars.foreground() }}>{path.duration}</div>
                          </div>
                          <div>
                            <div className="text-xs mb-1" style={{ color: cssVars['muted-foreground']() }}>Level</div>
                            <div className="text-xs sm:text-sm font-semibold" style={{ color: cssVars.foreground() }}>{path.level}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                          {path.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs rounded-md"
                              style={{
                                backgroundColor: cssVars.secondary(),
                                color: cssVars['muted-foreground'](),
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 sm:p-6 pt-0">
                        <Button
                          className="w-full group/btn gap-2 sm:gap-3 rounded-xl py-3 sm:py-4 md:py-6 text-sm sm:text-base font-semibold transition-all duration-300"
                          style={{
                            background: `linear-gradient(to right, ${cssVars.primary()}, ${cssVars.accent()})`,
                            color: cssVars['primary-foreground'](),
                            boxShadow: `0 4px 20px -2px ${cssVars.accent()}33`,
                          }}
                        >
                          <span>Start Learning</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-24"
        >
          <div
            className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border"
            style={{
              backgroundColor: `color-mix(in srgb, ${cssVars.background()} 70%, transparent)`,
              borderColor: `color-mix(in srgb, ${cssVars.primary()} 10%, transparent)`,
            }}
          >
            <motion.div
              className="flex justify-center items-center gap-3 mb-3 sm:mb-4"
            >
              <div className="h-[2px]" style={{ backgroundColor: cssVars.accent(), width: '40px' }} />
              <span className="text-sm sm:text-base font-semibold uppercase tracking-wider" style={{ color: cssVars.accent() }}>
                Still Unsure Which to Choose?
              </span>
              <div className="h-[2px]" style={{ backgroundColor: cssVars.accent(), width: '40px' }} />
            </motion.div>
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <p className="text-sm sm:text-base md:text-lg" style={{ color: cssVars['muted-foreground']() }}>
                Compare both methods to find the perfect fit for your child's learning style
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
              <div className="backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border"
                style={{
                  backgroundColor: `color-mix(in srgb, ${cssVars.card()} 80%, transparent)`,
                  borderColor: `color-mix(in srgb, ${cssVars.primary()} 20%, transparent)`,
                }}
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl" style={{ backgroundColor: cssVars.primary() }}>
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold" style={{ color: cssVars.foreground() }}>DIY Kits</h4>
                    <p className="text-xs sm:text-sm" style={{ color: cssVars['muted-foreground']() }}>Best for hands-on learners</p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {["Self-paced learning", "Physical project building", "No schedule constraints", "Keep the kits forever"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 sm:gap-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cssVars.primary() }} />
                      <span className="text-sm sm:text-base" style={{ color: cssVars['muted-foreground']() }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border"
                style={{
                  backgroundColor: `color-mix(in srgb, ${cssVars.card()} 80%, transparent)`,
                  borderColor: `color-mix(in srgb, ${cssVars.accent()} 20%, transparent)`,
                }}
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl" style={{ backgroundColor: cssVars.accent() }}>
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold" style={{ color: cssVars.foreground() }}>Live Classes</h4>
                    <p className="text-xs sm:text-sm" style={{ color: cssVars['muted-foreground']() }}>Best for social learners</p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {["Live instructor guidance", "Interactive peer learning", "Structured curriculum", "Regular feedback"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 sm:gap-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cssVars.accent() }} />
                      <span className="text-sm sm:text-base" style={{ color: cssVars['muted-foreground']() }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-20 text-center"
        >
          <div className="flex justify-center items-center gap-3 mb-3 sm:mb-4">
            <div className="h-[2px]" style={{ backgroundColor: cssVars.accent(), width: '40px' }} />
            <span className="text-sm sm:text-base font-semibold uppercase tracking-wider" style={{ color: cssVars.accent() }}>
              Ready to Begin Your Child's Learning Journey?
            </span>
            <div className="h-[2px]" style={{ backgroundColor: cssVars.accent(), width: '40px' }} />
          </div>
          

          <div className="max-w-2xl mx-auto">
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-10" style={{ color: cssVars['muted-foreground']() }}>
              Book a free consultation with our education specialists to find the perfect learning path
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2 sm:gap-3 rounded-xl px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${cssVars.primary()}, ${cssVars.accent()})`,
                  color: cssVars['primary-foreground'](),
                  boxShadow: `0 4px 20px -2px ${cssVars.primary()}33`,
                }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                Book Free Consultation
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2 sm:gap-3 rounded-xl px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-base md:text-lg font-semibold border-2 transition-all duration-300"
                style={{
                  borderColor: cssVars.border(),
                  color: cssVars.foreground(),
                  backgroundColor: 'transparent'
                }}
              >
                Download Learning Guide
              </Button>
            </div>

            <p className="mt-6 sm:mt-8 text-xs sm:text-sm" style={{ color: cssVars['muted-foreground']() }}>
              14-day money-back guarantee • Certified instructors • Progress tracking included
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PreferLearn