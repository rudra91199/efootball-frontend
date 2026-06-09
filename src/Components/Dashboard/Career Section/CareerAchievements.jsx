import { Trophy, Lock, Loader2, Medal } from "lucide-react";
import moment from "moment";

const CareerAchievements = ({ milestones, goalMilestones, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--color-accent-pink)] animate-spin drop-shadow-[0_0_10px_var(--color-accent-pink)]" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] animate-pulse">
          Loading Records...
        </span>
      </div>
    );
  }

  // 1. Filter out 'goals' since they are displayed in the CareerGoals tab
  const recordsMilestones = milestones?.filter((m) => m.category !== "goals") || [];

  // 2. Helper to get category-specific colors and SUBTLE shadows
  const getCategoryStyles = (category) => {
    switch (category) {
      case "achievements":
        return { 
          color: "text-yellow-400", 
          bg: "bg-yellow-500/10", 
          border: "border-yellow-500/20", 
          glow: "rgba(250,204,21,0.08)", // Subtle card hover glow
          iconShadow: "0 0 12px rgba(250,204,21,0.25)" // Reduced, clean shadow
        };
      case "defense":
        return { 
          color: "text-[var(--color-neon-blue)]", 
          bg: "bg-[var(--color-neon-blue)]/10", 
          border: "border-[var(--color-neon-blue)]/20", 
          glow: "rgba(88,101,249,0.08)",
          iconShadow: "0 0 12px rgba(88,101,249,0.25)" 
        };
      case "matches":
        return { 
          color: "text-[var(--color-neon-pink)]", 
          bg: "bg-[var(--color-neon-pink)]/10", 
          border: "border-[var(--color-neon-pink)]/20", 
          glow: "rgba(255,77,169,0.08)",
          iconShadow: "0 0 12px rgba(255,77,169,0.25)" 
        };
      default:
        return { 
          color: "text-gray-400", 
          bg: "bg-white/5", 
          border: "border-white/10", 
          glow: "rgba(255,255,255,0.05)",
          iconShadow: "0 0 10px rgba(255,255,255,0.15)"
        };
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">
      
      {/* --- CAREER RECORDS (Glossy Bento Panel) --- */}
      <div className="liquid-glass-card black relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden group transition-all duration-500 hover:border-white/20">
        
        {/* Glossy Edge Highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--color-accent-pink)]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              <Trophy size={16} className="text-yellow-500 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
            </div>
            <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
              Hall of Fame & Records
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recordsMilestones.map((milestone) => {
              const exactDate = goalMilestones[milestone.id];
              const isUnlocked = !!exactDate;
              const styles = getCategoryStyles(milestone.category);

              return isUnlocked ? (
                // 🟢 UNLOCKED STATE
                <div
                  key={milestone.id}
                  className="relative flex flex-col justify-between p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:-translate-y-1 transition-all duration-300 group/card"
                  style={{ boxShadow: `0 8px 25px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1), 0 0 15px ${styles.glow}00` }}
                >
                  {/* Hover Glow Effect inside card */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" style={{ boxShadow: `inset 0 0 20px ${styles.glow}` }} />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      {/* 🔥 Premium Icon Box (Black BG, Sharp Shadow, No Border) 🔥 */}
                      <div 
                        className="w-12 h-12 rounded-xl bg-[#05050a] flex items-center justify-center transition-transform duration-300 group-hover/card:scale-110"
                        style={{ boxShadow: styles.iconShadow }}
                      >
                        <span className={`text-2xl ${styles.color} drop-shadow-[0_0_4px_currentColor]`}>
                          {milestone.icon}
                        </span>
                      </div>
                      
                      {/* Category Badge */}
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${styles.bg} ${styles.color} ${styles.border}`}>
                        {milestone.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white tracking-wide mb-1 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-white group-hover/card:to-gray-400 transition-all">
                      {milestone.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-6">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Real Date Footer */}
                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                      UNLOCKED
                    </span>
                    <span className="text-xs font-black text-white tracking-widest">
                      {moment(exactDate).format("MMM Do, YYYY")}
                    </span>
                  </div>
                </div>
              ) : (
                // 🔴 LOCKED STATE
                <div
                  key={milestone.id}
                  className="relative flex flex-col justify-between p-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      {/* Locked Icon Box */}
                      <div className="w-12 h-12 rounded-xl bg-[#05050a] flex items-center justify-center border border-white/5">
                        <span className="text-2xl opacity-40">
                          {milestone.icon}
                        </span>
                      </div>
                      
                      {/* Locked Category Badge */}
                      <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-gray-600/30 bg-gray-600/10 text-gray-500">
                        {milestone.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-gray-500 tracking-wide mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-[11px] text-gray-600 font-bold uppercase tracking-wider mb-6">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Locked Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 opacity-70">
                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                      STATUS
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Lock size={12} strokeWidth={2.5} />
                      <span className="text-[10px] font-black tracking-widest">LOCKED</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Empty State Fallback */}
          {recordsMilestones.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <Medal size={40} className="text-gray-600 mb-4" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Records Found</p>
                <p className="text-xs text-gray-600 mt-1 tracking-wide">Play matches to unlock hall of fame badges.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CareerAchievements;