"use client";

import { useState } from "react";
import { TeamModal } from "./TeamModal";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { Shield, Plus } from "lucide-react";
import useScrollReveal from "../../../Hooks/userScrollReveal";

export default function TeamsComparison({
  teams,
  tournament,
  refetchTournament,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  useScrollReveal("animate-fade-in");

  const { data: { data: { data: players } = {} } = {} } = useQuery({
    queryKey: ["allplayers"],
    queryFn: () => {
      return API.get("/users/getUsersForRegistration", {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  const totalWins = (team) =>
    team.playerRankings?.reduce((sum, p) => sum + (p.wins || 0), 0) || 0;

  // Dynamic Theme Generator for Squad 1 (Crimson) vs Squad 2 (Pink)
  const getCardTheme = (index) => {
    if (index === 0) {
      return {
        glow: "bg-[#e11d48]",
        textHover: "group-hover:text-[#e11d48]",
        accentText: "text-[#e11d48]",
        borderHover: "hover:border-[#e11d48]/40",
      };
    }
    return {
      glow: "bg-[#ec4899]",
      textHover: "group-hover:text-[#ec4899]",
      accentText: "text-[#ec4899]",
      borderHover: "hover:border-[#ec4899]/40",
    };
  };

  return (
    <div className="space-y-6 mb-20 font-sans animate-fade-in">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0b10]/60 backdrop-blur-xl p-6 rounded-[24px] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-3 uppercase tracking-widest">
          <Shield className="w-6 h-6 text-gray-500" />
          Registered Squads
        </h2>
        <div>
          <button
            onClick={() => setModalOpen(true)}
            disabled={teams?.length >= 3}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#e11d48] to-[#ec4899] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed border border-white/20"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            Register Squad
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams?.map((team, index) => {
          const theme = getCardTheme(index);

          return (
            <div
              key={team._id}
              className={`relative bg-[#0a0b10]/80 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden ${theme.borderHover} transition-all duration-300 group shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col`}
            >
              {/* Subtle background glow representing the team side */}
              <div className={`absolute top-0 w-[80%] h-32 opacity-40 blur-[40px] pointer-events-none ${theme.glow} ${index === 0 ? "left-0" : "right-0"}`} />

              {/* Team Header */}
              <div className="relative p-6 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[14px] bg-[#030305] border border-white/20 p-1 flex items-center justify-center overflow-hidden shadow-inner shrink-0 relative">
                    <img
                      src={team.logo?.url || "/placeholder.svg"}
                      alt={team.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl sm:text-2xl font-black text-white uppercase tracking-wide truncate ${theme.textHover} transition-colors`}>
                      {team.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                      {team.players?.length || 0} Registered Operators
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Stats & Roster Body */}
              <div className="relative p-6 space-y-6 flex-1 flex flex-col">
                
                {/* Captain Panel */}
                <div className="bg-[#030305] rounded-[16px] p-4 border border-white/5 shadow-inner shrink-0 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 w-1 h-full ${theme.glow}`} />
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 pl-2">
                    Squad Commander
                  </p>
                  <div className="flex items-center gap-4 pl-2">
                    <img
                      src={team.captain?.image?.url || "/placeholder.svg"}
                      alt={team.captain?.name}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white uppercase tracking-wide truncate text-sm">
                        {team.captain?.name || "Unassigned"}
                      </p>
                      <p className="text-[10px] font-bold text-gray-500 truncate">
                        {team.captain?.inGameUserName || "IGN N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 shrink-0">
                  <div className="bg-[#030305] rounded-xl p-3 border border-white/5 text-center shadow-inner">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">State</p>
                    <p className="font-black text-white text-[10px] uppercase">{team.status}</p>
                  </div>
                  <div className="bg-[#030305] rounded-xl p-3 border border-white/5 text-center shadow-inner">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Wins</p>
                    <p className={`font-black text-lg leading-none ${theme.accentText}`}>{totalWins(team)}</p>
                  </div>
                  <div className="bg-[#030305] rounded-xl p-3 border border-white/5 text-center shadow-inner">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Avg Win Rate</p>
                    <p className="font-black text-white text-sm leading-none">
                      {team.players?.length ? (totalWins(team) / team.players.length).toFixed(1) : 0}
                    </p>
                  </div>
                </div>

                {/* Roster List (Scrollable area) */}
                <div className="flex-1 flex flex-col min-h-[150px]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Active Roster
                    </p>
                    <span className="text-[9px] font-bold text-gray-600">{team.players?.length || 0} Members</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {team.players?.map((player) => (
                      <div
                        key={player.player || player._id}
                        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-[12px] p-2.5 border border-transparent hover:border-white/10 transition-colors"
                      >
                        <img
                          src={player?.image?.url || "/placeholder.svg"}
                          alt={player?.name}
                          className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                           <span className="text-xs font-black text-white uppercase tracking-wide truncate block w-full">
                            {player?.name}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 truncate block w-full">
                            {player?.inGameUserName}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!team.players || team.players.length === 0) && (
                      <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">No operators registered</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
        
        {(!teams || teams.length === 0) && (
           <div className="md:col-span-2 text-center py-20 bg-[#0a0b10]/40 backdrop-blur-xl rounded-[24px] border border-white/5 shadow-inner">
             <Shield className="w-12 h-12 mx-auto mb-4 text-gray-600" />
             <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">No Squads Registered</h3>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deploy a squad to begin configuration.</p>
           </div>
        )}
      </div>

      <TeamModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        players={players}
        tournament={tournament}
        refetchTournament={refetchTournament}
      />
    </div>
  );
}