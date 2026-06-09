"use client";

import { useState } from "react";
import { Save, X, Trophy } from "lucide-react";
import { API } from "../../../axios";

export default function MatchScoreEditor({
  match,
  onSaveSuccess,
  onCancel,
  refetch,
  phase,
}) {
  // --- STATE MANAGEMENT ---
  // Holds the scores for all sub-matches being edited
  const [subMatches, setSubMatches] = useState(() => {
    const initialData = match.details?.subMatches || [];
    return initialData.map((sm) => ({
      ...sm,
      player1Score: sm.player1Score ?? 0,
      player2Score: sm.player2Score ?? 0,
      winner: sm.winner || null, // Can be 'player1', 'player2', or null
    }));
  });

  // Tracks which specific sub-match is currently being saved
  const [savingSubMatchId, setSavingSubMatchId] = useState(null);

  // --- FUNCTIONS ---
  // Updates the local state when an admin types in a score
  const updateSubMatchScore = (index, field, value) => {
    setSubMatches((prev) =>
      prev.map((sm, i) => (i === index ? { ...sm, [field]: value } : sm))
    );
  };

  const setWinner = (index, winnerValue) => {
    setSubMatches((prev) =>
      prev.map((sm, i) => (i === index ? { ...sm, winner: winnerValue } : sm))
    );
  };

  // Handles the API call for a single sub-match
  const handleSaveSingleSubMatch = async (subMatchToSave) => {
    setSavingSubMatchId(subMatchToSave._id);
    try {
      const payload = {
        player1Score: subMatchToSave.player1Score,
        player2Score: subMatchToSave.player2Score,
        winnerId: subMatchToSave.winner,
      };

      // Call the specific API endpoint for this one sub-match
      await API.patch(
        `/matches/submit-scores/${match._id}/submatch/${subMatchToSave._id}`,
        payload,
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );

      // On success, notify the parent component to refetch data
      refetch();
      onSaveSuccess();
    } catch (error) {
      console.error("Failed to save sub-match score:", error);
      // You could add an error alert here
    } finally {
      setSavingSubMatchId(null); // Reset the saving state
    }
  };

  return (
    <div className="space-y-4">
      {subMatches.map((subMatch, index) => {
        // --- CHANGE DETECTION LOGIC ---
        // Compare the current state with the original data to see if a change was made

        const isSavingThisMatch = savingSubMatchId === subMatch._id;

        return (
          <div
            key={subMatch._id || index}
            className="bg-gray-800/50 rounded p-4 text-white"
          >
            <div className="grid grid-cols-5 items-center gap-4">
              {/* Column 1: Match Type */}
              <div className="col-span-1">
                <h5 className="font-medium text-gray-200">
                  {subMatch.matchType}
                </h5>
              </div>

              {/* Column 2: Player 1 */}
              <div className="col-span-1 text-center relative">
                <p className="text-sm text-gray-300 mb-2 flex items-center justify-center gap-1">
                  {subMatch.player1.name}
                  {subMatch.winner === subMatch.player1._id && (
                    <Trophy className="w-4 h-4 text-yellow-400" />
                  )}
                </p>
                <input
                  type="number"
                  min="0"
                  value={subMatch.player1Score}
                  onChange={(e) =>
                    updateSubMatchScore(
                      index,
                      "player1Score",
                      Number.parseInt(e.target.value, 10) || 0
                    )
                  }
                  className="w-20 mx-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-center"
                />
                <button
                  onClick={() => setWinner(index, subMatch.player1._id)}
                  disabled={
                    phase.phaseOrder === 1 || subMatch.status === "Completed"
                  }
                  className={`mt-2 w-20 mx-auto px-2 py-1 text-xs rounded transition-colors ${
                    subMatch.winner === subMatch.player1._id
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 hover:bg-gray-500 text-gray-300"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Set Winner
                </button>
              </div>

              {/* Column 3: "vs" Separator */}
              <div className="col-span-1 text-center text-gray-400 font-bold">
                VS
              </div>

              {/* Column 4: Player 2 */}
              <div className="col-span-1 text-center">
                <p className="text-sm text-gray-300 mb-2 flex items-center justify-center gap-1">
                  {subMatch.player2.name}
                  {subMatch.winner === subMatch.player2._id && (
                    <Trophy className="w-4 h-4 text-yellow-400" />
                  )}
                </p>
                <input
                  type="number"
                  min="0"
                  value={subMatch.player2Score}
                  onChange={(e) =>
                    updateSubMatchScore(
                      index,
                      "player2Score",
                      Number.parseInt(e.target.value, 10) || 0
                    )
                  }
                  className="w-20 mx-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-center"
                />
                <button
                  onClick={() => setWinner(index, subMatch.player2._id)}
                  disabled={
                    phase.phaseOrder === 1 || subMatch.status === "Completed"
                  }
                  className={`mt-2 w-20 mx-auto px-2 py-1 text-xs rounded transition-colors ${
                    subMatch.winner === subMatch.player2._id
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 hover:bg-gray-500 text-gray-300"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Set Winner
                </button>
              </div>

              {/* Column 5: Save Button */}
              <div className="col-span-1 text-right">
                <button
                  onClick={() => handleSaveSingleSubMatch(subMatch)}
                  disabled={
                    subMatch.status === "Completed" ||
                    isSavingThisMatch ||
                    savingSubMatchId !== null
                  }
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingThisMatch ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </div>
            <p className="text-sm bg-amber-500 w-fit px-2 rounded-full">
              {subMatch.status}
            </p>
          </div>
        );
      })}

      {/* --- Global "Close" button --- */}
      <div className="flex justify-end pt-4 border-t border-gray-700">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </div>
    </div>
  );
}
