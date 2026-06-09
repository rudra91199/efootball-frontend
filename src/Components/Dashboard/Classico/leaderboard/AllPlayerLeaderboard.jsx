import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../axios";
import { useParams } from "react-router";
import { Trophy, Medal, Globe, Crown, Shield, Swords } from "lucide-react";
import { getFaceCropUrl } from "../../../../Utils/utils";
import AuthLoader from "../../../Loaders/AuthLoader";

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
      auraRight: "bg-gradient-to-r from-[#cfb53b]/15 to-transparent",
      auraLeft: "bg-gradient-to-l from-[#cfb53b]/15 to-transparent",
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
      auraRight:
        "bg-gradient-to-r from-[#a50044]/20 via-[#004d98]/5 to-transparent",
      auraLeft:
        "bg-gradient-to-l from-[#a50044]/20 via-[#004d98]/5 to-transparent",
    };
  }
  if (name.includes("seven blades")) {
    return {
      abb: "SBB", // Seven Blades Bloodshed
      primaryHex: "#ef4444",
      panelBg:
        "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[rgb(161,161,162)]/10",
      headerBg: "bg-black/50",
      cardBg: "bg-black/60",
      statsBg: "bg-black/70",
      gradientText: "from-[#e4e4e7] via-[#dc2626] to-[#e4e4e7]",
      border: "border-[#a1a1aa] shadow-[0_0_20px_rgba(220,38,38,0.2)]",
      activeBorder: "border-[#dc2626] shadow-[0_0_15px_rgba(220,38,38,0.4)]",
      badge: "bg-gradient-to-br from-[#27272a] to-[#991b1b] text-white",
      accentText: "text-[#ef4444]",
      normalText: "text-white drop-shadow-md",
      mutedText: "text-gray-300",
      avatarBorder:
        "border-t-[#a1a1aa]/70 border-l-[#a1a1aa]/70 border-b-[#dc2626]/50 border-r-[#dc2626]/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]",
      shadow: "shadow-[0px_0px_rgba(220,38,38,0.5)]",
      rowBg: "bg-gradient-to-r from-[rgb(161,161,162)]/20 to-[#991b1b]/10",
      auraRight: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[#991b1b]/20",
      auraLeft: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[#991b1b]/20",
    };
  }
  if (name.includes("surya sen")) {
    return {
      abb: "SSB", // Surya Sen Bloodline
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
      auraRight: "bg-gradient-to-r from-[#b08d5c]/15 to-transparent",
      auraLeft: "bg-gradient-to-l from-[#b08d5c]/15 to-transparent",
    };
  }

  // Default Fallback Theme
  return {
    abb: abb,
    primaryHex: "#60a5fa",
    panelBg: "bg-[#0a0b10]/90",
    headerBg: "bg-black/20",
    cardBg: "bg-[#0a0b10]/80",
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

const GlobalLeaderboard = ({ tab }) => {
  const { tournamentId } = useParams();

  const { data: { data: { data } = {} } = {}, isLoading } = useQuery({
    queryKey: ["global-leaderboard", tab, tournamentId],
    queryFn: () => {
      return API.get(`/massacre/overall-leaderboard-global/${tournamentId}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  if (isLoading) {
    return <AuthLoader />;
  }

  // ==========================================
  // PROFESSIONAL SORTING LOGIC
  // ==========================================
  const sortedData = data
    ? [...data].sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
      })
    : [];

  // Safely extract top 3 for podium, but keep sortedData intact for the full roster
  const topPlayers = sortedData.slice(0, 3);

  // Helper for Podium Rank Icons
  const getPodiumIcon = (rank) => {
    switch (rank) {
      case 1:
        return (
          <Crown className="w-8 h-8 text-[#eab308] drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
        );
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Shield className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank, theme) => {
    if (rank === 1)
      return (
        <div className="w-10 h-10 rounded-[12px] bg-yellow-500/20 border border-yellow-500 text-yellow-400 flex items-center justify-center font-black shadow-[0_0_15px_rgba(234,179,8,0.4)]">
          1
        </div>
      );
    if (rank === 2)
      return (
        <div className="w-10 h-10 rounded-[12px] bg-slate-400/20 border border-slate-400 text-slate-300 flex items-center justify-center font-black">
          2
        </div>
      );
    if (rank === 3)
      return (
        <div className="w-10 h-10 rounded-[12px] bg-amber-600/20 border border-amber-600 text-amber-500 flex items-center justify-center font-black">
          3
        </div>
      );
    return (
      <div
        className={`w-10 h-10 rounded-[12px] bg-black/60 border ${theme.border} ${theme.mutedText} flex items-center justify-center font-black text-base`}
      >
        #{rank}
      </div>
    );
  };

  return (
    <div className="space-y-10 pb-12 font-sans relative z-10 max-w-5xl mx-auto">
 

      {/* --- THE PODIUM (Top 3) --- */}
      {/* FIX APPLIED: Using w-1/3 ensures strict, equal widths for all three podium pillars 
        so the center player cannot stretch and crush the outer players.
      */}
      {topPlayers.length > 0 && (
        <div className="relative flex justify-center items-end pt-16 px-1 sm:px-2 max-w-4xl mx-auto">
          {/* 2nd Place (Left) */}
          {topPlayers[1] &&
            (() => {
              const pTheme = getTeamTheme(topPlayers[1].team);
              return ( 
                <div className="w-1/3 flex flex-col items-center order-1 z-10 hover:-translate-y-2 transition-transform duration-300">
                  <div className="relative mb-3">
                    <div
                      className="absolute inset-0 opacity-40 blur-xl rounded-full"
                      style={{ backgroundColor: pTheme.primaryHex }}
                    />
                    <div
                      className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden object-cover border-[3px] shadow-2xl bg-black relative z-10 ${pTheme.avatarBorder}`}
                    >
                      <img
                        src={getFaceCropUrl(topPlayers[1].image)}
                        alt={topPlayers[1].username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                      {getPodiumIcon(2)}
                    </div>
                  </div>
                  <div
                    className={`w-full h-[12rem] sm:h-52 ${pTheme.panelBg} ${pTheme.shadow} border-t-2 border-l border-r ${pTheme.border} rounded-tl-[24px] sm:rounded-tl-[32px] flex flex-col items-center pt-5 sm:pt-6 px-2 sm:px-3 text-center backdrop-blur-2xl relative overflow-hidden`}
                  >
                    <div
                      className={`absolute inset-0 opacity-30 pointer-events-none z-0 ${pTheme.rowBg}`}
                    />
                    <p
                      className={`text-[10px] sm:text-sm font-black truncate w-full mb-1 relative z-10 ${pTheme.normalText}`}
                    >
                      {topPlayers[1].inGameUserName || topPlayers[1].username}
                    </p>
                    <p
                      className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mb-2 relative z-10 ${pTheme.mutedText}`}
                    >
                      {pTheme.abb}
                    </p>
                    <p
                      className={`text-2xl sm:text-4xl font-black relative z-10 ${pTheme.accentText}`}
                    >
                      {topPlayers[1].wins}{" "}
                      <span
                        className={`text-[8px] sm:text-[9px] uppercase tracking-widest block -mt-1 ${pTheme.mutedText}`}
                      >
                        Wins
                      </span>
                    </p>
                  </div>
                </div>
              );
            })()}

          {/* 1st Place (Center) */}
          {topPlayers[0] &&
            (() => {
              const pTheme = getTeamTheme(topPlayers[0].team);
              return (
                <div className="w-1/3 flex flex-col items-center order-2 z-20 hover:-translate-y-3 transition-transform duration-300 -mx-1 sm:-mx-3">
                  <div className="relative mb-4">
                    <div
                      className="absolute inset-0 opacity-50 blur-2xl rounded-full animate-pulse"
                      style={{ backgroundColor: pTheme.primaryHex }}
                    />
                    <div
                      className={`w-16 h-16 sm:w-28 sm:h-28 rounded-full overflow-hidden object-cover border-[4px] shadow-2xl bg-black relative z-10 ${pTheme.activeBorder}`}
                    >
                      <img
                        src={getFaceCropUrl(topPlayers[0].image)}
                        alt={topPlayers[0].username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
                      {getPodiumIcon(1)}
                    </div>
                  </div>
                  <div
                    className={`w-full h-[15rem] sm:h-64 ${pTheme.panelBg} ${pTheme.shadow} border-t-[3px] border-l-2 border-r-2 ${pTheme.border} rounded-t-[24px] sm:rounded-t-[32px] flex flex-col items-center pt-6 sm:pt-8 px-2 sm:px-4 text-center backdrop-blur-2xl relative overflow-hidden`}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
                    <div
                      className={`absolute inset-0 opacity-40 pointer-events-none z-0 ${pTheme.rowBg}`}
                    />
                    <p
                      className={`text-[11px] sm:text-base font-black truncate w-full mb-1 drop-shadow-md relative z-10 ${pTheme.normalText}`}
                    >
                      {topPlayers[0].inGameUserName || topPlayers[0].username}
                    </p>
                    <p
                      className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded-lg border border-white/10 mb-3 truncate w-fit mx-auto relative z-10 ${pTheme.mutedText}`}
                    >
                      {pTheme.abb}
                    </p>
                    <p
                      className={`text-4xl sm:text-6xl font-black relative z-10 drop-shadow-[0_0_15px_currentColor] ${pTheme.accentText}`}
                    >
                      {topPlayers[0].wins}
                    </p>
                    <p
                      className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mt-1 relative z-10 ${pTheme.mutedText}`}
                    >
                      Wins
                    </p>
                  </div>
                </div>
              );
            })()}

          {/* 3rd Place (Right) */}
          {topPlayers[2] &&
            (() => {
              const pTheme = getTeamTheme(topPlayers[2].team);
              return (
                <div className="w-1/3 flex flex-col items-center order-3 z-10 hover:-translate-y-2 transition-transform duration-300">
                  <div className="relative mb-2">
                    <div
                      className="absolute inset-0 opacity-40 blur-xl rounded-full"
                      style={{ backgroundColor: pTheme.primaryHex }}
                    />
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden object-cover border-[3px] shadow-2xl bg-black relative z-10 ${pTheme.avatarBorder}`}
                    >
                      <img
                        src={getFaceCropUrl(topPlayers[2].image)}
                        alt={topPlayers[2].username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      {getPodiumIcon(3)}
                    </div>
                  </div>
                  <div
                    className={`w-full h-[10rem] sm:h-44 ${pTheme.panelBg} ${pTheme.shadow} border-t-2 border-l border-r ${pTheme.border} rounded-tr-[24px] sm:rounded-tr-[32px] flex flex-col items-center pt-4 sm:pt-5 px-2 sm:px-3 text-center backdrop-blur-2xl relative overflow-hidden`}
                  >
                    <div
                      className={`absolute inset-0 opacity-30 pointer-events-none z-0 ${pTheme.rowBg}`}
                    />
                    <p
                      className={`text-[9px] sm:text-xs font-black truncate w-full mb-1 relative z-10 ${pTheme.normalText}`}
                    >
                      {topPlayers[2].inGameUserName || topPlayers[2].username}
                    </p>
                    <p
                      className={`text-[8px] font-bold uppercase tracking-widest mb-1 relative z-10 ${pTheme.mutedText}`}
                    >
                      {pTheme.abb}
                    </p>
                    <p
                      className={`text-xl sm:text-3xl font-black relative z-10 ${pTheme.accentText}`}
                    >
                      {topPlayers[2].wins}{" "}
                      <span
                        className={`text-[7px] sm:text-[9px] uppercase tracking-widest block -mt-1 ${pTheme.mutedText}`}
                      >
                        Wins
                      </span>
                    </p>
                  </div>
                </div>
              );
            })()}
        </div>
      )}

      {/* --- FULL ROSTER LIST --- */}
      {sortedData.length > 0 && (
        <div className="w-full flex flex-col bg-[#0a0b10]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] mt-4">
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-white/5 bg-black/40 shadow-inner flex items-center gap-3">
            <Swords className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest">
              Full Rankings
            </h3>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {sortedData.map((player, index) => {
              const rank = index + 1;
              const tStyle = getTeamTheme(player.team);
              const isRank1 = rank === 1;

              return (
                <div
                  key={index}
                  className={`relative rounded-[24px] p-4 flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 transition-all duration-300 hover:scale-[1.01] group border ${isRank1 ? tStyle.activeBorder : `border-white/5 hover:border-white/15`} ${tStyle.cardBg}`}
                >
                  {/* Thematic Aura Background */}
                  <div
                    className={`absolute inset-0 pointer-events-none opacity-30 z-0 rounded-[24px] ${tStyle.rowBg}`}
                  />

                  {/* --- LEFT: Rank, Avatar, Name --- */}
                  <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0 relative z-10">
                    {/* Rank Badge */}
                    <div className="shrink-0">{getRankBadge(rank, tStyle)}</div>

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] overflow-hidden border-[2px] shadow-xl bg-black transition-transform group-hover:scale-105 ${isRank1 ? tStyle.avatarBorder : "border-white/10"}`}
                      >
                        <img
                          src={getFaceCropUrl(player.image)}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-black rounded-full border border-white/10 p-0.5 shadow-md">
                        <img
                          src={player.logo || "/placeholder.svg"}
                          alt={player.team}
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-black text-base sm:text-xl truncate transition-colors uppercase tracking-wider ${isRank1 ? tStyle.accentText : tStyle.normalText}`}
                      >
                        {player.inGameUserName || player.username}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] sm:text-xs truncate ${tStyle.mutedText}`}
                        >
                          {player.name}
                        </span>
                        <span
                          className={`w-fit text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-md shadow-inner uppercase font-black tracking-[0.15em] ${tStyle.badge}`}
                        >
                          {tStyle.abb}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* --- RIGHT: Stats Grid --- */}
                  <div
                    className={`relative z-10 grid grid-cols-6 gap-2 sm:gap-3 ${tStyle.statsBg} border border-white/5 rounded-xl p-3 text-center items-center shrink-0 shadow-inner`}
                  >
                    <div className="flex flex-col items-center border-r border-white/5 sm:pr-2">
                      <span
                        className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                      >
                        MP
                      </span>
                      <span
                        className={`font-black text-xs sm:text-base ${tStyle.normalText}`}
                      >
                        {player.mp || player.wins + player.losses}
                      </span>
                    </div>
                    <div className="flex flex-col items-center border-r border-white/5 sm:pr-2">
                      <span
                        className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                      >
                        W
                      </span>
                      <span className="font-black text-xs sm:text-base text-emerald-400">
                        {player.wins}
                      </span>
                    </div>
                    <div className="flex flex-col items-center border-r border-white/5 sm:pr-2">
                      <span
                        className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                      >
                        L
                      </span>
                      <span className="font-black text-xs sm:text-base text-red-400">
                        {player.losses}
                      </span>
                    </div>
                    <div className="flex flex-col items-center border-r border-white/5 sm:pr-2">
                      <span
                        className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                      >
                        GF
                      </span>
                      <span
                        className={`font-black text-xs sm:text-base ${tStyle.normalText}`}
                      >
                        {player.gf}
                      </span>
                    </div>
                    <div className="flex flex-col items-center border-r border-white/5 sm:pr-2">
                      <span
                        className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                      >
                        GA
                      </span>
                      <span
                        className={`font-black text-xs sm:text-base ${tStyle.normalText}`}
                      >
                        {player.ga}
                      </span>
                    </div>
                    <div className="flex flex-col items-center sm:pr-1">
                      <span
                        className={`text-[8px] sm:text-[9px] ${tStyle.mutedText} font-black uppercase tracking-widest mb-0.5`}
                      >
                        GD
                      </span>
                      <span className="font-black text-xs sm:text-base text-cyan-400">
                        {player.gd > 0 ? `+${player.gd}` : player.gd}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State Fallback */}
      {sortedData?.length === 0 && (
        <div className="bg-[#0a0a0c]/80 backdrop-blur-2xl p-12 rounded-[32px] text-center flex flex-col items-center justify-center border border-white/5 shadow-2xl">
          <Trophy className="w-16 h-16 text-gray-700 mb-5" />
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-base">
            No rankings available yet
          </p>
          <p className="text-gray-600 text-xs sm:text-sm mt-2 uppercase tracking-widest">
            Awaiting match results to construct the leaderboard.
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobalLeaderboard;
