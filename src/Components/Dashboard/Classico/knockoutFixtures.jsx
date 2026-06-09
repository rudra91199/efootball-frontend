import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Swords,
  ShieldAlert,
  Skull,
  Crosshair,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { API } from "../../../axios";
import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import TeamModal from "./Phase3TeamSubmission";
import { toast } from "react-toastify";
import { getFaceCropUrl } from "../../../Utils/utils";
import PlayerProfileModal from "../PlayerProfileModal";
import { useParams } from "react-router";
import AuthLoader from "../../Loaders/AuthLoader";

// --- INTERNAL THEME ENGINE (Rounded & Smooth) ---
const getTeamTheme = (teamName) => {
  const name = (teamName || "").toLowerCase().trim();

  if (name === "real madrid" || name === "rma") {
    return {
      panelBg: "bg-[#050505]/90",
      gradientText: "from-white via-[#cfb53b] to-white",
      border: "border-[#cfb53b]/50",
      badge:
        "bg-gradient-to-r from-[#cfb53b] to-yellow-600 text-black border border-yellow-400/50",
      accentText: "text-[#cfb53b]",
      progressActive: "bg-gradient-to-r from-gray-300 to-[#cfb53b]",
      avatarBorder: "border-[#cfb53b]",
      shadow: "shadow-[0px_0px_rgba(207,180,59,0.5)]",
      auraRight: "bg-gradient-to-r from-[#cfb53b]/15 to-transparent",
      auraLeft: "bg-gradient-to-l from-[#cfb53b]/15 to-transparent",
    };
  }
  if (name === "barca" || name === "fc barcelona" || name === "fcb") {
    return {
      panelBg: "bg-[#080b1f]/90",
      gradientText: "from-[#a50044] via-[#edbb00] to-[#004d98]",
      border: "border-[#a50044]/60",
      badge:
        "bg-gradient-to-r from-[#a50044] to-red-800 text-white border border-[#edbb00]/50",
      accentText: "text-[#edbb00]",
      progressActive: "bg-gradient-to-r from-[#004d98] to-[#a50044]",
      avatarBorder: "border-[#a50044]",
      shadow: "shadow-[0px_0px_hsl(340,100%,42%,0.5)]",
      auraRight:
        "bg-gradient-to-r from-[#a50044]/20 via-[#004d98]/5 to-transparent",
      auraLeft:
        "bg-gradient-to-l from-[#a50044]/20 via-[#004d98]/5 to-transparent",
    };
  }
  if (name.includes("seven blades")) {
    return {
         panelBg: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[rgb(161,161,162)]/10",
      gradientText: "from-[#e4e4e7] via-[#dc2626] to-[#e4e4e7]",
      border:
        "border-[#a1a1aa] shadow-[0_0_20px_rgba(220,38,38,0.2)]",
      badge:
        "bg-gradient-to-br from-[#27272a] to-[#991b1b] text-white ",
      accentText: "text-[#ef4444]",
      progressActive: "bg-gradient-to-r from-[#52525b] to-[#dc2626]",
      avatarBorder:
        "border-t-[#a1a1aa]/70 border-l-[#a1a1aa]/70 border-b-[#dc2626]/50 border-r-[#dc2626]/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]",
      shadow: "shadow-[0px_0px_rgba(220,38,38,0.5)]",
      auraRight: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[#991b1b]/20",
      auraLeft: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[#991b1b]/20",
    };
  }
  if (name.includes("surya sen")) {
    return {
      panelBg: "bg-[#111a22]/90",
      gradientText: "from-[#b08d5c] via-[#f4ecd8] to-[#b08d5c]",
      border: "border-[#b08d5c]/50",
      badge:
        "bg-gradient-to-r from-[#2d4046] to-[#b08d5c] text-[#f4ecd8] ",
      accentText: "text-[#b08d5c]",
      progressActive: "bg-gradient-to-r from-[#2d4046] to-[#b08d5c]",
      avatarBorder: "border-[#b08d5c]",
      shadow: "shadow-[0px_0px_rgba(176,141,92,0.5)]",
      auraRight: "bg-gradient-to-r from-[#b08d5c] to-[#2d4046]",
      auraLeft: "bg-gradient-to-l from-[#b08d5c] to-[#f4ecd8]",
    };
  }

  return {
    panelBg: "bg-[hsl(232,61%,8%)]/80",
    gradientText: "from-gray-400 via-gray-100 to-gray-400",
    border: "border-white/20",
    badge: "bg-gray-800 text-gray-200 border border-gray-600",
    accentText: "text-blue-400",
    progressActive: "bg-blue-500",
    avatarBorder: "border-white/30",
    shadow: "shadow-[0px_0px_rgba(255,255,255,0.2)]",
    auraRight: "bg-gradient-to-r from-blue-500/10 to-transparent",
    auraLeft: "bg-gradient-to-l from-blue-500/10 to-transparent",
  };
};

export default function KnockoutFixtures({
  phase3Playoff,
  tournament,
  refetch,
}) {
  const { user } = useAuthStore();
  const { tournamentId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [oldListPlayers, setOldListPlayers] = useState([]);
  const [newListPlayers, setNewListPlayers] = useState([]);
  const [originalPlayers, setOriginalPlayers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [opponentPlayerId, setOpponentPlayerId] = useState(null);

  const openPlayerProfile = (playerId, opponentId) => {
    if (!playerId) return;
    setSelectedPlayerId(playerId);
    setOpponentPlayerId(opponentId);
    setIsProfileModalOpen(true);
  };

  const myTeam = tournament?.teams?.find((team) =>
    team.players.some((player) => player._id === user?._id),
  );

  const isCaptain = user?._id && user._id === myTeam?.captain?._id;
  const globalTheme = getTeamTheme(myTeam?.name);

  // --- CHAMPIONSHIP LEADERBOARD FETCH ---
  const { data: { data: { data: leaderboardData } = {} } = {} } = useQuery({
    queryKey: ["championship-leaderboard", "knockout-eval", tournamentId],
    queryFn: () => {
      return API.get(`/massacre/championship-leaderboard/${tournamentId}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
    enabled: !!tournamentId,
  });

  const {
    data: { data: { data: phase3 } = {} } = {},
    isLoading: isPhase3Loading,
  } = useQuery({
    queryKey: ["classico-knockouts", phase3Playoff?.stageData?._id],
    queryFn: () => {
      return API.get(`/knockouts/${phase3Playoff?.stageData._id}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
    enabled: !!phase3Playoff?.stageData?._id,
  });

  const handleOpenModal = () => {
    const players = myTeam?.players || [];
    setSelectedTeam(myTeam);
    setOldListPlayers(players);
    setNewListPlayers([]);
    setOriginalPlayers(players);
    setIsModalOpen(true);
  };

  const handleLineupSubmit = async () => {
    if (myTeam.players.length !== newListPlayers.length) {
      toast.error(
        "Please select the same number of players as in your original team.",
      );
      return;
    }
    const payload = {
      tournamentId: tournament._id,
      teamId: myTeam._id,
      orderedPlayerList: newListPlayers.map((player) => player._id),
    };

    setIsSubmitting(true);
    try {
      const response = await API.patch(
        "/massacre/phase-3/team-submit",
        payload,
        { headers: { Authorization: localStorage.getItem("authToken") } },
      );
      if (response.data.success) {
        toast.success("Lineup submitted successfully!");
        refetch();
        setIsSubmitting(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to submit lineup. Please try again.");
    }
    setIsSubmitting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-gray-400 bg-white/5 border border-white/10";
      case "Live":
        return "text-red-400 bg-red-500/10 border border-red-500/30 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]";
      case "Scheduled":
      case "Upcoming":
        return "text-blue-400 bg-blue-500/10 border border-blue-500/30";
      default:
        return "text-gray-400 bg-gray-800/50 border border-gray-600";
    }
  };

  const getPlayerTeam = (playerId) => {
    if (!tournament?.teams) return null;
    const team = tournament.teams.find((t) =>
      t.players?.some((p) => p._id === playerId),
    );
    return team?.name;
  };

  const getTeamInitials = (teamName) => {
    if (!teamName) return "TBD";
    return teamName
      .split(" ")
      .filter((word) => word.toLowerCase() !== "of")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // --- 🔥 GIANT KILL LOGIC ---
  const evaluateGiantKill = (match) => {
    if (match.status === "Completed") {
      return match.isGiantKill === "Yes"
        ? "ACHIEVED"
        : match.isGiantKill === "No"
          ? "FAILED"
          : null;
    }
  
      if(match.status === "Scheduled" && match.isGiantKill ==="Possible"){
        return "POTENTIAL";
      }
    

    return null;
  };

  if (isPhase3Loading) {
    return <AuthLoader />;
  }

  const allMatches = (
    phase3?.rounds?.flatMap((round) => round?.matches || []) || []
  ).filter((match) => match.status !== "Unpublished");

  return (
    <div className="space-y-8 relative font-sans">
      {/* --- INLINE CUSTOM CSS FOR PROFOUND ANIMATIONS --- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gkAlertPulse {
          0% { box-shadow: 0 0 0 0 rgba(217, 70, 239, 0.1); border-color: rgba(217, 70, 239, 0.3); }
          50% { box-shadow: 0 0 25px 2px rgba(217, 70, 239, 0.5), inset 0 0 20px rgba(217, 70, 239, 0.1); border-color: rgba(232, 121, 249, 0.8); }
          100% { box-shadow: 0 0 0 0 rgba(217, 70, 239, 0.1); border-color: rgba(217, 70, 239, 0.3); }
        }
        @keyframes gkGloryPulse {
          0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 35px 5px rgba(251, 191, 36, 0.4), inset 0 0 30px rgba(251, 191, 36, 0.15); border-color: rgba(252, 211, 77, 0.9); }
          100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3); }
        }
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes hazardPan {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .gk-potential-card {
          animation: gkAlertPulse 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gk-achieved-card {
          animation: gkGloryPulse 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gk-shimmer-text {
          background: linear-gradient(110deg, #fcd34d 20%, #ffffff 40%, #ffffff 60%, #fcd34d 80%);
          background-size: 200% auto;
          color: #000;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 2.5s linear infinite;
        }
        .hazard-bg {
          background-image: repeating-linear-gradient(-45deg, rgba(217, 70, 239, 0.05), rgba(217, 70, 239, 0.05) 15px, transparent 15px, transparent 30px);
          background-size: 50px 50px;
          animation: hazardPan 2.5s linear infinite;
        }
      `,
        }}
      />

      {/* --- STAGE HEADER --- */}
      <div
        className={`${globalTheme.panelBg} backdrop-blur-md border ${globalTheme.border} border-l-0 border-r-0 p-5 py-2 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-2xl max-w-5xl mx-auto`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-3  ${globalTheme.badge} rounded-md shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]`}
          >
            <Zap className={`w-6 h-6 `} />
          </div>
          <div>
            <h2
              className={`text-base sm:text-3xl font-black uppercase tracking-widest text-white`}
            >
              {phase3?.name || "The Gauntlet"}
            </h2>
            <p className="text-[9px] text-gray-400 mt-1 font-bold tracking-[0.2em] uppercase">
              Phase 3 Finale • {phase3?.size || 16} Matches
            </p>
          </div>
        </div>

        {/* Team Submit Action */}
        <div className="flex items-center">
          {!myTeam?.teamSubmitted && isCaptain && (
            <button
              onClick={handleOpenModal}
              className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 ${globalTheme.progressActive} text-white ${globalTheme.shadow}`}
            >
              Submit Lineup
            </button>
          )}
          {myTeam?.teamSubmitted && (
            <div
              className={`px-5 py-2.5 bg-black/40 border shadow-base shadow-${globalTheme.accentText} rounded-xl flex items-center gap-2.5 shadow-inner`}
            >
              <div
                className={`w-2 h-2 rounded-full bg-white shadow-[0_0_10px_currentColor] animate-pulse ${globalTheme.accentText}`}
              />
              <span
                className={`font-black uppercase tracking-widest text-[10px] sm:text-xs ${globalTheme.accentText}`}
              >
                Lineup Locked
              </span>
            </div>
          )}
        </div>
      </div>

      {/* --- MATCH CLASH CARDS --- */}
      {allMatches.length === 0 ? (
        <div
          className={`text-center py-16 bg-[#0a0b10]/80 backdrop-blur-2xl rounded-[24px] border border-white/5 flex flex-col items-center shadow-xl max-w-4xl mx-auto`}
        >
          <ShieldAlert className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em]">
            Awaiting Combatants
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8 max-w-5xl mx-auto px-3">
          {allMatches.map((match, matchIndex) => {
            const t1Name = getPlayerTeam(match.team1?._id);
            const t2Name = getPlayerTeam(match.team2?._id);

            // Extract Team Logos for Background Watermarks
            const t1Data = leaderboardData?.find((t) => t.teamName === t1Name);
            const t2Data = leaderboardData?.find((t) => t.teamName === t2Name);
            const t1Logo = t1Data?.teamLogo;
            const t2Logo = t2Data?.teamLogo;

            // Themes
            const t1Theme = getTeamTheme(t1Name);
            const t2Theme = getTeamTheme(t2Name);

            const isMatchCompleted = match.status === "Completed";
            const isP1Winner =
              isMatchCompleted && match.winner?._id === match.team1?._id;
            const isP2Winner =
              isMatchCompleted && match.winner?._id === match.team2?._id;
            const isDraw = isMatchCompleted && !match.winner;

            const p1Opacity =
              isMatchCompleted && !isP1Winner && !isDraw
                ? "opacity-50 grayscale-[0.6]"
                : "opacity-100";
            const p2Opacity =
              isMatchCompleted && !isP2Winner && !isDraw
                ? "opacity-50 grayscale-[0.6]"
                : "opacity-100";

            const gkStatus = evaluateGiantKill(match);

            // Base Small, Tight Card
            let cardOuterClass = `bg-[#0a0b10]/95 backdrop-blur-2xl relative transition-all duration-500 overflow-hidden rounded-[24px] border border-white/10 hover:border-white/20 shadow-2xl`;
            let centralScoreBorder = "border-white/10";
            let giantKillBadge = null;

            // 🏆 ACHIEVED GIANT KILL STYLING
            if (gkStatus === "ACHIEVED") {
              cardOuterClass = `bg-[#050505] relative gk-achieved-card transition-all duration-500 overflow-hidden rounded-[24px] border-2 border-amber-400/80 z-10`;
              centralScoreBorder =
                "border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]";
              giantKillBadge = (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md rounded-b-xl border-x border-b border-amber-500/50 shadow-[0_5px_15px_rgba(251,191,36,0.4)] px-4 py-1.5 flex items-center gap-2 z-30">
                  <Skull className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] gk-shimmer-text">
                    GIANT SLAIN
                  </span>
                </div>
              );
            }
            // ⚠️ POTENTIAL GIANT KILL STYLING
            else if (gkStatus === "POTENTIAL") {
              cardOuterClass = `bg-[#050505] relative gk-potential-card transition-all duration-500 overflow-hidden rounded-[24px] border-2 border-fuchsia-600/80 z-10`;
              centralScoreBorder =
                "border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.3)]";
              giantKillBadge = (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-fuchsia-950/90 backdrop-blur-md text-fuchsia-200 rounded-b-xl border-x border-b border-fuchsia-500/50 shadow-[0_5px_15px_rgba(217,70,239,0.6)] px-4 py-1.5 flex items-center gap-2 z-30">
                  <Crosshair className="w-3.5 h-3.5 animate-pulse text-white" />
                  <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] drop-shadow-sm text-white">
                    TARGET: GIANT
                  </span>
                </div>
              );
            }
            // 🛡️ GIANT SURVIVED STYLING
            else if (gkStatus === "FAILED") {
              giantKillBadge = (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-slate-300 rounded-b-xl border-x border-b border-slate-600/50 px-4 py-1.5 flex items-center gap-2 z-30 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">
                    GIANT SURVIVED
                  </span>
                </div>
              );
            }

            return (
              <div key={matchIndex} className={cardOuterClass}>
                {/* Status Bar Overlays */}
                {giantKillBadge}

                {/* Hazard Overlay for Potential */}
                {gkStatus === "POTENTIAL" && (
                  <div className="absolute inset-0 pointer-events-none hazard-bg z-0 opacity-80" />
                )}
                {gkStatus === "ACHIEVED" && (
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-500/10 to-transparent z-0" />
                )}

                <div className="absolute top-3 left-4 sm:left-5 z-20">
                  <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 shadow-inner">
                    <span className="block text-[8px] sm:text-[9px] font-black text-gray-300 uppercase tracking-widest">
                      Match {match.matchNumber || matchIndex + 1}
                    </span>
                  </div>
                </div>
                <div className="absolute top-3 right-4 sm:right-5 z-20">
                  <span
                    className={`px-2.5 py-1 rounded-md font-black uppercase tracking-widest text-[8px] sm:text-[9px] bg-black/60 backdrop-blur-md border ${getStatusColor(match.status)}`}
                  >
                    {match.status}
                  </span>
                </div>

                {/* --- CLASH GRID LAYOUT --- */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] relative w-full h-full pt-10 sm:pt-0">
                  {/* TEAM 1 SIDE */}
                  <div
                    className={`relative flex items-center justify-start sm:justify-end p-4 sm:p-5 transition-all duration-500 ${p1Opacity}`}
                  >
                    {/* Background Aura */}
                    <div
                      className={`absolute inset-0 pointer-events-none opacity-50 z-0 ${t1Theme.auraRight} sm:rounded-l-[24px]`}
                    />

                    <div
                      onClick={() =>
                        openPlayerProfile(match.team1?._id, match.team2?._id)
                      }
                      className="flex flex-row sm:flex-row items-center gap-4 relative z-10 w-full cursor-pointer group"
                    >
                      {/* Avatar with Team Logo Behind */}
                      <div className="relative shrink-0 sm:order-2 flex items-center justify-center ">
                        <div
                          className={`w-18 h-18 sm:w-[72px] sm:h-[72px] rounded-md overflow-hidden border-[3px] shadow-2xl ${t1Theme.avatarBorder} transition-transform duration-300 group-hover:scale-105 relative z-10 `}
                        >
                          {t1Logo && (
                            <img
                              src={t1Logo}
                              className="absolute w-20 h-20 sm:w-28 sm:h-28 object-contain opacity-[1] blur-[0.6px] z-0 pointer-events-none scale-150 transition-transform group-hover:scale-150"
                              alt=""
                            />
                          )}
                          <img
                            src={getFaceCropUrl(match.team1?.image?.url)}
                            alt={match.team1?.inGameUserName}
                            className="w-full h-full object-cover transition-all relative z-10"
                          />
                        </div>
                        {isP1Winner && (
                          <div
                            className={`absolute -bottom-1 -left-1 sm:-bottom-1.5 sm:-left-1.5 bg-black rounded-full p-1.5 z-20 border shadow-lg ${t1Theme.avatarBorder}`}
                          >
                            <Trophy
                              className={`w-3.5 h-3.5 ${t1Theme.accentText}`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex flex-col min-w-0 flex-1 sm:text-right sm:order-1 relative z-10">
                        <p
                          className={`text-sm sm:text-base font-black truncate transition-colors uppercase tracking-wider ${isP1Winner ? t1Theme.accentText + " drop-shadow-md" : "text-gray-200 group-hover:text-white"}`}
                        >
                          {match.team1?.inGameUserName || "TBD"}
                        </p>
                        {match.team1 && (
                          <span
                            className={`w-fit sm:ml-auto mt-1.5 text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full shadow-inner uppercase font-black tracking-[0.15em] ${t1Theme.badge}`}
                          >
                            {getTeamInitials(t1Name)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* --- CENTRAL SCORE HUB --- */}
                  <div className="relative z-30 flex items-center justify-center -my-3 sm:my-0">
                    <div
                      className={`bg-black/95 backdrop-blur-2xl border-[2px] ${centralScoreBorder} rounded-[18px] px-5 py-3 flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.9)] min-w-[100px]`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-3xl sm:text-4xl font-black ${isMatchCompleted ? (isP1Winner ? (gkStatus === "ACHIEVED" ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" : t1Theme.accentText) : "text-white") : "text-gray-700"}`}
                        >
                          {match.team1_score ?? "-"}
                        </span>
                        <span className="text-gray-600 text-lg sm:text-xl font-black">
                          :
                        </span>
                        <span
                          className={`text-3xl sm:text-4xl font-black ${isMatchCompleted ? (isP2Winner ? (gkStatus === "ACHIEVED" ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" : t2Theme.accentText) : "text-white") : "text-gray-700"}`}
                        >
                          {match.team2_score ?? "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TEAM 2 SIDE */}
                  <div
                    className={`relative flex items-center justify-start p-4 sm:p-5 transition-all duration-500 ${p2Opacity}`}
                  >
                    {/* Background Aura */}
                    <div
                      className={`absolute inset-0 pointer-events-none opacity-50 z-0 ${t2Theme.auraLeft} sm:rounded-r-[24px]`}
                    />

                    <div
                      onClick={() =>
                        openPlayerProfile(match.team2?._id, match.team1?._id)
                      }
                      className="flex flex-row-reverse sm:flex-row items-center gap-4 relative z-10 w-full cursor-pointer group"
                    >
                      {/* Avatar with Team Logo Behind */}
                      <div className="relative shrink-0 flex items-center justify-center ">
                        <div
                          className={`w-18 h-18 sm:w-[72px] sm:h-[72px] rounded-md overflow-hidden border-[3px] shadow-2xl transition-transform duration-300 group-hover:scale-105 relative z-10 ${t2Theme.avatarBorder}`}
                        >
                          {t2Logo && (
                            <img
                              src={t2Logo}
                              className="absolute w-20 h-20 sm:w-28 sm:h-28 object-contain opacity-[0.8] blur-[0.6px] z-0 pointer-events-none scale-150 transition-transform group-hover:scale-150"
                              alt=""
                            />
                          )}
                          <img
                            src={getFaceCropUrl(match.team2?.image?.url)}
                            alt={match.team2?.inGameUserName}
                            className="w-full h-full object-cover transition-all relative z-10"
                          />
                        </div>
                        {isP2Winner && (
                          <div
                            className={`absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 bg-black rounded-full p-1.5 z-20 border shadow-lg ${t2Theme.avatarBorder}`}
                          >
                            <Trophy
                              className={`w-3.5 h-3.5 ${t2Theme.accentText}`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex flex-col min-w-0 flex-1 text-right sm:text-left relative z-10">
                        <p
                          className={`text-sm sm:text-base font-black truncate transition-colors uppercase tracking-wider ${isP2Winner ? t2Theme.accentText + " drop-shadow-md" : "text-gray-200 group-hover:text-white"}`}
                        >
                          {match.team2?.inGameUserName || "TBD"}
                        </p>
                        {match.team2 && (
                          <span
                            className={`w-fit ml-auto sm:ml-0 mt-1.5 text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full shadow-inner uppercase font-black tracking-[0.15em] ${t2Theme.badge}`}
                          >
                            {getTeamInitials(t2Name)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PlayerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userId={selectedPlayerId}
        opponentId={opponentPlayerId}
      />

      {isModalOpen && (
        <TeamModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedTeam={selectedTeam}
          oldListPlayers={oldListPlayers}
          newListPlayers={newListPlayers}
          originalPlayers={originalPlayers}
          setOldListPlayers={setOldListPlayers}
          setNewListPlayers={setNewListPlayers}
          setOriginalPlayers={setOriginalPlayers}
          handleLineupSubmit={handleLineupSubmit}
          isSubmitting={isSubmitting}
          theme={globalTheme}
        />
      )}
    </div>
  );
}
