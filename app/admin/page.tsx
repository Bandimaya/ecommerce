"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  ShoppingBag, 
  Layers, 
  LayoutDashboard, 
  ArrowUpRight 
} from "lucide-react";
import { apiFetch } from "@/lib/axios";

// 1. Define the interface for the props
interface AntCardProps {
  title: string;
  value: number | string; // Can be a number or a string
  icon: React.ReactNode;  // For the icon component
  loading: boolean;
  colorClass: {
    bg: string;
    text: string;
  };
  trend: string;
}

// 2. Apply the interface to the component
const AntCard = ({ title, value, icon, loading, colorClass, trend }: AntCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group cursor-pointer">
      {loading ? (
        // Skeleton Loader
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
          <div className="h-3 bg-gray-100 rounded w-full mt-4"></div>
        </div>
      ) : (
        // Actual Content
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 text-[14px] font-medium tracking-wide">
              {title}
            </span>
            <div className={`p-2 rounded-full bg-opacity-10 ${colorClass.bg} ${colorClass.text}`}>
              {icon}
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-[30px] font-semibold text-gray-800 leading-tight">
              {value}
            </h3>
          </div>

          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 text-[12px]">
             <span className="text-green-500 flex items-center font-medium">
               <ArrowUpRight className="w-3 h-3 mr-1" />
               {trend}
             </span>
             <span className="text-gray-400 ml-1">since last month</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // You might need to cast the response if apiFetch isn't typed generically
        const [p, o, c] = await Promise.all([
          apiFetch("/products"),
          apiFetch("/orders"),
          apiFetch("/categories")
        ]);

        setStats({
          products: Array.isArray(p) ? p.length : 0,
          orders: Array.isArray(o) ? o.length : 0,
          categories: Array.isArray(c) ? c.length : 0
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, Administrator.
            </p>
          </div>
        </div>
        
        {/* Antd-style Button/Badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-gray-50 text-gray-600 rounded text-sm font-medium border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          System Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AntCard 
          title="Total Products" 
          value={stats.products} 
          loading={loading}
          icon={<Package className="w-5 h-5" />}
          colorClass={{ bg: 'bg-blue-500', text: 'text-blue-600' }}
          trend="12%"
        />
        
        <AntCard 
          title="Total Orders" 
          value={stats.orders} 
          loading={loading}
          icon={<ShoppingBag className="w-5 h-5" />}
          colorClass={{ bg: 'bg-emerald-500', text: 'text-emerald-600' }}
          trend="5%"
        />
        
        <AntCard 
          title="Active Categories" 
          value={stats.categories} 
          loading={loading}
          icon={<Layers className="w-5 h-5" />}
          colorClass={{ bg: 'bg-purple-500', text: 'text-purple-600' }}
          trend="2%"
        />
      </div>
    </div>
  );
}