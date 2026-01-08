'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, ShieldCheck, Zap } from 'lucide-react';
import { CourseProps } from '../../../lib/Data';
import { IMAGE_URL } from '@/lib/constants';

interface CardProps {
  course: CourseProps;
  compact?: boolean;
  isMobile?: boolean;
}

const slabVariants = {
  collapsed: { height: 105 },
  expanded: { height: 'calc(100% - 16px)' },
};

export default function ProfessionalCourseCard({ course, compact, isMobile }: CardProps) {
  return (
    <motion.article
      initial={isMobile ? 'expanded' : 'collapsed'}
      whileHover={isMobile ? undefined : 'expanded'}
      className="group relative h-full w-full bg-white rounded-[10px] overflow-hidden border border-slate-200 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl cursor-pointer"
    >
      {/* Background Image Wrapper */}
      <div className="relative h-full w-full bg-slate-100">
        <img
          src={IMAGE_URL + course.img}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-slate-900 uppercase rounded-[6px]">
            Ages {course.age}
          </span>
          {!compact && (
             <span className="bg-blue-600 px-2.5 py-1 text-[10px] font-black text-white uppercase rounded-[6px]">
               {course.level || 'Expert'}
             </span>
          )}
        </div>
      </div>

      {/* The Floating Slab Panel (10px Radius) */}
      <motion.div
        variants={slabVariants}
        transition={{ type: 'spring', damping: 22, stiffness: 120 }}
        className="absolute bottom-2 left-2 right-2 bg-white rounded-[10px] p-5 flex flex-col justify-between overflow-hidden shadow-xl"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.1em]">{course.duration}</span>
          </div>

          <h3 className={`font-bold leading-tight text-slate-900 ${compact ? 'text-lg' : 'text-2xl'}`}>
            {course.title}
          </h3>

          <motion.p
            variants={{
              collapsed: { opacity: 0, y: 10 },
              expanded: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-slate-500 text-sm line-clamp-2"
          >
            {course.description}
          </motion.p>
        </div>

        <div className="mt-4 space-y-4">
          <button className="flex w-full h-12 items-center justify-center gap-2 bg-slate-900 text-white rounded-[10px] text-xs font-bold uppercase tracking-widest transition-all hover:bg-blue-600">
            Enroll Now <ArrowRight className="w-4 h-4" />
          </button>

          {/* Trust Metrics */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 opacity-60">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="text-[9px] font-bold">{course.enrolled}</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[9px] font-bold">Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span className="text-[9px] font-bold">Live</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}