import {
  Trophy,
  Target,
  ShieldCheck,
  Star,
  TrendingUp,
  Activity,
  Goal,
  Shield,
  History,
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";

export const CareerOverview = ({ careerStats }) => {
  const { user } = useAuthStore();

  // Fetching match history directly inside Overview (just like CareerMatchResults)
  const { data: { data: { data: matchResults } = {} } = {} } = useQuery({
    queryKey: ["playerMatchHistory", user?._id],
    queryFn: () => {
      return API.get(`/users/getMatchHistory/${user?._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
    enabled: !!user?._id, // Only run if user ID is available
  });

  // Get exactly the last 30 matches (or fewer if not available)
  const form30 = matchResults?.slice(0, 30) || [];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">
      {/* --- PRO ESPORTS BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        {/* 1. ALL-TIME RECORD (Main Hero Card) - Spans 8 columns */}
        <div className="md:col-span-8 relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden group transition-all duration-500 hover:border-white/20 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)]">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-bl from-[var(--color-neon-pink)]/10 to-transparent blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full justify-between p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                <Activity
                  size={16}
                  className="text-[var(--color-neon-pink)] drop-shadow-[0_0_8px_var(--color-neon-pink)]"
                />
              </div>
              <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
                All-Time Record
              </h3>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Win Rate Donut Chart */}
              <div className="flex flex-col items-center justify-center relative">
                <svg className="w-36 h-36 transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(255,77,169,0.2)]">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-white/[0.03]"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="url(#winrate-gradient)"
                    strokeWidth="6"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray="402"
                    strokeDashoffset={
                      402 - (402 * (careerStats?.winRate || 0)) / 100
                    }
                    className="transition-all duration-1500 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="winrate-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="var(--color-neon-pink)" />
                      <stop offset="100%" stopColor="var(--color-neon-blue)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-md">
                    {careerStats?.winRate?.toFixed(0) || 0}
                    <span className="text-lg text-[var(--color-neon-pink)]">
                      %
                    </span>
                  </span>
                </div>
                <span className="mt-5 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                  Win Rate
                </span>
              </div>

              {/* W/D/L Split */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {[
                  {
                    label: "Matches",
                    value: careerStats?.totalMatches || 0,
                    color: "text-white",
                    border: "hover:border-white/30",
                  },
                  {
                    label: "Wins",
                    value: careerStats?.wins || 0,
                    color:
                      "text-transparent bg-clip-text bg-gradient-to-b from-white to-[var(--color-neon-pink)]",
                    border: "hover:border-[var(--color-neon-pink)]/50",
                  },
                  {
                    label: "Draws",
                    value: careerStats?.draws || 0,
                    color:
                      "text-transparent bg-clip-text bg-gradient-to-b from-white to-[var(--color-neon-blue)]",
                    border: "hover:border-[var(--color-neon-blue)]/50",
                  },
                  {
                    label: "Losses",
                    value: careerStats?.losses || 0,
                    color: "text-gray-500",
                    border: "hover:border-white/10",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 ${stat.border} group/stat`}
                  >
                    <span
                      className={`text-2xl md:text-3xl font-black mb-1.5 tracking-tight ${stat.color} filter drop-shadow-sm`}
                    >
                      {stat.value}
                    </span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] group-hover/stat:text-gray-300 transition-colors">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. FORM & STREAKS - Spans 4 columns */}
        <div className="md:col-span-4 relative rounded-3xl border border-white/10 bg-gradient-to-bl from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden group transition-all duration-500 hover:border-white/20">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-[var(--color-neon-blue)]/10 blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full justify-between p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                <TrendingUp
                  size={16}
                  className="text-[var(--color-neon-blue)] drop-shadow-[0_0_8px_var(--color-neon-blue)]"
                />
              </div>
              <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
                Form & Streaks
              </h3>
            </div>

            <div className="space-y-4">
              <div className="relative flex justify-between items-center p-5 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-[var(--color-neon-pink)]/30 transition-colors">
                <div>
                  <span className="block text-[9px] text-[var(--color-neon-pink)] font-bold uppercase tracking-[0.2em] mb-1">
                    Win Streak
                  </span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {careerStats?.longestWinStreak || 0}
                  </span>
                </div>
                <TrendingUp
                  size={24}
                  className="text-[var(--color-neon-pink)]/30"
                  strokeWidth={1.5}
                />
              </div>

              <div className="relative flex justify-between items-center p-5 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-[var(--color-neon-blue)]/30 transition-colors">
                <div>
                  <span className="block text-[9px] text-[var(--color-neon-blue)] font-bold uppercase tracking-[0.2em] mb-1">
                    Unbeaten
                  </span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {careerStats?.longestUnbeatenStreak || 0}
                  </span>
                </div>
                <Shield
                  size={24}
                  className="text-[var(--color-neon-blue)]/30"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. RECENT FORM (30 MATCHES) - NEW WIDGET Spans 12 columns */}
        <div className="md:col-span-12 relative rounded-3xl border border-white/10 bg-gradient-to-t from-white/[0.02] to-black/60 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden group transition-all duration-500 hover:border-white/20">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                  <History
                    size={16}
                    className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  />
                </div>
                <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
                  Tactical Form (Last 30 Matches)
                </h3>
              </div>

              {/* Form Summary Mini Stats */}
              {form30.length > 0 && (
                <div className="flex items-center gap-4 bg-[#05050a] px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-neon-pink)] shadow-[0_0_5px_var(--color-neon-pink)]" />
                    <span className="text-[10px] font-black text-white">
                      {
                        form30.filter((m) => m.result?.toLowerCase() === "win")
                          .length
                      }{" "}
                      W
                    </span>
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-neon-blue)] shadow-[0_0_5px_var(--color-neon-blue)]" />
                    <span className="text-[10px] font-black text-white">
                      {
                        form30.filter((m) => m.result?.toLowerCase() === "draw")
                          .length
                      }{" "}
                      D
                    </span>
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-600" />
                    <span className="text-[10px] font-black text-gray-400">
                      {
                        form30.filter((m) => m.result?.toLowerCase() === "loss")
                          .length
                      }{" "}
                      L
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              {form30.length > 0 ? (
                form30.map((match, index) => {
                  const r = match.result?.toLowerCase();
                  // Theme-Aligned Colors for the blocks
                  let blockColor =
                    "bg-[#ff4da9]/10 text-neon-pink border-neon-pink"; // Loss (Neutral/Dimmed)

                  if (r === "win") {
                    blockColor =
                      "bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] border-[var(--color-neon-blue)]/40 shadow-[0_0_10px_rgba(255,77,169,0.15)]";
                  } else if (r === "draw") {
                    blockColor =
                      "bg-[var(--color-neon-yellow)]/10 text-[var(--color-neon-yellow)] border-[var(--color-neon-yellow)]/40 shadow-[0_0_10px_rgba(88,101,249,0.15)]";
                  }

                  return (
                    <div
                      key={index}
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-black border transition-transform hover:-translate-y-1 cursor-default ${blockColor}`}
                      title={`${match.result}: ${match.scoreFor} - ${match.scoreAgainst}`}
                    >
                      {match.result?.charAt(0).toUpperCase()}
                    </div>
                  );
                })
              ) : (
                <div className="w-full py-6 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    No match history available
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. ATTACKING PROWESS - Spans 5 columns */}
        <div className="md:col-span-5 relative rounded-3xl border border-white/10 bg-gradient-to-tr from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden group transition-all duration-500 hover:border-white/20">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                <Goal
                  size={16}
                  className="text-[var(--color-neon-pink)] drop-shadow-[0_0_8px_var(--color-neon-pink)]"
                />
              </div>
              <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
                Attacking Prowess
              </h3>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <div className="flex justify-between items-end border-b border-white/10 pb-6 relative">
                <div className="absolute bottom-0 left-0 w-1/3 h-px bg-gradient-to-r from-[var(--color-neon-pink)] to-transparent" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">
                    Total Career Goals
                  </span>
                  <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter">
                    {careerStats?.totalGoals || 0}
                  </span>
                </div>
                <Target
                  size={42}
                  className="text-[var(--color-neon-pink)]/20 mb-1"
                  strokeWidth={1}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                  Efficiency (G/M)
                </span>
                <span className="text-2xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {careerStats?.goalsPerMatch?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. HONOURS & ACHIEVEMENTS - Spans 7 columns */}
        <div className="md:col-span-7 relative rounded-3xl border border-white/10 bg-gradient-to-tl from-white/[0.04] to-black/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden group transition-all duration-500 hover:border-white/20">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                <Trophy
                  size={16}
                  className="text-[var(--color-accent-pink)] drop-shadow-[0_0_8px_var(--color-accent-pink)]"
                />
              </div>
              <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-[0.25em]">
                Honours & Achievements
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              {[
                {
                  label: "Tournaments",
                  value: careerStats?.tournamentsWon || 0,
                  sub: `Played: ${careerStats?.tournamentsPlayed || 0}`,
                  icon: (
                    <Trophy
                      size={18}
                      className="text-[var(--color-neon-pink)]"
                    />
                  ),
                },
                {
                  label: "MOTM Awards",
                  value: careerStats?.motmAwards || 0,
                  sub: "Dominance",
                  icon: (
                    <Star size={18} className="text-[var(--color-neon-blue)]" />
                  ),
                },
                {
                  label: "Clean Sheets",
                  value: careerStats?.cleanSheets || 0,
                  sub: "Impenetrable",
                  icon: <ShieldCheck size={18} className="text-white" />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative p-5 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col justify-between group/achieve hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative w-10 h-10 rounded-xl border border-white/10 bg-white/[0.01] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] group-hover/achieve:border-white/30 transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <span className="block text-3xl font-black text-white mb-2 tracking-tighter drop-shadow-sm">
                      {item.value}
                    </span>
                    <span className="block text-[10px] text-gray-300 font-bold uppercase tracking-[0.15em]">
                      {item.label}
                    </span>
                    <span className="block text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1.5">
                      {item.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerOverview;
