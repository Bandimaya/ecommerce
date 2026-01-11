"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Globe,
  X,
  Building2,
  Search,
  Grid,
  List,
  Loader2,
  Tag,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type Brand = {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
};

const emptyForm = {
  title: "",
  subTitle: "",
  description: "",
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
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

  /* ---------------- FETCH ---------------- */
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/brands");
      // Handle potential data structure variations
      const data = Array.isArray(res) ? res : res.data || [];
      setBrands(data);
    } catch (error) {
      toast({ title: "Failed to load brands", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredBrands = useMemo(() => {
    return brands.filter(b => 
      b.title.toLowerCase().includes(search.toLowerCase()) || 
      b.subTitle?.toLowerCase().includes(search.toLowerCase())
    );
  }, [brands, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand._id);
    setForm({
      title: brand.title,
      subTitle: brand.subTitle || "",
      description: brand.description || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast({ title: "Brand title is required", variant: "destructive" });
    
    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await apiFetch(`/brands/${editingId}`, {
          method: "PUT",
          data: form,
        });
        setBrands(brands.map((b) => (b._id === editingId ? updated : b)));
        toast({ title: "Brand updated successfully" });
      } else {
        const newBrand = await apiFetch("/brands", {
          method: "POST",
          data: form,
        });
        setBrands([...brands, newBrand]);
        toast({ title: "Brand created successfully" });
      }
      handleCloseForm();
    } catch (error) {
      toast({ title: "Error saving brand", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    setRemovingId(id);
    try {
      await apiFetch(`/brands/${id}`, { method: "DELETE" });
      setBrands(brands.filter((b) => b._id !== id));
      toast({ title: "Brand deleted successfully" });
    } catch (err) {
      toast({ title: "Failed to delete brand", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Partners</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage manufacturer and designer relationships.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Brand
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
                  {editingId ? "Edit Brand" : "Create New Brand"}
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex flex-col gap-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Acme Corp"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slogan / Subtitle</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="subTitle"
                                    value={form.subTitle}
                                    onChange={handleChange}
                                    placeholder="e.g. Innovation First"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Brief history and values of the brand..."
                            className="w-full h-24 px-3 py-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="px-5 py-2.5">
                            Cancel
                        </AdminButton>
                        <AdminButton type="submit" loading={submitting} className="px-8 py-2.5">
                            {editingId ? "Update Brand" : "Save Brand"}
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
            placeholder="Search brands..."
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
            <div key={i} className="bg-white border border-gray-200 rounded-[10px] h-40 animate-pulse p-6 flex items-center gap-4">
               <div className="w-16 h-16 bg-gray-100 rounded-full" />
               <div className="flex-1 space-y-2">
                 <div className="h-4 bg-gray-100 rounded w-3/4" />
                 <div className="h-3 bg-gray-100 rounded w-1/2" />
               </div>
            </div>
          ))}
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No brands found</p>
          <p className="text-sm text-gray-400">Add brands to manage your catalog partners.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => {
            const isDeleting = removingId === brand._id;
            return (
              <div key={brand._id} className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 relative flex items-start gap-5">
                {/* Generated Avatar */}
                <div className="w-16 h-16 shrink-0 rounded-[12px] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl uppercase">
                    {brand.title.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{brand.title}</h3>
                    {brand.subTitle && (
                        <p className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded border border-blue-100 mb-2">
                            {brand.subTitle}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 line-clamp-2">
                        {brand.description || "No description provided."}
                    </p>
                </div>

                {/* Circular Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleEdit(brand)}
                        className="w-8 h-8 rounded-full border border-blue-100 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all shadow-sm hover:scale-110"
                        title="Edit"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => handleDelete(brand._id)}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-110 disabled:opacity-50"
                        title="Delete"
                    >
                        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
           {filteredBrands.map((brand) => {
              const isDeleting = removingId === brand._id;
              return (
                <div key={brand._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 shrink-0 rounded-[8px] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm uppercase">
                        {brand.title.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-sm">{brand.title}</h3>
                            {brand.subTitle && (
                                <span className="text-xs text-gray-400">• {brand.subTitle}</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{brand.description}</p>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(brand)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(brand._id)} disabled={isDeleting} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
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