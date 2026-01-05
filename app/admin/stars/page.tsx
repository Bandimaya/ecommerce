"use client";

import { IMAGE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

type Star = {
  _id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  video?: string;
};

export default function StarsPage() {
  const [stars, setStars] = useState<Star[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    quote: "",
  });

  const fetchStars = async () => {
    const res = await fetch("/api/stars");
    setStars(await res.json());
  };

  useEffect(() => {
    fetchStars();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);
    if (video) fd.append("video", video);
    if (editingId) fd.append("id", editingId);

    await fetch("/api/stars", {
      method: editingId ? "PUT" : "POST",
      body: fd,
    });

    reset();
    fetchStars();
  };

  const reset = () => {
    setForm({ name: "", role: "", quote: "" });
    setImage(null);
    setVideo(null);
    setEditingId(null);
  };

  const edit = (s: Star) => {
    setEditingId(s._id);
    setForm({ name: s.name, role: s.role, quote: s.quote });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Stars Management</h1>

      {/* FORM */}
      <form onSubmit={submit} className="bg-white p-5 rounded shadow mb-8">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <textarea
          placeholder="Quote"
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          className="border p-2 rounded w-full mb-3"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <input
          type="file"
          accept="video/mp4,video/webm"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {stars.map((s) => (
          <div key={s._id} className="bg-white p-4 rounded shadow flex gap-4">
            <img src={IMAGE_URL+  s.image} className="w-20 h-20 rounded object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{s.name}</h3>
              <p className="text-sm text-gray-600">{s.role}</p>
              <p className="text-sm">{s.quote}</p>
              {s.video && (
                <button
                  onClick={() => setActiveVideo(s.video!)}
                  className="text-blue-600 text-sm mt-2"
                >
                  ▶ Play Video
                </button>
              )}
            </div>
            <button onClick={() => edit(s)} className="text-blue-600">
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-black p-4 rounded relative w-[80%]">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-2 right-3 text-white"
            >
              ✕
            </button>
            <video src={activeVideo} controls autoPlay className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
