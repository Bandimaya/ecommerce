"use client";

import { useState, useEffect, useMemo } from "react";
import { PlusCircle, Pencil, Trash2, Search, Grid, List, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/axios"; // Custom axios hook
import { toast } from "@/hooks/use-toast"; // Custom toast hook
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from "@/components/ui/skeleton";

interface Section {
    _id: string;
    label: string;
    icon: string;
    description: string;
    slug: string;
}

export default function SectionsPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [form, setForm] = useState({
        label: "",
        description: ""
    });

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
    const handleChange = (e: any) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const resetForm = () => {
        setEditingId(null);
        setShowForm(false);
        setForm({ label: "", description: "" });
    };

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async () => {
        if (!form.label.trim()) return toast({ title: "Label is required", variant: "destructive" });

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        if (imageFile) data.append("icon", imageFile);
        if (editingId) data.append("id", editingId);

        try {
            let res;
            if (editingId) {
                data.append("id", editingId);
                res = await apiFetch(`/sections`, { method: "PUT", data });
            } else {
                res = await apiFetch("/sections", { method: "POST", data });
            }

            if (editingId) {
                setSections(sections.map(s => (s._id === editingId ? res : s)));
                toast({ title: "Section updated" });
            } else {
                setSections([res, ...sections]);
                toast({ title: "Section created" });
            }
            resetForm();
        } catch {
            toast({ title: "Failed to save section", variant: "destructive" });
        }
    };

    console.log("sections", sections);

    /* ---------------- EDIT ---------------- */
    const handleEdit = (item: Section) => {
        setEditingId(item._id);
        setPreview(item.icon);
        setShowForm(true);
        setForm({ label: item.label, description: item.description });
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this section?")) return;
        try {
            await apiFetch(`/sections/${id}`, { method: "DELETE" });
            setSections(sections.filter(s => s._id !== id));
            toast({ title: "Section deleted" });
        } catch {
            toast({ title: "Delete failed", variant: "destructive" });
        }
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Image too large (max 5MB)", variant: "destructive" });
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Section Management</h1>
                    <p className="text-muted-foreground">Manage different sections for courses</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-5 py-3 rounded-xl bg-primary text-primary-foreground flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    New Section
                </button>
            </div>

            {/* SEARCH + VIEW */}
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        placeholder="Search sections..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    />
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                    <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" && "bg-muted"}`}>
                        <Grid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setView("list")} className={`p-2 ${view === "list" && "bg-muted"}`}>
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* FORM */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-card p-6 rounded-2xl border space-y-4"
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <input name="label" value={form.label} onChange={handleChange} placeholder="Label" className="input" />
                        </div>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="input min-h-[120px]"
                        />

                        <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer">
                            {preview ? (
                                <img src={preview} className="h-40 object-cover rounded-lg" />
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <span>Upload image</span>
                                </>
                            )}
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </label>

                        <div className="flex justify-end gap-3">
                            <button onClick={resetForm} className="px-4 py-2 rounded-lg border">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-primary text-white">
                                {editingId ? "Update" : "Create"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SECTION LIST */}
            {loading ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div key={i} className="border rounded-xl overflow-hidden group p-4">
                            <div className="flex items-center gap-4">
                                <SkeletonAvatar />
                                <div className="flex-1 space-y-2">
                                    <SkeletonText className="w-3/4" />
                                    <SkeletonText className="w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : view === "grid" ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {filteredSections.map(section => (
                        <div key={section._id} className="border rounded-xl overflow-hidden group">
                            <div className="p-4">
                                <h3 className="font-bold">{section.label}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{section.description}</p>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button onClick={() => handleEdit(section)}><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(section._id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSections.map(section => (
                        <div key={section._id} className="border rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{section.label}</h3>
                                <p className="text-sm text-muted-foreground">{section.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(section)}><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(section._id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
