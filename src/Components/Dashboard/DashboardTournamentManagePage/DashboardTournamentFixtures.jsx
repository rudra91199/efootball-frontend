"use client";

import moment from "moment";
import { Info } from "lucide-react";
import AuthLoader from "../../Loaders/LoaderDots";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import DashboardSubMatches from "./DashboardSubMatches";

const DashboardTournamentFixtures = ({ phases, isLoading }) => {
  const { id } = useParams();
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Active":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Scheduled":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Unpublished":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPhaseStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400";
      case "Active":
        return "bg-blue-500/20 text-blue-400";
      case "Pending":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCardDisplay = (cardType) => {
    switch (cardType) {
      case "yellow":
        return {
          color: "bg-yellow-400",
          icon: "🟨",
          textColor: "text-yellow-400",
        };
      case "orange":
        return {
          color: "bg-orange-500",
          icon: "🟧",
          textColor: "text-orange-500",
        };
      case "red":
        return { color: "bg-red-600", icon: "🟥", textColor: "text-red-600" };
      default:
        return null;
    }
  };

  const { data: { data: { data: playerStatuses } = {} } = {} } = useQuery({
    queryKey: ["playerStatuses"],
    queryFn: () => {
      return API.get(`/tournaments/${id}/playerStatuses`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <AuthLoader />;
  }

  const getFilteredMatches = (allMatches) => {
    return allMatches;
  };

  const getDeadLine = (roundStartTime) => {
    if (roundStartTime) {
      const date = new Date(roundStartTime);

      date?.setHours(date?.getHours() + 10);

      const newDateString = date;
      return newDateString;
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl sm:text-2xl font-bold">Tournament Fixtures</h3>
      </div>

      {phases?.map((phase) => (
        <div
          key={phase.phaseOrder}
          className={`border border-border/80 rounded-xl overflow-hidden ${
            phase.phaseName === "Seeding Scramble"
              ? "bg-gradient-to-tr sm:bg-gradient-to-br from-[#262e5c] to-black"
              : phase.phaseName == "King Of The HIll Gaunlet"
                ? "bg-gradient-to-tr sm:bg-gradient-to-br from-[#fefa043a] to-[#69fd000d]"
                : "bg-gradient-to-tr sm:bg-gradient-to-br from-[#f2080444] to-[#ff00841f]"
          }`}
        >
          <div
            className={`p-3 sm:p-4 border-b border-border/20 ${
              phase.phaseName === "Seeding Scramble"
                ? "bg-gradient-to-br from-[#262e5c] to-black"
                : phase.phaseName == "King Of The HIll Gaunlet"
                  ? "bg-gradient-to-r sm:bg-gradient-to-br from-[#fefa042a] to-[#69fd0018]"
                  : "bg-gradient-to-br from-[#f2080444] to-[#ff00841f]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h4 className="text-base sm:text-lg font-bold">
                {phase.phaseName}
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border w-fit ${getPhaseStatusColor(
                  phase.status,
                )}`}
              >
                {phase.status}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 space-y-4">
            {getFilteredMatches(phase?.matches)?.map((match) => {
              const deadline = moment(getDeadLine(match?.roundStartDate));
              const now = moment();
              const hasDeadlinePassed = now.isAfter(deadline);
              return (
                <div
                  key={match._id}
                  className="border border-border/40 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                          {match.round}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            match.status,
                          )}`}
                        >
                          {match.status}
                        </span>
                      </div>
                      {match.roundStartDate && (
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                          Round Start Date :{" "}
                          <span className="hidden sm:inline">
                            {moment.utc(match?.roundStartDate).format("LLL")}
                          </span>
                          <span className="sm:hidden">
                            {moment.utc(match?.roundStartDate).format("ll")}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="min-w-fit flex justify-between"></div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
                      <div className="text-center sm:text-left sm:min-w-[120px] flex-1 flex flex-col sm:flex-row items-center gap-2">
                        <img
                          src={match.team1.logo.url || "/placeholder.svg"}
                          alt=""
                          className="w-12 h-12 sm:w-20 sm:h-20 object-contain mx-auto sm:mx-0 mb-2 sm:mb-0 rounded-full bg-white/10 p-1"
                        />
                        <p
                          className={`font-bold text-base sm:text-lg truncate ${
                            match.status === "Completed"
                              ? match.winner?._id === match.team1._id
                                ? "text-[#69fd00]"
                                : "text-[#f20604]"
                              : "text-white"
                          } ${
                            match.status === "Completed" &&
                            match.winner === null
                              ? "text-yellow-400"
                              : ""
                          }`}
                        >
                          {match.team1?.name || "TBD"}
                        </p>
                      </div>

                      <div className="text-center sm:px-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl sm:text-2xl font-bold text-primary">
                            {match.team1_score}
                          </span>
                          <span className="text-base sm:text-lg text-muted-foreground">
                            -
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-primary">
                            {match.team2_score}
                          </span>
                        </div>
                      </div>

                      <div className="text-center sm:text-left sm:min-w-[120px] flex-1 flex flex-col sm:flex-row items-center justify-end gap-2">
                        <p
                          className={`font-bold text-base sm:text-lg truncate ${
                            match.status === "Completed"
                              ? match.winner?._id === match.team2._id
                                ? "text-[#69fd00]"
                                : "text-[#f20604]"
                              : "text-white"
                          } ${
                            match.status === "Completed" &&
                            match.winner === null
                              ? "text-yellow-400"
                              : ""
                          }`}
                        >
                          {match.team2?.name || "TBD"}
                        </p>
                        <img
                          src={match.team2.logo.url || "/placeholder.svg"}
                          alt=""
                          className="w-12 h-12 sm:w-20 sm:h-20 object-contain mx-auto sm:mx-0 mb-2 sm:mb-0 rounded-full bg-white/10 p-1"
                        />
                      </div>
                    </div>
                  </div>
                  {match.status !== "Completed" && match.roundStartDate && (
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-start sm:items-center gap-2 mt-5">
                      <Info
                        size={16}
                        className="sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0"
                      />
                      <span>
                        Squad submission deadline :{" "}
                        <span className="hidden sm:inline">
                          {moment(getDeadLine(match?.roundStartDate)).format(
                            "LLL",
                          )}
                        </span>
                        <span className="sm:hidden">
                          {moment(getDeadLine(match?.roundStartDate)).format(
                            "ll",
                          )}
                        </span>
                      </span>
                    </span>
                  )}
                  {match.status !== "Completed" && match.roundEndDate && (
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-start sm:items-center gap-2 mt-5">
                      <Info
                        size={16}
                        className="sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0"
                      />
                      <span>
                        Round End Date :{" "}
                        <span className="hidden sm:inline">
                          {moment.utc(match?.roundEndDate).format("LLL")}
                        </span>
                        <span className="sm:hidden">
                          {moment.utc(match?.roundEndDate).format("ll")}
                        </span>
                      </span>
                    </span>
                  )}

                  {match.details.subMatches.length > 0 && (
                    <DashboardSubMatches
                      match={match}
                      playerStatuses={playerStatuses}
                      getCardDisplay={getCardDisplay}
                      hasDeadlinePassed={hasDeadlinePassed}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardTournamentFixtures;
