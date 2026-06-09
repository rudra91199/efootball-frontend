import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, ChevronDown, Crown, Shield, Star } from "lucide-react";
import { API } from "../../../../axios";
import { useParams } from "react-router";
import AuthLoader from "../../../Loaders/AuthLoader";
import { getFaceCropUrl } from "../../../../Utils/utils";

// Helper for Abbreviations
const getTeamInitials = (teamName) => {
  if (!teamName) return "TBD";
  return teamName
    .split(" ")
    .filter((word) => word.toLowerCase() !== "of")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

// ==========================================
// DYNAMIC TEAM THEME ENGINE
// ==========================================
const getTeamTheme = (teamName) => {
  const name = (teamName || "").toLowerCase().trim();
  const abb = getTeamInitials(teamName);

  if (name === "real madrid" || name === "rma") {
    return {
      abb: "RMA",
      primaryHex: "#cfb53b",
      panelBg: "bg-[#050505]/90",
      headerBg: "bg-black/20",
      cardBg: "bg-[#050505]/80",
      statsBg: "bg-black/40",
      gradientText: "from-white via-[#cfb53b] to-white",
      border: "border-[#cfb53b]/40",
      activeBorder: "border-[#cfb53b] shadow-[0_0_15px_rgba(207,181,59,0.4)]",
      badge: "bg-[#cfb53b]/10 text-[#cfb53b] border border-[#cfb53b]/30",
      accentText: "text-[#cfb53b]",
      normalText: "text-white",
      mutedText: "text-gray-400",
      avatarBorder: "border-[#cfb53b]",
      shadow: "shadow-[0_10px_40px_rgba(207,181,59,0.15)]",
      rowBg: "bg-gradient-to-r from-[#cfb53b]/10 to-transparent",
    };
  }
  if (name === "barca" || name === "fc barcelona" || name === "fcb") {
    return {
      abb: "FCB",
      primaryHex: "#edbb00",
      panelBg: "bg-[#080b1f]/90",
      headerBg: "bg-black/20",
      cardBg: "bg-[#080b1f]/80",
      statsBg: "bg-black/40",
      gradientText: "from-[#a50044] via-[#edbb00] to-[#004d98]",
      border: "border-[#a50044]/50",
      activeBorder: "border-[#edbb00] shadow-[0_0_15px_rgba(237,187,0,0.4)]",
      badge: "bg-[#a50044]/20 text-[#edbb00] border border-[#edbb00]/30",
      accentText: "text-[#edbb00]",
      normalText: "text-white",
      mutedText: "text-gray-400",
      avatarBorder: "border-[#a50044]",
      shadow: "shadow-[0_10px_40px_rgba(165,0,68,0.2)]",
      rowBg:
        "bg-gradient-to-r from-[#a50044]/15 via-[#004d98]/5 to-transparent",
    };
  }
  if (name.includes("seven blades")) {
    return {
      abb: "SBB",
      primaryHex: "#ef4444",
      panelBg:
        "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[rgb(161,161,162)]/10",
      headerBg: "bg-black/50",
      cardBg: "bg-black/60",
      statsBg: "bg-black/70",
      gradientText: "from-[#e4e4e7] via-[#dc2626] to-[#e4e4e7]",
      border: "border-[#a1a1aa] shadow-[0_0_20px_rgba(220,38,38,0.2)]",
      activeBorder: "border-[#a1a1aa] shadow-[0_0_15px_rgba(220,38,38,0.1)]",
      badge: "bg-gradient-to-br from-[#27272a] to-[#991b1b] text-white",
      accentText: "text-[#ef4444]",
      normalText: "text-white drop-shadow-md",
      mutedText: "text-gray-300",
      avatarBorder:
        "border-t-[#a1a1aa]/70 border-l-[#a1a1aa]/70 border-b-[#dc2626]/50 border-r-[#dc2626]/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]",
      shadow: "shadow-[0px_0px_rgba(220,38,38,0.5)]",
      rowBg:
        "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[rgb(161,161,162)]/10",
    };
  }
  if (name.includes("surya sen")) {
    return {
      abb: "SSB",
      primaryHex: "#b08d5c",
      panelBg: "bg-[#111a22]/90",
      headerBg: "bg-black/20",
      cardBg: "bg-[#111a22]/80",
      statsBg: "bg-black/40",
      gradientText: "from-[#b08d5c] via-[#f4ecd8] to-[#b08d5c]",
      border: "border-[#b08d5c]/40",
      activeBorder: "border-[#b08d5c] shadow-[0_0_15px_rgba(176,141,92,0.4)]",
      badge: "bg-[#b08d5c]/10 text-[#b08d5c] border border-[#b08d5c]/30",
      accentText: "text-[#b08d5c]",
      normalText: "text-white",
      mutedText: "text-gray-400",
      avatarBorder: "border-[#b08d5c]",
      shadow: "shadow-[0_10px_40px_rgba(176,141,92,0.15)]",
      rowBg: "bg-gradient-to-r from-[#b08d5c]/15 to-transparent",
    };
  }

  return {
    abb: abb,
    primaryHex: "#60a5fa",
    panelBg: "bg-[#0a0b10]/90",
    headerBg: "bg-black/20",
    cardBg:
      "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[rgb(161,161,162)]/10",
    statsBg: "bg-black/40",
    gradientText: "from-gray-400 via-white to-gray-400",
    border: "border-white/10",
    activeBorder: "border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.3)]",
    badge: "bg-white/5 text-gray-300 border border-white/10",
    accentText: "text-blue-400",
    normalText: "text-white",
    mutedText: "text-gray-400",
    avatarBorder: "border-white/30",
    shadow: "shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
    rowBg: "bg-gradient-to-r from-blue-500/10 to-transparent",
  };
};

const ChampionshipLeaderboard = ({ tab }) => {
  const [expandedTeam, setExpandedTeam] = useState(null);
  const { tournamentId } = useParams();

  const { data: { data: { data } = {} } = {}, isLoading } = useQuery({
    queryKey: ["championship-leaderboard", tab, tournamentId],
    queryFn: () => {
      return API.get(`/massacre/championship-leaderboard/${tournamentId}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  if (isLoading) {
    return <AuthLoader />;
  }

  // Sort by Grand Total
  const sortedTeams = data
    ? [...data].sort((a, b) => b.teamGrandTotal - a.teamGrandTotal)
    : [];

  const getRankBadge = (rank, theme) => {
    if (rank === 1)
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] bg-yellow-500/20 border border-yellow-500 text-yellow-400 flex items-center justify-center font-black shadow-[0_0_15px_rgba(234,179,8,0.4)] relative shrink-0">
          <Crown size={20} className="absolute opacity-30" />
          <span className="relative z-10 text-lg">1</span>
        </div>
      );
    if (rank === 2)
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] bg-slate-400/20 border border-slate-400 text-slate-300 flex items-center justify-center font-black relative shrink-0">
          <Medal size={20} className="absolute opacity-30" />
          <span className="relative z-10 text-lg">2</span>
        </div>
      );
    if (rank === 3)
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] bg-amber-600/20 border border-amber-600 text-amber-500 flex items-center justify-center font-black relative shrink-0">
          <Shield size={20} className="absolute opacity-30" />
          <span className="relative z-10 text-lg">3</span>
        </div>
      );
    return (
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] bg-black/60 border ${theme.border} ${theme.mutedText} flex items-center justify-center font-black text-base shrink-0`}
      >
        #{rank}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col bg-[#0a0b10]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] font-sans relative z-10 max-w-5xl mx-auto">
      {/* --- HEADER --- */}
      <div className="px-6 sm:px-8 py-6 border-b border-white/5 bg-black/40 shadow-inner flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-yellow-600 to-amber-400 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)]">
          <Trophy className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
            Grand Championship
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
            Overall Standings (Phase 1 + 2 + 3)
          </p>
        </div>
      </div>

      {/* --- TEAMS LIST --- */}
      <div className="p-4 sm:p-6 space-y-6">
        {sortedTeams.map((team, index) => {
          const tStyle = getTeamTheme(team.teamName);
          const isExpanded = expandedTeam === team._id;
          const isRank1 = index === 0;

          return (
            <div
              key={team._id}
              className={`relative flex flex-col rounded-[24px] overflow-hidden transition-all duration-500 border ${isExpanded || isRank1 ? tStyle.activeBorder : `border-white/10 hover:border-white/20`} ${tStyle.cardBg}`}
            >
              {/* Thematic Aura Background */}
              <div
                className={`absolute inset-0 pointer-events-none opacity-30 z-0 ${tStyle.rowBg}`}
              />

              {/* --- TEAM ROW (Accordion Header) --- */}
              <button
                onClick={() => setExpandedTeam(isExpanded ? null : team._id)}
                className="relative z-10 w-full p-4 sm:p-5 sm:pl-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 outline-none group text-left"
              >
                {/* Left: Rank, Logo, Name */}
                <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                  {getRankBadge(index + 1, tStyle)}

                  <div
                    className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] overflow-hidden border-[2px] shadow-xl bg-black transition-transform group-hover:scale-105 ${isRank1 ? tStyle.avatarBorder : "border-white/10"}`}
                  >
                    <img
                      src={team.teamLogo || "/placeholder.svg"}
                      alt={team.teamName}
                      className="w-full h-full object-cover p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`block font-black text-lg sm:text-2xl uppercase tracking-wider truncate ${isRank1 ? tStyle.accentText : tStyle.normalText} drop-shadow-md`}
                    >
                      {team.teamName}
                    </span>
                    <span
                      className={`w-fit mt-1 text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-md shadow-inner uppercase font-black tracking-widest ${tStyle.badge}`}
                    >
                      {tStyle.abb}
                    </span>
                  </div>
                </div>

                {/* Right/Bottom: Phase Scores Grid */}
                <div className="grid grid-cols-4 sm:flex sm:items-center gap-2 sm:gap-4 bg-black/40 sm:bg-transparent rounded-xl p-3 sm:p-0 shrink-0">
                  <div
                    className={`flex flex-col items-center justify-center sm:w-16 ${tStyle.statsBg} sm:bg-transparent rounded-lg py-1 sm:py-0 border border-white/5 sm:border-none`}
                  >
                    <p
                      className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                    >
                      Phase 1
                    </p>
                    <p
                      className={`text-sm sm:text-lg font-black ${tStyle.normalText}`}
                    >
                      {team.teamP1}
                    </p>
                  </div>
                  <div
                    className={`flex flex-col items-center justify-center sm:w-16 ${tStyle.statsBg} sm:bg-transparent rounded-lg py-1 sm:py-0 border border-white/5 sm:border-none`}
                  >
                    <p
                      className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                    >
                      Phase 2
                    </p>
                    <p
                      className={`text-sm sm:text-lg font-black ${tStyle.normalText}`}
                    >
                      {team.teamP2}
                    </p>
                  </div>
                  <div
                    className={`flex flex-col items-center justify-center sm:w-16 ${tStyle.statsBg} sm:bg-transparent rounded-lg py-1 sm:py-0 border border-white/5 sm:border-none`}
                  >
                    <p
                      className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                    >
                      Phase 3
                    </p>
                    <p
                      className={`text-sm sm:text-lg font-black ${tStyle.normalText}`}
                    >
                      {team.teamP3}
                    </p>
                  </div>

                  <div className="hidden sm:block w-px h-10 bg-white/10 mx-1" />

                  <div
                    className={`flex flex-col items-center justify-center sm:w-20 ${tStyle.statsBg} sm:bg-black/60 rounded-xl py-1 sm:py-2 border ${tStyle.border} shadow-inner`}
                  >
                    <p
                      className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                    >
                      Total
                    </p>
                    <p
                      className={`text-lg sm:text-3xl font-black drop-shadow-[0_0_10px_currentColor] ${tStyle.accentText}`}
                    >
                      {team.teamGrandTotal}
                    </p>
                  </div>
                </div>

                {/* Desktop Chevron */}
                <div className="hidden sm:flex items-center justify-center shrink-0 ml-2">
                  <ChevronDown
                    className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? `rotate-180 ${tStyle.accentText}` : tStyle.mutedText}`}
                  />
                </div>
                {/* Mobile Chevron */}
                <div className="sm:hidden absolute top-5 right-5">
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? `rotate-180 ${tStyle.accentText}` : tStyle.mutedText}`}
                  />
                </div>
              </button>

              {/* --- INDIVIDUAL PLAYERS (Expanded State) --- */}
              {isExpanded && (
                <div className="relative z-10 px-4 pb-4 sm:px-6 sm:pb-6 pt-2 border-t border-white/5 bg-black/20">
                  <div className="space-y-3 mt-2">
                    {/* Safely Sort Players by Total */}
                    {[...(team.players || [])]
                      .sort((a, b) => b.total - a.total)
                      .map((player, playerIndex) => (
                        <div
                          key={playerIndex}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl border border-white/5 transition-all shadow-md bg-[#050505]/80 hover:bg-[#0a0a0a]`}
                        >
                          {/* Player Info with Image */}
                          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0 min-w-0">
                            <div
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-black/60 border border-white/10 ${tStyle.mutedText} font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0`}
                            >
                              {playerIndex + 1}
                            </div>

                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] overflow-hidden border border-white/20 shrink-0 bg-black`}
                            >
                              <img
                                src={getFaceCropUrl(player.image)}
                                alt={player.username}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div
                              className={`font-black text-sm sm:text-base truncate max-w-[150px] sm:max-w-[200px] ${tStyle.normalText}`}
                            >
                              {player.username}
                            </div>
                          </div>

                          {/* Player Stats Grid */}
                          <div className="grid grid-cols-4 sm:flex sm:items-center gap-2 sm:gap-4 bg-black/40 sm:bg-transparent rounded-lg p-2 sm:p-0 text-center shrink-0">
                            <div className="sm:w-14">
                              <p
                                className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                              >
                                P1
                              </p>
                              <p
                                className={`font-black text-xs sm:text-sm ${tStyle.normalText}`}
                              >
                                {player.p1}
                              </p>
                            </div>
                            <div className="sm:w-14">
                              <p
                                className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                              >
                                P2
                              </p>
                              <p
                                className={`font-black text-xs sm:text-sm ${tStyle.normalText}`}
                              >
                                {player.p2}
                              </p>
                            </div>
                            <div className="sm:w-14">
                              <p
                                className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                              >
                                P3
                              </p>
                              <p
                                className={`font-black text-xs sm:text-sm ${tStyle.normalText}`}
                              >
                                {player.p3}
                              </p>
                            </div>

                            <div className="hidden sm:block w-px h-6 bg-white/10 mx-1" />

                            <div className="sm:w-16 bg-black/60 sm:bg-transparent rounded-lg py-1 sm:py-0 border border-white/5 sm:border-none shadow-inner sm:shadow-none">
                              <p
                                className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                              >
                                Total
                              </p>
                              <p
                                className={`font-black text-sm sm:text-lg ${tStyle.accentText}`}
                              >
                                {player.total}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State Fallback */}
      {sortedTeams?.length === 0 && (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <Star className="w-16 h-16 text-gray-700 mb-5" />
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-base">
            No championship data yet
          </p>
        </div>
      )}
    </div>
  );
};

export default ChampionshipLeaderboard;
