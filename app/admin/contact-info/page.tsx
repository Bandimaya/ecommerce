"use client"
import { useEffect, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  Loader2,
  Info,
  Image
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/constants";
import { apiFetch } from "@/lib/axios";

export default function ContactInfo() {
  const { contact, setContact, loading } = useSettings();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    address: "",
    hours: ""
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync form with context
  useEffect(() => {
    if (contact) {
      setForm({
        email: contact.email || "",
        phone: contact.phone || "",
        address: contact.address || "",
        hours: contact.hours || ""
      });

      setLogoPreview((apiUrl.replace('/api', '') + contact.logo_url) || "");
    }
  }, [contact]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast({ title: "Please upload a valid image file" });
    }

    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.email || !form.phone) {
      return toast({ title: "Email and phone are required" });
    }

    try {
      setSaving(true);

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

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
      <div className="max-w-4xl mx-auto p-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Fetching contact details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
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

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Image className="w-3.5 h-3.5" /> Branding Logo
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No logo</span>
                    )}
                  </div>

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleLogoChange}
                    />
                    <span className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Upload Logo
                    </span>
                  </label>
                </div>

                <p className="text-xs text-gray-400">
                  PNG, JPG, SVG • Recommended size: 512×512
                </p>
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
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              {/* Hours */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Operating Hours
                </label>
                <input
                  name="hours"
                  value={form.hours}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <Info className="w-3 h-3" /> Auto-updates website footer
              </div>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white transition ${saving
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Preview */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 sticky top-6 space-y-4">
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Brand Logo"
                className="w-24 h-24 object-contain"
              />
            )}
            <p className="text-sm">{form.email || "No email set"}</p>
            <p className="text-sm">{form.phone || "No phone set"}</p>
            <p className="text-sm whitespace-pre-line">
              {form.address || "No address set"}
            </p>
            <p className="text-sm">{form.hours || "Hours not set"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
