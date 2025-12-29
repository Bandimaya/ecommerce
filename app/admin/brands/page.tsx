"use client"
import { useEffect, useState } from "react";
import {
    Tag,
    Plus,
    Pencil,
    Trash2,
    Globe,
    Info,
    X,
    CheckCircle2,
    Building2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";


export default function Brands() {
    const [brands, setBrands] = useState<any>([]);
    const [form, setForm] = useState({
        title: "",
        subTitle: "",
        description: "",
    });
    const [editingId, setEditingId] = useState(null);

    const fetchBrands = async () => {
        const res = await apiFetch("/brands");
        // Handling potential data structure differences
        setBrands(Array.isArray(res) ? res : res.data || []);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) return toast({ title: "Brand title is required" });

        try {
            if (editingId) {
                const updated = await apiFetch(`/brands/${editingId}`, {
                    method: "PUT",
                    data: form,
                });
                setBrands(brands.map((b: any) => (b._id === editingId ? updated : b)));
                setEditingId(null);
            } else {
                const newBrand = await apiFetch("/brands", {
                    method: "POST",
                    data: form,
                });
                setBrands([...brands, newBrand]);
            }
            setForm({ title: "", subTitle: "", description: "" });
        } catch (error) {
            toast({
                title: "Error saving brand!"
            })
        }
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to delete this brand? Products linked to it will remain but won't have a brand reference.")) return;
        await apiFetch(`/brands/${id}`, { method: "DELETE" });
        setBrands(brands.filter((b: any) => b._id !== id));
    };

    const handleEdit = (brand: any) => {
        setEditingId(brand._id);
        setForm({
            title: brand.title,
            subTitle: brand.subTitle || "",
            description: brand.description || "",
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            
            <div className="max-w-5xl mx-auto">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                            <Building2 className="w-8 h-8 text-primary" />
                            Brand Partners
                        </h1>
                        <p className="text-muted-foreground font-medium">Manage your manufacturer and designer relationships.</p>
                    </div>
                    <div className="bg-card px-4 py-2 rounded-full border shadow-sm text-sm font-bold text-muted-foreground">
                        {brands.length} active brands
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Side: Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-3xl shadow-xl shadow-black/5 border overflow-hidden sticky top-8">
                            <div className={`p-6 border-b ${editingId ? 'bg-warning/10 border-warning/20' : 'bg-primary/10 border-primary/20'}`}>
                                <h3 className={`font-bold flex items-center gap-2 ${editingId ? 'text-warning-dark' : 'text-primary'}`}>
                                    {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    {editingId ? "Update Brand" : "Create New Brand"}
                                </h3>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Brand Name</label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Nike, Apple, Sony"
                                        className="w-full bg-muted border-transparent border focus:bg-background focus:border-primary rounded-2xl px-4 py-3 outline-none transition-all font-semibold text-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Slogan / Subtitle</label>
                                    <input
                                        name="subTitle"
                                        value={form.subTitle}
                                        onChange={handleChange}
                                        placeholder="Just Do It"
                                        className="w-full bg-muted border-transparent border focus:bg-background focus:border-primary rounded-2xl px-4 py-3 outline-none transition-all text-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">About the Brand</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="History and values..."
                                        className="w-full bg-muted border-transparent border focus:bg-background focus:border-primary rounded-2xl px-4 py-3 outline-none transition-all resize-none text-foreground"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleSubmit}
                                        className={`flex-1 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${editingId ? 'bg-warning hover:bg-warning/90 shadow-warning/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
                                    >
                                        {editingId ? "Save Changes" : "Confirm & Add"}
                                    </button>
                                    {editingId && (
                                        <button
                                            onClick={() => { setEditingId(null); setForm({ title: "", subTitle: "", description: "" }); }}
                                            className="bg-muted p-4 rounded-2xl text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: List */}
                    <div className="lg:col-span-2">
                        {brands.length === 0 ? (
                            <div className="bg-card border-2 border-dashed rounded-3xl py-20 flex flex-col items-center">
                                <Building2 className="w-16 h-16 text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground font-bold">No brands in your registry yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {brands.map((brand: any) => (
                                    <div key={brand._id} className="group bg-card p-5 rounded-3xl border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            {/* Dummy Logo Circle */}
                                            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-primary font-black text-xl border uppercase">
                                                {brand.title.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-foreground tracking-tight">{brand.title}</h4>
                                                {brand.subTitle && <p className="text-primary text-xs font-black uppercase tracking-tighter mb-1">{brand.subTitle}</p>}
                                                {brand.description && <p className="text-muted-foreground text-sm line-clamp-1 max-w-sm">{brand.description}</p>}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleEdit(brand)}
                                                className="p-3 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(brand._id)}
                                                className="p-3 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
