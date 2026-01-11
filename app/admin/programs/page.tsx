"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { 
  PlusCircle, 
  Trash2, 
  Search, 
  Grid, 
  List, 
  Loader2, 
  X, 
  Save, 
  ImageIcon, 
  Upload, 
  Rocket, 
  Book, 
  Globe, 
  Users,
  Palette,
  Layout,
  Pencil
} from "lucide-react";
import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

// --- CONSTANTS & MAPPINGS ---

const ICON_MAP: Record<string, React.ElementType> = {
  rocket: Rocket,
  book: Book,
  globe: Globe,
  users: Users,
};

const ICONS = Object.keys(ICON_MAP);

const COLORS = ["purple", "amber", "blue", "emerald"];

const COLOR_STYLES: Record<string, string> = {
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

type Program = {
  _id: string;
  programId: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  stats: { label: string; value: string }[];
  features: string[];
};

const emptyForm = {
  programId: "",
  title: "",
  subtitle: "",
  description: "",
  icon: "rocket",
  color: "purple",
  stats: [{ label: "", value: "" }, { label: "", value: "" }], // Default 2 stats
  features: "",
};

export default function ProgramsPage() {
  const [items, setItems] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  // Form State
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState(""); 

  /* ---------------- FETCH ---------------- */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/programs");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      toast({ title: "Failed to load programs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredItems = useMemo(() => {
    return items.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.programId.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStatChange = (index: number, field: "label" | "value", val: string) => {
    const newStats = [...form.stats];
    newStats[index] = { ...newStats[index], [field]: val };
    setForm({ ...form, stats: newStats });
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
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setUrl("");
  };

  const handleEdit = (p: Program) => {
    setEditingId(p._id);
    setForm({
      programId: p.programId,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      icon: p.icon,
      color: p.color,
      stats: p.stats.length > 0 ? p.stats : [{ label: "", value: "" }, { label: "", value: "" }],
      features: p.features.join(", "),
    });
    setPreview(p.image ? IMAGE_URL + p.image : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast({ title: "Title is required", variant: "destructive" });
    if (!editingId && !file && !url) return toast({ title: "Image is required", variant: "destructive" });

    setSubmitting(true);
    const payload = {
        ...form,
        features: form.features.split(",").map((f) => f.trim()).filter(f => f !== ""),
        // Filter out empty stats
        stats: form.stats.filter(s => s.label && s.value)
    };

    try {
      if (file) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, JSON.stringify(v)));
        fd.append("image", file);
        if (editingId) fd.append("id", editingId);

        await fetch("/api/programs", { method: editingId ? "PUT" : "POST", body: fd });
      } else {
        await fetch("/api/programs", {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, image: url, id: editingId }),
        });
      }

      toast({ title: `Program ${editingId ? "updated" : "created"} successfully` });
      await fetchItems();
      handleCloseForm();
    } catch (err) {
      toast({ title: "Failed to save program", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const removeProgram = async (id: string) => {
    if (!confirm("Delete this program?")) return;
    setRemovingId(id);
    try {
      await fetch("/api/programs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setItems(items.filter((p) => p._id !== id));
      toast({ title: "Program deleted" });
    } catch (err) {
      toast({ title: "Failed to delete program", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage educational tracks, clubs, and special programs.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Program
        </AdminButton>
      </div>

      {/* FORM AREA */}
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
                  {editingId ? <Pencil className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  {editingId ? "Edit Program" : "Create New Program"}
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Program Title</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. STEM Clubs"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Program ID</label>
                            <input
                                name="programId"
                                value={form.programId}
                                onChange={handleChange}
                                placeholder="e.g. stem-clubs"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                            <input
                                name="subtitle"
                                value={form.subtitle}
                                onChange={handleChange}
                                placeholder="e.g. Weekly Workshops"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Visuals */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                            <div className="flex gap-2">
                                {ICONS.map(iconKey => {
                                    const IconComp = ICON_MAP[iconKey];
                                    return (
                                        <button
                                            type="button"
                                            key={iconKey}
                                            onClick={() => setForm({...form, icon: iconKey})}
                                            className={`p-2.5 rounded-[10px] border transition-all ${
                                                form.icon === iconKey 
                                                ? "bg-gray-800 text-white border-gray-800" 
                                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            <IconComp className="w-5 h-5" />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                            <div className="flex gap-2">
                                {COLORS.map(color => (
                                    <button
                                        type="button"
                                        key={color}
                                        onClick={() => setForm({...form, color: color})}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                                            form.color === color 
                                            ? "border-gray-800 scale-110" 
                                            : "border-transparent hover:scale-105"
                                        }`}
                                        style={{ backgroundColor: color === 'white' ? '#eee' : color }} 
                                    >
                                        <span className={`block w-full h-full rounded-full border border-black/10 bg-${color}-500`}></span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Detailed overview..."
                            className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Key Stats</label>
                        <div className="grid grid-cols-2 gap-4">
                            {form.stats.map((stat, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        placeholder="Label (e.g. Age)"
                                        value={stat.label}
                                        onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                                        className="w-1/2 border border-gray-300 rounded-[10px] px-3 py-2 text-sm"
                                    />
                                    <input 
                                        placeholder="Value (e.g. 10+)"
                                        value={stat.value}
                                        onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                                        className="w-1/2 border border-gray-300 rounded-[10px] px-3 py-2 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Features (Comma separated)</label>
                        <input
                            name="features"
                            value={form.features}
                            onChange={handleChange}
                            placeholder="e.g. Hands-on learning, Certified mentors, Global curriculum"
                            className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                  </div>

                  {/* Right Column: Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Program Image</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] p-4 cursor-pointer hover:bg-gray-50 transition-colors h-64 relative group bg-gray-50/50">
                      <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                      
                      {preview ? (
                        <div className="w-full h-full flex items-center justify-center relative">
                          <img src={preview} alt="Preview" className="max-h-full max-w-full object-cover rounded-[10px]" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                              <Pencil className="w-4 h-4" /> Change
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                          <ImageIcon className="w-10 h-10 opacity-50" />
                          <span className="text-sm font-medium">Upload Image</span>
                          <span className="text-xs text-gray-300 text-center">PNG, JPG up to 5MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
                  <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="px-5 py-2.5">
                    Cancel
                  </AdminButton>
                  <AdminButton type="submit" loading={submitting} className="px-8 py-2.5">
                    {editingId ? "Update Program" : "Save Program"}
                  </AdminButton>
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
            placeholder="Search programs..."
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-[10px] h-96 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Layout className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No programs found</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((p) => {
            const isDeleting = removingId === p._id;
            const IconComp = ICON_MAP[p.icon] || Rocket;
            const themeClass = COLOR_STYLES[p.color] || COLOR_STYLES.purple;

            return (
              <div key={p._id} className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img src={IMAGE_URL + p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className={`absolute top-3 left-3 p-2 rounded-[10px] shadow-sm border ${themeClass}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-xl mb-1">{p.title}</h3>
                    <p className="text-sm font-medium text-gray-500">{p.subtitle}</p>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1">{p.description}</p>

                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                      {p.stats.map((stat, idx) => (
                          <div key={idx} className="bg-gray-50 px-3 py-1.5 rounded-[8px] border border-gray-100 shrink-0">
                              <p className="text-[10px] text-gray-400 uppercase font-bold">{stat.label}</p>
                              <p className="text-xs font-semibold text-gray-700">{stat.value}</p>
                          </div>
                      ))}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
                    <button 
                        onClick={() => handleEdit(p)}
                        className="w-10 h-10 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => removeProgram(p._id)}
                        disabled={isDeleting}
                        className="w-10 h-10 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
           {filteredItems.map((p) => {
              const isDeleting = removingId === p._id;
              const IconComp = ICON_MAP[p.icon] || Rocket;
              const themeClass = COLOR_STYLES[p.color] || COLOR_STYLES.purple;

              return (
                <div key={p._id} className="p-4 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50 transition-colors group">
                    <div className="w-full md:w-24 h-16 shrink-0 bg-gray-100 rounded-[8px] overflow-hidden border border-gray-200 relative">
                        <img src={IMAGE_URL + p.image} alt={p.title} className="w-full h-full object-cover" />
                        <div className={`absolute bottom-1 right-1 p-1 rounded-md shadow-sm border text-xs ${themeClass}`}>
                            <IconComp className="w-3 h-3" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">{p.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{p.subtitle}</p>
                        <div className="flex gap-3 mt-1">
                            {p.stats.map((s, i) => (
                                <span key={i} className="text-xs text-gray-400 bg-white border border-gray-200 px-1.5 rounded">
                                    {s.label}: {s.value}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeProgram(p._id)} disabled={isDeleting} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
              );
           })}
        </div>
      )}
    </div>
  );
}