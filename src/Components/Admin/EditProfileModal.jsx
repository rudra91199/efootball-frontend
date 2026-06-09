import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { User, Smartphone, Gamepad2, Shield, Loader2, CheckCircle2, X, Camera, Activity, AlertOctagon } from "lucide-react";
import { API } from "../../axios";
import { toast } from "react-toastify";
import { getFaceCropUrl } from "../../Utils/utils";

export default function EditProfileModal({ isOpen, onClose, player, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom State for Image Handling
  const [imagePreview, setImagePreview] = useState(null);
  const [newImageBase64, setNewImageBase64] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      inGameUserName: "",
      inGameUserId: "",
      phone: "",
      phoneModel: "",
      baseTeamName: "",
      role: "player",
      status: "active",
    },
  });

  // Populate data when modal opens
  useEffect(() => {
    if (player && isOpen) {
      reset({
        name: player.name || "",
        inGameUserName: player.inGameUserName || "",
        inGameUserId: player.inGameUserId || "",
        phone: player.phone || "",
        phoneModel: player.phoneModel || "",
        baseTeamName: player.baseTeamName || "",
        role: player.role || "player",
        status: player.status || "active",
      });
      setImagePreview(getFaceCropUrl(player.image?.url) || null);
      setNewImageBase64(null); // Reset image payload
    }
  }, [player, reset, isOpen]);

  // Handle Image Selection and Base64 Conversion
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local preview
      setImagePreview(URL.createObjectURL(file));

      // Convert to Base64 for the backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const onSubmit = async (data) => {
      console.log(player._id)
    // 1. Extract ONLY the modified text fields
    const modifiedData = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

    // 2. Attach the new image payload if one was selected
    if (newImageBase64) {
      modifiedData.newImage = newImageBase64;
    }

    // 3. Guard Clause
    if (Object.keys(modifiedData).length === 0) {
      toast.info("No modifications detected.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await API.patch(`/users/updateProfile/admin/${player._id}`, modifiedData, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });

      if (response.data.success) {
        toast.success("Operator profile overwritten securely!");
        reset(data);
        setNewImageBase64(null);
        if (onSuccess) onSuccess(); 
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update operator");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormModified = isDirty || !!newImageBase64;

  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 bg-[#030305]/95 backdrop-blur-2xl flex items-center justify-center z-[9999] p-2 sm:p-4 animate-slide-in-bottom font-sans">
      <div className="w-full max-w-4xl bg-[#0a0b10] border border-white/10 rounded-[24px] sm:rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col max-h-[95vh]">
        
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#ec4899]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 border-b border-white/5 relative z-10 shrink-0 bg-[#030305]/60 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0a0b10] border border-white/5 rounded-xl shadow-inner">
              <Activity className="w-6 h-6 text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-widest mb-1">
                Admin Override
              </h2>
              <p className="text-[#a855f7] font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase">
                Target: {player.inGameUserName || player.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white/5 hover:bg-rose-500/20 text-gray-500 hover:text-rose-400 rounded-xl transition-all border border-transparent hover:border-rose-500/30 active:scale-95 group"
          >
            <X size={24} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto custom-scrollbar p-6 sm:p-8 relative z-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            
            {/* AVATAR UPLOAD SECTION */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#030305]/60 border border-white/5 rounded-2xl shadow-inner">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6] to-[#ec4899] blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-br from-white/20 to-white/5 border border-white/10 backdrop-blur-sm z-10 overflow-hidden">
                  <img 
                    src={getFaceCropUrl(imagePreview) || "/placeholder.svg"} 
                    alt="Preview" 
                    className={`w-full h-full object-cover rounded-xl transition-all duration-300 ${newImageBase64 ? "" : "grayscale-[20%]"}`}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-1 rounded-xl bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Upload</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Operator Biometrics</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 mb-3">Click avatar to update image matrix (Max 5MB)</p>
                {newImageBase64 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] text-[9px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" /> New Image Staged
                  </span>
                )}
              </div>
            </div>

            {/* ADMIN CLEARANCE SECTION (Status & Role) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl shadow-inner">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={14} /> Security Clearance (Role)
                </label>
                <select
                  {...register("role")}
                  className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500/50 transition-all text-sm font-bold uppercase tracking-wider cursor-pointer appearance-none shadow-inner"
                >
                  <option value="player">Player</option>
                  <option value="referee">Referee</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertOctagon size={14} /> Account Status
                </label>
                <select
                  {...register("status")}
                  className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500/50 transition-all text-sm font-bold uppercase tracking-wider cursor-pointer appearance-none shadow-inner"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked (Suspended)</option>
                </select>
              </div>
            </div>

            {/* STANDARD FIELDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} className="text-[#3b82f6]" /> Legal Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-[#030305] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-medium placeholder:text-gray-700 shadow-inner"
                />
                {errors.name && <p className="text-[#e11d48] text-[10px] font-black uppercase tracking-widest mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Gamepad2 size={14} className="text-[#ec4899]" /> In-Game Name (IGN)
                </label>
                <input
                  {...register("inGameUserName", { required: "IGN is required" })}
                  className="w-full bg-[#030305] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]/50 transition-all font-medium placeholder:text-gray-700 shadow-inner"
                />
                {errors.inGameUserName && <p className="text-[#e11d48] text-[10px] font-black uppercase tracking-widest mt-1">{errors.inGameUserName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-[#3b82f6] font-black text-sm leading-none">#</span> In-Game ID
                </label>
                <input
                  {...register("inGameUserId", { required: "Game ID is required" })}
                  className="w-full bg-[#030305] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-medium placeholder:text-gray-700 shadow-inner"
                />
                {errors.inGameUserId && <p className="text-[#e11d48] text-[10px] font-black uppercase tracking-widest mt-1">{errors.inGameUserId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={14} className="text-[#a855f7]" /> Base Team Name
                </label>
                <input
                  {...register("baseTeamName")}
                  className="w-full bg-[#030305] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7]/50 transition-all font-medium placeholder:text-gray-700 shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone size={14} className="text-[#ec4899]" /> Phone Number
                </label>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full bg-[#030305] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]/50 transition-all font-medium placeholder:text-gray-700 shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone size={14} className="text-[#a855f7]" /> Device Model
                </label>
                <input
                  {...register("phoneModel")}
                  className="w-full bg-[#030305] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7]/50 transition-all font-medium placeholder:text-gray-700 shadow-inner"
                />
              </div>

            </div>

            {/* Read Only Field */}
            <div className="pt-4">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                Registered Identity Token (Email)
              </label>
              <input
                disabled
                value={player?.email || "N/A"}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-gray-500 cursor-not-allowed font-medium tracking-wide"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 pt-8 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3.5 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Abort
              </button>

              <button
                type="submit"
                disabled={!isFormModified || isSubmitting}
                className={`relative px-6 sm:px-10 py-3.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 overflow-hidden group ${
                  !isFormModified 
                    ? "bg-[#030305] text-gray-600 cursor-not-allowed border border-white/5" 
                    : "bg-gradient-to-r from-[#3b82f6] to-[#ec4899] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 border border-white/20"
                }`}
              >
                {isFormModified && <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-50" />}
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isFormModified ? <CheckCircle2 className="w-4 h-4" /> : null}
                  {isSubmitting ? "Overwriting..." : "Apply Override"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}