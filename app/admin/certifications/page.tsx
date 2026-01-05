"use client";

import { useEffect, useState } from "react";

const ICONS = [
  { key: "award", label: "Award" },
  { key: "shield", label: "ShieldCheck" },
  { key: "globe", label: "Globe" },
];

type Certification = {
  _id: string;
  label: string;
  image: string;
  alt: string;
  icon: string;
};

export default function CertificationsPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const [form, setForm] = useState({
    label: "",
    alt: "",
    icon: "award",
  });

  const fetchItems = async () => {
    const res = await fetch("/api/certifications");
    setItems(await res.json());
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      const fd = new FormData();
      fd.append("label", form.label);
      fd.append("alt", form.alt);
      fd.append("icon", form.icon);
      fd.append("image", file);

      await fetch("/api/certifications", {
        method: "POST",
        body: fd,
      });
    } else if (url) {
      await fetch("/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: url }),
      });
    }

    setForm({ label: "", alt: "", icon: "award" });
    setUrl("");
    setFile(null);
    fetchItems();
  };

  const removeItem = async (id: string) => {
    await fetch("/api/certifications", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Certifications</h1>

      {/* ADD */}
      <form onSubmit={addItem} className="bg-white p-4 rounded shadow mb-6">
        <input
          placeholder="Label"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
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

        <select
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        >
          {ICONS.map((i) => (
            <option key={i.key} value={i.key}>
              {i.label}
            </option>
          ))}
        </select>

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
          Add Certification
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {items.map((c) => (
          <div
            key={c._id}
            className="relative bg-white rounded shadow p-4 flex items-center gap-4"
          >
            <img
              src={c.image}
              alt={c.alt}
              className="w-16 h-10 object-contain"
            />
            <div className="flex-1">
              <p className="font-semibold">{c.label}</p>
              <span className="text-xs text-gray-500">{c.icon}</span>
            </div>
            <button
              onClick={() => removeItem(c._id)}
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
