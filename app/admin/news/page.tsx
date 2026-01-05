"use client";

import { IMAGE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

type NewsItem = {
  _id: string;
  image: string;
  text: string;
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchNews = async () => {
    const res = await fetch("/api/news");
    setNews(await res.json());
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const addNews = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Upload image
    if (file) {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("text", text);

      await fetch("/api/news", {
        method: "POST",
        body: fd,
      });
    }

    // 🔹 Image URL
    else if (url) {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url, text }),
      });
    }

    setText("");
    setUrl("");
    setFile(null);
    fetchNews();
  };

  const removeNews = async (id: string) => {
    await fetch("/api/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchNews();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Newsroom</h1>

      {/* ADD */}
      <form onSubmit={addNews} className="bg-white p-4 rounded shadow mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="News text"
          className="border p-2 rounded w-full mb-3"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add News
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {news.map((n) => (
          <div
            key={n._id}
            className="relative bg-white rounded shadow flex gap-4 p-4"
          >
            <img
              src={IMAGE_URL+ n.image}
              alt="News"
              className="w-32 h-20 object-cover rounded"
            />
            <p className="flex-1 text-sm">{n.text}</p>

            <button
              onClick={() => removeNews(n._id)}
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
