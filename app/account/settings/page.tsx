"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import SettingsSkeleton from "@/components/ui/SettingsSkeleton";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { 
  Save, 
  Loader2, 
  Image as ImageIcon, 
  MapPin, 
  Lock, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Home,
  Briefcase,
  GraduationCap,
  Building2,
  AlertCircle,
  Phone // Imported Phone Icon
} from "lucide-react";

// --- Types ---

type AddressDetail = {
  doorNo: string;
  street: string;
  village: string;
  city: string;
  state: string;
  pincode: string;
};

type AddressType = 'home' | 'office' | 'school' | 'college';

type AddressErrors = {
  [key in AddressType]?: Partial<AddressDetail>;
};

export default function AccountSettings() {
  const { user, updateProfile } = useUser();
  const { toast } = useToast();

  // --- Profile State ---
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  // 1. Added Phone State
  const [phone, setPhone] = useState((user as any)?.phone?.toString() || "");
  
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  // --- Address State ---
  const [showAddressSection, setShowAddressSection] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [activeTab, setActiveTab] = useState<AddressType>('home');
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});

  // Initialize all address types
  const emptyAddress: AddressDetail = { doorNo: "", street: "", village: "", city: "", state: "", pincode: "" };
  
  const [addresses, setAddresses] = useState<Record<AddressType, AddressDetail>>({
    home: { ...emptyAddress },
    office: { ...emptyAddress },
    school: { ...emptyAddress },
    college: { ...emptyAddress },
  });

  // --- Password State ---
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [isOldPasswordVerified, setIsOldPasswordVerified] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ new?: string; confirm?: string }>({});

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      // 2. Sync Phone from User Context
      setPhone((user as any).phone?.toString() || ""); 
      setAvatarPreview(user.avatar || null);
      
      if (user.address) {
        setAddresses({
          home: { ...emptyAddress, ...user.address.home },
          office: { ...emptyAddress, ...user.address.office },
          school: { ...emptyAddress, ...user.address.school },
          college: { ...emptyAddress, ...user.address.college },
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const userLoading = (useUser() as any).loading;
  const settingsLoading = (useSettings() as any).loading;
  const themeLoading = (useTheme() as any).isLoading;

  if (userLoading || settingsLoading || themeLoading) {
    return <SettingsSkeleton />;
  }

  // --- Validation Helpers ---

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNumeric = (val: string) => /^\d+$/.test(val);
  const hasNumber = (val: string) => /\d/.test(val);
  const isAlphaOnly = (val: string) => /^[a-zA-Z\s]*$/.test(val);

  // --- Handlers: Profile ---

  const handleAvatarChange = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const f = e.target.files[0];
    if (!f.type.startsWith("image/")) return toast({ title: "Please choose an image file", variant: "destructive" });
    setAvatar(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleProfileSave = async () => {
    setProfileError("");
    
    // Name Validation
    if (!name.trim()) {
      setProfileError("Name is required");
      return;
    }
    if (name.length < 2) {
      setProfileError("Name must be at least 2 characters");
      return;
    }

    // 3. Phone Validation
    if (phone && phone.length !== 10) {
      setProfileError("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      setSavingProfile(true);
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      // 4. Append Phone to FormData
      data.append("phone", phone); 
      
      if (avatar) data.append("avatar", avatar);
      
      await updateProfile(data);
      toast({ title: "Profile updated successfully" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to update profile", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Handlers: Address ---

  const handleAddressChange = (field: keyof AddressDetail, value: string) => {
    setAddressErrors(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: undefined
      }
    }));

    if (field === 'pincode' && value && !isNumeric(value)) return;
    if ((field === 'city' || field === 'state') && !isAlphaOnly(value)) return;

    setAddresses(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const validateAddressForm = (): boolean => {
    const newErrors: AddressErrors = {};
    let isValid = true;
    const isEmptyAddress = (addr: AddressDetail) => Object.values(addr).every(x => x === "");

    (Object.keys(addresses) as AddressType[]).forEach((type) => {
      const addr = addresses[type];
      const errors: Partial<AddressDetail> = {};

      const isHome = type === 'home';
      const isPartiallyFilled = !isEmptyAddress(addr);

      if (isHome || isPartiallyFilled) {
        if (!addr.doorNo.trim()) errors.doorNo = "Door No is required";
        if (!addr.street.trim()) errors.street = "Street is required";
        if (!addr.city.trim()) errors.city = "City is required";
        if (!addr.state.trim()) errors.state = "State is required";
        
        if (!addr.pincode.trim()) {
          errors.pincode = "Pincode is required";
        } else if (addr.pincode.length < 5 || addr.pincode.length > 6) {
          errors.pincode = "Invalid length (5-6 digits)";
        }
      }

      if (Object.keys(errors).length > 0) {
        newErrors[type] = errors;
        isValid = false;
      }
    });

    setAddressErrors(newErrors);
    
    if (!isValid) {
      const errorTabs = Object.keys(newErrors).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ");
      toast({ 
        title: "Validation Error", 
        description: `Please fix errors in: ${errorTabs}`, 
        variant: "destructive" 
      });
    }

    return isValid;
  };

  const handleSaveAddresses = async () => {
    if (!validateAddressForm()) return;

    try {
      setSavingAddress(true);
      await apiFetch('/api/user/address', {
        method: 'PUT',
        body: JSON.stringify(addresses)
      });
      toast({ title: "Addresses updated successfully" });
      setAddressErrors({});
    } catch (err: any) {
      toast({ title: "Failed to update addresses", description: err.message, variant: "destructive" });
    } finally {
      setSavingAddress(false);
    }
  };

  // --- Handlers: Password ---

  const verifyOldPassword = async () => {
    if (!oldPassword) return toast({ title: "Enter your old password", variant: "destructive" });
    try {
      setVerifyingPassword(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      setIsOldPasswordVerified(true);
      toast({ title: "Password verified", description: "You can now set a new password." });
    } catch (err: any) {
      toast({ title: "Incorrect password", variant: "destructive" });
      setIsOldPasswordVerified(false);
    } finally {
      setVerifyingPassword(false);
    }
  };

  const handleChangePassword = async () => {
    const errors: { new?: string; confirm?: string } = {};
    let valid = true;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!strongPasswordRegex.test(newPassword)) {
      errors.new = "Password must comprise 8+ chars, uppercase, number & special char.";
      valid = false;
    }

    if (newPassword !== confirmPassword) {
      errors.confirm = "Passwords do not match";
      valid = false;
    }

    setPasswordErrors(errors);
    if (!valid) return;

    try {
      setChangingPassword(true);
      await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      toast({ title: "Password changed successfully" });
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      setIsOldPasswordVerified(false); setShowPasswordSection(false);
      setPasswordErrors({});
    } catch (err: any) {
      toast({ title: "Failed to change password", description: err.message, variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  const tabs: { id: AddressType, label: string, icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'office', label: 'Office', icon: Briefcase },
    { id: 'school', label: 'School', icon: GraduationCap },
    { id: 'college', label: 'College', icon: Building2 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-foreground">
      <h1 className="text-3xl font-black mb-6 text-foreground">Settings</h1>

      {/* --- Section 1: Basic Profile --- */}
      <section className="w-full bg-card bg-white border border-border rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold mb-4 text-xl flex items-center gap-2 text-foreground">
          <ImageIcon className="w-5 h-5 text-muted-foreground" /> General Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-muted shadow-inner">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-sm text-muted-foreground">No avatar</div>
              )}
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2 transition-transform hover:scale-105">
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              <span className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80">Change Photo</span>
            </label>
          </div>

          <div className="md:col-span-2 space-y-4">
            {/* Name Field */}
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Full Name <span className="text-destructive">*</span></label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={`w-full bg-background border text-foreground rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-ring outline-none transition-all ${profileError && !name.trim() ? 'border-destructive' : 'border-input'}`} 
              />
            </div>

            {/* Email Field (Read Only) */}
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Email Address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-muted border border-input text-muted-foreground rounded-lg px-4 py-2 mt-1 outline-none cursor-not-allowed" disabled />
            </div>

            {/* Mobile Number Field (New) */}
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3" /> Mobile Number
              </label>
              <input 
                value={phone} 
                type="tel"
                maxLength={10}
                placeholder="e.g. 9876543210"
                onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || isNumeric(val)) setPhone(val);
                }} 
                className={`w-full bg-background border text-foreground rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-ring outline-none transition-all ${profileError && phone.length !== 10 ? 'border-destructive' : 'border-input'}`} 
              />
            </div>

            {/* General Error Message */}
            {profileError && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {profileError}</p>}

            <div className="pt-2">
              <button onClick={handleProfileSave} disabled={savingProfile} className={`px-6 py-2.5 rounded-xl text-primary-foreground font-semibold shadow-md transition-all ${savingProfile ? 'bg-muted text-muted-foreground' : 'bg-primary hover:bg-primary/90'}`}>
                {savingProfile ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Saving...</span> : <span className="flex items-center gap-2"><Save className="w-4 h-4"/> Save Changes</span>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Address Management --- */}
      <section className="w-full bg-card border bg-white  border-border rounded-lg overflow-hidden shadow-sm">
        <button 
          onClick={() => setShowAddressSection(!showAddressSection)}
          className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <h2 className="font-semibold text-xl flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-muted-foreground" /> Address Details
          </h2>
          {showAddressSection ? <ChevronUp className="w-5 h-5 text-muted-foreground"/> : <ChevronDown className="w-5 h-5 text-muted-foreground"/>}
        </button>

        {showAddressSection && (
          <div className="p-6 pt-0 border-t border-border bg-muted/20">
            {/* Address Type Tabs */}
            <div className="flex flex-wrap gap-2 mt-6 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const hasError = !!addressErrors[tab.id];

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border relative
                      ${isActive 
                        ? 'bg-primary text-primary-foreground border-primary shadow-md transform scale-105' 
                        : 'bg-card text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground'
                      }
                      ${hasError && !isActive ? 'border-destructive/50 text-destructive' : ''}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'} ${hasError && !isActive ? 'text-destructive' : ''}`} />
                    {tab.label}
                    {hasError && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full" />}
                  </button>
                )
              })}
            </div>

            {/* Dynamic Address Fields for Active Tab */}
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="mb-4 flex items-center justify-between">
                 <h3 className="font-bold text-foreground capitalize flex items-center gap-2">
                   {activeTab} Address
                   {activeTab === 'home' && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-normal">Mandatory</span>}
                 </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Door No */}
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Door No / Flat No <span className="text-destructive">*</span></label>
                  <input 
                    value={addresses[activeTab].doorNo}
                    onChange={(e) => handleAddressChange('doorNo', e.target.value)}
                    className={`w-full bg-background border text-foreground rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-ring outline-none ${addressErrors[activeTab]?.doorNo ? 'border-destructive' : 'border-input'}`}
                    placeholder="e.g. 12-B"
                  />
                  {addressErrors[activeTab]?.doorNo && <p className="text-xs text-destructive mt-1">{addressErrors[activeTab]?.doorNo}</p>}
                </div>

                {/* Street */}
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Street Name <span className="text-destructive">*</span></label>
                  <input 
                    value={addresses[activeTab].street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className={`w-full bg-background border text-foreground rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-ring outline-none ${addressErrors[activeTab]?.street ? 'border-destructive' : 'border-input'}`}
                    placeholder="e.g. Main Road"
                  />
                  {addressErrors[activeTab]?.street && <p className="text-xs text-destructive mt-1">{addressErrors[activeTab]?.street}</p>}
                </div>

                {/* Village / Area */}
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Village / Area</label>
                  <input 
                    value={addresses[activeTab].village}
                    onChange={(e) => handleAddressChange('village', e.target.value)}
                    className="w-full bg-background border border-input text-foreground rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-ring outline-none"
                    placeholder="e.g. Downtown"
                  />
                </div>

                 {/* Pincode (Number Validation) */}
                 <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Pincode <span className="text-destructive">*</span></label>
                  <input 
                    value={addresses[activeTab].pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    maxLength={6}
                    className={`w-full bg-background border text-foreground rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-ring outline-none ${addressErrors[activeTab]?.pincode ? 'border-destructive' : 'border-input'}`}
                    placeholder="e.g. 500001"
                  />
                  {addressErrors[activeTab]?.pincode ? (
                    <p className="text-xs text-destructive mt-1">{addressErrors[activeTab]?.pincode}</p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground mt-1">Numbers only</p>
                  )}
                </div>

                {/* City (Alpha Validation) */}
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">City <span className="text-destructive">*</span></label>
                  <input 
                    value={addresses[activeTab].city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className={`w-full bg-background border text-foreground rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-ring outline-none ${addressErrors[activeTab]?.city ? 'border-destructive' : 'border-input'}`}
                    placeholder="e.g. New York"
                  />
                   {addressErrors[activeTab]?.city ? (
                    <p className="text-xs text-destructive mt-1">{addressErrors[activeTab]?.city}</p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground mt-1">Text only</p>
                  )}
                </div>

                {/* State (Alpha Validation) */}
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">State <span className="text-destructive">*</span></label>
                  <input 
                    value={addresses[activeTab].state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className={`w-full bg-background border text-foreground rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-ring outline-none ${addressErrors[activeTab]?.state ? 'border-destructive' : 'border-input'}`}
                    placeholder="e.g. NY"
                  />
                  {addressErrors[activeTab]?.state && <p className="text-xs text-destructive mt-1">{addressErrors[activeTab]?.state}</p>}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-border pt-4">
              <button 
                onClick={handleSaveAddresses}
                disabled={savingAddress}
                className="px-6 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2 shadow-lg"
              >
                 {savingAddress ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                 Save All Addresses
              </button>
            </div>
          </div>
        )}
      </section>

      {/* --- Section 3: Password & Security --- */}
      <section className="w-full bg-card border bg-white  border-border rounded-lg overflow-hidden shadow-sm">
        <button 
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <h2 className="font-semibold text-xl flex items-center gap-2 text-foreground">
            <Lock className="w-5 h-5 text-muted-foreground" /> Password & Security
          </h2>
          <span className="text-sm font-medium text-primary hover:underline">Reset Password</span>
        </button>

        {showPasswordSection && (
          <div className="p-6 pt-0 border-t border-border bg-muted/20">
            <div className="max-w-md mx-auto mt-6 space-y-4">
              <div className={`transition-opacity duration-300 ${isOldPasswordVerified ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Current Password</label>
                <div className="flex gap-2 mt-1">
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} disabled={isOldPasswordVerified} className="flex-1 bg-background border border-input text-foreground rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none" placeholder="Enter current password" />
                  {!isOldPasswordVerified && (
                    <button onClick={verifyOldPassword} disabled={verifyingPassword || !oldPassword} className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
                      {verifyingPassword ? <Loader2 className="w-4 h-4 animate-spin"/> : "Verify"}
                    </button>
                  )}
                  {isOldPasswordVerified && <div className="px-3 py-2 text-green-600 flex items-center gap-1 font-medium"><CheckCircle className="w-5 h-5"/> Verified</div>}
                </div>
              </div>

              {isOldPasswordVerified && (
                <div className="animate-in fade-in slide-in-from-top-4 space-y-4 pt-4 border-t border-dashed border-border">
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordErrors(prev => ({ ...prev, new: undefined }));
                      }} 
                      className={`w-full bg-background border text-foreground rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-ring outline-none ${passwordErrors.new ? 'border-destructive' : 'border-input'}`} 
                      placeholder="Min. 8 chars, 1 Upper, 1 Special" 
                    />
                    {passwordErrors.new && <p className="text-xs text-destructive mt-1">{passwordErrors.new}</p>}
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordErrors(prev => ({ ...prev, confirm: undefined }));
                      }} 
                      className={`w-full bg-background border rounded-lg px-4 py-2 mt-1 focus:ring-2 outline-none ${passwordErrors.confirm ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'}`} 
                      placeholder="Re-enter new password" 
                    />
                    {passwordErrors.confirm && <p className="text-xs text-destructive mt-1">{passwordErrors.confirm}</p>}
                  </div>

                  <button onClick={handleChangePassword} disabled={changingPassword || !newPassword || !confirmPassword} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md mt-2">
                    {changingPassword ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Updating...</span> : "Confirm Change Password"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}