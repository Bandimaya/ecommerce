'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- Types ---
interface CustomContent {
  category: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

interface Slide {
  id: number;
  image: string;
  alt: string;
  videoUrl: string;
  content: CustomContent;
}

interface HeroSectionProps {
  getCSSVar?: (varName: string, fallback?: string) => string;
  handleWatchVideo?: () => void;
}

// --- Data ---
const SLIDES: Slide[] = [
  {
    id: 1,
    image: "/assets/hero/dragon.jpg",
    alt: "Smart Home Interface",
    videoUrl: "/videos/smart-home-demo.mp4",
    content: {
      category: "Innovation",
      title: "The Connected Future",
      description: "Seamlessly integrate your lifestyle with next-gen IoT solutions designed for the modern era.",
      ctaText: "Read the Article",
      ctaLink: ""
    }
  },
  {
    id: 2,
    image: "/assets/hero/pain-naruto-indigo-5120x2880-10830.png",
    alt: "Advanced Circuitry",
    videoUrl: "/videos/ai-processing.mp4",
    content: {
      category: "Technology",
      title: "Neural Processing",
      description: "Discover how AI is bridging the gap between raw silicon power and daily human interaction.",
      ctaText: "View Insights",
      ctaLink: ""
    }
  },
  {
    id: 3,
    image: "/assets/hero/spidernam.jpg",
    alt: "Smart Living Space",
    videoUrl: "/videos/living-space.mp4",
    content: {
      category: "Lifestyle",
      title: "Intelligent Living",
      description: "Transform your physical space into a responsive environment that anticipates your needs.",
      ctaText: "Explore Solutions",
      ctaLink: ""
    }
  }
];

const AUTO_PLAY_DURATION = 6000;

// --- INTERNAL COMPONENT: Sketch Cover Art ---
const SketchCoverArt = ({ onPlay }: { onPlay: () => void }) => {
  return (
    <div className="sketch-container glass-blur">
      <div className="bg-doodle beaker">H₂O</div>
      <div className="bg-doodle formula">Fe₂O₃</div>
      <div className="bg-doodle math">a²+b²=c²</div>

      <div className="sketch-scene">
        {/* Left Column */}
        <div className="scene-col">
          <div className="doodle-icon lightbulb">
             <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                <path d="M30,40 C30,20 70,20 70,40 C70,55 55,60 55,70 L45,70 C45,60 30,55 30,40" strokeLinecap="round"/>
                <path d="M45,75 L55,75 M46,80 L54,80 M48,85 L52,85" />
                <path d="M20,30 L10,20 M80,30 L90,20 M50,10 L50,0" strokeDasharray="4 4"/>
             </svg>
          </div>
          <div className="hand-text">Tomorrow's<br/>Designer</div>
          <div className="kid-placeholder girl-1">
             <Image src="https://images.unsplash.com/photo-1596464716127-f9a829be9efc?auto=format&fit=crop&q=80&w=300" alt="Designer" width={150} height={180} className="kid-img" />
             <div className="doodle-overlay paint-palette">🎨</div>
          </div>
        </div>

        {/* Center Column */}
        <div className="scene-col center-col">
          <div className="doodle-group-top">
            <div className="hand-text">Tomorrow's<br/>Innovator</div>
            <div className="doodle-icon atom">
               <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                  <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(45 50 50)"/>
                  <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(-45 50 50)"/>
                  <circle cx="50" cy="50" r="8" fill="currentColor"/>
               </svg>
            </div>
          </div>
          <div className="kid-placeholder girl-center">
             <Image src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300" alt="Innovator" width={180} height={220} className="kid-img" />
             <svg className="coat-doodle" viewBox="0 0 200 300">
                <path d="M50,100 Q40,250 30,300 M150,100 Q160,250 170,300 M50,100 L150,100" fill="none" stroke="white" strokeWidth="3" />
             </svg>
          </div>
          <div className="play-cta-container">
            <button className="big-play-btn" onClick={onPlay}>
              <div className="play-triangle"></div>
            </button>
            <div className="play-text-box glass-blur">
              <span className="red-tag">Hit Play</span><br/>See the Future
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="scene-col">
           <div className="hand-text">Tomorrow's<br/>Coder</div>
           <div className="doodle-icon code-brackets">
              <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="4">
                 <path d="M30,10 L10,30 L30,50 M70,10 L90,30 L70,50" />
                 <path d="M40,50 L60,10" />
              </svg>
           </div>
           <div className="kid-placeholder boy-1">
             <Image src="https://images.unsplash.com/photo-1519456264917-42d0aa2e0625?auto=format&fit=crop&q=80&w=300" alt="Coder" width={150} height={180} className="kid-img" />
             <div className="doodle-overlay headphones">🎧</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sketch-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          color: white;
          font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
          overflow: hidden;
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-blur {
           background: rgba(150, 150, 150, 0.25);
           backdrop-filter: blur(15px);
           -webkit-backdrop-filter: blur(15px);
           border: 1px solid rgba(255, 255, 255, 0.2);
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .sketch-scene { display: flex; justify-content: space-between; height: 100%; align-items: flex-end; position: relative; z-index: 2; }
        .scene-col { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; height: 100%; }
        .center-col { flex: 1.4; z-index: 3; }
        .hand-text { font-size: 0.9rem; font-weight: bold; text-align: center; line-height: 1.2; margin-bottom: 5px; transform: rotate(-2deg); text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .doodle-icon { width: 40px; height: 40px; margin-bottom: 5px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
        .doodle-group-top { display: flex; flex-direction: column; align-items: center; margin-top: 10px; }
        .kid-placeholder { position: relative; margin-top: auto; transition: transform 0.3s ease; display: flex; justify-content: center; }
        .kid-placeholder:hover { transform: scale(1.05); }
        .kid-img { object-fit: cover; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        .girl-center .kid-img { border: 2px dashed rgba(255,255,255,0.7); padding: 4px; border-radius: 12px; }
        .coat-doodle { position: absolute; top: 20px; left: -10px; right: -10px; bottom: 0; opacity: 0.8; pointer-events: none; }
        .play-cta-container { position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; z-index: 10; text-align: center; width: 100%; }
        .big-play-btn { width: 60px; height: 60px; background: #ea580c; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s, background 0.2s; margin-bottom: 8px; }
        .big-play-btn:hover { transform: scale(1.1); background: #c2410c; }
        .play-triangle { width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-left: 14px solid white; margin-left: 3px; }
        .play-text-box { padding: 6px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
        .red-tag { color: white; background: #ea580c; padding: 2px 5px; border-radius: 4px; font-size: 0.65rem; vertical-align: middle; }
        .bg-doodle { position: absolute; font-family: monospace; opacity: 0.2; pointer-events: none; font-weight: bold; color: white; }
        .beaker { top: 10%; left: 10%; font-size: 1.2rem; transform: rotate(15deg); }
        .formula { top: 15%; right: 10%; font-size: 1rem; }
        .math { top: 40%; right: 5%; font-size: 0.9rem; transform: rotate(-5deg); }
        .doodle-overlay { position: absolute; font-size: 1.2rem; top: -8px; right: -8px; transform: rotate(15deg); text-shadow: 0 2px 5px rgba(0,0,0,0.5); }

        @media (max-width: 768px) {
           .hand-text { font-size: 0.7rem; }
           .doodle-icon { width: 25px; height: 25px; }
           .kid-img { width: 70px !important; height: 90px !important; }
           .sketch-container { padding: 10px; }
           .big-play-btn { width: 50px; height: 50px; }
        }
      `}</style>
    </div>
  );
};

// --- HERO SECTION ---
const HeroSection = ({ getCSSVar, handleWatchVideo }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Dynamic Theme Color Extraction ---
  // If getCSSVar is passed, grab the primary color (e.g., --primary).
  // Fallback to the orange (#ea580c) used in the Sketch Art.
  const themeAccent = getCSSVar ? getCSSVar('--primary', '#ea580c') : '#ea580c';

  // --- Logic ---
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const resetAutoplay = () => {
    setIsAutoPlaying(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const openVideoModal = (videoUrl: string) => {
    setIsAutoPlaying(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveVideo(videoUrl);
    setShowModal(true);
  };

  const closeVideoModal = () => {
    setShowModal(false);
    setActiveVideo("");
    resetAutoplay();
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(handleNext, AUTO_PLAY_DURATION);
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  // Keyboard Support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showModal) return;
      if (e.key === 'ArrowRight') { handleNext(); resetAutoplay(); }
      if (e.key === 'ArrowLeft') { handlePrev(); resetAutoplay(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handlePrev, showModal]);

  return (
    <section 
      className="hero-wrapper" 
      aria-label="Featured Highlights"
      // Inject the theme color as a CSS variable for this section
      style={{ '--theme-accent': themeAccent } as React.CSSProperties}
    >

      {/* 1. Background Layer */}
      <div className="bg-layer">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div key={slide.id} className={`bg-slide ${isActive ? 'active' : ''}`} aria-hidden={!isActive}>
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                className={`bg-image ${isActive ? 'ken-burns' : ''}`}
                quality={90}
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="overlay-gradient" />
            </div>
          );
        })}
      </div>

      {/* 2. Main Content Grid */}
      <div className="content-grid">

        {/* Left: Text Content */}
        <div className="text-zone">
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className={`text-content ${index === currentIndex ? 'active' : ''}`}>
              <div className="category-tag">
                <span className="line" />
                {slide.content.category}
              </div>

              <h1 className="main-title">
                {slide.content.title.split(' ').map((word, i) => (
                  <span key={i} className="title-word" style={{ transitionDelay: `${i * 100}ms` }}>
                    {word}&nbsp;
                  </span>
                ))}
              </h1>

              <p className="description">{slide.content.description}</p>

              <div className="button-group">
                <Link href={slide.content.ctaLink} className="glass-button" onClick={resetAutoplay}>
                  <span>{slide.content.ctaText}</span>
                  <div className="icon-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </Link>

                {/* --- MOBILE ONLY: Watch Video Button (Only on slide 3) --- */}
                {index === 2 && (
                    <button
                        className="mobile-watch-video-btn"
                        onClick={() => openVideoModal(slide.videoUrl)}
                        aria-label="Watch Video"
                    >
                        {/* Outer grey ring and inner white circle container */}
                        <div className="play-icon-ring">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <span className="btn-text">Watch video</span>
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Dynamic Feature Area */}
        <div className="feature-zone">
          {/* Only Show Sketch Art on Slide 3 */}
          <div className={`feature-item ${currentIndex === 2 ? 'active' : ''}`}>
             <SketchCoverArt onPlay={() => openVideoModal(SLIDES[2].videoUrl)} />
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION CONTROLS (Moved Outside Grid) */}

      {/* Left Navigation Arrow */}
      <button
        className="nav-arrow left"
        onClick={(e) => { e.stopPropagation(); handlePrev(); resetAutoplay(); }}
        aria-label="Previous Slide"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
           <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Right Navigation Arrow */}
      <button
        className="nav-arrow right"
        onClick={(e) => { e.stopPropagation(); handleNext(); resetAutoplay(); }}
        aria-label="Next Slide"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
           <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Bottom Horizontal Pagination */}
      <div className="pagination-container">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { goToSlide(idx); resetAutoplay(); }}
            className={`progress-item ${idx === currentIndex ? 'active' : ''}`}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span className="progress-number">0{idx + 1}</span>
            <span className="progress-bar">
              <span className="progress-fill" />
            </span>
          </button>
        ))}
      </div>

      {/* --- Video Modal --- */}
      {showModal && (
          <div className="modal-backdrop" onClick={closeVideoModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={closeVideoModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div className="video-wrapper">
                    <video src={activeVideo} controls autoPlay className="video-player" />
                </div>
            </div>
          </div>
      )}

      <style jsx>{`
        /* --- Layout --- */
        .hero-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          background: #050505;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .bg-layer { position: absolute; inset: 0; z-index: 0; }
        .bg-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .bg-slide.active { opacity: 1; z-index: 1; }
        .bg-image { transform: scale(1.1); transition: transform 10s ease-out; }
        .bg-slide.active .ken-burns { transform: scale(1); }

        .overlay-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%);
          z-index: 2;
        }

        /* --- Content Grid (Simplified) --- */
        .content-grid {
          position: relative;
          z-index: 10;
          display: grid;
          /* Left Text (Auto) | Right Feature (500px) */
          grid-template-columns: 1fr 500px;
          height: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 100px; /* Added side padding to make room for arrows */
          gap: 40px;
          align-items: center; /* Vertically center the grid content */
        }

        /* --- Text Zone --- */
        .text-zone {
          display: flex;
          align-items: center;
          position: relative;
          height: 100%;
        }

        .text-content {
          position: absolute;
          left: 0;
          width: 100%;
          max-width: 700px;
          opacity: 0;
          pointer-events: none;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .text-content.active { opacity: 1; pointer-events: all; transform: translateY(0); }

        .category-tag { display: flex; align-items: center; gap: 12px; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; color: #bbb; margin-bottom: 24px; }
        .line { width: 40px; height: 2px; background: #fff; }

        .main-title {
          font-size: clamp(3rem, 5vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          display: flex;
          flex-wrap: wrap;
        }

        .title-word { display: inline-block; transform: translateY(100%); opacity: 0; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s; }
        .text-content.active .title-word { transform: translateY(0); opacity: 1; }

        .description { font-size: 18px; line-height: 1.6; color: rgba(255, 255, 255, 0.9); max-width: 500px; margin-bottom: 40px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }

        .button-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* --- Updated CTA Button Styling --- */
        .glass-button {
          display: inline-flex; 
          align-items: center; 
          gap: 12px; 
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.1); 
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2); 
          color: white;
          text-decoration: none; 
          font-weight: 600; 
          transition: all 0.3s ease; 
          cursor: pointer;
          border-radius: 50px; /* Modern rounded pill */
        }
        
        .glass-button:hover { 
          /* Use the theme variable injected in wrapper */
          background: var(--theme-accent, #fff); 
          border-color: var(--theme-accent, #fff);
          color: white; 
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.3);
        }

        .icon-wrapper {
            display: flex;
            align-items: center;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Arrow Movement on Hover */
        .glass-button:hover .icon-wrapper {
            transform: translateX(4px);
        }

        /* --- New Mobile Video Button Styles (Hidden by default) --- */
        .mobile-watch-video-btn {
            display: none; /* Hidden on desktop */
            align-items: center;
            gap: 12px;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            /* margin-left: 12px;  Optional spacing if next to another button */
        }

        /* The outer grey semi-transparent ring */
        .play-icon-ring {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            transition: transform 0.2s ease;
        }

        /* The inner white circle */
        .play-icon-ring::after {
             content: '';
             position: absolute;
             width: 32px;
             height: 32px;
             background: white;
             border-radius: 50%;
             z-index: 1;
        }

        /* The red play triangle */
        .play-icon-ring svg {
            color: var(--theme-accent, #dc2626); /* Adapts to theme too! */
            z-index: 2;
            position: relative;
            left: 1px; /* Optical adjustment for centering the triangle */
        }
        
        .mobile-watch-video-btn:hover .play-icon-ring {
            transform: scale(1.05);
        }

        .btn-text {
            color: white;
            font-weight: 700;
            font-size: 16px;
            white-space: nowrap;
        }


        /* --- Feature Zone --- */
        .feature-zone {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            height: 400px; /* Fixed height for the sketch area */
        }
        .feature-item {
            position: absolute; width: 100%; height: 100%; opacity: 0;
            transform: scale(0.95) translateX(20px);
            transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: none; visibility: hidden;
        }
        .feature-item.active { opacity: 1; transform: scale(1) translateX(0); pointer-events: all; visibility: visible; }

        /* --- Navigation Arrows (Center Left/Right) --- */
        .nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            z-index: 50;
            transition: all 0.3s ease;
        }
        .nav-arrow:hover { 
            background: var(--theme-accent, rgba(255,255,255,0.2)); 
            transform: translateY(-50%) scale(1.1); 
            border-color: var(--theme-accent, white); 
        }
        .nav-arrow.left { left: 30px; }
        .nav-arrow.right { right: 30px; }

        /* --- Pagination (Bottom Horizontal) --- */
        .pagination-container {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: row; /* Horizontal */
            gap: 40px;
            z-index: 50;
        }

        .progress-item {
            display: flex; flex-direction: column; align-items: center; gap: 8px;
            background: none; border: none; cursor: pointer; color: rgba(255, 255, 255, 0.4);
            transition: color 0.3s;
        }
        .progress-item.active { color: white; }

        .progress-number { font-family: monospace; font-size: 14px; }

        .progress-bar {
            width: 50px; height: 2px; background: rgba(255, 255, 255, 0.2);
            position: relative; overflow: hidden;
        }
        .progress-fill { position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: var(--theme-accent, white); }
        .progress-item.active .progress-fill { width: 100%; transition: width ${AUTO_PLAY_DURATION}ms linear; }


        /* --- Modal Styles --- */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .modal-container {
          background: #000;
          width: 100%;
          max-width: 1000px;
          aspect-ratio: 16/9;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          display: flex; flex-direction: column;
        }

        .close-btn {
          position: absolute; top: 15px; right: 15px; z-index: 20;
          background: rgba(0,0,0,0.5); border: none; border-radius: 50%;
          width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; transition: background 0.2s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.2); }
        .video-wrapper { width: 100%; height: 100%; background: black; }
        .video-player { width: 100%; height: 100%; object-fit: contain; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* --- Responsive --- */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
            padding: 0 40px;
            text-align: center;
          }
          .text-zone { justify-content: center; }
          .text-content { align-items: center; display: flex; flex-direction: column; }
          .main-title { justify-content: center; }
          .category-tag { margin-top: 60px; }
          .feature-zone { display: none; } /* Hide sketch on mobile */

          /* Center button group on mobile */
          .button-group {
             justify-content: center;
             align-items: center;
          }

          /* Show the new Mobile Video Button */
          .mobile-watch-video-btn { display: flex; }

          .nav-arrow { width: 40px; height: 40px; bottom: 30px; top: auto; transform: none; }
          .nav-arrow.left { left: 20px; }
          .nav-arrow.right { right: 20px; }
          .pagination-container { bottom: 30px; gap: 20px; }
        }

        @media (max-width: 768px) {
          .main-title { font-size: 2.5rem; }
          .pagination-container { display: none; }
          .modal-backdrop { padding: 10px; }
          .glass-button { width: 100%; justify-content: center; }

          /* On smaller screens, stack the buttons if the video button is present */
          .button-group { flex-direction: column; width: 100%; }
          .mobile-watch-video-btn { margin-top: 16px; }

          /* Ensure modal fits on mobile portrait */
          .modal-container { aspect-ratio: auto; height: auto; min-height: 250px; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;