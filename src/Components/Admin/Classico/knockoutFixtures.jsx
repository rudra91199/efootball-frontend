"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Trophy, Zap, Play } from "lucide-react";
import { API } from "../../../axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import UpdateMatchScoreModal from "./updateScoreModal";
import useScrollReveal from "../../../Hooks/userScrollReveal";
import PublishSingleMatchModal from "../PublishSingleMatchModal";
import AuthLoader from "../../Loaders/AuthLoader";

export default function KnockoutFixtures({
  phase3Playoff,
  metaData,
  refetchTournament,
}) {
  const [generatingFixtures, setGeneratingFixtures] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const { tournamentId } = useParams();

  const {
    data: { data: { data: phase3 } = {} } = {},
    isLoading: isPhase3Loading,
    refetch: refetchPhase3,
  } = useQuery({
    queryKey: ["classico-knockouts", phase3Playoff?.stageData?._id],
    queryFn: () => {
      return API.get(`/knockouts/${phase3Playoff?.stageData._id}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
    enabled: !!phase3Playoff,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-[#eab308] text-black font-bold";
      case "Live":
        return "bg-[#a50044] text-white font-medium animate-pulse";
      case "Scheduled":
      case "Upcoming":
        return "bg-[#004d98] text-white font-medium";
      default:
        return "bg-gray-700 text-white font-medium";
    }
  };

  const allMatches =
    phase3?.rounds?.flatMap((round) => round?.matches || []) || [];

  const stats = {
    total: allMatches.length,
    completed: allMatches.filter((m) => m.status === "Completed").length,
  };

  const generateFixtures = async () => {
    setGeneratingFixtures(true);
    try {
      const response = await API.post(
        `/massacre/start-phase3`,
        { tournamentId },
        { headers: { Authorization: localStorage.getItem("authToken") } },
      );
      if (response.data.success) {
        refetchTournament();
        refetchPhase3();
        toast.success("Knockout fixtures generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate knockout fixtures.");
      console.error("Error generating knockout fixtures:", error);
    }
    setGeneratingFixtures(false);
  };

  const handleSaveScore = async (score) => {
    const response = await API.patch(
      `/massacre/update-score`,
      { ...score, _id: selectedMatch._id },
      { headers: { Authorization: localStorage.getItem("authToken") } },
    );
    if (response.data.success) {
      setShowScoreModal(false);
      setSelectedMatch(null);
      refetchPhase3();
    }
  };

  //publish knockout match modal handlers
  const handlePublishRound = (match) => {
    setSelectedRound(match);
    setIsPublishModalOpen(true);
  };

  const handlePublishRoundSubmit = async (data) => {
    const response = await API.patch(
      `/matches/update-round-status/${data.matchId}`,
      {
        roundStartDate: data.startTime,
        roundEndDate: data.endTime,
        status: data.status,
      },
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      },
    );
    if (response.data.success) {
      toast.success("Match published successfully");
      setIsPublishModalOpen(false);
      setSelectedRound(null);
      refetchPhase3();
    }
  };

  if (isPhase3Loading) return <AuthLoader />;

  return (
    <>
      <div className="space-y-4 sm:space-y-6 pb-10">
        {/* HEADER BANNER */}
        <div className="liquid-glass-card rounded-xl bg-[#0a0a0c] p-4 sm:p-6 overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#004d98]/10 via-[#a50044]/10 to-[#eab308]/10 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 z-10">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[#a50044] to-[#eab308] rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  {phase3?.name || "Knockout Stage"}
                </h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {phase3?.size ? `${phase3.size} Player Bracket` : "Playoffs"}
                </p>
              </div>
            </div>

            {/* Stats OR Generate Button */}
            {phase3Playoff ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                    Total
                  </p>
                  <p className="text-lg sm:text-xl font-black text-white">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-black/50 border border-[#eab308]/30 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-[#eab308] uppercase font-bold tracking-wider mb-1">
                    Done
                  </p>
                  <p className="text-lg sm:text-xl font-black text-white">
                    {stats.completed}
                  </p>
                </div>
                <div className="bg-black/50 border border-[#004d98]/30 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-[#004d98] uppercase font-bold tracking-wider mb-1">
                    Left
                  </p>
                  <p className="text-lg sm:text-xl font-black text-white">
                    {stats.total - stats.completed}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {metaData?.faction1.phase3List?.length > 0 &&
                  metaData?.faction2.phase3List?.length > 0 &&
                  !phase3Playoff && (
                    <button
                      disabled={generatingFixtures}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#004d98] via-[#a50044] to-[#eab308] text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale shadow-[0_0_15px_rgba(165,0,68,0.4)]"
                      onClick={() => generateFixtures()}
                    >
                      {generatingFixtures ? (
                        <>
                          <LoaderCircle className="inline-block w-4 h-4 mr-2 animate-spin" />{" "}
                          Generating...
                        </>
                      ) : (
                        "Generate Fixtures"
                      )}
                    </button>
                  )}
              </>
            )}
          </div>
        </div>

        {/* MATCHES LIST */}
        <div className="space-y-4">
          {allMatches.map((match, matchIndex) => {
            const isTeam1Winner = match.winner?._id === match.team1?._id;
            const isTeam2Winner = match.winner?._id === match.team2?._id;

            return (
              <div
                key={matchIndex}
                className="liquid-glass-card low rounded-xl bg-[#0a0a0c] flex flex-col sm:flex-row items-center justify-between p-3 sm:p-0 overflow-hidden group"
              >
                {/* Match Info Label (Left Edge / Mobile Top) */}
                <div className="w-full sm:w-auto sm:px-5 sm:py-4 flex justify-between sm:flex-col items-center sm:items-start sm:border-r border-white/10 mb-3 sm:mb-0 shrink-0">
                  <span className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center sm:text-left">
                    {match.round}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded uppercase tracking-wider mt-1 ${getStatusColor(match.status)}`}
                  >
                    {match.status}
                  </span>
                </div>

                {/* Teams & Score Core */}
                <div className="flex-1 w-full flex items-center justify-between gap-2 sm:gap-4 sm:px-6 relative">
                  {/* Team 1 (Left) */}
                  <div className="flex flex-col sm:flex-row items-center justify-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <img
                      src={match.team1?.image?.url || "/placeholder.svg"}
                      alt={match.team1?.inGameUserName}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 border-2 ${isTeam1Winner ? "border-[#a50044] shadow-[0_0_10px_rgba(165,0,68,0.4)]" : "border-[#222]"}`}
                    />
                    <div className="min-w-0 w-full text-center sm:text-left">
                      <p
                        className={`text-sm sm:text-base font-bold truncate ${isTeam1Winner ? "text-white" : "text-gray-300"}`}
                      >
                        {match.team1?.inGameUserName || "TBD"}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium truncate">
                        {match.team1?.name || "Waiting..."}
                      </p>
                    </div>
                  </div>

                  {/* Center Score Badge */}
                  <div className="shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-[#a50044] to-[#eab308] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg mx-2 z-10">
                    <span className="text-lg sm:text-xl font-bold text-white w-5 sm:w-6 text-center drop-shadow-sm">
                      {match.team1_score || 0}
                    </span>
                    <span className="text-white/60 text-sm font-semibold">
                      -
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-black w-5 sm:w-6 text-center drop-shadow-sm">
                      {match.team2_score || 0}
                    </span>
                  </div>

                  {/* Team 2 (Right) */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="min-w-0 w-full text-center sm:text-right">
                      <p
                        className={`text-sm sm:text-base font-bold truncate ${isTeam2Winner ? "text-white" : "text-gray-300"}`}
                      >
                        {match.team2?.inGameUserName || "TBD"}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium truncate">
                        {match.team2?.name || "Waiting..."}
                      </p>
                    </div>
                    <img
                      src={match.team2?.image?.url || "/placeholder.svg"}
                      alt={match.team2?.inGameUserName}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 border-2 ${isTeam2Winner ? "border-[#eab308] shadow-[0_0_10px_rgba(234,179,8,0.4)]" : "border-[#222]"}`}
                    />
                  </div>
                </div>

                {/* Action Button (Right Edge / Mobile Bottom) */}
                <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:px-5 sm:py-4 sm:border-l border-white/10 flex justify-center shrink-0 gap-2">
                  <button
                    className="w-full sm:w-auto px-4 py-2 bg-white/5 border border-white/10 text-gray-200 rounded-md hover:bg-white/10 hover:text-white transition-all text-[11px] font-semibold uppercase tracking-wider active:scale-95"
                    onClick={() => {
                      setSelectedMatch(match);
                      setShowScoreModal(true);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="w-full sm:w-auto px-4 py-2 bg-white/5 border border-white/10 text-gray-200 rounded-md hover:bg-white/10 hover:text-white transition-all text-[11px] font-semibold uppercase tracking-wider active:scale-95"
                    onClick={() => handlePublishRound(match)}
                  >
                    Publish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL IS OUTSIDE THE FADE-IN DIV FOR SAFE Z-INDEX STACKING */}
      {selectedMatch && (
        <UpdateMatchScoreModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          onSubmit={handleSaveScore}
          match={selectedMatch}
        />
      )}
      {selectedRound && (
        <PublishSingleMatchModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          match={selectedRound}
          onSubmit={handlePublishRoundSubmit}
        />
      )}
    </>
  );
}
