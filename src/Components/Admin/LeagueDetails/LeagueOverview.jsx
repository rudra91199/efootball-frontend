import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { API } from "../../../axios";
import { toast } from "react-toastify"; // Switched to React Toastify
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is available
import IssueCardModal from "./IssueCardModal";

export default function LeagueOverview({
  tournament,
  leagueParticipants,
  leagueFixture,
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Initialize React Hook Form
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      status: tournament?.status || "Upcoming",
    },
  });

  // Sync the form dropdown whenever the tournament prop changes
  useEffect(() => {
    if (tournament?.status) {
      reset({ status: tournament.status });
    }
  }, [tournament, reset]);

  const onSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const response = await API.patch(
        `/tournaments/update-status/${tournament._id}`,
        { status: data.status },
        {
          headers: {
            authorization: `${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Tournament status updated successfully!", {
          position: "top-right",
          theme: "dark",
        });
      } else {
        toast.error(response.data.message || "Update failed", {
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("An error occurred while updating status", {
        theme: "dark",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenCardModal = (player) => {
    setSelectedPlayer({ player });
    setIsCardModalOpen(true);
    reset();
  };

  // Calculations for the stats cards
  const matchesPlayed =
    leagueFixture?.filter((match) => match.status === "Completed").length || 0;
  const totalMatches = leagueFixture?.length || 0;
  const matchesRemaining = Math.max(0, totalMatches - matchesPlayed);
  const progressPercent =
    totalMatches > 0 ? (matchesPlayed / totalMatches) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Teams Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 sm:p-6">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">
            Total Teams
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-white mt-1">
            {leagueParticipants?.length || 0}
          </p>
        </div>

        {/* Matches Played Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 sm:p-6">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">
            Matches Played
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-green-400 mt-1">
            {matchesPlayed}
          </p>
          <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Matches Remaining Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 sm:p-6">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl" />
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">
            Remaining
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-yellow-400 mt-1">
            {matchesRemaining}
          </p>
        </div>
      </div>

      {/* Participating Teams Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 sm:p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Participating Teams
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {leagueParticipants?.map((team) => (
            <div
              key={team._id}
              className="flex items-center gap-3 p-3 bg-black/30 border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
            >
              <img
                src={team.image?.url || "/placeholder.svg?height=40&width=40"}
                alt={team.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white truncate text-sm sm:text-base">
                  {team.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {team.inGameUserName}
                </p>
              </div>
              <button
                onClick={() => handleOpenCardModal(team)}
                className="text-white text-sm font-medium bg-cyan-600 rounded-lg px-3 py-1.5 hover:bg-cyan-500 transition-colors"
              >
                Action
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status Update Section */}
      <div className="liquid-glass-card relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/5 to-transparent p-6 sm:p-6">
        <h3 className="text-lg font-bold text-white mb-4">Tournament Status</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                tournament?.status === "Live"
                  ? "bg-yellow-400 animate-pulse"
                  : tournament?.status === "Completed"
                    ? "bg-green-400"
                    : "bg-blue-400"
              }`}
            />
            <span className="text-2xl sm:text-3xl font-bold text-blue-400">
              {tournament?.status || "Upcoming"}
            </span>
          </div>

          {/* Form for Status Update */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto"
          >
            <select
              {...register("status")}
              className="flex-1 sm:flex-none bg-black border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="Upcoming" className="bg-gray-900">
                Upcoming
              </option>
              <option value="Published" className="bg-gray-900">
                Published
              </option>
              <option value="Live" className="bg-gray-900">
                Live
              </option>
              <option value="Completed" className="bg-gray-900">
                Completed
              </option>
            </select>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-95"
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </button>
          </form>
        </div>
      </div>
      {selectedPlayer && isCardModalOpen && (
        <IssueCardModal
          selectedPlayer={selectedPlayer}
          setIsCardModalOpen={setIsCardModalOpen}
          setSelectedPlayer={setSelectedPlayer}
          tournament={tournament}
        />
      )}
    </div>
  );
}
