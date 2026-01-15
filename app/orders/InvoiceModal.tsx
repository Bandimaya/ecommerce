import React from "react";
import { X } from "lucide-react";

interface InvoiceModalProps {
  order: any;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    // 1. OUTER WRAPPER
    // Removed print-specific classes
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      
      {/* 2. FLEX ALIGNMENT WRAPPER */}
      <div className="flex min-h-full items-center justify-center p-4 md:items-start md:pt-[100px]">

        {/* CLICK OUTSIDE LISTENER */}
        <div 
          className="fixed inset-0 transition-opacity" 
          onClick={onClose} 
        />

        {/* 3. THE INVOICE CARD */}
        <div className="relative z-10 w-full max-w-3xl bg-white shadow-2xl rounded-[10px]">
          
          {/* --- ACTIONS BAR --- */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-[10px]">
            <h2 className="font-semibold text-gray-700 text-sm md:text-base">Invoice Preview</h2>
            <div className="flex items-center gap-2">
              {/* Only the Close button remains */}
              <button 
                onClick={onClose}
                className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[10px] transition-colors"
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* --- INVOICE CONTENT --- */}
          <div className="p-4 md:p-10">
            
            {/* Header Section */}
            <div className="flex flex-row justify-between items-start mb-6 md:mb-8 gap-4">
              <div>
                <div className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-widest mb-1">Invoice</div>
                <div className="text-[10px] md:text-sm font-medium text-slate-500">#{order._id.toString().slice(-6).toUpperCase()}</div>
                <div className="text-[10px] md:text-sm text-slate-400 mt-1">Order ID: {order._id}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-1 md:mb-2">
                  <div className="h-6 w-6 md:h-8 md:w-8 bg-slate-900 rounded-[6px] md:rounded-[8px] flex items-center justify-center text-white font-bold text-xs md:text-sm">
                    S
                  </div>
                  <span className="font-bold text-base md:text-xl text-slate-900">StoreName</span>
                </div>
                <p className="text-[10px] md:text-xs text-slate-500">123 Business Street</p>
                <p className="text-[10px] md:text-xs text-slate-500">support@storename.com</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4 md:pb-6">
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To</p>
                <p className="font-semibold text-xs md:text-base text-slate-900">Customer Name</p>
                <p className="text-[10px] md:text-sm text-slate-500">user@example.com</p>
              </div>
              <div className="text-right flex flex-col gap-1 md:gap-2">
                <div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Date: </span>
                  <span className="text-[10px] md:text-sm font-medium text-slate-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Status: </span>
                  <span className="text-[10px] md:text-sm font-medium text-slate-700 capitalize">
                    {order.payment?.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Table Header (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 border-b-2 border-slate-900 pb-3 mb-4 text-xs font-bold uppercase text-slate-500 tracking-wider">
              <div className="col-span-6">Item Details</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items List */}
            <div className="space-y-3 md:space-y-4 mb-6">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 text-sm items-start border-b border-gray-50 md:border-none pb-3 md:pb-0 last:border-0 last:pb-0">
                  
                  {/* Item Name */}
                  <div className="col-span-1 md:col-span-6">
                    <p className="font-semibold text-slate-900 break-words text-xs md:text-sm leading-tight">{item.name}</p>
                    <p className="text-slate-500 text-[10px] md:text-xs mt-0.5">{item.variantLabel}</p>
                  </div>

                  {/* Mobile Row for Qty/Price/Total */}
                  <div className="col-span-1 flex justify-between items-center mt-1 md:hidden">
                     <span className="text-[10px] text-slate-500">Qty: {item.quantity}</span>
                     <span className="text-[10px] text-slate-500">x {order.currency} {item.price}</span>
                     <span className="text-xs font-medium text-slate-900">{order.currency} {(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  {/* Desktop Columns */}
                  <div className="hidden md:block col-span-2 text-center text-slate-600">{item.quantity}</div>
                  <div className="hidden md:block col-span-2 text-right text-slate-600">{order.currency} {item.price}</div>
                  <div className="hidden md:block col-span-2 text-right font-medium text-slate-900">
                    {order.currency} {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex justify-end border-t border-slate-100 pt-4 md:pt-6">
              <div className="w-full max-w-[200px] md:max-w-xs space-y-1.5 md:space-y-2">
                <div className="flex justify-between text-[10px] md:text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>{order.currency} {order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-[10px] md:text-sm text-slate-500">
                  <span>Tax (0%)</span>
                  <span>{order.currency} 0.00</span>
                </div>
                <div className="border-t border-slate-200 my-1 md:my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm md:text-lg">Total</span>
                  <span className="font-black text-slate-900 text-base md:text-xl">
                    {order.currency} {order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 md:mt-12 pt-4 md:pt-6 border-t border-dashed border-slate-200 text-center">
              <p className="text-slate-900 font-medium mb-1 text-xs md:text-sm">Thank you for your business!</p>
              <p className="text-[10px] md:text-xs text-slate-400">
                Questions? Contact support.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;