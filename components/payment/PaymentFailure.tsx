"use client"

import React, { useMemo, useState } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { X, RefreshCw, ArrowRight, AlertTriangle, ChevronDown, ChevronUp, CreditCard, ShieldAlert } from "lucide-react"

/* ===== CONFIGURATION ===== */
const TRACE_COUNT = 40 
const CENTER = 150
const INNER_RADIUS = 55
const ELBOW_RADIUS = 105
const OUTER_RADIUS_MAX = 145
const OUTER_RADIUS_MIN = 115

const PaymentFailure: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showTechDetails, setShowTechDetails] = useState(false)

  // --- MOCK ERROR DATA ---
  // In a real app, this comes from your payment provider (Stripe/PayPal) response
  const errorData = {
    userMessage: "Your bank declined the transaction due to insufficient funds.",
    suggestion: "Please top up your account or try a different card.",
    code: "insufficient_funds",
    declineCode: "do_not_honor",
    traceId: "req_8084-2919-err",
    timestamp: "2026-01-06T10:45:00Z"
  }

  const handleRetry = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  // --- GEOMETRY LOGIC (Jittery/Broken Lines) ---
  const traces = useMemo(() => {
    return Array.from({ length: TRACE_COUNT }).map((_, i) => {
      const angle = (2 * Math.PI * i) / TRACE_COUNT
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const verticalStrength = Math.abs(sin)
      const outerRadius = OUTER_RADIUS_MIN + verticalStrength * (OUTER_RADIUS_MAX - OUTER_RADIUS_MIN)

      const x1 = CENTER + INNER_RADIUS * cos
      const y1 = CENTER + INNER_RADIUS * sin
      const x2 = CENTER + ELBOW_RADIUS * cos
      const y2 = CENTER + ELBOW_RADIUS * sin
      
      const horizontalDominant = Math.abs(cos) > Math.abs(sin)
      const x3 = horizontalDominant ? CENTER + outerRadius * cos : x2
      const y3 = horizontalDominant ? y2 : CENTER + outerRadius * sin

      const cp1x = x1 + (x2 - x1) * 0.5
      const cp1y = y1 + (y2 - y1) * 0.5
      const cp2x = x3 - (x3 - x2) * 0.5
      const cp2y = y3 - (y3 - y2) * 0.5

      return {
        d: `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x3} ${y3}`,
        cx: x3, cy: y3,
        delay: i * 0.01, 
      }
    })
  }, [])

  // --- ANIMATION VARIANTS ---
  const failureLineVariant: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: { delay: number }) => ({
      pathLength: [0, 0.3, 0.1, 0.6, 1], // Glitchy draw
      opacity: [0, 0.5, 0.2, 0.6],
      transition: { duration: 1.2, delay: custom.delay, times: [0, 0.2, 0.4, 0.8, 1] },
    }),
  }

  const shakeVariant: Variants = {
    visible: {
      x: [0, -4, 4, -4, 4, 0],
      transition: { delay: 0.5, duration: 0.4 }
    }
  }

  const containerVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.98 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-6 font-sans text-slate-900 overflow-hidden relative">
      
      {/* Red/Orange Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-red-500/10 blur-[120px]" 
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[100px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-5xl bg-white shadow-2xl shadow-red-900/10 overflow-hidden rounded-[24px] border border-white/60 backdrop-blur-xl z-10"
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          
          {/* ======================= */}
          {/* LEFT: ERROR VISUALS     */}
          {/* ======================= */}
          <div className="relative w-full lg:w-[50%] bg-red-50/30 flex flex-col items-center justify-center p-10 lg:border-r border-red-100/50 overflow-hidden">
            
            {/* Circuit Canvas */}
            <div className="relative flex items-center justify-center mb-8 scale-110 sm:scale-125">
               {/* Red Glow Filter */}
               <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                  <filter id="red-glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
               </svg>

               <svg viewBox="0 0 300 300" className="w-[340px] h-[340px]">
                 <defs>
                   <linearGradient id="failure-gradient" x1="0" y1="0" x2="1" y2="1">
                     <stop offset="0%" stopColor="#ef4444" />
                     <stop offset="100%" stopColor="#f97316" />
                   </linearGradient>
                 </defs>
                 
                 <g fill="none" stroke="url(#failure-gradient)" strokeWidth="1.5" strokeLinecap="round" filter="url(#red-glow)">
                   {traces.map((t, i) => (
                     <motion.path
                       key={i}
                       d={t.d}
                       custom={{ delay: t.delay }}
                       variants={failureLineVariant}
                       initial="hidden"
                       animate="visible"
                       strokeDasharray="2 5"
                     />
                   ))}
                 </g>
               </svg>

               {/* Central "X" Core */}
               <div className="absolute z-10 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-red-500 blur-xl"
                  />
                  <motion.div
                    variants={shakeVariant}
                    className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_15px_40px_-5px_rgba(239,68,68,0.5)] ring-[5px] ring-white"
                  >
                    <X className="h-12 w-12 text-white stroke-[4px]" />
                  </motion.div>
               </div>
            </div>

            <div className="text-center px-6">
               <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Payment Failed</h2>
               <p className="text-rose-600 font-semibold bg-rose-100/50 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mx-auto border border-rose-200">
                 <ShieldAlert size={16} />
                 Transaction Declined
               </p>
            </div>
          </div>

          {/* ======================= */}
          {/* RIGHT: DIAGNOSTICS      */}
          {/* ======================= */}
          <div className="relative w-full lg:w-[50%] bg-white p-8 sm:p-12 flex flex-col justify-center">
             
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1, duration: 0.5 }}
               className="w-full max-w-md mx-auto"
             >
                {/* --- DIAGNOSTIC REPORT --- */}
                <div className="mb-6">
                   <div className="flex items-center gap-2 mb-3">
                     <AlertTriangle className="text-orange-500" size={20} />
                     <h3 className="text-lg font-bold text-slate-900">Diagnostic Report</h3>
                   </div>
                   
                   <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-r-lg mb-4">
                     <h4 className="font-bold text-orange-900 text-sm mb-1">Reason for Failure</h4>
                     <p className="text-orange-800 text-sm leading-relaxed mb-3">
                       {errorData.userMessage}
                     </p>
                     <div className="bg-white/60 p-2 rounded text-xs font-semibold text-orange-800 flex items-center gap-2">
                       <span className="bg-orange-200 px-1.5 rounded text-[10px] uppercase tracking-wide">Fix</span>
                       {errorData.suggestion}
                     </div>
                   </div>
                </div>

                {/* --- TECHNICAL DETAILS TOGGLE --- */}
                <div className="mb-8 border border-slate-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setShowTechDetails(!showTechDetails)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-slate-600">Technical Details</span>
                    {showTechDetails ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                  </button>
                  
                  <AnimatePresence>
                    {showTechDetails && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-900 p-4"
                      >
                        <div className="space-y-2 font-mono text-xs text-slate-300">
                          <TechRow label="Status Code" value="402 Payment Required" />
                          <TechRow label="Error Code" value={errorData.code} color="text-red-400" />
                          <TechRow label="Decline Code" value={errorData.declineCode} />
                          <TechRow label="Trace ID" value={errorData.traceId} />
                          <TechRow label="Timestamp" value={errorData.timestamp} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* --- ACTIONS --- */}
                <div className="flex flex-col gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRetry}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-[12px] shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 transition-all cursor-pointer"
                  >
                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    {isLoading ? "Retrying..." : "Retry Payment"}
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold text-base rounded-[12px] flex items-center justify-center gap-2 transition-all"
                  >
                    <CreditCard size={18} />
                    Use Different Method
                  </motion.button>
                </div>
             </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}

// --- Helper Component ---
const TechRow = ({ label, value, color = "text-slate-300" }: { label: string; value: string, color?: string }) => (
  <div className="flex justify-between border-b border-slate-800 pb-1 last:border-0 last:pb-0">
    <span className="text-slate-500">{label}</span>
    <span className={color}>{value}</span>
  </div>
)

export default PaymentFailure