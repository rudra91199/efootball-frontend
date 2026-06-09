import { useState } from "react";
import { useForm } from "react-hook-form";
import { API } from "../../../axios";
import { toast } from "react-toastify";
import AuthLoader from "../../Loaders/AuthLoader";

export default function TournamentOverview({
  tournament,
  teams,
  matches,
  isLoading,
}) {
  const { register, handleSubmit } = useForm();
  const [isUpdating, setIsUpdating] = useState(false);
  if (isLoading) {
   return <AuthLoader />;
  }

  const onSubmit = async (data) => {
    setIsUpdating(true);
    const response = await API.patch(
      `/tournaments/update-status/${tournament._id}`,
      { status: data.status },
      {
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
      }
    );
    if (response.data.success === true) {
      setIsUpdating(false);
      toast.success("Tournament status updated successfully");
    }
    setIsUpdating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Tournament Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Tournament Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tournament Name
              </label>
              <p className="text-gray-100">{tournament.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Type
              </label>
              <p className="text-gray-100">{tournament.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Teams
              </label>
              <p className="text-gray-100">{tournament.maxTeams}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Entry Fee
              </label>
              <p className="text-gray-100">${tournament.entryFee}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <p className="text-gray-100">
                {new Date(tournament.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <p className="text-gray-100">
                {new Date(tournament.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Current Phase */}
        <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Current Status
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-400">
              {tournament?.status}
            </span>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center space-x-4"
            >
              <select
                {...register("status")}
                defaultValue={tournament?.status}
                className="bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={"Upcoming"}>Upcoming</option>
                <option value={"Published"}>Published</option>
                <option value={"Live"}>Live</option>
                <option value={"Completed"}>Completed</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-6">
        <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Registered Teams</span>
              <span className="text-gray-100 font-semibold">
                {teams?.length}/{tournament?.maxTeams}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Matches</span>
              <span className="text-gray-100 font-semibold">
                {matches?.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Completed Matches</span>
              <span className="text-gray-100 font-semibold">
                {matches?.filter((m) => m.status === "Completed")?.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Scheduled Matches</span>
              <span className="text-gray-100 font-semibold">
                {matches?.filter((m) => m.status === "Scheduled")?.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
