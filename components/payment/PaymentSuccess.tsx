"use client"

import React, { useMemo, useState } from "react"
import { motion, Variants } from "framer-motion"
import { Check, Share2, Download, Printer, ArrowLeft, Copy } from "lucide-react"

/* ===== CONFIGURATION ===== */
const TRACE_COUNT = 50
const CENTER = 150
const INNER_RADIUS = 55
const ELBOW_RADIUS = 105
const OUTER_RADIUS_MAX = 145
const OUTER_RADIUS_MIN = 115

const PaymentSuccess: React.FC = () => {
  const [isSharing, setIsSharing] = useState(false)

  // --- 1. FUNCTIONALITY HANDLERS ---

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Payment Receipt',
      text: 'Here is my payment receipt for transaction #8084-2919.',
      url: window.location.href // Or your specific receipt URL
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share canceled')
      }
    } else {
      // Fallback for Desktop: Copy to Clipboard
      setIsSharing(true)
      navigator.clipboard.writeText(`Transaction #8084-2919: $125.00`)
      setTimeout(() => setIsSharing(false), 2000)
    }
  }

  const handleDownload = () => {
    // Simulating a download delay
    const link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent("Receipt: $125.00 - Transaction #8084-2919");
    link.download = "receipt-8084-2919.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- 2. GEOMETRY LOGIC (Enhanced Bezier Curves) ---
  const traces = useMemo(() => {
    return Array.from({ length: TRACE_COUNT }).map((_, i) => {
      const angle = (2 * Math.PI * i) / TRACE_COUNT
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const verticalStrength = Math.abs(sin)
      const outerRadius = OUTER_RADIUS_MIN + verticalStrength * (OUTER_RADIUS_MAX - OUTER_RADIUS_MIN)

      // Points
      const x1 = CENTER + INNER_RADIUS * cos
      const y1 = CENTER + INNER_RADIUS * sin
      const x2 = CENTER + ELBOW_RADIUS * cos
      const y2 = CENTER + ELBOW_RADIUS * sin // Control point area
      
      const horizontalDominant = Math.abs(cos) > Math.abs(sin)
      const x3 = horizontalDominant ? CENTER + outerRadius * cos : x2
      const y3 = horizontalDominant ? y2 : CENTER + outerRadius * sin

      // Cubic Bezier Logic for organic smooth curves
      // M start C control1 control2 end
      // We pull the control points towards the elbow to make it curve nicely
      const cp1x = x1 + (x2 - x1) * 0.5
      const cp1y = y1 + (y2 - y1) * 0.5
      const cp2x = x3 - (x3 - x2) * 0.5
      const cp2y = y3 - (y3 - y2) * 0.5

      return {
        d: `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x3} ${y3}`,
        cx: x3,
        cy: y3,
        delay: i * 0.02, 
      }
    })
  }, [])

  // --- 3. ANIMATION VARIANTS ---

  const pulseLineVariant: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: { delay: number }) => ({
      pathLength: 1,
      opacity: [0.1, 0.6, 0.3], // Pulsing opacity
      pathOffset: [0, 1], // Moving data effect
      transition: {
        pathLength: { duration: 1, ease: "easeOut", delay: custom.delay },
        opacity: { duration: 3, repeat: Infinity, ease: "linear" },
        // This simulates data flowing continuously
        pathOffset: { duration: 4, repeat: Infinity, ease: "linear", from: 0, to: -2 } 
      },
    }),
  }

  const nodeVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: { delay: number }) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: custom.delay + 0.8, type: "spring", stiffness: 300 }
    }),
  }

  const containerVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.98 },
    visible: { 
      y: 0, opacity: 1, scale: 1, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-6 font-sans text-slate-900 overflow-hidden relative print:bg-white print:p-0">
      
      {/* Background Ambience (Hidden in Print) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-300/20 blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-300/20 blur-[100px]" 
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-5xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden rounded-[24px] border border-white/60 backdrop-blur-xl z-10 print:shadow-none print:border-none print:w-full print:max-w-none"
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          
          {/* ======================= */}
          {/* LEFT: VISUALIZATION     */}
          {/* ======================= */}
          <div className="relative w-full lg:w-[55%] bg-slate-50/50 flex flex-col items-center justify-center p-12 lg:border-r border-gray-100 overflow-hidden print:hidden">
            
            {/* Circuit Canvas */}
            <div className="relative flex items-center justify-center mb-10 scale-125">
               {/* SVG Glow Filter */}
               <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
               </svg>

               <svg viewBox="0 0 300 300" className="w-[340px] h-[340px] rotate-0">
                 <defs>
                   <linearGradient id="circuit-gradient" x1="0" y1="0" x2="1" y2="1">
                     <stop offset="0%" stopColor="#10b981" />
                     <stop offset="100%" stopColor="#3b82f6" />
                   </linearGradient>
                 </defs>
                 
                 <g fill="none" stroke="url(#circuit-gradient)" strokeWidth="1.5" strokeLinecap="round" filter="url(#glow)">
                   {traces.map((t, i) => (
                     <React.Fragment key={i}>
                       <motion.path
                         d={t.d}
                         custom={{ delay: t.delay }}
                         variants={pulseLineVariant}
                         initial="hidden"
                         animate="visible"
                         strokeDasharray="4 4" // Dashed line for data effect
                       />
                       <motion.circle
                         cx={t.cx} cy={t.cy} r="2"
                         fill="white" stroke="#10b981" strokeWidth="1"
                         custom={{ delay: t.delay }}
                         variants={nodeVariants}
                         initial="hidden" animate="visible"
                       />
                     </React.Fragment>
                   ))}
                 </g>
               </svg>

               {/* Center Checkmark with Ripple */}
               <div className="absolute z-10 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-emerald-400"
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-[0_10px_30px_rgba(16,185,129,0.4)] ring-4 ring-white"
                  >
                    <Check className="h-12 w-12 text-white stroke-[3px]" />
                  </motion.div>
               </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1 }}
              className="text-center"
            >
               <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Payment Confirmed</h2>
               <p className="text-slate-500 font-medium">Transferred securely to merchant.</p>
            </motion.div>
          </div>

          {/* ======================= */}
          {/* RIGHT: RECEIPT & ACTIONS */}
          {/* ======================= */}
          <div className="relative w-full lg:w-[45%] bg-white p-8 sm:p-12 flex flex-col justify-center print:w-full print:p-0">
             
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1.2, duration: 0.5 }}
               className="w-full max-w-md mx-auto"
             >
                <div className="flex items-center justify-between mb-8 print:hidden">
                  <h3 className="text-2xl font-bold text-slate-900">Receipt</h3>
                  <div className="flex gap-3">
                    {/* PRINT BUTTON */}
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrint}
                      className="p-2.5 text-slate-400 hover:text-slate-700 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                      title="Print Receipt"
                    >
                      <Printer size={20} />
                    </motion.button>
                    
                    {/* SHARE BUTTON */}
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="p-2.5 text-slate-400 hover:text-slate-700 rounded-xl transition-colors border border-transparent hover:border-slate-200 relative"
                      title="Share Receipt"
                    >
                      {isSharing ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
                    </motion.button>
                  </div>
                </div>
                
                {/* --- PHYSICAL RECEIPT LOOK --- */}
                <div className="bg-slate-50/80 border border-slate-200 p-8 rounded-[16px] shadow-sm mb-8 print:border-none print:shadow-none print:p-0">
                  
                  {/* Print-only Header */}
                  <div className="hidden print:block mb-6 text-center">
                    <h1 className="text-3xl font-bold">Payment Receipt</h1>
                    <p>Thank you for your business</p>
                  </div>

                  <div className="space-y-5">
                      <Row label="Total Amount" value="$125.00" size="lg" />
                      <div className="h-px bg-slate-200 w-full border-b border-dashed border-slate-300" />
                      <Row label="Ref Number" value="8084-2919-XYZ" mono />
                      <Row label="Date" value="January 06, 2026" />
                      <Row label="Time" value="10:42 AM" />
                      <Row label="Card" value="Visa •••• 4242" />
                      <Row label="Status" value="Success" highlight />
                  </div>
                  
                  {/* Barcode Mockup */}
                  <div className="mt-8 pt-4 border-t border-slate-200 opacity-60 flex justify-center">
                     <div className="h-12 w-full max-w-[200px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjUwIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI1MCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] opacity-40"></div>
                  </div>
                </div>

                {/* --- ACTIONS (Hidden in Print) --- */}
                <div className="flex flex-col gap-3 print:hidden">
                  {/* DOWNLOAD BUTTON */}
                  <motion.button 
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-[12px] shadow-lg shadow-slate-900/20 flex items-center justify-center gap-3 transition-all"
                  >
                    <Download size={18} />
                    Download PDF
                  </motion.button>
                  
                  {/* BACK BUTTON */}
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold text-base rounded-[12px] flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                  </motion.button>
                </div>
             </motion.div>
          </div>

        </div>
      </motion.div>

      {/* CSS for Printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          /* Target the main receipt container logic */
          .relative.w-full.max-w-5xl, .relative.w-full.max-w-5xl * {
             visibility: visible;
          }
          /* Hide the left column specifically */
          .lg\\:w-\\[55\\%\\] {
            display: none !important;
          }
          /* Make right column full width */
          .lg\\:w-\\[45\\%\\] {
            width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}

// --- Helper Component ---
const Row = ({ label, value, mono = false, size = "md", highlight = false }: { label: string; value: string, mono?: boolean, size?: "md" | "lg", highlight?: boolean }) => (
  <div className="flex justify-between items-center group">
    <span className={`${size === "lg" ? "text-base font-semibold text-slate-500" : "text-sm text-slate-400 font-medium"}`}>
      {label}
    </span>
    <span className={`
      font-bold
      ${mono ? "font-mono tracking-tight text-slate-700" : "text-slate-900"}
      ${size === "lg" ? "text-2xl" : "text-sm"}
      ${highlight ? "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md" : ""}
    `}>
      {value}
    </span>
  </div>
)

export default PaymentSuccess