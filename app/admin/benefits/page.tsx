"use client";

import { IMAGE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import AdminButton from "@/components/admin/AdminButton";

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
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchBenefits = async () => {
    const res = await fetch("/api/benefits");
    setBenefits(await res.json());
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  const addBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Image too large (max 5MB)");
          return;
        }
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
      await fetchBenefits();
    } finally {
      setSubmitting(false);
    }
  };

  const removeBenefit = async (id: string) => {
    if (!confirm("Remove this benefit?")) return;
    setRemovingId(id);
    try {
      await fetch("/api/benefits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchBenefits();
    } finally {
      setRemovingId(null);
    }
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

        <AdminButton type="submit" loading={submitting} className="px-4 py-2">
          Add Benefit
        </AdminButton>
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
            <AdminButton variant="danger" loading={removingId === b._id} onClick={() => removeBenefit(b._id)} className="absolute top-2 right-2 p-2">
              ✕
            </AdminButton>
          </div>
        ))}
      </div>
    </div>
  );
}
