import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Particles from "../Components/Loaders/Particle";
import { useAuthStore } from "../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BgField from "../Components/Home/BgField";
import { Eye, EyeOff, Mail, Lock, Gamepad2, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const { login, error } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Get the user agent
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // 2. Check if the device is iOS (iPhone, iPad, iPod)
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Remove message from history so it disappears on reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#05050a] text-white px-4 py-8 overflow-hidden">
      {/* Background Elements */}
      <p
        className="absolute top-4 left-4 text-sm text-white cursor-pointer"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="w-4 h-4 inline mr-2" />
        Back
      </p>

      <Particles />
      <BgField position="fixed" opacity="20" />

      {/* Ambient Glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-pink-600/20 to-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Cyberpunk Glass Card */}
      <div className="z-10 w-full max-w-md relative group">
        {/* Animated Border Gradient */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl opacity-50 group-hover:opacity-70 transition duration-500 blur-[2px]" />

        <div className="relative bg-[#0a0a14]/90 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="space-y-6 sm:space-y-8">
            {/* Header / Logo */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#05050a] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                <Gamepad2 className="w-8 h-8 text-pink-500" />
              </div>

              {message && (
                <div className="mb-6 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[#fefb04] bg-[#fefb04]/10 border border-[#fefb04]/30 text-center backdrop-blur-sm">
                  {message}
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                Welcome Back
              </h2>
              <p className="mt-2 text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">
                Enter The Arena
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                    placeholder="player@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-pink-500 text-xs mt-1 pl-1 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full pl-10 pr-12 py-3 bg-[#05050a] border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-sm transition-all placeholder-gray-600"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-pink-500 text-xs mt-1 pl-1 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* General Error */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                  <p className="text-xs text-red-400 font-bold tracking-wide">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full overflow-hidden rounded-xl p-[2px] mt-4 group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                <div className="relative bg-[#05050a] px-4 py-3 rounded-[10px] transition-all duration-300 group-hover:bg-opacity-0">
                  <span className="relative z-10 text-white font-black text-sm uppercase tracking-[0.15em]">
                    {isLoading ? "Authenticating..." : "Sign In"}
                  </span>
                </div>
              </button>

              {/* Footer Links */}
              <div className="pt-4 text-center">
                <p className="text-xs text-gray-400 font-medium">
                  New to the arena?{" "}
                  <Link
                    to="/signup"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 hover:from-pink-300 hover:to-indigo-300 font-black tracking-wide uppercase transition-all"
                  >
                    Create Account
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
