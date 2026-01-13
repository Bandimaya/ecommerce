"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Users, 
  Star, 
  ChevronRight, 
  PlayCircle, 
  Clock, 
  BarChart,
  X,
  Award,
  CheckCircle,
  BookOpen,
  Download,
  Share2,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  Loader2
} from "lucide-react"
import { apiFetch } from "@/lib/axios"
import { IMAGE_URL } from "@/lib/constants"

interface PreferLearnProps {
  getCSSVar?: (varName: string, fallback?: string) => string
}

interface CourseModalProps {
  course: any
  onClose: () => void
  isSaved: boolean
  onToggleSave: () => void
}

// --- Custom Hooks ---

const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked && typeof document !== 'undefined') {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = originalStyle }
    }
  }, [isLocked])
}

const useSavedCourses = () => {
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saved_courses')
      if (saved) setSavedIds(JSON.parse(saved))
    }
  }, [])

  const toggleSave = (id: string) => {
    const newIds = savedIds.includes(id) 
      ? savedIds.filter(savedId => savedId !== id)
      : [...savedIds, id]
    
    setSavedIds(newIds)
    localStorage.setItem('saved_courses', JSON.stringify(newIds))
    
    if (!savedIds.includes(id)) {
      alert("Added to wishlist")
    }
  }

  return { savedIds, toggleSave }
}

// --- Helper Functions ---

const handleShare = async (course: any) => {
  const shareData = {
    title: course.title || course.name,
    text: `Check out this course: ${course.title || course.name}`,
    url: window.location.href, 
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('Error sharing:', err)
    }
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!") 
  }
}

const handleDownloadSyllabus = (course: any) => {
  if (!course.syllabusPdf && !course.syllabusUrl) {
    alert("Syllabus not available for download yet.") 
    return
  }
  
  const link = document.createElement('a')
  link.href = course.syllabusPdf || course.syllabusUrl
  link.download = `${course.title || 'course'}-syllabus.pdf`
  link.target = "_blank"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  alert("Download started") 
}

// --- Components ---

const CourseModal = ({ course, onClose, isSaved, onToggleSave }: CourseModalProps) => {
  useScrollLock(true)
  const modalRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  
  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen, show: true },
    { id: "curriculum", label: "Curriculum", icon: Award, show: !!(course.curriculum && course.curriculum.length > 0) },
    { id: "instructor", label: "Instructor", icon: Users, show: !!course.instructor },
    { id: "reviews", label: "Reviews", icon: Star, show: !!(course.reviews && course.reviews.length > 0) }
  ].filter(tab => tab.show)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        showEnrollModal ? setShowEnrollModal(false) : onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [showEnrollModal, onClose])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-[10000] top-20 md:top-20 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          // UPDATED: Layout Logic
          // flex-col on mobile (stack), md:flex-row on desktop (side-by-side)
          className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[90vh] flex flex-col md:flex-row pointer-events-auto"
        >
          {/* Close Button - Positioned top right of the whole modal */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm border border-slate-200"
          >
            <X size={20} />
          </button>

          {/* --- LEFT COLUMN: IMAGE (50%) --- */}
          <div className="w-full md:w-1/2 h-48 md:h-full relative bg-slate-100 flex-shrink-0">
            <img
              src={course.image ? (IMAGE_URL + course.image) : "https://placehold.co/800x800?text=Course+Image"}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/800x800?text=No+Image" }}
            />
            {/* Overlay gradient for aesthetics only, no text here anymore */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* --- RIGHT COLUMN: CONTENT (50%) --- */}
          <div className="w-full md:w-1/2 flex flex-col h-full bg-white overflow-hidden">
            
            {/* Header Content (Moved from Image Overlay to here) */}
            <div className="px-6 pt-6 pb-2 flex-shrink-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                 <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                  {course.ageRange || "All Ages"}
                </Badge>
                {/* Mobile View Rating (since stats bar might scroll) */}
                <div className="flex items-center gap-1 md:hidden">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm">{course.rating || "New"}</span>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight text-slate-900">
                {course.title || course.name}
              </h2>
              <p className="text-slate-500 text-sm md:text-base line-clamp-2">
                {course.shortDescription || course.description}
              </p>
            </div>

            {/* Stats Bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex-shrink-0 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-6 min-w-max">
                <div className="flex items-center gap-2 hidden md:flex">
                  <div className="p-1.5 bg-blue-50 rounded-lg"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /></div>
                  <div className="text-xs font-medium text-slate-700">{course.rating || "New"} Rating</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-50 rounded-lg"><Clock className="w-4 h-4 text-green-600" /></div>
                  <div className="text-xs font-medium text-slate-700">{course.duration || "Self Paced"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-50 rounded-lg"><BarChart className="w-4 h-4 text-amber-600" /></div>
                  <div className="text-xs font-medium text-slate-700">{course.level || "Beginner"}</div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="px-6 pt-2 flex-shrink-0 border-b border-slate-100">
              <div className="flex space-x-4 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                          ? "border-blue-600 text-blue-600" 
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-50/50">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">About this Course</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {course.description || "No description provided."}
                    </p>
                  </div>
                  
                  {course.outcomes && course.outcomes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-3">What You'll Learn</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {course.outcomes.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "curriculum" && course.curriculum && (
                <div className="space-y-3">
                  {course.curriculum.map((module: any, index: number) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-colors shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{module.title || `Module ${index + 1}`}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {module.lessonsCount ? `${module.lessonsCount} lessons` : ''} 
                            {module.duration ? ` • ${module.duration}` : ''}
                          </div>
                        </div>
                        <PlayCircle className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === "instructor" && course.instructor && (
                <div>
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100">
                        <img 
                          src={course.instructor.avatar ? (IMAGE_URL + course.instructor.avatar) : "https://placehold.co/100"} 
                          alt={course.instructor.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">{course.instructor.name}</h4>
                        <p className="text-slate-500 text-sm">{course.instructor.role || "Instructor"}</p>
                      </div>
                   </div>
                   <p className="text-slate-600 text-sm leading-relaxed">
                      {course.instructor.bio}
                   </p>
                </div>
              )}
              
              {activeTab === "reviews" && course.reviews && (
                <div className="space-y-3">
                  {course.reviews.map((review: any, index: number) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {review.user ? review.user.charAt(0) : "U"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{review.user || "User"}</div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-2.5 h-2.5 ${i < (review.rating || 5) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex-shrink-0 z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className={`h-10 w-10 ${isSaved ? "text-red-500 border-red-200 bg-red-50" : ""}`}
                    onClick={onToggleSave}
                    title="Save Course"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleShare(course)}
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleDownloadSyllabus(course)}
                    title="Download Syllabus"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end flex-1">
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                    </div>
                    {course.originalPrice && (
                      <div className="text-xs text-slate-500 line-through">₹{course.originalPrice}</div>
                    )}
                  </div>
                  <Button 
                    onClick={() => setShowEnrollModal(true)}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-6"
                  >
                    Enroll Now
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showEnrollModal && (
          <EnrollModal 
            course={course} 
            onClose={() => setShowEnrollModal(false)} 
          />
        )}
      </AnimatePresence>
    </>
  )
}

const EnrollModal = ({ course, onClose }: { course: any; onClose: () => void }) => {
  useScrollLock(true)
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const messageText = `Hi, I'm interested in the course: ${course.title || course.name}.`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} className="text-slate-400" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={28} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Start Learning Today</h3>
          <p className="text-slate-600 mb-1">You're inquiring about:</p>
          <p className="font-semibold text-blue-600 text-lg mb-4">{course.title || course.name}</p>
        </div>

        <div className="space-y-3 mb-6">
          <Button 
            onClick={() => {
              window.open(`https://wa.me/1234567890?text=${encodeURIComponent(messageText)}`, '_blank')
              onClose()
            }}
            className="w-full h-12 gap-3 bg-green-500 hover:bg-green-600 text-white"
          >
            <Phone size={20} />
            Continue on WhatsApp
          </Button>
          
          <Button 
            onClick={() => {
              window.location.href = `mailto:info@example.com?subject=Enquiry: ${course.title}&body=${messageText}`
              onClose()
            }}
            variant="outline"
            className="w-full h-12 gap-3"
          >
            <Mail size={20} />
            Send Email Inquiry
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const PreferLearn = ({ getCSSVar = (varName, fallback) => fallback ? `var(${varName}, ${fallback})` : `var(${varName})` }: PreferLearnProps) => {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [hoveredCard, setHoveredCard] = useState<string | number | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { savedIds, toggleSave } = useSavedCourses()

  const v = (name: string, fb: string) => getCSSVar(name, fb)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
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
    hover: { y: -8, transition: { duration: 0.3 } }
  }

  // Real-time data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [sectionsData, coursesData] = await Promise.all([
          apiFetch('/sections'),
          apiFetch('/section-courses')
        ])
        
        // Map sections to their courses
        const mappedData = sectionsData.map((section: any) => {
          const courses = coursesData.filter((item: any) => 
            // Handle different ID structures from APIs
            (item.sectionId?._id === section._id) || (item.sectionId === section._id)
          )
          return { 
            ...section, 
            paths: courses, 
            label: section.name || section.label 
          }
        }).filter((section: any) => section.paths.length > 0) // Only show sections with courses

        setData(mappedData)
      } catch (error) {
        console.error("Failed to fetch learning paths:", error)
        // alert("Could not load courses. Please check your connection.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const displayData = data
  const activeTabData = activeTab === "all" ? displayData : displayData.filter((tab) => tab._id === activeTab)

  return (
    <section
      className="relative py-12 sm:py-20 overflow-hidden w-full"
      ref={containerRef}
      style={{ backgroundColor: v('--background', '#ffffff'), fontFamily: v('--font-display', 'system-ui, sans-serif') }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 50% 0%, ${v('--primary', '#3b82f6')}15 0%, transparent 70%)` }} />
      </div>

      <div className="container px-4 sm:px-6 mx-auto relative z-10 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.div className="flex justify-center items-center gap-4 mb-4">
             <motion.div className="h-[2px]" initial={{ width: 0 }} whileInView={{ width: '40px' }} transition={{ duration: 0.5, delay: 0.2 }} style={{ backgroundColor: v('--primary', '#3b82f6') }} />
             <span className="text-xs sm:text-sm font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: v('--primary', '#3b82f6') }}>Personalized Learning</span>
             <motion.div className="h-[2px]" initial={{ width: 0 }} whileInView={{ width: '40px' }} transition={{ duration: 0.5, delay: 0.2 }} style={{ backgroundColor: v('--primary', '#3b82f6') }} />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span style={{ color: v('--foreground', '#020817') }}>How Would Your Child</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Prefer to Learn?</span>
          </h2>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        )}

        {!loading && data.length === 0 && (
           <div className="text-center py-10 text-slate-500">No courses available at the moment.</div>
        )}

        {/* Dynamic Toggle Switcher */}
        {!loading && data.length > 0 && (
          <div className="flex justify-center mb-10 w-full">
            <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl border shadow-sm backdrop-blur-md w-full max-w-fit" style={{ backgroundColor: `color-mix(in srgb, ${v('--card', '#fff')} 80%, transparent)`, borderColor: v('--border', '#e2e8f0') }}>
              <button
                onClick={() => setActiveTab('all')}
                className="relative cursor-pointer px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 z-10 flex items-center justify-center gap-2"
                style={{ color: activeTab === 'all' ? v('--primary-foreground', '#ffffff') : v('--muted-foreground', '#64748b') }}
              >
                {activeTab === 'all' && (
                  <motion.div layoutId="activeTabBackground" className="absolute inset-0 rounded-xl shadow-md -z-10" style={{ backgroundColor: v('--primary', '#3b82f6') }} />
                )}
                <span>All</span>
              </button>
              
              {data.map((tab) => {
                const isActive = activeTab === tab._id
                return (
                  <button
                    key={tab._id}
                    onClick={() => setActiveTab(tab._id)}
                    className="relative cursor-pointer px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 z-10"
                    style={{ color: isActive ? v('--primary-foreground', '#ffffff') : v('--muted-foreground', '#64748b') }}
                  >
                    {isActive && (
                      <motion.div layoutId="activeTabBackground" className="absolute inset-0 rounded-xl shadow-md -z-10" style={{ backgroundColor: v('--primary', '#3b82f6') }} />
                    )}
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          {!loading && activeTabData.length > 0 && (
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-7xl mx-auto"
            >
              {activeTabData.flatMap((section) => 
                section.paths?.map((course: any) => {
                  const isHovered = hoveredCard === course._id;
                  const isSaved = savedIds.includes(course._id);
                  
                  return (
                    <motion.div
                      key={course._id}
                      variants={cardVariants}
                      className="h-full"
                      onMouseEnter={() => setHoveredCard(course._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      whileHover="hover"
                    >
                      <Card 
                        className="group relative h-[400px] w-full overflow-hidden border transition-all duration-500 flex flex-col hover:shadow-2xl hover:border-primary/50 cursor-pointer"
                        style={{ backgroundColor: v('--card', '#ffffff'), borderColor: v('--border', '#e2e8f0') }}
                        onClick={() => setSelectedCourse(course)}
                      >
                        {/* Background Image */}
                        <motion.div
                          className="absolute top-0 left-0 w-full z-0 overflow-hidden"
                          initial={{ height: "50%" }}
                          animate={{ height: isHovered ? "100%" : "50%" }}
                          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        >
                          <img
                            src={course.image ? (IMAGE_URL + course.image) : "https://placehold.co/600x400"}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-110"
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>

                        <div className="relative z-10 flex flex-col h-full w-full">
                          {/* Top Badges */}
                          <div className="p-3 flex justify-between items-start w-full absolute top-0 left-0 z-20">
                            <Badge className="bg-white/90 text-black backdrop-blur-md text-[10px] px-2 py-0.5 border-0 font-bold shadow-sm">
                              {course.ageRange || "8+ Years"}
                            </Badge>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSave(course._id);
                              }}
                              className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${isSaved ? "bg-red-500 text-white" : "bg-black/40 text-white hover:bg-black/60"}`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                            </button>
                          </div>

                          <div className="mt-auto" />

                          {/* Content */}
                          <CardContent className="p-5 pt-2 flex flex-col gap-2 relative">
                            {/* Play Button */}
                            <motion.div
                              className="absolute -top-12 right-4"
                              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10, scale: isHovered ? 1 : 0.8 }}
                            >
                              <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 shadow-lg">
                                <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                              </div>
                            </motion.div>

                            <h3 className="text-lg font-bold leading-tight line-clamp-2 transition-colors duration-300" style={{ color: isHovered ? '#ffffff' : v('--foreground', '#020817') }}>
                              {course.title || course.name}
                            </h3>

                            <p className="text-xs line-clamp-2 leading-relaxed transition-colors duration-300" style={{ color: isHovered ? '#e2e8f0' : v('--muted-foreground', '#64748b') }}>
                              {course.description}
                            </p>

                            <div className="flex items-center gap-3 mt-2 text-[11px] font-medium transition-colors duration-300" style={{ color: isHovered ? '#cbd5e1' : v('--muted-foreground', '#64748b') }}>
                              <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration || "Self Paced"}</div>
                              <div className="w-[1px] h-3 bg-current opacity-30" />
                              <div className="flex items-center gap-1"><BarChart className="w-3 h-3" />{course.level || "Beginner"}</div>
                            </div>
                          </CardContent>

                          <CardFooter className="p-5 pt-0">
                            <Button 
                              className="w-full h-10 text-sm font-medium rounded-lg shadow-md group/btn transition-all duration-300 border-0"
                              style={{ backgroundColor: isHovered ? '#ffffff' : v('--primary', '#3b82f6'), color: isHovered ? '#000000' : v('--primary-foreground', '#ffffff') }}
                            >
                              <span className="flex items-center justify-center gap-2">
                                View Details <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                            </Button>
                          </CardFooter>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <AnimatePresence>
        {selectedCourse && (
          <CourseModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            isSaved={savedIds.includes(selectedCourse._id)}
            onToggleSave={() => toggleSave(selectedCourse._id)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default PreferLearn