"use client"
import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    ChevronRight,
    Layers,
    Type,
    AlignLeft,
    CornerDownRight,
    X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";

export default function Categories() {
    const [categories, setCategories] = useState<any>([]);
    const [form, setForm] = useState({
        title: "",
        subTitle: "",
        description: "",
        parentCategory: "",
    });
    const [editingId, setEditingId] = useState(null);

    const fetchCategories = async () => {
        const res = await apiFetch("/categories");
        setCategories(res);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) return toast({ title: "Title is required" });

        try {
            if (editingId) {
                const updated = await apiFetch(`/categories/${editingId}`, {
                    method: "PUT",
                    data: form,
                });
                setCategories(categories.map((c: any) => (c._id === editingId ? updated : c)));
                setEditingId(null);
            } else {
                const newCat = await apiFetch("/categories", {
                    method: "POST",
                    data: form,
                });
                setCategories([...categories, newCat]);
            }
            setForm({ title: "", subTitle: "", description: "", parentCategory: "" });
        } catch (error) {
            toast({ title: "An error occurred. Please try again." });
        }
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Delete this category? This might affect products linked to it.")) return;
        await apiFetch(`/categories/${id}`, { method: "DELETE" });
        setCategories(categories.filter((c: any) => c._id !== id));
    };

    const handleEdit = (c: any) => {
        setEditingId(c._id);
        setForm({
            title: c.title,
            subTitle: c.subTitle || "",
            description: c.description || "",
            parentCategory: c.parentCategory || "",
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Helper to organize categories visually (Parent -> Children)
    const renderCategoryRows = (parentId = "", depth = 0) => {
        return categories
            .filter((c: any) => (c.parentCategory || "") === parentId)
            .map((c: any) => (
                <div key={c._id}>
                    <div className={`group flex items-center justify-between p-4 mb-2 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all ${depth > 0 ? 'ml-8 border-l-4 border-l-blue-400' : 'shadow-sm'}`}>
                        <div className="flex items-center gap-3">
                            {depth > 0 ? (
                                <CornerDownRight className="w-5 h-5 text-gray-400" />
                            ) : (
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <Layers className="w-5 h-5" />
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                    {c.title}
                                    {depth === 0 && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Parent</span>}
                                </h4>
                                {c.subTitle && <p className="text-sm text-gray-500 font-medium">{c.subTitle}</p>}
                                {c.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{c.description}</p>}
                            </div>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(c)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(c._id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    {renderCategoryRows(c._id, depth + 1)}
                </div>
            ));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Categories</h1>
                        <p className="text-gray-500 mt-1">Organize your store hierarchy efficiently.</p>
                    </div>
                </header>

                {/* Form Section */}
                <div className="bg-white shadow-xl shadow-blue-900/5 rounded-2xl border border-gray-100 overflow-hidden mb-10">
                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            {editingId ? <Pencil className="w-5 h-5 text-orange-500" /> : <Plus className="w-5 h-5 text-green-500" />}
                            <h3 className="font-bold text-gray-700">{editingId ? "Modify Category" : "Create New Category"}</h3>
                        </div>
                        {editingId && (
                            <button
                                onClick={() => { setEditingId(null); setForm({ title: "", subTitle: "", description: "", parentCategory: "" }); }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                    <Type className="w-3 h-3" /> Title
                                </label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Electronics, Fashion..."
                                    className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                    <AlignLeft className="w-3 h-3" /> Subtitle
                                </label>
                                <input
                                    name="subTitle"
                                    value={form.subTitle}
                                    onChange={handleChange}
                                    placeholder="Short summary"
                                    className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                    <Layers className="w-3 h-3" /> Parent Category
                                </label>
                                <select
                                    name="parentCategory"
                                    value={form.parentCategory}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                                >
                                    <option value="">None (Top Level Category)</option>
                                    {categories
                                        .filter((c: any) => c._id !== editingId)
                                        .map((c: any) => (
                                            <option key={c._id} value={c._id}>{c.title}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    // rows="2"
                                    placeholder="Describe the category content..."
                                    className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 ${editingId ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                            >
                                {editingId ? <ChevronRight className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {editingId ? "Update Category" : "Save Category"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-widest">Existing Categories</h3>
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{categories.length} Total</span>
                    </div>

                    {categories.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <Layers className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 font-medium">No categories found yet.</p>
                        </div>
                    ) : (
                        renderCategoryRows()
                    )}
                </div>
            </div>
        </div>
    );
}