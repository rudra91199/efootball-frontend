"use client";

import { useState } from "react";
import { Medal, TrendingUp } from "lucide-react";

const getMedalColor = (rank) => {
  switch (rank) {
    case 1:
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case 2:
      return "bg-gray-400/20 text-gray-300 border-gray-500/30";
    case 3:
      return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    default:
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
  }
};

const TeamRankingCard = ({ team }) => {
  const maxWins = Math.max(...team.playerRankings.map((p) => p.wins));

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-purple-900/30 to-blue-900/20 border border-purple-500/30 rounded-xl p-4 sm:p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />

      {/* Team Header */}
      <div className="relative flex items-center gap-4 pb-6 border-b border-purple-500/20 mb-6">
        <img
          src={team.logo.url || "/placeholder.svg"}
          alt={team.name}
          className="w-14 h-14 rounded-lg object-cover border-2 border-purple-500/50"
        />
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white">{team.name}</h3>
          <p className="text-sm text-gray-400">
            {team.playerRankings.length} Players
          </p>
        </div>
      </div>

      {/* Players List */}
      <div className="space-y-2">
        {team.playerRankings.map((ranking, idx) => {
          const player = team.players.find((p) => p._id === ranking.player);
          const winPercentage =
            maxWins > 0 ? (ranking.wins / maxWins) * 100 : 0;

          return (
            <div
              key={idx}
              className="relative overflow-hidden bg-black/30 border border-purple-500/20 rounded-lg p-3 hover:border-purple-500/40 transition-all group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all" />

              <div className="relative">
                {/* Rank and Player */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm border ${getMedalColor(ranking.rank)}`}
                  >
                    {ranking.rank === 1 && <Medal className="w-5 h-5" />}
                    {ranking.rank === 2 && <Medal className="w-5 h-5" />}
                    {ranking.rank === 3 && <Medal className="w-5 h-5" />}
                    {ranking.rank > 3 && `#${ranking.rank}`}
                  </div>

                  <img
                    src={player?.image?.url || "https://via.placeholder.com/40"}
                    alt={player?.name}
                    className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {player?.inGameUserName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {player?.name}
                    </p>
                  </div>

                  <p className="text-lg font-bold text-purple-300 flex-shrink-0">
                    {ranking.wins}
                  </p>
                </div>

                {/* Performance Bar */}
                <div className="w-full bg-black/40 rounded-full h-1.5 border border-purple-500/20 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300"
                    style={{ width: `${winPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function TeamRankings({ teams }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-indigo-900/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
        <div className="relative flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Phase 1 Rankings
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Player standings by team after phase 1
            </p>
          </div>
        </div>
      </div>

      {/* Team Rankings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team) => (
          <TeamRankingCard key={team._id} team={team} />
        ))}
      </div>
    </div>
  );
}
