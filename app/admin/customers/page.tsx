"use client"
import { useEffect, useState } from "react";
import { 
  Users, 
  Mail, 
  Calendar, 
  Search, 
  ShieldCheck, 
  UserCircle 
} from "lucide-react";
import { apiFetch } from "@/lib/axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/users")
      .then((res: any) => setCustomers(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Users className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Administration</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Customers</h1>
            <p className="text-slate-500 font-medium">Manage user accounts, roles, and registration details.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="Search customers..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-64 shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Customer Table Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Profile</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {customers.map((c: any) => (
                  <tr key={c._id} className="group hover:bg-slate-50/30 transition-colors">
                    {/* Profile Col */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-100 uppercase ring-4 ring-white">
                          {c.name?.charAt(0) || <UserCircle />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {c._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Col */}
                    <td className="px-8 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          <Mail className="w-3.5 h-3.5 text-indigo-400" />
                          {c.email}
                        </div>
                      </div>
                    </td>

                    {/* Date Col */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                      </div>
                    </td>

                    {/* Role Col */}
                    <td className="px-8 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                        c.role === 'admin' 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                        {c.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                        {c.role || 'User'}
                      </div>
                    </td>

                    {/* Actions Col */}
                    {/* <td className="px-8 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!loading && customers.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <UserCircle className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-800">No customers found</h3>
              <p className="text-slate-400">Users will appear here as soon as they register.</p>
            </div>
          )}

          {/* Footer Info */}
          <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Database Size: {customers.length} Entries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}