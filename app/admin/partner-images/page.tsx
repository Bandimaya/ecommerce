"use client";

import { IMAGE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { 
  Trash2, 
  Upload, 
  Plus, 
  Loader2, 
  ImageIcon, 
  X,
  Handshake
} from "lucide-react";

type PartnerImage = {
  _id: string;
  image: string;
};

export default function PartnerImagesPage() {
  const [images, setImages] = useState<PartnerImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ===== FETCH ===== */
  const fetchImages = async () => {
    try {
      const res = await fetch("/api/partner-images");
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* ===== ADD IMAGE ===== */
  const addImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch("/api/partner-images", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        setFile(null);
        await fetchImages();
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== REMOVE IMAGE ===== */
  const removeImage = async (id: string) => {
    if (!confirm("Are you sure you want to remove this partner logo?")) return;

    try {
      await fetch("/api/partner-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchImages();
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Partner Logos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage the logos of partners, sponsors, and affiliations.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload New Logo
        </h2>
        
        <form onSubmit={addImage} className="flex flex-col md:flex-row gap-4 items-start">
          {/* File Input */}
          <div className="flex-1 w-full">
            <div className="relative border-2 border-dashed border-gray-300 rounded-[10px] p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-700">
                {file ? (
                  <>
                    <ImageIcon className="w-10 h-10 mb-3 text-blue-500" />
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-blue-600 mt-1">Ready to upload</p>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="font-medium">Click to browse or drag file here</p>
                    <p className="text-xs text-gray-400 mt-1">Supports PNG, SVG, JPG</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button
              type="submit"
              disabled={!file || submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-[10px] font-medium transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[140px]"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {submitting ? "Uploading..." : "Upload Logo"}
            </button>
            
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="px-6 py-3 rounded-[10px] font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm min-h-[300px]">
        <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Handshake className="w-4 h-4" />
          Logos ({images.length})
        </h2>

        {loading ? (
          // Skeleton Loader
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="aspect-square bg-gray-100 rounded-[10px] animate-pulse"></div>
            ))}
          </div>
        ) : images.length === 0 ? (
          // Empty State
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
            <Handshake className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No partner logos uploaded yet.</p>
          </div>
        ) : (
          // Image List
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {images.map((img) => (
              <div
                key={img._id}
                className="group relative bg-white rounded-[10px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all aspect-square flex items-center justify-center p-4"
              >
                {/* Note: object-contain is better for logos than object-cover */}
                <img
                  src={IMAGE_URL + img.image}
                  alt="Partner"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay with Round Icon Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => removeImage(img._id)}
                    className="bg-white hover:bg-red-600 hover:text-white text-gray-500 shadow-md p-3 rounded-full transition-all hover:scale-110 border border-gray-100"
                    title="Delete Logo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}