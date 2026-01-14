"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MessageCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence, Transition, PanInfo } from 'framer-motion';
import { apiFetch } from '@/lib/axios';
import { IMAGE_URL } from '@/lib/constants';
import { useSettings } from '@/contexts/SettingsContext';
import { usePathname, useRouter } from 'next/navigation';

// --- CONFIG: Animation Physics ---
const SMOOTH_SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 0.8
};

// --- UTILS: Simple Scroll Lock ---
const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const body = document.body;

    if (isLocked) {
      // Prevent scrolling by hiding overflow
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';

      if (scrollBarWidth > 0) {
        body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      body.style.overflow = '';
      body.style.paddingRight = '';
    }

    return () => {
      body.style.overflow = '';
      body.style.paddingRight = '';
    };
  }, [isLocked]);
};

// --- Types ---
export interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  duration?: string;
  rating?: number;
  students?: number;
  category?: string;
  price?: number;
  originalPrice?: number;
  outcomes?: string[];
  instructor?: {
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
  };
  curriculum?: {
    title: string;
    desc?: string;
    duration?: string;
  }[];
}

// ===============================================
// 1. INNER ENROLL MODAL COMPONENT
// ===============================================
const InnerEnrollModal = ({ onClose, course, contact }: any) => {
  useScrollLock(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X size={20} className="text-slate-400" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <MessageCircle size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Enroll?</h3>
          <p className="text-slate-600 text-sm mb-2">You are interested in:</p>
          <p className="font-semibold text-blue-600 text-base mb-4 line-clamp-2">{course.title}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => {
              const message = `Hi, I am interested in enrolling for ${course.title}`;
              const url = `https://wa.me/${contact?.whatsapp_number || '1234567890'}?text=${encodeURIComponent(message)}`;
              window.open(url, '_blank');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all shadow-lg active:scale-95"
          >
            <Phone size={20} /> Continue to WhatsApp
          </button>

          <button
            onClick={() => {
              const subject = `Enquiry about ${course.title}`;
              const body = `Hello,\n\nI would like to get more information about the "${course.title}" course.\n\nPlease contact me with details.\n\nThank you.`;
              const url = `mailto:${contact?.email || 'info@example.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              window.location.href = url;
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-slate-50 text-slate-700 font-bold hover:bg-slate-100 transition-all border-2 border-slate-200 active:scale-95"
          >
            <Mail size={20} /> Send Inquiry Email
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===============================================
// 2. COURSE MODAL
// ===============================================
const CourseModal = ({ course, onClose, contact }: { course: Course; onClose: () => void; contact: any }) => {
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum'>('overview');
  const modalRef = useRef<HTMLDivElement>(null);

  // Apply scroll lock when modal is open
  useScrollLock(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showEnrollPopup) {
          setShowEnrollPopup(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showEnrollPopup, onClose]);

  return (
    <>
      {/* Backdrop - captures clicks outside modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-slate-900/40 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Main Modal Container - Updated with top-20 md:top-15 */}
      <div className="fixed inset-0 z-[10000] flex items-start justify-center p-2 md:p-4 pointer-events-none overflow-y-auto">
        <motion.div
          ref={modalRef}
          layoutId={`course-card-container-${course._id}`}
          transition={SMOOTH_SPRING}
          className={`relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh] md:max-h-[85vh]
            mt-20 md:mt-15 mb-8
            ${showEnrollPopup ? 'pointer-events-none filter blur-sm grayscale-[0.5] opacity-90' : 'pointer-events-auto'} 
            transition-all duration-300`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={showEnrollPopup}
            className="absolute top-4 right-4 z-50 p-2 bg-black/10 backdrop-blur-md md:bg-white/90 rounded-full text-white md:text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm border border-transparent md:border-slate-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-0"
          >
            <X size={20} />
          </button>

          {/* Left Column: Image */}
          <div className="md:w-5/12 relative h-48 md:h-auto overflow-hidden flex-shrink-0 bg-slate-900">
            <motion.div
              layoutId={`course-image-container-${course._id}`}
              className="w-full h-full opacity-90"
              transition={SMOOTH_SPRING}
            >
              <img
                src={(IMAGE_URL || "") + course.image}
                alt={course.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-30"
            >
              <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-slate-900 text-sm">{course.rating || '4.9'}</span>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                {course.category || 'STEM'}
              </span>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <motion.div
            className="md:w-7/12 flex flex-col relative bg-white overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {/* Header Area */}
            <div className="px-8 pt-8 pb-4 flex-shrink-0 bg-white z-10">
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-blue-500" />
                  <span className="font-medium">{course.duration || 'Self Paced'}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1.5">
                  <Users size={16} className="text-blue-500" />
                  <span className="font-medium">{course.students || 'N/A'} Students</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setActiveTab('overview')}
                  disabled={showEnrollPopup}
                  className={`pb-3 px-1 mr-6 text-base font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  disabled={showEnrollPopup}
                  className={`pb-3 px-1 mr-6 text-base font-bold border-b-2 transition-colors ${activeTab === 'curriculum' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                  Curriculum
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
              {activeTab === 'overview' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10">
                  <div className="prose prose-lg prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {course.description}
                    </p>
                  </div>

                  {course.outcomes && course.outcomes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">What You'll Learn</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.outcomes.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.instructor && (
                    <div className="border-t border-slate-100 pt-6">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Your Instructor</h4>
                      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                          {course.instructor.avatar ? (
                            <img src={IMAGE_URL + course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-blue-600 font-bold text-xl">{course.instructor.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{course.instructor.name}</p>
                          <p className="text-sm text-slate-500">{course.instructor.role}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                    <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                      <BookOpen size={16} />
                      {course.curriculum?.length
                        ? `This course consists of ${course.curriculum.length} comprehensive modules.`
                        : "Curriculum details are being updated."}
                    </p>
                  </div>

                  {course.curriculum && course.curriculum.length > 0 ? (
                    course.curriculum.map((module, i) => (
                      <div key={i} className="group flex gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-default border border-transparent hover:border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-base group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0 shadow-sm">
                          {i + 1}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800 text-lg">{module.title}</h5>
                          {module.desc && <p className="text-sm text-slate-500 mt-1 leading-relaxed">{module.desc}</p>}
                          {module.duration && (
                            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-slate-400">
                              <Clock size={12} /> {module.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                      <p>Full curriculum coming soon.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="p-6 md:p-8 border-t border-slate-100 bg-white z-10 flex-shrink-0">
              <div className="flex items-center justify-between gap-6">
                <div className="hidden md:block">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Course Fee</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-slate-900">
                      {course.price ? `$${course.price}` : 'Free'}
                    </p>
                    {course.originalPrice && (
                      <p className="text-sm font-medium text-slate-400 line-through">${course.originalPrice}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowEnrollPopup(true)}
                  disabled={showEnrollPopup}
                  className="flex-1 md:flex-none px-10 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg shadow-blue-200 hover:shadow-xl flex items-center justify-center gap-2 group text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Enroll Now</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showEnrollPopup && (
          <InnerEnrollModal
            course={course}
            contact={contact}
            onClose={() => setShowEnrollPopup(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ===============================================
// 3. MAIN COURSE SHOWCASE COMPONENT
// ===============================================
const CourseShowcase = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { contact } = useSettings();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    apiFetch('/stem-courses')
      .then((data) => setCourses(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = useCallback(() => {
    if (courses.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % courses.length);
  }, [courses.length]);

  const handlePrev = useCallback(() => {
    if (courses.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + courses.length) % courses.length);
  }, [courses.length]);

  // --- Mobile Swipe Handlers ---
  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      handleNext();
    } else if (offset > 100 || velocity > 500) {
      handlePrev();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCourse) {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, selectedCourse]);

  // --- Desktop 3D Logic ---
  const getCardProps = (index: number) => {
    if (courses.length === 0) return { state: "center", zIndex: 30 };
    const length = courses.length;
    let offset = (index - activeIndex) % length;
    if (offset > length / 2) offset -= length;
    if (offset < -length / 2) offset += length;

    if (offset === 0) return { state: "center", zIndex: 30 };
    if (offset === 1) return { state: "right", zIndex: 20 };
    if (offset === -1) return { state: "left", zIndex: 20 };
    if (offset === 2 || offset > 2) return { state: "farRight", zIndex: 10 };
    return { state: "farLeft", zIndex: 10 };
  };

  const desktopVariants: any = {
    center: { x: "0%", scale: 1, opacity: 1, rotateY: 0, filter: "brightness(1)", zIndex: 30, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", transition: { type: "spring", stiffness: 260, damping: 20 } },
    left: { x: "-60%", scale: 0.85, opacity: 0.7, rotateY: 25, filter: "brightness(0.85)", zIndex: 20, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: { type: "spring", stiffness: 260, damping: 20 } },
    right: { x: "60%", scale: 0.85, opacity: 0.7, rotateY: -25, filter: "brightness(0.85)", zIndex: 20, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: { type: "spring", stiffness: 260, damping: 20 } },
    farLeft: { x: "-120%", scale: 0.7, opacity: 0, rotateY: 45, filter: "brightness(0.5)", zIndex: 10, transition: { type: "spring", stiffness: 260, damping: 20 } },
    farRight: { x: "120%", scale: 0.7, opacity: 0, rotateY: -45, filter: "brightness(0.5)", zIndex: 10, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };

  // --- Optimized Mobile Variants ---
  const mobileVariants: any = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotate: direction > 0 ? 5 : -5,
      zIndex: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotate: direction < 0 ? 5 : -5,
      transition: { duration: 0.2 }
    })
  };

  const activeCourse = courses[activeIndex];

  if (loading && courses.length === 0) {
    return (
      <div className="relative w-full py-20 overflow-hidden bg-slate-50 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ backgroundColor: '#3b82f6' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full opacity-5 blur-[100px]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        {/* Header */}
        {
          pathname !== '/' ?
            <div className="text-center mb-16">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex justify-center items-center gap-3 mb-6"
              >
                <div className="h-[2px] w-12 bg-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  World-Class Curriculum
                </span>
                <div className="h-[2px] w-12 bg-blue-600" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
              >
                Master skills that <span className="text-blue-600">define the future.</span>
              </motion.h2>
            </div>
            : <div className="text-center mb-16">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex justify-center items-center gap-3 mb-6"
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '48px' }}
                  transition={{ duration: 0.5 }}
                  className="h-[2px]"
                  style={{ backgroundColor: `var(--accent, #3b82f6)` }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: `var(--accent, #3b82f6)` }}
                >
                  Interactive Jargon Buster
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '48px' }}
                  transition={{ duration: 0.5 }}
                  className="h-[2px]"
                  style={{ backgroundColor: `var(--accent, #3b82f6)` }}
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
              >
                Your Guide to{' '}
                <motion.span
                  // animate={{ color: data?.[activeIndex]?.accentColor }}
                  transition={{ duration: 0.5 }}
                >
                  AI, Robotics Kits & Coding
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
              >
                Easy explanations of common terms kickstart your child’s{' '}
                <motion.span
                  // animate={{ color: data?.[activeIndex]?.accentColor }}
                  transition={{ duration: 0.5 }}
                  className="font-semibold"
                >
                  innovation journey.
                </motion.span>
              </motion.p>
            </div>
        }

        {/* --- CAROUSEL RENDERER --- */}
        {!isMobile ? (
          // DESKTOP VIEW
          <div className="relative h-[550px] w-full flex items-center justify-center perspective-[1200px]">
            {courses.map((course, index) => {
              const { state, zIndex } = getCardProps(index);
              const isSelected = selectedCourse?._id === course._id;
              return (
                <motion.div
                  key={course._id}
                  variants={desktopVariants}
                  initial="farRight"
                  animate={state}
                  style={{ zIndex, transformStyle: "preserve-3d", opacity: isSelected ? 0 : undefined }}
                  className={`absolute w-[900px] h-[500px] perspective-1000 ${isSelected ? 'pointer-events-none' : ''}`}
                  onClick={() => {
                    if (state === 'center') setSelectedCourse(course);
                    if (state === 'left') handlePrev();
                    if (state === 'right') handleNext();
                  }}
                >
                  <motion.div
                    layoutId={`course-card-container-${course._id}`}
                    className="w-full h-full rounded-3xl bg-white shadow-2xl border border-slate-100/50 overflow-hidden cursor-pointer grid grid-cols-12 hover:shadow-3xl transition-shadow duration-300"
                  >
                    <div className="col-span-5 relative h-full overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-transparent z-10 transition-colors group-hover:bg-transparent" />
                      <motion.div layoutId={`course-image-container-${course._id}`} className="w-full h-full">
                        <img src={IMAGE_URL + course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      </motion.div>
                      <motion.div className="absolute top-6 left-6 z-20">
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-slate-900 text-sm">{course.rating || '4.9'}</span>
                        </div>
                      </motion.div>
                      <div className="absolute bottom-6 left-6 z-20">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full">{course.category || 'STEM'}</span>
                      </div>
                    </div>

                    <div className="col-span-7 p-10 flex flex-col justify-center relative bg-white">
                      <div className="absolute top-4 right-6 text-9xl font-black text-slate-50 opacity-100 pointer-events-none select-none">0{index + 1}</div>
                      <div className="relative z-10 flex flex-col h-full justify-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 leading-tight line-clamp-2">{course.title}</h2>
                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3 text-lg">{course.description}</p>
                        <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-6">
                          <div className="flex items-center gap-2 text-slate-500 font-medium"><Clock size={18} className="text-blue-500" /><span>{course.duration || '8 Weeks'}</span></div>
                          <div className="flex items-center gap-2 text-slate-500 font-medium"><Users size={18} className="text-blue-500" /><span>{course.students || '1.2k'} Students</span></div>
                        </div>
                        {
                          pathname !== '/' ? <div className="flex items-center gap-4 mt-auto">
                            <button onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); }} className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all hover:border-slate-300">View Details</button>
                            <button onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); }} className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">Enroll Now <ArrowRight size={18} /></button>
                          </div>
                            : <div className="flex items-center gap-4 mt-auto">
                              <button onClick={(e) => { router.push('/courses') }} className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">Explore Course <ArrowRight size={18} /></button>
                            </div>
                        }
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-40 max-w-6xl mx-auto">
              <button onClick={handlePrev} className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all active:scale-95"><ChevronLeft size={28} /></button>
              <button onClick={handleNext} className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all active:scale-95"><ChevronRight size={28} /></button>
            </div>
          </div>
        ) : (
          /* ======================================= */
          /* MOBILE VIEW                             */
          /* ======================================= */
          <div className="relative w-full max-w-sm mx-auto flex flex-col items-center">

            {/* 1. FIXED HEIGHT CARD CONTAINER (Aspect Ratio 3:4) */}
            <div className="relative w-full aspect-[3/4] max-h-[600px] mb-6">
              <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                {activeCourse && (
                  <motion.div
                    key={activeCourse._id}
                    custom={direction}
                    variants={mobileVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={onDragEnd}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  >
                    <motion.div
                      layoutId={`course-card-container-${activeCourse._id}`}
                      className="w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col"
                      onClick={() => setSelectedCourse(activeCourse)}
                    >
                      {/* Mobile Image Section (Fixed 45% Height) */}
                      <div className="relative h-[45%] flex-shrink-0 bg-slate-100">
                        <motion.div layoutId={`course-image-container-${activeCourse._id}`} className="w-full h-full">
                          <img src={IMAGE_URL + activeCourse.image} alt={activeCourse.title} className="w-full h-full object-cover" loading="lazy" />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold text-slate-900">{activeCourse.rating || '4.9'}</span>
                        </div>
                        <div className="absolute bottom-5 left-5 right-5 text-white">
                          <div className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-1">{activeCourse.category || 'STEM Education'}</div>
                          <h2 className="text-2xl font-bold leading-tight drop-shadow-md line-clamp-2">{activeCourse.title}</h2>
                        </div>
                      </div>

                      {/* Mobile Content Section (Remaining Height) */}
                      <div className="flex-1 p-6 flex flex-col justify-between bg-white relative">
                        <div>
                          <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 font-semibold uppercase tracking-wide">
                            <span className="flex items-center gap-1"><Clock size={14} className="text-blue-500" /> {activeCourse.duration || '8 Weeks'}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="flex items-center gap-1"><Users size={14} className="text-blue-500" /> {activeCourse.students || '100+'}</span>
                          </div>
                          {/* TRUNCATE DESCRIPTION to prevent layout jumps */}
                          <p className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                            {activeCourse.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                          <button
                            className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-slate-50 border border-slate-200 active:scale-95 transition-transform"
                            onClick={(e) => { e.stopPropagation(); setSelectedCourse(activeCourse); }}
                          >
                            Details
                          </button>
                          <button
                            className="flex-[2] py-3 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                            onClick={(e) => { e.stopPropagation(); setSelectedCourse(activeCourse); }}
                          >
                            Enroll
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stack Depth Effect */}
              <div className="absolute top-3 left-3 right-3 bottom-0 bg-white rounded-3xl border border-slate-200 shadow-sm z-[-1] opacity-50 scale-95 origin-bottom" />
              <div className="absolute top-6 left-6 right-6 bottom-0 bg-white rounded-3xl border border-slate-200 shadow-sm z-[-2] opacity-25 scale-90 origin-bottom" />
            </div>

            {/* 2. FIXED BUTTON CONTAINER (Always below the card container) */}
            <div className="w-full max-w-[280px] h-[60px] flex items-center justify-between">
              <button onClick={handlePrev} className="p-4 bg-white rounded-full text-slate-600 shadow-md border border-slate-100 active:scale-90 transition-transform">
                <ChevronLeft size={24} />
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-2">
                {courses.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`h-2 rounded-full transition-colors duration-300 ${idx === activeIndex ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    animate={{
                      width: idx === activeIndex ? 20 : 8,
                    }}
                  />
                ))}
              </div>

              <button onClick={handleNext} className="p-4 bg-white rounded-full text-slate-600 shadow-md border border-slate-100 active:scale-90 transition-transform">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* --- DESKTOP DOTS ONLY --- */}
        {courses.length > 0 && !isMobile && (
          <div className="flex justify-center gap-3 mt-10 items-center">
            {courses.map((_, idx) => (
              <button key={idx} onClick={() => setActiveIndex(idx)} className="group flex items-center justify-center p-1 focus:outline-none" aria-label={`Go to course ${idx + 1}`}>
                <div className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`} />
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedCourse && (
            <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} contact={contact} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CourseShowcase;