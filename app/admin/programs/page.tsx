"use client";

import { useEffect, useState } from "react";

const ICONS = ["rocket", "book", "globe", "users"];
const COLORS = ["purple", "amber", "blue", "emerald"];

type Program = {
  _id: string;
  programId: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  stats: { label: string; value: string }[];
  features: string[];
};

export default function ProgramsPage() {
  const [items, setItems] = useState<Program[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const [form, setForm] = useState({
    programId: "",
    title: "",
    subtitle: "",
    description: "",
    icon: "rocket",
    color: "purple",
    stats: [{ label: "", value: "" }],
    features: "",
  });

  const fetchItems = async () => {
    const res = await fetch("/api/programs");
    setItems(await res.json());
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addProgram = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      stats: form.stats,
      features: form.features.split(",").map((f) => f.trim()),
    };

    if (file) {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) =>
        fd.append(k, JSON.stringify(v))
      );
      fd.append("image", file);

      await fetch("/api/programs", { method: "POST", body: fd });
    } else if (url) {
      await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, image: url }),
      });
    }

    setForm({
      programId: "",
      title: "",
      subtitle: "",
      description: "",
      icon: "rocket",
      color: "purple",
      stats: [{ label: "", value: "" }],
      features: "",
    });
    setUrl("");
    setFile(null);
    fetchItems();
  };

  const removeProgram = async (id: string) => {
    await fetch("/api/programs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Programs</h1>

      {/* ADD */}
      <form onSubmit={addProgram} className="bg-white p-4 rounded shadow mb-6">
        <input
          placeholder="Program ID (stem-clubs)"
          value={form.programId}
          onChange={(e) =>
            setForm({ ...form, programId: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
          required
        />

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />

        <input
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) =>
            setForm({ ...form, subtitle: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
          required
        />

        <div className="grid md:grid-cols-2 gap-2 mb-2">
          <select
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="border p-2 rounded"
          >
            {ICONS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>

          <select
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="border p-2 rounded"
          >
            {COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <input
          placeholder="Features (comma separated)"
          value={form.features}
          onChange={(e) =>
            setForm({ ...form, features: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
        />

        <input
          placeholder="Image URL (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Program
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {items.map((p) => (
          <div
            key={p._id}
            className="relative bg-white rounded shadow p-4 flex gap-4"
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-32 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm">{p.description}</p>
              <p className="text-xs text-gray-500">
                {p.icon} • {p.color}
              </p>
            </div>
            <button
              onClick={() => removeProgram(p._id)}
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
