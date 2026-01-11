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
  Clock, 
  Users, 
  GraduationCap, 
  BookOpen,
  Pencil,
  Hash
} from "lucide-react";
import { apiFetch } from "@/lib/axios"; // Utilizing apiFetch for consistency
import { IMAGE_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type StemCourse = {
  _id: string;
  courseId: string;
  title: string;
  image: string;
  age: string;
  description: string;
  level: string;
  duration: string;
  enrolled: string;
};

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const emptyForm = {
  courseId: "",
  title: "",
  age: "",
  description: "",
  level: "Beginner",
  duration: "",
  enrolled: "",
};

export default function StemCoursesPage() {
  const [courses, setCourses] = useState<StemCourse[]>([]);
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
  // Keep url state if you need to support direct URL entry, otherwise file is preferred
  const [url, setUrl] = useState(""); 

  /* ---------------- FETCH ---------------- */
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stem-courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load courses", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.courseId.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setUrl("");
  };

  const handleEdit = (c: StemCourse) => {
    setEditingId(c._id);
    setForm({
      courseId: c.courseId,
      title: c.title,
      age: c.age,
      description: c.description,
      level: c.level,
      duration: c.duration,
      enrolled: c.enrolled,
    });
    setPreview(c.image ? IMAGE_URL + c.image : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast({ title: "Title is required", variant: "destructive" });
    if (!editingId && !file && !url) return toast({ title: "Image is required", variant: "destructive" });

    setSubmitting(true);
    try {
      if (file) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append("image", file);
        if (editingId) fd.append("id", editingId);

        // Adjust endpoint based on edit or create
        await fetch("/api/stem-courses", { 
            method: editingId ? "PUT" : "POST", 
            body: fd 
        });
      } else if (url || editingId) {
        // Fallback or update without file change
        await fetch("/api/stem-courses", {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image: url, id: editingId }),
        });
      }

      toast({ title: `Course ${editingId ? "updated" : "created"} successfully` });
      await fetchCourses();
      handleCloseForm();
    } catch (err) {
      toast({ title: "Failed to save course", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const removeCourse = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    setRemovingId(id);
    try {
      await fetch("/api/stem-courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCourses(courses.filter((c) => c._id !== id));
      toast({ title: "Course deleted" });
    } catch (err) {
      toast({ title: "Failed to delete course", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">STEM Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the curriculum, levels, and course details.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Course
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
                  {editingId ? "Edit Course" : "Create New Course"}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course ID</label>
                            <input
                                name="courseId"
                                value={form.courseId}
                                onChange={handleChange}
                                placeholder="e.g. MD-01"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Intro to Robotics"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Age Group</label>
                            <input
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                placeholder="e.g. 8-12 Years"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty Level</label>
                            <select
                                name="level"
                                value={form.level}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            >
                                {LEVELS.map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
                            <input
                                name="duration"
                                value={form.duration}
                                onChange={handleChange}
                                placeholder="e.g. 24 Sessions"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Enrolled</label>
                            <input
                                name="enrolled"
                                value={form.enrolled}
                                onChange={handleChange}
                                placeholder="e.g. 1.5k+"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Detailed overview of the course curriculum..."
                            className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            required
                        />
                    </div>
                  </div>

                  {/* Right: Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Thumbnail</label>
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
                          <span className="text-sm font-medium">Upload Thumbnail</span>
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
                    {editingId ? "Update Course" : "Save Course"}
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
            placeholder="Search courses..."
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
            <div key={i} className="bg-white border border-gray-200 rounded-[10px] h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No courses found</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((c) => {
            const isDeleting = removingId === c._id;
            return (
              <div key={c._id} className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img src={IMAGE_URL + c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-[10px] text-xs font-bold shadow-sm text-gray-700 border border-black/5">
                      {c.level}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/70 backdrop-blur-md px-2 py-1 rounded-[10px] text-xs font-mono text-white border border-white/10 flex items-center gap-1">
                      <Hash className="w-3 h-3" /> {c.courseId}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">{c.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{c.description}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-gray-50 mb-4">
                     <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Age</p>
                        <p className="text-xs font-semibold text-gray-700">{c.age}</p>
                     </div>
                     <div className="text-center border-l border-r border-gray-50">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-xs font-semibold text-gray-700">{c.duration}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Students</p>
                        <p className="text-xs font-semibold text-gray-700">{c.enrolled}</p>
                     </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => handleEdit(c)}
                        className="w-10 h-10 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => removeCourse(c._id)}
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
           {filteredCourses.map((c) => {
              const isDeleting = removingId === c._id;
              return (
                <div key={c._id} className="p-4 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50 transition-colors group">
                    <div className="w-full md:w-24 h-16 shrink-0 bg-gray-100 rounded-[8px] overflow-hidden border border-gray-200 relative">
                        <img src={IMAGE_URL + c.image} alt={c.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 bg-black/60 px-1.5 py-0.5 text-[10px] text-white rounded-tl">
                            {c.courseId}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                             <h3 className="font-bold text-gray-900">{c.title}</h3>
                             <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-[10px] border border-blue-100 font-medium">
                                {c.level}
                             </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.age}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration}</span>
                            <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {c.enrolled}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeCourse(c._id)} disabled={isDeleting} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
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