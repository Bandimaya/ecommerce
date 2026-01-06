'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Bot,
    Cpu,
    Blocks,
    GraduationCap,
    MonitorPlay,
    Sparkles,
} from 'lucide-react';
import { apiFetch } from '@/lib/axios';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

// --- Data ---
const categories = [
    {
        id: 'robotics',
        title: 'Robotics & Coding',
        image:
            'https://images.avishkaar.cc/misc/shop/Robotics-Christmas-Sale-2025/Robotics-Shop-Page-Category-Selection-Pillar-Images-(210-x-166-px)/Robotics-%26-Coding.png',
        icon: Bot,
    },
    {
        id: 'iot',
        title: 'IoT, Coding & AI',
        image:
            'https://images.avishkaar.cc/misc/shop/Robotics-Christmas-Sale-2025/Robotics-Shop-Page-Category-Selection-Pillar-Images-(210-x-166-px)/Iot-Coding-%26-AI.png',
        icon: Cpu,
    },
    {
        id: 'models',
        title: 'Beginner Models',
        image:
            'https://images.avishkaar.cc/misc/shop/Robotics-Christmas-Sale-2025/Robotics-Shop-Page-Category-Selection-Pillar-Images-(210-x-166-px)/Beginner-Model-Building.png',
        icon: Blocks,
    },
    {
        id: 'education',
        title: 'Edu Solutions',
        image:
            'https://images.avishkaar.cc/misc/shop/Robotics-Christmas-Sale-2025/Robotics-Shop-Page-Category-Selection-Pillar-Images-(210-x-166-px)/Educational-Solutions.png',
        icon: GraduationCap,
    },
    {
        id: 'courses',
        title: 'Online Courses',
        image:
            'https://images.avishkaar.cc/misc/shop/Robotics-Christmas-Sale-2025/Robotics-Shop-Page-Category-Selection-Pillar-Images-(210-x-166-px)/Courses.png',
        icon: MonitorPlay,
    },
];

export default function CategoryShowcase() {
    const [data, setData] = useState([])
    const [isHovering, setIsHovering] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiFetch('/categories')
            .then((data) => setData(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [])

    return (
        <section className="relative w-full py-24 overflow-hidden bg-background">
            {/* Global grey overlay */}
            <AnimatePresence>
                {isHovering && (
                    <motion.div
                        className="absolute inset-0 bg-muted/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    />
                )}
            </AnimatePresence>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    {/* --- Header Section --- */}
                    <div className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Curated Collections</span>
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
                    </div>


                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                        Choose Your Learning Path
                    </h2>
                </div>

                {/* Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="group relative h-[400px] rounded-3xl overflow-hidden isolate cursor-pointer">
                        <div className="absolute inset-0 bg-card border border-border shadow-xl" />
                        <div className="absolute top-0 left-0 w-full h-[65%] p-6">
                          <Skeleton className="w-full h-full rounded-md" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-card border-t border-border p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Collection
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-foreground">
                              <SkeletonText className="w-3/4" />
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <SkeletonText className="w-1/3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                    {data.map((category: any, index) => (
                        <motion.div
                            key={category.id||index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            className="group relative h-[400px] rounded-3xl overflow-hidden isolate cursor-pointer"
                        >
                            {/* Card background — STRONG DEFAULT SHADOW */}
                            <div className="absolute inset-0 bg-card border border-border shadow-xl transition-shadow duration-300 group-hover:shadow-2xl" />

                            {/* Image */}
                            <div className="absolute top-0 left-0 w-full h-[65%] flex items-center justify-center p-6">
                                <motion.img
                                    src={category.image}
                                    alt={category.title}
                                    className="w-full h-full object-contain"
                                    whileHover={{ scale: 1.12 }}
                                    transition={{ duration: 0.35, ease: 'easeOut' }}
                                />
                            </div>

                            {/* Bottom content */}
                            <div className="absolute bottom-0 left-0 w-full h-[35%] bg-card border-t border-border p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {/* <category.icon className="w-4 h-4 text-muted-foreground" /> */}
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Collection
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-foreground">
                                        {category.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                )}
            </div>
            
        </section>
    );
}
