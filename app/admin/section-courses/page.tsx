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
  Clock, 
  Users, 
  BarChart,
  Star
} from "lucide-react";
import { apiFetch } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { IMAGE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

interface SectionCourse {
  _id: string;
  title: string;
  description: string;
  image: string;
  ageRange: string;
  duration: string;
  level: string;
  skills: string[];
  rating: number;
  sectionId: string;
  enrolled: number; // Changed to number for strict typing
  alt: string;
}

interface Section {
  _id: string;
  label: string;
}

interface FormState {
  _id?: string;
  title: string;
  description: string;
  ageRange: string;
  duration: string;
  enrolled: number | ""; // Allow empty string for input field handling
  alt: string;
  level: string;
  sectionId: string;
  skills: string[];
  rating: number | ""; // Allow empty string for input field handling
}

export default function SectionCoursesPage({
  sectionId,
}: {
  sectionId: string;
}) {
  const [courses, setCourses] = useState<SectionCourse[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form & File State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    ageRange: "",
    duration: "",
    level: "",
    enrolled: "",
    alt: "",
    sectionId: sectionId || "",
    skills: [],
    rating: 5,
  });

  /* ---------------- FETCH DATA ---------------- */
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const url = sectionId ? `/section-courses?sectionId=${sectionId}` : `/section-courses`;
      const res = await apiFetch(url);
      setCourses(res);
    } catch {
      toast({ title: "Failed to load courses", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await apiFetch(`/sections`);
      setSections(res);
    } catch {
      toast({ title: "Failed to load sections", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSections();
  }, [sectionId]);

  /* ---------------- FILTER ---------------- */
  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle numeric fields strictly
    if (type === "number") {
      setForm((prev) => ({ 
        ...prev, 
        [name]: value === "" ? "" : Number(value) 
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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

  const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, skills: value.split(",").map(s => s.trim()) }));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm({
      title: "",
      description: "",
      ageRange: "",
      duration: "",
      level: "",
      enrolled: "",
      alt: "",
      sectionId: sectionId || "",
      skills: [],
      rating: 5,
    });
    setImageFile(null);
    setPreview(null);
  };

  const handleEdit = async (courseId: string) => {
    try {
      const course = await apiFetch(`/section-courses/${courseId}`);
      setForm({
        _id: course._id,
        title: course.title,
        description: course.description,
        ageRange: course.ageRange,
        duration: course.duration,
        level: course.level,
        enrolled: Number(course.enrolled) || 0,
        alt: course.alt,
        skills: course.skills,
        rating: Number(course.rating) || 5,
        sectionId: course.sectionId,
      });
      setPreview(course.image ? IMAGE_URL + course.image : null);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast({ title: "Failed to load course details", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    setRemovingId(id);
    try {
      await apiFetch(`/section-courses`, { method: "DELETE", data: { id } });
      setCourses(courses.filter((c) => c._id !== id));
      toast({ title: "Course deleted successfully" });
    } catch {
      toast({ title: "Failed to delete course", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- VALIDATIONS ---
    if (!form.title.trim()) return toast({ title: "Title is required", variant: "destructive" });
    if (!form._id && !imageFile) return toast({ title: "Image is required", variant: "destructive" });
    if (!form.sectionId) return toast({ title: "Section is required", variant: "destructive" });
    
    // Number validations
    if (form.rating === "" || form.rating < 0 || form.rating > 5) {
      return toast({ title: "Rating must be a number between 0 and 5", variant: "destructive" });
    }
    if (form.enrolled === "" || form.enrolled < 0) {
      return toast({ title: "Enrolled count must be a valid positive number", variant: "destructive" });
    }

    setIsSubmitting(true);
    const data = new FormData();
    
    // Append fields
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'skills') {
        data.append(key, JSON.stringify(value));
      } else if (key !== '_id') {
        data.append(key, String(value));
      }
    });

    if (imageFile) data.append("image", imageFile);
    if (form._id) data.append("id", form._id);

    try {
      let res;
      if (form._id) {
        res = await apiFetch(`/section-courses`, { method: "PUT", data });
        toast({ title: "Course updated successfully" });
      } else {
        res = await apiFetch("/section-courses", { method: "POST", data });
        toast({ title: "Course created successfully" });
      }
      handleCloseForm();
      fetchCourses();
    } catch (error) {
      toast({ title: "Failed to save course", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage educational courses, curriculum details, and enrollment stats.
          </p>
        </div>
        <AdminButton
          onClick={() => setShowForm(true)}
          disabled={showForm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] shadow-sm"
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
            <div className="bg-white rounded-[10px] shadow-md border border-gray-200 overflow-hidden mb-8">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  {form._id ? <Pencil className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  {form._id ? "Edit Course" : "Create New Course"}
                </h2>
                <button onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Column: Form Inputs */}
                  <div className="md:col-span-2 space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                        <input
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="e.g. Introduction to Robotics"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          placeholder="Detailed overview of the course..."
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Section</label>
                        <select
                          name="sectionId"
                          value={form.sectionId}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        >
                          <option value="">Select Section</option>
                          {sections.map((s) => (
                            <option key={s._id} value={s._id}>{s.label || s._id}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                        <select
                           name="level"
                           value={form.level}
                           onChange={handleChange}
                           className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        >
                          <option value="">Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Age Range</label>
                        <input
                          name="ageRange"
                          value={form.ageRange}
                          onChange={handleChange}
                          placeholder="e.g. 8-12 Years"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
                        <input
                          name="duration"
                          value={form.duration}
                          onChange={handleChange}
                          placeholder="e.g. 4 Weeks"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Enrolled Count (Number)</label>
                        <input
                          type="number"
                          name="enrolled"
                          value={form.enrolled}
                          onChange={handleChange}
                          min="0"
                          placeholder="e.g. 150"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                      </div>

                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (0-5)</label>
                         <input
                           type="number"
                           name="rating"
                           value={form.rating}
                           onChange={handleChange}
                           min="0"
                           max="5"
                           step="0.1"
                           className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                         />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills (Comma separated)</label>
                        <input
                          name="skills"
                          value={form.skills.join(", ")}
                          onChange={handleSkillsChange}
                          placeholder="e.g. Coding, Logic, Electronics"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Image Alt Text</label>
                        <input
                          name="alt"
                          value={form.alt}
                          onChange={handleChange}
                          placeholder="Description for accessibility"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Image</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] p-4 cursor-pointer hover:bg-gray-50 transition-colors h-64 md:h-full max-h-[400px] relative group">
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
                          <Upload className="w-10 h-10 opacity-50" />
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
                  <AdminButton type="submit" loading={isSubmitting} className="px-8 py-2.5">
                    {form._id ? (
                      <>
                        <Save className="w-4 h-4" />
                        Update Course
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Course
                      </>
                    )}
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
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-[10px] border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-[10px] border border-gray-200">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-[10px] transition-all ${
              view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-[10px] transition-all ${
              view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-[10px] overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded-[10px] w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded-[10px] w-full"></div>
                <div className="h-3 bg-gray-100 rounded-[10px] w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Grid className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No courses found</p>
          <p className="text-sm text-gray-400">Try creating a new one or adjust your search.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course._id}
              className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {course.image ? (
                  <img src={IMAGE_URL + course.image} alt={course.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                   <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-[10px] text-xs font-bold shadow-sm text-gray-700 border border-black/5">
                     {course.level}
                   </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                 <h3 className="font-bold text-gray-900 mb-2 line-clamp-1" title={course.title}>{course.title}</h3>
                 <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                   {course.description}
                 </p>
                 
                 <div className="flex flex-wrap gap-2 mb-4">
                    {course.ageRange && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-[10px] border border-gray-100">
                            <Users className="w-3 h-3" /> {course.ageRange}
                        </div>
                    )}
                    {course.duration && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-[10px] border border-gray-100">
                            <Clock className="w-3 h-3" /> {course.duration}
                        </div>
                    )}
                    {course.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-[10px] border border-amber-100">
                            <Star className="w-3 h-3 fill-amber-600" /> {course.rating}
                        </div>
                    )}
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <BarChart className="w-3 h-3" />
                        {course.enrolled || "0"} Enrolled
                    </span>
                    <div className="flex gap-2">
                      <AdminButton onClick={() => handleEdit(course._id)} variant="ghost" className="p-2 rounded-[10px]">
                        <Pencil className="w-4 h-4" />
                      </AdminButton>
                      <AdminButton
                        onClick={() => handleDelete(course._id)}
                        variant="danger"
                        loading={removingId === course._id}
                        className="p-2 rounded-[10px]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </AdminButton>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
          {filteredCourses.map(course => (
            <div key={course._id} className="p-4 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50 transition-colors group">
              <div className="w-full md:w-24 h-24 shrink-0 bg-gray-100 rounded-[10px] overflow-hidden border border-gray-200">
                {course.image ? (
                  <img src={IMAGE_URL + course.image} alt={course.alt} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-[10px] border border-blue-100 font-medium">
                        {course.level}
                    </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1 mb-2">{course.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    {course.ageRange && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.ageRange}</span>}
                    {course.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>}
                    {course.enrolled && <span className="flex items-center gap-1"><BarChart className="w-3 h-3" /> {course.enrolled}</span>}
                </div>
              </div>
                <div className="flex gap-2 self-start md:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <AdminButton onClick={() => handleEdit(course._id)} variant="ghost" className="p-2 rounded-[10px]">
                    <Pencil className="w-4 h-4" />
                  </AdminButton>
                  <AdminButton
                    onClick={() => handleDelete(course._id)}
                    variant="danger"
                    loading={removingId === course._id}
                    className="p-2 rounded-[10px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </AdminButton>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}