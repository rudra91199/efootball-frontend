"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API } from "../../axios";
import { useAuthStore } from "../../store/authStore";
import moment from "moment";
import { useNavigate } from "react-router";
import { Trophy, Calendar, Swords, Target, Flame, Users, Banknote, ShieldAlert, Crosshair, Medal } from "lucide-react";
import AuthLoader from "../Loaders/AuthLoader";

export default function TournamentSection() {
  const [activeTab, setActiveTab] = useState("registered");
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    data: {
      data: { data: { activeTournaments, completedTournaments } = {} } = {},
    } = {},
    isLoading,
  } = useQuery({
    queryKey: ["dashboardTournaments"],
    queryFn: () => {
      return API.get(`/tournaments/registered/${user._id}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
  });

  const handleNavigate = (type, tournamentId) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("trifecta")) {
      navigate(`/dashboard/my-tournaments/tournament/${tournamentId}`);
    } else if (t.includes("league") || t.includes("champions circuit")) {
      navigate(`/dashboard/my-tournaments/league-knockout/${tournamentId}`);
    } else if (t.includes("massacre")) {
      navigate(`/dashboard/my-tournaments/massacre/${tournamentId}`);
    }
  };

  // ==========================================
  // CYBER-CHROME THEME ENGINE
  // ==========================================
  const getCardTheme = (type) => {
    const t = type?.toLowerCase() || "";
    
    // Massacre Trilogy (Blood Red / Crimson Theme)
    if (t.includes("massacre")) {
      return {
        accent: "text-[#e11d48]",
        bg: "bg-[#e11d48]/5",
        border: "border-[#e11d48]/20 hover:border-[#e11d48]/50",
        shadow: "hover:shadow-[0_0_30px_rgba(225,29,72,0.2)]",
        glow: "bg-[radial-gradient(circle,rgba(225,29,72,0.15)_0%,transparent_70%)]",
        bar: "from-[#e11d48] to-[#be123c]",
        icon: <Swords className="w-5 h-5 text-[#e11d48]" />,
      };
    } 
    // League / Champions (Neon Purple / Pink Theme)
    else if (t.includes("league") || t.includes("champions")) {
      return {
        accent: "text-[#a855f7]",
        bg: "bg-[#a855f7]/5",
        border: "border-[#a855f7]/20 hover:border-[#a855f7]/50",
        shadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
        glow: "bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)]",
        bar: "from-[#a855f7] to-[#7e22ce]",
        icon: <Trophy className="w-5 h-5 text-[#a855f7]" />,
      };
    } 
    // Trifecta / Default (Cyber Blue / Cyan Theme)
    else {
      return {
        accent: "text-[#3b82f6]",
        bg: "bg-[#3b82f6]/5",
        border: "border-[#3b82f6]/20 hover:border-[#3b82f6]/50",
        shadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
        glow: "bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)]",
        bar: "from-[#3b82f6] to-[#1d4ed8]",
        icon: <Target className="w-5 h-5 text-[#3b82f6]" />,
      };
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "live") return <span className="bg-[#69fd00]/10 text-[#69fd00] border border-[#69fd00]/30 px-2.5 py-1 rounded-md text-[9px] uppercase font-black tracking-widest shadow-[0_0_10px_rgba(105,253,0,0.2)] animate-pulse">Live Now</span>;
    if (s === "upcoming" || s === "open") return <span className="bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 px-2.5 py-1 rounded-md text-[9px] uppercase font-black tracking-widest">Upcoming</span>;
    if (s === "squad pending") return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2.5 py-1 rounded-md text-[9px] uppercase font-black tracking-widest">Pending</span>;
    if (s === "completed") return <span className="bg-gray-500/10 text-gray-400 border border-gray-500/30 px-2.5 py-1 rounded-md text-[9px] uppercase font-black tracking-widest">Archived</span>;
    return <span className="bg-white/5 text-gray-400 border border-white/10 px-2.5 py-1 rounded-md text-[9px] uppercase font-black tracking-widest">{status}</span>;
  };

  return (
    <div className="w-full max-w-7xl mx-auto font-sans space-y-6 sm:space-y-8 animate-slide-in-bottom">
      
      {/* =========================================
          HEADER SECTION
      ========================================= */}
      <div className="bg-[#0a0b10]/60 backdrop-blur-xl border border-white/10 rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-fit">
              <Crosshair className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                Logs
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-tighter leading-none">
              My Tournaments
            </h1>
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest">
              Manage active tournaments & archives
            </p>
          </div>

          {/* Cyber-Chrome Toggle */}
          <div className="flex p-1.5 bg-[#030305]/80 backdrop-blur-xl rounded-xl border border-white/10 w-full lg:w-auto shadow-inner">
            {[
              { id: "registered", label: "Active Tour", count: activeTournaments?.length || 0 },
              { id: "completed", label: "Archives", count: completedTournaments?.length || 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 lg:flex-none px-4 sm:px-8 py-3 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 outline-none ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#3b82f6] via-[#ec4899] to-[#f43f5e] text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded text-[9px] ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-black/50 text-gray-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <AuthLoader />
        </div>
      )}

      {/* =========================================
          ACTIVE TOURNAMENTS (REGISTERED)
      ========================================= */}
      {activeTab === "registered" && !isLoading && (
        <>
          {!activeTournaments || activeTournaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#0a0b10]/40 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-inner">
              <ShieldAlert className="w-16 h-16 text-gray-600 mb-6" strokeWidth={1} />
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">No Active Tournaments</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center max-w-md mb-8 leading-relaxed">
                You are not currently registered in any active tournaments.
              </p>
              <button
                onClick={() => navigate("/tournaments")}
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
              >
                Browse Tournaments
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeTournaments?.map((tournament) => {
                const theme = getCardTheme(tournament.type);
                
                return (
                  <div
                    key={tournament._id}
                    onClick={() => handleNavigate(tournament.type, tournament._id)}
                    className={`group relative bg-[#0a0b10]/90 backdrop-blur-xl rounded-[24px] p-6 border ${theme.border} ${theme.shadow} cursor-pointer transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[220px]`}
                  >
                    {/* Background Subtle Glow based on Type */}
                    <div className={`absolute -top-20 -right-20 w-64 h-64 ${theme.glow} pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100`} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                    <div className="relative z-10 flex items-start justify-between mb-6">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 ${theme.bg} shadow-inner shrink-0`}>
                          {theme.icon}
                        </div>
                        <div>
                          <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${theme.accent}`}>
                            {tournament.type}
                          </p>
                          <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider leading-tight group-hover:text-white/80 transition-colors line-clamp-2">
                            {tournament.name}
                          </h3>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        {getStatusBadge(tournament.status)}
                      </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-[#030305] p-3 rounded-xl border border-white/5">
                        <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1.5 mb-1">
                          <Banknote className="w-3 h-3" /> Prize Pool
                        </span>
                        <span className="text-sm sm:text-base font-black text-white">
                          <span className="text-gray-500 text-xs">BDT</span> {tournament.prizes?.totalPool || 0}
                        </span>
                      </div>
                      <div className="bg-[#030305] p-3 rounded-xl border border-white/5">
                        <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1.5 mb-1">
                          <Users className="w-3 h-3" /> Capacity
                        </span>
                        <span className="text-sm sm:text-base font-black text-white">
                          {tournament.maxTeams} <span className="text-gray-500 text-xs font-bold">Squads</span>
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Starts: <span className="text-white">{moment(tournament.startDate).format("DD MMM YYYY")}</span>
                        </span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300`}>
                        Enter Sector &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* =========================================
          COMPLETED TOURNAMENTS (ARCHIVES)
      ========================================= */}
      {activeTab === "completed" && !isLoading && (
        <>
          {!completedTournaments || completedTournaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#0a0b10]/40 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-inner">
              <Calendar className="w-16 h-16 text-gray-600 mb-6" strokeWidth={1} />
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Archive Empty</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center max-w-md leading-relaxed">
                You have no finalized operational data. Completed tournaments will be recorded here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {completedTournaments.map((tournament) => {
                const theme = getCardTheme(tournament.type);
                const winRate = tournament.matchesPlayed > 0 ? Math.round((tournament.wins / tournament.matchesPlayed) * 100) : 0;
                
                return (
                  <div
                    key={tournament.id}
                    onClick={() => handleNavigate(tournament.type, tournament._id)}
                    className={`group relative bg-[#0a0b10] backdrop-blur-xl rounded-[24px] p-6 border ${theme.border} hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer transition-all duration-300 overflow-hidden flex flex-col justify-between grayscale-[20%] hover:grayscale-0`}
                  >
                    <div className="relative z-10 flex items-start justify-between mb-6">
                      <div className="flex-1 pr-4">
                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-gray-500 group-hover:${theme.accent} transition-colors`}>
                          {tournament.type}
                        </p>
                        <h3 className="text-base font-black text-white uppercase tracking-wider leading-tight line-clamp-2 mb-2">
                          {tournament.name}
                        </h3>
                        {getStatusBadge(tournament.status)}
                      </div>
                      
                      {/* Final Position Badge */}
                      <div className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center border border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-inner`}>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Rank</span>
                        <span className="text-xl font-black text-white leading-none">#{tournament.finalPosition}</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="relative z-10 space-y-3 mb-5">
                      <div className="flex justify-between items-center bg-[#030305] px-3 py-2 rounded-lg border border-white/5">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">W-L Record</span>
                        <span className="text-xs font-black text-white">{tournament.wins}W - {tournament.losses}L</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#030305] px-3 py-2 rounded-lg border border-white/5">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Prize Won</span>
                        <span className={`text-xs font-black ${tournament.prizeWon !== "$0" && tournament.prizeWon !== "0" ? "text-[#69fd00]" : "text-gray-500"}`}>
                          {tournament.prizeWon}
                        </span>
                      </div>
                    </div>

                    {/* Win Rate Progress Bar */}
                    <div className="relative z-10 bg-[#030305] p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Combat Efficacy</span>
                        <span className={`text-[10px] font-black ${theme.accent}`}>{winRate}%</span>
                      </div>
                      <div className="w-full bg-black rounded-full h-1.5 overflow-hidden shadow-inner">
                        <div
                          className={`h-full bg-gradient-to-r ${theme.bar} shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-1000 ease-out`}
                          style={{ width: `${winRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}