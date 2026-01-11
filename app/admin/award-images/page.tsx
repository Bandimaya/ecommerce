"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Upload,
  Plus,
  Loader2,
  ImageIcon,
  X,
  Grid,
  List,
  ImagePlus,
  FileImage
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type AwardImage = {
  _id: string;
  image: string;
};

export default function AwardImagesPage() {
  const [images, setImages] = useState<AwardImage[]>([]);
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
      const data = await apiFetch("/award-images");
      setImages(data);
    } catch (error) {
      toast({ title: "Failed to load images", variant: "destructive" });
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
    if (!confirm("Are you sure you want to delete this image?")) return;
    setRemovingId(id);
    try {
      await apiFetch("/award-images", {
        method: "DELETE",
        data: { id },
      });
      setImages(images.filter((img) => img._id !== id));
      toast({ title: "Image deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete image", variant: "destructive" });
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

      const res = await apiFetch("/award-images", {
        method: "POST",
        data: fd,
      });

      setImages([...images, res]);
      toast({ title: "Image uploaded successfully" });
      handleCloseForm();
    } catch (error) {
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Award Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload and manage images displayed in the Awards & Recognition section.
          </p>
        </div>
        <AdminButton 
          onClick={() => setShowForm(true)} 
          disabled={showForm} 
          className="flex items-center gap-2"
        >
          <ImagePlus className="w-4 h-4" />
          Add New Image
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
                  Upload New Image
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px] cursor-pointer">
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Upload Area */}
                    <div className="flex-1">
                        <label className="block border-2 border-dashed border-gray-300 rounded-[10px] p-8 cursor-pointer hover:bg-gray-50 transition-colors h-64 relative group flex flex-col items-center justify-center text-center">
                            <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                            
                            {preview ? (
                                <div className="absolute inset-2">
                                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-[8px]" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[8px]">
                                        <span className="text-white text-sm font-medium flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> Change Image
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Click to browse or drag file</span>
                                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Instructions / Actions */}
                    <div className="w-full md:w-1/3 flex flex-col justify-center space-y-4">
                         <div className="bg-gray-50 p-4 rounded-[10px] border border-gray-100">
                            <h3 className="font-medium text-gray-900 mb-2">Image Guidelines</h3>
                            <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-4">
                                <li>Recommended aspect ratio: 4:3 or 16:9</li>
                                <li>Maximum file size: 5MB</li>
                                <li>Supported formats: JPG, PNG, WEBP</li>
                            </ul>
                         </div>

                         <div className="flex gap-3 pt-2">
                            <AdminButton type="button" variant="ghost" onClick={handleCloseForm} className="flex-1 py-2.5">
                                Cancel
                            </AdminButton>
                            <AdminButton type="submit" loading={submitting} disabled={!file} className="flex-1 py-2.5">
                                Upload
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
            <ImageIcon className="w-4 h-4" />
            <span className="font-medium">{images.length}</span> images in gallery
        </div>
        <div className="flex bg-gray-100 p-1 rounded-[10px] border border-gray-200">
          <AdminButton variant="ghost" onClick={() => setView("grid")} className={`p-2 rounded-[10px] transition-all ${
              view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <Grid className="w-4 h-4" />
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => setView("list")} className={`p-2 rounded-[10px] transition-all ${
              view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <List className="w-4 h-4" />
          </AdminButton>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="aspect-[4/3] bg-white border border-gray-200 rounded-[10px] animate-pulse" />
           ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No images uploaded</p>
          <p className="text-sm text-gray-400">Upload images to showcase awards and recognition.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {images.map((img) => {
                const isDeleting = removingId === img._id;
                return (
                <div key={img._id} className="group relative bg-white rounded-[10px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 aspect-[4/3]">
                    <img 
                        src={IMAGE_URL + img.image} 
                        alt="Award" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                            onClick={() => handleDelete(img._id)}
                            disabled={isDeleting}
                            className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                            title="Delete Image"
                        >
                            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            )})}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
            {images.map((img) => {
                const isDeleting = removingId === img._id;
                return (
                <div key={img._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                    <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-[8px] overflow-hidden border border-gray-200">
                        <img src={IMAGE_URL + img.image} alt="Award" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <FileImage className="w-4 h-4 text-gray-400" />
                            <span className="truncate">Image_{img._id.slice(-6)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">{img._id}</p>
                    </div>

                    <button 
                        onClick={() => handleDelete(img._id)}
                        disabled={isDeleting}
                        className="w-10 h-10 rounded-full border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        title="Delete Image"
                    >
                         {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                </div>
            )})}
        </div>
      )}
    </div>
  );
}