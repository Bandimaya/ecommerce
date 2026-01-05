"use client";

import { IMAGE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

type Benefit = {
  _id: string;
  image: string;
  text: string;
  alt: string;
};

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [alt, setAlt] = useState("");

  const fetchBenefits = async () => {
    const res = await fetch("/api/benefits");
    setBenefits(await res.json());
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  const addBenefit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("text", text);
      fd.append("alt", alt);

      await fetch("/api/benefits", { method: "POST", body: fd });
    } else if (url) {
      await fetch("/api/benefits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url, text, alt }),
      });
    }

    setFile(null);
    setUrl("");
    setText("");
    setAlt("");
    fetchBenefits();
  };

  const removeBenefit = async (id: string) => {
    await fetch("/api/benefits", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBenefits();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Benefits</h1>

      {/* ADD */}
      <form onSubmit={addBenefit} className="bg-white p-4 rounded shadow mb-6">
        <textarea
          placeholder="HTML Text (use <span class='text-blue-600 font-extrabold'>)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          rows={3}
          required
        />

        <input
          placeholder="Alt text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
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
          Add Benefit
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {benefits.map((b) => (
          <div
            key={b._id}
            className="relative bg-white rounded shadow p-4 flex gap-4"
          >
            <img
              src={IMAGE_URL+b.image}
              alt={b.alt}
              className="w-16 h-16 object-contain"
            />
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: b.text }}
            />
            <button
              onClick={() => removeBenefit(b._id)}
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
