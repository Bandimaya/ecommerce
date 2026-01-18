"use client"

import React, { useMemo, useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import {
  Check,
  Share2,
  Download,
  Printer,
  ArrowLeft
} from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/axios"
import { CURRENCY_OPTIONS } from "@/lib/constants"
import { useSettings } from "@/contexts/SettingsContext"
import { getDisplayPrice } from "@/lib/utils"

/* ===== CONFIGURATION ===== */
const TRACE_COUNT = 50
const CENTER = 150
const INNER_RADIUS = 55
const ELBOW_RADIUS = 105
const OUTER_RADIUS_MAX = 145
const OUTER_RADIUS_MIN = 115

const PaymentSuccess: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  const { countryCode } = useSettings();

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  /* ================= FETCH ORDER ================= */

  useEffect(() => {
    if (!orderId) {
      setError("Missing order id")
      setLoading(false)
      return
    }

    let timer: NodeJS.Timeout

    const fetchOrder = async () => {
      try {
        const res = await apiFetch(`/orders/${orderId}`)
        setOrder(res)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // ⏱ wait 3 seconds before fetching
    timer = setTimeout(fetchOrder, 3000)

    // 🧹 cleanup (important)
    return () => clearTimeout(timer)

  }, [orderId])
  /* ================= HANDLERS ================= */

  const handlePrint = () => window.print()

  const handleShare = async () => {
    if (!order) return
    const { currency }: any = getDisplayPrice([], countryCode)

    const text = `Payment ${order.order.paymentStatus}
Transaction: ${order.payment.transactionNumber}
Amount: ${currency}${order.payment.amount}`

    if (navigator.share) {
      await navigator.share({
        title: "Payment Receipt",
        text,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(text)
      setIsSharing(true)
      setTimeout(() => setIsSharing(false), 2000)
    }
  }

  const handleDownload = () => {
    if (!order) return

    const receipt = `
Payment Receipt
---------------
Order ID: ${order.order._id}
Transaction: ${order.payment.transactionNumber}
Amount: ${CURRENCY_OPTIONS.find(c => c.code === order.currency)?.symbol}${order.payment.amount}
Status: ${order.order.paymentStatus}
Date: ${new Date(order.order.createdAt).toLocaleString()}
`

    const link = document.createElement("a")
    link.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(receipt)
    link.download = `receipt-${order.order._id}.txt`
    link.click()
  }

  /* ================= GEOMETRY ================= */

  const traces = useMemo(() => {
    return Array.from({ length: TRACE_COUNT }).map((_, i) => {
      const angle = (2 * Math.PI * i) / TRACE_COUNT
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const outerRadius =
        OUTER_RADIUS_MIN +
        Math.abs(sin) * (OUTER_RADIUS_MAX - OUTER_RADIUS_MIN)

      const x1 = CENTER + INNER_RADIUS * cos
      const y1 = CENTER + INNER_RADIUS * sin
      const x2 = CENTER + ELBOW_RADIUS * cos
      const y2 = CENTER + ELBOW_RADIUS * sin
      const x3 =
        Math.abs(cos) > Math.abs(sin)
          ? CENTER + outerRadius * cos
          : x2
      const y3 =
        Math.abs(cos) > Math.abs(sin)
          ? y2
          : CENTER + outerRadius * sin

      return {
        d: `M ${x1} ${y1} C ${x2} ${y2}, ${x2} ${y2}, ${x3} ${y3}`,
        cx: x3,
        cy: y3,
        delay: i * 0.02,
      }
    })
  }, [])

  /* ================= ANIMATIONS ================= */

  const pulseLineVariant: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: any) => ({
      pathLength: 1,
      opacity: [0.1, 0.6, 0.3],
      transition: {
        pathLength: { duration: 1, delay: custom.delay },
        opacity: { duration: 3, repeat: Infinity },
      },
    }),
  }

  /* ================= LOADING / ERROR ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-lg">Loading receipt…</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || "Unable to load receipt"}</p>
      </div>
    )
  }

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl grid lg:grid-cols-2 overflow-hidden">

        {/* LEFT VISUAL */}
        <div className="bg-slate-50 flex items-center justify-center p-12">
          <div className="relative">
            <svg viewBox="0 0 300 300" className="w-72 h-72">
              <g fill="none" stroke="#10b981" strokeWidth="1.5">
                {traces.map((t, i) => (
                  <motion.path
                    key={i}
                    d={t.d}
                    variants={pulseLineVariant}
                    initial="hidden"
                    animate="visible"
                    custom={{ delay: t.delay }}
                  />
                ))}
              </g>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <Check className="text-white w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT RECEIPT */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">Payment Successful</h2>

          <div className="space-y-4 bg-slate-50 p-6 rounded-xl mb-6">
            <Row label="Amount" value={`${CURRENCY_OPTIONS.find(c => c.code === order.currency)?.symbol}${order.payment.amount}`} size="lg" />
            <Row label="Transaction ID" value={order.payment.transactionNumber} mono />
            <Row label="Order ID" value={order.order._id} mono />
            <Row
              label="Date"
              value={new Date(order.order.createdAt).toLocaleDateString()}
            />
            <Row
              label="Time"
              value={new Date(order.order.createdAt).toLocaleTimeString()}
            />
            <Row
              label="Status"
              value="Success"
              highlight
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Download size={18} /> Download
            </button>

            <button
              onClick={handleShare}
              className="flex-1 border border-slate-300 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              {isSharing ? "Copied" : "Share"}
            </button>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-4 text-slate-600 flex items-center gap-2 justify-center"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= ROW COMPONENT ================= */

const Row = ({
  label,
  value,
  mono = false,
  size = "md",
  highlight = false,
}: {
  label: string
  value: string
  mono?: boolean
  size?: "md" | "lg"
  highlight?: boolean
}) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span
      className={`
        font-bold
        ${mono ? "font-mono" : ""}
        ${size === "lg" ? "text-xl" : ""}
        ${highlight ? "text-emerald-600" : ""}
      `}
    >
      {value}
    </span>
  </div>
)

export default PaymentSuccess
