"use client";

import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import ChangePasswordForm from "./PasswordChange"; 
import imageCompression from "browser-image-compression";
import { API } from "../../axios";
import { toast } from "react-toastify";
import { 
  Loader, 
  Camera, 
  Edit2, 
  Save, 
  User, 
  Gamepad2, 
  Shield, 
  Smartphone, 
  MonitorSmartphone, 
  Mail,
  Fingerprint,
  Cpu,
  Activity,
  Crosshair
} from "lucide-react";
import { getFaceCropUrl } from "../../Utils/utils";

// ==========================================
// TERMINAL-STYLE INPUT COMPONENT
// ==========================================
const InputField = ({ icon: Icon, label, value, onChange, disabled, type = "text", isEditing }) => (
  <div className="relative group">
    {/* Tech Accent Line */}
    <div className={`absolute -left-[1px] top-2 bottom-2 w-[2px] transition-all duration-300 ${isEditing && !disabled ? 'bg-indigo-500 opacity-0 group-focus-within:opacity-100' : 'bg-transparent'}`} />
    
    <label className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 mb-1.5 flex items-center gap-2">
      {label}
      {disabled && <LockIcon />}
    </label>

    <div className={`flex items-stretch bg-[#0a0a14] border rounded-xl overflow-hidden transition-all duration-300 ${
      isEditing && !disabled 
        ? 'border-white/10 group-focus-within:border-indigo-500/50 group-focus-within:shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
        : 'border-white/5 opacity-80'
    }`}>
      <div className={`flex items-center justify-center pl-4 pr-3 border-r transition-colors duration-300 ${
        isEditing && !disabled ? 'border-white/5 text-gray-500 group-focus-within:text-indigo-400' : 'border-transparent text-gray-600'
      }`}>
        <Icon size={16} />
      </div>

      {!isEditing || disabled ? (
        <div className="w-full px-4 py-3.5 text-sm font-bold text-gray-300 truncate bg-transparent flex items-center">
          {value || <span className="text-gray-600 italic tracking-wider uppercase text-xs">Not Provided</span>}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3.5 bg-transparent text-white text-sm font-bold focus:outline-none placeholder-gray-700 tracking-wide"
          placeholder={`Enter ${label}...`}
        />
      )}
    </div>
  </div>
);

const LockIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// ==========================================
// MAIN PROFILE COMPONENT
// ==========================================
export default function ProfileSection() {
  const { user, checkAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'security'
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    inGameUserName: user?.inGameUserName || "",
    baseTeamName: user?.baseTeamName || "",
    inGameUserId: user?.inGameUserId || "",
    phone: user?.phone || "",
    phoneModel: user?.phoneModel || "",
    image: user?.image || "",
    newImage: "",
  });

  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingImage(true);
    try {
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64String = await imageCompression.getDataUrlFromFile(compressedFile);
      setProfileData({ ...profileData, newImage: base64String });
    } catch (error) {
      console.error("Error compressing image:", error);
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleProfileUpdate = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const response = await API.patch(`/users/editProfile`, profileData, {
      headers: { Authorization: localStorage.getItem("authToken") },
    });
    if (response.data.success) {
      setIsEditing(false);
      checkAuth();
      toast.success("Manager profile updated successfully.");
    }
    setIsSaving(false);
  };

  return (
    <div className="relative min-h-[80vh] bg-[#05050a] w-full font-sans text-white overflow-hidden pb-20">
      
      {/* CYBER BACKGROUND TEXTURE */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-[20%] w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 pt-6 md:p-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/20 bg-pink-500/10 backdrop-blur-md mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#ec4899]" />
            <span className="text-[9px] font-black text-pink-400 uppercase tracking-[0.3em]">
              Player Hub
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white flex items-center gap-3">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300">Profile</span>
          </h1>
        </div>

        {/* ASYMMETRIC DASHBOARD LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* ========================================== */}
          {/* LEFT SIDEBAR: PROFILE SUMMARY              */}
          {/* ========================================== */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Identity Card */}
            <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              {/* Decorative Corner Borders */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-500/30 rounded-br-2xl" />

              <div className="flex flex-col items-center">
                
                {/* Holographic Avatar */}
                <div className="relative mb-6 group">
                  <div className={`absolute inset-0 blur-xl rounded-full transition-all duration-500 ${isEditing ? 'bg-pink-500/30' : 'bg-indigo-500/20 opacity-50 group-hover:opacity-100'}`} />
                  
                  <div className={`relative w-32 h-32 rounded-full overflow-hidden border-2 transition-colors duration-300 ${isEditing ? 'border-pink-500' : 'border-white/10'}`}>
                    {isCompressingImage ? (
                      <div className="w-full h-full bg-[#05050a] flex flex-col items-center justify-center">
                        <Loader className="animate-spin h-6 w-6 text-pink-500 mb-2" />
                        <span className="text-[8px] uppercase tracking-widest text-gray-500">Processing</span>
                      </div>
                    ) : (
                      <img
                        src={profileData.newImage || getFaceCropUrl(user?.image?.url) || "/placeholder.svg"}
                        alt="Manager Avatar"
                        className={`w-full h-full object-cover transition-all duration-500 ${isEditing ? 'scale-110' : ''}`}
                      />
                    )}
                  </div>

                  {/* Camera Button (Only visible when editing) */}
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <label
                        htmlFor="profileImage"
                        className="w-10 h-10 bg-[#0a0a14] border border-pink-500/50 text-pink-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                      >
                        <Camera size={18} />
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isCompressingImage}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Identity Text */}
                <h2 className="text-2xl font-black uppercase tracking-wider text-center w-full truncate">
                  {user?.inGameUserName || "NEW MANAGER"}
                </h2>
                <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold mt-1">
                  {user?.name || "Name Not Set"}
                </p>

                {/* Edit/Save Toggle Button */}
                <div className="w-full mt-8">
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    disabled={isCompressingImage || isSaving}
                    className={`relative w-full overflow-hidden rounded-xl p-[1px] group transition-all duration-300 active:scale-[0.98] ${
                      isEditing ? 'shadow-[0_0_20px_rgba(236,72,153,0.2)]' : ''
                    }`}
                  >
                    <span className={`absolute inset-0 transition-opacity duration-300 ${
                      isEditing 
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 opacity-100' 
                        : 'bg-white/10 group-hover:bg-white/20 opacity-100'
                    }`} />
                    <div className={`relative flex items-center justify-center gap-2 py-3.5 rounded-[11px] transition-colors ${
                      isEditing ? 'bg-[#0a0a14] group-hover:bg-transparent' : 'bg-[#0a0a14]'
                    }`}>
                      {isSaving ? <Loader className="animate-spin h-4 w-4" /> : isEditing ? <Save size={16} /> : <Edit2 size={16} />}
                      <span className="font-black text-xs uppercase tracking-[0.15em]">
                        {isSaving ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}
                      </span>
                    </div>
                  </button>
                </div>

              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex lg:flex-col gap-2">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 lg:w-full flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-300 ${
                  activeTab === "details" 
                    ? "bg-white/5 border-white/20 text-white shadow-md" 
                    : "bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
                }`}
              >
                <Fingerprint size={18} className={activeTab === "details" ? "text-indigo-400" : ""} />
                <span className="text-xs font-black uppercase tracking-widest">Manage Details</span>
              </button>
              
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 lg:w-full flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-300 ${
                  activeTab === "security" 
                    ? "bg-white/5 border-white/20 text-white shadow-md" 
                    : "bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
                }`}
              >
                <Shield size={18} className={activeTab === "security" ? "text-pink-400" : ""} />
                <span className="text-xs font-black uppercase tracking-widest">Security</span>
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT CONTENT: DATA GRIDS                  */}
          {/* ========================================== */}
          <div className="lg:col-span-8 overflow-hidden">
            
            {activeTab === "details" && (
              // Replaced with the custom Tailwind v4 keyframe class
              <div className="space-y-6 animate-slide-in-right">
                
                {/* eFOOTBALL DETAILS */}
                <div className="bg-[#0a0a14]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    <Gamepad2 className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">eFootball Infos</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <InputField 
                      icon={Crosshair} 
                      label="In-Game Name" 
                      value={profileData.inGameUserName} 
                      onChange={(val) => handleProfileUpdate("inGameUserName", val)} 
                      isEditing={isEditing}
                    />
                    <InputField 
                      icon={Activity} 
                      label="Game ID" 
                      value={profileData.inGameUserId} 
                      onChange={(val) => handleProfileUpdate("inGameUserId", val)} 
                      isEditing={isEditing}
                    />
                    <div className="md:col-span-2">
                      <InputField 
                        icon={Shield} 
                        label="Base Team" 
                        value={profileData.baseTeamName} 
                        onChange={(val) => handleProfileUpdate("baseTeamName", val)} 
                        isEditing={isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* DEVICE & CONTACT DETAILS */}
                <div className="bg-[#0a0a14]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    <Cpu className="w-5 h-5 text-pink-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Device Specs & Contact</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <InputField 
                      icon={User} 
                      label="Full Name" 
                      value={profileData.name} 
                      onChange={(val) => handleProfileUpdate("name", val)} 
                      isEditing={isEditing}
                    />
                    <InputField 
                      icon={MonitorSmartphone} 
                      label="Device Model" 
                      value={profileData.phoneModel} 
                      onChange={(val) => handleProfileUpdate("phoneModel", val)} 
                      isEditing={isEditing}
                    />
                    <div className="md:col-span-2">
                      <InputField 
                        icon={Smartphone} 
                        label="Phone Number" 
                        type="tel"
                        value={profileData.phone} 
                        onChange={(val) => handleProfileUpdate("phone", val)} 
                        isEditing={isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* ACCOUNT EMAIL (LOCKED) */}
                <div className="bg-[#05050a] border border-white/5 rounded-xl p-5">
                  <InputField 
                    icon={Mail} 
                    label="Account Email" 
                    value={user?.email} 
                    disabled={true}
                    isEditing={isEditing}
                  />
                </div>

              </div>
            )}

            {activeTab === "security" && (
              // Replaced with the custom Tailwind v4 keyframe class
              <div className="space-y-6 animate-slide-in-bottom">
                <div className="bg-[#0a0a14]/60 backdrop-blur-xl border border-red-500/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  
                  {/* Warning background glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center gap-3 mb-6 border-b border-red-500/20 pb-4 relative z-10">
                    <Shield className="w-5 h-5 text-red-500" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                      Account Security
                    </h3>
                  </div>
                  
                  <div className="max-w-md relative z-10">
                    <p className="text-[11px] sm:text-xs text-gray-400 mb-8 font-bold leading-relaxed uppercase tracking-wider">
                      Ensure your account is using a secure password to protect your tournament data. Do not share your login credentials with anyone.
                    </p>
                    
                    {/* ========================================== */}
                    {/* HERE IS THE PASSWORD FORM BEING RENDERED   */}
                    {/* ========================================== */}
                    <div className="bg-black/40 p-1 rounded-xl">
                      <ChangePasswordForm />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}