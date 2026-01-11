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
  Layers,
  CornerDownRight,
  FolderTree,
  Type,
  AlignLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type Category = {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  parentCategory: string | null;
};

const emptyForm = {
  title: "",
  subTitle: "",
  description: "",
  parentCategory: "",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "tree">("tree"); // Default to tree for hierarchy
  const [search, setSearch] = useState("");

  // Form State
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/categories");
      // Ensure we handle different API response structures if needed
      const data = Array.isArray(res) ? res : res.data || [];
      setCategories(data);
    } catch (error) {
      toast({ title: "Failed to load categories", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- FILTER ---------------- */
  // For Grid View: Flat filter
  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.subTitle?.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (c: Category) => {
    setEditingId(c._id);
    setForm({
      title: c.title,
      subTitle: c.subTitle || "",
      description: c.description || "",
      parentCategory: c.parentCategory || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast({ title: "Title is required", variant: "destructive" });

    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await apiFetch(`/categories/${editingId}`, {
          method: "PUT",
          data: form,
        });
        setCategories(categories.map((c) => (c._id === editingId ? updated : c)));
        toast({ title: "Category updated successfully" });
      } else {
        const newCat = await apiFetch("/categories", {
          method: "POST",
          data: form,
        });
        setCategories([...categories, newCat]);
        toast({ title: "Category created successfully" });
      }
      handleCloseForm();
    } catch (error) {
      toast({ title: "Error saving category", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? This might affect products linked to it.")) return;
    setRemovingId(id);
    try {
      await apiFetch(`/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter((c) => c._id !== id));
      toast({ title: "Category deleted successfully" });
    } catch (err) {
      toast({ title: "Failed to delete category", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  // Helper to find parent name for Grid View
  const getParentName = (parentId: string | null) => {
    if (!parentId) return null;
    return categories.find(c => c._id === parentId)?.title;
  };

  // Recursive Tree Renderer
  const renderCategoryTree = (parentId = "", depth = 0) => {
    const children = categories.filter((c) => (c.parentCategory || "") === parentId);
    
    if (children.length === 0) return null;

    return children.map((c) => {
        const isDeleting = removingId === c._id;
        return (
            <div key={c._id}>
                <div 
                    className={`group flex items-center justify-between p-4 mb-3 bg-white border border-gray-200 rounded-[10px] shadow-sm hover:shadow-md transition-all ${
                        depth > 0 ? "ml-8 border-l-4 border-l-blue-100" : ""
                    }`}
                >
                    <div className="flex items-center gap-4">
                        {depth > 0 ? (
                            <CornerDownRight className="w-5 h-5 text-gray-300" />
                        ) : (
                            <div className="p-2 bg-blue-50 rounded-[8px] text-blue-600 border border-blue-100">
                                <Layers className="w-5 h-5" />
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                {c.title}
                                {depth === 0 && (
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-[6px] uppercase font-medium tracking-wider border border-gray-200">
                                        Parent
                                    </span>
                                )}
                            </h4>
                            {(c.subTitle || c.description) && (
                                <p className="text-sm text-gray-500 line-clamp-1">
                                    {c.subTitle || c.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleEdit(c)} 
                            className="w-8 h-8 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all shadow-sm hover:scale-110"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                            onClick={() => handleDelete(c._id)} 
                            disabled={isDeleting}
                            className="w-8 h-8 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-110 disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
                {renderCategoryTree(c._id, depth + 1)}
            </div>
        );
    });
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize products into hierarchical groups and collections.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Category
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
                  {editingId ? "Edit Category" : "Create New Category"}
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex flex-col gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                                <Type className="w-3.5 h-3.5" /> Title
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Electronics"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Subtitle Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                                <AlignLeft className="w-3.5 h-3.5" /> Subtitle
                            </label>
                            <input
                                name="subTitle"
                                value={form.subTitle}
                                onChange={handleChange}
                                placeholder="e.g. Gadgets & Devices"
                                className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            />
                        </div>

                        {/* Parent Category Select */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                                <FolderTree className="w-3.5 h-3.5" /> Parent Category
                            </label>
                            <div className="relative">
                                <select
                                    name="parentCategory"
                                    value={form.parentCategory}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-[10px] pl-3 pr-10 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm appearance-none"
                                >
                                    <option value="">None (Top Level Category)</option>
                                    {categories
                                        .filter(c => c._id !== editingId)
                                        .map(c => (
                                            <option key={c._id} value={c._id}>{c.title}</option>
                                        ))
                                    }
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <CornerDownRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Detailed description of the category..."
                                className="w-full h-24 border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="px-5 py-2.5">
                            Cancel
                        </AdminButton>
                        <AdminButton type="submit" loading={submitting} className="px-8 py-2.5">
                            {editingId ? "Update Category" : "Save Category"}
                        </AdminButton>
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
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-[10px] border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-[10px] border border-gray-200">
          <AdminButton variant="ghost" onClick={() => setView("grid")} className={`p-2 rounded-[10px] transition-all ${
              view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`} title="Grid View (Flat)">
            <Grid className="w-4 h-4" />
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => setView("tree")} className={`p-2 rounded-[10px] transition-all ${
              view === "tree" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`} title="Tree View (Hierarchy)">
            <FolderTree className="w-4 h-4" />
          </AdminButton>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-[10px] h-20 animate-pulse" />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Layers className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No categories found</p>
          <p className="text-sm text-gray-400">Add categories to organize products.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW (FLAT)
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((c) => {
            const isDeleting = removingId === c._id;
            const parentName = getParentName(c.parentCategory);
            return (
              <div key={c._id} className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6 relative">
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-blue-50 rounded-[8px] text-blue-600 border border-blue-100">
                            <Layers className="w-5 h-5" />
                        </div>
                        {parentName && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-[6px] border border-gray-200 max-w-[100px] truncate">
                                in {parentName}
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{c.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5em]">{c.description || c.subTitle || "No description provided."}</p>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-gray-50">
                    <button 
                        onClick={() => handleEdit(c)}
                        className="w-8 h-8 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all shadow-sm hover:scale-110"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => handleDelete(c._id)}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-110 disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // TREE VIEW (HIERARCHICAL)
        <div className="space-y-1">
           {/* If searching, switch to flat list for clarity, else recursive tree */}
           {search ? (
               <div className="text-sm text-gray-500 mb-4 italic">Showing search results (hierarchy hidden):</div>
           ) : null}
           
           {search 
             ? filteredCategories.map(c => { // Flat list for search
                 const isDeleting = removingId === c._id;
                 return (
                    <div key={c._id} className="group flex items-center justify-between p-4 mb-3 bg-white border border-gray-200 rounded-[10px] shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-50 rounded-[8px] text-gray-600">
                                <Search className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{c.title}</h4>
                                <p className="text-sm text-gray-500">{c.subTitle}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(c)} className="w-8 h-8 rounded-full border border-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(c._id)} disabled={isDeleting} className="w-8 h-8 rounded-full border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50">
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                 )
             })
             : renderCategoryTree() // Recursive tree for normal view
           }
        </div>
      )}
    </div>
  );
}