"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Clock, Users, Star, ArrowRight, 
  CheckCircle2, X, Phone, Mail, MessageCircle, BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence, PanInfo, Variants } from 'framer-motion';

// Replace with your actual imports
import { apiFetch } from '@/lib/axios';
import { IMAGE_URL } from '@/lib/constants';
import { useSettings } from '@/contexts/SettingsContext';

// --- TYPES ---

interface Instructor {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

interface CurriculumModule {
  title: string;
  desc?: string;
  duration?: string;
}

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
  instructor?: Instructor;
  curriculum?: CurriculumModule[];
}

// --- ANIMATION CONFIG ---

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
};

// --- HOOKS ---

const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (isLocked) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
    return () => { body.style.overflow = ''; };
  }, [isLocked]);
};

const useIsMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
};

// --- HELPER COMPONENTS ---

const DescriptionWithReadMore = ({ 
  text, 
  limit = 120, 
  onReadMore, 
  className 
}: { 
  text: string, 
  limit?: number, 
  onReadMore: () => void, 
  className?: string 
}) => {
  if (!text) return null;
  const isLong = text.length > limit;
  const displayText = isLong ? text.slice(0, limit).trim() + "... " : text;

  return (
    <div className={className}>
      <p className="inline">
        {displayText}
      </p>
      {isLong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReadMore();
          }}
          className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5 ml-1 text-sm whitespace-nowrap"
        >
          Read More
        </button>
      )}
    </div>
  );
};

// --- SKELETON COMPONENT ---

const CourseSkeleton = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return (
      <div className="container mx-auto px-4 w-full flex flex-col items-center">
        <div className="relative w-full aspect-[4/5] max-h-[550px] mb-8 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
          <div className="h-[45%] w-full bg-slate-200 animate-pulse" />
          <div className="flex-1 p-6 space-y-4">
            <div className="flex gap-2">
              <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-3/4 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="mt-auto pt-4">
              <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[550px] w-full flex items-center justify-center overflow-hidden">
       <div className="absolute left-[5%] w-[900px] h-[480px] bg-slate-100 rounded-3xl opacity-40 scale-[0.85] translate-x-[-50%]" />
       <div className="absolute right-[5%] w-[900px] h-[480px] bg-slate-100 rounded-3xl opacity-40 scale-[0.85] translate-x-[50%]" />
       <div className="relative z-10 w-[900px] h-[480px] rounded-3xl bg-white shadow-xl border border-slate-100 grid grid-cols-12 overflow-hidden">
          <div className="col-span-5 bg-slate-200 animate-pulse h-full" />
          <div className="col-span-7 p-10 flex flex-col justify-center space-y-6">
             <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
             <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse" />
             <div className="space-y-3">
               <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
               <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
             </div>
             <div className="flex gap-4 mt-8">
               <div className="h-12 w-32 bg-slate-200 rounded-full animate-pulse" />
               <div className="h-12 w-40 bg-slate-200 rounded-full animate-pulse" />
             </div>
          </div>
       </div>
    </div>
  );
};

// --- SUB-COMPONENTS (Modals & Carousels) ---

const EnrollmentDialog = ({ onClose, course, contact }: { onClose: () => void, course: Course, contact: any }) => {
  useScrollLock(true);

  const handleWhatsApp = () => {
    const message = `Hi, I am interested in enrolling for ${course.title}`;
    const url = `https://wa.me/${contact?.whatsapp_number || ''}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleEmail = () => {
    const subject = `Enquiry: ${course.title}`;
    const body = `Hello,\n\nI would like more info about the "${course.title}" course.`;
    window.location.href = `mailto:${contact?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <MessageCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Start Your Journey</h3>
          <p className="text-slate-500 text-sm mt-1">{course.title}</p>
        </div>
        <div className="space-y-3">
          <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
            <Phone size={18} /> WhatsApp
          </button>
          <button onClick={handleEmail} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors border border-slate-200">
            <Mail size={18} /> Email
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CourseDetailModal = ({ course, onClose, contact }: { course: Course, onClose: () => void, contact: any }) => {
  const [showEnroll, setShowEnroll] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum'>('overview');
  useScrollLock(true);

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-center items-start pt-[70px] md:pt-[100px] px-2 md:px-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          layoutId={`course-card-bg-${course._id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl bg-white rounded-[10px] md:rounded-[10px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[calc(100vh-90px)] md:h-[80vh] z-10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/20 md:bg-white md:border md:border-slate-200 rounded-full text-white md:text-slate-500 hover:scale-110 transition-transform"
          >
            <X size={20} />
          </button>

          <div className="w-full md:w-5/12 h-48 md:h-auto relative bg-slate-900 flex-shrink-0">
            <motion.img 
              layoutId={`course-image-${course._id}`}
              src={(IMAGE_URL || "") + course.image} 
              alt={course.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-bold shadow-sm">
                <Star size={14} className="text-yellow-500 fill-yellow-500" /> {course.rating || 4.9}
              </span>
              <span className="bg-blue-600/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                {course.category || 'STEM'}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="px-6 pt-6 pb-2 border-b border-slate-100 flex-shrink-0">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 line-clamp-1">{course.title}</h2>
              <div className="flex gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1.5"><Clock size={16} className="text-blue-500" /> {course.duration || 'Self Paced'}</span>
                <span className="flex items-center gap-1.5"><Users size={16} className="text-blue-500" /> {course.students || 'N/A'} Students</span>
              </div>
              
              <div className="flex gap-6 overflow-x-auto no-scrollbar">
                {['overview', 'curriculum'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-2 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeTab === 'overview' ? (
                <div className="animate-in fade-in duration-300 space-y-8">
                  <div className="text-slate-600 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {course.description}
                  </div>
                  
                  {course.outcomes && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">What you will learn</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.outcomes.map((item, i) => (
                          <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {course.instructor && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden">
                        {course.instructor.avatar ? (
                          <img src={IMAGE_URL + course.instructor.avatar} alt="Inst" className="w-full h-full object-cover"/>
                        ) : course.instructor.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{course.instructor.name}</p>
                        <p className="text-xs text-slate-500 uppercase">{course.instructor.role}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-in fade-in duration-300 space-y-4">
                   <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm font-medium flex gap-2">
                     <BookOpen size={18} /> {course.curriculum?.length || 0} Modules included
                   </div>
                   {course.curriculum?.map((mod, i) => (
                     <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                       <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0">{i+1}</span>
                       <div>
                         <h5 className="font-bold text-slate-900">{mod.title}</h5>
                         {mod.desc && <p className="text-sm text-slate-500 mt-1">{mod.desc}</p>}
                       </div>
                     </div>
                   ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
              <div className="hidden md:block">
                 <p className="text-xs text-slate-400 font-bold uppercase">Price</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">${course.price || 'Free'}</span>
                    {course.originalPrice && <span className="text-sm text-slate-400 line-through">${course.originalPrice}</span>}
                 </div>
              </div>
              <button 
                onClick={() => setShowEnroll(true)}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Enroll Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showEnroll && (
          <EnrollmentDialog 
            onClose={() => setShowEnroll(false)} 
            course={course} 
            contact={contact} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

const DesktopCarousel = ({ 
  courses, 
  activeIndex, 
  onNext, 
  onPrev, 
  onSelect 
}: { 
  courses: Course[], 
  activeIndex: number, 
  onNext: () => void, 
  onPrev: () => void, 
  onSelect: (c: Course) => void 
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const getCardProps = (index: number) => {
    const length = courses.length;
    let offset = (index - activeIndex) % length;
    if (offset > length / 2) offset -= length;
    if (offset < -length / 2) offset += length;

    if (offset === 0) return "center";
    if (offset === 1) return "right";
    if (offset === -1) return "left";
    return offset > 0 ? "farRight" : "farLeft";
  };

  const variants: Variants = {
    center: { x: "0%", scale: 1, zIndex: 30, opacity: 1, rotateY: 0, filter: "brightness(1)", transition: SPRING_TRANSITION as any },
    left: { x: "-60%", scale: 0.85, zIndex: 20, opacity: 0.7, rotateY: 25, filter: "brightness(0.9)", transition: SPRING_TRANSITION as any },
    right: { x: "60%", scale: 0.85, zIndex: 20, opacity: 0.7, rotateY: -25, filter: "brightness(0.9)", transition: SPRING_TRANSITION as any },
    farLeft: { x: "-120%", scale: 0.7, zIndex: 10, opacity: 0, transition: { duration: 0.3 } },
    farRight: { x: "120%", scale: 0.7, zIndex: 10, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative h-[550px] w-full flex items-center justify-center perspective-[1200px] overflow-hidden">
      {courses.map((course, i) => {
        const state = getCardProps(i);
        const isActive = state === 'center';
        
        return (
          <motion.div
            key={course._id}
            initial="farRight"
            animate={state}
            variants={variants}
            className={`absolute w-[900px] h-[480px] rounded-[10px] bg-white shadow-2xl border border-slate-100 overflow-hidden cursor-pointer ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
            onClick={() => {
               if(state === 'left') onPrev();
               if(state === 'right') onNext();
               if(isActive) onSelect(course);
            }}
          >
             <div className="grid grid-cols-12 h-full">
               <div className="col-span-5 relative h-full bg-slate-100 overflow-hidden">
                  <motion.img 
                    layoutId={`course-image-${course._id}`}
                    src={(IMAGE_URL || "") + course.image} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold text-sm shadow-sm">
                    <Star size={14} className="text-yellow-500 fill-yellow-500"/> {course.rating || 4.9}
                  </div>
               </div>
               <div className="col-span-7 p-10 flex flex-col relative">
                  <span className="absolute top-4 right-8 text-8xl font-black text-slate-100 select-none -z-0">0{i+1}</span>
                  <div className="z-10 flex flex-col h-full justify-center">
                    <span className="text-blue-600 font-bold uppercase tracking-wider text-xs mb-2">{course.category || 'STEM'}</span>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4 leading-tight line-clamp-2">{course.title}</h3>
                    
                    {/* UPDATED: Description with Read More */}
                    <div className="mb-6 h-[72px] relative">
                      <DescriptionWithReadMore 
                        text={course.description}
                        limit={120}
                        onReadMore={() => onSelect(course)}
                        className="text-slate-600 leading-relaxed text-base"
                      />
                    </div>
                    
                    <div className="flex gap-6 mb-8 text-sm font-semibold text-slate-500 mt-auto">
                      <span className="flex items-center gap-2"><Clock size={16} className="text-blue-500"/> {course.duration || 'Self Paced'}</span>
                      <span className="flex items-center gap-2"><Users size={16} className="text-blue-500"/> {course.students || '1k+'} Students</span>
                    </div>

                    <div className="flex gap-4">
                      {pathname !== '/' ? (
                        <>
                          <button onClick={(e) => {e.stopPropagation(); onSelect(course)}} className="px-6 py-3 rounded-full border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">Details</button>
                          <button onClick={(e) => {e.stopPropagation(); onSelect(course)}} className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors flex items-center gap-2">Enroll <ArrowRight size={18}/></button>
                        </>
                      ) : (
                         <button onClick={(e) => {e.stopPropagation(); router.push('/courses')}} className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors flex items-center gap-2">Explore <ArrowRight size={18}/></button>
                      )}
                    </div>
                  </div>
               </div>
             </div>
          </motion.div>
        );
      })}

      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-10 pointer-events-none z-50">
         <button onClick={onPrev} className="pointer-events-auto w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"><ChevronLeft/></button>
         <button onClick={onNext} className="pointer-events-auto w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"><ChevronRight/></button>
      </div>
    </div>
  );
};

const MobileCarousel = ({ 
  courses, 
  activeIndex, 
  onNext, 
  onPrev, 
  onSelect,
  direction 
}: { 
  courses: Course[], 
  activeIndex: number, 
  onNext: () => void, 
  onPrev: () => void, 
  onSelect: (c: Course) => void,
  direction: number
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const activeCourse = courses[activeIndex];

  const variants: Variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.8, rotate: dir > 0 ? 5 : -5, zIndex: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 300 : -300, opacity: 0, scale: 0.8, rotate: dir < 0 ? 5 : -5, transition: { duration: 0.2 } })
  };

  const onDragEnd = (e: any, info: PanInfo) => {
    if (info.offset.x < -100 || info.velocity.x < -500) onNext();
    else if (info.offset.x > 100 || info.velocity.x > 500) onPrev();
  };

  if (!activeCourse) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full aspect-[4/5] max-h-[550px] mb-8">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeCourse._id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={onDragEnd}
            onClick={() => onSelect(activeCourse)}
            className="absolute inset-0 rounded-3xl bg-white shadow-xl border border-slate-100 overflow-hidden cursor-grab active:cursor-grabbing flex flex-col"
          >
            <div className="relative h-[45%] flex-shrink-0 bg-slate-200">
               <motion.img 
                 layoutId={`course-image-${activeCourse._id}`}
                 src={(IMAGE_URL || "") + activeCourse.image} 
                 className="w-full h-full object-cover" 
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
               <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">{activeCourse.category || 'STEM'}</span>
                  <h3 className="text-white font-bold text-2xl line-clamp-2 leading-tight">{activeCourse.title}</h3>
               </div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col min-h-0">
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex-shrink-0">
                <span className="flex items-center gap-1"><Clock size={14} className="text-blue-500"/> {activeCourse.duration}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"/>
                <span className="flex items-center gap-1"><Users size={14} className="text-blue-500"/> {activeCourse.students}</span>
              </div>
              
              {/* UPDATED MOBILE TEXT AREA */}
              <div className="flex-1 min-h-0 mb-4 relative overflow-y-auto custom-scrollbar">
                 <DescriptionWithReadMore 
                   text={activeCourse.description}
                   limit={150}
                   onReadMore={() => onSelect(activeCourse)}
                   className="text-slate-600 text-sm leading-relaxed"
                 />
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex-shrink-0">
                {pathname !== '/' ? (
                  <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">View Details</button>
                ) : (
                  <button onClick={(e) => {e.stopPropagation(); router.push('/courses')}} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">Explore Course</button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute top-4 left-4 right-4 bottom-0 bg-white border border-slate-200 rounded-3xl z-[-1] opacity-60 scale-95 origin-bottom"/>
        <div className="absolute top-8 left-8 right-8 bottom-0 bg-white border border-slate-200 rounded-3xl z-[-2] opacity-30 scale-90 origin-bottom"/>
      </div>

      <div className="flex items-center justify-between w-64">
         <button onClick={onPrev} className="p-4 rounded-full bg-white shadow-md text-slate-600 active:scale-90 transition-transform"><ChevronLeft/></button>
         <div className="flex gap-2">
           {courses.map((_, i) => (
             <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'}`}/>
           ))}
         </div>
         <button onClick={onNext} className="p-4 rounded-full bg-white shadow-md text-slate-600 active:scale-90 transition-transform"><ChevronRight/></button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const CourseShowcase = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const isMobile = useIsMobile(1024);
  const pathname = usePathname();
  const { contact } = useSettings(); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await apiFetch('/stem-courses');
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if(selectedCourse) return;
      if(e.key === "ArrowLeft") handlePrev();
      if(e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedCourse, activeIndex, courses]);

  const handleNext = useCallback(() => {
    if (!courses.length) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % courses.length);
  }, [courses]);

  const handlePrev = useCallback(() => {
    if (!courses.length) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + courses.length) % courses.length);
  }, [courses]);

  return (
    <section className="relative py-16 md:py-24 bg-slate-50 overflow-hidden min-h-[700px]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 mb-12 md:mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
             <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-blue-600"></span>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  {pathname === '/' ? 'Interactive Jargon Buster' : 'World-Class Curriculum'}
                </span>
                <span className="h-px w-8 bg-blue-600"></span>
             </div>
             
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
               {pathname === '/' ? (
                 <>Your Guide to <span className="text-blue-600">Future Skills</span></>
               ) : (
                 <>Master skills that <span className="text-blue-600">define the future</span></>
               )}
             </h2>
             
             <p className="text-lg text-slate-600 leading-relaxed">
               {pathname === '/' 
                 ? "Easy explanations of common terms to kickstart your child’s innovation journey."
                 : "Explore our comprehensive curriculum designed to turn curiosity into capability."
               }
             </p>
          </motion.div>
        </div>
      </div>

      <div className="relative w-full z-10">
        {loading ? (
          <CourseSkeleton isMobile={isMobile} />
        ) : (
          courses.length > 0 && (
            <>
              {isMobile ? (
                 <div className="container mx-auto px-4">
                    <MobileCarousel 
                      courses={courses} 
                      activeIndex={activeIndex} 
                      onNext={handleNext} 
                      onPrev={handlePrev} 
                      onSelect={setSelectedCourse}
                      direction={direction}
                    />
                 </div>
              ) : (
                <DesktopCarousel 
                  courses={courses} 
                  activeIndex={activeIndex} 
                  onNext={handleNext} 
                  onPrev={handlePrev} 
                  onSelect={setSelectedCourse}
                />
              )}
            </>
          )
        )}
      </div>

      {!loading && !isMobile && courses.length > 0 && (
        <div className="container mx-auto px-4 relative z-10 mt-12">
          <div className="flex justify-center gap-3">
            {courses.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-10 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                aria-label={`Go to slide ${i+1}`}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedCourse && (
          <CourseDetailModal 
            course={selectedCourse} 
            onClose={() => setSelectedCourse(null)} 
            contact={contact} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CourseShowcase;