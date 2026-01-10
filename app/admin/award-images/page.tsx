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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AdminButton from "@/components/admin/AdminButton";

type AwardImage = {
  _id: string;
  image: string;
};

export default function AwardImagesPage() {
  const [images, setImages] = useState<AwardImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ===== FETCH ===== */
  const fetchImages = async () => {
    try {
      const res = await fetch("/api/award-images");
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

  const handleFileSelect = (e: any) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const f = input.files[0] as File;
    if (!f.type.startsWith("image/")) {
      toast({ title: "Please upload a valid image file" });
      input.value = "";
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: `Image ${f.name} too large (max 5MB)`, variant: "destructive" });
      input.value = "";
      return;
    }
    setFile(f);
  };

  const addImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    // Client-side validation: limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large (max 5MB)", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch("/api/award-images", {
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


  const [removingId, setRemovingId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Award Images Gallery</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload and manage images displayed in the "Awards & Recognition" section.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload New Image
        </h2>
        
        <form onSubmit={addImage} className="flex flex-col md:flex-row gap-4 items-start">
          {/* File Input */}
          <div className="flex-1 w-full">
            <div className="relative border-2 border-dashed border-gray-300 rounded-[10px] p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
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
                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <AdminButton type="submit" loading={submitting} disabled={!file} className="min-w-[140px] rounded-[10px]">
              <Upload className="w-4 h-4" />
              {submitting ? "Uploading..." : "Upload Image"}
            </AdminButton>

            {file && (
              <AdminButton variant="ghost" type="button" onClick={() => setFile(null)} className="rounded-[10px]">
                <X className="w-4 h-4" />
                Cancel
              </AdminButton>
            )}
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm min-h-[300px]">
        <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Gallery ({images.length})
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
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No award images uploaded yet.</p>
          </div>
        ) : (
          // Image List
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="group relative bg-gray-50 rounded-[10px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all aspect-[4/3]"
                >
                  <img
                    src={IMAGE_URL + img.image}
                    alt="Award"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <AdminButton
                      variant="danger"
                      onClick={async () => {
                        if (!confirm("Are you sure you want to remove this image?")) return;
                        setRemovingId(img._id);
                        try {
                          await fetch("/api/award-images", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: img._id }),
                          });
                          await fetchImages();
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setRemovingId(null);
                        }
                      }}
                      loading={removingId === img._id}
                      title="Delete Image"
                      className="p-3 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </AdminButton>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}