"use client"

import { useState } from "react"
import { FaEdit, FaEye, FaSearch } from "react-icons/fa"
import StatusBadge from "./status-badge"

export default function MatchManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [matches] = useState([
    {
      id: 1,
      tournamentId: 1,
      tournamentName: "Spring Championship 2024",
      round: "Round-1",
      team1: { id: 1, name: "Team Alpha" },
      team2: { id: 2, name: "Team Beta" },
      team1_score: 2,
      team2_score: 1,
      winner: { id: 1, name: "Team Alpha" },
      status: "Completed",
    },
    {
      id: 2,
      tournamentId: 1,
      tournamentName: "Spring Championship 2024",
      round: "Round-1",
      team1: { id: 3, name: "Team Gamma" },
      team2: { id: 4, name: "Team Delta" },
      team1_score: 0,
      team2_score: 0,
      winner: null,
      status: "Scheduled",
    },
    {
      id: 3,
      tournamentId: 1,
      tournamentName: "Spring Championship 2024",
      round: "Semi-Final",
      team1: { id: 5, name: "Team Echo" },
      team2: { id: 6, name: "Team Foxtrot" },
      team1_score: 0,
      team2_score: 0,
      winner: null,
      status: "Scheduled",
    },
  ])

  const filteredMatches = matches.filter(
    (match) =>
      match.tournamentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.round.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Match & Fixtures</h1>
          <p className="text-gray-400">Manage matches and update scores for 3v3 tournaments</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search matches by tournament, teams, or round..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Matches Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg">
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-white font-semibold">Tournament</th>
                  <th className="text-left p-4 text-white font-semibold">Round</th>
                  <th className="text-left p-4 text-white font-semibold">Teams</th>
                  <th className="text-left p-4 text-white font-semibold">Score</th>
                  <th className="text-left p-4 text-white font-semibold">Status</th>
                  <th className="text-left p-4 text-white font-semibold">Winner</th>
                  <th className="text-left p-4 text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="p-4">
                      <p className="text-white font-medium">{match.tournamentName}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                        {match.round}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-white">
                        <div className="font-medium">{match.team1.name}</div>
                        <div className="text-gray-400 text-sm">vs</div>
                        <div className="font-medium">{match.team2.name}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-bold text-lg">
                        {match.team1_score} - {match.team2_score}
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={match.status} />
                    </td>
                    <td className="p-4 text-white">
                      {match.winner ? match.winner.name : match.status === "Completed" ? "Draw" : "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent rounded-md transition-colors"
                          title="Edit Match Score"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          className="p-2 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent rounded-md transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
