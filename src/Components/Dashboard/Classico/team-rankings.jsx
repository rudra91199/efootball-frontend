import { Medal, TrendingUp, Swords } from "lucide-react";
import { getFaceCropUrl } from "../../../Utils/utils";

export default function TeamRankings({ teams, theme = {} }) {
  // 1. Extract the pre-grouped and pre-sorted teams from the props
  const team1 = teams?.[0];
  const team2 = teams?.[1];

  if (!team1) return null;

  const team1Name = team1._id || "Team 1";
  const team2Name = team2?._id || "Team 2";

  // 2. Players are already sorted by the parent component
  const t1Players = team1.players || [];
  const t2Players = team2?.players || [];

  const maxRanks = Math.max(t1Players.length, t2Players.length);
  const ranksArray = Array.from({ length: maxRanks }, (_, i) => i + 1);

  // --- ULTRA-TRANSPARENT GLOSSY THEME ENGINE ---
  const getTeamStyles = (teamName, side) => {
    const normalizedName = teamName?.toLowerCase()?.trim() || "";

    if (normalizedName === "real madrid" || normalizedName === "rma") {
      return {
        text: "text-[#cfb53b] drop-shadow-[0_0_8px_rgba(207,181,59,0.5)]",
        ring: "border-[#cfb53b]/50 shadow-[0_0_15px_rgba(207,181,59,0.3)]",
        points: "text-white",
        bgGradient:
          side === "left"
            ? "bg-gradient-to-r from-[#cfb53b]/30 via-[#cfb53b]/5 to-transparent"
            : "bg-gradient-to-l from-[#cfb53b]/30 via-[#cfb53b]/5 to-transparent",
        avatarBg: "linear-gradient(to bottom, #cfb53b, #050505)",
      };
    }
    if (
      normalizedName === "barca" ||
      normalizedName === "fc barcelona" ||
      normalizedName === "fcb"
    ) {
      return {
        text: "text-[#edbb00] drop-shadow-[0_0_8px_rgba(237,187,0,0.5)]",
        ring: "border-[#a50044]/60 shadow-[0_0_15px_rgba(165,0,68,0.3)]",
        points: "text-[#edbb00]",
        bgGradient:
          side === "left"
            ? "bg-gradient-to-r from-[#a50044]/40 via-[#004d98]/10 to-transparent"
            : "bg-gradient-to-l from-[#a50044]/40 via-[#004d98]/10 to-transparent",
        avatarBg:
          "linear-gradient(135deg, rgba(165,0,68,0.9), #080b1f, #004d98)",
      };
    }
    if (normalizedName.includes("seven blades")) {
      return {
        text: "text-[#ffffff] drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]",
        ring: "border-[#c0c0c0]/60 shadow-[0_0_15px_rgba(220,20,60,0.4)]",
        points: "text-[#dc143c]", // Crimson points
        bgGradient:
          side === "left"
            ? "bg-gradient-to-r from-[#dc143c]/35 via-[#8b0000]/10 to-transparent"
            : "bg-gradient-to-l from-[#dc143c]/35 via-[#8b0000]/10 to-transparent",
        avatarBg: "linear-gradient(to bottom, #2a2a2a, #0a0a0a, #660000 70%)",
      };
    }
    if (normalizedName.includes("surya sen")) {
      return {
        text: "text-[#f4ecd8] drop-shadow-[0_0_8px_rgba(244,236,216,0.5)]",
        ring: "border-[#b08d5c]/60 shadow-[0_0_15px_rgba(176,141,92,0.3)]",
        points: "text-[#5eb89e]", // Patina Teal points
        bgGradient:
          side === "left"
            ? "bg-gradient-to-r from-[#2d4046]/50 via-[#1a2c3a]/20 to-transparent"
            : "bg-gradient-to-l from-[#2d4046]/50 via-[#1a2c3a]/20 to-transparent",
        avatarBg: "linear-gradient(to bottom, #2d4046, #9c8466, #1a2c3a)",
      };
    }

    // Cyberpunk Fallback
    return {
      text: "text-gray-200",
      ring: "border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]",
      points: "text-indigo-400",
      bgGradient:
        side === "left"
          ? "bg-gradient-to-r from-indigo-500/15 via-indigo-500/0 to-transparent"
          : "bg-gradient-to-l from-pink-500/15 via-pink-500/0 to-transparent",
      avatarBg:
        "linear-gradient(to bottom, rgba(49,44,133,0.8), rgba(10,14,41,0.7), #000000)",
    };
  };

  const t1Styles = getTeamStyles(team1Name, "left");
  const t2Styles = team2 ? getTeamStyles(team2Name, "right") : null;

  // Premium Metallic Badges
  const getMedalBadge = (rank) => {
    if (rank === 1)
      return (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border border-yellow-200 text-yellow-950 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.6)] z-10 font-black">
          <Medal size={18} className="drop-shadow-sm" />
        </div>
      );
    if (rank === 2)
      return (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 border border-gray-100 text-gray-900 flex items-center justify-center shadow-[0_0_15px_rgba(156,163,175,0.4)] z-10 font-black">
          <Medal size={18} className="drop-shadow-sm" />
        </div>
      );
    if (rank === 3)
      return (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-300 via-orange-500 to-orange-700 border border-orange-200 text-orange-950 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] z-10 font-black">
          <Medal size={18} className="drop-shadow-sm" />
        </div>
      );

    return (
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md border-2 border-white/10 text-gray-400 text-xs font-black flex items-center justify-center z-10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
        #{rank}
      </div>
    );
  };

  return (
    <div className="space-y-3 max-w-5xl backdrop-blur-sm font-sans animate-fade-in mx-2 ">
      {/* --- UNIFIED GLOSSY HEADER (Highly Transparent) --- */}
      <div className="relative overflow-hidden bg-black/20 liquid-glass-card low backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        {/* Top Edge Reflection */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className={`p-2 pl-5 sm:p-6 flex items-center gap-4 relative z-10`}>
          <div className={`p-2 ${theme.panelBg} border border-white/10 rounded-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]`}>
            <TrendingUp className="w-4 h-4 text-white drop-shadow-md" />
          </div>
          <div>
            <h2 className="text-base sm:text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
              The Grind Rankings
            </h2>
            <p className={`text-[10px] ${theme.accentText} sm:text-xs text-pink-300 mt-0.5 font-bold uppercase tracking-[0.2em]`}>
              Phase 1 Head-to-Head Standings
            </p>
          </div>
        </div>
      </div>

      {/* --- THE CONFRONTATION BOARD (Highly Transparent) --- */}
      <div className="relative backdrop-blur-xl liquid-glass-card rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden w-full">
        {/* Board Column Headers (Team vs Team) */}
        {team2 && (
          <div className={`relative flex justify-between items-center px-4 py-5 border-b border-white/10 ${theme.panelBg} w-full`}>
            {/* Center VS Icon */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center z-20">
              <Swords className="w-4 h-4 text-gray-400" />
            </div>

            {/* Team 1 Header */}
            <div className={`flex items-center gap-2 sm:gap-3 w-1/2 min-w-0 pr-4 `}>
              {team1.teamLogo && (
                <img
                  src={getFaceCropUrl(team1.teamLogo)}
                  alt=""
                  className={`w-10 h-10 sm:w-14 sm:h-14 border border-white/20 rounded-xl sm:rounded-2xl shrink-0 p-1`}
                  style={{background: t1Styles.avatarBg}}

                />
              )}
              <span
                className={`font-black text-[10px] sm:text-xl uppercase tracking-widest truncate ${t1Styles.text}`}
              >
                {team1Name
                  .split(" ")
                  .filter((word) => word.toLowerCase() !== "of")
                  .map((word) => word[0])
                  .join("")}
              </span>
            </div>

            {/* Team 2 Header */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 w-1/2 min-w-0 pl-4">
              <span
                className={`font-black text-[10px] sm:text-xl uppercase tracking-widest truncate text-right ${t2Styles.text}`}
              >
                {team2Name
                  .split(" ")
                  .filter((word) => word.toLowerCase() !== "of")
                  .map((word) => word[0])
                  .join("")}
              </span>
              {team2.teamLogo && (
                <img
                  src={getFaceCropUrl(team2.teamLogo)}
                  alt=""
                  className={`w-10 h-10  border border-white/20 rounded-xl sm:rounded-2xl shrink-0 p-2`}
                  style={{background: t2Styles.avatarBg}}
                />
              )}
            </div>
          </div>
        )}

        {/* The Ranks List */}
        <div className="flex   flex-col p-2 sm:p-5 gap-2 sm:gap-3 relative w-full">
          {/* Subtle vertical center line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-white/20 via-white/30 to-transparent -translate-x-1/2 z-0" />

          {ranksArray.map((rank, index) => {
            const p1 = t1Players[index];
            const p2 = t2Players[index];

            return (
              <div
                key={rank}
                className="relative flex w-full items-stretch justify-between bg-black/20 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden group hover:scale-[1.01] hover:border-white/20 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] z-10 hover:z-20 hover:bg-black/40"
              >
                {/* Glossy Top Edge Highlight */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20" />

                {/* --- TEAM 1 (LEFT SIDE) --- */}
                <div
                  className={`w-1/2 flex flex-row items-center py-3 px-2 sm:px-4 relative transition-colors min-w-0 ${t1Styles.bgGradient}`}
                >
                  {p1 ? (
                    <>
                      <div
                        className={`w-12 h-12 rounded-full overflow-hidden border-[2px] sm:border-[2.5px] shrink-0 ${t1Styles.ring}`}
                        style={{ background: t1Styles.avatarBg }}
                      >
                        <img
                          src={getFaceCropUrl(p1.image)}
                          alt={p1.username}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* TEXT CONTAINER WITH min-w-0 FOR PROPER TRUNCATION */}
                      <div className="ml-2 sm:ml-4 flex-1 min-w-0 pr-5 sm:pr-8">
                        <p className="text-[9px] sm:text-sm font-bold text-white uppercase tracking-wider truncate mb-0.5 sm:mb-1 drop-shadow-md">
                          {(p1.username || "").split(" ")[0]}
                        </p>
                        <p className="text-[8px] mt-1 sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/10 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 rounded-md inline-block border border-white/5 truncate max-w-full">
                          <span className={`mr-1 text-xs sm:text-sm ${t1Styles.points}`}>
                            {p1.wins || 0}
                          </span>
                          WINS{" "}
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-widest px-2 truncate min-w-0">
                      Pending Intel
                    </span>
                  )}
                </div>

                {/* --- CENTER RANK BADGE --- */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 rounded-full backdrop-blur-xl bg-black/30 border border-white/5 z-30 group-hover:scale-110 transition-transform duration-300">
                  {getMedalBadge(rank)}
                </div>

                {/* --- TEAM 2 (RIGHT SIDE) --- */}
                {team2 && (
                  <div
                    className={`w-1/2 flex flex-row-reverse items-center py-3 px-2 sm:px-4 relative transition-colors min-w-0 ${t2Styles.bgGradient}`}
                  >
                    {p2 ? (
                      <>
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-[2px] sm:border-[2.5px] shrink-0 ${t2Styles.ring}`}
                          style={{ background: t2Styles.avatarBg }}
                        >
                          <img
                            src={getFaceCropUrl(p2.image)}
                            alt={p2.username}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* TEXT CONTAINER WITH min-w-0 FOR PROPER TRUNCATION */}
                        <div className="mr-2 sm:mr-4 text-right flex-1 min-w-0 pl-5 sm:pl-8">
                          <p className="text-[9px] sm:text-sm font-bold text-white uppercase tracking-wider truncate mb-0.5 sm:mb-1 drop-shadow-md">
                            {(p2.username || "").split(" ")[0]}
                          </p>
                          <p className="text-[8px] mt-1 sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/10 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 rounded-md inline-block border border-white/5 truncate max-w-full">
                            <span className={`mr-1 text-xs sm:text-sm ${t2Styles.points}`}>
                              {p2.wins || 0}
                            </span>{" "}
                            WINS
                          </p>
                        </div>
                      </>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-widest px-2 truncate min-w-0">
                        Pending Intel
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}