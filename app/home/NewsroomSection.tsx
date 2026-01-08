'use client';

import BackgroundGrid from './marqueeBackground/BackgroundGrid';
import { apiFetch } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { IMAGE_URL } from '@/lib/constants';

// --- Types ---
interface NewsItem {
  _id: string;
  image: string;
  text: string;
}

// --- Sub-component for a single card ---
const NewsCard = ({ item }: { item: NewsItem }) => (
  <div className="relative group w-[300px] md:w-[350px] flex-shrink-0 bg-card rounded-[10px] p-6 border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary hover:-translate-y-1 h-full flex flex-col justify-between overflow-hidden">
    
    {/* Decorative Quote Icon Background */}
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary/10">
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
      </svg>
    </div>

    {/* Top: News Source Logo */}
    <div className="h-12 mb-6 relative w-full flex items-center justify-start">
      <img
        src={IMAGE_URL + item.image}
        alt="News Source"
        className="h-full w-auto object-contain object-left transition-all duration-300 opacity-90 group-hover:opacity-100"
      />
    </div>

    {/* Bottom: Text */}
    <div className="relative z-10">
      <p className="text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors duration-300 text-[15px] line-clamp-3">
        "{item.text}"
      </p>

      {/* Read More Link */}
      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-primary opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 cursor-pointer">
        Read Coverage
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);

export default function NewsroomSection() {
  const [data, setData] = useState<NewsItem[]>([]);

  useEffect(() => {
    apiFetch('/news')
      .then((response: any) => {
        setData(response);
      }).catch((error) => {
        console.error('Error fetching news:', error);
      });
  }, [])

  return (
    <section className="relative py-24 bg-background overflow-hidden font-sans border-t border-border/40">

      <BackgroundGrid
        color="var(--border)"
        cellSize={40}
        className="z-0 opacity-40"
      />

      <div className="relative z-10 container mx-auto px-4 mb-14 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
          In the Headlines
        </h2>
        <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          From Asia's biggest robotics competitions to nurturing future innovators, see what the media is saying about Avishkaar.
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative z-10 w-full pb-10">

        {/* Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        {/* Marquee Track */}
        <div className="marquee-container flex overflow-hidden">
          <div className="marquee-track flex gap-6 px-4">
            
            {/* Set 1 */}
            {data.map((item, idx) => (
              <NewsCard key={`news-1-${idx}`} item={item} />
            ))}

            {/* Set 2 (Duplicate for Loop) */}
            {data.map((item, idx) => (
              <NewsCard key={`news-2-${idx}`} item={item} />
            ))}
            
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          width: max-content;
          animation: scroll 60s linear infinite;
        }

        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1.5rem)); /* Adjust for gap-6 (1.5rem) */ }
        }
      `}</style>
    </section>
  );
}