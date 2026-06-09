import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API } from "../../axios";
import { useParams } from "react-router";
import AuthLoader from "../Loaders/AuthLoader";

export default function ChampionshipPoints({ tournamentName }) {
  const { id: tournamentId } = useParams();
  const {
    data: { data: { data: finalPhaseLeaderboard } = {} } = {},
    isLoading: isLoadingFinalPhase,
  } = useQuery({
    queryKey: ["finalPhaseLeaderboard", tournamentId],
    queryFn: () => {
      return API.get(
        `/tournaments/generateFinalSeedingLeaderboard/${tournamentId}`,
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        },
      );
    },
  });

  const getPositionColor = (position) => {
    if (position === 1) return "bg-yellow-600 text-white";
    if (position === 2) return "bg-gray-400 text-black";
    if (position === 3) return "bg-orange-600 text-white";
    return "bg-gray-700 text-white";
  };

  if (isLoadingFinalPhase) {
    return <AuthLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Championship Points
          </h1>
          <p className="text-muted-foreground mt-1">
            Track team performance across tournament phases
          </p>
        </div>
      </div>

      {/* Championship Points Table */}
      <div className="bg-white/5 sm:p-6 rounded-lg p-1 border-2 border-border/70">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl ml-2 font-bold text-foreground">
            Championship Points
          </h2>
          <div className="text-sm mr-2 text-muted-foreground">
            Total Teams: {finalPhaseLeaderboard?.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-border">
                <th className="w-[5%] text-left text-sm font-medium text-foreground">
                  Pos
                </th>
                <th className=" text-center py-3 px-4 text-sm font-medium text-foreground">
                  Team
                </th>
                <th className="w-[12%] text-center py-3 px-2 text-sm font-medium text-foreground">
                  P-1
                </th>
                <th className="w-[12%] text-center py-3 px-2 text-sm font-medium text-foreground">
                  P-2
                </th>
                <th className="w-[12%] text-center py-3 px-2 text-sm font-medium text-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {finalPhaseLeaderboard?.map((team, i) => (
                <tr
                  key={team.position}
                  className={`border-b border-border/50 hover:bg-background/20 transition-colors ${
                    team.isCurrentTeam ? "bg-primary/5" : ""
                  } ;'
                  `}
                >
                  <td className="py-2 px-1">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${getPositionColor(
                        i + 1,
                      )}`}
                    >
                      {i + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={team?.teamInfo?.logo?.url || "/placeholder.svg"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-border"
                      />
                      <span
                        className={`font-medium ${
                          team?.isCurrentTeam
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {team.teamInfo.name}
                        {team?.isCurrentTeam && (
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="font-bold text-blue-300 text-lg">
                      {team.phase1_points}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="font-bold text-green-300 text-lg">
                      {team.phase2_points}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="font-bold text-[#f015c7] text-xl">
                      {team.total_points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Highest Phase 1</p>
            <p className="text-2xl font-bold text-blue-400">
              {
                finalPhaseLeaderboard?.find((team) => team.phase1_points == 4)
                  ?.teamInfo.name
              }
            </p>
          </div>
          <div className="bg-background/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Highest Phase 2</p>
            <p className="text-2xl font-bold text-green-400">
              {finalPhaseLeaderboard?.find((team) => team.phase2_points == 4)
                ?.teamInfo.name
                ? finalPhaseLeaderboard.find((team) => team.phase2_points == 4)
                    .teamInfo.name
                : "Not Decided Yet"}
            </p>
          </div>
          <div className="bg-background/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Highest Total</p>
            <p className="text-2xl font-bold text-primary">
              {
                finalPhaseLeaderboard?.reduce((highest, current) => {
                  return current.total_points > highest.total_points
                    ? current
                    : highest;
                })?.teamInfo.name
              }
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-yellow-500 rounded"></div>
            <span className="text-foreground">1st Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-gray-400 rounded"></div>
            <span className="text-foreground">2nd Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-orange-500 rounded"></div>
            <span className="text-foreground">3rd Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-blue-400 rounded"></div>
            <span className="text-foreground">Phase 1 Points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-green-400 rounded"></div>
            <span className="text-foreground">Phase 2 Points</span>
          </div>
        </div>
      </div>
    </div>
  );
}
