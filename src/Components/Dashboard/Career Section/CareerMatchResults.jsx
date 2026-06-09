import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import moment from "moment/moment";
import { History, Filter, Swords, Trophy, Target, Star, CalendarDays, Loader2, Activity } from "lucide-react";

const CareerMatchResults = ({ getResultColor, getRatingColor, playerTournaments }) => {
  const [selectedLeague, setSelectedLeague] = useState("all");
  const [selectedResult, setSelectedResult] = useState("all");
  const { user } = useAuthStore();

  const { data: { data: { data: matchResults } = {} } = {}, isLoading } = useQuery({
    queryKey: ["playerMatchHistory"],
    queryFn: () => {
      return API.get(`/users/getMatchHistory/${user?._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  const getFilteredMatches = () => {
    return matchResults?.filter((match) => {
      const leagueMatch = selectedLeague === "all" || match?.tournament?._id === selectedLeague;
      const resultMatch = selectedResult === "all" || match?.result?.toLowerCase() === selectedResult?.toLowerCase();
      return leagueMatch && resultMatch;
    });
  };

  // Upgraded Glossy Result Colors
  const getProResultStyles = (result) => {
    switch (result?.toLowerCase()) {
      case "win":
        return "text-green-400 bg-green-500/10 border-green-500/30 shadow-[inset_0_0_10px_rgba(74,222,128,0.15)] glow-green";
      case "draw":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30 shadow-[inset_0_0_10px_rgba(250,204,21,0.15)] glow-yellow";
      case "loss":
        return "text-red-500 bg-red-500/10 border-red-500/30 shadow-[inset_0_0_10px_rgba(239,68,68,0.15)] glow-red";
      default:
        return "text-gray-400 bg-white/5 border-white/10";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--color-neon-blue)] animate-spin drop-shadow-[0_0_10px_var(--color-neon-blue)]" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] animate-pulse">
          Decrypting Match Logs...
        </span>
      </div>
    );
  }

  const filteredMatches = getFilteredMatches();
  const recentForm = filteredMatches?.slice(0, 10) || [];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">
      
      {/* --- TOP HUD: FILTERS & RECENT FORM --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* FILTERS (Spans 7 Cols) */}
        <div className="liquid-glass-card black relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden lg:col-span-7 p-6 md:p-8">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                <Filter size={16} className="text-[var(--color-neon-blue)] drop-shadow-[0_0_8px_var(--color-neon-blue)]" />
              </div>
              <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
                Tactical Filters
              </h3>
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-lg border border-white/5">
              Found: {filteredMatches?.length || 0}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* League Dropdown */}
            <div className="flex-1 relative">
              <label className="block text-[9px] font-bold text-[var(--color-neon-blue)] uppercase tracking-[0.2em] mb-2 pl-1">
                Competition
              </label>
              <div className="relative">
                <Trophy size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#05050a] border border-white/10 rounded-xl text-sm font-bold text-white appearance-none outline-none focus:border-[var(--color-neon-blue)]/50 focus:ring-1 focus:ring-[var(--color-neon-blue)]/50 transition-all shadow-inner"
                >
                  <option value="all">All Tournaments</option>
                  {playerTournaments?.map((tournament) => (
                    <option key={tournament._id} value={tournament._id}>
                      {tournament.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Dropdown */}
            <div className="flex-1 relative">
              <label className="block text-[9px] font-bold text-[var(--color-neon-pink)] uppercase tracking-[0.2em] mb-2 pl-1">
                Match Result
              </label>
              <div className="relative">
                <Target size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={selectedResult}
                  onChange={(e) => setSelectedResult(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#05050a] border border-white/10 rounded-xl text-sm font-bold text-white appearance-none outline-none focus:border-[var(--color-neon-pink)]/50 focus:ring-1 focus:ring-[var(--color-neon-pink)]/50 transition-all shadow-inner"
                >
                  <option value="all">All Results</option>
                  <option value="win">Victories</option>
                  <option value="draw">Draws</option>
                  <option value="loss">Defeats</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT FORM (Spans 5 Cols) */}
        <div className="liquid-glass-card black relative rounded-3xl border border-white/10 bg-gradient-to-bl from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden lg:col-span-5 p-6 md:p-8">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              <Activity size={16} className="text-[var(--color-neon-pink)] drop-shadow-[0_0_8px_var(--color-neon-pink)]" />
            </div>
            <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
              Recent Form (L10)
            </h3>
          </div>

          <div className="flex flex-col justify-center h-full pb-4">
            {/* Form Blocks */}
            <div className="flex flex-wrap gap-2 mb-5">
              {recentForm.length > 0 ? (
                recentForm.map((match, index) => {
                  const r = match.result.toLowerCase();
                  let blockColor = "bg-gray-800 text-gray-500 border-gray-700";
                  if (r === "win") blockColor = "bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(74,222,128,0.2)]";
                  if (r === "draw") blockColor = "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(250,204,21,0.2)]";
                  if (r === "loss") blockColor = "bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]";

                  return (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border transition-transform hover:-translate-y-1 cursor-default ${blockColor}`}
                      title={`${match.scoreFor} - ${match.scoreAgainst} vs ${match?.opponent?.name || "Unknown"}`}
                    >
                      {match.result.charAt(0).toUpperCase()}
                    </div>
                  );
                })
              ) : (
                <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">No recent matches</span>
              )}
            </div>

            {/* Summary Text */}
            <div className="flex items-center gap-4 bg-[#05050a]/50 p-3 rounded-xl border border-white/5 w-fit">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Record:</span>
              <span className="text-sm font-black tracking-widest text-white">
                <span className="text-green-400">{recentForm.filter((m) => m.result === "Win").length}W</span> -{" "}
                <span className="text-yellow-400">{recentForm.filter((m) => m.result === "Draw").length}D</span> -{" "}
                <span className="text-red-500">{recentForm.filter((m) => m.result === "Loss").length}L</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MATCH LOGS (The List) --- */}
      <div className="liquid-glass-card black relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-black/60 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
        
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              <History size={16} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            </div>
            <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
              Combat Logs
            </h3>
          </div>

          <div className="space-y-3">
            {filteredMatches?.map((match) => (
              <div
                key={match._id}
                className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-white/10 transition-all duration-300 group/match"
              >
                {/* Result Indicator Bar (Left Side) */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 rounded-r-md transition-all duration-300 group-hover/match:h-3/4 ${
                  match.result.toLowerCase() === "win" ? "bg-green-500 shadow-[0_0_10px_#4ade80]" : 
                  match.result.toLowerCase() === "draw" ? "bg-yellow-500 shadow-[0_0_10px_#facc15]" : 
                  "bg-red-500 shadow-[0_0_10px_#ef4444]"
                }`} />

                {/* Meta Info (Date & Tournament) */}
                <div className="flex flex-col pl-4 md:w-1/4">
                   <div className="flex items-center gap-2 mb-1.5">
                     <CalendarDays size={12} className="text-gray-500" />
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       {moment(match.createdAt).format("MMM DD, YYYY")}
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Trophy size={12} className="text-[var(--color-neon-blue)]" />
                     <span className="text-xs font-black text-white tracking-wide truncate">
                       {match?.tournament?.name || "Unknown League"}
                     </span>
                   </div>
                </div>

                {/* Score & Opponent (Center Focal Point) */}
                <div className="flex items-center justify-center gap-4 md:w-2/4 bg-[#05050a] py-3 px-6 rounded-xl border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                   <div className="flex flex-col items-end flex-1">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">YOU</span>
                      <span className="text-sm font-black text-white truncate max-w-[100px] sm:max-w-[150px]">{user?.inGameUserName || "Player"}</span>
                   </div>
                   
                   {/* The Score Pill */}
                   <div className={`px-4 py-1.5 rounded-lg border flex items-center justify-center gap-3 min-w-[80px] ${getProResultStyles(match.result)}`}>
                      <span className="text-xl font-black tracking-tighter drop-shadow-sm">{match.scoreFor}</span>
                      <span className="text-xs opacity-50 font-black">-</span>
                      <span className="text-xl font-black tracking-tighter drop-shadow-sm">{match.scoreAgainst}</span>
                   </div>

                   <div className="flex flex-col items-start flex-1">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">OPP</span>
                      <span className="text-sm font-black text-gray-300 truncate max-w-[100px] sm:max-w-[150px]">{match?.opponent?.name || "Unknown"}</span>
                   </div>
                </div>

                {/* Player Stats & MOTM (Right Side) */}
                <div className="flex items-center justify-end gap-4 md:w-1/4 pr-2">
                   {match.scoreFor > 0 && (
                     <div className="flex flex-col items-end">
                       <span className="text-[9px] text-[var(--color-neon-pink)] font-bold uppercase tracking-widest mb-0.5">Goals</span>
                       <div className="flex items-center gap-1.5">
                         <Target size={14} className="text-[var(--color-neon-pink)] opacity-80" />
                         <span className="text-lg font-black text-white">{match.scoreFor}</span>
                       </div>
                     </div>
                   )}
                   
                   {match?.motm && (
                     <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-black border border-yellow-500/40 shadow-[inset_0_0_10px_rgba(250,204,21,0.2)] ml-2" title="Man of the Match">
                       <Star size={18} className="text-yellow-400 drop-shadow-[0_0_5px_#facc15]" fill="currentColor" />
                     </div>
                   )}
                </div>

              </div>
            ))}

            {/* Empty State */}
            {filteredMatches?.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                  <Swords size={40} className="text-gray-600 mb-4" />
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Matches Found</p>
                  <p className="text-xs text-gray-600 mt-1 tracking-wide">Adjust your filters or play more matches.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CareerMatchResults;