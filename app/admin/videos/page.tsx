"use client";

import { useEffect, useState } from "react";
import { 
  Trash2, 
  Plus, 
  Loader2, 
  Youtube, 
  Video, 
  PlayCircle,
  X,
  Grid,
  List,
  Search,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type VideoItem = {
  _id: string;
  youtubeId: string;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [youtubeId, setYoutubeId] = useState("");
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  /* ===== FETCH ===== */
  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos", error);
      toast({ title: "Failed to load videos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  /* ===== HANDLERS ===== */
  const handleCloseForm = () => {
    setShowForm(false);
    setYoutubeId("");
  };

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeId.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeId }),
      });

      if (res.ok) {
        setYoutubeId("");
        await fetchVideos();
        toast({ title: "Video added successfully", variant: "success" });
        handleCloseForm();
      }
    } catch (error) {
      console.error("Failed to add video", error);
      toast({ title: "Failed to add video", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const removeVideo = async (id: string) => {
    if (!confirm("Are you sure you want to remove this video?")) return;
    setRemovingId(id);
    try {
      await fetch("/api/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setVideos(videos.filter((v) => v._id !== id));
      toast({ title: "Video deleted", variant: "success" });
    } catch (error) {
      console.error("Failed to delete video", error);
      toast({ title: "Failed to delete video", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  // Filter videos
  const filteredVideos = videos.filter(v => 
    v.youtubeId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage YouTube videos displayed on the platform.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Video
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
                  <Youtube className="w-5 h-5 text-red-600" />
                  Add New Video
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>
              
              <form onSubmit={addVideo} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                   <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube Video ID</label>
                        <div className="relative">
                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              value={youtubeId}
                              onChange={(e) => setYoutubeId(e.target.value)}
                              placeholder="e.g. 40imd1I80Sk"
                              className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                              required
                              autoFocus
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Copy the ID from the URL: youtube.com/watch?v=<b className="text-gray-900">ID_HERE</b>
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2">
                         <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="flex-1 py-2.5">
                            Cancel
                         </AdminButton>
                         <AdminButton type="submit" loading={submitting} disabled={!youtubeId} className="flex-1 py-2.5">
                            Save Video
                         </AdminButton>
                      </div>
                   </div>

                   {/* Live Preview */}
                   <div className="w-full md:w-1/3 bg-gray-50 rounded-[10px] border border-gray-200 flex items-center justify-center overflow-hidden h-48 md:h-auto">
                      {youtubeId.length > 5 ? (
                          <img 
                            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/320x180?text=Invalid+ID")}
                          />
                      ) : (
                          <div className="text-center text-gray-400">
                             <PlayCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                             <span className="text-sm">Preview will appear here</span>
                          </div>
                      )}
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
            placeholder="Search by Video ID..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="aspect-video bg-white border border-gray-200 rounded-[10px] animate-pulse"></div>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Youtube className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No videos found</p>
          <p className="text-sm text-gray-400">Add videos to populate the gallery.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((v) => (
            <div 
              key={v._id} 
              className="group bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-200 flex flex-col"
            >
              <div className="relative aspect-video w-full bg-black group-hover:scale-[1.02] transition-transform duration-500">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${v.youtubeId}`}
                  allowFullScreen
                  title="YouTube video"
                />
              </div>
              
              <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                      <Youtube className="w-3.5 h-3.5 text-red-600" />
                      {v.youtubeId}
                  </div>
                  
                  <button 
                     onClick={() => removeVideo(v._id)}
                     className="w-8 h-8 rounded-full bg-white border border-red-100 text-red-500 shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white hover:scale-110 transition-all"
                     title="Remove Video"
                  >
                     {removingId === v._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
           {filteredVideos.map((v) => (
             <div key={v._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                <div className="w-24 h-14 shrink-0 bg-black rounded-[6px] overflow-hidden border border-gray-200 relative">
                     <img 
                        src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} 
                        alt="Thumbnail"
                        className="w-full h-full object-cover opacity-80"
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                         <PlayCircle className="w-6 h-6 text-white opacity-80" />
                     </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <span className="truncate">Video ID: {v.youtubeId}</span>
                        <a 
                           href={`https://www.youtube.com/watch?v=${v.youtubeId}`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="text-gray-400 hover:text-blue-600"
                        >
                           <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{v._id}</p>
                </div>

                <button 
                    onClick={() => removeVideo(v._id)}
                    className="w-9 h-9 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100"
                    title="Remove Video"
                >
                     {removingId === v._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}