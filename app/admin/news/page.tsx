"use client";

import { IMAGE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { 
  Trash2, 
  Upload, 
  Plus, 
  Loader2, 
  Newspaper, 
  X, 
  ImageIcon,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type NewsItem = {
  _id: string;
  image: string;
  text: string;
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ===== FETCH ===== */
  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error("Failed to fetch news", error);
      toast({ title: "Failed to load news", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* ===== ADD NEWS ===== */
  const addNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      return toast({ title: "News text is required", variant: "destructive" });
    }
    if (!file) {
      return toast({ title: "Image is required", variant: "destructive" });
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("text", text);

      const res = await fetch("/api/news", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        setText("");
        setFile(null);
        await fetchNews();
        toast({ title: "News item added successfully", variant: "success" });
      }
    } catch (error) {
      console.error("Failed to upload news", error);
      toast({ title: "Failed to add news", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== REMOVE NEWS ===== */
  const removeNews = async (id: string) => {
    if (!confirm("Are you sure you want to remove this news item?")) return;

    try {
      await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNews(news.filter((n) => n._id !== id));
      toast({ title: "News deleted successfully", variant: "success" });
    } catch (error) {
      console.error("Failed to delete news", error);
      toast({ title: "Failed to delete item", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Newsroom Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Share latest updates, press releases, and announcements.
        </p>
      </div>

      {/* Add News Form */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Newspaper className="w-4 h-4" />
          Add News Item
        </h2>
        
        <form onSubmit={addNews} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Text Input */}
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter news update or announcement details..."
                className="w-full h-[180px] p-4 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm resize-none"
                required
              />
            </div>

            {/* Right: Image Upload */}
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Featured Image</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-[10px] h-[180px] hover:bg-gray-50 transition-colors text-center cursor-pointer group flex flex-col items-center justify-center p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 mb-2 text-blue-500" />
                    <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-blue-600 mt-1">Ready to upload</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="font-medium text-sm text-gray-600">Upload Image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <div className="flex gap-3">
              {file && (
                <button
                  type="button"
                  onClick={() => { setFile(null); setText(""); }}
                  className="px-5 py-2.5 rounded-[10px] font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-[10px] font-medium transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {submitting ? "Publishing..." : "Publish News"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* News Grid */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm min-h-[300px]">
        <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Recent Updates ({news.length})
        </h2>

        {loading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-50 border border-gray-100 rounded-[10px] p-4 flex gap-4 animate-pulse">
                <div className="w-32 h-24 bg-gray-200 rounded-[10px]"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          // Empty State
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No news items found.</p>
          </div>
        ) : (
          // News List
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((n) => (
              <div
                key={n._id}
                className="group relative bg-white border border-gray-200 rounded-[10px] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row h-auto sm:h-32"
              >
                {/* Image */}
                <div className="w-full sm:w-40 h-40 sm:h-full bg-gray-100 shrink-0">
                  <img
                    src={IMAGE_URL + n.image}
                    alt="News Thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {n.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    Published Update
                  </p>
                </div>
                
                {/* Delete Button (Overlay on hover) */}
                <button
                  onClick={() => removeNews(n._id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-[10px] shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                  title="Delete News"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}