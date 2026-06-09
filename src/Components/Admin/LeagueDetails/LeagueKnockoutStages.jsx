import { useState } from "react";
import { API } from "../../../axios";
import GenerateKnockoutModal from "./gererateKnockoutModal";
import PublishRoundModal from "./publishRoundModal";

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  LoaderCircle,
  Trophy,
} from "lucide-react";

import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import UpdateMatchScoreModal from "./UpdateScoreModal";
import StatusBadge from "./statusBadge";
import { FaEdit, FaPlay } from "react-icons/fa";
import PublishKnockoutModal from "./PublishKnockoutRoundModal";
import moment from "moment";
import AuthLoader from "../../Loaders/AuthLoader";

export default function LeagueKnockoutStages({
  leagueMatches,
  tournamentId,
  stage,
  stage1,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [collapsedRounds, setCollapsedRounds] = useState(new Set());

  const {
    data: { data: { data: knockoutData } = {} } = {},
    isLoading: isknockoutLoading,
    refetch,
  } = useQuery({
    queryKey: ["knockouts", stage?.stageData?._id],
    queryFn: () => {
      return API.get(`/knockouts/${stage?.stageData._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
    enabled: !!stage,
  });

  const handleSubmit = async (players) => {
    setIsLoading(true);
    const response = await API.post(
      `/knockouts/${tournamentId}/generate-gauntlet-knockout`,
      { mainLeagueChampionIds: players },
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }
    );
    if (response.data.success) {
      setIsLoading(false);
      setIsModalOpen(false);
      toast.success("stage 1 finalized and stage 2 fixtures generated");
      refetch();
    }
    setIsLoading(false);
  };

  const handlePublishRound = (round) => {
    setSelectedRound(round);
    setIsPublishModalOpen(true);
  };

  const handleEditScore = (match) => {
    setSelectedMatch(match);
    setIsScoreModalOpen(true);
  };

  const handleSaveScore = async (score) => {
    try {
      const response = await API.patch(
        `/matches/submit-score/leagueAndKnockout`,
        { ...score, _id: selectedMatch._id },
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
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

  const isRoundCompleted = (matches) => {
    return matches.every((match) => match.status === "Completed");
  };

  if (isknockoutLoading) {
    return <AuthLoader />;
  }

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

  const toggleRoundCollapse = (roundName) => {
    const newCollapsed = new Set(collapsedRounds);
    if (newCollapsed.has(roundName)) {
      newCollapsed.delete(roundName);
    } else {
      newCollapsed.add(roundName);
    }
    setCollapsedRounds(newCollapsed);
  };

  return (
    <div className="space-y-6">
      {!stage ? (
        <div className="flex items-center justify-between">
          <p className="text-gray-400">Knockout stage is not started yet.</p>
          <>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed "
              disabled={
                isLoading ||
                leagueMatches?.filter((match) => match.status === "Completed")
                  .length < stage1?.stageData?.matches?.length
              }
            >
              {isLoading && <LoaderCircle className="animate-spin" size={10} />}
              {isLoading ? "Please wait..." : "Generate Knockout Stage"}
            </button>
          </>
        </div>
      ) : (
        <div className="backdrop-blur-smrounded-lg space-y-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-indigo-900/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500 via-black to-blue-800 rounded-lg">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-base sm:text-2xl font-bold text-white">
                  {knockoutData?.name}
                </h2>
              </div>
            </div>
          </div>

          <div className="">
            <div>
              {knockoutData?.rounds?.map((round, index) => {
                const isRoundUnpublished = round?.matches?.every(
                  (m) => m.status === "Unpublished"
                );
                const isCollapsed = collapsedRounds.has(round.roundName);

                const roundCompleted = isRoundCompleted(round?.matches);
                const remainingMatch = round?.matches.find(
                  (m) => m.status === "Scheduled"
                );
                return (
                  <div
                    key={index}
                    className="liquid-glass-card w-full relative overflow-hidden p-3"
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

                    <button
                      onClick={() => toggleRoundCollapse(round.roundName)}
                      className="w-full p-2 sm:p-5 hover:bg-gray-800/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          {isCollapsed ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                          )}
                          <span className="text-white font-semibold text-base sm:text-lg truncate">
                            {round.roundName}
                          </span>
                          {roundCompleted && (
                            <span className="hidden sm:inline text-green-400 text-xs font-medium px-2 py-0.5 bg-green-400/10 rounded-full border border-green-400/30">
                              ✓ Completed
                            </span>
                          )}
                        </div>

                        {!roundCompleted && remainingMatch && (
                          <div className="hidden lg:block text-right">
                            <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Start:{" "}
                                {moment
                                  .utc(remainingMatch?.roundStartDate)
                                  .format("MMM DD, HH:mm") || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>
                                End:{" "}
                                {moment
                                  .utc(remainingMatch?.roundEndDate)
                                  .format("MMM DD, HH:mm") || "N/A"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {!roundCompleted && remainingMatch && (
                        <div className="lg:hidden mt-3 pt-3 border-t border-gray-800 flex flex-col sm:flex-row gap-2 text-left">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Start:{" "}
                              {moment
                                .utc(remainingMatch?.roundStartDate)
                                .format("MMM DD, HH:mm") || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              End:{" "}
                              {moment
                                .utc(remainingMatch?.roundEndDate)
                                .format("MMM DD, HH:mm") || "N/A"}
                            </span>
                          </div>
                        </div>
                      )}
                    {isRoundUnpublished && (
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <button
                            onClick={() => handlePublishRound(round)}
                            className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ml-4"
                            >
                            <FaPlay className="mr-2 text-xs" />
                            Publish Round
                          </button>
                        </div>
                      </div>
                    )}
                    </button>
                    <div className="space-y-4">
                      {round?.matches?.map((match, i) => (
                        <div
                          key={i}
                          className="relative liquid-glass-card after:rounded-xl before:rounded-xl overflow-hidden bg-gradient-to-br from-pink-600/90  via-40% to-170%  via-black to-blue-800 rounded-xl p-3 sm:p-4  hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                        >
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-600 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

                          {/* Top info bar */}
                          <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                            <span className="text-gray-200 text-xs sm:text-sm font-bold">
                              {match.round}
                            </span>
                            {/* <StatusBadge status={match.status} /> */}
                          </div>

                          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-2 sm:items-center">
                            {/* Team 1 */}
                            <div className="sm:col-span-2">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="relative shrink-0">
                                  <img
                                    src={
                                      match.team1.image.url ||
                                      "/placeholder.svg"
                                    }
                                    alt={match.team1.name}
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-pink-200"
                                  />
                                  {match.winner?._id === match.team1._id && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                                      <Trophy className="w-3 h-3 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm sm:text-base font-medium truncate ${
                                      match.winner?._id === match.team1._id
                                        ? "text-green-400"
                                        : "text-white"
                                    }`}
                                  >
                                    {match.team1.name}
                                  </p>
                                  <p className="text-xs text-blue-300 font-bold truncate">
                                    {match.team1.inGameUserName}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-center order-first sm:order-none">
                              <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-gray-900/80 to-gray-900/50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-gray-700">
                                <span
                                  className={`text-xl sm:text-2xl font-bold ${
                                    match.winner?._id === match.team1._id
                                      ? "text-green-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {match.team1_score}
                                </span>
                                <span className="text-gray-600 text-sm sm:text-base font-medium">
                                  VS
                                </span>
                                <span
                                  className={`text-xl sm:text-2xl font-bold ${
                                    match.winner?._id === match.team2._id
                                      ? "text-green-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {match.team2_score}
                                </span>
                              </div>
                            </div>

                            {/* Team 2 */}
                            <div className="sm:col-span-2">
                              <div className="flex items-center flex-row-reverse gap-2 sm:gap-3 sm:flex-row-reverse">
                                <div className="relative shrink-0">
                                  <img
                                    src={
                                      match.team2.image.url ||
                                      "/placeholder.svg"
                                    }
                                    alt={match.team2.name}
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-blue-300"
                                  />
                                  {match.winner?._id === match.team2._id && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                                      <Trophy className="w-3 h-3 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="sm:flex-1 min-w-0 text-right">
                                  <p
                                    className={`text-sm sm:text-base font-medium truncate ${
                                      match.winner?._id === match.team2._id
                                        ? "text-green-400"
                                        : "text-white"
                                    }`}
                                  >
                                    {match.team2.name}
                                  </p>
                                  <p className="text-blue-300 font-bold text-xs truncate">
                                    {match.team2.inGameUserName}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {match.winner && (
                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700/50">
                              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                                  <span className="text-green-400 font-medium">
                                    Winner:{" "}
                                    <span className="text-white">
                                      {match.winner.name}
                                    </span>
                                  </span>
                                  <span className="text-gray-400">
                                    ({match.winner.inGameUserName})
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {match.status !== "Completed" && (
                            <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end">
                              <button
                                onClick={() => handleEditScore(match)}
                                className="flex items-center px-3 py-1 bg-pink-800/60 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
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
          </div>
        </div>
      )}
      <GenerateKnockoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        registeredPlayers={stage1?.stageData?.participants}
      />
      {/* Score Update Modal */}
      {selectedMatch && (
        <UpdateMatchScoreModal
          isOpen={isScoreModalOpen}
          onClose={() => setIsScoreModalOpen(false)}
          onSubmit={handleSaveScore}
          match={selectedMatch}
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
}
