"use client";

import { useEffect, useState, useMemo } from "react";
import {
    PlusCircle,
    Pencil,
    Trash2,
    Search,
    Grid,
    List,
    Image as ImageIcon,
    Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

interface Jargon {
    _id: string;
    title: string;
    description: string;
    image: string;
    alt: string;
    color: string;
    accentColor: string;
}

export default function JargonPage() {
    const [items, setItems] = useState<Jargon[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        alt: "",
        color: "bg-blue-500",
        accentColor: "#3b82f6"
    });

    /* ---------------- FETCH ---------------- */
    const fetchJargons = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/jargon");
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch {
            toast({ title: "Failed to load jargon", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJargons();
    }, []);

    /* ---------------- FILTER ---------------- */
    const filtered = useMemo(() => {
        return items.filter(j =>
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.description.toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search]);

    /* ---------------- HANDLERS ---------------- */
    const handleChange = (e: any) =>
        setForm({ ...form, [e.target.name]: e.target.value });

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

    const resetForm = () => {
        setEditingId(null);
        setImageFile(null);
        setPreview(null);
        setShowForm(false);
        setForm({
            title: "",
            description: "",
            alt: "",
            color: "bg-blue-500",
            accentColor: "#3b82f6"
        });
    };

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async () => {
        if (!form.title.trim())
            return toast({ title: "Title is required", variant: "destructive" });

        if (!editingId && !imageFile)
            return toast({ title: "Image is required", variant: "destructive" });

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        if (imageFile) data.append("image", imageFile);
        if (editingId) data.append("id", editingId);

        try {
            let res;
            if (editingId) {
                res = await apiFetch(`/jargon/${editingId}`, {
                    method: "PUT",
                    data
                });
            }
            else {
                res = await apiFetch("/jargon", {
                    method: "POST",
                    data
                });
            }

            if (editingId) {
                setItems(items.map(i => (i._id === editingId ? res.data : i)));
                toast({ title: "Jargon updated" });
            } else {
                setItems([res.data, ...items]);
                toast({ title: "Jargon created" });
            }
            resetForm();
        } catch {
            toast({ title: "Failed to save jargon", variant: "destructive" });
        }
    };

    /* ---------------- EDIT ---------------- */
    const handleEdit = (item: Jargon) => {
        setEditingId(item._id);
        setForm({
            title: item.title,
            description: item.description,
            alt: item.alt,
            color: item.color,
            accentColor: item.accentColor
        });
        setPreview(item.image);
        setShowForm(true);
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this jargon?")) return;
        try {
            await apiFetch(`/jargon/${id}`, { method: "DELETE" });
            setItems(items.filter(i => i._id !== id));
            toast({ title: "Jargon deleted" });
        } catch {
            toast({ title: "Delete failed", variant: "destructive" });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Jargon Management</h1>
                    <p className="text-muted-foreground">
                        Manage technical glossary items
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-5 py-3 rounded-xl bg-primary text-primary-foreground flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    New Jargon
                </button>
            </div>

            {/* SEARCH + VIEW */}
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        placeholder="Search jargon..."
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
                            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input" />
                            <input name="alt" value={form.alt} onChange={handleChange} placeholder="Image Alt Text" className="input" />
                        </div>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="input min-h-[120px]"
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                            <input name="color" value={form.color} onChange={handleChange} placeholder="Tailwind color class" className="input" />
                            <input name="accentColor" value={form.accentColor} onChange={handleChange} placeholder="Accent hex color" className="input" />
                        </div>

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

            {/* LIST */}
            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : view === "grid" ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {filtered.map(item => (
                        <div key={item._id} className="border rounded-xl overflow-hidden group">
                            <img src={item.image} alt={item.alt} className="h-40 w-full object-cover" />
                            <div className="p-4">
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(item._id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(item => (
                        <div key={item._id} className="border rounded-xl p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
                                <div>
                                    <h3 className="font-bold">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(item._id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
