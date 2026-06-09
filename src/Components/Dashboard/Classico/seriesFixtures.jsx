import { useState } from "react";
import { Trophy, ChevronDown, ChevronUp, Swords, ShieldAlert, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { getFaceCropUrl } from "../../../Utils/utils";
import PlayerProfileModal from "../PlayerProfileModal";
import AuthLoader from "../../Loaders/AuthLoader";

export default function SeriesFixtures({ phase2Series, tournament, theme = {} }) {
  const [expandedSeries, setExpandedSeries] = useState({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [opponentPlayerId, setOpponentPlayerId] = useState(null);

  const extractId = (val) => val?._id || val?.$oid || val;

  const openPlayerProfile = (p1, p2) => {
    const pId = extractId(p1);
    const oId = extractId(p2);
    if (!pId) return;
    setSelectedPlayerId(pId);
    setOpponentPlayerId(oId);
    setIsProfileModalOpen(true);
  };

  const {
    data: { data: { data: knockout } = {} } = {},
    isLoading: isKnockoutLoading,
  } = useQuery({
    queryKey: ["seriesStage-knockout", phase2Series?.stageData?._id],
    queryFn: () =>
      API.get(`/knockouts/${phase2Series?.stageData._id}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      }),
    enabled: !!phase2Series?.stageData?._id,
  });

  const toggleSeries = (seriesId) => {
    setExpandedSeries((prev) => ({ ...prev, [seriesId]: !prev[seriesId] }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return { text: "text-gray-500", bg: "bg-black", border: "border-gray-800" };
      case "Live":
        return { text: "text-red-500", bg: "bg-red-500/10", border: "border-red-500", extra: "animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]" };
      case "Upcoming":
        return { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/50" };
      default:
        return { text: "text-gray-500", bg: "bg-gray-900", border: "border-gray-700" };
    }
  };

  const getPlayerTeam = (player) => {
    if (!tournament?.teams || !player) return null;
    const targetId = String(player._id || player.$oid || player);
    const team = tournament.teams.find((t) => t.players?.some((p) => String(p._id || p.$oid || p) === targetId));
    return team?.name;
  };

  // --- DYNAMIC COMBAT THEME ENGINE (Team Based) ---
  const getTeamStyles = (teamName, side) => {
    const normalizedName = teamName?.toLowerCase()?.trim() || "";

    if (normalizedName.includes("real madrid") || normalizedName === "rma") {
      return {
        primary: "#cfb53b",
        label: "RMA",
        avatarBg: "linear-gradient(to bottom, rgba(207,181,59,0.8), #050505)",
        bgGradient: side === "left"
          ? "linear-gradient(to right, rgba(207,181,59,0.3) 0%, transparent 100%)"
          : "linear-gradient(to left, rgba(207,181,59,0.3) 0%, transparent 100%)",
      };
    }
    if (normalizedName.includes("barca") || normalizedName.includes("fc barcelona")) {
      return {
        primary: "#edbb00",
        borderOverride: "#a50044", 
        label: "FCB",
        avatarBg: "linear-gradient(135deg, rgba(165,0,68,0.9), #080b1f, #004d98)",
        bgGradient: side === "left"
          ? "linear-gradient(to right, rgba(165,0,68,0.4) 0%, transparent 100%)"
          : "linear-gradient(to left, rgba(165,0,68,0.4) 0%, transparent 100%)",
      };
    }
    if (normalizedName.includes("seven blades")) {
      return {
        primary: "#dc143c", // Crimson
        label: "SBB",
        avatarBg: "linear-gradient(to bottom, rgba(220,20,60,0.5), #050505)",
        bgGradient: side === "left"
          ? "linear-gradient(to right, rgba(220,20,60,0.35) 0%, transparent 100%)"
          : "linear-gradient(to left, rgba(220,20,60,0.35) 0%, transparent 100%)",
      };
    }
    if (normalizedName.includes("surya sen")) {
      return {
        primary: "#5eb89e", // Teal
        label: "SBFC",
        avatarBg: "linear-gradient(to bottom, rgba(94,184,158,0.5), #0a0e17)",
        bgGradient: side === "left"
          ? "linear-gradient(to right, rgba(45,64,70) 0%, transparent 100%)"
          : "linear-gradient(to left, rgba(45,64,70,0.6) 0%, transparent 100%)",
      };
    }

    // Neutral/Fallback
    return {
      primary: "#9ca3af",
      label: teamName ? teamName.substring(0, 3).toUpperCase() : "TBD",
      avatarBg: "linear-gradient(to bottom, rgba(75,85,99,0.8), #000000)",
      bgGradient: side === "left"
        ? "linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 100%)"
        : "linear-gradient(to left, rgba(255,255,255,0.1) 0%, transparent 100%)",
    };
  };

  if (isKnockoutLoading) return <AuthLoader />;

  return (
    <div className="space-y-6 font-sans animate-fade-in pb-10">
      
      {/* --- ARENA STAGE HEADER --- */}
      <div className={`relative ${theme.panelBg || "bg-[#050505]"} border-y-2 border-white/20 py-4 px-4 sm:px-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden`}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
        
        <div className="relative flex items-center justify-between z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black border border-white/10 rounded-2xl shadow-[4px_0_0_rgba(255,255,255,0.2)]">
              <Swords className={`w-6 h-6  ${theme.accentText || "text-gray-300"}`} />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-widest italic drop-shadow-lg">
                {knockout?.name?.split(" ").slice(2, 4).join(" ") || "The Series"}
              </h2>
              <p className={`text-[10px] sm:text-xs mt-0.5 uppercase tracking-[0.2em] font-black ${theme.accentText || "text-gray-400"}`}>
                Match Format: Best Of {knockout?.rounds?.[0]?.series?.[0]?.bestOf || 3}
              </p>
            </div>
          </div>
          <Zap className="w-8 h-8 text-white/5 opacity-50 absolute right-4" />
        </div>
      </div>

      {/* --- SERIES BATTLECARDS --- */}
      <div className="space-y-6 max-w-5xl mx-auto">
        {knockout?.rounds?.[0]?.series?.map((series) => {
          const isExpanded = expandedSeries[series._id];
          
          const isSeriesCompleted = series.status === "Completed";
          const isP1Winner = isSeriesCompleted && series.player1_wins > series.player2_wins;
          const isP2Winner = isSeriesCompleted && series.player2_wins > series.player1_wins;

          const t1Styles = getTeamStyles(getPlayerTeam(series.player1), "left");
          const t2Styles = getTeamStyles(getPlayerTeam(series.player2), "right");
          const statusStyle = getStatusStyle(series.status);

          // Dim the loser slightly if series is over
          const p1Opacity = (isSeriesCompleted && !isP1Winner) ? "opacity-50 grayscale" : "opacity-100";
          const p2Opacity = (isSeriesCompleted && !isP2Winner) ? "opacity-50 grayscale" : "opacity-100";

          return (
            <div key={series._id} className="relative group">
              
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm group-hover:via-white/10 transition-all duration-500" />
              
              {/* MAIN VS CARD */}
              <button
                onClick={() => toggleSeries(series._id)}
                className="w-full relative bg-[#0a0a0c] border border-white/10 overflow-hidden outline-none hover:border-white/20 transition-all shadow-2xl"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
              >
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-white/10" style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />

                {/* Team Background Gradients */}
                <div className="absolute top-0 left-0 w-1/2 h-full pointer-events-none opacity-60" style={{ background: t1Styles.bgGradient }} />
                <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-60" style={{ background: t2Styles.bgGradient }} />
                
                {/* Center Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-0" />

                {/* Header Bar */}
                <div className="relative flex items-center justify-between bg-black/50 border-b border-white/5 px-3 sm:px-5 py-2 z-10 backdrop-blur-sm">
                  <h3 className="text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] italic">
                    {series.roundName}
                  </h3>
                  <span className={`px-3 py-0.5 text-[9px] font-black uppercase tracking-widest border transform -skew-x-12 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} ${statusStyle.extra || ""}`}>
                    <span className="block transform skew-x-12">{series.status}</span>
                  </span>
                </div>

                {/* THE FIGHTERS (Face-off Layout) */}
                <div className="relative flex items-stretch justify-between w-full p-4 sm:p-6 z-10 overflow-hidden">
                  
                  {/* P1 SIDE */}
                  <div className={`flex flex-col items-center justify-end w-[35%] sm:w-[30%] ${p1Opacity}`}>
                    <div 
                      onClick={(e) => { e.stopPropagation(); openPlayerProfile(series.player1, series.player2); }}
                      className="relative cursor-pointer z-10 hover:scale-105 transition-transform"
                    >
                      {/* Fighter Portrait with Vibrant Avatar Background */}
                      <div 
                        className="w-16 h-20 sm:w-24 sm:h-28 overflow-hidden rounded-md border-b-4 shadow-md"
                        style={{ 
                          borderColor: isP1Winner ? (t1Styles.borderOverride || t1Styles.primary) : 'rgba(255,255,255,0.2)', 
                          boxShadow: isP1Winner ? `0 10px 20px ${t1Styles.primary}30` : 'none',
                          background: t1Styles.avatarBg 
                        }}
                      >
                        <img
                          src={getFaceCropUrl(series.player1?.image?.url)}
                          alt={series.player1?.name}
                          className="w-full h-full object-cover hover:opacity-100  hover:mix-blend-normal transition-all"
                        />
                      </div>
                      {isP1Winner && (
                        <div className="absolute -top-3 -left-3 bg-black border-2 rounded-md p-1.5 transform rotate-12 z-20" style={{ borderColor: t1Styles.primary }}>
                          <Trophy className="w-4 h-4" color={t1Styles.primary} />
                        </div>
                      )}
                    </div>
                    {/* Fighter Nameplate & Abbreviated Team Badge */}
                    <div className="mt-3 w-full text-center flex flex-col items-center">
                      <p className="text-[11px] sm:text-sm font-black uppercase tracking-wider text-white italic truncate drop-shadow-md w-full">
                        {series.player1?.inGameUserName}
                      </p>
                      <p 
                        className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest mt-1 px-3 py-0.5 rounded shadow-lg backdrop-blur-sm border"
                        style={{ color: t1Styles.primary, backgroundColor: `${t1Styles.primary}20`, borderColor: `${t1Styles.primary}40` }}
                      >
                        {t1Styles.label}
                      </p>
                    </div>
                  </div>

                  {/* CENTER VS & SCOREBOARD */}
                  <div className="flex flex-col items-center justify-center w-[30%] sm:w-[40%] z-20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-8xl font-black text-white/5 italic select-none pointer-events-none transform -skew-x-12 z-0">
                      VS
                    </div>

                    {/* Score Block */}
                    <div className="flex items-center justify-center bg-black/80 border-y-2 border-white/20 transform -skew-x-12 px-4 sm:px-8 py-2 sm:py-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] z-10 backdrop-blur-sm">
                      <div className="transform skew-x-12 flex items-center gap-3 sm:gap-6">
                        <span className="text-3xl sm:text-5xl font-black leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ color: isP1Winner ? t1Styles.primary : 'white' }}>
                          {series.player1_wins ?? 0}
                        </span>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-600 rotate-45" />
                        <span className="text-3xl sm:text-5xl font-black leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ color: isP2Winner ? t2Styles.primary : 'white' }}>
                          {series.player2_wins ?? 0}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-1 bg-black border border-white/10 rounded-sm shadow-md">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                    </div>
                  </div>

                  {/* P2 SIDE */}
                  <div className={`flex flex-col items-center justify-end w-[35%] sm:w-[30%] ${p2Opacity}`}>
                    <div 
                      onClick={(e) => { e.stopPropagation(); openPlayerProfile(series.player2, series.player1); }}
                      className="relative cursor-pointer z-10 hover:scale-105 transition-transform"
                    >
                      {/* Fighter Portrait with Vibrant Avatar Background */}
                      <div 
                        className="w-16 h-20 sm:w-24 sm:h-28 overflow-hidden border-b-4 rounded-md shadow-2xl"
                        style={{ 
                          borderColor: isP2Winner ? (t2Styles.borderOverride || t2Styles.primary) : 'rgba(255,255,255,0.2)', 
                          boxShadow: isP2Winner ? `0 10px 20px ${t2Styles.primary}30` : 'none',
                          background: t2Styles.avatarBg 
                        }}
                      >
                        <img
                          src={getFaceCropUrl(series.player2?.image?.url)}
                          alt={series.player2?.name}
                          className="w-full h-full object-cover transition-all transform scale-x-[-1]"
                        />
                      </div>
                      {isP2Winner && (
                        <div className="absolute -top-3 -right-3 bg-black border-2 rounded-none p-1.5 transform -rotate-12 z-20" style={{ borderColor: t2Styles.primary }}>
                          <Trophy className="w-4 h-4" color={t2Styles.primary} />
                        </div>
                      )}
                    </div>
                    {/* Fighter Nameplate & Abbreviated Team Badge */}
                    <div className="mt-3 w-full text-center flex flex-col items-center">
                      <p className="text-[11px] sm:text-sm font-black uppercase tracking-wider text-white italic truncate drop-shadow-md w-full">
                        {series.player2?.inGameUserName}
                      </p>
                      <p 
                        className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest mt-1 px-3 py-0.5 rounded shadow-lg backdrop-blur-sm border"
                        style={{ color: t2Styles.primary, backgroundColor: `${t2Styles.primary}20`, borderColor: `${t2Styles.primary}40` }}
                      >
                        {t2Styles.label}
                      </p>
                    </div>
                  </div>

                </div>
              </button>

              {/* ========================================== */}
              {/* BATTLE LOGS (Expanded Fixtures)              */}
              {/* ========================================== */}
              {isExpanded && (
                <div className="bg-[#050508] border-t border-white/5 p-2 sm:p-4 space-y-2 relative z-0">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <div className="w-1 h-3 bg-white/20" />
                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Combat Logs</h4>
                  </div>
                  
                  {series.matches?.length === 0 ? (
                    <div className="text-center py-6 bg-black border border-white/5 flex flex-col items-center">
                      <ShieldAlert className="w-6 h-6 text-gray-600 mb-2" />
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No Combat Data Available</p>
                    </div>
                  ) : (
                    series.matches?.map((match, idx) => {
                      const isCompleted = match.status === "Completed";
                      const p1Won = isCompleted && match.winner?._id === match.team1?._id;
                      const p2Won = isCompleted && match.winner?._id === match.team2?._id;
                      const isDraw = isCompleted && !match.winner;

                      const mP1Styles = getTeamStyles(getPlayerTeam(match.team1) || getPlayerTeam(series.player1), "left");
                      const mP2Styles = getTeamStyles(getPlayerTeam(match.team2) || getPlayerTeam(series.player2), "right");

                      return (
                        <div
                          key={match._id}
                          className="flex items-stretch bg-black border border-white/5 hover:border-white/20 transition-colors group/match"
                        >
                          {/* Fixture Index Block */}
                          <div className="bg-white/5 w-10 sm:w-12 flex flex-col items-center justify-center shrink-0 border-r border-white/5">
                             <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest transform -rotate-90">FIX</span>
                             <span className="text-sm sm:text-base font-black text-white">{String(idx + 1).padStart(2, '0')}</span>
                          </div>

                          {/* Match Result Data */}
                          <div className="flex-1 flex items-center justify-between p-2 sm:p-3 min-w-0">
                            
                            {/* P1 Entry */}
                            <div className={`flex items-center gap-2 flex-1 min-w-0 ${(isCompleted && !p1Won && !isDraw) ? "opacity-50 grayscale" : ""}`}>
                              <div className="w-1 h-full py-2 bg-gray-800" style={{ backgroundColor: p1Won ? mP1Styles.primary : '' }} />
                              <span className="text-[10px] sm:text-xs font-black uppercase italic truncate" style={{ color: p1Won ? mP1Styles.primary : '#9ca3af' }}>
                                {match.team1?.inGameUserName || series.player1?.inGameUserName}
                              </span>
                              {p1Won && <span className="text-[8px]">WIN</span>}
                            </div>

                            {/* Score Diamond */}
                            <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 shrink-0 bg-[#0a0a0c] py-1 border-x border-white/5 mx-2 transform -skew-x-12">
                              {isCompleted ? (
                                 <div className="transform skew-x-12 flex items-center gap-2">
                                    <span className="text-sm sm:text-base font-black" style={{ color: p1Won ? mP1Styles.primary : 'white' }}>{match.team1_score ?? '-'}</span>
                                    <span className="text-gray-700 text-[10px] font-black">:</span>
                                    <span className="text-sm sm:text-base font-black" style={{ color: p2Won ? mP2Styles.primary : 'white' }}>{match.team2_score ?? '-'}</span>
                                 </div>
                              ) : (
                                 <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest transform skew-x-12">VS</span>
                              )}
                            </div>

                            {/* P2 Entry */}
                            <div className={`flex items-center justify-end gap-2 flex-1 min-w-0 ${(isCompleted && !p2Won && !isDraw) ? "opacity-50 grayscale" : ""}`}>
                              {p2Won && <span className="text-[8px]">WIN</span>}
                              <span className="text-[10px] sm:text-xs font-black uppercase italic truncate text-right" style={{ color: p2Won ? mP2Styles.primary : '#9ca3af' }}>
                                {match.team2?.inGameUserName || series.player2?.inGameUserName}
                              </span>
                              <div className="w-1 h-full py-2 bg-gray-800" style={{ backgroundColor: p2Won ? mP2Styles.primary : '' }} />
                            </div>

                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <PlayerProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        userId={selectedPlayerId} 
        opponentId={opponentPlayerId} 
      />
    </div>
  );
}