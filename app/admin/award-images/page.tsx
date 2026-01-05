"use client";

import { useEffect, useState } from "react";

type AwardImage = {
  _id: string;
  image: string;
};

export default function AwardImagesPage() {
  const [images, setImages] = useState<AwardImage[]>([]);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchImages = async () => {
    const res = await fetch("/api/award-images");
    setImages(await res.json());
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* ===== ADD IMAGE ===== */
  const addImage = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Upload file
    if (file) {
      const fd = new FormData();
      fd.append("image", file);

      await fetch("/api/award-images", {
        method: "POST",
        body: fd,
      });
    }

    // 🔹 URL
    else if (url) {
      await fetch("/api/award-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });
    }

    setUrl("");
    setFile(null);
    fetchImages();
  };

  const removeImage = async (id: string) => {
    await fetch("/api/award-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchImages();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Award Images</h1>

      {/* ADD */}
      <form onSubmit={addImage} className="bg-white p-4 rounded shadow mb-6">

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Award Image
        </button>
      </form>

      {/* LIST */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img._id}
            className="relative bg-white rounded shadow"
          >
            <img
              src={img.image}
              alt="Award"
              className="w-full h-32 object-cover rounded"
            />
            <button
              onClick={() => removeImage(img._id)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
