import { useAuthStore } from "../../../store/authStore";
import { API } from "../../../axios";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Loader2, Target, Crosshair, Trophy } from "lucide-react";

const CareerSeasonHistory = ({ getStatColor }) => {
  const { user } = useAuthStore();

  const { data: { data: { data: seasonalBreakdown } = {} } = {}, isLoading } = useQuery({
    queryKey: ["playerStatsSeason"],
    queryFn: () => {
      return API.get(`/users/playerStatsBySeason/${user?._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--color-neon-blue)] animate-spin drop-shadow-[0_0_10px_var(--color-neon-blue)]" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] animate-pulse">
          Loading Seasons...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">
      
      {/* --- SEASON BY SEASON BREAKDOWN (Glossy Panel) --- */}
      <div className="liquid-glass-card black relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden group transition-all duration-500 hover:border-white/20">
        
        {/* Glossy Edge Highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[var(--color-neon-blue)]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              <CalendarDays size={16} className="text-[var(--color-neon-blue)] drop-shadow-[0_0_8px_rgba(88,101,249,0.8)]" />
            </div>
            <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
              Season By Season Breakdown
            </h3>
          </div>

          <div className="space-y-6">
            {seasonalBreakdown?.map((season) => {
              const gmAvg = (season.goals / (season.matches || 1)).toFixed(2);
              
              return (
                <div
                  key={season.season}
                  className="relative flex flex-col p-6 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-[var(--color-neon-blue)]/30 transition-all duration-300 group/season"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover/season:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none shadow-[inset_0_0_20px_rgba(88,101,249,0.05)]" />

                  {/* Top Section: Season Title & Win Rate */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      {/* Season Year Badge */}
                      <div className="px-4 py-2 rounded-xl bg-[#05050a] border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] group-hover/season:border-[var(--color-neon-blue)]/40 transition-colors">
                        <span className="text-xl font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                          {season.season}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                        Campaign
                      </span>
                    </div>

                    {/* Win Rate Bar */}
                    <div className="flex items-center gap-4 sm:w-1/3">
                      <div className="flex flex-col items-end flex-1">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Win Rate</span>
                        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStatColor(season.winRate, { excellent: 75, good: 65 }).replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`}
                            style={{ width: `${season.winRate}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-2xl font-black tracking-tighter ${getStatColor(season.winRate, { excellent: 75, good: 65 })} drop-shadow-sm`}>
                        {season.winRate}<span className="text-sm opacity-70">%</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Section: Stat Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    
                    {/* Stat Boxes */}
                    {[
                      { label: "Matches", value: season.matches, color: "text-white" },
                      { label: "Wins", value: season.wins, color: "text-[var(--color-neon-pink)]" },
                      { label: "Draws", value: season.draws, color: "text-[var(--color-neon-blue)]" },
                      { label: "Losses", value: season.losses, color: "text-gray-500" },
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-[#05050a]/50 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center hover:bg-white/[0.02] transition-colors">
                        <span className={`text-xl font-black tracking-tight mb-1 drop-shadow-sm ${stat.color}`}>
                          {stat.value}
                        </span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                          {stat.label}
                        </span>
                      </div>
                    ))}

                    {/* Highlights (Goals & Tournaments) */}
                    <div className="col-span-2 grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 rounded-xl p-3 flex flex-col justify-center relative overflow-hidden group-hover/season:border-[var(--color-neon-pink)]/20 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Total Goals</span>
                          <Target size={12} className="text-[var(--color-neon-pink)]" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white tracking-tight">{season.goals}</span>
                          <span className="text-[10px] text-[var(--color-neon-pink)] font-bold tracking-widest">({gmAvg} G/M)</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 rounded-xl p-3 flex flex-col justify-center relative overflow-hidden group-hover/season:border-yellow-500/20 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Tourneys</span>
                          <Trophy size={12} className="text-yellow-500" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">{season.tournaments}</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Empty State Fallback */}
            {(!seasonalBreakdown || seasonalBreakdown.length === 0) && (
              <div className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                  <CalendarDays size={40} className="text-gray-600 mb-4" />
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Season Data Found</p>
                  <p className="text-xs text-gray-600 mt-1 tracking-wide">Play matches to generate yearly breakdown reports.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerSeasonHistory;