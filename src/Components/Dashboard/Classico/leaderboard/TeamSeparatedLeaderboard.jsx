import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Crown, Swords } from "lucide-react";
import { API } from "../../../../axios";
import { useParams } from "react-router";
import AuthLoader from "../../../Loaders/AuthLoader";
import { getFaceCropUrl } from "../../../../Utils/utils";

// ==========================================
// DYNAMIC TEAM THEME ENGINE
// ==========================================
const getTeamTheme = (teamName) => {
  const name = (teamName || "").toLowerCase().trim();

  if (name === "real madrid" || name === "rma") {
    return {
      primaryHex: "#cfb53b",
      panelBg: "bg-[#050505]/90",
      headerBg: "bg-black/20",
      cardBg: "bg-black/20",
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
      auraRight: "bg-gradient-to-r from-[#cfb53b]/15 to-transparent",
      auraLeft: "bg-gradient-to-l from-[#cfb53b]/15 to-transparent",
    };
  }
  if (name === "barca" || name === "fc barcelona" || name === "fcb") {
    return {
      primaryHex: "#edbb00",
      panelBg: "bg-[#080b1f]/90",
      headerBg: "bg-black/20",
      cardBg: "bg-black/20",
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
      rowBg: "bg-gradient-to-r from-[#a50044]/15 via-[#004d98]/5 to-transparent",
      auraRight: "bg-gradient-to-r from-[#a50044]/20 via-[#004d98]/5 to-transparent",
      auraLeft: "bg-gradient-to-l from-[#a50044]/20 via-[#004d98]/5 to-transparent",
    };
  }
  if (name.includes("seven blades")) {
    return {
      primaryHex: "#ef4444",
      panelBg: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[rgb(161,161,162)]/10",
      // Stronger dark glass to make sure white text NEVER washes out on the silver panel
      headerBg: "bg-black/50",
      cardBg: "bg-black/60",
      statsBg: "bg-black/70",
      gradientText: "from-[#e4e4e7] via-[#dc2626] to-[#e4e4e7]",
      border: "border-[#a1a1aa] shadow-[0_0_20px_rgba(220,38,38,0.2)]",
      activeBorder: "border-[#dc2626]/50 shadow-[0_0_15px_rgba(220,38,38,0.4)]",
      badge: "bg-gradient-to-br from-[#27272a] to-[#991b1b] text-white",
      accentText: "text-[#ef4444]/50",
      // Back to white text, enhanced with a drop shadow to pop over silver
      normalText: "text-white drop-shadow-md",
      mutedText: "text-gray-300",
      avatarBorder: "border-t-[#a1a1aa]/70 border-l-[#a1a1aa]/70 border-b-[#dc2626]/50 border-r-[#dc2626]/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]",
      shadow: "shadow-[0px_0px_rgba(220,38,38,0.5)]",
      rowBg: "bg-gradient-to-r from-[rgb(161,161,162)]/20 to-[#991b1b]/10",
      auraRight: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[#991b1b]/20",
      auraLeft: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[#991b1b]/20",
    };
  }
  if (name.includes("surya sen")) {
    return {
      primaryHex: "#b08d5c",
      panelBg: "bg-[#111a22]/90",
      headerBg: "bg-black/20",
      cardBg: "bg-black/20",
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
      auraRight: "bg-gradient-to-r from-[#b08d5c]/15 to-transparent",
      auraLeft: "bg-gradient-to-l from-[#b08d5c]/15 to-transparent",
    };
  }
  
  // Default Fallback Theme
  return {
    primaryHex: "#60a5fa",
    panelBg: "bg-[#0a0b10]/90",
    headerBg: "bg-black/20",
    cardBg: "bg-black/20",
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
    auraRight: "bg-gradient-to-r from-blue-500/10 to-transparent",
    auraLeft: "bg-gradient-to-l from-blue-500/10 to-transparent",
  };
};

const TeamSeparatedLeaderboard = ({ tab }) => {
  const { tournamentId } = useParams();
  
  // Mobile tab state to switch between teams without scrolling
  const [mobileActiveTeamIdx, setMobileActiveTeamIdx] = useState(0);

  const { data: { data: { data } = {} } = {}, isLoading } = useQuery({
    queryKey: ["team-separated-leaderboard", tab, tournamentId],
    queryFn: () => {
      return API.get(`/massacre/phase1-leaderboard/${tournamentId}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
  });

  if (isLoading) {
    return <AuthLoader />;
  }

  // ==========================================
  // PROFESSIONAL SORTING LOGIC
  // ==========================================
  const sortedData = data?.map((team) => {
    const sortedPlayers = [...team.players].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
    return { ...team, players: sortedPlayers };
  });

  return (
    <div className="w-full space-y-6 font-sans relative z-10">
      
      {/* ========================================== */}
      {/* MOBILE TEAM SWITCHER (Hidden on Desktop)   */}
      {/* ========================================== */}
      {sortedData && sortedData.length > 1 && (
        <div className="lg:hidden flex bg-[#0a0b10]/90 p-2 rounded-[20px] border border-white/10 backdrop-blur-2xl mb-4 sticky top-4 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          {sortedData.map((team, idx) => {
            const isActive = mobileActiveTeamIdx === idx;
            const theme = getTeamTheme(team._id);
            return (
              <button
                key={team._id}
                onClick={() => setMobileActiveTeamIdx(idx)}
                className={`flex-1 py-3 sm:py-4 rounded-[14px] font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  isActive ? "bg-white/5 shadow-lg" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
                }`}
                style={{ 
                  color: isActive ? theme.primaryHex : undefined,
                  border: isActive ? `1px solid ${theme.primaryHex}40` : '1px solid transparent'
                }}
              >
                <img src={team.teamLogo || "/placeholder.svg"} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover shadow-md" alt="logo" />
                <span className="truncate max-w-[120px]">{team._id}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* LEADERBOARD COLUMNS                        */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {sortedData?.map((team, teamIndex) => {
          const theme = getTeamTheme(team._id);
          
          // CSS trick: On mobile, hide the team if it's not the active one. On desktop (lg:), show both.
          const visibilityClass = mobileActiveTeamIdx === teamIndex ? "flex" : "hidden lg:flex";

          return (
            <div
              key={teamIndex}
              className={`${visibilityClass} flex-col ${theme.panelBg} backdrop-blur-2xl border ${theme.border} rounded-[32px] overflow-hidden ${theme.shadow} relative`}
            >
              {/* Massive Subtle Watermark Background */}
              <div className="absolute top-20 right-[-10%] w-64 h-64 opacity-[0.03] pointer-events-none z-0 blur-sm">
                <img src={team.teamLogo || "/placeholder.svg"} className="w-full h-full object-contain" alt="" />
              </div>

              {/* --- TEAM HEADER --- */}
              <div className={`relative z-10 px-6 sm:px-8 py-6 border-b border-white/5 flex items-center justify-between ${theme.headerBg}`}>
                <div className="flex items-center gap-5">
                  <div className={`p-1 bg-[#050505] rounded-full shadow-xl border-2 ${theme.avatarBorder}`}>
                    <img
                      src={team.teamLogo || "/placeholder.svg"}
                      alt={team._id}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText} drop-shadow-md`}>
                      {team._id}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Swords className={`w-3.5 h-3.5 ${theme.mutedText}`} />
                      <p className={`text-[10px] sm:text-xs ${theme.mutedText} font-black uppercase tracking-[0.2em]`}>
                        {team.players.length} Operators
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- PLAYER CARDS LIST --- */}
              <div className="relative z-10 p-4 sm:p-6 space-y-4">
                {team.players.map((player, playerIndex) => {
                  const isRank1 = playerIndex === 0;

                  return (
                    <div
                      key={playerIndex}
                      className={`relative ${theme.cardBg} rounded-[24px] p-4 sm:p-5 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01] group border ${isRank1 ? theme.activeBorder : "border-white/5 hover:border-white/15"}`}
                    >
                      {/* Aura Background */}
                      <div className={`absolute inset-0 pointer-events-none opacity-40 z-0 rounded-[24px] ${theme.rowBg}`} />
                      
                      {/* Top Row: Info & Avatar */}
                      <div className="relative z-10 flex items-center gap-4">
                        
                        {/* Rank */}
                        <div className="shrink-0 flex flex-col items-center justify-center w-8">
                          {isRank1 ? (
                            <Crown className={`w-7 h-7 ${theme.accentText} drop-shadow-lg mb-1`} />
                          ) : (
                            <span className={`text-xl font-black ${theme.mutedText} group-hover:${theme.normalText} transition-colors`}>
                              {playerIndex + 1}
                            </span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-[2px] shadow-lg bg-black transition-transform group-hover:scale-105 ${isRank1 ? theme.avatarBorder : "border-white/10"}`}>
                          <img
                            src={getFaceCropUrl(player.image)}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className={`font-black text-sm sm:text-base uppercase tracking-wide truncate transition-colors ${isRank1 ? theme.accentText : theme.normalText}`}>
                            {player.inGameUserName || player.username}
                          </div>
                          <div className={`w-fit mt-1 text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-md shadow-inner uppercase font-black tracking-widest ${theme.badge}`}>
                            {player.name}
                          </div>
                        </div>

                        {/* Massive Points Display */}
                        <div className="text-right shrink-0">
                          <div className={`text-4xl sm:text-5xl font-black leading-none drop-shadow-md ${isRank1 ? theme.accentText : theme.normalText}`}>
                            {player.wins}
                          </div>
                          <div className={`text-[9px] sm:text-[10px] ${theme.mutedText} font-black uppercase tracking-[0.2em] mt-1 mr-1`}>
                            WINS
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Stats Pill Grid */}
                      <div className={`relative z-10 grid grid-cols-6 gap-2 ${theme.statsBg} border border-white/5 shadow-inner rounded-xl p-2.5 text-center items-center`}>
                        <div className="flex flex-col items-center border-r border-white/5">
                          <span className={`text-[8px] sm:text-[9px] ${theme.mutedText} font-black uppercase tracking-widest mb-0.5`}>MP</span>
                          <span className={`font-black text-xs sm:text-sm ${theme.normalText}`}>{player.wins + player.losses}</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-white/5">
                          <span className={`text-[8px] sm:text-[9px] ${theme.mutedText} font-black uppercase tracking-widest mb-0.5`}>W</span>
                          <span className="font-black text-xs sm:text-sm text-emerald-500">{player.wins}</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-white/5">
                          <span className={`text-[8px] sm:text-[9px] ${theme.mutedText} font-black uppercase tracking-widest mb-0.5`}>L</span>
                          <span className="font-black text-xs sm:text-sm text-red-500">{player.losses}</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-white/5">
                          <span className={`text-[8px] sm:text-[9px] ${theme.mutedText} font-black uppercase tracking-widest mb-0.5`}>GF</span>
                          <span className={`font-black text-xs sm:text-sm ${theme.normalText}`}>{player.gf}</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-white/5">
                          <span className={`text-[8px] sm:text-[9px] ${theme.mutedText} font-black uppercase tracking-widest mb-0.5`}>GA</span>
                          <span className={`font-black text-xs sm:text-sm ${theme.normalText}`}>{player.ga}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className={`text-[8px] sm:text-[9px] ${theme.mutedText} font-black uppercase tracking-widest mb-0.5`}>GD</span>
                          <span className="font-black text-xs sm:text-sm text-cyan-400">
                            {player.gd > 0 ? `+${player.gd}` : player.gd}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default TeamSeparatedLeaderboard;