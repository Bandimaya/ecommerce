"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  ShoppingBag, 
  Layers, 
  LayoutDashboard, 
  ArrowUpRight,
  Type, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Zap, 
  Image as ImageIcon, 
  Video, 
  Newspaper, 
  Star, 
  Gift, 
  Award, 
  MessageSquareQuote, 
  Rocket, 
  Book, 
  BadgeCheck, 
  Tags, 
  Users 
} from "lucide-react";
import { apiFetch } from "@/lib/axios";
import React from "react";

// --- Configuration for all Dashboard Items ---
const dashboardConfig = [
  { key: 'jargon', label: 'Jargon', icon: <Type />, color: 'blue' },
  { key: 'sections', label: 'Sections', icon: <Layers />, color: 'indigo' },
  { key: 'sectionCourses', label: 'Section Courses', icon: <BookOpen />, color: 'violet' },
  { key: 'events', label: 'Events', icon: <Calendar />, color: 'pink' },
  { key: 'winners', label: 'Winners', icon: <Trophy />, color: 'yellow' },
  { key: 'stemparkFeatures', label: 'Stempark Feat.', icon: <Zap />, color: 'amber' },
  { key: 'awardImages', label: 'Award Images', icon: <ImageIcon />, color: 'orange' },
  { key: 'partnerImages', label: 'Partner Images', icon: <ImageIcon />, color: 'emerald' },
  { key: 'videos', label: 'Videos', icon: <Video />, color: 'red' },
  { key: 'news', label: 'News', icon: <Newspaper />, color: 'cyan' },
  { key: 'stars', label: 'Stars', icon: <Star />, color: 'yellow' },
  { key: 'benefits', label: 'Benefits', icon: <Gift />, color: 'rose' },
  { key: 'certifications', label: 'Certifications', icon: <Award />, color: 'teal' },
  { key: 'testimonials', label: 'Testimonials', icon: <MessageSquareQuote />, color: 'lime' },
  { key: 'stemCourses', label: 'Stem Courses', icon: <BookOpen />, color: 'sky' },
  { key: 'projects', label: 'Projects', icon: <Rocket />, color: 'fuchsia' },
  { key: 'programs', label: 'Programs', icon: <Book />, color: 'purple' },
  { key: 'brands', label: 'Brands', icon: <BadgeCheck />, color: 'indigo' },
  { key: 'categories', label: 'Categories', icon: <Tags />, color: 'pink' },
  { key: 'products', label: 'Products', icon: <Package />, color: 'blue' },
  { key: 'orders', label: 'Orders', icon: <ShoppingBag />, color: 'emerald' },
  { key: 'customers', label: 'Customers', icon: <Users />, color: 'orange' },
];

interface AntCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  loading: boolean;
  colorClass: string; 
}

const AntCard = ({ title, value, icon, loading, colorClass }: AntCardProps) => {
  const bgClass = `bg-${colorClass}-500`;
  const textClass = `text-${colorClass}-600`;
  const bgSoftClass = `bg-${colorClass}-50`;

  return (
    // Added 'w-full' here to ensure the card takes full width of the grid cell
    <div className="w-full bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group cursor-pointer rounded-[10px]">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded-[10px] w-1/3"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-[10px] w-1/2 mt-2"></div>
        </div>
      ) : (
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 text-[14px] font-medium tracking-wide">
              {title}
            </span>
            <div className={`p-2 rounded-full bg-opacity-10 ${bgSoftClass} ${textClass}`}>
              {icon && React.isValidElement(icon)
                ? React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" } as React.HTMLAttributes<HTMLElement>)
                : icon}
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-[28px] font-bold text-gray-800 leading-tight">
              {value}
            </h3>
          </div>

          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 text-[12px]">
             <span className="text-green-500 flex items-center font-medium">
               <ArrowUpRight className="w-3 h-3 mr-1" />
               Live
             </span>
             <span className="text-gray-400 ml-1">realtime data</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const promises = dashboardConfig.map(item => apiFetch(`/${item.key}`));
        const results = await Promise.all(promises);
        const newStats: Record<string, number> = {};
        
        results.forEach((res, index) => {
          const key = dashboardConfig[index].key;
          newStats[key] = Array.isArray(res) ? res.length : (res?.count || 0);
        });

        setStats(newStats);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchStats();
  }, []);

  return (
    // Added w-full to the main container
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-gray-200 shadow-sm rounded-[10px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 rounded-[10px]">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Admin Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Realtime monitoring of all platform assets.
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-gray-50 text-gray-600 text-sm font-medium border border-gray-200 rounded-[10px]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          System Online
        </div>
      </div>

      {/* Grid Container - Added w-full */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardConfig.map((item) => (
          <AntCard 
            key={item.key}
            title={item.label}
            value={stats[item.key] || 0}
            loading={loading}
            icon={item.icon}
            colorClass={item.color}
          />
        ))}
      </div>
    </div>
  );
}