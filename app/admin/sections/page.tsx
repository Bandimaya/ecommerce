"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Search, 
  Grid, 
  List, 
  ImageIcon, 
  X, 
  Loader2, 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { IMAGE_URL } from "@/lib/constants";
import AdminButton from "@/components/admin/AdminButton";

interface Section {
  _id: string;
  label: string;
  icon: string;
  description: string;
  slug: string;
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    description: ""
  });
  const [removingId, setRemovingId] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */
  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/sections");
      setSections(res);
    } catch {
      toast({ title: "Failed to load sections", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredSections = useMemo(() => {
    return sections.filter(section =>
      section?.label?.toLowerCase()?.includes(search.toLowerCase()) ||
      section?.description?.toLowerCase()?.includes(search.toLowerCase())
    );
  }, [sections, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ label: "", description: "" });
    setImageFile(null);
    setPreview(null);
  };

  const handleEdit = (item: Section) => {
    setEditingId(item._id);
    setForm({ label: item.label, description: item.description });
    setPreview(item.icon ? IMAGE_URL + item.icon : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large (max 5MB)", variant: "destructive" });
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------- ACTIONS ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim()) return toast({ title: "Label is required", variant: "destructive" });

    setSubmitting(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (imageFile) data.append("icon", imageFile);
    if (editingId) data.append("id", editingId);

    try {
      let res: Section;
      if (editingId) {
        res = await apiFetch(`/sections`, { method: "PUT", data });
        setSections(sections.map(s => (s._id === editingId ? res : s)));
        toast({ title: "Section updated successfully" });
      } else {
        res = await apiFetch("/sections", { method: "POST", data });
        setSections([res, ...sections]);
        toast({ title: "Section created successfully" });
      }
      handleCloseForm();
    } catch {
      toast({ title: "Failed to save section", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    setRemovingId(id);
    try {
      await apiFetch(`/sections`, { method: "DELETE", data: { id } });
      setSections(sections.filter(s => s._id !== id));
      toast({ title: "Section deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sections</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize course categories and learning tracks.
          </p>
        </div>
        <AdminButton onClick={() => setShowForm(true)} disabled={showForm} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add New Section
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
                  {editingId ? "Edit Section" : "Create New Section"}
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left: Inputs */}
                  <div className="md:col-span-2 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Label</label>
                      <input
                        name="label"
                        value={form.label}
                        onChange={handleChange}
                        placeholder="e.g., Robotics Level 1"
                        className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Brief overview of what this section covers..."
                        className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Right: Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Section Icon</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] p-4 cursor-pointer hover:bg-gray-50 transition-colors h-full max-h-[200px] relative group">
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
                          <span className="text-sm font-medium">Upload Icon</span>
                          <span className="text-xs text-gray-300">Max 5MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                  <AdminButton variant="ghost" type="button" onClick={handleCloseForm} className="px-5 py-2.5">
                    Cancel
                  </AdminButton>
                  <AdminButton type="submit" loading={submitting} className="px-8 py-2.5">
                    {editingId ? "Update Section" : "Save Section"}
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
            placeholder="Search sections..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-[10px] shadow-sm border border-gray-200 h-96 animate-pulse">
               <div className="h-48 bg-gray-100 rounded-[10px] mb-4 w-full"></div>
               <div className="h-8 bg-gray-100 rounded-[10px] w-3/4 mb-3"></div>
               <div className="h-4 bg-gray-100 rounded-[10px] w-full mb-1"></div>
               <div className="h-4 bg-gray-100 rounded-[10px] w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Grid className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No sections found</p>
          <p className="text-sm text-gray-400">Try creating a new one or adjust your search.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSections.map(section => {
             const isDeleting = removingId === section._id;
             return (
            <div
              key={section._id}
              className="group bg-white rounded-[10px] shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image Area */}
              <div className="relative h-60 bg-gray-100 overflow-hidden">
                {section.icon ? (
                  <img src={IMAGE_URL + section.icon} alt={section.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                    <ImageIcon className="w-16 h-16 opacity-50" />
                  </div>
                )}
              </div>
              
              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-1" title={section.label}>
                    {section.label}
                  </h3>
                  <p className="text-base text-gray-500 line-clamp-3 mb-6 flex-1">
                    {section.description}
                  </p>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
                    {/* Slug Tag */}
                    <span className="text-xs font-mono font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-[10px] border border-gray-100">
                      {section.slug}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEdit(section)} 
                        className="w-12 h-12 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-black hover:border-blue-500 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                        title="Edit Section"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>

                      <button 
                        onClick={() => handleDelete(section._id)} 
                        disabled={isDeleting}
                        className="w-12 h-12 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                        title="Delete Section"
                      >
                         {isDeleting ? (
                           <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                           <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          )})}
        </div>
      ) : (
        // LIST VIEW - Updated to match Grid hover effects
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
          {filteredSections.map(section => {
             const isDeleting = removingId === section._id;
             return (
            <div key={section._id} className="p-4 flex items-center gap-6 hover:bg-gray-50 transition-colors group">
              <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-[10px] flex items-center justify-center overflow-hidden border border-gray-200">
                {section.icon ? (
                  <img src={IMAGE_URL + section.icon} alt={section.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 truncate">{section.label}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">{section.slug}</p>
                </div>
                <div className="md:col-span-2 flex items-center">
                   <p className="text-sm text-gray-500 line-clamp-2">{section.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(section)} 
                    className="w-10 h-10 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-black hover:border-blue-500 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                    title="Edit Section"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(section._id)} 
                    disabled={isDeleting}
                    className="w-10 h-10 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                    title="Delete Section"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}