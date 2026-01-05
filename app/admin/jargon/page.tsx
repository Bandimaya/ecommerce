"use client";

import { useEffect, useState } from "react";

const ICONS = ["Cpu", "Code", "Wifi", "Zap", "Cog", "Brain"];

type JargonItem = {
  _id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  icon: string;
  color: string;
  accentColor: string;
};

export default function JargonPage() {
  const [items, setItems] = useState<JargonItem[]>([]);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    alt: "",
    icon: "Cpu",
    color: "bg-blue-500",
    accentColor: "#3b82f6",
  });

  const fetchItems = async () => {
    const res = await fetch("/api/jargon");
    setItems(await res.json());
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload image
    if (file) {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("image", file);

      await fetch("/api/jargon", { method: "POST", body: fd });
    }
    // Image URL
    else if (url) {
      await fetch("/api/jargon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: url }),
      });
    }

    setForm({
      title: "",
      description: "",
      alt: "",
      icon: "Cpu",
      color: "bg-blue-500",
      accentColor: "#3b82f6",
    });
    setUrl("");
    setFile(null);
    fetchItems();
  };

  const removeItem = async (id: string) => {
    await fetch("/api/jargon", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Jargon Items</h1>

      {/* ADD */}
      <form onSubmit={addItem} className="bg-white p-4 rounded shadow mb-6">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
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

        <input
          placeholder="Alt text"
          value={form.alt}
          onChange={(e) => setForm({ ...form, alt: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />

        <div className="grid md:grid-cols-3 gap-2 mb-2">
          <select
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="border p-2 rounded"
          >
            {ICONS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>

          <input
            placeholder="Tailwind color (bg-*)"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Accent color (#hex)"
            value={form.accentColor}
            onChange={(e) =>
              setForm({ ...form, accentColor: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Jargon
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {items.map((i) => (
          <div
            key={i._id}
            className="relative bg-white rounded shadow p-4 flex gap-4"
          >
            <img
              src={i.image}
              alt={i.alt}
              className="w-32 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{i.title}</h3>
              <p className="text-sm">{i.description}</p>
              <span className="text-xs">{i.icon}</span>
            </div>
            <button
              onClick={() => removeItem(i._id)}
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
