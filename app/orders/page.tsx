"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/axios";
import { useRouter } from "next/navigation";
import OrdersSkeleton from "@/components/ui/OrdersSkeleton";
import InvoiceModal from "./InvoiceModal"; // Import the new component
import { 
  Box, 
  CalendarDays, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertOctagon,
  Receipt
} from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New state for handling the modal
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const res = await apiFetch("/orders");
        if (!mounted) return;
        setOrders(res || []);
      } catch (err: any) {
        if (err && (err.status === 401 || err.status === 0)) {
          router.push("/login");
          return;
        }
        setError(err?.message || "Unable to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, [router]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedInvoice) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedInvoice]);

  const renderStatus = (status: string) => {
    const s = status?.toLowerCase() || "";
    let colorClass = "bg-gray-100 text-gray-600 border-gray-200";
    let Icon = Clock;

    if (["delivered", "paid", "completed", "success"].includes(s)) {
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
      Icon = CheckCircle2;
    } else if (["cancelled", "failed", "rejected"].includes(s)) {
      colorClass = "bg-rose-50 text-rose-700 border-rose-100";
      Icon = AlertOctagon;
    } else if (["shipped", "processing"].includes(s)) {
      colorClass = "bg-blue-50 text-blue-700 border-blue-100";
      Icon = Truck;
    }

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colorClass} w-full md:w-auto justify-center md:justify-start shrink-0`}>
        <Icon size={14} strokeWidth={2.5} />
        <span className="text-xs font-bold uppercase tracking-wide">{status || "Pending"}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-12">
         <div className="max-w-6xl mx-auto">
            <OrdersSkeleton count={3} />
         </div>
      </div>
    );
  }

  return (
    // ID 'main-content' helps us hide this during print if needed
    <div id="main-content" className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-12 font-sans text-slate-900">
      
      {/* WRAPPER DIV for the Invoice Modal with ID for Print targeting */}
      {selectedInvoice && (
        <div id="invoice-root">
          <InvoiceModal 
            order={selectedInvoice} 
            onClose={() => setSelectedInvoice(null)} 
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto print:hidden">
        
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">My Orders</h1>
            <p className="text-slate-500 mt-2 text-base md:text-lg font-medium">
              Track your purchase history and status.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg shadow-slate-200">
              {orders.length} Records
            </span>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center gap-3">
            <AlertOctagon size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Box className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No orders yet</h3>
            <p className="text-slate-500 mt-2 text-center max-w-sm">
              Start shopping to see your orders here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:gap-8">
            {orders.map((o: any) => (
              <div 
                key={o._id} 
                className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row items-stretch">
                  
                  {/* LEFT SECTION */}
                  <div className="flex-1 p-5 md:p-8 lg:border-r border-slate-100 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-y-4 gap-x-8 mb-8 pb-6 border-b border-slate-50">
                      <div>
                         <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                            <Box size={14} />
                            <span>Order ID</span>
                         </div>
                         <div className="font-mono text-lg md:text-xl text-slate-900 font-bold tracking-tight break-all">
                           #{o._id.toString().slice(-6).toUpperCase()}
                         </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                            <CalendarDays size={14} />
                            <span>Date Placed</span>
                         </div>
                         <div className="text-slate-700 font-medium whitespace-nowrap">
                           {new Date(o.createdAt).toLocaleDateString("en-US", {
                             day: 'numeric', month: 'short', year: 'numeric'
                           })}
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {o.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex gap-4 sm:gap-6 items-start">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                            {it.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Box size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-snug break-words">
                              {it.name}
                            </h4>
                            <p className="text-slate-500 text-sm mt-1.5 break-words">
                              {it.variantLabel}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
                              <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs whitespace-nowrap">
                                Qty: {it.quantity}
                              </span>
                              <span className="whitespace-nowrap">
                                {o.currency} {it.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT SECTION */}
                  <div className="lg:w-[320px] lg:flex-none bg-slate-50/50 p-5 md:p-8 flex flex-col gap-6 justify-between border-t lg:border-t-0 lg:border-l border-slate-100">
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Status</p>
                        {renderStatus(o.orderStatus)}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment</p>
                        {renderStatus(o?.payment?.status || 'Unpaid')}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 mt-auto">
                       <div className="flex items-end justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-500">Grand Total</span>
                          <CreditCard size={16} className="text-slate-400 mb-1" />
                       </div>
                       <div className="text-3xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                          {o.currency} {o.totalAmount}
                       </div>
                       <p className="text-xs text-slate-400 mt-2">
                         Includes all applicable taxes
                       </p>
                    </div>
                    
                    {/* View Invoice Button triggers Modal */}
                    <button 
                      onClick={() => setSelectedInvoice(o)}
                      className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                      <Receipt size={16} />
                      View Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;