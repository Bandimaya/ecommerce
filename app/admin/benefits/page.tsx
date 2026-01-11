"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Trash2, 
  Upload, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  X, 
  ImageIcon, 
  Search, 
  Grid, 
  List,
  Code
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios"; // Switched to apiFetch for consistency
import { IMAGE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type Benefit = {
  _id: string;
  image: string;
  text: string;
  alt: string;
};

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  // Form Data
  const [text, setText] = useState("");
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ===== FETCH ===== */
  const fetchBenefits = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/benefits");
      setBenefits(data);
    } catch (error) {
      toast({ title: "Failed to load benefits", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  /* ===== FILTER ===== */
  const filteredBenefits = useMemo(() => {
    return benefits.filter(b => 
      b.text.toLowerCase().includes(search.toLowerCase()) || 
      b.alt.toLowerCase().includes(search.toLowerCase())
    );
  }, [benefits, search]);

  /* ===== HANDLERS ===== */
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
    setText("");
    setAlt("");
    setFile(null);
    setPreview(null);
  };

  const addBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast({ title: "Image is required", variant: "destructive" });
    if (!text.trim()) return toast({ title: "Text is required", variant: "destructive" });

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("text", text);
      fd.append("alt", alt);

      const res = await apiFetch("/benefits", {
        method: "POST",
        data: fd,
      });

      setBenefits([...benefits, res]);
      toast({ title: "Benefit added successfully" });
      handleCloseForm();
    } catch (error) {
      toast({ title: "Failed to add benefit", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const removeBenefit = async (id: string) => {
    if (!confirm("Remove this benefit?")) return;
    setRemovingId(id);
    try {
      await apiFetch("/benefits", {
        method: "DELETE",
        data: { id },
      });
      setBenefits(benefits.filter((b) => b._id !== id));
      toast({ title: "Benefit removed successfully" });
    } catch (error) {
      toast({ title: "Failed to remove benefit", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Benefits & Features</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the key value propositions displayed on the landing page.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Benefit
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
                  <CheckCircle2 className="w-4 h-4" />
                  Add Benefit
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={addBenefit} className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Inputs */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center justify-between">
                        HTML Text Content
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                            <Code className="w-3 h-3" /> HTML Supported
                        </span>
                      </label>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g. Learn <span class='text-blue-600 font-extrabold'>Coding</span> from experts"
                        className="w-full h-24 p-3 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none font-mono text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon Alt Text</label>
                      <input
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        placeholder="e.g. Coding Icon"
                        className="w-full p-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="flex-1 py-2.5">
                        Cancel
                      </AdminButton>
                      <AdminButton type="submit" loading={submitting} className="flex-1 py-2.5">
                        Save Benefit
                      </AdminButton>
                    </div>
                  </div>

                  {/* Right: Image Upload */}
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon / Illustration</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] h-full min-h-[180px] relative group cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/50">
                      <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                      
                      {preview ? (
                        <div className="absolute inset-4 flex items-center justify-center">
                           <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[8px]">
                              <span className="text-white text-sm font-medium flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Change
                              </span>
                           </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                          <div className="bg-white p-3 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
                             <Upload className="w-6 h-6 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Upload Icon</span>
                          <span className="text-xs text-gray-400 mt-1">PNG/SVG preferred</span>
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
            placeholder="Search benefits..."
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
            <div key={n} className="bg-white border border-gray-200 rounded-[10px] h-40 animate-pulse p-4 flex gap-4">
               <div className="w-20 h-20 bg-gray-100 rounded-[10px]" />
               <div className="flex-1 space-y-2 pt-2">
                 <div className="h-4 bg-gray-100 rounded w-full" />
                 <div className="h-4 bg-gray-100 rounded w-2/3" />
               </div>
            </div>
          ))}
        </div>
      ) : filteredBenefits.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <CheckCircle2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No benefits found</p>
          <p className="text-sm text-gray-400">Add benefits to highlight key features.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBenefits.map((b) => {
             const isDeleting = removingId === b._id;
             return (
            <div 
              key={b._id} 
              className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6 relative"
            >
              <div className="flex items-start gap-4">
                  <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-[10px] p-2 flex items-center justify-center border border-gray-100">
                    <img 
                        src={IMAGE_URL + b.image} 
                        alt={b.alt} 
                        className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                  
                  <div 
                    className="text-sm text-gray-700 leading-relaxed font-medium pt-1"
                    dangerouslySetInnerHTML={{ __html: b.text }}
                  />
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                     onClick={() => removeBenefit(b._id)}
                     disabled={isDeleting}
                     className="w-8 h-8 rounded-full border border-red-100 text-red-500 bg-white hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-110 disabled:opacity-50"
                     title="Remove Benefit"
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
           {filteredBenefits.map((b) => {
              const isDeleting = removingId === b._id;
              return (
             <div key={b._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-[8px] border border-gray-200 p-1.5 flex items-center justify-center">
                    <img src={IMAGE_URL + b.image} alt={b.alt} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div 
                        className="text-sm text-gray-900 line-clamp-1"
                        dangerouslySetInnerHTML={{ __html: b.text }}
                    />
                    <p className="text-xs text-gray-400 mt-0.5">Alt: {b.alt}</p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => removeBenefit(b._id)}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm disabled:opacity-50"
                        title="Remove Benefit"
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