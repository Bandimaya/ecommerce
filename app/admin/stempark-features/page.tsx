"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Loader2, 
  X, 
  Save, 
  ImageIcon, 
  Upload,
  Cpu, 
  Gamepad2, 
  Microscope, 
  Zap, 
  Rocket, 
  BookOpen,
  Search,
  Grid,
  List,
  BarChart
} from "lucide-react";
import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

// Icon mapping for dynamic rendering
const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  Gamepad2,
  Microscope,
  Zap,
  Rocket,
  BookOpen
};

const ICONS = Object.keys(ICON_MAP);

type Feature = {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  icon: string;
  image: string;
};

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  stat: "",
  icon: "Cpu",
};

export default function StemparkFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  
  // Form State
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ---------------- FETCH DATA ---------------- */
  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/stempark-features");
      setFeatures(res);
    } catch {
      toast({ title: "Failed to load features", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredFeatures = useMemo(() => {
    return features.filter(
      (f) =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [features, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIconSelect = (iconName: string) => {
    setForm({ ...form, icon: iconName });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Image too large (max 5MB)", variant: "destructive" });
        return;
      }
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setPreview(null);
  };

  const handleEdit = (f: Feature) => {
    setEditingId(f._id);
    setForm({
      title: f.title,
      subtitle: f.subtitle,
      description: f.description,
      stat: f.stat,
      icon: f.icon,
    });
    setPreview(f.image ? IMAGE_URL + f.image : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feature?")) return;
    setRemovingId(id);
    try {
      await apiFetch("/stempark-features", {
        method: "DELETE",
        data: { id },
      });
      setFeatures(features.filter(f => f._id !== id));
      toast({ title: "Feature deleted successfully" });
    } catch (err) {
      toast({ title: "Failed to delete feature", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast({ title: "Title is required", variant: "destructive" });
    if (!editingId && !imageFile) return toast({ title: "Image is required", variant: "destructive" });

    setIsSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append("image", imageFile);
    if (editingId) fd.append("id", editingId);

    try {
      await apiFetch("/stempark-features", {
        method: editingId ? "PUT" : "POST",
        data: fd,
      });
      
      toast({ title: `Feature ${editingId ? "updated" : "created"} successfully` });
      fetchFeatures();
      handleCloseForm();
    } catch (error) {
      toast({ title: "Failed to save feature", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for dynamic icon
  const SelectedIcon = ICON_MAP[form.icon] || Cpu;

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">STEM Park Features</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the key highlights, statistics, and areas of interest.
          </p>
        </div>
        <AdminButton onClick={() => setShowForm(true)} disabled={showForm} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Feature
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
                  {editingId ? "Edit Feature" : "Create New Feature"}
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Column: Inputs */}
                  <div className="md:col-span-2 space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                        <input
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="e.g. Robotics Lab"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                        <input
                          name="subtitle"
                          value={form.subtitle}
                          onChange={handleChange}
                          placeholder="e.g. Advanced Machinery"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Statistic / Badge</label>
                        <input
                          name="stat"
                          value={form.stat}
                          onChange={handleChange}
                          placeholder="e.g. 50+ Robots"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>
                      
                      {/* Visual Icon Selector */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
                        <div className="flex flex-wrap gap-3">
                            {ICONS.map((iconKey) => {
                                const IconComp = ICON_MAP[iconKey];
                                const isSelected = form.icon === iconKey;
                                return (
                                    <button
                                        type="button"
                                        key={iconKey}
                                        onClick={() => handleIconSelect(iconKey)}
                                        className={`p-3 rounded-[10px] border transition-all ${
                                            isSelected 
                                            ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm" 
                                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        <IconComp className="w-5 h-5" />
                                    </button>
                                )
                            })}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          placeholder="Detailed description of this feature..."
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Feature Image</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] p-4 cursor-pointer hover:bg-gray-50 transition-colors h-64 md:h-full max-h-[350px] relative group">
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                      
                      {preview ? (
                        <div className="w-full h-full flex items-center justify-center relative">
                          <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-[10px]" />
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
                  <AdminButton variant="ghost" type="button" onClick={handleCloseForm} className="px-5 py-2.5">
                    Cancel
                  </AdminButton>
                  <AdminButton type="submit" loading={isSubmitting} className="px-8 py-2.5">
                    {editingId ? "Update Feature" : "Save Feature"}
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
            placeholder="Search features..."
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-[10px] overflow-hidden animate-pulse h-80">
              <div className="h-48 bg-gray-100 mb-4"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded-[10px] w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-[10px] w-full"></div>
                <div className="h-4 bg-gray-100 rounded-[10px] w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredFeatures.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Rocket className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No features found</p>
          <p className="text-sm text-gray-400">Add features to highlight STEM Park capabilities.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeatures.map((f) => {
            const FeatureIcon = ICON_MAP[f.icon] || Cpu;
            const isDeleting = removingId === f._id;
            
            return (
              <div
                key={f._id}
                className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {f.image ? (
                    <img
                      src={IMAGE_URL + f.image}
                      alt={f.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-16 h-16 opacity-50" />
                    </div>
                  )}
                  {/* Icon Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-[10px] shadow-sm text-blue-600 border border-black/5">
                    <FeatureIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-1">
                     <h3 className="font-bold text-gray-900 text-xl line-clamp-1" title={f.title}>{f.title}</h3>
                     <p className="text-xs text-blue-600 font-medium">{f.subtitle}</p>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2 flex-1 mb-4">
                    {f.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-[10px] border border-gray-200">
                      <BarChart className="w-3.5 h-3.5" />
                      {f.stat}
                    </span>
                    
                    {/* Circular Actions */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEdit(f)}
                        className="w-10 h-10 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(f._id)}
                        disabled={isDeleting}
                        className="w-10 h-10 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 disabled:opacity-50"
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
           {filteredFeatures.map((f) => {
              const FeatureIcon = ICON_MAP[f.icon] || Cpu;
              const isDeleting = removingId === f._id;
              
              return (
                <div key={f._id} className="p-4 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50 transition-colors group">
                    <div className="w-full md:w-24 h-24 shrink-0 bg-gray-100 rounded-[10px] overflow-hidden border border-gray-200 relative">
                        {f.image ? (
                            <img src={IMAGE_URL + f.image} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-300" />
                            </div>
                        )}
                        <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-sm">
                            <FeatureIcon className="w-3 h-3 text-blue-600" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                             <h3 className="font-bold text-lg text-gray-900">{f.title}</h3>
                             <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-[10px] border border-blue-100 font-medium">
                                {f.subtitle}
                             </span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1 mb-2">{f.description}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <BarChart className="w-3.5 h-3.5" /> {f.stat}
                        </div>
                    </div>

                    {/* List Actions */}
                    <div className="flex gap-2 self-start md:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                           onClick={() => handleEdit(f)} 
                           className="w-10 h-10 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(f._id)}
                          disabled={isDeleting}
                          className="w-10 h-10 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 disabled:opacity-50"
                        >
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