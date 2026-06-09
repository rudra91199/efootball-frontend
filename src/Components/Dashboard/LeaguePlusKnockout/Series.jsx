"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Swords,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { API } from "../../../axios";

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Unpublished":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

const LoaderDots = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex space-x-2">
      <div
        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
);

const Series = ({ stage }) => {
  const [collapsedRounds, setCollapsedRounds] = useState(new Set());

  const { data: { data: { data: knockout } = {} } = {}, isLoading } = useQuery({
    queryKey: ["seriesStage", stage?.stageData?._id],
    queryFn: () =>
      API.get(`/knockouts/${stage?.stageData._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }),
    enabled: !!stage,
  });

  const toggleRoundCollapse = (roundName) => {
    const newCollapsed = new Set(collapsedRounds);
    if (newCollapsed.has(roundName)) {
      newCollapsed.delete(roundName);
    } else {
      newCollapsed.add(roundName);
    }
    setCollapsedRounds(newCollapsed);
  };

  if (!stage) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-xl border border-gray-800 p-6">
        <div className="text-center">
          <Swords className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm sm:text-base">
            Series stage is not started yet.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <AuthLoader />;
  }

  const isRoundCompleted = (matches) => {
    return matches.every((match) => match.status === "Completed");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-indigo-900/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500 via-black to-blue-800 rounded-lg">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-base sm:text-2xl font-bold text-white">
              {knockout?.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Rounds */}
      <div className="space-y-4">
        {knockout?.rounds?.map((round) => {
          const roundCompleted = isRoundCompleted(
            round.series.flatMap((s) => s.matches),
          );
          const isCollapsed = collapsedRounds.has(round.roundName);
          const remainingMatch = round.series
            .flatMap((s) => s.matches)
            .find((m) => m.status === "Scheduled");

          return (
            <div
              key={round.roundName}
              className="liquid-glass-card relative px-2 py-4 overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-950/10 to-indigo-900/10 border border-gray-700/50 rounded-xl"
            >
              {/* Round Header */}
              <button
                onClick={() => toggleRoundCollapse(round.roundName)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-800/30 transition-colors gap-3"
              >
                <div className="flex items-center gap-3">
                  {isCollapsed ? (
                    <ChevronUp className="w-5 h-5 text-purple-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                  <h3 className="text-white font-semibold text-base sm:text-lg">
                    {round.roundName}
                  </h3>
                </div>

                {!roundCompleted && remainingMatch && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm pl-8 sm:pl-0">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>
                        End:{" "}
                        {moment
                          .utc(remainingMatch?.roundEndDate)
                          .format("MMM DD, HH:mm") || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </button>

              {/* Series Content */}
              {!isCollapsed && (
                <div className="border-t border-gray-700/90 p-3 sm:p-4 space-y-4">
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
                      <div className="space-y-2 mt-4 border-t border-white/50 pt-4">
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
                          Match History
                        </p>
                        {series?.matches?.map((match) => (
                          <div
                            key={match._id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-black/80 rounded-lg gap-2 sm:gap-0 hover:from-gray-700/50 hover:to-gray-600/30 transition-colors"
                          >
                            {/* Match Info */}
                            <div className="flex-1">
                              <p className="text-yellow text-xs mb-1.5">
                                {match.round}
                              </p>

                              {/* Score Display */}
                              <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
                                <div className="flex-1 sm:flex-none sm:w-24">
                                  <p
                                    className={`text-xs sm:text-sm truncate ${
                                      match.winner?._id === match.team1._id
                                        ? "text-green-300 font-bold"
                                        : "text-blue-300"
                                    }`}
                                  >
                                    {match.team1.name}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 sm:gap-2 bg-gray-900/50 px-2 sm:px-3 py-1 rounded-full">
                                  <span
                                    className={`font-bold text-sm sm:text-base ${
                                      match.winner?._id === match.team1._id
                                        ? "text-green-400"
                                        : "text-blue-300"
                                    }`}
                                  >
                                    {match.team1_score}
                                  </span>
                                  <span className="text-gray-400">-</span>
                                  <span
                                    className={`font-bold text-sm sm:text-base ${
                                      match.winner?._id === match.team2._id
                                        ? "text-green-400"
                                        : "text-blue-300"
                                    }`}
                                  >
                                    {match.team2_score}
                                  </span>
                                </div>

                                <div className="flex-1 sm:flex-none sm:w-24 text-right">
                                  <p
                                    className={`text-xs sm:text-sm truncate ${
                                      match.winner?._id === match.team2._id
                                        ? "text-green-400 font-bold"
                                        : "text-blue-300"
                                    }`}
                                  >
                                    {match.team2.name}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Match Status */}
                            <div className="flex justify-end sm:ml-4">
                              <StatusBadge status={match.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Series;
