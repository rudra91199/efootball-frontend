"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaTimes } from "react-icons/fa";

// Validation schema for a single match
const publishMatchSchema = z
  .object({
    startDateTime: z.string().min(1, "Start date and time is required"),
    endDateTime: z.string().min(1, "End date and time is required"),
  })
  .refine((data) => new Date(data.endDateTime) > new Date(data.startDateTime), {
    message: "End date and time must be after start date and time",
    path: ["endDateTime"],
  });

export default function PublishSingleMatchModal({
  isOpen,
  onClose,
  match, // Passing the full match object now
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(publishMatchSchema),
    defaultValues: {
      // Pre-fill with existing match times if they exist, otherwise current time
      startDateTime: match?.startTime
        ? new Date(match.startTime).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      endDateTime: match?.endTime
        ? new Date(match.endTime).toISOString().slice(0, 16)
        : new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    try {
      const startDate = new Date(data.startDateTime).toISOString();
      const endDate = new Date(data.endDateTime).toISOString();

      // Submit specific match details
      await onSubmit({
        matchId: match._id,
        startTime: startDate,
        endTime: endDate,
        status: "Scheduled", // Automatically move to Scheduled on publish
      });
      handleClose();
    } catch (error) {
      console.error("Error publishing match:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white text-lg font-bold uppercase tracking-tight">
            Publish Match
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Match Preview Card */}
        <div className="px-6 pt-6">
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-[10px] text-blue-400 uppercase font-bold">
                Team 1
              </p>
              <p className="text-white font-bold truncate">
                {match?.team1?.inGameUserName || "TBD"}
              </p>
            </div>
            <div className="px-4 text-blue-500 font-black italic">VS</div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-blue-400 uppercase font-bold">
                Team 2
              </p>
              <p className="text-white font-bold truncate">
                {match?.team2?.inGameUserName || "TBD"}
              </p>
            </div>
          </div>
          <p className="text-center text-gray-500 text-[10px] uppercase mt-2 tracking-widest">
            {match?.round || "Phase 3 Match"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-5"
        >
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">
              Scheduled Start
            </label>
            <input
              {...register("startDateTime")}
              type="datetime-local"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.startDateTime && (
              <p className="text-red-400 text-xs mt-1">
                {errors.startDateTime.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">
              Scheduled End
            </label>
            <input
              {...register("endDateTime")}
              type="datetime-local"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.endDateTime && (
              <p className="text-red-400 text-xs mt-1">
                {errors.endDateTime.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 font-bold uppercase text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold uppercase text-xs transition-transform active:scale-95"
            >
              {isSubmitting ? "Processing..." : "Confirm Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
