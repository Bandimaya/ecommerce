"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Trash2,
  Upload,
  Plus,
  CalendarDays,
  Newspaper,
  X,
  ImageIcon,
  Search,
  Grid,
  List
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type NewsItem = {
  _id: string;
  image: string;
  text: string;
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  // Form Data
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ===== FETCH ===== */
  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/news");
      setNews(data);
    } catch (error) {
      toast({ title: "Failed to load news", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* ===== FILTER ===== */
  const filteredNews = useMemo(() => {
    return news.filter(item =>
      item.text.toLowerCase().includes(search.toLowerCase())
    );
  }, [news, search]);

  /* ===== HANDLERS ===== */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (!input.files || input.files.length === 0) return;

    const f = input.files[0];
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large (max 5MB)", variant: "destructive" });
      input.value = "";
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setText("");
    setFile(null);
    setPreview(null);
  };

  const addNews = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return toast({ title: "News text is required", variant: "destructive" });
    if (!file) return toast({ title: "Image is required", variant: "destructive" });

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("text", text);

      const res = await apiFetch("/news", {
        method: "POST",
        data: fd,
      });

      setNews([...news, res]);
      toast({ title: "News item added successfully" });
      handleCloseForm();
      fetchNews();
    } catch (error) {
      toast({ title: "Failed to add news", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const removeNews = async (id: string) => {
    if (!confirm("Are you sure you want to remove this news item?")) return;
    setRemovingId(id);

    try {
      await apiFetch("/news", {
        method: "DELETE",
        data: { id },
      });
      setNews(news.filter((n) => n._id !== id));
      toast({ title: "News deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete item", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsroom Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Share latest updates, press releases, and announcements.
          </p>
        </div>
        <AdminButton
          onClick={() => setShowForm(true)}
          disabled={showForm}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add News Item
        </AdminButton>
      </div>

      {/* ADD FORM (Collapsible) */}
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
                  <Newspaper className="w-4 h-4" />
                  Create News Post
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={addNews} className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Inputs */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Content / Description</label>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter the news update details..."
                        className="w-full h-32 p-3 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="flex-1 py-2.5">
                        Cancel
                      </AdminButton>
                      <AdminButton type="submit" loading={submitting} className="flex-1 py-2.5">
                        Publish News
                      </AdminButton>
                    </div>
                  </div>

                  {/* Right: Image Upload */}
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured Image</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] h-full min-h-[160px] relative group cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="file" hidden accept="image/*" onChange={handleFileSelect} />

                      {preview ? (
                        <div className="absolute inset-2">
                          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[8px]" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[8px]">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" /> Change
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                          <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-blue-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Upload Image</span>
                          <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                        </div>
                      )}
                    </label>
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
            placeholder="Search news content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-[10px] border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-[10px] border border-gray-200">
          <AdminButton variant="ghost" onClick={() => setView("grid")} className={`p-2 rounded-[10px] transition-all ${view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <Grid className="w-4 h-4" />
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => setView("list")} className={`p-2 rounded-[10px] transition-all ${view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <List className="w-4 h-4" />
          </AdminButton>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-[10px] h-64 animate-pulse">
              <div className="h-40 bg-gray-100 rounded-t-[10px] w-full" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Newspaper className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No news updates found</p>
          <p className="text-sm text-gray-400">Post a new update to get started.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => {
            const isDeleting = removingId === item._id;
            return (
              <div
                key={item._id}
                className="group bg-white rounded-[10px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={IMAGE_URL + item.image}
                    alt="News"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-gray-600 line-clamp-3 mb-4 flex-1 text-sm leading-relaxed">
                    {item.text}
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" /> Recent
                    </span>
                    <button
                      onClick={() => removeNews(item._id)}
                      disabled={isDeleting}
                      className="w-9 h-9 rounded-full bg-white border border-red-100 text-red-500 shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white hover:scale-110 transition-all disabled:opacity-50"
                      title="Delete News"
                    >
                      {isDeleting ? <Skeleton className="w-4 h-4 rounded-full" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
          {filteredNews.map((item) => {
            const isDeleting = removingId === item._id;
            return (
              <div key={item._id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors group">
                <div className="w-24 h-16 shrink-0 bg-gray-100 rounded-[8px] overflow-hidden border border-gray-200">
                  <img src={IMAGE_URL + item.image} alt="News" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-[10px] border border-blue-100">
                      News
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{item.text}</p>
                </div>

                <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeNews(item._id)}
                    disabled={isDeleting}
                    className="w-9 h-9 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm disabled:opacity-50"
                    title="Delete News"
                  >
                    {isDeleting ? <Skeleton className="w-4 h-4 rounded-full" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}