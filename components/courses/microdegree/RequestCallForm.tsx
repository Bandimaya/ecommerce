'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PhoneCall, Clock, CheckCircle2, Loader2 } from 'lucide-react'

export default function RequestCallForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-5xl mx-auto w-full"
    >
      <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] -z-0 opacity-50" />

        <div className="relative z-10">
          {!submitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              
              {/* Text Side */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Typical response: 15 mins</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  Still Have an <br />
                  <span className="text-orange-500">Unanswered Question?</span>
                </h3>
                <p className="text-slate-500 font-medium">
                  Drop your details and our STEM experts will call you back to clear any doubts.
                </p>
              </div>

              {/* Form Side */}
              <form 
                onSubmit={handleSubmit}
                className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-1">
                  <input 
                    required
                    name="name" 
                    placeholder="Full Name" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400" 
                  />
                </div>
                <div className="space-y-1">
                  <input 
                    required
                    name="phone" 
                    type="tel"
                    placeholder="Mobile Number" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400" 
                  />
                </div>
                <button 
                  disabled={loading}
                  className="group relative md:col-span-2 h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 overflow-hidden transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-70"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <PhoneCall className="w-4 h-4 group-hover:animate-bounce" />
                      <span>Request a Callback</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-4 space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Request Sent!</h3>
              <p className="text-slate-500 font-medium">Keep your phone nearby. An expert will reach out shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-orange-600 uppercase tracking-widest hover:underline"
              >
                Send another request
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  )
}