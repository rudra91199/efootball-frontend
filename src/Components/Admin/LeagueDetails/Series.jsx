import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import UpdateMatchScoreModal from "./UpdateScoreModal";
import { useState } from "react";
import StatusBadge from "./statusBadge";
import { FaEdit, FaPlay } from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";
import PublishSeriesModal from "./PublishSeries";
import { Trophy, Users } from "lucide-react";

const Series = ({ stage }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const {
    data: { data: { data: knockout } = {} } = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["seriesStage", stage?.stageData?._id], // Use a key from the stage
    queryFn: () =>
      API.get(`/knockouts/${stage?.stageData._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }), // You'll need a new API for this
    enabled: !!stage,
  });

  const handleUpdateScore = async (score) => {
    try {
      const response = await API.patch(
        `/matches/submit-score/tournament`,
        { ...score, _id: selectedMatch._id },
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        },
      );
      if (response.data.success) {
        setSelectedMatch(null);
        setIsScoreModalOpen(false);
        toast.success("Score saved successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save score");
    }
  };
  const openScoreModal = (match) => {
    setSelectedMatch(match);
    setIsScoreModalOpen(true);
  };

  const handlePublishRound = (round) => {
    setSelectedRound(round);
    setIsPublishModalOpen(true);
  };

  const handlePublishRoundSubmit = async (data) => {
    const response = await API.post(
      `/series/publish-round/${selectedRound.series[0]._id}`,
      {
        ...data,
      },
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      },
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
    <div className="space-y-4">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-indigo-900/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500 via-black to-blue-800 rounded-lg">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {knockout?.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Rounds */}
      <div className="space-y-4">
        {knockout?.rounds?.map((round) => {
          const isRoundUnpublished = round.series.every(
            (s) => s.status === "Upcoming",
          );
          const roundCompleted = isRoundCompleted(
            round.series.flatMap((s) => s.matches),
          );

          const remainingMatch = round.series.flatMap((s) => {
            return s.matches.find((m) => m.status === "Scheduled");
          });

          return (
            <div
              key={round.roundName}
              className="liquid-glass-card relative px-0 py-4 overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-950/10 to-indigo-900/10 border border-gray-700/50 rounded-xl"
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
                        {moment(remainingMatch[0]?.roundStartDate).format(
                          "LLL",
                        ) || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 font-medium">
                        {" "}
                        End Date:{" "}
                        {moment(remainingMatch[0]?.roundEndDate).format(
                          "LLL",
                        ) || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
                {isRoundUnpublished && (
                  <div>
                    <button
                      onClick={() => handlePublishRound(round)}
                      className="flex items-center px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-sm font-medium transition-colors ml-4"
                    >
                      <FaPlay className="mr-2 text-xs" />
                      Publish Round
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-800 p-4 space-y-4">
                {round?.series?.map((series) => (
                  <div
                    key={series._id}
                    className="relative overflow-hidden  bg-gradient-to-br  from-purple-900/50 via-blue-950/5 to-indigo-900/40 rounded-xl p-3 sm:p-4 shadow-lg shadow-pink-600/10 hover:border-purple-500/30 transition-all duration-300"
                  >
                    {/* Decorative gradient line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                    {/* Series Header with Players */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
                      {/* Players Section */}
                      <div className="flex-1 space-y-3">
                        {/* Player 1 */}
                        <div className="flex items-center justify-between bg-black/60 rounded-lg p-2 sm:p-3">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <img
                              src={
                                series.player1.image.url || "/placeholder.svg"
                              }
                              alt={series.player1?.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-medium text-sm sm:text-base truncate">
                                {series.player1?.name}
                              </p>
                              <p className="text-gray-500 text-xs truncate">
                                {series.player1.inGameUserName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-lime-400 rounded-lg border border-yellow-500/30">
                            <span className="text-dark-blue font-bold text-lg sm:text-xl">
                              {series.player1_wins}
                            </span>
                          </div>
                        </div>

                        {/* VS Divider */}
                        <div className="flex items-center justify-center">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                          <span className="px-3 text-gray-500 text-xs font-medium">
                            VS
                          </span>
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                        </div>

                        {/* Player 2 */}
                        <div className="flex items-center justify-between bg-black/60 rounded-lg p-2 sm:p-3">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <img
                              src={
                                series.player2.image.url || "/placeholder.svg"
                              }
                              alt={series.player2.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-purple-500/30"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-medium text-sm sm:text-base truncate">
                                {series.player2.name}
                              </p>
                              <p className="text-gray-500 text-xs truncate">
                                {series.player2.inGameUserName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-lime-400 rounded-lg border border-yellow-500/30">
                            <span className="text-dark-blue font-bold text-lg sm:text-xl">
                              {series.player2_wins}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Series Info */}
                      <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-2 lg:gap-3 lg:min-w-[120px] p-3 bg-black/60 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-400 text-xs sm:text-sm">
                            Best of {series.bestOf}
                          </span>
                        </div>
                        <StatusBadge status={series.status} />
                      </div>
                    </div>
                    {/* Matches */}
                    <div className="space-y-2 mt-4 border-t border-gray-700 pt-4">
                      {series?.matches?.map((match) => (
                        <div
                          key={match._id}
                          className="flex items-center justify-between p-2 bg-gray-700/30 rounded"
                        >
                          <div className="flex-1">
                            <p className="text-gray-300 text-xs font-medium mb-1">
                              {match.round}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-gray-300 text-sm">
                                  <span
                                    className={
                                      match.winner?._id === match.team1._id
                                        ? "text-green-400 font-bold"
                                        : ""
                                    }
                                  >
                                    {match.team1.inGameUserName}
                                  </span>
                                </p>
                              </div>
                              <span className="text-white font-bold mx-2">
                                {match.team1_score}
                              </span>
                              <span className="text-gray-500">-</span>
                              <span className="text-white font-bold mx-2">
                                {match.team2_score}
                              </span>
                              <div className="flex-1 text-right">
                                <p className="text-gray-300 text-sm">
                                  <span
                                    className={
                                      match.winner?._id === match.team2._id
                                        ? "text-green-400 font-bold"
                                        : ""
                                    }
                                  >
                                    {match.team2.inGameUserName}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <StatusBadge status={match.status} />
                            <button
                              onClick={() => openScoreModal(match)}
                              className="p-2 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                              title="Update Score"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Score Update Modal */}
      {selectedMatch && (
        <UpdateMatchScoreModal
          isOpen={isScoreModalOpen}
          onClose={() => setIsScoreModalOpen(false)}
          onSubmit={handleUpdateScore}
          match={selectedMatch}
          stageType={stage?.stageType}
        />
      )}
      {selectedRound && (
        <PublishSeriesModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          roundName={selectedRound.roundName}
          seriesCount={selectedRound.series.length}
          onSubmit={handlePublishRoundSubmit}
        />
      )}
    </div>
  );
};

export default Series;
