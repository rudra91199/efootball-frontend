import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Particles from "../Components/Loaders/Particle";
import { useAuthStore } from "../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BgField from "../Components/Home/BgField";
import { Eye, EyeOff, User, Mail, Phone, Smartphone, Hash, Lock, Gamepad2, ImagePlus, UserPlus } from "lucide-react";
import imageCompression from "browser-image-compression";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    inGameUserName: z.string().min(1, "In-game username is required"),
    inGameUserId: z.string().min(1, "In-game user ID is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    phoneModel: z.string().min(1, "Phone model is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "referee", "player"]).default("player"),
    image: z
      .any()
      .refine((files) => files?.length > 0, "Profile image is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const { signup } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "player",
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setIsCompressingImage(true);

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const base64String = await imageCompression.getDataUrlFromFile(
        compressedFile
      );

      setPreviewImage(base64String);
    } catch (error) {
      console.error("Error compressing image:", error);
    } finally {
      setIsCompressingImage(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...details } = data;
      const userData = { ...details, image: previewImage };
      await signup(userData);
      navigate("/login", {
        state: { message: "Signup successful! You can now login." },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#05050a] text-white px-4 py-12 overflow-hidden">
      {/* Background Elements */}
      <Particles />
      <BgField position="fixed" opacity="20" />
      
      {/* Ambient Glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-pink-600/10 to-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyberpunk Glass Card Wrapper */}
      <div className="z-10 w-full max-w-5xl relative group">
        
        {/* Animated Border Gradient */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl opacity-40 group-hover:opacity-60 transition duration-700 blur-[2px]" />
        
        <div className="relative bg-[#0a0a14]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col lg:flex-row">
          
          {/* LEFT COLUMN: Profile Image Uploader */}
          <div className="lg:w-1/3 p-8 sm:p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent relative">
            
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-[#05050a] border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(236,72,153,0.1)]">
                <UserPlus className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                Create Player
              </h3>
              <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
                Identity Registration
              </p>
            </div>

            {/* Glowing Avatar Preview */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-shadow duration-500">
              
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-pink-500/30 border-dashed animate-[spin_10s_linear_infinite]" />
              
              <div className="w-full h-full rounded-full bg-[#05050a] border-[3px] border-[#0a0a14] flex items-center justify-center overflow-hidden relative z-10 shadow-inner">
                {isCompressingImage ? (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-pink-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest animate-pulse">Processing</p>
                  </div>
                ) : previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-white/10" />
                )}
              </div>
            </div>

            {/* Premium File Input Replacement */}
            <div className="w-full max-w-[200px] text-center">
              <label className="relative overflow-hidden rounded-xl p-[1px] group/btn cursor-pointer block">
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-xl opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                <div className="relative bg-[#05050a] px-4 py-2.5 rounded-[10px] flex items-center justify-center gap-2 transition-colors group-hover/btn:bg-[#0a0a14]">
                  <ImagePlus className="w-4 h-4 text-pink-400" />
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">
                    {previewImage ? "Change Image" : "Select Image"}
                  </span>
                </div>
                <input
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    register("image").onChange(e);
                    handleImageChange(e);
                  }}
                  disabled={isCompressingImage}
                  className="hidden"
                />
              </label>
              {errors.image && (
                <p className="mt-3 text-[10px] font-bold text-pink-500 uppercase tracking-wider">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="lg:w-2/3 p-8 sm:p-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      {...register("name")}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="text-pink-500 text-[10px] mt-1 pl-1 font-bold uppercase tracking-wider">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full pl-10 pr-4 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                      placeholder="player@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-pink-500 text-[10px] mt-1 pl-1 font-bold uppercase tracking-wider">{errors.email.message}</p>}
                </div>

                {/* In-Game Username */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">In-Game Username *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Gamepad2 className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      {...register("inGameUserName")}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                      placeholder="e.g., ToxicSniper99"
                    />
                  </div>
                  {errors.inGameUserName && <p className="text-pink-500 text-[10px] mt-1 pl-1 font-bold uppercase tracking-wider">{errors.inGameUserName.message}</p>}
                </div>

                {/* In-Game User ID */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">In-Game User ID *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Hash className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      {...register("inGameUserId")}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                      placeholder="e.g., 8472910"
                    />
                  </div>
                  {errors.inGameUserId && <p className="text-pink-500 text-[10px] mt-1 pl-1 font-bold uppercase tracking-wider">{errors.inGameUserId.message}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full pl-10 pr-4 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  {errors.phone && <p className="text-pink-500 text-[10px] mt-1 pl-1 font-bold uppercase tracking-wider">{errors.phone.message}</p>}
                </div>

                {/* Phone Model */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Model *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      {...register("phoneModel")}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                      placeholder="e.g., iPhone 15 Pro"
                    />
                  </div>
                  {errors.phoneModel && <p className="text-pink-500 text-[10px] mt-1 pl-1 font-bold uppercase tracking-wider">{errors.phoneModel.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-10 pr-12 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-pink-500 text-[10px] mt-1 pl-1 font-bold uppercase tracking-wider">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Confirm Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      {...register("confirmPassword")}
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-10 pr-12 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-pink-500 text-[10px] mt-1 pl-1 font-bold uppercase tracking-wider">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full overflow-hidden rounded-xl p-[2px] group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <div className="relative bg-[#05050a] px-4 py-3 rounded-[10px] transition-all duration-300 group-hover:bg-opacity-0">
                    <span className="relative z-10 text-white font-black text-sm uppercase tracking-[0.15em]">
                      {isSubmitting ? "Processing..." : "Create Account"}
                    </span>
                  </div>
                </button>
              </div>

              {/* Footer Link */}
              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                  Already in the arena?{" "}
                  <Link
                    to="/login"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 hover:from-pink-300 hover:to-indigo-300 font-black transition-all"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}