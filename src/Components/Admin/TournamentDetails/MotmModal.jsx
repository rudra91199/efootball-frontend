"use client";

import { useState } from "react";
import { X, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";

export default function MotmModal({ match, setMotmModal }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock player data - in real app this would come from the match data
  const players = [
    {
      id: 1,
      name: "Alex Rodriguez",
      team: "Team Alpha",
      position: "Forward",
      avatar: "/player-avatar-1.png",
      stats: { goals: 2, assists: 1 },
    },
    {
      id: 2,
      name: "Marcus Johnson",
      team: "Team Alpha",
      position: "Midfielder",
      avatar: "/player-avatar-2.png",
      stats: { goals: 1, assists: 2 },
    },
    {
      id: 3,
      name: "David Chen",
      team: "Team Alpha",
      position: "Defender",
      avatar: "/player-avatar-3.png",
      stats: { goals: 0, assists: 1 },
    },
    {
      id: 4,
      name: "Roberto Silva",
      team: "Team Beta",
      position: "Forward",
      avatar: "/player-avatar-4.jpg",
      stats: { goals: 1, assists: 0 },
    },
    {
      id: 5,
      name: "James Wilson",
      team: "Team Beta",
      position: "Midfielder",
      avatar: "/player-avatar-5.jpg",
      stats: { goals: 0, assists: 2 },
    },
    {
      id: 6,
      name: "Michael Brown",
      team: "Team Beta",
      position: "Goalkeeper",
      avatar: "/player-avatar-6.jpg",
      stats: { goals: 0, assists: 0 },
    },
  ];

  const { data: { data: { data } = {} } = {} } = useQuery({
    queryKey: ["matchPlayers", match],
    queryFn: () => {
      return API.get(`/matches/getPlayersByMatch/${match}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  const handleSubmit = async () => {
    if (!selectedPlayer) {
      alert("Please select a player for Man of the Match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.patch(
        `/matches/setMatchOfTheMatch/${match}/${selectedPlayer._id}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );

      if (response.data.success) {
        // alert(`${selectedPlayer.name} has been set as Man of the Match!`);
        setMotmModal({ isOpen: false, match: null });
      }

      // Close modal
    } catch (error) {
      console.error("Error setting MOTM:", error);
      alert("Failed to set Man of the Match. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setMotmModal({ isOpen: false, match: null });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-gray-100">
              Select Man of the Match
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-gray-300 mb-6 text-sm">
          Choose the player who performed exceptionally well in this match to
          award them Man of the Match.
        </p>

        {/* Player Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {data?.map((player) => (
            <div
              key={player._id}
              onClick={() => setSelectedPlayer(player)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedPlayer?._id === player._id
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Player Avatar */}
                <div className="relative">
                  <img
                    src={player.image.url || "/placeholder.svg"}
                    alt={player.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {selectedPlayer?._id === player._id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-gray-900" />
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-100 mb-1">
                    {player.name}
                  </h4>
                </div>

                {/* Selection Indicator */}
                <div className="flex items-center">
                  {selectedPlayer?._id === player._id ? (
                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-600 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Player Summary */}
        {selectedPlayer && (
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-gray-100 font-medium">
                  Selected:{" "}
                  <span className="text-yellow-400">{selectedPlayer.name}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedPlayer || isSubmitting}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              selectedPlayer && !isSubmitting
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Setting MOTM...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4" />
                Set as MOTM
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
