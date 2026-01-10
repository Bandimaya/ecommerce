"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Clock, Star, Users, CheckCircle2 } from 'lucide-react';
import { IMAGE_URL } from '@/lib/constants';

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  duration?: string;
  rating?: number;
  students?: number;
  category?: string;
}

export default function CourseShowcase() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiFetch('/stem-courses')
      .then((data) => setCourses(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 text-primary font-bold tracking-widest uppercase text-xs mb-4"
          >
            <span className="h-px w-8 bg-primary"></span>
            Expert Curriculum
            <span className="h-px w-8 bg-primary"></span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Master the skills that <span className="text-primary">define the future.</span>
          </h2>
        </div>

        {/* Course List */}
        <div className="flex flex-col gap-24 md:gap-32">
          {loading ? (
            <SkeletonLoader />
          ) : (
            courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex flex-col gap-8 md:gap-16 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <div className="relative group overflow-hidden rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200">
                    <img
                      src={IMAGE_URL + course.image}
                      alt={course.title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent" />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white/20">
                      <div className="flex items-center gap-2">
                         <Star size={16} className="text-yellow-500 fill-yellow-500" />
                         <span className="font-bold text-slate-900">{course.rating || '4.9'}</span>
                         <span className="text-slate-500 text-sm">Rating</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="space-y-4">
                    <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider">
                      {course.category || 'STEM Education'}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap gap-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={20} className="text-primary" />
                      <span className="font-medium">{course.duration || '8 Weeks'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users size={20} className="text-primary" />
                      <span className="font-medium">{course.students || '1,200+'} Enrolled</span>
                    </div>
                  </div>

                  {/* Feature Checkmarks */}
                  <div className="grid grid-cols-2 gap-3 pb-4">
                    {['Industry Certificate', 'Lifetime Access', 'Expert Mentor', 'Practical Labs'].map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-slate-500">
                        <CheckCircle2 size={16} className="text-green-500" />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button className="bg-primary text-white hover:bg-primary/90 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group">
                      Enroll Now
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
                    <button className="px-8 py-4 rounded-xl font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all">
                      View Syllabus
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-24">
      {[1, 2].map((i) => (
        <div key={i} className="flex flex-col md:flex-row gap-12">
          <Skeleton className="w-full md:w-1/2 aspect-[4/3] rounded-[2rem]" />
          <div className="w-full md:w-1/2 space-y-6">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-14 w-40 rounded-xl" />
              <Skeleton className="h-14 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}