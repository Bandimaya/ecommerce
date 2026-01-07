"use client";

import { useEffect, useState } from "react";
import { 
  Trash2, 
  Plus, 
  Loader2, 
  Youtube, 
  Video, 
  PlayCircle 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  /* ===== ADD VIDEO ===== */
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
      }
    } catch (error) {
      console.error("Failed to add video", error);
      toast({ title: "Failed to add video", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== REMOVE VIDEO ===== */
  const removeVideo = async (id: string) => {
    if (!confirm("Are you sure you want to remove this video?")) return;

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
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Video Gallery</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage YouTube videos displayed on the platform.
        </p>
      </div>

      {/* Add Section */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-600" />
          Add New Video
        </h2>
        
        <form onSubmit={addVideo} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              placeholder="Enter YouTube Video ID (e.g. 40imd1I80Sk)"
              className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={submitting || !youtubeId}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-[10px] font-medium transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add Video
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 ml-1">
          Tip: Copy the ID from the URL (e.g. youtube.com/watch?v=<b>ID_HERE</b>)
        </p>
      </div>

      {/* Video Grid */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm min-h-[300px]">
        <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <PlayCircle className="w-4 h-4" />
          Library ({videos.length})
        </h2>

        {loading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-video bg-gray-100 rounded-[10px] animate-pulse"></div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          // Empty State
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
            <Youtube className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No videos added yet.</p>
          </div>
        ) : (
          // Video List
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <div 
                key={v._id} 
                className="group relative bg-black rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200"
              >
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${v.youtubeId}`}
                    allowFullScreen
                    title="YouTube video"
                  />
                </div>
                
                {/* Delete Button (Visible on hover) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeVideo(v._id)}
                    className="bg-white/90 hover:bg-red-600 hover:text-white text-gray-700 shadow-md p-2 rounded-full transition-colors backdrop-blur-sm"
                    title="Remove Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}