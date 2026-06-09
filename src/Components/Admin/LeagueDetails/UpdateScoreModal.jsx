import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaTimes } from "react-icons/fa";

const scoreSchema = z.object({
  team1_score: z.coerce
    .number()
    .min(0, "Score must be positive")
    .max(100, "Score too high"),
  team2_score: z.coerce
    .number()
    .min(0, "Score must be positive")
    .max(100, "Score too high"),
  winnerId: z.string().nullish(),
});

export default function UpdateMatchScoreModal({
  isOpen,
  onClose,
  onSubmit,
  match,
  stageType,
}) {
  const [selectedWinner, setSelectedWinner] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      team1_score: match.team1_score,
      team2_score: match.team2_score,
      winnerId: match?.winner?._id || undefined,
    },
  });

  const team1Score = watch("team1_score");
  const team2Score = watch("team2_score");
  const isTied = team1Score === team2Score;

  const handleFormSubmit = async (data) => {
    if (stageType === "Knockout" && isTied && !selectedWinner) {
      alert("Please select a winner for tied match");
      return;
    }
    await onSubmit({
      ...data,
      winnerId: selectedWinner,
    });
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className=" liquid-glass-card overflow-hidden bg-blue-black backdrop-blur-sm border border-gray-700 rounded-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Update Match Score
          </h2>
          <button
            onClick={onClose}
            className="border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent p-2 rounded-md transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-6"
        >
          {/* Round Info */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">{match.round}</p>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <img
                  src={match.team1.image.url || "/placeholder.svg"}
                  alt={match.team1.name}
                  className="w-12 h-12 border-3 border-yellow-300 rounded-full mx-auto mb-2 object-cover"
                />
                <p className="text-white font-medium text-sm">
                  {match.team1.name.split(" ").slice(0, 2).join(" ")}
                </p>
              </div>
              <p className="text-gray-400">vs</p>
              <div className="text-center">
                <img
                  src={match.team2.image.url || "/placeholder.svg"}
                  alt={match.team2.name}
                  className="w-12 h-12 border-3 border-lime-300 rounded-full mx-auto mb-2 object-cover"
                />
                <p className="text-white font-medium text-sm">
                  {match.team2.name.split(" ").slice(0, 2).join(" ")}
                </p>
              </div>
            </div>
          </div>

          {/* Score Inputs */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                {match.team1.name.split(" ").slice(0, 2).join(" ")} Score
              </label>
              <input
                {...register("team1_score", { valueAsNumber: true })}
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-red-black-opc border border-red-600/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-bold"
              />
              {errors.team1_score && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.team1_score.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                {match.team2.name.split(" ").slice(0, 2).join(" ")} Score
              </label>
              <input
                {...register("team2_score", { valueAsNumber: true })}
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-yellow-black-opc border border-yellow-600/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-bold"
              />
              {errors.team2_score && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.team2_score.message}
                </p>
              )}
            </div>
          </div>

          {/* Winner Selection for Tied Matches */}
          {stageType === "Knockout" && isTied && (
            <div>
              <p className="text-yellow-400 text-sm font-medium mb-3">
                Match is tied. Select winner:
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedWinner(match.team1._id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    selectedWinner === match.team1._id
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-green-500/50"
                  }`}
                >
                  <img
                    src={match.team1.image.url || "/placeholder.svg"}
                    alt={match.team1.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">
                    {match.team1.inGameUserName}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWinner(match.team2._id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    selectedWinner === match.team2._id
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-green-500/50"
                  }`}
                >
                  <img
                    src={match.team2.image.url || "/placeholder.svg"}
                    alt={match.team2.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">
                    {match.team2.inGameUserName}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Auto Winner Display */}
          {!isTied && (
            <div className="p-3 bg-red-pink-opc  border border-red-950/20 rounded-lg">
              <p className="text-white text-sm font-medium">
                Winner:{" "}
                {team1Score > team2Score
                  ? match.team1.inGameUserName
                  : match.team2.inGameUserName}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-pink-red disabled:opacity-50 text-white rounded-md font-medium transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Score"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-black border border-blue-200/20 text-gray-300 hover:bg-gray-700 bg-transparent rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
