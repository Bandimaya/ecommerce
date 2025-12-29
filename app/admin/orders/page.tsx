"use client"
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  ExternalLink,
  MoreVertical,
  Search,
  Filter,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/orders")
      .then((res: any) => setOrders(res))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyles = (status: any) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === 'placed') return "bg-amber-50 text-amber-600 border-amber-100";
    if (s === 'pending') return "bg-amber-50 text-amber-600 border-amber-100";
    if (s === 'shipped') return "bg-blue-50 text-blue-600 border-blue-100";
    if (s === 'cancelled') return "bg-rose-50 text-rose-600 border-rose-100";
    return "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header & Stats Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Sales Management</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search by ID or email..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-64 shadow-sm"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 hover:bg-slate-50">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Orders Table Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Order Detail</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((o: any) => (
                  <tr key={o._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        #{o._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{o.userId?.name || 'Guest'}</span>
                        <span className="text-xs text-slate-400">{o.userId?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-900">
                        ${o.totalAmount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border",
                        getStatusStyles(o.orderStatus)
                      )}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"> */}
                        {/* <ExternalLink className="w-4 h-4" /> */}
                        {/* </button> */}
                        {/* <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Placeholder */}
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Showing {orders.length} orders</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-lg bg-white disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 border rounded-lg bg-white">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}