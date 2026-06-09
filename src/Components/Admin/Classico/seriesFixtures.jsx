import { useState, useEffect } from "react";
import { Trophy, ChevronDown, ChevronUp, Play, Clock, CalendarDays, Swords, ShieldAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import UpdateMatchScoreModal from "./updateScoreModal";
import PublishSeriesModal from "../LeagueDetails/PublishSeries";
import { toast } from "react-toastify";
import { getFaceCropUrl } from "../../../Utils/utils";
import AuthLoader from "../../Loaders/AuthLoader";

export default function SeriesFixtures({ phase2Series }) {
  const [expandedSeries, setExpandedSeries] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const {
    data: { data: { data: knockout } = {} } = {},
    isLoading: isKnockoutLoading,
    refetch: refetchKnockout,
  } = useQuery({
    queryKey: ["massacre-seriesStage", phase2Series?.stageData?._id],
    queryFn: () =>
      API.get(`/knockouts/${phase2Series?.stageData._id}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      }),
    enabled: !!phase2Series,
  });

  // Automatically expand Live or Scheduled series on initial load
  useEffect(() => {
    if (knockout?.rounds?.[0]?.series && !isInitialized) {
      const initialExpanded = {};
      knockout.rounds[0].series.forEach((series) => {
        if (series.status === "Live" || series.status === "Scheduled") {
          initialExpanded[series._id] = true;
        }
      });
      setExpandedSeries(initialExpanded);
      setIsInitialized(true);
    }
  }, [knockout, isInitialized]);

  const toggleSeries = (seriesId) => {
    setExpandedSeries((prev) => ({
      ...prev,
      [seriesId]: !prev[seriesId],
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/30";
      case "Upcoming":
      case "Pending":
        return "bg-white/5 text-gray-400 border-white/10";
      case "Live":
      case "Scheduled":
        return "bg-[#e11d48]/10 text-[#e11d48] border-[#e11d48]/40 animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.2)]";
      default:
        return "bg-gray-800/50 text-gray-400 border-gray-700";
    }
  };

  const getWinnerDisplay = (series) => {
    if (series.player1_wins > series.player2_wins) {
      return { winner: series.player1, wins: series.player1_wins, side: 1 };
    } else if (series.player2_wins > series.player1_wins) {
      return { winner: series.player2, wins: series.player2_wins, side: 2 };
    }
    return null;
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
      refetchKnockout();
    }
  };

  const handlePublishRound = (round) => {
    setSelectedRound(round);
    setIsPublishModalOpen(true);
  };

  const handlePublishRoundSubmit = async (data) => {
    const response = await API.post(
      `/series/publish-round/${selectedRound._id}`,
      { ...data },
      { headers: { Authorization: localStorage.getItem("authToken") } },
    );
    if (response.data.success) {
      toast.success("Round published successfully");
      setIsPublishModalOpen(false);
      setSelectedRound(null);
      refetchKnockout();
    }
  };

  if (isKnockoutLoading) return <AuthLoader
   />;

  return (
    <>
      <div className="space-y-2 sm:space-y-6 pb-16 animate-fade-in font-sans">
        
        {/* --- ADMIN STATS GRID --- */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4">
          <div className="bg-[#0a0b10] rounded-[16px] pl-4 p-2 sm:p-5 border border-white/5 shadow-lg relative overflow-hidden group">
            <CalendarDays className="absolute -right-2 -bottom-2 w-12 h-12 text-gray-500 opacity-30 group-hover:opacity-20 transition-opacity" />
            <p className="text-gray-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Total Series</p>
            <p className="text-lg sm:text-3xl font-black text-white">{knockout?.rounds?.[0]?.series?.length || 0}</p>
          </div>

          <div className="bg-[#0a0b10] rounded-[16px] pl-4 p-2 sm:p-5 border border-[#e11d48]/20 shadow-lg relative overflow-hidden group">
            <Trophy className="absolute -right-2 -bottom-2 w-12 h-12 text-[#e11d48] opacity-30 group-hover:opacity-20 transition-opacity" />
            <p className="text-[#e11d48] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Completed</p>
            <p className="text-lg sm:text-3xl font-black text-white">{knockout?.rounds?.[0]?.series?.filter((s) => s.status === "Completed")?.length || 0}</p>
          </div>

          <div className="bg-[#0a0b10] rounded-[16px] pl-4 p-2 sm:p-5 border border-[#ec4899]/20 shadow-lg relative overflow-hidden group">
            <Clock className="absolute -right-2 -bottom-2 w-12 h-12 text-[#ec4899] opacity-30 group-hover:opacity-20 transition-opacity" />
            <p className="text-[#ec4899] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Upcoming</p>
            <p className="text-lg sm:text-3xl font-black text-white">{knockout?.rounds?.[0]?.series?.filter((s) => ["Upcoming", "Pending", "Scheduled"].includes(s.status))?.length || 0}</p>
          </div>
        </div>

        {/* --- STAGE BANNER --- */}
        <div className="flex items-center gap-2 bg-[#050505] border-y-2 border-[#e11d48]/50 rounded-[16px] px-4 py-2 sm:p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
          <div className="p-3 bg-black border border-white/10 rounded-xl relative z-10">
            <Swords className="w-5 h-5 text-[#e11d48]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xs sm:text-xl font-black text-white uppercase tracking-widest">
              {knockout?.name.split(" ").slice(2, 4).join(" ") || "Admin Management"}
            </h2>
            <p className="text-[9px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">
              Format: Best of 3
            </p>
          </div>
        </div>

        {/* --- MAIN SERIES LIST --- */}
        <div className="space-y-2">
          {knockout?.rounds?.[0]?.series?.map((series) => {
            const isExpanded = expandedSeries[series._id];
            const winnerData = getWinnerDisplay(series);
            const isSeriesCompleted = series.status === "Completed";
            
            // Subtle dimming for losers
            const p1Opacity = (isSeriesCompleted && winnerData?.side !== 1) ? "opacity-50 grayscale" : "opacity-100";
            const p2Opacity = (isSeriesCompleted && winnerData?.side !== 2) ? "opacity-50 grayscale" : "opacity-100";

            return (
              <div
                key={series._id}
                className="rounded-[20px] bg-[#0a0a0c] border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 relative group"
              >
                {/* Clickable Header Area */}
                <button 
                  onClick={() => toggleSeries(series._id)}
                  className="w-full text-left relative outline-none"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-0" />

                  <div className=" sm:p-6 pb-0 relative z-10 backdrop-blur-sm">
                    {/* Top Info Bar */}
                    <div className="flex p-2 items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md border transition-colors ${isExpanded ? "bg-[#e11d48]/20 text-[#e11d48] border-[#e11d48]/40" : "bg-black/50 text-gray-400 border-white/10"}`}>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                        <h3 className="text-gray-200 font-black text-xs sm:text-sm uppercase tracking-widest bg-black/40 px-2 py-1 rounded border border-white/5">
                          {series.roundName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md ${getStatusColor(series.status)}`}>
                          {series.status}
                        </span>
                        {/* ONLY show publish button on desktop if status is Pending/Upcoming */}
                        {["Pending", "Upcoming"].includes(series.status) && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishRound(series);
                            }}
                            className="hidden sm:flex items-center px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all text-[9px] font-black uppercase tracking-widest active:scale-95 cursor-pointer"
                          >
                            <Play className="w-3 h-3 mr-1.5 text-green-400" /> Publish
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Team Matchup Flex */}
                    <div className="flex items-center justify-between gap-2">
                      
                      {/* Player 1 */}
                      <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 flex-1 min-w-0 text-center sm:text-left transition-all duration-300 ${p1Opacity}`}>
                        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-[14px] shrink-0 overflow-hidden border border-white/20 bg-black shadow-lg">
                          <img
                            src={getFaceCropUrl(series.player1?.image?.url) || "/placeholder.svg"}
                            alt={series.player1?.name}
                            className="w-full h-full rounded-[12px] object-cover mix-blend-normal transition-all"
                          />
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col justify-center pt-1">
                          <p className="font-black text-[10px] sm:text-sm uppercase tracking-wide line-clamp-2 leading-tight break-words text-white drop-shadow-md">
                            {series.player1?.name.split(" ")[0]}
                          </p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate mt-1">
                            {series.player1?.inGameUserName}
                          </p>
                          {winnerData?.side === 1 && <span className="text-[9px] text-[#e11d48] font-black uppercase tracking-widest mt-1 flex items-center justify-center sm:justify-start gap-1"><Trophy className="w-3 h-3"/> Winner</span>}
                        </div>
                      </div>

                      {/* Score Pill */}
                      <div className="shrink-0 flex items-center justify-center gap-4 bg-black/80 px-5 py-2.5 sm:px-8 sm:py-3 rounded-full border border-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.8)] mx-2">
                        <span className={`text-xl sm:text-3xl font-black w-6 text-center ${winnerData?.side === 1 ? 'text-[#e11d48] drop-shadow-[0_0_10px_rgba(225,29,72,0.4)]' : 'text-white'}`}>{series.player1_wins}</span>
                        <span className="text-gray-700 text-lg font-black">-</span>
                        <span className={`text-xl sm:text-3xl font-black w-6 text-center ${winnerData?.side === 2 ? 'text-[#ec4899] drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]' : 'text-white'}`}>{series.player2_wins}</span>
                      </div>

                      {/* Player 2 */}
                      <div className={`flex flex-col sm:flex-row-reverse items-center sm:items-start gap-2 flex-1 min-w-0 text-center sm:text-right transition-all duration-300 ${p2Opacity}`}>
                        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-[14px] shrink-0 overflow-hidden border border-white/20 bg-black shadow-lg">
                          <img
                            src={getFaceCropUrl(series.player2?.image?.url) || "/placeholder.svg"}
                            alt={series.player2?.name}
                            className="w-full h-full rounded-[12px] object-cover  transition-all"
                          />
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col justify-center pt-1">
                          <p className="font-black text-[10px] sm:text-sm uppercase tracking-wide line-clamp-2 leading-tight break-words text-white drop-shadow-md">
                            {series.player2?.name.split(" ")[0]}
                          </p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate mt-1">
                            {series.player2?.inGameUserName}
                          </p>
                          {winnerData?.side === 2 && <span className="text-[9px] text-[#ec4899] font-black uppercase tracking-widest mt-1 flex items-center justify-center sm:justify-end gap-1"><Trophy className="w-3 h-3"/> Winner</span>}
                        </div>
                      </div>

                    </div>
                    
                    {/* ONLY show publish button on mobile if status is Pending/Upcoming */}
                    {["Pending", "Upcoming"].includes(series.status) && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublishRound(series);
                        }}
                        className={` sm:hidden mt-2 w-full flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 cursor-pointer`}
                      >
                        <Play className="w-3 h-3 mr-2 text-green-400" /> Publish Series
                      </div>
                    )}
                  </div>
                </button>

                {/* --- EXPANDED FIXTURES LIST (ADMIN VIEW) --- */}
                {isExpanded && (
                  <div className="bg-[#050508] border-t border-white/5 p-3 sm:p-5 relative z-10">
                    <div className="space-y-2">
                      {series.matches?.length === 0 ? (
                        <div className="text-center py-6 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center">
                          <ShieldAlert className="w-6 h-6 text-gray-600 mb-2" />
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No matches generated yet</p>
                        </div>
                      ) : (
                        series.matches?.map((match, idx) => {
                          const isTeam1Winner = match.winner?._id === match.team1?._id;
                          const isTeam2Winner = match.winner?._id === match.team2?._id;

                          return (
                            <div
                              key={match._id}
                              className="flex flex-col sm:flex-row items-center justify-between bg-black border border-white/5 rounded-xl p-3 sm:py-3 sm:px-5 hover:border-white/20 transition-colors"
                            >
                              {/* Fixture Index & Status */}
                              <div className="flex sm:flex-col items-center sm:items-start justify-between w-full sm:w-24 mb-3 sm:mb-0 sm:pr-4 sm:border-r border-white/5 shrink-0">
                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Game {idx + 1}</span>
                                <span className={`text-[8px] px-2 py-0.5 rounded border uppercase font-black tracking-widest ${getStatusColor(match.status)}`}>
                                  {match.status}
                                </span>
                              </div>

                              {/* Center Match Display */}
                              <div className="flex-1 w-full flex items-center justify-between sm:px-6 relative min-w-0">
                                
                                {/* Team 1 */}
                                <div className="flex-1 min-w-0 pr-2">
                                  <p className={`text-xs sm:text-sm font-black uppercase tracking-wide truncate ${isTeam1Winner ? 'text-[#e11d48]' : 'text-gray-400'}`}>
                                    {match.team1?.inGameUserName}
                                  </p>
                                </div>

                                {/* Small Score Box */}
                                <div className="shrink-0 flex items-center gap-2 bg-[#0a0b10] px-3 py-1.5 rounded-md border border-white/10 shadow-inner">
                                  <span className={`text-sm sm:text-base font-black ${isTeam1Winner ? 'text-[#e11d48]' : 'text-white'}`}>{match.team1_score ?? '-'}</span>
                                  <span className="text-gray-700 text-xs">:</span>
                                  <span className={`text-sm sm:text-base font-black ${isTeam2Winner ? 'text-[#ec4899]' : 'text-white'}`}>{match.team2_score ?? '-'}</span>
                                </div>

                                {/* Team 2 */}
                                <div className="flex-1 min-w-0 pl-2 text-right">
                                  <p className={`text-xs sm:text-sm font-black uppercase tracking-wide truncate ${isTeam2Winner ? 'text-[#ec4899]' : 'text-gray-400'}`}>
                                    {match.team2?.inGameUserName}
                                  </p>
                                </div>
                              </div>

                              {/* Action Area (Admin Edit) */}
                              <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:pl-4 sm:border-l border-white/5 flex justify-center shrink-0">
                                <button
                                  className="w-full sm:w-auto px-5 py-2 bg-[#e11d48]/10 hover:bg-[#e11d48]/20 border border-[#e11d48]/30 text-[#e11d48] rounded-lg transition-colors text-[9px] font-black uppercase tracking-widest"
                                  onClick={() => {
                                    setSelectedMatch(match);
                                    setShowScoreModal(true);
                                  }}
                                >
                                  Edit Score
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODALS --- */}
      {selectedMatch && (
        <UpdateMatchScoreModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          onSubmit={handleSaveScore}
          match={selectedMatch}
        />
      )}
      
      {selectedRound && (
        <PublishSeriesModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          roundName={selectedRound.roundName}
          seriesCount={1}
          onSubmit={handlePublishRoundSubmit}
        />
      )}
    </>
  );
}