"use client";

import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

const ICONS = ["Cpu", "Gamepad2", "Microscope", "Zap"];

type Feature = {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  icon: string;
  image: string;
};

export default function StemparkFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    stat: "",
    icon: "Cpu",
  });

  const fetchFeatures = async () => {
    const res = await fetch("/api/stempark-features");
    setFeatures(await res.json());
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);
    if (editingId) fd.append("id", editingId);

    await fetch("/api/stempark-features", {
      method: editingId ? "PUT" : "POST",
      body: fd,
    });

    reset();
    fetchFeatures();
  };

  const reset = () => {
    setForm({
      title: "",
      subtitle: "",
      description: "",
      stat: "",
      icon: "Cpu",
    });
    setImage(null);
    setEditingId(null);
  };

  const edit = (f: Feature) => {
    setEditingId(f._id);
    setForm({
      title: f.title,
      subtitle: f.subtitle,
      description: f.description,
      stat: f.stat,
      icon: f.icon,
    });
  };

  const deleteFeature = (f: Feature) => {
    apiFetch("/stempark-features", {
      method: "DELETE",
      data: { id: f._id },
    }).then(() => fetchFeatures())
      .catch((err) => {
        console.error("Error deleting feature:", err);
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">STEM Park Features</h1>

      {/* FORM */}
      <form onSubmit={submit} className="bg-white p-5 rounded shadow mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Stat (e.g. 50+ Bots)"
            value={form.stat}
            onChange={(e) => setForm({ ...form, stat: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <select
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="border p-2 rounded"
          >
            {ICONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full mt-4"
          rows={3}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mt-4"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {features.map((f) => (
          <div
            key={f._id}
            className="bg-white p-4 rounded shadow flex gap-4"
          >
            <img
              src={IMAGE_URL + f.image}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.subtitle}</p>
              <p className="text-sm">{f.description}</p>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                {f.stat}
              </span>
            </div>
            <button onClick={() => edit(f)} className="text-blue-600">
              Edit
            </button>
            <button onClick={() => deleteFeature(f)} className="text-blue-600">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
