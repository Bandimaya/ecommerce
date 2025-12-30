"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/ThemeContext"

import HeroSection from "./home/HeroSection"
import TrustBadges from "./home/TrustBadges"
import FeaturedProducts from "./home/FeaturedProducts"
import MissionVision from "./home/MissionVision"
import ProgramsSection from "./home/ProgramsSection"
import NewsletterSection from "./home/NewsletterSection"
import BreakingJargon from "./home/BreakingJargon"
import PreferLearn from "./home/PreferLearn"
import VideoModal from "@/app/home/VideoModal"

import CircuitBackground from "@/components/background/CircuitBackground"

const Index = () => {
  const { theme } = useTheme()
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const getCSSVar = (varName: string, fallback = "") => {
    if (typeof window === "undefined" || !mounted) return fallback
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim() || fallback
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* CircuitBackground will be fixed positioned */}
      <CircuitBackground />
      
      {/* Content container with higher z-index but transparent bg */}
      <div className="relative z-10 min-h-screen">
        <HeroSection
          getCSSVar={getCSSVar}
          handleWatchVideo={() => setShowVideoModal(true)}
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