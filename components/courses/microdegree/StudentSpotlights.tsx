'use client';

import React, { useEffect, useState } from 'react';
import { Play, ArrowRight, Trophy, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/axios';
import { IMAGE_URL } from '@/lib/constants';

// --- Types ---
interface Project {
  id: number;
  student: string;
  title: string;
  img: string;
  views: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    student: 'Aarav S.',
    title: 'Smart Home Automation',
    img: 'https://images.unsplash.com/photo-1555677284-6a6f971635e0?auto=format&fit=crop&q=80&w=400',
    views: '1.2k'
  },
  {
    id: 2,
    student: 'Zara K.',
    title: 'Obstacle Avoiding Bot',
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400',
    views: '850'
  },
  {
    id: 3,
    student: 'Vihaan M.',
    title: 'Solar Tracker System',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=400',
    views: '2.1k'
  },
  {
    id: 4,
    student: 'Ishita R.',
    title: 'Gesture Control Car',
    img: 'https://images.unsplash.com/photo-1531297461136-8208e8d8d8d?auto=format&fit=crop&q=80&w=400',
    views: '900'
  },
  {
    id: 5,
    student: 'Rohan G.',
    title: 'Automatic Plant Waterer',
    img: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=400',
    views: '3.4k'
  },
  {
    id: 6,
    student: 'Meera P.',
    title: 'Line Follower Robot',
    img: 'https://images.unsplash.com/photo-1535378437327-b71280637041?auto=format&fit=crop&q=80&w=400',
    views: '1.5k'
  },
  {
    id: 7,
    student: 'Kabir J.',
    title: 'Voice Controlled Arm',
    img: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=400',
    views: '1.1k'
  },
  {
    id: 8,
    student: 'Ananya B.',
    title: 'Weather Station App',
    img: 'https://images.unsplash.com/photo-1592478411213-61535fdd861d?auto=format&fit=crop&q=80&w=400',
    views: '2.8k'
  }
];

export default function StudentSpotlight() {
  const [studentProjects, setStudentProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiFetch('/projects').then((data) => setStudentProjects(data)
    ).catch((err) => console.error(err))
  }, [])
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        {/* --- Header Section --- */}
        <div className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Wall Of Fame</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Student <span className="text-blue-600">Spotlights</span>
            </h2>
            <p className="text-slate-500 mt-4 text-lg max-w-xl font-medium">
              Discover the next generation of engineers and creators.
            </p>
          </motion.div>

          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="group flex items-center gap-2 text-sm font-bold text-slate-900 bg-white px-5 py-3 rounded-full shadow-sm border border-slate-200 hover:border-blue-500 transition-all"
          >
            Explore Library
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-blue-600" />
          </motion.a>
        </div>

        {/* Custom Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <HoverCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Custom Hover Card Component (Aceternity Style) ---
function HoverCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative p-2 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 h-full flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
        <motion.img
          src={IMAGE_URL + project.img}
          alt={project.title}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full object-cover"
        />

        {/* Animated Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />

        {/* Views Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter">
          <Eye className="w-3 h-3" />
          {project.views} Views
        </div>

        {/* Bottom Text Content (Visible on Hover/Always slightly visible) */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <motion.div
            animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Project by {project.student}</p>
            <h3 className="text-lg font-bold leading-tight group-hover:text-white transition-colors">
              {project.title}
            </h3>
          </motion.div>
        </div>

        {/* Center Play Button Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info (Light Mode) */}
      <div className="px-3 py-4 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Certified Project</span>
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}