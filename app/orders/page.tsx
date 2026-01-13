"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/axios";
import { useRouter } from "next/navigation";
import OrdersSkeleton from "@/components/ui/OrdersSkeleton";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        const res = await apiFetch("/orders");
        if (!mounted) return;
        setOrders(res || []);
      } catch (err: any) {
        // If unauthenticated, send to login
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

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-6">My Orders</h1>
        <OrdersSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-6">My Orders</h1>

      {error && <div className="text-destructive mb-4">{error}</div>}

      {orders.length === 0 ? (
        <div className="p-6 bg-muted/50 rounded-lg text-center text-muted-foreground">
          There is no previous orders
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o: any) => (
            <div key={o._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Order #{o._id.toString().slice(-6).toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{o.orderStatus}</div>
                  <div className="font-semibold">{o?.payment?.status ?? 'Not Paid'}</div>
                  <div className="text-sm text-muted-foreground">
                    {o.currency} {o.totalAmount}
                  </div>
                </div>
              </div>

              <div className="divide-y">
                {o.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex gap-4 py-3 items-center">
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 rounded-md" />
                    )}

                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-muted-foreground">{it.variantLabel} · Qty: {it.quantity}</div>
                    </div>

                    <div className="text-sm font-semibold">{o.currency} {it.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
