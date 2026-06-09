"use client";

import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "../../../Hooks/useIsMobile";
import { useAuthStore } from "../../../store/authStore";
import AuthLoader from "../../Loaders/AuthLoader";
import { API } from "../../../axios";

export default function Leaderboard({ data, isLoading }) {
  const isMobile = useIsMobile();

  const { user } = useAuthStore();

  const getRankColor = (index, id) => {
    if (index === 0)
      return "bg-yellow-500/10 border-yellow-400/50 text-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.6)]";
    if (index === 1)
      return "bg-pink-400/10 border-pink-400/50 text-pink-200 shadow-[0_0_10px_rgba(255,0,130,0.6)]";
    if (index === 2)
      return "bg-red-500/10 border-red-500/50 text-red-200 shadow-[0_0_10px_rgba(242,8,4,0.6)]";
    if (index === 3)
      return "bg-blue-600/10 border-blue-600/50 text-blue-300 shadow-[0_0_10px_rgba(117,171,252,0.6)]";
    if (id === user._id)
      return "bg-blue-950/10 border-blue-300/70 saturate-125 shadow-[0_0_15px_rgba(4,25,150,0.5)] text-white";
    return "bg-black/5 border-white/30 text-white";
  };

  const getStripeColor = (index, id) => {
    if (index === 0)
      return "bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-800 shadow-[2_0_15px_rgba(250,204,21,0.6)]";
    if (index === 1)
      return "bg-gradient-to-b from-pink-600 via-pink-400 to-black/20 shadow-[2_0_15px_rgba(255,0,130,0.6)]";
    if (index === 2)
      return "bg-gradient-to-b from-red-800 via-red-500 to-black/40 shadow-[2_0_15px_rgba(242,8,4,0.6)]";
    if (index === 3)
      return "bg-gradient-to-b from-blue-300 via-blue-500 to-black/40 shadow-[2_0_15px_rgba(117,171,252,0.6)]";
    if (id === user._id)
      return "bg-gradient-to-b from-blue-700 via-blue-900 to-black/10 shadow-[2_0_10px_rgba(4,25,150,0.5)]";
    return "bg-gradient-to-b from-gray-500 via-gray-700 to-black/40";
  };

  const getPositionColor = (position) => {
    if (position === 1) return "bg-yellow-600 text-white";
    if (position === 2) return "bg-gray-400 text-black";
    if (position === 3) return "bg-orange-600 text-white";
    return "bg-gray-700 text-white";
  };

  const getQualificationColor = (position) => {
    if (position <= 4) return "border-l-4 border-primary";
    if (position >= 5) return "border-l-4 border-destructive";
    return "";
  };

  if (isLoading) {
    return <AuthLoader />;
  }

  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Leaderboards & Tables
          </h1>
        </div>

        <div>
          {data?.map((player, index) => (
            <div
              className={`relative w-full overflow-hidden mb-5  px-3 pt-2 pb-1 rounded-xl border backdrop-blur-sm  ${
                player.playerInfo._id === user._id && index >= 4
                  ? "scale-[1.03] " + getRankColor(index, player.playerInfo._id)
                  : getRankColor(index, player.playerInfo._id)
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-6  ${getStripeColor(
                  index,
                  player.playerInfo._id,
                )} flex items-center justify-center`}
              >
                <span className="text-lg font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] -rotate-0">
                  {index + 1}
                </span>
              </div>

              <div className="flex items-center gap-4 border-b ml-6 pb-2">
                <div
                  className={`flex ${
                    player.playerInfo._id === user._id && index >= 4
                      ? "scale-[1.1]"
                      : ""
                  } items-center justify-center rounded-full border-2 overflow-hidden font-bold text-sm ${getRankColor(
                    index,
                    player.playerInfo._id,
                  )}`}
                >
                  <img
                    src={player.playerInfo.image.url}
                    alt=""
                    className={`w-12 h-12 object-cover `}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-bold truncate text-white ${
                        player.playerInfo._id === user._id && index >= 4
                          ? "scale-[1.1]"
                          : ""
                      }`}
                    >
                      {player.playerInfo.name.split(" ").slice(0, 2).join(" ")}
                    </h3>
                  </div>
                  <div className="text-xs text-blue-200/60 font-bold">
                    <span className="text-pink-600/70">
                      {player.played} Matches
                    </span>{" "}
                    •{" "}
                    <span className="text-lime-400/80">
                      {player.wins} Wins{" "}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-lime-300 drop-shadow-[0_0_8px_rgba(105,253,0,0.5)]">
                    {player.points}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-200/50 font-medium">
                    Points
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1 pl-4">
                <div className="text-center">
                  <div className="text-[10px] text-blue-200/50 ">W</div>
                  <div className="font-bold text-base text-green-400">
                    {player.wins}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-blue-200/50 ">D</div>
                  <div className="font-bold text-base text-blue-400">
                    {player.draws}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-blue-200/50">L</div>
                  <div className="font-bold text-base text-red-800">
                    {player.losses}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-blue-200/50">GD</div>
                  <div
                    className={`font-bold text-base ${
                      player.goalDifference > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {player.goalDifference > 0 ? "+" : ""}
                    {player.goalDifference}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-blue-200/50">GF/GA</div>
                  <div className="font-medium text-base">
                    <span className="text-pink-400">{player.goalsFor}</span>
                    <span className="text-blue-200/50">/</span>
                    <span className="text-yellow-400">
                      {player.goalsAgainst}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Leaderboards & Tables
        </h1>
      </div>

      <div className="space-y-6 sm:w-auto">
        <div className="clean-card sm:p-6 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-foreground">
                    Pos
                  </th>
                  <th className="py-3 px-2 text-sm font-medium text-foreground">
                    Team
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    P
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    W
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    D
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    L
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    GF
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    GA
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    GD
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((team, i) => (
                  <tr
                    key={i}
                    className={`border-b border-border/50 hover:bg-background/20 transition-colors ${getQualificationColor(
                      i + 1,
                    )} ${
                      team.playerInfo._id === user._id
                        ? "bg-gradient-to-br from-[#0124ec70] to-[#00189e23]"
                        : ""
                    }`}
                  >
                    <td className="py-3 px-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPositionColor(
                          i + 1,
                        )}`}
                      >
                        {i + 1}
                      </div>
                    </td>
                    <td className="py-3 px-2 w-[10px]">
                      <span
                        className={`font-medium ${
                          team.playerInfo.name === "Your Team"
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {team.playerInfo.name}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-foreground">
                      {team.played}
                    </td>
                    <td className="py-3 px-2 text-center text-green-400">
                      {team.wins}
                    </td>
                    <td className="py-3 px-2 text-center text-gray-300">
                      {team.draws}
                    </td>
                    <td className="py-3 px-2 text-center text-red-400">
                      {team.losses}
                    </td>
                    <td className="py-3 px-2 text-center text-foreground">
                      {team.goalsFor}
                    </td>
                    <td className="py-3 px-2 text-center text-foreground">
                      {team.goalsAgainst}
                    </td>
                    <td className="py-3 px-2 text-center text-foreground">
                      {team.goalDifference > 0 ? "+" : ""}
                      {team.goalDifference}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-primary">
                      {team.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
