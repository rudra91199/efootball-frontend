import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, LoaderCircle, CalendarDays, Trophy, Clock, Pencil } from "lucide-react";
import { API } from "../../../axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import UpdateMatchScoreModal from "./updateScoreModal";
import LeaguePublishRoundModal from "../LeagueDetails/LeagueRoundPublishModal";
import AuthLoader from "../../Loaders/AuthLoader";
import { getFaceCropUrl } from "../../../Utils/utils";

export default function LeagueFixtures({
  phase1League,
  refetchTournament,
  teams,
}) {
  const { tournamentId } = useParams();
  const [selectedRound, setSelectedRound] = useState("all");
  const [collapsedRounds, setCollapsedRounds] = useState(new Set());
  const [generatingFixtures, setGeneratingFixtures] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [finalisingPhase, setFinalisingPhase] = useState(false);

  const [publishModal, setPublishModal] = useState({
    isOpen: false,
    round: null,
  });

  const [selectedFixtures, setSelectedFixtures] = useState([]);

  const {
    data: { data: { data: leagueData } = {} } = {},
    isLoading: isLeagueLoading,
    refetch: refetchLeague,
  } = useQuery({
    queryKey: ["massacre-league", phase1League?.stageData._id],
    queryFn: () => {
      return API.get(`/leagues/${phase1League?.stageData._id}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
    enabled: !!phase1League,
  });

  // Group matches by round
  const rounds = leagueData
    ? leagueData?.matches?.reduce((acc, match) => {
        const round = match.round || "Round 1";
        if (!acc[round]) {
          acc[round] = [];
        }
        acc[round].push(match);
        return acc;
      }, {})
    : {};

  useEffect(() => {
    if (leagueData) {
      const completedRounds = new Set();
      Object.entries(rounds).forEach(([round, matches]) => {
        if (isRoundCompleted(matches)) {
          completedRounds.add(round);
        }
      });
      setCollapsedRounds(completedRounds);
    }
  }, [leagueData]);

  const toggleRoundCollapse = (round) => {
    const newCollapsed = new Set(collapsedRounds);
    if (newCollapsed.has(round)) {
      newCollapsed.delete(round);
    } else {
      newCollapsed.add(round);
    }
    setCollapsedRounds(newCollapsed);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-[#e11d48]/10 text-[#e11d48] border-[#e11d48]/30";
      case "Scheduled":
        return "bg-white/5 text-gray-400 border-white/10";
      case "Live":
        return "bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/30 animate-pulse";
      default:
        return "bg-gray-800/50 text-gray-400 border-gray-700";
    }
  };

  const handlePublishFixtures = (round) => {
    setSelectedFixtures(rounds[round] || []);
    setPublishModal({
      isOpen: true,
      round,
    });
  };

  const generateFixtures = async () => {
    setGeneratingFixtures(true);
    try {
      const response = await API.post("/massacre/start-phase1", {
        tournamentId,
      }, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
      if (response.data.success) {
        refetchTournament();
        refetchLeague();
        toast.success("Fixtures generated successfully");
      }
    } catch (err) {
      setGeneratingFixtures(false);
      console.error("Error generating fixtures:", err);
      toast.error("Failed to generate fixtures");
    }
    setGeneratingFixtures(false);
  };

  const handleSaveScore = async (score) => {
    const response = await API.patch(
      `/massacre/update-score`,
      { ...score, _id: selectedMatch._id },
      {
        headers: { Authorization: localStorage.getItem("authToken") },
      },
    );
    if (response.data.success) {
      setShowScoreModal(false);
      setSelectedMatch(null);
      refetchLeague();
    }
  };

  const finalisePhase = async () => {
    setFinalisingPhase(true);
    try {
      const response = await API.post(
        `/massacre/end-phase1`,
        { tournamentId },
        {
          headers: { Authorization: localStorage.getItem("authToken") },
        },
      );
      if (response.data.success) {
        setFinalisingPhase(false);
        toast.success("Phase finalised successfully");
        refetchTournament();
      }
    } catch (error) {
      setFinalisingPhase(false);
      toast.error("Failed to finalise phase");
    }
    setFinalisingPhase(false);
  };

  if (isLeagueLoading) return <AuthLoader />;

  const isRoundCompleted = (matches) => {
    return matches?.every((match) => match.status === "Completed");
  };

  const phaseFinalised = teams?.every(
    (team) => team.playerRankings?.length > 0,
  );

  return (
    <div className="relative animate-fade-in font-sans pb-20">
      
      {/* VIBRANT TRI-COLOR STATS GRID */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {/* Total Fixtures */}
        <div className="relative bg-[#0a0b10]/80 backdrop-blur-xl rounded-[20px] p-4 sm:p-5 border border-white/10 shadow-inner group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50" />
          <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">
            <CalendarDays className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Total Fixtures</p>
          <p className="text-2xl sm:text-3xl font-black text-white leading-none">
            {leagueData?.matches?.length || 0}
          </p>
        </div>

        {/* Completed (Massacre Crimson) */}
        <div className="relative bg-[#0a0b10]/80 backdrop-blur-xl rounded-[20px] p-4 sm:p-5 border border-[#e11d48]/20 shadow-[0_0_15px_rgba(225,29,72,0.1)] group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e11d48] to-transparent opacity-80" />
          <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">
            <Trophy className="w-5 h-5 text-[#e11d48]" />
          </div>
          <p className="text-[#e11d48] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Completed</p>
          <p className="text-2xl sm:text-3xl font-black text-white leading-none drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]">
            {leagueData?.matches?.filter((m) => m.status === "Completed")?.length || 0}
          </p>
        </div>

        {/* Pending (Neon Pink) */}
        <div className="relative bg-[#0a0b10]/80 backdrop-blur-xl rounded-[20px] p-4 sm:p-5 border border-[#ec4899]/20 shadow-[0_0_15px_rgba(236,72,153,0.1)] group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ec4899] to-transparent opacity-80" />
          <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">
            <Clock className="w-5 h-5 text-[#ec4899]" />
          </div>
          <p className="text-[#ec4899] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Pending</p>
          <p className="text-2xl sm:text-3xl font-black text-white leading-none drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            {leagueData?.matches?.filter((m) => m.status !== "Completed")?.length || 0}
          </p>
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#030305]/80 backdrop-blur-xl p-4 rounded-[20px] border border-white/5 shadow-inner mb-6 z-20 relative">
        <select
          value={selectedRound}
          onChange={(e) => setSelectedRound(e.target.value)}
          className="w-full sm:w-[300px] px-4 py-3 bg-[#0a0b10] border border-white/10 rounded-xl text-white text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#e11d48] transition-all cursor-pointer appearance-none shadow-inner"
        >
          <option value="all">Show All Matchdays</option>
          {Object.keys(rounds).map((round) => (
            <option key={round} value={round}>
              {round}
            </option>
          ))}
        </select>
        
        <div className="flex gap-3 w-full sm:w-auto">
          {!leagueData && (
            <button
              disabled={generatingFixtures}
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-[#e11d48] to-[#ec4899] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-95 disabled:opacity-50 border border-white/20"
              onClick={() => generateFixtures()}
            >
              {generatingFixtures ? (
                <><LoaderCircle className="w-4 h-4 mr-2 inline-block animate-spin" /> Generating...</>
              ) : (
                "Generate Fixtures"
              )}
            </button>
          )}
          {!phaseFinalised && leagueData?.matches?.length > 0 && leagueData?.matches?.every((m) => m.status === "Completed") && (
            <button
              disabled={finalisingPhase}
              className="flex-1 sm:flex-none px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 border border-white/20"
              onClick={() => finalisePhase()}
            >
              {finalisingPhase ? (
                <><LoaderCircle className="w-4 h-4 mr-2 inline-block animate-spin" /> Finalising...</>
              ) : (
                "Finalise Phase"
              )}
            </button>
          )}
        </div>
      </div>

      {/* ROUNDS CONTAINER */}
      <div className="space-y-6">
        {Object.entries(rounds)
          .filter(([round]) => selectedRound === "all" || selectedRound === round)
          .map(([round, matches]) => {
            const roundCompleted = isRoundCompleted(matches);
            const isCollapsed = collapsedRounds.has(round);
            const isRoundUnpublished = matches?.some((m) => m.status === "Unpublished");

            return (
              <div
                key={round}
                className="rounded-[20px] bg-[#030305]/80 backdrop-blur-md border border-white/5 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleRoundCollapse(round)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-[#0a0b10] hover:bg-white/[0.02] transition-colors text-left border-b border-white/5 cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`p-1.5 rounded-lg border ${isCollapsed ? "bg-[#e11d48]/10 text-[#e11d48] border-[#e11d48]/30" : "bg-white/5 text-gray-400 border-white/10"}`}>
                      {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                    <h3 className="text-white font-black text-sm sm:text-base uppercase tracking-widest">
                      {round}
                    </h3>
                    {roundCompleted && (
                      <span className="hidden sm:inline-block ml-2 text-[#e11d48] text-[9px] font-black uppercase tracking-widest bg-[#e11d48]/10 border border-[#e11d48]/20 px-2.5 py-1 rounded-md shadow-sm">
                        Complete
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-[#030305] px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
                      <span className={roundCompleted ? "text-[#e11d48]" : "text-white"}>{matches?.filter((m) => m.status === "Completed").length}</span> / {matches?.length}
                    </span>
                    {isRoundUnpublished && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublishFixtures(round);
                        }}
                        className="hidden sm:block px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all text-[9px] font-black uppercase tracking-widest active:scale-95"
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </div>

                {/* Match List (COMPACT ROWS) */}
                {!isCollapsed && (
                  <div className="p-2 sm:p-4 bg-[#0a0b10]/40 space-y-2">
                    
                    {/* Mobile Publish Button */}
                    {isRoundUnpublished && (
                      <div className="sm:hidden mb-2">
                        <button
                          onClick={() => handlePublishFixtures(round)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest active:scale-95"
                        >
                          Publish Matchday
                        </button>
                      </div>
                    )}

                    {/* SINGLE ROW MATCH CARDS */}
                    {matches?.map((match) => {
                      const isTeam1Winner = match.winner?._id === match.team1?._id;
                      const isTeam2Winner = match.winner?._id === match.team2?._id;

                      return (
                        <div
                          key={match._id}
                          className="relative flex flex-row items-stretch justify-between bg-[#030305] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all shadow-inner group py-2 px-2 sm:px-3"
                        >
                          {/* Background Glows based on Winner (Reduced intensity for compact row) */}
                          <div className={`absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#e11d48]/10 to-transparent pointer-events-none opacity-0 transition-opacity duration-300 ${isTeam1Winner ? "opacity-100" : ""}`} />
                          <div className={`absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#ec4899]/10 to-transparent pointer-events-none opacity-0 transition-opacity duration-300 ${isTeam2Winner ? "opacity-100" : ""}`} />

                          {/* 1. Match Info Label */}
                          <div className="flex flex-col justify-center items-start w-12 sm:w-20 shrink-0 relative z-10 border-r border-white/5 pr-1 sm:pr-2">
                            <span className="text-gray-500 text-[8px] sm:text-[9px] font-black uppercase tracking-widest">M-{match.matchNumber || "X"}</span>
                            <span className={`text-[7px] sm:text-[8px] px-1 py-0.5 rounded border uppercase font-black tracking-widest mt-1 w-fit ${getStatusColor(match.status)}`}>
                              {match.status}
                            </span>
                          </div>

                          {/* 2. Teams & Score Core */}
                          <div className="flex-1 w-full flex items-center justify-between px-1 sm:px-4 relative z-10 min-w-0">
                            
                            {/* Team 1 (Left) */}
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end min-w-0">
                              <p className={`text-[9px] sm:text-xs font-black uppercase tracking-wide truncate max-w-[60px] sm:max-w-[120px] text-right ${isTeam1Winner ? "text-white" : "text-gray-400"}`}>
                                {match.team1?.name || "Squad 1"}
                              </p>
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded bg-[#0a0b10] border shadow-inner flex items-center justify-center shrink-0 ${isTeam1Winner ? "border-[#e11d48]" : "border-white/10"}`}>
                                <img
                                  src={getFaceCropUrl(match.team1?.image?.url) || match.team1?.logo || "/placeholder.svg"}
                                  alt="T1"
                                  className="w-full h-full object-contain rounded-sm"
                                />
                              </div>
                            </div>

                            {/* Center Score Badge */}
                            <div className="mx-1.5 sm:mx-3 flex items-center justify-center gap-1 sm:gap-2 bg-[#0a0b10] px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/10 shrink-0 shadow-inner">
                              <span className={`text-xs sm:text-sm font-black w-3 sm:w-4 text-center leading-none ${isTeam1Winner ? "text-[#e11d48]" : "text-white"}`}>
                                {match.team1_score || 0}
                              </span>
                              <span className="text-gray-600 text-[10px] sm:text-xs font-black leading-none">-</span>
                              <span className={`text-xs sm:text-sm font-black w-3 sm:w-4 text-center leading-none ${isTeam2Winner ? "text-[#ec4899]" : "text-white"}`}>
                                {match.team2_score || 0}
                              </span>
                            </div>

                            {/* Team 2 (Right) */}
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-start min-w-0">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded bg-[#0a0b10] border shadow-inner flex items-center justify-center shrink-0 ${isTeam2Winner ? "border-[#ec4899]" : "border-white/10"}`}>
                                <img
                                  src={getFaceCropUrl(match.team2?.image?.url) || match.team2?.logo || "/placeholder.svg"}
                                  alt="T2"
                                  className="w-full h-full object-contain rounded-sm"
                                />
                              </div>
                              <p className={`text-[9px] sm:text-xs font-black uppercase tracking-wide truncate max-w-[60px] sm:max-w-[120px] text-left ${isTeam2Winner ? "text-white" : "text-gray-400"}`}>
                                {match.team2?.name || "Squad 2"}
                              </p>
                            </div>

                          </div>

                          {/* 3. Action Button (Pencil Icon) */}
                          <div className="shrink-0 flex items-center justify-center pl-1 sm:pl-3 border-l border-white/5 relative z-10">
                            {match.status !== "Unpublished" ? (
                              <button
                                className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-lg transition-all active:scale-95"
                                onClick={() => {
                                  setSelectedMatch(match);
                                  setShowScoreModal(true);
                                }}
                                title="Edit Match Score"
                              >
                                <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            ) : (
                              // Placeholder to keep spacing intact if unpublished
                              <div className="w-[30px] sm:w-[34px]" />
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* MODALS */}
      {selectedMatch && (
        <UpdateMatchScoreModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          onSubmit={handleSaveScore}
          match={selectedMatch}
        />
      )}
      
      {publishModal.isOpen && (
        <LeaguePublishRoundModal
          selectedFixtures={selectedFixtures}
          refetch={refetchLeague}
          setSelectedFixtures={setSelectedFixtures}
          setPublishModal={setPublishModal}
          leageueId={leagueData?._id}
          publishModal={publishModal}
        />
      )}
    </div>
  );
}