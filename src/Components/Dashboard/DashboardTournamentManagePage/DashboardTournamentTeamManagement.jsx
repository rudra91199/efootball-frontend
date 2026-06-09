"use client";

import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "../../../store/authStore";
import moment from "moment";
import { Ban, Info } from "lucide-react";
import AuthLoader from "../../Loaders/AuthLoader";

const DashboardTournamentTeamManagement = ({
  phases,
  tournament,
  isLoading,
}) => {
  const { user } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();

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

  const getFilteredMatches = (allMatches) => {
    const filteredMatches = allMatches.filter((match) => {
      // Condition 1: Check if the status is 'Scheduled' or 'Completed'.
      const isStatusValid =
        match.status === "Scheduled" || match.status === "Completed";

      if (!isStatusValid) {
        return false;
      }

      // Condition 2: Check if the user is the captain or a player in either team.
      // Note: Assumes `players` is an array of objects like [{_id: '...'}]. If it's an array of string IDs, use: match.team1.players.includes(currentUserId)
      const currentUserId = user?._id;
      const isUserInTeam1 =
        match.team1.captain === currentUserId ||
        match.team1.players.some((player) => player === currentUserId);

      const isUserInTeam2 =
        match.team2.captain === currentUserId ||
        match.team2.players.some((player) => player === currentUserId);

      // Return true to keep the match if the status is valid AND the user is in the match.
      return isUserInTeam1 || isUserInTeam2;
    });
    return filteredMatches;
  };

  const getDeadLine = (roundStartTime) => {
    if (roundStartTime) {
      const date = new Date(roundStartTime);

      date?.setHours(date?.getHours() + 10);

      const newDateString = date;
      return newDateString;
    }
  };

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg sm:text-xl font-bold">Manage your Team Here</h3>
      </div>

      {phases?.map((phase) => (
        <div
          key={phase.phaseOrder}
          className={`bg-white/5 border border-border/80 rounded-xl overflow-hidden ${phase.phaseName === "Seeding Scramble" ? "bg-gradient-to-br from-[#262e5c] to-black" : phase.phaseName == "King Of The HIll Gaunlet" ? "bg-gradient-to-br from-[#fefa042a] to-[#69fd0018]" : "bg-gradient-to-br from-[#f2080444] to-[#ff00841f]"}`}
        >
          <div
            className={`p-3 sm:p-4 border-b border-border/20 ${phase.phaseName === "Seeding Scramble" ? "bg-gradient-to-br from-[#262e5c] to-black" : phase.phaseName == "King Of The HIll Gaunlet" ? "bg-gradient-to-br from-[#fefa042a] to-[#69fd0018]" : "bg-gradient-to-br from-[#f2080444] to-[#ff00841f]"}`}
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-base sm:text-lg font-bold truncate">
                {phase.phaseName}
              </h4>
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getPhaseStatusColor(
                  phase.status,
                )}`}
              >
                {phase.status}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 space-y-4">
            {getFilteredMatches(phase?.matches)?.map((match) => {
              const hasTeam1Submitted = match.team1_squad?.star_player;
              const hasTeam2Submitted = match.team2_squad?.star_player;

              const userIsCaptainOfTeam1 = match.team1?.captain === user?._id;
              const userIsCaptainOfTeam2 = match.team2?.captain === user?._id;

              const isSquadSubmitted =
                (hasTeam1Submitted && userIsCaptainOfTeam1) ||
                (hasTeam2Submitted && userIsCaptainOfTeam2);

              const isUserCaptainInMatch =
                userIsCaptainOfTeam1 || userIsCaptainOfTeam2;
              let buttonText = "Submit Squad"; // Default text

              if (userIsCaptainOfTeam1 && hasTeam1Submitted) {
                buttonText = "Change Squad";
              } else if (userIsCaptainOfTeam2 && hasTeam2Submitted) {
                buttonText = "Change Squad";
              }

              const deadline = moment(getDeadLine(match?.roundStartDate));

              const now = moment();

              const hasDeadlinePassed = now.isAfter(deadline);

              return (
                <div
                  key={match.id}
                  className=" border border-border/80 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                          {match.round}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                            match.status,
                          )}`}
                        >
                          {match.status}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <span className="hidden sm:inline">
                          Round Start Date :
                        </span>
                        <span className="sm:hidden">Start:</span>
                        {moment.utc(match?.roundStartDate).format("lll")}
                      </span>
                      {isUserCaptainInMatch &&
                        match.status !== "Completed" &&
                        buttonText === "Change Squad" && (
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/my-tournaments/tournament/${id}/squad-update/${match._id}`,
                                {
                                  state: {
                                    tournament: tournament,
                                  },
                                },
                              )
                            }
                            className={`py-2 px-3 sm:px-4 text-xs sm:text-sm bg-gradient-to-br from-[#f20604] to-[#ff0082] text-primary-foreground rounded-lg font-medium hover:bg-primary/80 transition-colors w-full sm:w-auto disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400
                            }`}
                            disabled={hasDeadlinePassed}
                          >
                            Change Squad
                          </button>
                        )}
                    </div>
                    <div className="w-full lg:w-auto lg:min-w-fit">
                      {match.status === "Completed" && (
                        <div className="text-xs sm:text-sm text-green-400 font-medium ">
                          {match.winner
                            ? "Winner : " + match.winner.name
                            : "Draw"}
                        </div>
                      )}
                      {match?.manOfTheMatch &&
                        match?.status === "Completed" && (
                          <p className="text-green-400 text-xs sm:text-sm mt-2">
                            MOTM : {match?.manOfTheMatch?.name}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
                      <div className="text-center sm:text-left sm:min-w-[120px] flex-1 flex flex-col items-center sm:items-start justify-center gap-2">
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

                        {hasTeam2Submitted ? (
                          <p className="text-xs text-green-400 mt-1">
                            ✅ Squad Submitted
                          </p>
                        ) : (
                          <p className="text-xs text-yellow-400 mt-1">
                            ⏳ Awaiting Squad
                          </p>
                        )}
                      </div>

                      <div className="text-center px-4 self-center">
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

                      <div className="text-center sm:text-left sm:min-w-[120px] flex-1 flex flex-col items-center sm:items-end justify-end gap-2">
                        <img
                          src={match.team2.logo.url || "/placeholder.svg"}
                          alt=""
                          className="w-12 h-12 sm:w-20 sm:h-20 object-contain mx-auto sm:mx-0 mb-2 sm:mb-0 rounded-full bg-white/10 p-1"
                        />
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
                        {hasTeam2Submitted ? (
                          <p className="text-xs text-green-400 mt-1">
                            ✅ Squad Submitted
                          </p>
                        ) : (
                          <p className="text-xs text-yellow-400 mt-1">
                            ⏳ Awaiting Squad
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-start sm:items-center gap-2 mt-5">
                    <Info
                      size={16}
                      className="sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0"
                    />
                    <span className="break-words">
                      <span className="hidden sm:inline">
                        Squad submission deadline :
                      </span>
                      <span className="sm:hidden">Deadline:</span>{" "}
                      {moment(getDeadLine(match?.roundStartDate)).format("lll")}
                    </span>
                  </span>

                  {(match.status === "Completed" || hasDeadlinePassed) &&
                  match.details.subMatches.length > 0 ? (
                    <div className="mt-4 pt-4 border-t border-border/10">
                      <h5 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3">
                        Sub-Matches
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {match.details.subMatches.map((subMatch, index) => (
                          <div
                            key={index}
                            className={`rounded-lg p-3 ${
                              subMatch.matchType === "Star Player" &&
                              "shadow-allround-star"
                            }
                ${
                  subMatch.matchType === "First Day Player" &&
                  "shadow-allround-first"
                }
                ${
                  subMatch.matchType === "Late Night Player" &&
                  "shadow-allround-late"
                }`}
                          >
                            <div
                              className={`text-xs font-medium text-primary mb-2 
                                ${
                                  subMatch.matchType === "Star Player" &&
                                  "text-red-500"
                                }
                                ${
                                  subMatch.matchType === "First Day Player" &&
                                  "text-pink-700"
                                }
                               ${
                                 subMatch.matchType === "Late Night Player" &&
                                 "text-yellow-500"
                               }
                          `}
                            >
                              {subMatch.matchType}
                            </div>

                            <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                              <span className="truncate flex-1">
                                {subMatch.player1?.baseTeamName}
                              </span>
                              <span className="font-bold whitespace-nowrap">
                                <span
                                  className={`${
                                    subMatch.player1Score >
                                    subMatch.player2Score
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {subMatch.player1Score}
                                </span>
                                &nbsp; - &nbsp;
                                <span
                                  className={`${
                                    subMatch.player2Score >
                                    subMatch.player1Score
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {subMatch.player2Score}
                                </span>
                              </span>
                              <span className="truncate flex-1 text-right">
                                {subMatch.player2?.baseTeamName}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {(userIsCaptainOfTeam1 || userIsCaptainOfTeam2) && (
                        <div className="mt-4 pt-4 border-t border-border/10">
                          {hasDeadlinePassed && (
                            <p className="mb-3 text-xs sm:text-sm text-red-500 flex items-start sm:items-center gap-1">
                              <Ban
                                size={14}
                                className="flex-shrink-0 mt-0.5 sm:mt-0"
                              />
                              <span>Squad submission deadline has passed!</span>
                            </p>
                          )}

                          <button
                            disabled={
                              !moment(
                                getDeadLine(match?.roundStartDate),
                              ).isAfter(moment()) || isSquadSubmitted
                            }
                            onClick={() =>
                              navigate(
                                `/dashboard/my-tournaments/tournament/${id}/squad-submit/${match._id}`,
                                {
                                  state: {
                                    tournament: tournament,
                                  },
                                },
                              )
                            }
                            className="py-2 px-4 sm:px-5 text-sm bg-gradient-to-br from-[#fefb04] to-[#69fd00] text-[#041996] rounded-lg font-bold hover:bg-primary/80 transition-colors disabled:from-[#4646469a] disabled:to-[#afafaf17] disabled:cursor-not-allowed disabled:text-gray-400 w-full sm:w-auto"
                          >
                            Submit Squad
                          </button>
                        </div>
                      )}
                    </>
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

export default DashboardTournamentTeamManagement;
