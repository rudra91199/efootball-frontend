"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaTimes } from "react-icons/fa";

// MongoDB compatible ISO 8601 datetime validation
const publishRoundSchema = z
  .object({
    roundName: z.string().min(1, "Round name is required"),
    startDateTime: z.string().min(1, "Start date and time is required"),
    endDateTime: z.string().min(1, "End date and time is required"),
  })
  .refine((data) => new Date(data.endDateTime) > new Date(data.startDateTime), {
    message: "End date and time must be after start date and time",
    path: ["endDateTime"],
  });

export default function PublishKnockoutModal({
  isOpen,
  onClose,
  roundName,
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
        roundStartDate: startDate,
        roundEndDate: endDate,
        round: roundName,
      });
      handleClose();
    } catch (error) {
      console.error("[v0] Error submitting form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-xl font-bold">Publish Round</h2>
          <button
            onClick={handleClose}
            className="border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent p-2 rounded-md transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          {/* Series Info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
            <h3 className="text-white font-semibold mb-3">Knockout Info</h3>
            <div className="space-y-2">
              <div>
                <p className="text-gray-400 text-sm">Round Name</p>
                <p className="text-white font-medium">{roundName}</p>
              </div>
            </div>
          </div>

          {/* Start Date and Time */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Start Date & Time
            </label>
            <input
              {...register("startDateTime")}
              type="datetime-local"
              className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.startDateTime && (
              <p className="text-red-400 text-sm mt-1">
                {errors.startDateTime.message}
              </p>
            )}
          </div>

          {/* End Date and Time */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              End Date & Time
            </label>
            <input
              {...register("endDateTime")}
              type="datetime-local"
              className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.endDateTime && (
              <p className="text-red-400 text-sm mt-1">
                {errors.endDateTime.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isSubmitting ? "Publishing..." : "Publish Round"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
