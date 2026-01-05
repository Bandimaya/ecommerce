"use client";

import { IMAGE_URL } from "@/lib/constants";
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

const emptyForm = {
  title: "",
  description: "",
  alt: "",
  icon: "Cpu",
  color: "bg-blue-500",
  accentColor: "#3b82f6",
};

export default function JargonPage() {
  const [items, setItems] = useState<JargonItem[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<JargonItem | null>(null);

  /* ---------------- FETCH ---------------- */
  const fetchItems = async () => {
    const res = await fetch("/api/jargon");
    setItems(await res.json());
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ---------------- CREATE ---------------- */
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]: any) => fd.append(k, v));
    if (file) fd.append("image", file);

    await fetch("/api/jargon", {
      method: "POST",
      body: fd,
    });

    resetForm();
    fetchItems();
  };

  /* ---------------- UPDATE ---------------- */
  const updateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]: any) => fd.append(k, v));
    if (file) fd.append("image", file);

    await fetch(`/api/jargon/${editing._id}`, {
      method: "PUT",
      body: fd,
    });

    resetForm();
    fetchItems();
  };

  /* ---------------- DELETE ---------------- */
  const deleteItem = async (id: string) => {
    await fetch(`/api/jargon/${id}`, { method: "DELETE" });
    fetchItems();
  };

  /* ---------------- HELPERS ---------------- */
  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setEditing(null);
  };

  const startEdit = (item: JargonItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      alt: item.alt,
      icon: item.icon,
      color: item.color,
      accentColor: item.accentColor,
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Jargon CMS</h1>

      {/* FORM */}
      <form
        onSubmit={editing ? updateItem : addItem}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <h2 className="font-semibold mb-3">
          {editing ? "Edit Jargon" : "Add Jargon"}
        </h2>

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
            placeholder="Tailwind color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Accent color"
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
          className="mb-3"
        />

        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editing ? "Update" : "Add"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {items.map((i) => (
          <div
            key={i._id}
            className="relative bg-white rounded shadow p-4 flex gap-4"
          >
            <img
              src={IMAGE_URL + i.image}
              alt={i.alt}
              className="w-32 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{i.title}</h3>
              <p className="text-sm">{i.description}</p>
              <span className="text-xs text-gray-500">{i.icon}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(i)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem(i._id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
