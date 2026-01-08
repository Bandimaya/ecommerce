'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '@/lib/axios'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight, Clock, Star, Users } from 'lucide-react'
import Image from 'next/image'
import { IMAGE_URL } from '@/lib/constants' // Assuming you have this, otherwise remove

// --- Types ---
interface Course {
  _id: string
  title: string
  description: string
  image: string
  duration?: string
  rating?: number
  students?: number
  category?: string
  price?: number
}

export default function CourseShowcase() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  useEffect(() => {
    setLoading(true)
    apiFetch('/stem-courses')
      .then((data) => {
        setCourses(data)
        if (data && data.length > 0) setActiveIndex(0)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const activeCourse = courses[activeIndex]

  return (
    <section className="relative w-full bg-slate-50 py-20 overflow-hidden">
      {/* Background Decor (Optional) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 text-primary font-bold tracking-wider uppercase text-sm">
              <span className="h-px w-8 bg-primary/60"></span>
              Expert Curriculum
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight max-w-2xl">
              Master the skills that <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                define the future.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
          <ShowcaseSkeleton />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            
            {/* LEFT COLUMN: Interactive List (Desktop) / Stack (Mobile) */}
            <div className="w-full lg:w-5/12 flex flex-col gap-4 relative z-20">
              {courses.slice(0, 6).map((course, index) => (
                <div
                  key={course._id}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`
                    group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border
                    ${index === activeIndex 
                      ? 'bg-white border-primary/20 shadow-xl shadow-blue-900/5 scale-[1.02]' 
                      : 'bg-white/50 border-transparent hover:bg-white hover:border-slate-200'
                    }
                  `}
                >
                  {/* Mobile-only visible Image (To make it usable on small screens) */}
                  <div className="lg:hidden mb-4 w-full h-48 rounded-xl overflow-hidden relative">
                     <img 
                        src={course.image} // Add IMAGE_URL prefix if needed
                        alt={course.title}
                        className="w-full h-full object-cover"
                     />
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <span className={`
                        text-xs font-bold px-2 py-1 rounded-full border transition-colors
                        ${index === activeIndex 
                          ? 'bg-primary/10 text-primary border-primary/20' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                        }
                      `}>
                        {course.category || 'Development'}
                      </span>
                      <h3 className={`text-lg md:text-xl font-bold transition-colors ${index === activeIndex ? 'text-slate-900' : 'text-slate-600'}`}>
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                    
                    {/* Arrow Indicator */}
                    <div className={`
                      hidden lg:flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                      ${index === activeIndex ? 'bg-primary text-white translate-x-0 opacity-100' : 'bg-transparent text-slate-300 -translate-x-2 opacity-0 group-hover:opacity-100'}
                    `}>
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  {/* Mobile-only Details footer */}
                  <div className="lg:hidden mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><Clock size={14}/> {course.duration || '4 Weeks'}</span>
                        <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400"/> {course.rating || '4.8'}</span>
                    </div>
                    <button className="font-semibold text-primary">View Course</button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN: Sticky Preview (Hidden on Mobile, Visible on Desktop) */}
            <div className="hidden lg:block w-full lg:w-7/12 sticky top-24 h-[600px]">
               <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 bg-white">
                 <AnimatePresence mode='wait'>
                    {activeCourse && (
                      <motion.div
                        key={activeCourse._id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full"
                      >
                         {/* Large Background Image */}
                         <div className="absolute inset-0">
                            <img 
                              src={activeCourse.image} // Add IMAGE_URL prefix if needed
                              alt={activeCourse.title}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay Gradient for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
                         </div>

                         {/* Content Overlay */}
                         <div className="absolute bottom-0 left-0 w-full p-10 text-white z-10">
                            <motion.div 
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="space-y-6"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                                        <Clock size={14} />
                                        {activeCourse.duration || '6 Weeks'}
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                                        <Users size={14} />
                                        {activeCourse.students || '1.2k'} Students
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        {activeCourse.rating || '4.9'}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-4xl font-bold mb-3">{activeCourse.title}</h2>
                                    <p className="text-slate-200 text-lg max-w-xl leading-relaxed opacity-90">
                                        {activeCourse.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 group">
                                        Enroll Now
                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                    <button className="px-8 py-4 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm">
                                        View Syllabus
                                    </button>
                                </div>
                            </motion.div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
               </div>
            </div>

          </div>
        )}
      </div>
    </section>
  )
}

// --- Specialized Skeleton for this Layout ---
function ShowcaseSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
      <div className="w-full lg:w-5/12 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white space-y-3">
             <Skeleton className="h-4 w-20 rounded-full" />
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
      <div className="hidden lg:block w-full lg:w-7/12 h-[600px]">
        <Skeleton className="w-full h-full rounded-[2rem]" />
      </div>
    </div>
  )
}