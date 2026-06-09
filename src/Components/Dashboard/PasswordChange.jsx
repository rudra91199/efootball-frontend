"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { CheckCircle, Eye, EyeOff, MessageCircleX, ShieldCheck, Loader2 } from "lucide-react";
import { API } from "../../axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { data: response } = await API.patch(
        "/users/changePassword",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            authorization: localStorage.getItem("authToken"),
          },
        }
      );

      if (response?.success) {
        setPasswordChangeSuccess(true);
        reset();
        setTimeout(() => {
          setPasswordChangeSuccess(false);
          logout();
          navigate("/login");
        }, 5000);
        setError("");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to change password.");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  // Updated styles to match the new Cyber Dashboard aesthetic
  const inputContainerStyle = "relative flex items-stretch bg-[#0a0a14] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-red-500/50 focus-within:shadow-[0_0_20px_rgba(239,68,68,0.1)] group";
  const inputStyle = "w-full pl-4 pr-12 py-3.5 bg-transparent text-white text-sm font-bold focus:outline-none placeholder-gray-700 tracking-wide";
  const labelStyle = "text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 mb-1.5 flex items-center gap-2";
  const errorStyle = "mt-2 text-[9px] font-bold text-red-500 uppercase tracking-widest pl-1 flex items-center gap-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      
      {/* Success Message */}
      {passwordChangeSuccess && (
        <div className="border border-emerald-500/30 bg-[#0a0a14] flex items-center gap-3 p-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)] animate-in fade-in zoom-in duration-300">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
            Security updated successfully. Relogging...
          </p>
        </div>
      )}

      {/* Global Error Message */}
      {error && (
        <div className="border border-red-500/30 bg-[#0a0a14] flex items-center gap-3 p-4 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)] animate-in fade-in zoom-in duration-300">
          <MessageCircleX className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-red-400 font-bold text-xs uppercase tracking-widest">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className={labelStyle}>
            Current Access Key
          </label>
          <div className={inputContainerStyle}>
            <div className="absolute -left-[1px] top-2 bottom-2 w-[2px] bg-red-500 opacity-0 group-focus-within:opacity-100 transition-all duration-300" />
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              {...register("currentPassword")}
              className={inputStyle}
              placeholder="Enter current key..."
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-400 transition-colors"
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className={errorStyle}>
              <MessageCircleX size={12} /> {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className={labelStyle}>
            New Access Key
          </label>
          <div className={inputContainerStyle}>
            <div className="absolute -left-[1px] top-2 bottom-2 w-[2px] bg-red-500 opacity-0 group-focus-within:opacity-100 transition-all duration-300" />
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword")}
              className={inputStyle}
              placeholder="Enter new key..."
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-400 transition-colors"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword ? (
            <p className={errorStyle}>
              <MessageCircleX size={12} /> {errors.newPassword.message}
            </p>
          ) : (
            <p className="mt-2 text-[9px] text-gray-600 uppercase tracking-widest font-bold pl-1">
              Min 8 chars • 1 Uppercase • 1 Lowercase • 1 Number
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className={labelStyle}>
            Confirm New Key
          </label>
          <div className={inputContainerStyle}>
            <div className="absolute -left-[1px] top-2 bottom-2 w-[2px] bg-red-500 opacity-0 group-focus-within:opacity-100 transition-all duration-300" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={inputStyle}
              placeholder="Confirm new key..."
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-400 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={errorStyle}>
              <MessageCircleX size={12} /> {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full relative overflow-hidden rounded-xl p-[1px] group transition-all duration-300 active:scale-[0.98] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center justify-center gap-2 py-3.5 bg-[#0a0a14] rounded-[11px] transition-colors group-hover:bg-transparent">
          {isSubmitting ? (
            <Loader2 className="animate-spin text-white" size={16} />
          ) : (
            <ShieldCheck className="text-red-400 group-hover:text-white transition-colors" size={16} />
          )}
          <span className="font-black text-xs uppercase tracking-[0.15em] text-white">
            {isSubmitting ? "Encrypting..." : "Update Security Pass"}
          </span>
        </div>
      </button>

    </form>
  );
}