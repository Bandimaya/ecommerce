"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Trash2, 
  Upload, 
  Plus, 
  Loader2, 
  Award, 
  ShieldCheck, 
  Globe, 
  X, 
  ImageIcon, 
  Search, 
  Grid, 
  List,
  CheckCircle2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { IMAGE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

// Icon Mapping
const ICON_MAP: Record<string, React.ElementType> = {
  award: Award,
  shield: ShieldCheck,
  globe: Globe,
};

const ICONS = [
  { key: "award", label: "Award" },
  { key: "shield", label: "Shield" },
  { key: "globe", label: "Global" },
];

type Certification = {
  _id: string;
  label: string;
  image: string;
  alt: string;
  icon: string;
};

export default function CertificationsPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  // Form Data
  const [form, setForm] = useState({ label: "", alt: "", icon: "award" });
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ===== FETCH ===== */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/certifications");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      toast({ title: "Failed to load certifications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ===== FILTER ===== */
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase()) || 
      item.alt.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

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
    setForm({ label: "", alt: "", icon: "award" });
    setUrl("");
    setFile(null);
    setPreview(null);
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (file) {
        const fd = new FormData();
        fd.append("label", form.label);
        fd.append("alt", form.alt);
        fd.append("icon", form.icon);
        fd.append("image", file);

        await fetch("/api/certifications", { method: "POST", body: fd });
      } else if (url) {
        await fetch("/api/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image: url }),
        });
      }

      toast({ title: "Certification added successfully" });
      await fetchItems();
      handleCloseForm();
    } catch (error) {
      toast({ title: "Failed to add certification", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!confirm("Remove this certification?")) return;
    setRemovingId(id);
    try {
      await fetch("/api/certifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setItems(items.filter((i) => i._id !== id));
      toast({ title: "Certification removed" });
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
          <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Display awards, licenses, and verified badges.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Certification
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
                  <Award className="w-4 h-4" />
                  Add New Item
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
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Label</label>
                            <input
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                                placeholder="e.g. ISO 9001"
                                className="w-full p-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Alt Text</label>
                            <input
                                value={form.alt}
                                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                                placeholder="e.g. ISO Certified Badge"
                                className="w-full p-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Icon</label>
                        <div className="flex gap-3">
                            {ICONS.map((icon) => {
                                const IconComp = ICON_MAP[icon.key];
                                const isSelected = form.icon === icon.key;
                                return (
                                    <button
                                        type="button"
                                        key={icon.key}
                                        onClick={() => setForm({ ...form, icon: icon.key })}
                                        className={`flex-1 p-3 rounded-[10px] border flex flex-col items-center justify-center gap-2 transition-all ${
                                            isSelected 
                                            ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm" 
                                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        <IconComp className="w-5 h-5" />
                                        <span className="text-xs font-medium">{icon.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL (Optional)</label>
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full p-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                        <p className="text-xs text-gray-400 mt-1">Leave empty if uploading a file below.</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="flex-1 py-2.5">
                        Cancel
                      </AdminButton>
                      <AdminButton type="submit" loading={submitting} className="flex-1 py-2.5">
                        Save Item
                      </AdminButton>
                    </div>
                  </div>

                  {/* Right: Image Upload */}
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Badge / Logo</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] h-full min-h-[220px] relative group cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/50">
                      <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                      
                      {preview ? (
                        <div className="absolute inset-4 flex items-center justify-center bg-white rounded-[8px] border border-gray-100 shadow-sm p-4">
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
                          <span className="text-sm font-medium text-gray-700">Upload Image</span>
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
            placeholder="Search certifications..."
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-[10px] h-48 animate-pulse p-4">
               <div className="h-24 bg-gray-100 rounded-[8px] w-full mb-4" />
               <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
               <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Award className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No certifications found</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((c) => {
             const isDeleting = removingId === c._id;
             const IconComp = ICON_MAP[c.icon] || Award;
             return (
            <div 
              key={c._id} 
              className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col items-center text-center relative"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                     onClick={() => removeItem(c._id)}
                     disabled={isDeleting}
                     className="w-8 h-8 rounded-full border border-red-100 text-red-500 bg-white hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-110 disabled:opacity-50"
                     title="Remove"
                  >
                     {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
              </div>

              <div className="w-full aspect-[3/2] bg-gray-50 rounded-[8px] p-4 flex items-center justify-center border border-gray-100 mb-4 group-hover:scale-[1.02] transition-transform">
                <img 
                    src={IMAGE_URL + c.image} 
                    alt={c.alt} 
                    className="max-w-full max-h-full object-contain" 
                />
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                 <IconComp className="w-4 h-4 text-blue-500" />
                 <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{c.label}</h3>
              </div>
              <p className="text-xs text-gray-400 line-clamp-1">{c.alt}</p>
            </div>
          )})}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
           {filteredItems.map((c) => {
              const isDeleting = removingId === c._id;
              const IconComp = ICON_MAP[c.icon] || Award;
              return (
             <div key={c._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                <div className="w-16 h-12 shrink-0 bg-white rounded-[6px] border border-gray-200 p-1 flex items-center justify-center">
                    <img src={IMAGE_URL + c.image} alt={c.alt} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 text-sm">{c.label}</h3>
                        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <IconComp className="w-3 h-3" /> {c.icon}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{c.alt}</p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => removeItem(c._id)}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm disabled:opacity-50"
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