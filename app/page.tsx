"use client"

import { useState, useEffect } from "react"
import { useProducts } from "@/contexts/ProductsContext"
import { useTheme } from "@/contexts/ThemeContext"
import HeroSection from "./home/HeroSection"
import TrustBadges from "./home/TrustBadges"
import FeaturedProducts from "./home/FeaturedProducts"
import MissionVision from "./home/MissionVision"
import ProgramsSection from "./home/ProgramsSection"
import NewsletterSection from "./home/NewsletterSection"
import BreakingJargon from "./home/BreakingJargon"
import VideoModal from "@/app/home/VideoModal"
import PreferLearn from "./home/PreferLearn"

const Index = () => {
  const { theme } = useTheme()
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Get CSS custom properties with fallbacks
  const getCSSVar = (varName: string, fallback?: string) => {
    if (typeof window === 'undefined') return fallback || ''
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim() || fallback || ''
  }

  const handleWatchVideo = () => {
    setShowVideoModal(true)
  }

  return (
    <div className="min-h-screen overflow-hidden relative bg-[#f8f9fa]">
      {/* Light Grey Motherboard Background */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[#f0f2f5]">
          {/* Motherboard Circuit Pattern */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="motherboard-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                {/* Light grey base */}
                <rect width="200" height="200" fill="#e9ecef" />
                
                {/* Main circuit lines (subtle grey) */}
                <path d="M20,20 L180,20 L180,180 L20,180 Z" fill="none" stroke="#dee2e6" strokeWidth="2" />
                <path d="M40,40 L160,40 L160,160 L40,160 Z" fill="none" stroke="#dee2e6" strokeWidth="1.5" />
                
                {/* Horizontal traces */}
                <line x1="20" y1="60" x2="180" y2="60" stroke="#ced4da" strokeWidth="1" />
                <line x1="20" y1="80" x2="180" y2="80" stroke="#ced4da" strokeWidth="1" />
                <line x1="20" y1="100" x2="180" y2="100" stroke="#ced4da" strokeWidth="1" />
                <line x1="20" y1="120" x2="180" y2="120" stroke="#ced4da" strokeWidth="1" />
                <line x1="20" y1="140" x2="180" y2="140" stroke="#ced4da" strokeWidth="1" />
                
                {/* Vertical traces */}
                <line x1="60" y1="20" x2="60" y2="180" stroke="#ced4da" strokeWidth="1" />
                <line x1="80" y1="20" x2="80" y2="180" stroke="#ced4da" strokeWidth="1" />
                <line x1="100" y1="20" x2="100" y2="180" stroke="#ced4da" strokeWidth="1" />
                <line x1="120" y1="20" x2="120" y2="180" stroke="#ced4da" strokeWidth="1" />
                <line x1="140" y1="20" x2="140" y2="180" stroke="#ced4da" strokeWidth="1" />
                
                {/* Diagonal traces */}
                <line x1="20" y1="20" x2="180" y2="180" stroke="#e9ecef" strokeWidth="0.5" strokeDasharray="4,4" />
                <line x1="180" y1="20" x2="20" y2="180" stroke="#e9ecef" strokeWidth="0.5" strokeDasharray="4,4" />
                
                {/* CPU Socket */}
                <rect x="70" y="70" width="60" height="60" rx="3" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1.5" />
                <circle cx="75" cy="75" r="2" fill="#adb5bd" />
                <circle cx="85" cy="75" r="2" fill="#adb5bd" />
                <circle cx="95" cy="75" r="2" fill="#adb5bd" />
                <circle cx="105" cy="75" r="2" fill="#adb5bd" />
                <circle cx="115" cy="75" r="2" fill="#adb5bd" />
                <circle cx="125" cy="75" r="2" fill="#adb5bd" />
                
                {/* RAM Slots */}
                <rect x="30" y="30" width="40" height="12" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="30" y="50" width="40" height="12" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="130" y="30" width="40" height="12" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="130" y="50" width="40" height="12" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                
                {/* PCI Express Slots */}
                <rect x="30" y="160" width="140" height="8" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="30" y="140" width="140" height="8" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="30" y="120" width="140" height="8" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                
                {/* Capacitors */}
                <circle cx="50" cy="90" r="4" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <circle cx="50" cy="110" r="4" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <circle cx="150" cy="90" r="4" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <circle cx="150" cy="110" r="4" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                
                {/* Resistors */}
                <rect x="45" cy="170" width="20" height="4" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="135" cy="170" width="20" height="4" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                
                {/* SATA Ports */}
                <rect x="20" y="180" width="15" height="6" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="40" y="180" width="15" height="6" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="145" y="180" width="15" height="6" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="165" y="180" width="15" height="6" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                
                {/* VRM Components */}
                <rect x="65" y="20" width="10" height="10" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="85" y="20" width="10" height="10" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="105" y="20" width="10" height="10" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="125" y="20" width="10" height="10" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                
                {/* Chipsets */}
                <rect x="20" y="100" width="20" height="20" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="160" y="100" width="20" height="20" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                
                {/* Power Connectors */}
                <rect x="180" y="70" width="15" height="10" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="180" y="90" width="15" height="10" rx="2" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                
                {/* Audio Components */}
                <rect x="20" y="70" width="15" height="15" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <circle cx="27.5" cy="77.5" r="2" fill="#adb5bd" />
                <circle cx="27.5" cy="82.5" r="2" fill="#adb5bd" />
                
                {/* Network Interface */}
                <rect x="160" y="70" width="15" height="15" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <line x1="163" y1="73" x2="172" y2="73" stroke="#adb5bd" strokeWidth="1" />
                <line x1="163" y1="77" x2="172" y2="77" stroke="#adb5bd" strokeWidth="1" />
                <line x1="163" y1="81" x2="172" y2="81" stroke="#adb5bd" strokeWidth="1" />
                
                {/* USB Headers */}
                <rect x="20" y="130" width="10" height="20" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="35" y="130" width="10" height="20" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="155" y="130" width="10" height="20" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <rect x="170" y="130" width="10" height="20" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                
                {/* Fan Headers */}
                <circle cx="25" cy="150" r="6" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <circle cx="175" cy="150" r="6" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <line x1="22" y1="150" x2="28" y2="150" stroke="#adb5bd" strokeWidth="1" />
                <line x1="25" y1="147" x2="25" y2="153" stroke="#adb5bd" strokeWidth="1" />
                
                {/* BIOS Chip */}
                <rect x="85" y="170" width="30" height="10" rx="1" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="1" />
                <line x1="88" y1="172" x2="112" y2="172" stroke="#adb5bd" strokeWidth="0.5" />
                <line x1="88" y1="175" x2="112" y2="175" stroke="#adb5bd" strokeWidth="0.5" />
                <line x1="88" y1="178" x2="112" y2="178" stroke="#adb5bd" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#motherboard-pattern)" />
          </svg>
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9fa] via-transparent to-[#f8f9fa] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa] via-transparent to-[#f8f9fa] opacity-30" />
        
        {/* Very subtle connection dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[3px] h-[3px] bg-[#adb5bd] rounded-full"
              style={{
                left: `${20 + Math.random() * 80}%`,
                top: `${20 + Math.random() * 80}%`,
                opacity: 0.3 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10">
        <HeroSection 
          getCSSVar={getCSSVar} 
          handleWatchVideo={handleWatchVideo} 
        />
        
        <TrustBadges getCSSVar={getCSSVar} />
        
        <FeaturedProducts 
          getCSSVar={getCSSVar} 
          isMobile={isMobile} 
        />
        
        <MissionVision getCSSVar={getCSSVar} />
        
        <ProgramsSection getCSSVar={getCSSVar} />
        
        <BreakingJargon />

        <PreferLearn />
        
        <VideoModal 
          show={showVideoModal} 
          onClose={() => setShowVideoModal(false)} 
          getCSSVar={getCSSVar}
        />
        <NewsletterSection getCSSVar={getCSSVar} />
      </div>
    </div>
  )
}

export default Index