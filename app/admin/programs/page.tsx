"use client"
import { useEffect, useState, useMemo } from "react";
import {
    PlusCircle,
    Pencil,
    Trash2,
    X,
    Layers,
    ImageIcon,
    Users,
    BookOpen,
    Trophy,
    Calendar,
    Search,
    Filter,
    Grid,
    List,
    ChevronDown,
    ChevronUp,
    Eye,
    Download,
    MoreVertical,
    Star,
    Clock,
    CheckCircle,
    AlertCircle,
    FileText,
    Shield,
    Target,
    Zap,
    TrendingUp,
    Sparkles,
    Edit3,
    Plus,
    Save,
    Send,
    Rocket,
    Upload,
    Cpu,
    Palette,
    Database,
    Wifi,
    Globe,
    Code,
    Bot,
    Brain,
    Satellite,
    Atom,
    Microscope,
    Icon
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { apiUrl } from "@/lib/constants";
import { motion, AnimatePresence, Variants } from "framer-motion";

const ICONS = [
    // Academic & Engagement
    { value: "Users", icon: Users, color: "#3b82f6" },       // Blue
    { value: "BookOpen", icon: BookOpen, color: "#10b981" }, // Emerald
    { value: "Trophy", icon: Trophy, color: "#f59e0b" },     // Amber
    { value: "Calendar", icon: Calendar, color: "#8b5cf6" }, // Purple
    { value: "Target", icon: Target, color: "#f43f5e" },     // Rose
    { value: "Zap", icon: Zap, color: "#eab308" },           // Yellow
    { value: "Shield", icon: Shield, color: "#6366f1" },     // Indigo
    { value: "TrendingUp", icon: TrendingUp, color: "#22c55e" }, // Green

    // Tech & Engineering (The New Additions)
    { value: "Cpu", icon: Cpu, color: "#475569" },           // Slate
    { value: "Rocket", icon: Rocket, color: "#f97316" },     // Orange
    { value: "Palette", icon: Palette, color: "#ec4899" },   // Pink (Design)
    { value: "Database", icon: Database, color: "#06b6d4" },  // Cyan (Data)
    { value: "Wifi", icon: Wifi, color: "#0ea5e9" },         // Sky (IoT)
    { value: "Globe", icon: Globe, color: "#14b8a6" },       // Teal (Networking)
    { value: "Code", icon: Code, color: "#6d28d9" },         // Deep Violet
    { value: "Bot", icon: Bot, color: "#4f46e5" },           // Royal Blue (Robotics)
    { value: "Brain", icon: Brain, color: "#d946ef" },       // Fuchsia (AI)
    { value: "Satellite", icon: Satellite, color: "#64748b" }, // Steel (Space)
    { value: "Atom", icon: Atom, color: "#2dd4bf" },         // Aquamarine (Physics)
    { value: "Microscope", icon: Microscope, color: "#84cc16" } // Lime (Bio-Tech)
];

export default function Programs() {
    const [programs, setPrograms] = useState<any>([]);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        type: "all",
        icon: "all",
        sortBy: "newest"
    });

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        description: "",
        features: "",         // Will be converted to array on submit
        icon: "Cpu",          // Defaulted to a STEM icon
        type: "main",
        status: "active",
        // New fields based on your program data
        durationWeeks: "",
        ageGroup: "",
        prerequisites: "",
        certification: "",
        equipment: "",        // Will be converted to array on submit
        learningOutcomes: ""  // Will be converted to array on submit
    });

    /* ---------------- FETCH ---------------- */
    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/programs");
            setPrograms(Array.isArray(res) ? res : []);
        } catch (error) {
            toast({ title: "Failed to fetch programs", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    /* ---------------- FILTERED PROGRAMS ---------------- */
    const filteredPrograms = useMemo(() => {
        return programs.filter((program: any) => {
            // Search filter
            const matchesSearch = searchQuery === "" ||
                program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                program.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                program.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());

            // Type filter
            const matchesType = filters.type === "all" || program.type === filters.type;

            // Icon filter
            const matchesIcon = filters.icon === "all" || program.icon === filters.icon;

            return matchesSearch && matchesType && matchesIcon;
        }).sort((a: any, b: any) => {
            // Sort filter
            switch (filters.sortBy) {
                case "newest":
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                case "oldest":
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                case "name":
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
    }, [programs, searchQuery, filters]);

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
        setIsFormExpanded(false);
        setForm({
            title: "",
            subtitle: "",
            description: "",
            features: "",         // Will be converted to array on submit
            icon: "Cpu",          // Defaulted to a STEM icon
            type: "main",
            status: "active",
            // New fields based on your program data
            durationWeeks: "",
            ageGroup: "",
            prerequisites: "",
            certification: "",
            equipment: "",        // Will be converted to array on submit
            learningOutcomes: ""  // Will be converted to array on submit
        });
    };

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async () => {
        // 1. Validations
        if (!form.title.trim())
            return toast({ title: "Program title is required", variant: "destructive" });

        if (!editingId && !imageFile)
            return toast({ title: "Program image is required", variant: "destructive" });

        // 2. Prepare FormData
        const formData = new FormData();

        // Basic Fields
        formData.append("title", form.title);
        formData.append("subtitle", form.subtitle);
        formData.append("description", form.description);
        formData.append("icon", form.icon);
        formData.append("type", form.type);
        formData.append("status", form.status);
        // formData.append("color", form.color || "#6366f1");

        // New STEM Technical Fields
        formData.append("durationWeeks", form.durationWeeks.toString());
        formData.append("ageGroup", form.ageGroup);
        formData.append("prerequisites", form.prerequisites);
        formData.append("certification", form.certification);

        // 3. Helper to Convert Comma Strings to JSON Arrays
        const formatToArray = (str: any) => {
            if (!str) return JSON.stringify([]);
            return JSON.stringify(
                str.split(",")
                    .map((item: any) => item.trim())
                    .filter(Boolean)
            );
        };

        formData.append("features", formatToArray(form.features));
        formData.append("equipment", formatToArray(form.equipment));
        formData.append("learningOutcomes", formatToArray(form.learningOutcomes));

        if (imageFile) {
            formData.append("image", imageFile);
        }

        // Add ID if editing
        if (editingId) {
            formData.append("id", editingId);
        }

        // 4. API Call
        try {
            const method = editingId ? "PUT" : "POST";
            // Note: Check if your apiFetch handles /programs/:id or just /programs
            // Based on your route.ts, PUT expects the ID inside the formData
            const url = "/programs";

            const result = await apiFetch(url, {
                method: method,
                data: formData,
            });

            if (editingId) {
                setPrograms(programs.map((p: any) => (p._id === editingId ? result : p)));
                toast({
                    title: "🎉 Program Updated",
                    description: `${form.title} has been updated successfully.`,
                    className: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                });
            } else {
                setPrograms([result, ...programs]);
                toast({
                    title: "✨ Program Created",
                    description: "New STEM track is now live.",
                    className: "bg-gradient-to-r from-primary to-primary/80 text-white"
                });
            }
            resetForm();
        } catch (err) {
            console.error("Submit Error:", err);
            toast({
                title: "Failed to save program",
                description: "Check your connection and try again.",
                variant: "destructive"
            });
        }
    };

    /* ---------------- EDIT ---------------- */
    const handleEdit = (program: any) => {
        setEditingId(program._id);
        setForm({
            title: program.title,
            subtitle: program.subtitle || "",
            description: program.description || "",
            features: program.features?.join(", ") || "",
            icon: program.icon,
            type: program.type,
            status: program.status || "active",
            // New fields based on your program data
            durationWeeks: program.durationWeeks || "",
            ageGroup: program.ageGroup || "",
            prerequisites: program.prerequisites || "",
            certification: program.certification || "",
            equipment: program.equipment?.join(", ") || "",        // Will be converted to array on submit
            learningOutcomes: program.learningOutcomes?.join(", ") || ""  // Will be converted to array on submit
        });

        setPreview((apiUrl.replace('/api', '') + program.image?.url) || null);
        setIsFormExpanded(true);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to delete this program? This action cannot be undone.")) return;
        try {
            await apiFetch(`/programs/${id}`, { method: "DELETE" });
            setPrograms(programs.filter((p: any) => p._id !== id));
            toast({
                title: "🗑️ Program Deleted",
                description: "Program removed successfully",
                className: "bg-gradient-to-r from-destructive/90 to-destructive text-white"
            });
        } catch (error) {
            toast({ title: "Failed to delete program", variant: "destructive" });
        }
    };

    /* ---------------- STATS ---------------- */
    const stats = useMemo(() => {
        const total = programs.length;
        const active = programs.filter((p: any) => p.status === "active").length;
        const main = programs.filter((p: any) => p.type === "main").length;
        const additional = programs.filter((p: any) => p.type === "additional").length;

        return { total, active, main, additional };
    }, [programs]);

    return (
        <div className="min-h-screen"
            style={{ '--bg-color': 'hsl(var(--background))' } as React.CSSProperties}>
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

                {/* HEADER SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{
                                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                                } as React.CSSProperties}>
                                <Layers className="w-6 h-6"
                                    style={{ color: 'hsl(var(--primary))' } as React.CSSProperties} />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight"
                                    style={{ color: 'hsl(var(--foreground))' } as React.CSSProperties}>
                                    Programs Management
                                </h1>
                                <p className="text-sm"
                                    style={{ color: 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                                    Manage and organize your STEM programs
                                </p>
                            </div>
                        </div>

                        {/* STATS CARDS */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <div className="px-4 py-3 rounded-xl border backdrop-blur-sm"
                                style={{
                                    backgroundColor: 'hsl(var(--card) / 0.8)',
                                    borderColor: 'hsl(var(--border))',
                                } as React.CSSProperties}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                                        <FileText className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                                            {stats.total}
                                        </p>
                                        <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                                            Total Programs
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 py-3 rounded-xl border backdrop-blur-sm"
                                style={{
                                    backgroundColor: 'hsl(var(--card) / 0.8)',
                                    borderColor: 'hsl(var(--border))',
                                } as React.CSSProperties}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: 'hsl(var(--emerald) / 0.1)' }}>
                                        <CheckCircle className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                                            {stats.active}
                                        </p>
                                        <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                                            Active
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsFormExpanded(!isFormExpanded)}
                            className="px-5 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg"
                            style={{
                                backgroundColor: editingId ? 'hsl(var(--warning))' : 'hsl(var(--primary))',
                                color: 'hsl(var(--primary-foreground))',
                                boxShadow: '0 10px 25px hsl(var(--primary) / 0.2)',
                            } as React.CSSProperties}
                        >
                            {editingId ? (
                                <>
                                    <Pencil className="w-4 h-4" />
                                    Editing Program
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="w-4 h-4" />
                                    New Program
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* SEARCH AND FILTERS SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative"
                >
                    <div className="w-full mx-auto"
                        style={{ maxWidth: '90%' }}>
                        <div className="bg-gradient-to-r from-card to-card/95 rounded-2xl border shadow-xl p-4"
                            style={{
                                borderColor: 'hsl(var(--border) / 0.5)',
                                boxShadow: '0 20px 40px hsl(var(--primary) / 0.05)',
                            } as React.CSSProperties}>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                {/* SEARCH BAR */}
                                <div className="flex-1 relative w-full">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                                            style={{ color: 'hsl(var(--muted-foreground))' }} />
                                        <input
                                            type="text"
                                            placeholder="Search programs by title, description, or features..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                                            style={{
                                                backgroundColor: 'hsl(var(--background))',
                                                borderColor: 'hsl(var(--border))',
                                                color: 'hsl(var(--foreground))',
                                            } as React.CSSProperties}
                                        />
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex items-center gap-3">
                                    {/* FILTER BUTTON */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="px-4 py-3.5 rounded-xl border flex items-center gap-2 font-medium"
                                        style={{
                                            backgroundColor: showFilters ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--background))',
                                            borderColor: showFilters ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                            color: showFilters ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                                        } as React.CSSProperties}
                                    >
                                        <Filter className="w-4 h-4" />
                                        Filters
                                        {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </motion.button>

                                    {/* VIEW TOGGLE */}
                                    <div className="flex rounded-xl border overflow-hidden"
                                        style={{ borderColor: 'hsl(var(--border))' }}>
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`px-4 py-3 transition-all ${viewMode === "grid" ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`px-4 py-3 transition-all ${viewMode === "list" ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* RESULTS COUNT */}
                                    <div className="px-3 py-1.5 rounded-lg border"
                                        style={{
                                            backgroundColor: 'hsl(var(--muted))',
                                            borderColor: 'hsl(var(--border))',
                                        } as React.CSSProperties}>
                                        <span className="text-sm font-medium"
                                            style={{ color: 'hsl(var(--muted-foreground))' }}>
                                            {filteredPrograms.length} results
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* FILTER PANEL */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 pt-6 border-t"
                                        style={{ borderColor: 'hsl(var(--border))' }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* TYPE FILTER */}
                                            <div>
                                                <label className="text-sm font-medium mb-2 block"
                                                    style={{ color: 'hsl(var(--foreground))' }}>
                                                    Program Type
                                                </label>
                                                <div className="flex gap-2">
                                                    {["all", "main", "additional"].map((type) => (
                                                        <button
                                                            key={type}
                                                            onClick={() => setFilters({ ...filters, type })}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filters.type === type ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                                        >
                                                            {type === "all" ? "All Types" :
                                                                type === "main" ? "Main" : "Additional"}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ICON FILTER */}
                                            <div>
                                                <label className="text-sm font-medium mb-2 block"
                                                    style={{ color: 'hsl(var(--foreground))' }}>
                                                    Icon Filter
                                                </label>
                                                <select
                                                    value={filters.icon}
                                                    onChange={(e) => setFilters({ ...filters, icon: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border"
                                                    style={{
                                                        backgroundColor: 'hsl(var(--background))',
                                                        borderColor: 'hsl(var(--border))',
                                                        color: 'hsl(var(--foreground))',
                                                    }}
                                                >
                                                    <option value="all">All Icons</option>
                                                    {ICONS.map(icon => (
                                                        <option key={icon.value} value={icon.value}>
                                                            {icon.value}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* SORT FILTER */}
                                            <div>
                                                <label className="text-sm font-medium mb-2 block"
                                                    style={{ color: 'hsl(var(--foreground))' }}>
                                                    Sort By
                                                </label>
                                                <select
                                                    value={filters.sortBy}
                                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border"
                                                    style={{
                                                        backgroundColor: 'hsl(var(--background))',
                                                        borderColor: 'hsl(var(--border))',
                                                        color: 'hsl(var(--foreground))',
                                                    }}
                                                >
                                                    <option value="newest">Newest First</option>
                                                    <option value="oldest">Oldest First</option>
                                                    <option value="name">Name (A-Z)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* FORM SECTION (Collapsible) */}
                <AnimatePresence>
                    {(isFormExpanded || editingId) && (
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="w-full max-w-5xl mx-auto px-4 py-8"
                        >
                            <div
                                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-500"
                                style={{
                                    borderColor: editingId ? 'rgb(245 158 11 / 0.3)' : 'rgb(99 102 241 / 0.3)',
                                }}
                            >
                                {/* Header Section */}
                                <div className={`p-6 border-b flex items-center justify-between ${editingId ? 'bg-amber-50/50' : 'bg-indigo-50/50'}`}>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                            {editingId ? 'Modify STEM Track' : 'Launch New STEM Track'}
                                        </h2>
                                        <p className="text-sm text-slate-500 font-medium">Configure the engineering curriculum and requirements.</p>
                                    </div>
                                    <div className={`p-3 rounded-2xl shadow-sm ${editingId ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        {editingId ? <Edit3 className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
                                    </div>
                                </div>

                                {/* Form Body */}
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                                    {/* Left Column: Core Identity */}
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-2 block ml-1">Program Identity</label>
                                            <div className="space-y-4">
                                                <input name="title" value={form.title} onChange={handleChange}
                                                    placeholder="Program Title (e.g. Robotics Engineering)"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white font-semibold" />

                                                <input name="subtitle" value={form.subtitle} onChange={handleChange}
                                                    placeholder="Subtitle/Track Name"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white text-sm" />
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Curriculum Description</label>
                                            <textarea name="description" value={form.description} onChange={handleChange}
                                                placeholder="Detail the learning journey..."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white min-h-[140px] resize-none text-sm leading-relaxed" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="group">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Duration (Weeks)</label>
                                                <input type="number" name="durationWeeks" value={form.durationWeeks} onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white" />
                                            </div>
                                            <div className="group">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Target Age Group</label>
                                                <input name="ageGroup" value={form.ageGroup} onChange={handleChange} placeholder="e.g. Ages 14-18"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Media & Technical Specs */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Visual Representation</label>
                                            <label className="group relative border-2 border-dashed border-slate-200 rounded-3xl p-4 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center min-h-[220px] overflow-hidden bg-slate-50/50">
                                                {preview ? (
                                                    <>
                                                        <img src={preview} alt="preview" className="absolute inset-0 h-full w-full object-cover" />
                                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                            <div className="flex items-center gap-2 text-white font-bold bg-white/20 px-4 py-2 rounded-full border border-white/30">
                                                                <Upload className="w-4 h-4" /> Change Media
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="bg-white p-4 rounded-2xl shadow-sm mb-3 inline-block">
                                                            <Cpu className="w-8 h-8 text-indigo-500" />
                                                        </div>
                                                        <span className="block text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Upload Header Image</span>
                                                        <span className="text-[10px] text-slate-400 font-medium tracking-wide">Dimension: 1200x800px recommended</span>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                                            </label>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="group">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Required Prerequisites</label>
                                                <input name="prerequisites" value={form.prerequisites} onChange={handleChange}
                                                    placeholder="e.g. Basic Python knowledge"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white text-sm" />
                                            </div>

                                            <div className="group">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Certification Awarded</label>
                                                <input name="certification" value={form.certification} onChange={handleChange}
                                                    placeholder="e.g. Autodesk Certified User"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Width Technical Sections */}
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                        <div className="group">
                                            <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-2 block ml-1">Core Features (Comma Separated)</label>
                                            <textarea name="features" value={form.features} onChange={handleChange}
                                                placeholder="VEX Robotics, Arduino, 3D CAD..."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white text-sm min-h-[80px]" />
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-2 block ml-1">Equipment Provided</label>
                                            <textarea name="equipment" value={form.equipment} onChange={handleChange}
                                                placeholder="Laptops, 3D Printers, Sensors..."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white text-sm min-h-[80px]" />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="md:col-span-2 flex items-center justify-between pt-6 border-t border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <select name="icon" value={form.icon} onChange={handleChange} className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 outline-none">
                                                {ICONS.map((i: any) => {
                                                    const Icon = i.icon;

                                                    return <option key={i.value} value={i.value}>
                                                        <div>
                                                            <Icon className="w-6 h-6 text-primary" />{i.value} Icon
                                                        </div>
                                                    </option>
                                                })}
                                            </select>
                                            <select name="type" value={form.type} onChange={handleChange} className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 outline-none">
                                                <option value="main">Main Program</option>
                                                <option value="additional">Elective Track</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button type="button" onClick={() => { resetForm() }} className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors text-sm">
                                                Discard
                                            </button>
                                            <button type="submit" className={`px-10 py-3 rounded-xl font-black text-white shadow-xl transition-all active:scale-95 flex items-center gap-2 ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                                                }`}
                                                onClick={() => handleSubmit()}
                                            >
                                                {editingId ? <><Save className="w-4 h-4" /> Save Changes</> : <><Send className="w-4 h-4" /> Deploy Program</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* PROGRAMS DISPLAY */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full"
                        />
                    </div>
                ) : filteredPrograms.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 rounded-2xl border-2 border-dashed"
                        style={{
                            borderColor: 'hsl(var(--border))',
                            backgroundColor: 'hsl(var(--card))',
                        }}
                    >
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-50"
                            style={{ color: 'hsl(var(--muted-foreground))' }} />
                        <h4 className="text-xl font-semibold mb-2"
                            style={{ color: 'hsl(var(--foreground))' }}>
                            No programs found
                        </h4>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery ? "Try a different search term" : "Create your first program to get started"}
                        </p>
                        <button
                            onClick={() => setIsFormExpanded(true)}
                            className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto"
                            style={{
                                backgroundColor: 'hsl(var(--primary))',
                                color: 'hsl(var(--primary-foreground))',
                            }}
                        >
                            <PlusCircle className="w-4 h-4" />
                            Create Program
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full mx-auto"
                        style={{ maxWidth: '90%' }}
                    >
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPrograms.map((program: any, index: number) => (
                                    <ProgramCard
                                        key={program._id}
                                        program={program}
                                        index={index}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredPrograms.map((program: any, index: number) => (
                                    <ProgramRow
                                        key={program._id}
                                        program={program}
                                        index={index}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

/* ---------------- ANIMATION VARIANTS ---------------- */
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

/* ---------------- PROGRAM CARD COMPONENT ---------------- */
function ProgramCard({ program, index, onEdit, onDelete }: any) {
    const IconComponent = ICONS.find(i => i.value === program.icon)?.icon || Users;

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-card rounded-2xl border overflow-hidden group cursor-pointer"
            style={{
                borderColor: 'hsl(var(--border))',
                boxShadow: '0 10px 25px hsl(var(--primary) / 0.03)',
            }}
        >
            {/* IMAGE */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={apiUrl.replace('/api', '') + program.image?.url}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* BADGES */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${program.type === 'main' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {program.type === 'main' ? 'Main' : 'Additional'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-sm">
                        {program.status || 'Active'}
                    </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(program);
                        }}
                        className="p-2 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white"
                    >
                        <Pencil className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(program._id);
                        }}
                        className="p-2 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white"
                    >
                        <Trash2 className="w-4 h-4" style={{ color: 'hsl(var(--destructive))' }} />
                    </motion.button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                            <IconComponent className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg line-clamp-1"
                                style={{ color: 'hsl(var(--foreground))' }}>
                                {program.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {program.subtitle || 'STEM Program'}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {program.description}
                </p>

                {program.features?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {program.features.slice(0, 3).map((feature: string, idx: number) => (
                            <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded-lg"
                                style={{
                                    backgroundColor: 'hsl(var(--muted))',
                                    color: 'hsl(var(--muted-foreground))',
                                }}
                            >
                                {feature}
                            </span>
                        ))}
                        {program.features.length > 3 && (
                            <span className="text-xs px-2 py-1 rounded-lg text-muted-foreground">
                                +{program.features.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: 'hsl(var(--border))' }}>
                    <div className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Updated recently
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(program);
                        }}
                        className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

/* ---------------- PROGRAM ROW COMPONENT ---------------- */
function ProgramRow({ program, index, onEdit, onDelete }: any) {
    const IconComponent = ICONS.find(i => i.value === program.icon)?.icon || Users;

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            className="bg-card rounded-2xl border p-6 flex items-center gap-6 group"
            style={{
                borderColor: 'hsl(var(--border))',
                boxShadow: '0 5px 15px hsl(var(--primary) / 0.02)',
            }}
        >
            {/* IMAGE */}
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                    src={apiUrl.replace('/api', '') + program.image?.url}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                            <IconComponent className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg"
                                style={{ color: 'hsl(var(--foreground))' }}>
                                {program.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {program.subtitle || 'STEM Program'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${program.type === 'main' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {program.type === 'main' ? 'Main' : 'Additional'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                            {program.icon}
                        </span>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {program.description}
                </p>

                {program.features?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {program.features.slice(0, 4).map((feature: string, idx: number) => (
                            <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded-lg"
                                style={{
                                    backgroundColor: 'hsl(var(--muted))',
                                    color: 'hsl(var(--muted-foreground))',
                                }}
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(program)}
                    className="p-3 rounded-xl border hover:shadow-md transition-all"
                    style={{
                        backgroundColor: 'hsl(var(--primary) / 0.1)',
                        borderColor: 'hsl(var(--primary) / 0.2)',
                    }}
                >
                    <Pencil className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(program._id)}
                    className="p-3 rounded-xl border hover:shadow-md transition-all"
                    style={{
                        backgroundColor: 'hsl(var(--destructive) / 0.1)',
                        borderColor: 'hsl(var(--destructive) / 0.2)',
                    }}
                >
                    <Trash2 className="w-4 h-4" style={{ color: 'hsl(var(--destructive))' }} />
                </motion.button>
                <button className="p-3 rounded-xl border hover:bg-muted transition-colors"
                    style={{ borderColor: 'hsl(var(--border))' }}>
                    <MoreVertical className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                </button>
            </div>
        </motion.div>
    );
}