"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Zap, Trophy, LoaderCircle } from "lucide-react";

// MongoDB compatible ISO 8601 datetime validation
const publishRoundSchema = z
  .object({
    roundName: z.string().min(1, "Round name is required"),
    startDateTime: z.string().min(1, "Start date and time is required"),
    endDateTime: z.string().min(1, "End date and time is required"),
    seriesCount: z.number().int().positive("Series count must be positive"),
  })
  .refine((data) => new Date(data.endDateTime) > new Date(data.startDateTime), {
    message: "End date and time must be after start date and time",
    path: ["endDateTime"],
  });

export default function PublishSeriesModal({
  isOpen,
  onClose,
  roundName,
  seriesCount,
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(publishRoundSchema),
    defaultValues: {
      roundName,
      startDateTime: new Date().toISOString().slice(0, 16),
      endDateTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      seriesCount,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    try {
      // Convert local datetime to ISO 8601 format for MongoDB
      const startDate = new Date(data.startDateTime).toISOString();
      const endDate = new Date(data.endDateTime).toISOString();

      await onSubmit({
        startDateTime: startDate,
        endDateTime: endDate,
      });
      handleClose();
    } catch (error) {
      console.error("[v0] Error submitting form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      {/* Premium Modal Container */}
      <div className="relative bg-[#0a0a0c] border border-white/10 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#004d98]/10 via-[#a50044]/10 to-[#eab308]/10 pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 z-10 shrink-0">
          <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#eab308]" />
            Publish Series
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="relative p-6 space-y-5 z-10">
            
            {/* Series Info Banner */}
            <div className="bg-gradient-to-r from-[#004d98]/20 to-[#a50044]/20 border border-white/10 rounded-xl p-4 flex items-center justify-between shadow-inner">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Target Round</p>
                <p className="text-white font-black text-lg">{roundName}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Series</p>
                <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-md border border-white/5">
                  <Trophy className="w-3.5 h-3.5 text-[#eab308]" />
                  <p className="text-white font-bold">{seriesCount}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Start Date and Time (Barca Theme) */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
                <label className="text-xs font-bold text-[#a50044] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="w-2 h-2 rounded-full bg-[#a50044] animate-pulse"></span>
                  Start Window
                </label>
                <div className="relative">
                  <input
                    {...register("startDateTime")}
                    type="datetime-local"
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#a50044] focus:border-[#a50044] transition-all cursor-pointer [color-scheme:dark]"
                  />
                  {errors.startDateTime && (
                    <p className="text-[#a50044] text-[10px] font-bold uppercase tracking-wider mt-1.5 absolute -bottom-5">
                      {errors.startDateTime.message}
                    </p>
                  )}
                </div>
              </div>

              {/* End Date and Time (Madrid Theme) */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
                <label className="text-xs font-bold text-[#eab308] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="w-2 h-2 rounded-full bg-[#eab308]"></span>
                  End Window
                </label>
                <div className="relative">
                  <input
                    {...register("endDateTime")}
                    type="datetime-local"
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] transition-all cursor-pointer [color-scheme:dark]"
                  />
                  {errors.endDateTime && (
                    <p className="text-[#eab308] text-[10px] font-bold uppercase tracking-wider mt-1.5 absolute -bottom-5">
                      {errors.endDateTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Added padding at bottom so error messages don't get cut off inside the scroll container */}
            <div className="h-2"></div>
          </form>
        </div>

        {/* Fixed Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-black/40 flex items-center gap-3 z-10 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-black border border-white/20 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#004d98] via-[#a50044] to-[#eab308] disabled:opacity-50 disabled:grayscale text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all hover:shadow-[0_0_15px_rgba(165,0,68,0.5)] active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><LoaderCircle className="w-4 h-4 animate-spin" /> Publishing...</>
            ) : (
              "Publish Round"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}