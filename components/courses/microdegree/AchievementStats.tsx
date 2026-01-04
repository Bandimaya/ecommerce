import React from 'react';

export default function AchievementStats() {
  // 1. Structure data better: Split value and label for better styling control
  const items = [
    {
      img: 'https://images.avishkaar.cc/misc/shop/microdegree/students-icon.svg',
      value: '200,000+',
      label: 'Students',
      color: 'bg-blue-50', // Optional: Add thematic colors for icons
    },
    {
      img: 'https://images.avishkaar.cc/misc/shop/microdegree/star-icon.svg',
      value: '4.3+',
      label: 'Google Rating',
      color: 'bg-yellow-50',
    },
    {
      img: 'https://images.avishkaar.cc/misc/shop/microdegree/clipboard-icon.svg',
      value: '2,000+',
      label: 'Unique Projects',
      color: 'bg-green-50',
    },
    {
      img: 'https://images.avishkaar.cc/misc/shop/microdegree/competitions-icon.svg',
      value: '50+',
      label: 'Competitions Hosted',
      color: 'bg-purple-50',
    },
  ];

  return (
    <section className="w-full py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it, index) => (
          <div
            key={index}
            className="
              group flex items-center gap-4 p-5 
              bg-white rounded-xl border border-gray-100 
              shadow-sm hover:shadow-lg transition-all duration-300 
              hover:-translate-y-1
            "
          >
            {/* Icon Container with subtle background */}
            <div className={`p-3 rounded-full shrink-0 ${it.color} group-hover:scale-110 transition-transform duration-300`}>
              <img 
                src={it.img} 
                alt={`${it.label} icon`} 
                className="w-8 h-8 object-contain" 
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 leading-tight">
                {it.value}
              </span>
              <span className="text-sm font-medium text-gray-500 mt-1">
                {it.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}