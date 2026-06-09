import {
  Target,
  Medal,
  Zap,
  Award,
  Target as TargetIcon,
  Star,
  Target as GoalIcon,
  ShieldCheck,
  Loader2,
  Lock,
} from "lucide-react";
import moment from "moment";

const CareerGoals = ({
  careerStats,
  milestones,
  goalMilestones,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--color-neon-pink)] animate-spin drop-shadow-[0_0_10px_var(--color-neon-pink)]" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] animate-pulse">
          Loading Records...
        </span>
      </div>
    );
  }

  // Filter only goal category milestones
  const goalsMilestonesList =
    milestones?.filter((m) => m.category === "goals") || [];
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">
      {/* --- SCORING RECORDS (Glossy Bento Panel) --- */}
      <div className="liquid-glass-card black relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden group transition-all duration-500 hover:border-white/20">
        {/* Glossy Edge Highlight (Top Reflection) */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

        {/* Subtle Ambient Glow inside the glass */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[var(--color-neon-pink)]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              <Target
                size={16}
                className="text-[var(--color-neon-pink)] drop-shadow-[0_0_8px_var(--color-neon-pink)]"
              />
            </div>
            <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
              Scoring Records
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Career Goals",
                value: careerStats?.careerGoals || 0,
                icon: <GoalIcon size={20} />,
                color: "text-white",
              },
              {
                label: "Hat-tricks",
                value: careerStats?.hatTricks || 0,
                icon: <Award size={20} />,
                color: "text-[var(--color-neon-blue)]",
              },
              {
                label: "Double Hat-tricks",
                value: careerStats?.doubleHatTricks || 0,
                icon: <Zap size={20} />,
                color: "text-[var(--color-neon-pink)]",
              },
              {
                label: "Triple Hat-tricks",
                value: careerStats?.tripleHatTricks || 0,
                icon: <Star size={20} />,
                color:
                  "text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-neon-pink)] to-[var(--color-neon-blue)]",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-white/10 group/stat"
              >
                {/* Embedded Icon Badge - Themed to match SS layout */}
                <div className="relative w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-[#1a1a24] to-[#05050a] border-t border-white/10 border-b border-black border-x border-white/5 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_15px_rgba(255,77,169,0.1)] transition-colors group-hover/stat:border-white/20">
                  {/* Theme Backlight */}
                  <div className="absolute inset-0 bg-[var(--color-neon-pink)]/5 blur-md rounded-2xl group-hover/stat:bg-[var(--color-neon-pink)]/10 transition-opacity"></div>
                  <span className="relative z-10 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                    {stat.icon}
                  </span>
                </div>

                <span
                  className={`text-2xl md:text-3xl font-black mb-1.5 tracking-tighter drop-shadow-sm ${stat.color}`}
                >
                  {stat.value}
                </span>
                <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] group-hover/stat:text-gray-300 transition-colors text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- GOAL MILESTONES (Achievement Tracker) --- */}
      <div className="liquid-glass-card black relative rounded-3xl border border-white/10 bg-gradient-to-bl from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden group transition-all duration-500 hover:border-white/20">
        {/* Glossy Edge Highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-neon-blue)]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              <Medal
                size={16}
                className="text-[var(--color-neon-blue)] drop-shadow-[0_0_8px_var(--color-neon-blue)]"
              />
            </div>
            <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
              Goal Milestones Tracker
            </h3>
          </div>

          <div className="space-y-3 px-2">
            {goalsMilestonesList.map((milestone) => {
              // Check if unlocked from backend data
              const exactDate = goalMilestones[milestone.id];
              const isUnlocked = !!exactDate;

              return isUnlocked ? (
                // 🟢 UNLOCKED STATE (Glossy & Glowing)
                <div
                  key={milestone.id}
                  className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-[var(--color-neon-blue)]/30 transition-all duration-300 hover:-translate-y-0.5 group/ms"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Badge Icon Box */}
                    <div className="relative w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-[#1a1a24] to-[#05050a] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_10px_rgba(88,101,249,0.1)] border border-[var(--color-neon-blue)]/30 group-hover/ms:border-[var(--color-neon-blue)]/60 transition-colors">
                      <div className="absolute inset-0 bg-[var(--color-neon-blue)]/10 blur-md rounded-xl"></div>
                      <span className="relative z-10 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] text-2xl">
                        {milestone.icon}
                      </span>
                    </div>

                    {/* Milestone Info */}
                    <div className="flex flex-col flex-1">
                      <p className="text-base md:text-lg font-black text-white tracking-wide mb-0.5 group-hover/ms:text-transparent group-hover/ms:bg-clip-text group-hover/ms:bg-gradient-to-r group-hover/ms:from-white group-hover/ms:to-[var(--color-neon-blue)] transition-all">
                        {milestone.title}
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Date Badge */}
                  <div className="flex items-center gap-3 sm:justify-end">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] md:text-[10px] text-[var(--color-neon-blue)] font-bold uppercase tracking-[0.2em] mb-1">
                        UNLOCKED ON
                      </span>
                      <span className="text-sm md:text-base font-black text-white tracking-tight">
                        {moment(exactDate).format("MMM Do, YYYY")}
                      </span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-blue)] shadow-[0_0_8px_var(--color-neon-blue)]" />
                  </div>
                </div>
              ) : (
                // 🔴 LOCKED STATE (Dimmed & Dashed)
                <div
                  key={milestone.id}
                  className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="flex items-center gap-4 flex-1 grayscale">
                    {/* Locked Badge Icon Box */}
                    <div className="relative w-12 h-12 shrink-0 rounded-xl bg-[#05050a] flex items-center justify-center border border-white/5">
                      <span className="relative z-10 text-gray-600 text-2xl">
                        {milestone.icon}
                      </span>
                    </div>

                    {/* Locked Milestone Info */}
                    <div className="flex flex-col flex-1">
                      <p className="text-base md:text-lg font-black text-gray-500 tracking-wide mb-0.5">
                        {milestone.title}
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase tracking-widest">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Locked Status Badge */}
                  <div className="flex items-center gap-3 sm:justify-end opacity-80">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] md:text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-1">
                        STATUS
                      </span>
                      <span className="text-sm md:text-base font-black text-gray-500 tracking-tight">
                        LOCKED
                      </span>
                    </div>
                    <Lock size={14} className="text-gray-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGoals;
