"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ChevronDown, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrdersSkeleton from "@/components/ui/OrdersSkeleton";

const PaymentHistoryPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchPayments = async () => {
      try {
        const res = await apiFetch("/orders");
        if (!mounted) return;
        // show orders sorted by createdAt desc
        const data = Array.isArray(res) ? res.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
        setOrders(data);
      } catch (err: any) {
        if (err && (err.status === 401 || err.status === 0)) {
          router.push("/login");
          return;
        }
        setError(err?.message || "Unable to load payment history");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPayments();
    return () => { mounted = false; };
  }, [router]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-primary" /> Payment History
        </h1>
        <OrdersSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
        <CreditCard className="w-6 h-6 text-primary" /> Payment History
      </h1>

      {error && <div className="text-destructive mb-4">{error}</div>}

      {orders.length === 0 ? (
        <div className="p-6 bg-muted/50 rounded-lg text-center text-muted-foreground">
          There is no payment history
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o: any) => {
            const isOpen = openId === o._id;
            return (
              <motion.div
                layout
                initial={{ borderRadius: 12 }}
                key={o._id}
                className="bg-white border border-border/50 shadow-sm overflow-hidden rounded-lg"
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenId(isOpen ? null : o._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>

                    <div>
                      <div className="font-semibold">Order #{o._id.toString().slice(-6).toUpperCase()}</div>
                      <div className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-sm text-muted-foreground text-right">
                      <div className="font-semibold">{o.paymentStatus}</div>
                      <div>{o.currency} {o.totalAmount}</div>
                    </div>

                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 pt-0"
                    >
                      <div className="rounded-b-lg bg-muted/5 p-4 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Payment ID</div>
                            <div className="font-mono text-sm break-words">{o.paymentId || "-"}</div>

                            <div className="mt-3 text-xs text-muted-foreground">Method</div>
                            <div className="font-medium">{o.paymentMethod || "-"}</div>

                            <div className="mt-3 text-xs text-muted-foreground">Status</div>
                            <div className="font-medium">{o.paymentStatus}</div>
                          </div>

                          <div>
                            <div className="text-xs text-muted-foreground">Shipping</div>
                            <div className="text-sm">
                              {o.shippingAddress?.firstName ? (
                                <>
                                  {o.shippingAddress.firstName} {o.shippingAddress.lastName}
                                  <div>{o.shippingAddress.addressLine}</div>
                                  <div>{o.shippingAddress.city} {o.shippingAddress.pincode}</div>
                                  <div>{o.shippingAddress.phone}</div>
                                </>
                              ) : (
                                <div className="text-muted-foreground">No shipping info</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 border-t pt-4">
                          <div className="text-xs text-muted-foreground">Items</div>
                          <div className="mt-2 space-y-3">
                            {o.items.map((it: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3">
                                {it.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={it.image} alt={it.name} className="w-12 h-12 object-cover rounded-md" />
                                ) : (
                                  <div className="w-12 h-12 bg-slate-100 rounded-md" />
                                )}

                                <div className="flex-1">
                                  <div className="font-medium">{it.name}</div>
                                  <div className="text-xs text-muted-foreground">{it.variantLabel} · Qty: {it.quantity}</div>
                                </div>

                                <div className="font-semibold">{o.currency} {it.price}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
