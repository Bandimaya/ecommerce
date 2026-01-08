'use client';

import Image from 'next/image';
import BackgroundGrid from './marqueeBackground/BackgroundGrid';
import { apiFetch } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { IMAGE_URL } from '@/lib/constants';

export default function PartnersSection() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        apiFetch('/partner-images')
            .then((response) => {
                setData(response);
            }).catch((error) => {
                console.error('Error fetching partner images:', error);
            });
    }, [])

    return (
        <section className="relative py-24 bg-background overflow-hidden z-10 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05),0_5px_15px_-5px_rgba(0,0,0,0.05)]">

            <BackgroundGrid
                color="var(--border)"
                cellSize={40}
                className="z-0 opacity-40"
            />

            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent z-10" />

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 mb-16 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4 border border-primary/20">
                    OUR ECOSYSTEM
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                    Trusted by Renowned Institutions
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                    We are proud to power innovation labs and STEM learning initiatives for leading governments, tech giants, and educational bodies.
                </p>
            </div>

            {/* Marquee Wrapper */}
            <div className="relative z-10 w-full">

                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-20 bg-gradient-to-r from-background via-background/95 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-20 bg-gradient-to-l from-background via-background/95 to-transparent pointer-events-none" />

                {/* Scrolling Container */}
                <div className="marquee-container flex overflow-hidden select-none py-4">
                    <div className="marquee-track flex gap-8 md:gap-12 px-4">

                        {/* 1. First Set of Images */}
                        {data.map((src: any, idx) => (
                            <div
                                key={`p1-${idx}`}
                                // UPDATES:
                                // 1. Set specific width (160px) and height (80px)
                                // 2. Added rounded-[10px] and overflow-hidden
                                // 3. Removed bg-card, border, shadow (Removed card styling)
                                className="relative flex-shrink-0 w-[160px] h-[80px] rounded-[10px] overflow-hidden transition-transform duration-300 hover:scale-105"
                            >
                                <img
                                    src={IMAGE_URL + src?.image}
                                    alt={`Partner Logo ${idx + 1}`}
                                    sizes="160px"
                                    // Ensures image covers the 160x80 area completely
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}

                        {/* 2. Duplicate Set for Infinite Loop */}
                        {data.map((src: any, idx) => (
                            <div
                                key={`p2-${idx}`}
                                className="relative flex-shrink-0 w-[160px] h-[80px] rounded-[10px] overflow-hidden transition-transform duration-300 hover:scale-105"
                            >
                                <img
                                    src={IMAGE_URL + src?.image}
                                    alt={`Partner Logo ${idx + 1}`}
                                    sizes="160px"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            <style jsx>{`
                .marquee-track {
                    width: max-content;
                    animation: scroll 50s linear infinite;
                }

                .marquee-container:hover .marquee-track {
                    animation-play-state: paused;
                }

                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-50% - 2rem)); }
                }
            `}</style>
        </section>
    );
}