'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ChevronDown } from 'lucide-react';

// --- Data (Preserved) ---
const FAQ_DATA = [
  {
    question: 'Why is it important for kids to learn Robotics?',
    answer: 'Robotics fosters creativity and problem-solving skills. It allows children to apply math and science concepts in real-world scenarios, turning abstract theories into tangible machines. This hands-on approach builds confidence and engineering logic early on.'
  },
  {
    question: 'Why is it important for kids to learn Coding?',
    answer: 'Coding is the literacy of the digital age. It teaches logical thinking, algorithmic planning, and persistence. Learning to code empowers kids not just to consume technology, but to create it—opening doors to future careers in every industry.'
  },
  {
    question: 'What is the best age to introduce Coding & Robotics to children?',
    answer: 'We recommend starting as early as age 6–8 using block-based coding and simple mechanical kits. This age group is naturally curious and adapts quickly to visual logic. As they grow (10+), they can transition to text-based coding (Python) and complex electronics.'
  },
  {
    question: 'What is the scope of Robotics & Coding as a career?',
    answer: 'The demand for skills in AI, automation, and software development is skyrocketing. Careers in Robotics Engineering, Data Science, and Full Stack Development are among the highest-paid and most secure jobs globally.'
  },
  {
    question: 'Why is Avishkaar the best place to learn Robotics and Coding?',
    answer: 'Avishkaar offers a unique blend of hardware (proprietary kits) and software (expert curriculum). Unlike purely screen-based learning, our students build physical robots while writing the code that controls them, ensuring a deep, 360-degree understanding of STEM.'
  },
  {
    question: 'What is the importance of community to becoming an innovator?',
    answer: 'Innovation rarely happens in isolation. Our community allows students to showcase projects, compete in hackathons, and learn from peers. This collaborative environment mimics real-world engineering labs and keeps motivation high.'
  }
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#fcfcfd] relative overflow-hidden">
      {/* Refined Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support Center</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Common Inquiries
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Find clarity on our pedagogical approach, STEM kits, and the future of your child&apos;s digital literacy.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <FaqItem 
              key={index} 
              item={item} 
              isOpen={activeIndex === index} 
              onClick={() => toggleIndex(index)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ item, isOpen, onClick }: { item: any, isOpen: boolean, onClick: () => void }) {
  return (
    <motion.div 
      layout
      className={`group rounded-3xl transition-all duration-500 border
      ${isOpen 
        ? "border-orange-200 bg-white shadow-[0_20px_40px_rgba(249,115,22,0.08)]" 
        : "border-slate-100 bg-white/50 hover:bg-white hover:border-orange-100 hover:shadow-xl hover:shadow-slate-200/50"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none cursor-pointer"
      >
        <span className={`text-lg md:text-xl font-bold pr-6 transition-colors duration-300 ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
          {item.question}
        </span>
        
        {/* Animated Icon Wrapper */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 
          ${isOpen ? 'bg-orange-500 text-white rotate-180 shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500'}`}>
          <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'stroke-[3]' : 'stroke-[2]'}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-8 pb-8 pt-0 overflow-hidden">
              <div className="h-px w-full bg-slate-50 mb-6" />
              <p className="text-slate-500 leading-relaxed text-base md:text-lg font-medium">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}