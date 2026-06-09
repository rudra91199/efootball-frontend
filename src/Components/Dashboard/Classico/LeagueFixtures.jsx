import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Swords, AlertCircle, Crown } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { getFaceCropUrl } from "../../../Utils/utils";
import PlayerProfileModal from "../PlayerProfileModal";
import AuthLoader from "../../Loaders/AuthLoader";

export default function LeagueFixtures({
  tournament,
  phase1League,
  championshipPoints = [],
  theme = {},
}) {
  const [roundTab, setRoundTab] = useState("Active");
  const [collapsedRounds, setCollapsedRounds] = useState(new Set());
  
  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  console.log(theme)
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [opponentPlayerId, setOpponentPlayerId] = useState(null);

  const { user } = useAuthStore();

  const accentText = theme.accentText || "text-[#fefb04]";
  const panelBg = theme.panelBg || "bg-[#0a0e29]/80";

  const {
    data: { data: { data: leagueData } = {} } = {},
    isLoading: isLeagueLoading,
  } = useQuery({
    queryKey: ["classico-league", phase1League?.stageData?._id],
    queryFn: () => {
      return API.get(`/leagues/${phase1League?.stageData?._id}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
    enabled: !!phase1League?.stageData?._id,
  });

  const matchesArray = leagueData?.matches || [];
  
  // 1. Group all matches by their round name
  const rawRounds = matchesArray.reduce((acc, match) => {
    const round = match.round || "Round 1";
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(match);
    return acc;
  }, {});

  // 2. Initialize categorized buckets
  const categorizedRounds = {
    Upcoming: {},
    Active: {},
    Pending: {},
    Completed: {},
  };

  // 3. Process and categorize each round
  Object.entries(rawRounds).forEach(([roundName, matches]) => {
    const isCompleted = matches.every((m) => m.status === "Completed");
    const isUpcoming = matches.every((m) => m.status === "Unpublished");

    if (isCompleted) {
      categorizedRounds.Completed[roundName] = matches;
    } else if (isUpcoming) {
      categorizedRounds.Upcoming[roundName] = matches;
    } else {
      const matchWithDate = matches.find((m) => m.roundStartDate);
      
      if (matchWithDate && matchWithDate.roundStartDate) {
        const startDate = new Date(matchWithDate.roundStartDate).getTime();
        const now = new Date().getTime();
        const hoursPassed = (now - startDate) / (1000 * 60 * 60);

        if (hoursPassed > 24) {
          categorizedRounds.Pending[roundName] = matches;
        } else {
          categorizedRounds.Active[roundName] = matches;
        }
      } else {
        categorizedRounds.Active[roundName] = matches;
      }
    }
  });

  // Expand all rounds by default in the currently selected tab
  useEffect(() => {
    setCollapsedRounds(new Set());
  }, [roundTab]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleRoundCollapse = (round) => {
    const newCollapsed = new Set(collapsedRounds);
    if (newCollapsed.has(round)) newCollapsed.delete(round);
    else newCollapsed.add(round);
    setCollapsedRounds(newCollapsed);
  };

  const getPlayerTeam = (player) => {
    if (!tournament?.teams || !player) return null;
    const playerId = player._id || player;
    const team = tournament.teams.find((t) =>
      t.players?.some((p) => (p._id || p) === playerId),
    );
    return team?.name;
  };

  const openPlayerProfile = (clickedPlayerId, opponentId) => {
    if (!clickedPlayerId) return;
    setSelectedPlayerId(clickedPlayerId);
    setOpponentPlayerId(opponentId);
    setIsModalOpen(true);
  };

  const myTeam = tournament?.teams?.find((team) =>
    team.players?.some((player) => player._id === user?._id),
  );

  // ==========================================
  // BULLETPROOF DYNAMIC TEAM STYLES
  // ==========================================
  const getTeamStyles = (teamName) => {
    const normalizedName = teamName?.toLowerCase()?.trim() || "";

    if (normalizedName === "real madrid" || normalizedName === "rma") {
      return {
        primaryColor: "#cfb53b",
        nameColor: "#ffffff",
        avatarRing: "#ffffff",
        bgBoxLeft: "linear-gradient(to right, rgba(207,181,59,0.3) 0%, rgba(0,0,0,0) 100%)",
        bgBoxRight: "linear-gradient(to left, rgba(207,181,59,0.3) 0%, rgba(0,0,0,0) 100%)",
        avatarBg: "linear-gradient(to bottom, #cfb53b, #050505)",
      };
    }
    if (normalizedName === "barca" || normalizedName === "fc barcelona" || normalizedName === "fcb") {
      return {
        primaryColor: "#edbb00",
        nameColor: "#edbb00",
        avatarRing: "#a50044",
        bgBoxLeft: "linear-gradient(to right, rgba(165,0,68,0.4) 0%, rgba(0,0,0,0) 100%)",
        bgBoxRight: "linear-gradient(to left, rgba(165,0,68,0.4) 0%, rgba(0,0,0,0) 100%)",
        avatarBg: "linear-gradient(135deg, rgba(165,0,68,0.9), #080b1f, #004d98)",
      };
    }
    if (normalizedName.includes("seven blades")) {
      return {
        primaryColor: "hsl(348,83%,65%)",
        nameColor: "#ffffff",
        avatarRing: "#c0c0c0",
        bgBoxLeft: "linear-gradient(to right,rgb(161,161,162), rgba(220,20,60,0.35) 35%,transparent 100%)",
        bgBoxRight: "linear-gradient(to left,rgb(161,161,162), rgba(220,20,60,0.35) 35%,transparent 100%)",
        avatarBg: "linear-gradient(to bottom, #2a2a2a, #0a0a0a, #660000)",
      };
    }
    if (normalizedName.includes("surya sen")) {
      return {
        primaryColor: "#5eb89e",
        nameColor: "#f4ecd8",
        avatarRing: "#b08d5c",
        bgBoxLeft: "linear-gradient(to right, rgba(45,64,70,0.6) 0%, rgba(0,0,0,0) 100%)",
        bgBoxRight: "linear-gradient(to left, rgba(45,64,70,0.6) 0%, rgba(0,0,0,0) 100%)",
        avatarBg: "linear-gradient(to bottom, #2d4046, #9c8466, #1a2c3a)",
      };
    }

    // Default Fallback
    return {
      primaryColor: "#9ca3af",
      nameColor: "#e5e7eb",
      avatarRing: "rgba(255,255,255,0.1)",
      bgBoxLeft: "linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 100%)",
      bgBoxRight: "linear-gradient(to left, rgba(255,255,255,0.1) 0%, transparent 100%)",
      avatarBg: "linear-gradient(to bottom, rgba(49,44,133,0.8), rgba(10,14,41,0.7), #000000)",
    };
  };

  // ==========================================
  // THEME-WISE TABS & BADGES (4 Colors per Team)
  // ==========================================
  const getThemeTabColors = (teamName) => {
    const normalizedName = teamName?.toLowerCase()?.trim() || "";

    if (normalizedName === "real madrid" || normalizedName === "rma") {
      return {
        Upcoming: { text: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/30", badge: "bg-gray-500/20 text-gray-300" },
        Active: { text: "text-white", bg: "bg-white/10", border: "border-white/30", badge: "bg-white/20 text-white" },
        Pending: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30", badge: "bg-indigo-500/20 text-indigo-300" },
        Completed: { text: "text-[#cfb53b]", bg: "bg-[#cfb53b]/10", border: "border-[#cfb53b]/30", badge: "bg-[#cfb53b]/20 text-[#cfb53b]" },
      };
    }
    if (normalizedName === "fc barcelona" || normalizedName === "barca" || normalizedName === "fcb") {
      return {
        Upcoming: { text: "text-[#edbb00]", bg: "bg-[#edbb00]/10", border: "border-[#edbb00]/30", badge: "bg-[#edbb00]/20 text-[#edbb00]" },
        Active: { text: "text-blue-400", bg: "bg-[#004d98]/30", border: "border-[#004d98]/50", badge: "bg-[#004d98]/50 text-blue-200" },
        Pending: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", badge: "bg-orange-500/20 text-orange-300" },
        Completed: { text: "text-[#a50044]", bg: "bg-[#a50044]/20", border: "border-[#a50044]/40", badge: "bg-[#a50044]/30 text-rose-200" },
      };
    }
    if (normalizedName.includes("seven blades")) {
      return {
        Upcoming: { text: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/30", badge: "bg-gray-500/20 text-gray-300" },
        Active: { text: "text-[#dc143c]", bg: "bg-[#dc143c]/10", border: "border-[#dc143c]/30", badge: "bg-[#dc143c]/20 text-rose-200" },
        Pending: { text: "text-rose-600", bg: "bg-rose-900/20", border: "border-rose-900/50", badge: "bg-rose-900/40 text-rose-400" },
        Completed: { text: "text-white", bg: "bg-white/10", border: "border-white/30", badge: "bg-white/20 text-white" },
      };
    }
    if (normalizedName.includes("surya sen")) {
      return {
        Upcoming: { text: "text-[#f4ecd8]", bg: "bg-[#f4ecd8]/10", border: "border-[#f4ecd8]/30", badge: "bg-[#f4ecd8]/20 text-[#f4ecd8]" },
        Active: { text: "text-[#5eb89e]", bg: "bg-[#5eb89e]/10", border: "border-[#5eb89e]/30", badge: "bg-[#5eb89e]/20 text-[#5eb89e]" },
        Pending: { text: "text-[#b08d5c]", bg: "bg-[#b08d5c]/10", border: "border-[#b08d5c]/30", badge: "bg-[#b08d5c]/20 text-[#b08d5c]" },
        Completed: { text: "text-sky-300", bg: "bg-[#1a2c3a]/60", border: "border-[#1a2c3a]", badge: "bg-[#1a2c3a] text-sky-200" },
      };
    }

    // Default Fallback
    return {
      Upcoming: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30", badge: "bg-cyan-500/20 text-cyan-300" },
      Active: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300" },
      Pending: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300" },
      Completed: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", badge: "bg-rose-500/20 text-rose-300" },
    };
  };

  const tabThemeColors = getThemeTabColors(myTeam?.name);

  const myTeamPoints = myTeam?._id
    ? championshipPoints?.find((p) => p.team === myTeam._id)?.phase1_points || 0
    : 0;

  const avgPoints = myTeam?.players?.length > 0
    ? (myTeamPoints / myTeam.players.length).toFixed(1)
    : 0;

  const myTeamCompletedMatches = matchesArray.filter(
    (match) =>
      match.status === "Completed" &&
      myTeam?.players?.some(
        (p) => p._id === match.team1?._id || p._id === match.team2?._id,
      ),
  );

  const myTeamWinsCount = myTeamCompletedMatches.filter(
    (match) =>
      match.winner && myTeam?.players?.some((p) => p._id === match.winner._id),
  ).length;

  const winRate = myTeamCompletedMatches.length > 0
    ? Math.round((myTeamWinsCount / myTeamCompletedMatches.length) * 100) + "%"
    : "0%";

  let cardColors = {
    c1Text: "#60a5fa",
    c1Border: "rgba(96,165,250,0.4)",
    c2Text: "#c084fc",
    c2Border: "rgba(192,132,252,0.3)",
    c3Text: "#fefb04",
    c3Border: "rgba(254,251,4,0.3)",
  };

  const normalizedUserTeam = myTeam?.name?.toLowerCase()?.trim() || "";


  if (isLeagueLoading) return <AuthLoader />;

  const TABS = ["Upcoming", "Active", "Pending", "Completed"];
  const currentRoundsToDisplay = categorizedRounds[roundTab];
  const activeTabColors = tabThemeColors[roundTab];

  return (
    <div className="space-y-4 sm:space-y-6 font-sans">
      
      <div className="flex flex-row items-center justify-between gap-4 mx-2">
        {/* Left Side: Stats Cards Grid */}
        <div className="flex-1 grid grid-cols-3 gap-2 sm:gap-3">
          <div
            className={`bg-white/10 backdrop-blur-xs p-2 sm:p-3 text-center liquid-glass-card low rounded-lg overflow-hidden`}
            // style={{ background: cardColors.c1Border }}
          >
            <p className="text-[7px] sm:text-xs font-bold text-muted-foreground mb-0.5 sm:mb-1 uppercase tracking-widest">
              WIN RATE
            </p>
            <p className="font-black text-[10px] text-white sm:text-2xl">{winRate}</p>
          </div>
          <div
            className={`bg-white/10 backdrop-blur-xs p-2 sm:p-3 text-center liquid-glass-card low rounded-lg overflow-hidden`}
            // style={{ background: cardColors.c2Border }}
          >
            <p className="text-[7px] sm:text-xs font-bold text-muted-foreground mb-0.5 sm:mb-1 uppercase tracking-widest">
              AVG PTS
            </p>
            <p className="font-black text-[10px] text-white sm:text-2xl">
              {avgPoints}
            </p>
          </div>
          <div
            className={`bg-white/10 backdrop-blur-xs p-2 sm:p-3 text-center liquid-glass-card low rounded-lg overflow-hidden`}
            // style={{ background: cardColors.c3Border }}
          >
            <p className="text-[7px] sm:text-xs font-bold text-gray-300 mb-0.5 sm:mb-1 uppercase tracking-widest">
              TOTAL Pts
            </p>
            <p className="font-black text-[10px] text-white sm:text-2xl">
              {myTeamPoints}
            </p>
          </div>
        </div>

        {/* Right Side: Custom Dropdown */}
        <div className="relative z-40" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-between gap-3 w-[140px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTabColors.bg} ${activeTabColors.text} border ${activeTabColors.border} shadow-[0_0_15px_rgba(255,255,255,0.05)] liquid-glass-card low`}
          >
            <div className="flex items-center gap-1.5">
              {roundTab}
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTabColors.badge}`}>
                {Object.keys(categorizedRounds[roundTab]).length}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu List */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#030305]/95 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col p-1 liquid-glass-card black">
              {TABS.map((tab) => {
                const count = Object.keys(categorizedRounds[tab]).length;
                const isActive = roundTab === tab;
                const colors = tabThemeColors[tab];

                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setRoundTab(tab);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between ${
                      isActive
                        ? `${colors.bg} ${colors.text}`
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab}
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${isActive ? colors.badge : 'bg-black/40 text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Empty State / Fallback */}
      {Object.keys(currentRoundsToDisplay).length === 0 && (
        <div className="w-full p-8 flex flex-col items-center justify-center bg-black/20 border border-white/5 rounded-2xl liquid-glass-card low backdrop-blur-md">
          <AlertCircle className="w-8 h-8 text-gray-600 mb-2" />
          <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">
            No {roundTab} Rounds Found
          </p>
        </div>
      )}

      {/* Rounds Container based on Selected Tab */}
      <div className="space-y-4">
        {Object.entries(currentRoundsToDisplay).map(([round, matches], i) => {
          const isCollapsed = collapsedRounds.has(round);

          return (
            <div
              key={round}
              className={`${panelBg} backdrop-blur-md overflow-hidden liquid-glass-card low rounded-xl border border-white/10`}
            >
              <button
                onClick={() => toggleRoundCollapse(round)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-black/40 hover:bg-white/5 transition-colors text-left border-b border-white/10"
              >
                <div className="flex items-center gap-3 min-w-0 relative z-10">
                  {isCollapsed ? (
                    <ChevronUp className={`w-4 h-4 sm:w-5 sm:h-5 ${accentText} flex-shrink-0`} />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <h3 className="text-white font-black uppercase tracking-wider text-[9px] sm:text-sm">
                    {round}
                  </h3>
                  
                  {/* Dynamic Badge using Theme Tab Colors */}
                  <span className={`${activeTabColors.text} text-[9px] font-bold ${activeTabColors.bg} px-2 py-0.5 rounded-sm uppercase tracking-widest border ${activeTabColors.border} hidden sm:inline-block`}>
                    {roundTab === "Pending" ? "Overdue" : roundTab}
                  </span>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <span className={`text-[10px] sm:text-xs font-bold text-white whitespace-nowrap bg-white/30 px-2 py-0.5 rounded-md`}>
                    {matches.filter((m) => m.status === "Completed").length} /{" "}
                    {matches.length}
                  </span>
                </div>
              </button>

              {!isCollapsed && (
                <div className=" sm:p-4 relative z-10 flex flex-col overflow-hidden liquid-glass-card bg-gradient-to-br from-white/10 to-white/5 p-2 ">
                  {matches.map((match, ind) => {
                    const p1Team = getPlayerTeam(match.team1);
                    const p2Team = getPlayerTeam(match.team2);

                    const p1Styles = getTeamStyles(p1Team);
                    const p2Styles = getTeamStyles(p2Team);

                    const isMatchCompleted = match.status === "Completed";
                    const isP1Winner = isMatchCompleted && match.winner?._id === match.team1?._id;
                    const isP2Winner = isMatchCompleted && match.winner?._id === match.team2?._id;
                    const isDraw = isMatchCompleted && !match.winner;

                    const p1OpacityClass = isMatchCompleted && !isP1Winner && !isDraw
                        ? "opacity-50 grayscale contrast-75"
                        : "opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]";
                    const p2OpacityClass = isMatchCompleted && !isP2Winner && !isDraw
                        ? "opacity-50 grayscale contrast-75"
                        : "opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]";

                    return (
                      <div
                        key={match._id}
                        className="relative flex flex-row justify-between bg-[#030305] overflow-hidden  group h-14 sm:h-20"
                      >
                        {/* LEFT BOX (PLAYER 1) */}
                        <div
                          onClick={() => openPlayerProfile(match.team1?._id, match.team2?._id)}
                          className={`relative flex items-center justify-start w-[38%] sm:w-[40%] sm:px-4 cursor-pointer transition-all hover:bg-white/5 ${p1OpacityClass} z-10`}
                        >
                          <div className={`absolute inset-0 z-0 pointer-events-none ${isP1Winner ? "saturate-150 brightness-125": "saturate-50 brightness-75"}`} style={{ background: p1Styles.bgBoxLeft }} />
                          <div className="relative z-10 flex items-center gap-2 sm:gap-3 w-full">
                            <div className="relative shrink-0">
                              <div
                                className={`w-13 h-13 rounded-md overflow-hidden border-[1.5px] transition-transform group-hover:scale-105 shadow-inner`}
                                style={{
                                  borderColor: p1Styles.avatarRing,
                                  background: p1Styles.avatarBg,
                                }}
                              >
                                <img
                                  src={getFaceCropUrl(match.team1?.image?.url) || "/placeholder.svg"}
                                  alt={match.team1?.name || "P1"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {isP1Winner && (
                                <div className="absolute  rotate-24 top-0 -right-1.5 bg-black rounded-sm border border-yellow-500/50 text-[10px] sm:text-xs p-1 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                                  <Crown className="w-3 h-3 text-yellow-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span
                                className={`text-[8px] sm:text-[13px] font-extrabold uppercase tracking-wider truncate ${isP1Winner ? "text-[#fd9aae]" : "text-white/90"}`}
                              >
                                {match.team1?.inGameUserName ? match.team1.inGameUserName : "TBD"}
                              </span>
                              <span className="text-[7px] sm:text-[10px] font-extrabold text-gray-400 uppercase tracking-widest truncate">
                                {p1Team ? p1Team.substring(0, 3) : "TBD"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CENTER BOX (SCORE & STATUS) */}
                        <div className="relative w-[24%] sm:w-[20%] rounded-xl flex flex-col items-center justify-center bg-[#3b82f6]/10 liquid-glass-card black z-20 shadow-[0_0_15px_rgba(0,0,0,1)]">
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                          <span className="text-[7px] sm:text-[9px] px-2 py-1 rounded-full text-white uppercase tracking-[0.2em] font-black  sm:mb-1">
                            M-{ind + 1 || "-"}
                          </span>

                          {isMatchCompleted ? (
                            <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full">
                              <span
                                className="text-lg sm:text-2xl font-black italic tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                                style={{ color: isP1Winner ? p1Styles.primaryColor : isDraw ? "white" : "#6b7280" }}
                              >
                                {match.team1_score ?? "-"}
                              </span>
                              <span className="text-[7px] sm:text-[9px] text-gray-600 font-black uppercase">VS</span>
                              <span
                                className="text-lg sm:text-2xl font-black italic tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                                style={{ color: isP2Winner ? p2Styles.primaryColor : isDraw ? "white" : "#6b7280" }}
                              >
                                {match.team2_score ?? "-"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1 sm:gap-2 w-full">
                              <span className="text-gray-600 font-black text-sm sm:text-lg">-</span>
                              <span className="text-[7px] sm:text-[9px] text-gray-600 font-black uppercase">VS</span>
                              <span className="text-gray-600 font-black text-sm sm:text-lg">-</span>
                            </div>
                          )}
                        </div>

                        {/* RIGHT BOX (PLAYER 2) */}
                        <div
                          onClick={() => openPlayerProfile(match.team2?._id, match.team1?._id)}
                          className={`relative flex items-center justify-end w-[38%] sm:w-[40%] sm:px-4 cursor-pointer transition-all hover:bg-white/5 ${p2OpacityClass} z-10`}
                        >
                          <div className={`absolute inset-0 z-0 pointer-events-none ${isP2Winner && "saturate-175 brightness-150"}`} style={{ background: p2Styles.bgBoxRight }} />
                          <div className="relative z-10 flex items-center gap-2 sm:gap-3 justify-end w-full">
                            <div className="flex flex-col min-w-0 flex-1 items-end">
                              <span
                                className={`text-[8px] sm:text-[13px] font-extrabold uppercase tracking-wider truncate text-right w-full ${isP2Winner ? "text-[#5eb89e]" : "text-white/90"}`}
                              >
                                {match.team2?.inGameUserName ? match.team2.inGameUserName : "TBD"}
                              </span>
                              <span className="text-[7px] sm:text-[10px] font-extrabold text-gray-400 uppercase tracking-widest truncate text-right w-full">
                                {p2Team ? p2Team.substring(0, 3) : "TBD"}
                              </span>
                            </div>
                            <div className="relative shrink-0">
                              <div
                                className={`w-13 h-13 rounded-md overflow-hidden border-[1.5px] transition-transform group-hover:scale-105 shadow-inner`}
                                style={{
                                  borderColor:  p2Styles.primaryColor,
                                  background: p2Styles.avatarBg,
                                }}
                              >
                                <img
                                  src={getFaceCropUrl(match.team2?.image?.url) || "/placeholder.svg"}
                                  alt={match.team2?.name || "P2"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {isP2Winner && (
                                <div className="absolute -rotate-24 top-0 -left-1.5 bg-black rounded-sm border border-yellow-500/50 text-[10px] sm:text-xs p-1 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                                                                                    <Crown className="w-3 h-3 text-yellow-400" />

                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RENDER MODAL HERE */}
      <PlayerProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={selectedPlayerId}
        opponentId={opponentPlayerId}
      />
    </div>
  );
}