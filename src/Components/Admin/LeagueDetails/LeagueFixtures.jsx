"use client";

import { useEffect, useState } from "react";
import { API } from "../../../axios";
import { Calendar, Clock, Loader2 } from "lucide-react";
import moment from "moment/moment";
import { toast } from "react-toastify";
import StatusBadge from "./statusBadge";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import UpdateMatchScoreModal from "./UpdateScoreModal";
import { is } from "zod/v4/locales";

export default function LeagueFixtures({
  leagueFixture,
  leagueId,
  refetch,
  tournamentType,
  isCircuitPointCalculated,
}) {
  const [selectedRound, setSelectedRound] = useState("all");
  const [publishModal, setPublishModal] = useState({
    isOpen: false,
    round: null,
  });

  const [selectedFixtures, setSelectedFixtures] = useState([]);
  const [collapsedRounds, setCollapsedRounds] = useState(new Set());
  const [roundStartDate, setRoundStartDate] = useState("");
  const [roundStartTime, setRoundStartTime] = useState("");
  const [roundEndDate, setRoundEndDate] = useState("");
  const [roundEndTime, setRoundEndTime] = useState("");
  const [calculatingPoints, setCalculatingPoints] = useState(false);
  const [generatingFixture, setGeneratingFixture] = useState(false);
  const [isPublishingRound, setIsPublishingRound] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const generateFixture = async () => {
    try {
      setGeneratingFixture(true);
      const response = await API.post(
        `/leagues/${leagueId}/generate-fixtures`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        },
      );
      if (response.data.success) {
        setGeneratingFixture(false);
        toast.success("Fixtures generated successfully");
        refetch();
      }
      setGeneratingFixture(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to generate fixtures",
      );
      setGeneratingFixture(false);
    }
  };

  const rounds = leagueFixture
    ? leagueFixture.reduce((acc, match) => {
        const round = `${match.round}`;
        if (!acc[round]) {
          acc[round] = [];
        }
        acc[round].push(match);
        return acc;
      }, {})
    : {};

  const handleEditScore = (match) => {
    setSelectedMatch(match);
    setShowScoreModal(true);
  };

  const handleSaveScore = async (score) => {
    const response = await API.patch(
      `/matches/submit-score/leagueAndKnockout`,
      { ...score, _id: selectedMatch._id },
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      },
    );
    if (response.data.success) {
      setShowScoreModal(false);
      setSelectedMatch(null);
      refetch();
    }
  };

  useEffect(() => {
    if (leagueFixture) {
      const completedRounds = new Set();
      Object.entries(rounds).forEach(([round, matches]) => {
        if (isRoundCompleted(matches)) {
          completedRounds.add(round);
        }
      });
      setCollapsedRounds(completedRounds);
    }
  }, [leagueFixture]);

  const toggleRoundCollapse = (round) => {
    const newCollapsed = new Set(collapsedRounds);
    if (newCollapsed.has(round)) {
      newCollapsed.delete(round);
    } else {
      newCollapsed.add(round);
    }
    setCollapsedRounds(newCollapsed);
  };

  const handlePublishFixtures = (round) => {
    setSelectedFixtures(rounds[round] || []);
    setPublishModal({
      isOpen: true,
      round,
    });
  };

  const formatDateForMongoDB = (dateStr, timeStr) => {
    const combinedDateTime = `${dateStr}T${timeStr}:00.000Z`;
    const dateObject = new Date(combinedDateTime);
    return dateObject.toISOString();
  };

  const handleSaveRoundSettings = async () => {
    if (!roundStartDate || !roundEndDate || !roundStartTime || !roundEndTime) {
      alert("All fields are required.");
      return;
    }

    const mongoDBDateStringStart = formatDateForMongoDB(
      roundStartDate,
      roundStartTime,
    );
    const mongoDBDateStringEnd = formatDateForMongoDB(
      roundEndDate,
      roundEndTime,
    );

    setIsPublishingRound(true);
    const response = await API.patch(
      `/leagues/${leagueId}/publish-rounds`,
      {
        roundStartDate: mongoDBDateStringStart,
        roundEndDate: mongoDBDateStringEnd,
        round: publishModal.round,
      },
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      },
    );
    if (response.data.success) {
      setRoundStartDate("");
      setRoundStartTime("");
      setRoundEndDate("");
      setRoundEndTime("");
      setSelectedFixtures([]);
      setPublishModal({
        isOpen: false,
        round: null,
      });
      setIsPublishingRound(false);
      toast.success("Fixtures published successfully");
      refetch();
    }
    setIsPublishingRound(false);
  };

  const finalizePhase1AndGenerateGauntlet = async () => {
    setCalculatingPoints(true);
    try {
      const response = await API.post(
        `/leagues/finalize-phase1-and-generate-gauntlet/${leagueId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        },
      );
      if (response.data.success) {
        toast.success(
          "Circuit points calculated and gauntlet generated successfully",
        );
        setCalculatingPoints(false);
        refetch();
      }
    } catch (error) {
      setCalculatingPoints(false);
      toast.error(
        error?.response?.data?.message ||
          "Failed to calculate circuit points and generate gauntlet",
      );
    }
  };

  const isRoundCompleted = (matches) => {
    return matches.every((match) => match.status === "Completed");
  };

  const renderMatch = (match, showEditButton) => (
    <div
      key={match._id}
      className="relative bg-gradient-to-br from-blue-950 to-black/50 rounded-xl p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 gap-2">
          <p className="text-gray-400 text-xs sm:text-sm font-medium truncate">
            {match.round}
          </p>
          <StatusBadge status={match.status} />
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <img
                src={match.team1.image.url || "/placeholder.svg"}
                alt={match.team1.name}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0 ring-2 ring-slate-700/50"
              />
              <p
                className={`text-xs font-medium truncate ${
                  match.winner?._id === match.team1._id
                    ? "text-green-400"
                    : "text-white"
                }`}
              >
                {match.team1.name.split(" ").slice(0, 2).join(" ")}
              </p>
            </div>
            <span
              className={`text-lg font-bold min-w-[24px] text-center ${
                match.winner?._id === match.team1._id
                  ? "text-green-400"
                  : "text-gray-300"
              }`}
            >
              {match.team1_score}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <img
                src={match.team2.image.url || "/placeholder.svg"}
                alt={match.team2.name}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0 ring-2 ring-slate-700/50"
              />
              <p
                className={`text-xs font-medium truncate ${
                  match.winner?._id === match.team2._id
                    ? "text-green-400"
                    : "text-white"
                }`}
              >
                {match.team2.name.split(" ").slice(0, 2).join(" ")}
              </p>
            </div>
            <span
              className={`text-lg font-bold min-w-[24px] text-center ${
                match.winner?._id === match.team2._id
                  ? "text-green-400"
                  : "text-gray-300"
              }`}
            >
              {match.team2_score}
            </span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid sm:grid-cols-7 sm:gap-2 sm:items-center mb-3">
          {/* Team 1 */}
          <div className="col-span-3">
            <div className="flex items-center space-x-3">
              <img
                src={match.team1.image.url || "/placeholder.svg"}
                alt={match.team1.name}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 ring-2 ring-slate-700/50"
              />
              <p
                className={`text-sm font-medium truncate ${
                  match.winner?._id === match.team1._id
                    ? "text-green-400"
                    : "text-white"
                }`}
              >
                {match.team1.name}
              </p>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-2">
            <span
              className={`text-xl font-bold ${
                match.winner?._id === match.team1._id
                  ? "text-green-400"
                  : "text-gray-300"
              }`}
            >
              {match.team1_score}
            </span>
            <span className="text-gray-600 text-sm">-</span>
            <span
              className={`text-xl font-bold ${
                match.winner?._id === match.team2._id
                  ? "text-green-400"
                  : "text-gray-300"
              }`}
            >
              {match.team2_score}
            </span>
          </div>

          {/* Team 2 */}
          <div className="col-span-3">
            <div className="flex items-center justify-end space-x-3">
              <p
                className={`text-sm font-medium truncate ${
                  match.winner?._id === match.team2._id
                    ? "text-green-400"
                    : "text-white"
                }`}
              >
                {match.team2.name}
              </p>
              <img
                src={match.team2.image.url || "/placeholder.svg"}
                alt={match.team2.name}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 ring-2 ring-slate-700/50"
              />
            </div>
          </div>
        </div>

        {/* Match Actions */}
        {
          <div className="flex justify-end pt-3 border-t border-slate-700/50 mt-3">
            <button
              onClick={() => handleEditScore(match)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-red-opc text-white text-xs font-medium rounded-lg transition-all duration-200 active:scale-95"
            >
              <Pencil className="w-3 h-3" />
              <span className="hidden sm:inline">Update Score</span>
              <span className="sm:hidden">Edit</span>
            </button>
          </div>
        }
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Header */}
      <div className="liquid-glass-card relative bg-red-black-opc backdrop-blur-md  rounded-2xl p-4 sm:p-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-gray-400 text-sm">
                Total Matches:{" "}
                <span className="text-white font-semibold">
                  {leagueFixture?.length || 0}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Total Matches Card */}
            <div className="bg-black/30 rounded-xl p-4 hover:border-blue-400/50 transition-all hover:scale-[1.02]">
              <p className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">
                Total Matches
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-300">
                {leagueFixture?.length || 0}
              </p>
            </div>

            {/* Completed Card */}
            <div className="bg-black/30 rounded-xl p-4 hover:border-green-400/50 transition-all hover:scale-[1.02]">
              <p className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">
                Completed
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-green-300">
                {leagueFixture?.filter((m) => m.status === "Completed")
                  ?.length || 0}
              </p>
            </div>

            {/* Pending Card */}
            <div className="bg-black/30 rounded-xl p-4 hover:border-amber-400/50 transition-all hover:scale-[1.02]">
              <p className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">
                Pending
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-300">
                {leagueFixture?.filter((m) => m.status !== "Completed")
                  ?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full sm:w-auto">
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 bg-blue-black border border-slate-600/50 rounded-xl text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:border-blue-500/50"
          >
            <option value="all">All Rounds</option>
            {Object.keys(rounds).map((round) => (
              <option key={round} value={round}>
                {round}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {leagueFixture?.length < 1 && (
            <button
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-black text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium active:scale-95 shadow-lg shadow-blue-500/20"
              onClick={() => generateFixture()}
              disabled={generatingFixture}
            >
              {generatingFixture && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {generatingFixture ? "Generating..." : "Generate Fixtures"}
            </button>
          )}

          {leagueFixture?.every((match) => match.status === "Completed") &&
            isCircuitPointCalculated === false &&
            tournamentType === "Champions Circuit" && (
              <button
                className="w-full sm:w-auto px-4 py-2.5 bg-pink-red text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium active:scale-95 shadow-lg shadow-purple-500/20"
                onClick={() => finalizePhase1AndGenerateGauntlet()}
                disabled={calculatingPoints}
              >
                {calculatingPoints && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {calculatingPoints
                  ? "Calculating..."
                  : "Calculate Circuit Points"}
              </button>
            )}
        </div>
      </div>

      {/* Rounds */}
      <div className="space-y-3 sm:space-y-4">
        {Object.entries(rounds)
          .filter(
            ([round]) => selectedRound === "all" || selectedRound === round,
          )
          .map(([round, matches]) => {
            const roundCompleted = isRoundCompleted(matches);
            const isCollapsed = collapsedRounds.has(round);
            const isRoundUnpublished = matches.every(
              (m) => m.status === "Unpublished",
            );
            const remainingMatch = matches.find(
              (m) => m.status === "Scheduled",
            );

            return (
              <div
                key={round}
                className="rounded-2xl bg-blue-black backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                  <button
                    onClick={() => toggleRoundCollapse(round)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-800/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      {isCollapsed ? (
                        <ChevronUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <h3 className="text-white font-semibold text-sm sm:text-base">
                        {round}
                      </h3>
                      {roundCompleted && (
                        <span className="text-green-400 text-xs font-medium bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                        {matches.filter((m) => m.status === "Completed").length}
                        /{matches.length}
                      </span>
                      {!roundCompleted && remainingMatch && (
                        <span className="hidden sm:inline text-xs text-gray-500">
                          {moment
                            .utc(remainingMatch?.roundStartDate)
                            .format("MMM DD, HH:mm") || "N/A"}
                        </span>
                      )}
                    </div>
                  </button>

                  {isRoundUnpublished && (
                    <div className="px-3 pb-3 sm:px-4 sm:pb-0">
                      <button
                        onClick={() => handlePublishFixtures(round)}
                        disabled={isPublishingRound}
                        className="w-full sm:w-auto px-4 py-2 bg-pink-red text-white rounded-lg transition-all text-xs font-medium active:scale-95 disabled:opacity-50 whitespace-nowrap"
                      >
                        Publish Rounds
                      </button>
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="space-y-2 sm:space-y-3 border-t border-slate-700/50 p-3 sm:p-4 bg-slate-900/30">
                    {matches.map((match) =>
                      renderMatch(match, isRoundUnpublished),
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Publish Fixtures Modal */}
      {publishModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="liquid-glass-card relative bg-blue-black p-6 sm:p-6 rounded-2xl max-w-md w-full  max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Publish Fixtures
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Are you sure you want to publish {selectedFixtures?.length}{" "}
              fixture(s)?
            </p>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={roundStartDate}
                    onChange={(e) => setRoundStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-slate-950 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={roundStartTime}
                    onChange={(e) => setRoundStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-slate-950 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={roundEndDate}
                    onChange={(e) => setRoundEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-slate-950 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    End Time
                  </label>
                  <input
                    type="time"
                    value={roundEndTime}
                    onChange={(e) => setRoundEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-slate-950 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {selectedFixtures.map((match) => (
                <div
                  key={match._id}
                  className="text-xs p-2 bg-red-100/70 rounded-lg text-white/80 font-bold"
                >
                  <span className="text-red-900">{match.team1.name}</span>
                  &nbsp;&nbsp;vs&nbsp;&nbsp;
                  <span className="text-blue-950">{match.team2.name}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setPublishModal({
                    isOpen: false,
                    round: null,
                  })
                }
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoundSettings}
                disabled={isPublishingRound}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 text-sm font-medium"
              >
                {isPublishingRound && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isPublishingRound ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMatch && (
        <UpdateMatchScoreModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          match={selectedMatch}
          onSubmit={handleSaveScore}
          stageType="League"
        />
      )}
    </div>
  );
}
