'use client'

import React from 'react'
import { STEM_COURSES } from '../../../lib/Data'
import ProfessionalCourseCard from './CourseCard'
import { motion } from 'framer-motion'

export default function CourseBentoGrid() {
  return (
    // w-full and bg-slate-50 for a clean, professional backdrop
    <section className="w-full bg-slate-50 py-16">
      {/* Main Container: 100% width (w-full) 
          px-4 to px-10 ensures it doesn't hit the screen edges 
      */}
      <div className="w-full px-4 md:px-10">
        
        {/* Section Header */}
                {/* --- Header Section --- */}
        <div className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Choose Your Learning Path</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
        </div>
        <div className="mb-10 px-2">
          <p className="mt-3 max-w-2xl text-slate-500 font-medium">
            Industry-aligned programs designed for real-world skills, optimized for modern engineering.
          </p>
        </div>

        {/* Bento Grid: 
            Every direct child of the grid needs the 10px radius 
        */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[320px]">
          {STEM_COURSES.slice(0, 6).map((course, index) => {
            const layoutClass =
              index === 0 ? 'md:col-span-2 md:row-span-2' : 
              index === 1 ? 'md:col-span-1 md:row-span-2' : 
              index === 5 ? 'md:col-span-2 md:row-span-1' : '';

            return (
              <div 
                key={course.id} 
                className={`${layoutClass} rounded-[10px] overflow-hidden`}
              >
                <ProfessionalCourseCard 
                  course={course} 
                  compact={index !== 0 && index !== 5} 
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}