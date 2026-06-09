import { toast } from "react-toastify";
import { API } from "../../../axios";
import { useState } from "react";
import AuthLoader from "../../Loaders/AuthLoader";

export default function TournamentPhases({
  phases,
  tournamentId,
  refetch,
  isLoading: isLoadingPhases,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-600 text-gray-200";
      case "Active":
        return "bg-green-600 text-green-100";
      case "Completed":
        return "bg-blue-600 text-blue-100";
      default:
        return "bg-gray-600 text-gray-200";
    }
  };

  //generate round robin fixtures
  const generateFixture = async () => {
    setIsLoading(true);
    const response = await API.patch(
      `/tournaments/generateRoundRobinFixtures/${tournamentId}`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }
    );
    if (response.data.success) {
      setIsLoading(false);
      refetch();
      toast.success("Fixtures generated successfully");
    }
    setIsLoading(false);
  };

  // finalize phase 1 and generate phase 2 fixtures
  const finalizePhase1 = async (phaseOrder) => {
    setIsLoading(true);
    const response = await API.patch(
      `/tournaments/generatePhase2fixtures/${tournamentId}`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }
    );
    if (response.data.success) {
      setIsLoading(false);
      toast.success("Phase 1 finalized and Phase 2 fixtures generated");
      refetch();
    }
    setIsLoading(false);
  };

  // generate phase 3 fixtures
  const generatePhase3fixtures = async () => {
    setIsLoading(true);
    const response = await API.patch(
      `/tournaments/generatePhase3fixtures/${tournamentId}`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }
    );
    if (response.data.success) {
      refetch();
      setIsLoading(false);
      toast.success("Phase 3 fixtures generated successfully");
    }
    setIsLoading(false);
  };

  if (isLoadingPhases) {
    return <AuthLoader />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-6">
        Tournament Phases
      </h2>

      <div className="space-y-4">
        {phases?.map((phase, index) => (
          <div
            key={phase._id}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    phase.status === "Active"
                      ? "bg-blue-600 text-white"
                      : phase.status === "Completed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {phase.phaseOrder}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">
                    {phase.phaseName}
                  </h3>
                  <p className="text-gray-400">{phase.status}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  {phase.matches.length} matches
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    phase.status
                  )}`}
                >
                  {phase.status}
                </span>
                <>
                  {phase.phaseOrder === 1 && phase.status === "Active" && (
                    <button
                      onClick={() => finalizePhase1()}
                      disabled={isLoading}
                      className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed `}
                    >
                      {isLoading ? "Finalizing..." : "Finalize Phase 1"}
                    </button>
                  )}

                  {phase.phaseOrder == 1 && phase.status === "Pending" && (
                    <button
                      onClick={() => generateFixture()}
                      disabled={phase.matches.length > 0 || isLoading}
                      className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ${
                        phase.matches.length > 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isLoading ? "Generating..." : "Generate Fixtures"}
                    </button>
                  )}
                </>
                {index === 2 &&
                  phase.status === "Active" &&
                  phase.matches.length < 1 && (
                    <button
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      onClick={() => generatePhase3fixtures()}
                    >
                      {isLoading
                        ? "Generating..."
                        : "Generate Phase 3 Fixtures"}
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
