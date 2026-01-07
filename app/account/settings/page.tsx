"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import SettingsSkeleton from "@/components/ui/SettingsSkeleton";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { Save, Loader2, RefreshCw, Image as ImageIcon } from "lucide-react";

export default function AccountSettings() {
  const { user, updateProfile } = useUser();  
  const { toast } = useToast();

  // Profile form
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setAvatarPreview(user?.avatar || null);
  }, [user]);

  // If any major provider is still loading, show skeletons
  const anyLoading = !!(user === null && user !== undefined ? true : false); // placeholder, replaced below

  // Replace anyLoading with actual flags using hooks
  const userLoading = (useUser() as any).loading;
  const settingsLoading = (useSettings() as any).loading;
  const themeLoading = (useTheme() as any).isLoading;

  if (userLoading || settingsLoading || themeLoading) {
    return <SettingsSkeleton />;
  }

  const handleAvatarChange = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const f = e.target.files[0];
    if (!f.type.startsWith("image/")) return toast({ title: "Please choose an image file" });
    setAvatar(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleProfileSave = async () => {
    try {
      setSavingProfile(true);
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      if (avatar) data.append("avatar", avatar);

      await updateProfile(data);
      toast({ title: "Profile updated" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to update profile" });
    } finally {
      setSavingProfile(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-6">Settings</h1>

      <section className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-sm text-gray-400">No avatar</div>
              )}
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2">
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              <span className="px-3 py-1 rounded bg-slate-100 text-sm">Upload avatar</span>
            </label>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <button onClick={handleProfileSave} disabled={savingProfile} className={`px-4 py-2 rounded-xl text-white font-semibold ${savingProfile ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'}`}>
                {savingProfile ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Saving…</span> : <><Save className="w-4 h-4 mr-2 inline"/> Save Profile</>}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
