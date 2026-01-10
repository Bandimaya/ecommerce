"use client";

import { IMAGE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import {
  Cpu,
  Code,
  Wifi,
  Zap,
  Cog,
  Brain,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  LayoutGrid,
  ImageIcon
} from "lucide-react";
import AdminButton from "@/components/admin/AdminButton";

// 1. Icon Mapping: Convert string names to actual React Components
const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Cpu,
  Code,
  Wifi,
  Zap,
  Cog,
  Brain,
};

const ICONS = Object.keys(ICON_COMPONENTS);

type JargonItem = {
  _id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  icon: string;
  color: string;
  accentColor: string;
};

const emptyForm = {
  title: "",
  description: "",
  alt: "",
  icon: "Cpu",
  color: "bg-blue-500",
  accentColor: "#3b82f6",
};

export default function JargonPage() {
  const [items, setItems] = useState<JargonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<JargonItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/jargon");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch jargon", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("image", file);

      const url = editing ? `/api/jargon/${editing._id}` : "/api/jargon";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });

      if (res.ok) {
        await fetchItems();
        handleCloseForm();
      }
    } catch (error) {
      console.error("Error saving jargon", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setRemovingId(id);
    try {
      await fetch(`/api/jargon/${id}`, { method: "DELETE" });
      await fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleEdit = (item: JargonItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      alt: item.alt,
      icon: item.icon,
      color: item.color,
      accentColor: item.accentColor,
    });
    setFile(null);
    setIsFormOpen(true);
    // Smooth scroll to top to see the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
  };

  // Helper to render the currently selected icon in the form
  const SelectedIcon = ICON_COMPONENTS[form.icon] || Cpu;

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jargon Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the technical terms and feature cards displayed on the site.
          </p>
        </div>
        <AdminButton onClick={() => setIsFormOpen(true)} disabled={isFormOpen} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Term
        </AdminButton>
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <div className="bg-white rounded-[10px] shadow-md border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              {editing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editing ? "Edit Jargon Item" : "Create New Jargon"}
            </h2>
            <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-[10px] transition-colors">
              <X className="w-5 h-5" />
            </AdminButton>
          </div>

          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Text Inputs */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  placeholder="e.g. Artificial Intelligence"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  placeholder="Brief explanation of the term..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Alt Text
                </label>
                <input
                  value={form.alt}
                  onChange={(e) => setForm({ ...form, alt: e.target.value })}
                  className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  placeholder="Accessibility text for the image"
                  required
                />
              </div>
            </div>

            {/* Right Column: Visuals */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Icon
                  </label>
                  <div className="relative">
                    <select
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="w-full border border-gray-300 rounded-[10px] pl-3 pr-10 py-2.5 appearance-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm bg-white"
                    >
                      {ICONS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                      <SelectedIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tailwind Color
                  </label>
                  <input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                    placeholder="e.g. bg-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Accent Hex Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) =>
                      setForm({ ...form, accentColor: e.target.value })
                    }
                    className="h-11 w-14 rounded-[10px] border border-gray-300 p-1 cursor-pointer shadow-sm"
                  />
                  <input
                    value={form.accentColor}
                    onChange={(e) =>
                      setForm({ ...form, accentColor: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-[10px] px-3 py-2.5 font-mono uppercase focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Image Upload
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-[10px] p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-700 transition-colors">
                    {file ? (
                      <>
                        <ImageIcon className="w-8 h-8 mb-2 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600">
                          {file.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <LayoutGrid className="w-8 h-8 mb-2 text-gray-400" />
                        <span className="text-sm">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 5MB
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <AdminButton variant="ghost" type="button" onClick={handleCloseForm} className="px-5 py-2.5">
                Cancel
              </AdminButton>
              <AdminButton type="submit" loading={submitting} className="px-8 py-2.5">
                {editing ? "Update Item" : "Save Item"}
              </AdminButton>
            </div>
          </form>
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white p-4 rounded-[10px] shadow-sm border border-gray-200 h-72 flex flex-col animate-pulse"
            >
              <div className="h-40 bg-gray-100 rounded-[10px] mb-4 w-full"></div>
              <div className="h-6 bg-gray-100 rounded-[10px] w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded-[10px] w-full mb-1"></div>
              <div className="h-4 bg-gray-100 rounded-[10px] w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        // Actual Content Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const ItemIcon = ICON_COMPONENTS[item.icon] || Cpu;
            return (
              <div
                key={item._id}
                className="group bg-white rounded-[10px] shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={IMAGE_URL + item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                      <LayoutGrid className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  {/* Floating Icon */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-[10px] shadow-sm border border-black/5">
                    <ItemIcon
                      className="w-5 h-5"
                      style={{ color: item.accentColor }}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xs font-mono font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-[10px] border border-gray-100">
                      {item.icon}
                    </span>
                    <div className="flex gap-2">
                      <AdminButton variant="ghost" onClick={() => handleEdit(item)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-[10px] transition-colors" title="Edit Term">
                        <Pencil className="w-4 h-4" />
                      </AdminButton>
                      <AdminButton variant="danger" loading={removingId === item._id} onClick={() => handleDelete(item._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-[10px] transition-colors" title="Delete Term">
                        <Trash2 className="w-4 h-4" />
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