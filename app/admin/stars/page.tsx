"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Search, 
  Grid, 
  List, 
  Loader2, 
  X, 
  Save, 
  ImageIcon, 
  Upload, 
  Video, 
  PlayCircle,
  Quote,
  User
} from "lucide-react";
import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type Star = {
  _id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  video?: string;
};

const emptyForm = {
  name: "",
  role: "",
  quote: "",
};

export default function StarsPage() {
  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  
  // UI State
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */
  const fetchStars = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/stars");
      setStars(res);
    } catch {
      toast({ title: "Failed to load stars", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStars();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredStars = useMemo(() => {
    return stars.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [stars, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: "Video too large (max 50MB)", variant: "destructive" });
        return;
      }
      setVideoFile(file);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setVideoFile(null);
    setPreview(null);
  };

  const handleEdit = (s: Star) => {
    setEditingId(s._id);
    setForm({ name: s.name, role: s.role, quote: s.quote });
    setPreview(s.image ? IMAGE_URL + s.image : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this star?")) return;
    setRemovingId(id);
    try {
      await apiFetch("/stars", {
        method: "DELETE",
        data: { id },
      });
      setStars(stars.filter((s) => s._id !== id));
      toast({ title: "Star deleted successfully" });
    } catch {
      toast({ title: "Failed to delete star", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast({ title: "Name is required", variant: "destructive" });
    if (!editingId && !imageFile) return toast({ title: "Image is required", variant: "destructive" });

    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append("image", imageFile);
    if (videoFile) fd.append("video", videoFile);
    if (editingId) fd.append("id", editingId);

    try {
      await apiFetch("/stars", {
        method: editingId ? "PUT" : "POST",
        data: fd,
      });
      
      toast({ title: `Star ${editingId ? "updated" : "created"} successfully` });
      fetchStars();
      handleCloseForm();
    } catch {
      toast({ title: "Failed to save star", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stars Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Highlight students, alumni, or faculty and their success stories.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Star
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
                  {editingId ? "Edit Star Profile" : "Create New Profile"}
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left: Inputs */}
                  <div className="md:col-span-2 space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="e.g. Jane Doe"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role / Achievement</label>
                        <input
                          name="role"
                          value={form.role}
                          onChange={handleChange}
                          placeholder="e.g. Gold Medalist"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
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
                        placeholder="Share a quote or testimonial..."
                        className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        required
                      />
                    </div>

                    {/* Video Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Video Testimonial (Optional)</label>
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-[10px] bg-gray-50/50">
                            <div className="p-2 bg-white rounded-full shadow-sm">
                                <Video className="w-5 h-5 text-purple-500" />
                            </div>
                            <div className="flex-1">
                                <input 
                                    type="file" 
                                    accept="video/mp4,video/webm" 
                                    onChange={handleVideoChange} 
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                                {videoFile ? (
                                    <p className="text-xs text-green-600 mt-1">New video selected</p>
                                ) : (
                                    <p className="text-xs text-gray-400 mt-1">Max 50MB. MP4 or WebM.</p>
                                )}
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Right: Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Photo</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] p-4 cursor-pointer hover:bg-gray-50 transition-colors h-64 relative group">
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
                          <ImageIcon className="w-10 h-10 opacity-50" />
                          <span className="text-sm font-medium">Upload Photo</span>
                          <span className="text-xs text-gray-300 text-center">Max 5MB</span>
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
                    {editingId ? "Update Profile" : "Save Profile"}
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
            placeholder="Search profiles..."
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
            <div key={i} className="bg-white border border-gray-200 rounded-[10px] h-64 animate-pulse">
               <div className="h-40 bg-gray-100 rounded-t-[10px]" />
               <div className="p-4 space-y-2">
                 <div className="h-4 bg-gray-100 rounded w-3/4" />
                 <div className="h-3 bg-gray-100 rounded w-1/2" />
               </div>
            </div>
          ))}
        </div>
      ) : filteredStars.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No profiles found</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStars.map((s) => {
            const isDeleting = removingId === s._id;
            return (
              <div key={s._id} className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <img src={IMAGE_URL + s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Video Play Overlay */}
                  {s.video && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <button 
                            onClick={() => setActiveVideo(s.video!)}
                            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:scale-110 transition-transform"
                        >
                            <PlayCircle className="w-8 h-8" />
                        </button>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-xl">{s.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{s.role}</p>
                  </div>
                  
                  <div className="relative pl-4 border-l-2 border-gray-200 mb-4 flex-1">
                    <Quote className="w-4 h-4 text-gray-300 absolute -top-1 -left-1 transform -translate-x-full -translate-y-full" />
                    <p className="text-sm text-gray-600 italic line-clamp-3">"{s.quote}"</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
                    <button 
                        onClick={() => handleEdit(s)}
                        className="w-10 h-10 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(s._id)}
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
           {filteredStars.map((s) => {
              const isDeleting = removingId === s._id;
              return (
                <div key={s._id} className="p-4 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50 transition-colors group">
                    <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border border-gray-200 relative">
                        <img src={IMAGE_URL + s.image} alt={s.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">{s.name}</h3>
                        <p className="text-xs text-blue-600 font-medium mb-1">{s.role}</p>
                        <p className="text-sm text-gray-500 line-clamp-1 italic">"{s.quote}"</p>
                    </div>

                    {s.video && (
                        <AdminButton variant="ghost" onClick={() => setActiveVideo(s.video!)} className="text-gray-400 hover:text-blue-600">
                            <Video className="w-4 h-4" />
                        </AdminButton>
                    )}

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s._id)} disabled={isDeleting} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
              );
           })}
        </div>
      )}

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-black rounded-[10px] overflow-hidden shadow-2xl max-w-4xl w-full relative aspect-video">
            <button 
                onClick={() => setActiveVideo(null)} 
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <video src={IMAGE_URL + activeVideo} controls autoPlay className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}