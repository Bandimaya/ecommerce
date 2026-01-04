'use client';

import React from 'react';
import { Trophy, Users, GraduationCap, BookOpen } from 'lucide-react';

export default function WhyChooseUsSection() {
  const features = [
    {
      icon: Trophy,
      title: "Premium Hardware",
      text: "Learn using the #1 Best Robotics and Coding Kits."
    },
    {
      icon: Users,
      title: "Flexible Batches",
      text: "Choose 1-1 or small group sessions."
    },
    {
      icon: GraduationCap,
      title: "Expert Mentors",
      text: "Expert instructors with 5+ years experience."
    },
    {
      icon: BookOpen,
      title: "Lifetime Resources",
      text: "Lifetime access to study material."
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {features.map((feature, idx) => (
        <div 
          key={idx} 
          className="group flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl hover:bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
        >
          {/* Icon Box */}
          <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100 group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors duration-300">
            <feature.icon className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors duration-300" />
          </div>
          
          {/* Text Content */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-0.5">
              {feature.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {feature.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}