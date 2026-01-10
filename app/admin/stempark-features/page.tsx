"use client";

import { useEffect, useState } from "react";
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
  BookOpen 
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

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      toast({ title: "Feature deleted successfully", variant: "success" });
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
        data: fd, // apiFetch handles FormData properly if configured, or use fetch directly
      });
      
      toast({ title: `Feature ${editingId ? "updated" : "created"} successfully`, variant: "success" });
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
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">STEM Park Features</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the key highlights and statistics of the STEM Park.
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
            <div className="bg-white rounded-[10px] shadow-md border border-gray-200 overflow-hidden mb-8">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  {editingId ? <Pencil className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  {editingId ? "Edit Feature" : "Create New Feature"}
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px]">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Statistic</label>
                        <input
                          name="stat"
                          value={form.stat}
                          onChange={handleChange}
                          placeholder="e.g. 50+ Robots"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon</label>
                        <div className="relative">
                          <select
                            name="icon"
                            value={form.icon}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-[10px] pl-3 pr-10 py-2.5 appearance-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm bg-white"
                          >
                            {ICONS.map((i) => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                            <SelectedIcon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
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

                  {/* Right Column: Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Feature Image</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] p-4 cursor-pointer hover:bg-gray-50 transition-colors h-64 md:h-full max-h-[300px] relative group">
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                      
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
                          <Upload className="w-10 h-10 opacity-50" />
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

      {/* LIST CONTENT */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-[10px] p-4 flex gap-4 animate-pulse">
              <div className="w-24 h-24 bg-gray-100 rounded-[10px]"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded-[10px] w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded-[10px] w-1/2"></div>
                <div className="h-3 bg-gray-100 rounded-[10px] w-full mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : features.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Rocket className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No features found</p>
          <p className="text-sm text-gray-400">Add features to highlight STEM Park capabilities.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const FeatureIcon = ICON_MAP[f.icon] || Cpu;
            return (
              <div
                key={f._id}
                className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex overflow-hidden h-40 cursor-pointer"
              >
                <div className="w-1/3 relative bg-gray-50">
                  <img
                    src={IMAGE_URL + f.image}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md p-1.5 rounded-[8px] shadow-sm">
                    <FeatureIcon className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                
                <div className="w-2/3 p-4 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{f.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{f.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-1">
                    {f.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-[10px] border border-blue-100">
                      {f.stat}
                    </span>
                    <div className="flex gap-2">
                      <AdminButton variant="ghost" onClick={() => handleEdit(f)} className="p-1.5">
                        <Pencil className="w-3.5 h-3.5" />
                      </AdminButton>
                      <AdminButton variant="danger" loading={removingId === f._id} onClick={() => handleDelete(f._id)} className="p-1.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </AdminButton>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}