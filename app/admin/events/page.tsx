"use client";

import { useState, useEffect, useMemo, ChangeEvent } from "react";
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
  Calendar,
  Palette,
  Users,
  LayoutTemplate
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import AdminButton from "@/components/admin/AdminButton";

interface EventFormState {
  _id?: string;
  title: string;
  subtitle: string;
  category: string;
  thumbnail: string;
  logo: File | null;
  color: string;
  bgGradient: string;
  count: string;
}

interface Event {
  _id: string;
  title: string;
  subtitle: string;
  category: string;
  thumbnail: string;
  logo: string;
  color: string;
  bgGradient: string;
  count: string;
}

export default function CreateEventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormState>({
    title: "",
    subtitle: "",
    category: "",
    thumbnail: "",
    color: "#f97316",
    bgGradient: "from-orange-500/20 via-orange-100/50 to-white",
    count: "0",
    logo: null,
  });

  /* ---------------- FETCH ---------------- */
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/events");
      setEvents(data);
    } catch (error) {
      toast({ title: "Failed to load events", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        event.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Image too large (max 5MB)", variant: "destructive" });
        return;
      }
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      title: "",
      subtitle: "",
      category: "",
      thumbnail: "",
      color: "#f97316",
      bgGradient: "from-orange-500/20 via-orange-100/50 to-white",
      count: "0",
      logo: null,
    });
    setPreview(null);
  };

  const handleEdit = (event: Event) => {
    setFormData({
      _id: event._id,
      title: event.title,
      subtitle: event.subtitle,
      category: event.category,
      thumbnail: event.thumbnail,
      logo: null, 
      color: event.color,
      bgGradient: event.bgGradient,
      count: event.count,
    });
    setPreview(event.logo ? IMAGE_URL + event.logo : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setRemovingId(id);
    try {
      await apiFetch(`/events`, { method: "DELETE", data: { id } });
      setEvents(events.filter((e) => e._id !== id));
      toast({ title: "Event deleted successfully" });
    } catch {
      toast({ title: "Failed to delete event", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.subtitle || !formData.category) {
      return toast({ title: "Please fill all required fields", variant: "destructive" });
    }
    if (!formData._id && !formData.logo) {
      return toast({ title: "Event logo is required", variant: "destructive" });
    }

    setSubmitting(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && key !== "logo") form.append(key, value as string);
    });
    if (formData.logo) form.append("logo", formData.logo);
    if (formData._id) form.append("id", formData._id);

    try {
      if (formData._id) {
        await apiFetch(`/events`, { method: "PUT", data: form });
        toast({ title: "Event updated successfully" });
      } else {
        await apiFetch("/events", { method: "POST", data: form });
        toast({ title: "Event created successfully" });
      }
      handleCloseForm();
      fetchEvents();
    } catch {
      toast({ title: "Failed to save event", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage upcoming workshops, webinars, and events.
          </p>
        </div>
        <AdminButton
          onClick={() => setShowForm(true)}
          disabled={showForm}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Event
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
                  {formData._id ? <Pencil className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  {formData._id ? "Edit Event" : "Create New Event"}
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
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title</label>
                        <input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Summer Code Camp"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle / Description</label>
                        <textarea
                          name="subtitle"
                          value={formData.subtitle}
                          onChange={handleChange}
                          placeholder="Brief description of the event..."
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 h-20 resize-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                        <div className="relative">
                          <LayoutTemplate className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Workshop"
                            className="w-full pl-10 border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Attendees Count</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            name="count"
                            value={formData.count}
                            onChange={handleChange}
                            min={0}
                            className="w-full pl-10 border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Theme Color</label>
                        <div className="flex items-center gap-2">
                           <input
                              type="color"
                              name="color"
                              value={formData.color}
                              onChange={handleChange}
                              className="w-10 h-10 p-1 border border-gray-300 rounded-[10px] cursor-pointer"
                           />
                           <span className="text-sm text-gray-500 font-mono">{formData.color}</span>
                        </div>
                      </div>

                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1.5">Background Gradient (Tailwind)</label>
                         <div className="relative">
                            <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              name="bgGradient"
                              value={formData.bgGradient}
                              onChange={handleChange}
                              placeholder="e.g. from-blue-500 to-white"
                              className="w-full pl-10 border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            />
                         </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL (Optional External)</label>
                        <input
                           name="thumbnail"
                           value={formData.thumbnail}
                           onChange={handleChange}
                           placeholder="https://..."
                           className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Logo Upload - UPDATED FOR FULL WIDTH COVER */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Logo / Banner</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors h-64 md:h-full max-h-[400px] relative group overflow-hidden">
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                      
                      {preview ? (
                        <div className="w-full h-full relative">
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                              <Pencil className="w-4 h-4" /> Change Image
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 p-4">
                          <ImageIcon className="w-10 h-10 opacity-50" />
                          <span className="text-sm font-medium">Upload Banner</span>
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
                    {formData._id ? (
                      <><Save className="w-4 h-4 mr-2" /> Update Event</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" /> Create Event</>
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
            placeholder="Search events..."
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-white border border-gray-200 rounded-[10px] h-80 animate-pulse" />
           ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No events found</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW - UPDATED FOR FULL WIDTH COVER IMAGES
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const isDeleting = removingId === event._id;
            return (
              <div key={event._id} className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                {/* Image Section - Set to full width and cover */}
                <div className={`relative h-52 w-full bg-gray-100 overflow-hidden bg-gradient-to-br ${event.bgGradient || "from-gray-100 to-gray-200"}`}>
                  {event.logo ? (
                    <img 
                      src={IMAGE_URL + event.logo} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm text-gray-700 border border-black/5">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1" style={{ color: event.color }}>{event.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{event.subtitle}</p>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> {event.count} Attendees
                    </span>

                    {/* Circular Actions */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEdit(event)}
                        className="w-10 h-10 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(event._id)}
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
        // LIST VIEW - UPDATED FOR CONSISTENCY
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
          {filteredEvents.map((event) => {
             const isDeleting = removingId === event._id;
             return (
            <div key={event._id} className="p-4 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50 transition-colors group">
              <div className={`w-24 h-16 shrink-0 rounded-[8px] overflow-hidden flex items-center justify-center bg-gradient-to-br ${event.bgGradient || "from-gray-100 to-gray-200"}`}>
                 {event.logo ? (
                    <img src={IMAGE_URL + event.logo} alt={event.title} className="w-full h-full object-cover" />
                 ) : (
                    <Calendar className="w-6 h-6 text-gray-400" />
                 )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                   <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                   <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200 font-medium">
                      {event.category}
                   </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1 mb-2">{event.subtitle}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Users className="w-3 h-3" /> {event.count} Attendees
                </div>
              </div>

              <div className="flex gap-2 self-start md:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(event)}
                  className="w-10 h-10 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(event._id)}
                  disabled={isDeleting}
                  className="w-10 h-10 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 disabled:opacity-50"
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