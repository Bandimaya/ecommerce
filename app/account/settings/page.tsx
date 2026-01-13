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
  Phone,
  Globe,
  Mail,
  User,
  Plus,
  X 
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

type NewAddressForm = {
  city: string;
  zone: string;
  street: string;
  building: string;
  country: string;
  type: 'Home' | 'Work';
  mobileCode: string;
  mobileNumber: string;
  name: string;
  email: string;
};

export default function AccountSettings() {
  const { user, updateProfile } = useUser();
  const { toast } = useToast();

  // --- Profile State ---
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
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

  // --- POPUP MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState(""); 
  const emptyAddress: AddressDetail = { doorNo: "", street: "", village: "", city: "", state: "", pincode: "" };
  
  const [newPopupAddress, setNewPopupAddress] = useState<AddressDetail>({ ...emptyAddress });

  // --- NEW: Add New Address Form State ---
  const [showNewAddressForm, setShowNewAddressForm] = useState(true); 
  const [newAddrData, setNewAddrData] = useState<NewAddressForm>({
    city: "",
    zone: "",
    street: "",
    building: "",
    country: "QATAR",
    type: "Home",
    mobileCode: "+974",
    mobileNumber: "",
    name: "",
    email: ""
  });

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
      setPhone((user as any).phone?.toString() || "");
      setAvatarPreview(user.avatar || null);

      setNewAddrData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        mobileNumber: (user as any).phone?.toString() || ""
      }));

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

  // --- Validation Helpers ---
  const isNumeric = (val: string) => /^\d+$/.test(val);

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
    if (!name.trim()) { setProfileError("Name is required"); return; }
    if (name.length < 2) { setProfileError("Name must be at least 2 characters"); return; }
    if (phone && phone.length !== 10) { setProfileError("Mobile number must be exactly 10 digits"); return; }

    try {
      setSavingProfile(true);
      let payload = {
        name: name,
        email: email,
        phone: phone
      }
      await updateProfile(payload);
      toast({ title: "Profile updated successfully" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to update profile", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Handlers: Address ---
  const handleAddressChange = (field: keyof AddressDetail, value: string) => {
    setAddressErrors(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: undefined } }));
    if (field === 'pincode' && value && !isNumeric(value)) return;
    setAddresses(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: value } }));
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
        if (!addr.pincode.trim()) { errors.pincode = "Pincode is required"; }
        else if (addr.pincode.length < 5 || addr.pincode.length > 6) { errors.pincode = "Invalid length"; }
      }

      if (Object.keys(errors).length > 0) {
        newErrors[type] = errors;
        isValid = false;
      }
    });

    setAddressErrors(newErrors);
    if (!isValid) toast({ title: "Validation Error", description: "Please fix address errors.", variant: "destructive" });
    return isValid;
  };

  const handleSaveAddresses = async () => {
    if (!validateAddressForm()) return;
    try {
      setSavingAddress(true);
      await apiFetch(`/users/${user?.email}/addresses`, { method: 'PUT', data: addresses });
      toast({ title: "Addresses updated successfully" });
      setAddressErrors({});
    } catch (err: any) {
      toast({ title: "Failed to update addresses", description: err.message, variant: "destructive" });
    } finally {
      setSavingAddress(false);
    }
  };

  // --- Handlers: POPUP MODAL ---
  const handleOpenModal = () => {
    setNewAddressLabel("");
    setNewPopupAddress({ ...emptyAddress });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePopupAddressChange = (field: keyof AddressDetail, value: string) => {
    if (field === 'pincode' && value && !isNumeric(value)) return;
    setNewPopupAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePopupAddress = () => {
    if (!newAddressLabel) return toast({title: "Please label this address (e.g. Home 2)", variant: "destructive"});
    if (!newPopupAddress.city || !newPopupAddress.doorNo || !newPopupAddress.street) {
      return toast({ title: "Missing Fields", description: "Door No, Street and City are required.", variant: "destructive" });
    }

    console.log("Saving Popup Address:", { label: newAddressLabel, ...newPopupAddress });
    toast({ title: "Address Added", description: `${newAddressLabel} has been saved.` });
    handleCloseModal();
  };

  // --- Handler: NEW Image Based Form (Section 3) ---
  const handleNewAddressChange = (field: keyof NewAddressForm, value: string) => {
    setNewAddrData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNewAddressForm = async () => {
    if (!newAddrData.city || !newAddrData.street || !newAddrData.mobileNumber || !newAddrData.name) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    console.log("Saving new address:", newAddrData);
    toast({ title: "Address Added", description: "New address saved successfully." });
  };

  // --- Handlers: Password ---
  const verifyOldPassword = async () => {
    if (!oldPassword) return toast({ title: "Enter your old password", variant: "destructive" });
    apiFetch('/auth/login', {
      method: 'POST',
      data: {
        email: user?.email,
        password: oldPassword
      }
    }).then(async (res) => {
      if (res.token) {
        setVerifyingPassword(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsOldPasswordVerified(true);
        toast({ title: "Password verified", description: "You can now set a new password." });
      }
    }).catch((err) => {
      console.error("error: ", err);
      toast({ title: "Incorrect password", variant: "destructive" });
      setIsOldPasswordVerified(false);
    }).finally(() => {
      setVerifyingPassword(false);
    })
  };

  const handleChangePassword = async () => {
    const errors: { new?: string; confirm?: string } = {};
    let valid = true;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(newPassword)) { errors.new = "Password must comprise 8+ chars, uppercase, number & special char."; valid = false; }
    if (newPassword !== confirmPassword) { errors.confirm = "Passwords do not match"; valid = false; }

    setPasswordErrors(errors);
    if (!valid) return;

    try {
      setChangingPassword(true);
      apiFetch('/auth/reset-password', { method: 'POST', data: { email: user?.email, curr_pass: oldPassword, new_pass: newPassword } })
        .then((res) => {
          if (res.message === 'Password has been updated successfully') {
            toast({ title: "Password changed successfully" });
            setOldPassword(""); setNewPassword(""); setConfirmPassword("");
            setIsOldPasswordVerified(false); setShowPasswordSection(false);
            setPasswordErrors({});
          }
        })
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

  // --- Styles ---
  // Shared styles to ensure consistency across all forms (Main, Popup, New Form)
  const labelStyle = "text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1 block";
  const inputStyle = "w-full bg-background border border-input text-foreground rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all";
  const selectStyle = "w-full bg-background border border-input text-foreground rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all appearance-none";
  const primaryBtnStyle = "px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2";

  if (userLoading || settingsLoading || themeLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-foreground relative">
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
            <div>
              <label className={labelStyle}>Full Name <span className="text-destructive">*</span></label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputStyle} ${profileError && !name.trim() ? 'border-destructive' : ''}`} />
            </div>
            <div>
              <label className={labelStyle}>Email Address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputStyle} bg-muted text-muted-foreground cursor-not-allowed`} disabled />
            </div>
            <div>
              <label className={labelStyle}>Mobile Number</label>
              <input value={phone} type="tel" maxLength={10} placeholder="e.g. 9876543210" onChange={(e) => { const val = e.target.value; if (val === "" || isNumeric(val)) setPhone(val); }} className={`${inputStyle} ${profileError && phone.length !== 10 ? 'border-destructive' : ''}`} />
            </div>
            {profileError && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {profileError}</p>}
            <div className="pt-2">
              <button onClick={handleProfileSave} disabled={savingProfile} className={primaryBtnStyle}>
                {savingProfile ? <> <Loader2 className="w-4 h-4 animate-spin" /> Saving... </> : <> <Save className="w-4 h-4" /> Save Changes </>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Existing Address Management --- */}
      <section className="w-full bg-card border bg-white border-border rounded-lg overflow-hidden shadow-sm">
        <div className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setShowAddressSection(!showAddressSection)}>
          <div className="flex items-center gap-4">
             <h2 className="font-semibold text-xl flex items-center gap-2 text-foreground"><MapPin className="w-5 h-5 text-muted-foreground" /> Address Details (Existing)</h2>
             
             {/* Add New Address Button */}
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal();
                }}
                className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:bg-primary/90 transition shadow-sm z-10"
             >
                <Plus className="w-3 h-3" /> Add New Address
             </button>
          </div>
          {showAddressSection ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>

        {showAddressSection && (
          <div className="p-6 pt-0 border-t border-border bg-muted/20">
            <div className="flex flex-wrap gap-2 mt-6 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const hasError = !!addressErrors[tab.id];
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border relative ${isActive ? 'bg-primary text-primary-foreground border-primary shadow-md transform scale-105' : 'bg-card text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground'} ${hasError && !isActive ? 'border-destructive/50 text-destructive' : ''}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'} ${hasError && !isActive ? 'text-destructive' : ''}`} /> {tab.label} {hasError && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full" />}
                  </button>
                )
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Door No / Flat No <span className="text-destructive">*</span></label>
                <input value={addresses[activeTab].doorNo} onChange={(e) => handleAddressChange('doorNo', e.target.value)} className={`${inputStyle} ${addressErrors[activeTab]?.doorNo ? 'border-destructive' : ''}`} placeholder="e.g. 12-B" />
              </div>
              <div>
                <label className={labelStyle}>Street Name <span className="text-destructive">*</span></label>
                <input value={addresses[activeTab].street} onChange={(e) => handleAddressChange('street', e.target.value)} className={`${inputStyle} ${addressErrors[activeTab]?.street ? 'border-destructive' : ''}`} placeholder="e.g. Main Road" />
              </div>
              <div>
                <label className={labelStyle}>Village / Area</label>
                <input value={addresses[activeTab].village} onChange={(e) => handleAddressChange('village', e.target.value)} className={inputStyle} placeholder="e.g. Downtown" />
              </div>
              <div>
                <label className={labelStyle}>Pincode <span className="text-destructive">*</span></label>
                <input value={addresses[activeTab].pincode} onChange={(e) => handleAddressChange('pincode', e.target.value)} maxLength={6} className={`${inputStyle} ${addressErrors[activeTab]?.pincode ? 'border-destructive' : ''}`} placeholder="e.g. 500001" />
              </div>
              <div>
                <label className={labelStyle}>City <span className="text-destructive">*</span></label>
                <input value={addresses[activeTab].city} onChange={(e) => handleAddressChange('city', e.target.value)} className={`${inputStyle} ${addressErrors[activeTab]?.city ? 'border-destructive' : ''}`} placeholder="e.g. New York" />
              </div>
              <div>
                <label className={labelStyle}>State <span className="text-destructive">*</span></label>
                <input value={addresses[activeTab].state} onChange={(e) => handleAddressChange('state', e.target.value)} className={`${inputStyle} ${addressErrors[activeTab]?.state ? 'border-destructive' : ''}`} placeholder="e.g. NY" />
              </div>
            </div>
            <div className="mt-8 flex justify-end border-t border-border pt-4">
              <button onClick={handleSaveAddresses} disabled={savingAddress} className="px-6 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2 shadow-lg">
                {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Address        
              </button>
            </div>
          </div>
        )}
      </section>

      {/* --- Section 3: NEW ADDRESS FORM (STYLED TO MATCH MAIN SCREEN) --- */}
      <section className="w-full bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <button onClick={() => setShowNewAddressForm(!showNewAddressForm)} className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex flex-col items-start">
            <h2 className="font-semibold text-xl flex items-center gap-2 text-foreground"><MapPin className="w-5 h-5 text-muted-foreground" /> Detailed Address Form</h2>
            <p className="text-sm text-muted-foreground ml-7">Add specific location details</p>
          </div>
          {showNewAddressForm ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>

        {showNewAddressForm && (
          <div className="p-6 pt-0 border-t border-border mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

              {/* Left Column: Location Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>City</label>
                    <select
                      value={newAddrData.city}
                      onChange={(e) => handleNewAddressChange('city', e.target.value)}
                      className={selectStyle}
                    >
                      <option value="">Select City</option>
                      <option value="Doha">Doha</option>
                      <option value="Al Rayyan">Al Rayyan</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelStyle}>Zone Name/Number</label>
                    <select
                      value={newAddrData.zone}
                      onChange={(e) => handleNewAddressChange('zone', e.target.value)}
                      className={selectStyle}
                    >
                      <option value="">Select Zone</option>
                      <option value="Zone 1">Zone 1</option>
                      <option value="Zone 55">Zone 55</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Street Name / No</label>
                    <input
                      value={newAddrData.street}
                      onChange={(e) => handleNewAddressChange('street', e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Building Name / No</label>
                    <input
                      value={newAddrData.building}
                      onChange={(e) => handleNewAddressChange('building', e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      value={newAddrData.country}
                      onChange={(e) => handleNewAddressChange('country', e.target.value)}
                      className={`${inputStyle} pl-10 uppercase`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Address Type</label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer bg-muted px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors">
                      <input
                        type="radio"
                        name="addressType"
                        checked={newAddrData.type === 'Home'}
                        onChange={() => handleNewAddressChange('type', 'Home')}
                        className="w-4 h-4 text-primary border-input focus:ring-primary"
                      />
                      <span className="font-medium text-sm">Home</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-muted px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors">
                      <input
                        type="radio"
                        name="addressType"
                        checked={newAddrData.type === 'Work'}
                        onChange={() => handleNewAddressChange('type', 'Work')}
                        className="w-4 h-4 text-primary border-input focus:ring-primary"
                      />
                      <span className="font-medium text-sm">Work</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2 mb-4">Personal Information</h3>

                <div>
                  <label className={labelStyle}>Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="w-20 bg-muted border border-input rounded-lg flex items-center justify-center text-sm font-medium text-muted-foreground">
                      {newAddrData.mobileCode}
                    </div>
                    <input
                      value={newAddrData.mobileNumber}
                      onChange={(e) => handleNewAddressChange('mobileNumber', e.target.value)}
                      className={inputStyle}
                      placeholder="50580237"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      value={newAddrData.name}
                      onChange={(e) => handleNewAddressChange('name', e.target.value)}
                      className={`${inputStyle} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      value={newAddrData.email}
                      onChange={(e) => handleNewAddressChange('email', e.target.value)}
                      className={`${inputStyle} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-border pt-4">
              <button
                onClick={handleSaveNewAddressForm}
                className={primaryBtnStyle}
              >
                <Save className="w-4 h-4" /> Save New Address
              </button>
            </div>
          </div>
        )}
      </section>

      {/* --- Section 4: Password & Security --- */}
      <section className="w-full bg-card border bg-white border-border rounded-lg overflow-hidden shadow-sm">
        <button onClick={() => setShowPasswordSection(!showPasswordSection)} className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <h2 className="font-semibold text-xl flex items-center gap-2 text-foreground"><Lock className="w-5 h-5 text-muted-foreground" /> Password & Security</h2>
          <span className="text-sm font-medium text-primary hover:underline">Reset Password</span>
        </button>

        {showPasswordSection && (
          <div className="p-6 pt-0 border-t border-border bg-muted/20">
            <div className="max-w-md mx-auto mt-6 space-y-4">
              <div className={`transition-opacity duration-300 ${isOldPasswordVerified ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <label className={labelStyle}>Current Password</label>
                <div className="flex gap-2 mt-1">
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} disabled={isOldPasswordVerified} className={inputStyle} placeholder="Enter current password" />
                  {!isOldPasswordVerified && (
                    <button onClick={verifyOldPassword} disabled={verifyingPassword || !oldPassword} className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
                      {verifyingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                    </button>
                  )}
                  {isOldPasswordVerified && <div className="px-3 py-2 text-green-600 flex items-center gap-1 font-medium"><CheckCircle className="w-5 h-5" /> Verified</div>}
                </div>
              </div>

              {isOldPasswordVerified && (
                <div className="animate-in fade-in slide-in-from-top-4 space-y-4 pt-4 border-t border-dashed border-border">
                  <div>
                    <label className={labelStyle}>New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors(prev => ({ ...prev, new: undefined })); }} className={`${inputStyle} ${passwordErrors.new ? 'border-destructive' : ''}`} placeholder="Min. 8 chars, 1 Upper, 1 Special" />
                    {passwordErrors.new && <p className="text-xs text-destructive mt-1">{passwordErrors.new}</p>}
                  </div>
                  <div>
                    <label className={labelStyle}>Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors(prev => ({ ...prev, confirm: undefined })); }} className={`${inputStyle} ${passwordErrors.confirm ? 'border-destructive' : ''}`} placeholder="Re-enter new password" />
                    {passwordErrors.confirm && <p className="text-xs text-destructive mt-1">{passwordErrors.confirm}</p>}
                  </div>
                  <button onClick={handleChangePassword} disabled={changingPassword || !newPassword || !confirmPassword} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md mt-2">
                    {changingPassword ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Updating...</span> : "Confirm Change Password"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* --- POPUP MODAL COMPONENT (STYLED TO MATCH MAIN SCREEN) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           {/* Modal Container */}
           <div className="bg-card bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-border transform transition-all scale-100">
             
             {/* Header */}
             <div className="bg-muted/20 px-6 py-4 flex items-center justify-between border-b border-border">
                 <h3 className="text-lg font-bold text-foreground">Add New Address</h3>
                 <button onClick={handleCloseModal} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-5 h-5" />
                 </button>
             </div>

             {/* Body */}
             <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                 
                 {/* Address Label / Type */}
                 <div>
                    <label className={labelStyle}>Address Label <span className="text-destructive">*</span></label>
                    <input 
                      value={newAddressLabel} 
                      onChange={(e) => setNewAddressLabel(e.target.value)} 
                      className={inputStyle} 
                      placeholder="e.g. Home 2, Office 3" 
                    />
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className={labelStyle}>Door No / Flat No <span className="text-destructive">*</span></label>
                     <input value={newPopupAddress.doorNo} onChange={(e) => handlePopupAddressChange('doorNo', e.target.value)} className={inputStyle} placeholder="e.g. 12-B" />
                   </div>
                   <div>
                     <label className={labelStyle}>Street Name <span className="text-destructive">*</span></label>
                     <input value={newPopupAddress.street} onChange={(e) => handlePopupAddressChange('street', e.target.value)} className={inputStyle} placeholder="e.g. Main Road" />
                   </div>
                   <div>
                     <label className={labelStyle}>Village / Area</label>
                     <input value={newPopupAddress.village} onChange={(e) => handlePopupAddressChange('village', e.target.value)} className={inputStyle} placeholder="e.g. Downtown" />
                   </div>
                   <div>
                     <label className={labelStyle}>Pincode</label>
                     <input value={newPopupAddress.pincode} onChange={(e) => handlePopupAddressChange('pincode', e.target.value)} maxLength={6} className={inputStyle} placeholder="e.g. 500001" />
                   </div>
                   <div>
                     <label className={labelStyle}>City <span className="text-destructive">*</span></label>
                     <input value={newPopupAddress.city} onChange={(e) => handlePopupAddressChange('city', e.target.value)} className={inputStyle} placeholder="e.g. New York" />
                   </div>
                   <div>
                     <label className={labelStyle}>State</label>
                     <input value={newPopupAddress.state} onChange={(e) => handlePopupAddressChange('state', e.target.value)} className={inputStyle} placeholder="e.g. NY" />
                   </div>
                 </div>
             </div>

             {/* Footer */}
             <div className="bg-muted/20 px-6 py-4 flex justify-end gap-3 border-t border-border">
                 <button onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                   Cancel
                 </button>
                 <button onClick={handleSavePopupAddress} className={primaryBtnStyle}>
                    <Save className="w-4 h-4" /> Save New Address
                 </button>
             </div>

           </div>
        </div>
      )}

    </div>
  );
}