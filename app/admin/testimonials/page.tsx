"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { 
  Trash2, 
  Upload, 
  Plus, 
  Loader2, 
  MessageSquareQuote, 
  X, 
  ImageIcon, 
  User, 
  Search, 
  Grid, 
  List
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios"; // Assuming you have apiFetch for consistency
import { IMAGE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type Testimonial = {
  _id: string;
  quote: string;
  testimonial_type?: string;
  name: string;
  designation: string;
  image: string;
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  // Form Data
  const [form, setForm] = useState({ quote: "", name: "", designation: "", testimonial_type: "" });
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState(""); // Kept for API flexibility if needed
  const [preview, setPreview] = useState<string | null>(null);

  /* ===== FETCH ===== */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      toast({ title: "Failed to load testimonials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ===== FILTER ===== */
  const filteredItems = useMemo(() => {
    return items.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.quote.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  /* ===== HANDLERS ===== */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (!input.files || input.files.length === 0) return;
    
    const f = input.files[0];
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large (max 5MB)", variant: "destructive" });
      input.value = "";
      return;
    }
    
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm({ quote: "", name: "", designation: "", testimonial_type: "" });
    setFile(null);
    setPreview(null);
    setUrl("");
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !url) return toast({ title: "Image is required", variant: "destructive" });
    if (!form.name.trim()) return toast({ title: "Name is required", variant: "destructive" });
    if (!form.testimonial_type.trim()) return toast({ title: "testimonial_type is required", variant: "destructive" });

    setSubmitting(true);
    try {
      if (file) {
        const fd = new FormData();
        fd.append("quote", form.quote);
        fd.append("testimonial_type", form.testimonial_type);
        fd.append("name", form.name);
        fd.append("designation", form.designation);
        fd.append("image", file);

        await fetch("/api/testimonials", { method: "POST", body: fd });
      } else if (url) {
        await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image: url }),
        });
      }

      toast({ title: "Testimonial added successfully" });
      await fetchItems();
      handleCloseForm();
    } catch (error) {
      toast({ title: "Failed to add testimonial", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!confirm("Remove this testimonial?")) return;
    setRemovingId(id);
    try {
      await fetch("/api/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setItems(items.filter((t) => t._id !== id));
      toast({ title: "Testimonial removed" });
    } catch (error) {
      toast({ title: "Failed to remove item", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showcase feedback from parents and guardians.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </AdminButton>
      </div>

      {/* FORM (Collapsible) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[10px] shadow-md border border-gray-200 overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <MessageSquareQuote className="w-4 h-4" />
                  New Testimonial
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={addItem} className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Inputs */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Parent Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                className="w-full p-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Testimonial Type</label>
                            <input
                                name="name"
                                value={form.testimonial_type}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                className="w-full p-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation</label>
                            <input
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                placeholder="e.g. Parent of Grade 5 Student"
                                className="w-full p-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Quote</label>
                        <textarea
                            name="quote"
                            value={form.quote}
                            onChange={handleChange}
                            placeholder="Share their feedback..."
                            className="w-full h-24 p-3 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="flex-1 py-2.5">
                        Cancel
                      </AdminButton>
                      <AdminButton type="submit" loading={submitting} className="flex-1 py-2.5">
                        Save Testimonial
                      </AdminButton>
                    </div>
                  </div>

                  {/* Right: Image Upload */}
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Photo</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] h-full min-h-[220px] relative group cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/50">
                      <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                      
                      {preview ? (
                        <div className="absolute inset-4 flex items-center justify-center">
                           <img src={preview} alt="Preview" className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[8px]">
                              <span className="text-white text-sm font-medium flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Change
                              </span>
                           </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                          <div className="bg-white p-3 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
                             <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Upload Photo</span>
                          <span className="text-xs text-gray-400 mt-1">Square image preferred</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[10px] border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search testimonials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-[10px] border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-[10px] border border-gray-200">
          <AdminButton variant="ghost" onClick={() => setView("grid")} className={`p-2 rounded-[10px] transition-all ${
              view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <Grid className="w-4 h-4" />
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => setView("list")} className={`p-2 rounded-[10px] transition-all ${
              view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <List className="w-4 h-4" />
          </AdminButton>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-[10px] h-48 animate-pulse p-6 flex gap-4">
               <div className="w-16 h-16 bg-gray-100 rounded-full" />
               <div className="flex-1 space-y-2 pt-2">
                 <div className="h-4 bg-gray-100 rounded w-full" />
                 <div className="h-4 bg-gray-100 rounded w-full" />
                 <div className="h-4 bg-gray-100 rounded w-1/2" />
               </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <MessageSquareQuote className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No testimonials found</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((t) => {
             const isDeleting = removingId === t._id;
             return (
            <div 
              key={t._id} 
              className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6 relative flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                  <img 
                      src={IMAGE_URL + t.image} 
                      alt={t.name} 
                      className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm" 
                  />
                  <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{t.name}</h3>
                      <p className="text-xs text-blue-600 font-medium line-clamp-1">{t.designation}</p>
                  </div>
              </div>
              
              <div className="relative pl-3 border-l-2 border-gray-100 flex-1">
                 <p className="text-sm text-gray-600 italic line-clamp-3">"{t.quote}"</p>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                     onClick={() => removeItem(t._id)}
                     disabled={isDeleting}
                     className="w-8 h-8 rounded-full border border-red-100 text-red-500 bg-white hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-110 disabled:opacity-50"
                     title="Remove"
                  >
                     {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
              </div>
            </div>
          )})}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
           {filteredItems.map((t) => {
              const isDeleting = removingId === t._id;
              return (
             <div key={t._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden border border-gray-200">
                    <img src={IMAGE_URL + t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-blue-600 font-medium">{t.designation}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 italic">"{t.quote}"</p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => removeItem(t._id)}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm disabled:opacity-50"
                        title="Remove"
                    >
                         {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                </div>
             </div>
           )})}
        </div>
      )}
    </div>
  );
}