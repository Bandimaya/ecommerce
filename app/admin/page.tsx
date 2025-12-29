"use client"
// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { Package, ShoppingBag, Layers, TrendingUp } from "lucide-react";
import { apiFetch } from "@/lib/axios";

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
        const [p, o, c] = await Promise.all([
          apiFetch("/products"),
          apiFetch("/orders"),
          apiFetch("/categories")
        ]);

        setStats({
          products: p.length,
          orders: o.length,
          categories: c.length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      {/* Header Section */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back! Here is what's happening today.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border shadow-sm flex items-center gap-2 text-sm font-bold text-indigo-600">
          <TrendingUp className="w-4 h-4" />
          Live Metrics
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Total Products" 
          value={stats.products} 
          icon={<Package className="w-6 h-6" />}
          color="bg-blue-600"
          trend="+12% this month"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.orders} 
          icon={<ShoppingBag className="w-6 h-6" />}
          color="bg-emerald-600"
          trend="+5% vs last week"
        />
        <StatCard 
          title="Categories" 
          value={stats.categories} 
          icon={<Layers className="w-6 h-6" />}
          color="bg-violet-600"
          trend="Optimized"
        />
      </div>

      {/* Placeholder for future growth (Charts/Tables) */}
      {/* <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 h-64 flex items-center justify-center italic text-slate-400">
           Revenue Chart Placeholder
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 h-64 flex items-center justify-center italic text-slate-400">
           Recent Orders List Placeholder
        </div>
      </div> */}
    </div>
  );
}