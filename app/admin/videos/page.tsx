"use client";

import { useEffect, useState } from "react";

type Video = {
  _id: string;
  youtubeId: string;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [youtubeId, setYoutubeId] = useState("");

  const fetchVideos = async () => {
    const res = await fetch("/api/videos");
    setVideos(await res.json());
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeId) return;

    await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeId }),
    });

    setYoutubeId("");
    fetchVideos();
  };

  const removeVideo = async (id: string) => {
    await fetch("/api/videos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchVideos();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>

      {/* ADD */}
      <form onSubmit={addVideo} className="flex gap-2 mb-6">
        <input
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
          placeholder="YouTube Video ID (e.g. 40imd1I80Sk)"
          className="border p-2 rounded flex-1"
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </form>

      {/* LIST */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((v) => (
          <div key={v._id} className="relative">
            <iframe
              className="w-full aspect-video rounded"
              src={`https://www.youtube.com/embed/${v.youtubeId}`}
              allowFullScreen
            />
            <button
              onClick={() => removeVideo(v._id)}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
