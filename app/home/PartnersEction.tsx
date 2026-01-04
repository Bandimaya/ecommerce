'use client';

import Image from 'next/image';
// Adjust the import path based on where you saved the previous file
import BackgroundGrid from '../home/marqueeBackground/BackgroundGrid';

// --- Data ---
const PARTNER_IMAGES = [
    "https://images.avishkaar.cc/misc/home/partners/partners-aim.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-amazon.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-andhra.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-flipkart.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-goi.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-iit.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-intel.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-maharashtra.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-next.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-plaksha.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-sikkim.webp",
    "https://images.avishkaar.cc/misc/home/partners/partners-tamil-nadu.webp",
];

export default function PartnersSection() {
    return (
        // Theme-aware background and text colors
        <section className="relative py-24 bg-background overflow-hidden z-10 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05),0_5px_15px_-5px_rgba(0,0,0,0.05)]">

            <BackgroundGrid
                color="var(--border)" // Use theme border color for grid lines
                cellSize={40}
                className="z-0 opacity-40"
            />

            {/* Decorative Top/Bottom Borders using theme border color */}
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

                {/* Gradient Fade Masks - Using 'from-background' to match theme */}
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-20 bg-gradient-to-r from-background via-background/95 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-20 bg-gradient-to-l from-background via-background/95 to-transparent pointer-events-none" />

                {/* Scrolling Container */}
                <div className="marquee-container flex overflow-hidden select-none py-4">
                    <div className="marquee-track flex gap-8 md:gap-12 px-4">

                        {/* 1. First Set of Logos */}
                        {PARTNER_IMAGES.map((src, idx) => (
                            <div
                                key={`p1-${idx}`}
                                // Theme-aware card styles: bg-card, border-border, hover effects
                                className="group relative flex-shrink-0 flex items-center justify-center w-[160px] md:w-[200px] h-[100px] bg-card/90 backdrop-blur-sm rounded-xl border border-border shadow-sm transition-all duration-300 hover:bg-card hover:shadow-xl hover:-translate-y-1 hover:border-primary/50"
                            >
                                <div className="relative w-2/3 h-2/3">
                                    <Image
                                        src={src}
                                        alt={`Partner Logo ${idx + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 150px, 200px"
                                        // Removed grayscale, added opacity hover effect
                                        className="object-contain opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* 2. Duplicate Set for Infinite Loop */}
                        {PARTNER_IMAGES.map((src, idx) => (
                            <div
                                key={`p2-${idx}`}
                                className="group relative flex-shrink-0 flex items-center justify-center w-[160px] md:w-[200px] h-[100px] bg-card/90 backdrop-blur-sm rounded-xl border border-border shadow-sm transition-all duration-300 hover:bg-card hover:shadow-xl hover:-translate-y-1 hover:border-primary/50"
                            >
                                <div className="relative w-2/3 h-2/3">
                                    <Image
                                        src={src}
                                        alt={`Partner Logo ${idx + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 150px, 200px"
                                        className="object-contain opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
                                    />
                                </div>
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
                    100% { transform: translateX(calc(-50% - 2rem)); /* 2rem accounts for half the gap */ }
                }
            `}</style>
        </section>
    );
}