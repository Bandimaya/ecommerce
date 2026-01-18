"use client";
import { useEffect, useState, useCallback } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  Info,
  Image as ImageIcon,
  X,
  Check,
  ZoomIn,
  RotateCcw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import AdminButton from "@/components/admin/AdminButton";
import Cropper from "react-easy-crop";
import { IMAGE_URL } from "@/lib/constants";
import { SkeletonAvatar, SkeletonText, SkeletonLine, Skeleton } from "@/components/ui/skeleton";

// --- Utility: Create an HTML Image Element ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

// --- Utility: Generate the cropped file ---
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set canvas size to the cropped area size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return as a File object
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      const file = new File([blob], "logo-cropped.jpg", { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg", 0.95); // 95% quality JPG
  });
}

export default function ContactInfo() {
  const { contact, setContact, loading }: any = useSettings();

  // --- Form State ---
  const [form, setForm] = useState({
    email: "",
    india: {
      phone: "",
      whatsapp: "",
      address: "",
      hours: ""
    },
    overseas: {
      phone: "",
      whatsapp: "",
      address: "",
      hours: ""
    }
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // --- Cropper State ---
  const [cropImage, setCropImage] = useState<string | null>(null); // The raw uploaded image
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Sync form with context
  useEffect(() => {
    if (contact) {
      setForm({
        email: contact?.email,
        india: {
          phone: contact.india?.phone || "",
          whatsapp: contact.india?.whatsapp || "",
          address: contact.india?.address || "",
          hours: contact.india?.hours || "",
        },
        overseas: {
          phone: contact.overseas?.phone || "",
          whatsapp: contact.overseas?.whatsapp || "",
          address: contact.overseas?.address || "",
          hours: contact.overseas?.hours || "",
        },
      });

      // Logo preview
      setLogoPreview(
        contact.logo_url ? `${IMAGE_URL}${contact.logo_url}` : ""
      );
    }
  }, [contact]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 1. User selects a file -> Read it and open Cropper
  const handleLogoSelect = async (e: any) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0] as File;
    if (!file.type.startsWith("image/")) {
      return toast({ title: "Please upload a valid image file" });
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setCropImage(reader.result as string);
      setIsCropOpen(true);
      setZoom(1);
    });
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again if needed
    input.value = "";
  };

  // 2. Store coordinates when user moves crop box
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 3. User clicks "Done" -> Generate file and set preview
  const performCrop = async () => {
    try {
      if (!cropImage || !croppedAreaPixels) return;

      const croppedFile = await getCroppedImg(cropImage, croppedAreaPixels);

      setLogo(croppedFile);
      setLogoPreview(URL.createObjectURL(croppedFile));
      setIsCropOpen(false); // Close modal
      setCropImage(null); // Clear raw image
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to crop image" });
    }
  };

  const cancelCrop = () => {
    setIsCropOpen(false);
    setCropImage(null);
  };

  const handleSubmit = async () => {
    if (!form.india?.phone || !form.india?.whatsapp) {
      return toast({ title: "India phone & WhatsApp are required" });
    }

    try {
      setSaving(true);
      const data = new FormData();

      // Flatten nested form data
      Object.entries(form).forEach(([section, values]) => {
        Object.entries(values as Record<string, string>).forEach(
          ([field, value]) => {
            data.append(`${section}.${field}`, value || "");
          }
        );
      });

      // Logo
      if (logo) {
        data.append("logo", logo);
      }

      const res = await apiFetch("/contact", {
        method: "PUT",
        data,
      });

      setContact(res);
      toast({ title: "Contact info updated successfully" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to update contact info" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-xl shadow-blue-900/5 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <SkeletonAvatar />
                  <div className="flex-1 space-y-2">
                    <SkeletonText className="w-1/2" />
                    <SkeletonLine />
                    <SkeletonLine />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-xl shadow-blue-900/5 border border-gray-100 rounded-2xl overflow-hidden p-6">
            <SkeletonText className="w-3/4" />
            <div className="mt-4 space-y-2">
              <SkeletonLine />
              <SkeletonLine />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleNestedChange = (e: any) => {
    const { name, value } = e.target;
    const [section, field] = name.split(".");

    setForm((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Contact Information
        </h1>
        <p className="text-gray-500 mt-2">
          These details appear in your website footer and contact pages.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-xl shadow-blue-900/5 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="p-6 space-y-6">

              {/* Logo Upload Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Branding Logo
                </label>

                <div className="flex items-center gap-4">
                  {/* Preview Circle */}
                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 group">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No logo</span>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer inline-flex">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleLogoSelect}
                      />
                      <AdminButton className="px-4 py-2 text-sm font-semibold rounded-lg">
                        Upload New
                      </AdminButton>
                    </label>
                    <p className="text-xs text-gray-400">
                      We'll ask you to crop it to a circle.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Support Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider">
                  🇮🇳 India Contact Details
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Phone Number (India)
                  </label>
                  <input
                    name="india.phone"
                    value={form.india.phone}
                    onChange={handleNestedChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> WhatsApp Number (India)
                  </label>
                  <input
                    name="india.whatsapp"
                    value={form.india.whatsapp}
                    onChange={handleNestedChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Address (India)
                  </label>
                  <textarea
                    name="india.address"
                    value={form.india.address}
                    onChange={handleNestedChange}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Operating Hours (India)
                  </label>
                  <input
                    name="india.hours"
                    value={form.india.hours}
                    onChange={handleNestedChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>
              </div>


              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wider">
                  🌍 Overseas Contact Details
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Phone Number (Overseas)
                  </label>
                  <input
                    name="overseas.phone"
                    value={form.overseas.phone}
                    onChange={handleNestedChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> WhatsApp Number (Overseas)
                  </label>
                  <input
                    name="overseas.whatsapp"
                    value={form.overseas.whatsapp}
                    onChange={handleNestedChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Address (Overseas)
                  </label>
                  <textarea
                    name="overseas.address"
                    value={form.overseas.address}
                    onChange={handleNestedChange}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Operating Hours (Overseas)
                  </label>
                  <input
                    name="overseas.hours"
                    value={form.overseas.hours}
                    onChange={handleNestedChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <Info className="w-3 h-3" /> Auto-updates website footer
              </div>
              <AdminButton onClick={handleSubmit} loading={saving} className="px-8 py-2.5 rounded-xl font-bold">
                {saving ? (
                  <>
                    <Skeleton className="w-4 h-4 rounded-full" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </AdminButton>
            </div>
          </div>
        </div>

        {/* Sidebar Preview */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 sticky top-6 space-y-4">
            <h3 className="text-blue-900 font-bold text-sm uppercase tracking-wide">Live Preview</h3>

            <div className="flex items-center gap-3">
              {/* Preview in Sidebar as Circle */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-blue-200 shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Brand Logo"
                    className="w-full h-full object-cover"
                  />
                ) : <div className="w-full h-full bg-blue-100" />}
              </div>
              <div>
                <p className="font-bold text-gray-900">Your Brand</p>
                <p className="text-xs text-gray-500">Footer Component</p>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-blue-200/50">

              {/* 🇮🇳 INDIA */}
              <div>
                <h4 className="text-xs font-bold uppercase text-blue-700 mb-2">
                  🇮🇳 India
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-900">
                    <Phone className="w-4 h-4 opacity-50" />
                    {form.india.phone || "No phone set"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-blue-900">
                    <Phone className="w-4 h-4 opacity-50" />
                    {form.india.whatsapp || "No WhatsApp set"}
                  </div>

                  <div className="flex items-start gap-2 text-sm text-blue-900">
                    <MapPin className="w-4 h-4 opacity-50 mt-1" />
                    <span className="whitespace-pre-line">
                      {form.india.address || "No address set"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-blue-900">
                    <Clock className="w-4 h-4 opacity-50" />
                    {form.india.hours || "No hours set"}
                  </div>
                </div>
              </div>

              {/* 🌍 OVERSEAS */}
              <div className="pt-3 border-t border-blue-100">
                <h4 className="text-xs font-bold uppercase text-purple-700 mb-2">
                  🌍 Overseas
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-900">
                    <Phone className="w-4 h-4 opacity-50" />
                    {form.overseas.phone || "No phone set"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-blue-900">
                    <Phone className="w-4 h-4 opacity-50" />
                    {form.overseas.whatsapp || "No WhatsApp set"}
                  </div>

                  <div className="flex items-start gap-2 text-sm text-blue-900">
                    <MapPin className="w-4 h-4 opacity-50 mt-1" />
                    <span className="whitespace-pre-line">
                      {form.overseas.address || "No address set"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-blue-900">
                    <Clock className="w-4 h-4 opacity-50" />
                    {form.overseas.hours || "No hours set"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CROP MODAL --- */}
      {isCropOpen && cropImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-700">Adjust Logo</h3>
              <AdminButton variant="ghost" onClick={cancelCrop} className="p-1 hover:bg-gray-200 rounded-full transition cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </AdminButton>
            </div>

            {/* Cropper Container */}
            <div className="relative w-full h-80 bg-gray-900">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1} // 1:1 Aspect Ratio (Square)
                cropShape="round" // Creates the circle mask
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls */}
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <ZoomIn className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="flex gap-3">
                <AdminButton variant="ghost" onClick={cancelCrop} className="flex-1 px-4 py-2 rounded-xl">
                  Cancel
                </AdminButton>
                <AdminButton onClick={performCrop} className="flex-1 px-4 py-2 rounded-xl font-bold">
                  <Check className="w-4 h-4" /> Apply Crop
                </AdminButton>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}