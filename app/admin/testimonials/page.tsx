"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  designation: string;
  image: string;
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const [form, setForm] = useState({
    quote: "",
    name: "",
    designation: "",
  });

  const fetchItems = async () => {
    const res = await fetch("/api/testimonials");
    setItems(await res.json());
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      const fd = new FormData();
      fd.append("quote", form.quote);
      fd.append("name", form.name);
      fd.append("designation", form.designation);
      fd.append("image", file);

      await fetch("/api/testimonials", {
        method: "POST",
        body: fd,
      });
    } else if (url) {
      await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: url }),
      });
    }

    setForm({ quote: "", name: "", designation: "" });
    setUrl("");
    setFile(null);
    fetchItems();
  };

  const removeItem = async (id: string) => {
    await fetch("/api/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Parent Testimonials</h1>

      {/* ADD */}
      <form onSubmit={addItem} className="bg-white p-4 rounded shadow mb-6">
        <textarea
          placeholder="Quote"
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          rows={3}
          required
        />

        <input
          placeholder="Parent Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />

        <input
          placeholder="Designation (Parent of …)"
          value={form.designation}
          onChange={(e) =>
            setForm({ ...form, designation: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Testimonial
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {items.map((t) => (
          <div
            key={t._id}
            className="relative bg-white rounded shadow p-4 flex gap-4"
          >
            <img
              src={t.image}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="italic text-sm">“{t.quote}”</p>
              <p className="font-semibold mt-1">{t.name}</p>
              <p className="text-xs text-gray-500">
                {t.designation}
              </p>
            </div>
            <button
              onClick={() => removeItem(t._id)}
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
