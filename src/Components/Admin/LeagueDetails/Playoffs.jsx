import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { useState } from "react";
import { FaEdit, FaPlay } from "react-icons/fa";
import UpdateMatchScoreModal from "./UpdateScoreModal";
import StatusBadge from "./statusBadge";
import { toast } from "react-toastify";
import PublishKnockoutModal from "./PublishKnockoutRoundModal";
import moment from "moment";

const Playoffs = ({ stage }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const {
    data: { data: { data: playoff } = {} } = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["playOff", stage?.stageData?._id], // Use a key from the stage
    queryFn: () =>
      API.get(`/knockouts/${stage?.stageData._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }), // You'll need a new API for this
    enabled: !!stage,
  });

  const handleEditScore = (match) => {
    setSelectedMatch(match);
    setShowScoreModal(true);
  };

  const handleUpdateScore = async (score) => {
    try {
      const response = await API.patch(
        `/matches/submit-score/tournament`,
        { ...score, _id: selectedMatch._id },
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      if (response.data.success) {
        setSelectedMatch(null);
        setShowScoreModal(false);
        toast.success("Score saved successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save score");
    }
  };

  const handlePublishRound = (round) => {
    setSelectedRound(round);
    setIsPublishModalOpen(true);
  };

  const handlePublishRoundSubmit = async (data) => {
    const response = await API.patch(
      `/knockouts/${stage?.stageData._id}/publish-rounds`,
      {
        ...data,
      },
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }
    );
    if (response.data.success) {
      toast.success("Round published successfully");
      setIsPublishModalOpen(false);
      setSelectedRound(null);
      refetch();
    }
  };

  const isRoundCompleted = (matches) => {
    return matches.every((match) => match.status === "Completed");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{playoff?.name}</h2>
          <p className="text-gray-400">
            <StatusBadge status={playoff?.status} />
          </p>
        </div>
      </div>

      {/* Playoff Rounds */}
      <div className="space-y-4">
        {playoff?.rounds?.map((round, roundIndex) => {
          const isRoundUnpublished = round.matches.every(
            (m) => m.status === "Unpublished"
          );

          const roundCompleted = isRoundCompleted(round.matches);
          const remainingMatch = round.matches.find(
            (m) => m.status !== "Completed"
          );

          return (
            <div
              key={roundIndex}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg"
            >
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">
                    {round.roundName}
                  </h3>
                  {!roundCompleted && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground font-medium">
                        Start Date:{" "}
                        {moment(remainingMatch?.roundStartDate).format("LLL") ||
                          "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 font-medium">
                        {" "}
                        End Date:{" "}
                        {moment(remainingMatch?.roundEndDate).format("LLL") ||
                          "N/A"}
                      </p>
                    </div>
                  )}
                </div>
                {isRoundUnpublished && (
                  <div>
                    <button
                      onClick={() => handlePublishRound(round)}
                      className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ml-4"
                    >
                      <FaPlay className="mr-2 text-xs" />
                      Publish Round
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-800 p-4 space-y-4">
                {round.matches.map((match) => (
                  <div
                    key={match._id}
                    className="bg-gray-800/50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-300 text-sm font-medium">
                        {match.round}
                      </p>
                      <StatusBadge status={match.status} />
                    </div>

                    <div className="grid grid-cols-5 gap-2 items-center">
                      {/* Team 1 */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={match.team1.image.url || "/placeholder.svg"}
                            alt={match.team1.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {match.team1.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {match.team1.inGameUserName}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center justify-center">
                        <div
                          className={`text-center font-bold text-lg ${
                            match.winner?._id === match.team1._id
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {match.team1_score}
                        </div>
                        <div className="text-gray-500 mx-2">-</div>
                        <div
                          className={`text-center font-bold text-lg ${
                            match.winner?._id === match.team2._id
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {match.team2_score}
                        </div>
                      </div>

                      {/* Team 2 */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={match.team2.image.url || "/placeholder.svg"}
                            alt={match.team2.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {match.team2.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {match.team2.inGameUserName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {match.winner && (
                      <div className="mt-3 pt-3 border-t border-gray-700 text-center">
                        <p className="text-green-400 text-sm font-medium">
                          Winner: {match.winner.name} (
                          {match.winner.inGameUserName})
                        </p>
                      </div>
                    )}

                    {match.status !== "Completed" && (
                      <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end">
                        <button
                          onClick={() => handleEditScore(match)}
                          className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                        >
                          <FaEdit className="mr-1" />
                          Update Score
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Update Score Modal */}
      {selectedMatch && (
        <UpdateMatchScoreModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          match={selectedMatch}
          onSubmit={handleUpdateScore}
          stageType={stage?.stageType}
        />
      )}
      {selectedRound && (
        <PublishKnockoutModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          roundName={selectedRound.roundName}
          onSubmit={handlePublishRoundSubmit}
        />
      )}
    </div>
  );
};

export default Playoffs;
