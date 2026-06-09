import useScrollReveal from "../../../Hooks/userScrollReveal";
import { Trophy, Medal, Crown, Shield, Target } from "lucide-react";

export default function PlayerRankings({ players }) {

  if (!players || players.length === 0) {
    return (
      <div className="bg-[#0a0b10]/60 backdrop-blur-xl p-12 rounded-[24px] text-center flex flex-col items-center justify-center border border-white/5 shadow-inner animate-fade-in">
        <Trophy className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">
          Database Empty
        </p>
        <p className="text-gray-600 text-xs mt-2 font-bold uppercase tracking-widest">
          Awaiting match data to generate standings.
        </p>
      </div>
    );
  }

  // Dynamic Theme for Leaderboard Rows
  const getRowTheme = (rank) => {
    switch (rank) {
      case 1:
        return {
          wrapper: "bg-gradient-to-r from-[#eab308]/10 via-[#0a0b10] to-[#0a0b10] border-[#eab308]/30 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]",
          badge: "bg-[#eab308] text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]",
          icon: <Crown className="w-4 h-4 text-black" />,
          nameText: "text-[#eab308]",
        };
      case 2:
        return {
          wrapper: "bg-gradient-to-r from-slate-300/10 via-[#0a0b10] to-[#0a0b10] border-slate-300/30",
          badge: "bg-slate-300 text-black shadow-[0_0_10px_rgba(203,213,225,0.3)]",
          icon: <Medal className="w-4 h-4 text-black" />,
          nameText: "text-slate-200",
        };
      case 3:
        return {
          wrapper: "bg-gradient-to-r from-amber-700/10 via-[#0a0b10] to-[#0a0b10] border-amber-700/30",
          badge: "bg-amber-600 text-white shadow-[0_0_10px_rgba(217,119,6,0.3)]",
          icon: <Shield className="w-4 h-4 text-white" />,
          nameText: "text-amber-500",
        };
      default:
        return {
          wrapper: "bg-[#030305] border-white/5 hover:border-white/10 hover:bg-[#0a0b10]",
          badge: "bg-[#0a0b10] border border-white/10 text-gray-500",
          icon: null,
          nameText: "text-white",
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans relative">
      
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 mb-8 relative z-10">
        <div className="p-3.5 bg-[#030305] border border-white/10 rounded-2xl shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e11d48]/20 to-[#ec4899]/20" />
          <Trophy className="w-8 h-8 text-[#ec4899] relative z-10" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-widest uppercase drop-shadow-md">
          Leaderboard
        </h2>
        <p className="text-[#e11d48] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
          The Massacre Standings
        </p>
      </div>

      {/* --- UNIFIED SINGLE LEADERBOARD --- */}
      <div className="max-w-5xl mx-auto w-full relative z-10">
        
        {/* Desktop Table Header */}
        <div className="hidden sm:flex items-center justify-between px-6 py-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-4 flex-1">
            <span className="w-12 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Rank</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Operator</span>
          </div>
          <div className="flex items-center gap-8 shrink-0 pr-4">
            <span className="w-8 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest" title="Wins">W</span>
            <span className="w-8 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest" title="Goals For">GF</span>
            <span className="w-8 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest" title="Goal Difference">GD</span>
            <span className="w-16 text-right text-[10px] font-black text-[#ec4899] uppercase tracking-widest">PTS</span>
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-3">
          {players.map((player, idx) => {
            const rank = idx + 1;
            const theme = getRowTheme(rank);
            
            return (
              <div
                key={`${player.username}-${rank}`}
                className={`relative flex items-center justify-between p-3 sm:p-4 rounded-[20px] border transition-all duration-300 group shadow-inner ${theme.wrapper}`}
              >
                {/* Left Side: Rank & Info */}
                <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                  
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-[12px] flex items-center justify-center font-black text-sm sm:text-base ${theme.badge}`}>
                    {theme.icon ? theme.icon : rank}
                  </div>

                  {/* Avatar & Text Info */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <img
                      src={player.image || "/placeholder.svg"}
                      alt={player.username}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border-2 shrink-0 ${rank <= 3 ? theme.border : "border-white/10"}`}
                    />
                    <div className="min-w-0 flex flex-col justify-center">
                      <p className={`font-black text-sm sm:text-base uppercase tracking-wide truncate ${theme.nameText}`}>
                        {player.username}
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate mt-0.5">
                        {player.team}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Stats & Points */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-8 shrink-0 sm:pr-4">
                  
                  {/* Desktop Secondary Stats (W, GF, GD) */}
                  <div className="hidden sm:flex items-center gap-8">
                    <div className="w-8 text-center font-black text-white text-sm">{player.wins}</div>
                    <div className="w-8 text-center font-black text-white text-sm">{player.gf}</div>
                    <div className={`w-8 text-center font-black text-sm ${player.gd > 0 ? "text-[#69fd00]" : player.gd < 0 ? "text-red-400" : "text-gray-400"}`}>
                      {player.gd > 0 ? `+${player.gd}` : player.gd}
                    </div>
                  </div>

                  {/* Mobile Compact Stats (Hidden on Desktop) */}
                  <div className="sm:hidden flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    <span>W:{player.wins}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span>GF:{player.gf}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className={player.gd > 0 ? "text-[#69fd00]" : player.gd < 0 ? "text-red-400" : ""}>
                      GD:{player.gd > 0 ? `+${player.gd}` : player.gd}
                    </span>
                  </div>

                  {/* Divider (Desktop Only) */}
                  <div className="hidden sm:block w-px h-8 bg-white/10" />

                  {/* Total Points (Always Visible) */}
                  <div className="flex items-center sm:items-end justify-end gap-1.5 sm:gap-0 sm:flex-col w-auto sm:w-16">
                    <span className="text-xl sm:text-2xl font-black text-white leading-none">
                      {player.total}
                    </span>
                    <span className="text-[10px] font-black text-[#ec4899] uppercase tracking-widest sm:mt-1">
                      PTS
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}