"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Upload,
  ImagePlus,
  FileImage
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type PartnerImage = {
  _id: string;
  image: string;
};

export default function PartnerImagesPage() {
  const [images, setImages] = useState<PartnerImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ===== FETCH ===== */
  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/partner-images");
      setImages(data);
    } catch (error) {
      toast({ title: "Failed to load partner logos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* ===== HANDLERS ===== */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (!input.files || input.files.length === 0) return;

    const f = input.files[0];
    if (!f.type.startsWith("image/")) {
      toast({ title: "Please upload a valid image file", variant: "destructive" });
      input.value = "";
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: `Image too large (max 5MB)`, variant: "destructive" });
      input.value = "";
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFile(null);
    setPreview(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this partner?")) return;
    setRemovingId(id);
    try {
      await apiFetch("/partner-images", {
        method: "DELETE",
        data: { id },
      });
      setImages(images.filter((img) => img._id !== id));
      toast({ title: "Partner removed successfully" });
    } catch (error) {
      toast({ title: "Failed to remove partner", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await apiFetch("/partner-images", {
        method: "POST",
        data: fd,
      });

      setImages([...images, res]);
      toast({ title: "Logo uploaded successfully" });
      handleCloseForm();
    } catch (error) {
      toast({ title: "Failed to upload logo", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Logos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the logos of partners, sponsors, and affiliations.
          </p>
        </div>
        <AdminButton
          onClick={() => setShowForm(true)}
          disabled={showForm}
          className="flex items-center gap-2"
        >
          <ImagePlus className="w-4 h-4" />
          Add New Logo
        </AdminButton>
      </div>

      {/* UPLOAD FORM (Collapsible) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[10px] shadow-md border border-gray-200 overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Partner Logo
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Upload Area - Updated for Fill */}
                  <div className="flex-1">
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors h-64 relative group flex flex-col items-center justify-center text-center bg-gray-50/50 overflow-hidden">
                      <input type="file" hidden accept="image/*" onChange={handleFileSelect} />

                      {preview ? (
                        <div className="w-full h-full relative">
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                              <Upload className="w-4 h-4" /> Change Logo
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Handshake className="w-8 h-8 text-blue-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Click to browse or drag logo</span>
                          <span className="text-xs text-gray-400 mt-1">PNG (Transparent) preferred</span>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="w-full md:w-1/3 flex flex-col justify-center space-y-4">
                    <div className="bg-gray-50 p-4 rounded-[10px] border border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-2">Logo Guidelines</h3>
                      <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-4">
                        <li>Transparent PNGs work best</li>
                        <li>Max size: 5MB</li>
                        <li>Recommended: Landscape ratio</li>
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="flex-1 py-2.5">
                        Cancel
                      </AdminButton>
                      <AdminButton type="submit" loading={submitting} disabled={!file} className="flex-1 py-2.5">
                        Upload Logo
                      </AdminButton>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOOLBAR */}
      <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-[10px] border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500 pl-2">
          <Handshake className="w-4 h-4" />
          <span className="font-medium">{images.length}</span> partners
        </div>
        <div className="flex bg-gray-100 p-1 rounded-[10px] border border-gray-200">
          <AdminButton variant="ghost" onClick={() => setView("grid")} className={`p-2 rounded-[10px] transition-all ${view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <Grid className="w-4 h-4" />
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => setView("list")} className={`p-2 rounded-[10px] transition-all ${view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <List className="w-4 h-4" />
          </AdminButton>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="aspect-square bg-white border border-gray-200 rounded-[10px] animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Handshake className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No partners found</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW - Updated with w-full h-full object-cover
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {images.map((img) => {
            const isDeleting = removingId === img._id;
            return (
              <div key={img._id} className="group relative bg-white rounded-[10px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 aspect-square flex items-center justify-center">
                <img
                  src={IMAGE_URL + img.image}
                  alt="Partner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale-[50%] group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(img._id)}
                    disabled={isDeleting}
                    className="w-10 h-10 rounded-full bg-white text-red-500 shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white hover:scale-110 transition-all"
                    title="Remove Partner"
                  >
                    {isDeleting ? <Skeleton className="w-4 h-4 rounded-full" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // LIST VIEW - Updated for Full Width Thumbnail
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
          {images.map((img) => {
            const isDeleting = removingId === img._id;
            return (
              <div key={img._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                <div className="w-24 h-16 shrink-0 bg-gray-100 rounded-[6px] overflow-hidden border border-gray-200 flex items-center justify-center">
                  <img src={IMAGE_URL + img.image} alt="Partner" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <FileImage className="w-4 h-4 text-gray-400" />
                    <span className="truncate">Partner_{img._id.slice(-6)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">{img._id}</p>
                </div>

                <button
                  onClick={() => handleDelete(img._id)}
                  disabled={isDeleting}
                  className="w-10 h-10 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  title="Remove Partner"
                >
                  {isDeleting ? <Skeleton className="w-4 h-4 rounded-full" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}