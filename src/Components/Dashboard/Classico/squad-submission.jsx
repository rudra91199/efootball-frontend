import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Check, X, LoaderCircle, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { API } from "../../../axios";
import { toast } from "react-toastify";
// Added missing import for transparency and face cropping
import { getFaceCropUrl } from "../../../Utils/utils";

export default function SquadSubmission({ tournament, refetch, phase2Series }) {
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const playerData = tournament.teams.reduce((acc, team) => {
    team.players.forEach((player) => {
      acc[player._id] = player;
    });
    return acc;
  }, {});

  const { losingTeam, opponentTeam } = useMemo(() => {
    if (!tournament?.teams) return { losingTeam: null, opponentTeam: null };

    // 1. Find the raw team objects
    const teamA = tournament.teams[0];
    const teamB = tournament.teams[1];

    // 2. Identify roles based on the hasDraftRights flag
    const losingDoc = teamA.hasDraftRights ? teamA : teamB;
    const opponentDoc = teamA.hasDraftRights ? teamB : teamA;

    // 3. Extract and Sanitize
    const formatTeam = (doc) => ({
      id: doc._id?.toString() || doc.id,
      name: doc.name,
      logo: doc.logo?.url || doc.logo,
      players: doc.players.map((p) =>
        p._id ? p._id.toString() : p.toString(),
      ),
      captain: doc.captain?._id,
      hasDraftRights: doc.hasDraftRights,
      playerRankings: doc.playerRankings || [],
    });

    return {
      losingTeam: formatTeam(losingDoc),
      opponentTeam: formatTeam(opponentDoc),
    };
  }, [tournament]);

  const isLosingCaptain = user?._id === losingTeam?.captain;
  const canSubmit = isLosingCaptain && losingTeam?.hasDraftRights;

  const [matchups, setMatchups] = useState([]);

  useEffect(() => {
    if (opponentTeam?.playerRankings) {
      const sortedOppIds = [...opponentTeam.playerRankings]
        .sort((a, b) => a.rank - b.rank)
        .map((r) => r.player.toString());

      setMatchups(
        sortedOppIds.map((playerId, idx) => ({
          opponentPlayerId: playerId,
          losingTeamPlayerId: null,
        })),
      );
    }
  }, [opponentTeam]);

  const [expandedIdx, setExpandedIdx] = useState(null);

  const handlePlayerSelect = (matchupIdx, losingTeamPlayerId) => {
    if (!canSubmit) return;
    const updated = [...matchups];
    updated[matchupIdx].losingTeamPlayerId = losingTeamPlayerId;
    setMatchups(updated);
    setExpandedIdx(null);
  };

  const allMatchupsSet = matchups.every((m) => m.losingTeamPlayerId);

  const resetDraft = () => {
    const sortedOppIds = [...opponentTeam.playerRankings]
      .sort((a, b) => a.rank - b.rank)
      .map((r) => r.player.toString());

    setMatchups(
      sortedOppIds.map((playerId, idx) => ({
        opponentPlayerId: playerId,
        losingTeamPlayerId: null,
      })),
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const draftingTeamOrderedIds = matchups.map((m) => m.losingTeamPlayerId);

    const payload = {
      tournamentId: tournament._id || tournament.id,
      draftingTeamId: losingTeam.id,
      draftingTeamOrderedIds: draftingTeamOrderedIds,
    };

    try {
      const response = await API.post("/massacre/phase2-draft", payload, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
      if (response.data.success) {
        setSubmitting(false);
        refetch();
        toast.success("Squad submitted successfully!");
      }
    } catch (error) {
      setSubmitting(false);
      toast.error("Failed to submit squad. Please try again.");
      console.error("Submission failed", error);
    }
    setSubmitting(false);
  };

  // ==========================================
  // DYNAMIC THEME ENGINE
  // ==========================================
  const getThemeStyles = (teamName) => {
    if (teamName === "Real Madrid" || teamName === "RMA") {
      return {
        primary: "#cfb53b",
        accentText: "text-[#cfb53b]",
        border: "border-[#cfb53b]/30",
        hoverBorder: "hover:border-[#cfb53b]/60",
        gradientBg: "bg-gradient-to-r from-white/30 to-[#cfb53b]/30",
        submitBtn:
          "bg-gradient-to-r from-gray-200 to-[#cfb53b] text-black shadow-[0_0_15px_rgba(207,181,59,0.3)]",
        ring: "ring-[#cfb53b]/50",
      };
    }
    if (teamName === "Barca" || teamName === "FC Barcelona") {
      return {
        primary: "#edbb00",
        accentText: "text-[#edbb00]",
        border: "border-[#a50044]/40",
        hoverBorder: "hover:border-[#edbb00]/60",
        gradientBg: "bg-gradient-to-r from-[#a50044]/70 to-[#004d98]/70",
        submitBtn:
          "bg-gradient-to-r from-[#a50044] to-[#004d98] text-[#edbb00] shadow-[0_0_15px_rgba(165,0,68,0.3)]",
        ring: "ring-[#edbb00]/50",
      };
    }
    // Fallback
    return {
      primary: "#9ca3af",
      accentText: "text-gray-400",
      border: "border-white/10",
      hoverBorder: "hover:border-white/30",
      gradientBg: "bg-white/5",
      submitBtn: "bg-white/10 text-white",
      ring: "ring-white/20",
    };
  };

  // PURE CSS IMAGE BACKGROUND ENGINE (Prevents Tailwind Purging)
  const getAvatarBg = (teamName) => {
    if (teamName === "RMA")
      return "linear-gradient(to bottom, #cfb53b, #050505)";
    if (teamName === "Barca" || teamName === "FCB")
      return "linear-gradient(135deg, rgba(165,0,68,0.9), #080b1f, #004d98)";
    return "linear-gradient(to bottom, rgba(49,44,133,0.8), rgba(10,14,41,0.7), #000000)";
  };

  // Define theme before the return statements so it can be used in the completion screens
  const theme = losingTeam
    ? getThemeStyles(losingTeam.name)
    : getThemeStyles("");

  const opponentAvatarBg = getAvatarBg(opponentTeam?.name);
  const myTeamAvatarBg = getAvatarBg(losingTeam?.name);

  // ==========================================
  // AUTHORIZATION & COMPLETION CHECKS
  // ==========================================
  if (!isLosingCaptain) {
    return (
      <div className="relative overflow-hidden bg-[#0a0a14]/30 backdrop-blur-xl border border-[#edbb00]/50 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(239,68,68,0.15)] mt-6 group">
        {/* Ambient Red Alert Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none animate-pulse" />

        {/* Top Edge Warning Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a50044] to-transparent opacity-70" />

        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-[#edbb00]/40 flex items-center justify-center mb-5 relative z-10 shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform duration-500">
          <ShieldAlert className="w-8 h-8 text-[#a50044] drop-shadow-md" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-[#edbb00] uppercase tracking-widest mb-3 relative z-10 drop-shadow-md">
          Congrats! You've completed Phase 1.
        </h3>

        <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-[0.15em] relative z-10 leading-relaxed max-w-md">
          Only the Captain of
          <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] border-b border-[#edbb00]/50 pb-0.5 mx-1">
            {losingTeam?.name || "the drafting team"}
          </span>
          is authorized to initiate the draft protocol.
        </p>
      </div>
    );
  }

  // RESTORED AND THEMED: Check if Phase 2 is already submitted
  if (phase2Series) {
    return (
      <div className={`p-8 sm:p-10 ${theme.gradientBg} border ${theme.border} rounded-xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-md`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 ${theme.border} bg-black/40 shadow-inner`}>
          <Check className={`w-8 h-8 ${theme.accentText}`} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
          Squad Locked In
        </h2>
        <p className="text-gray-400 text-sm max-w-sm">
          The tactical matchups for Phase 2 have been successfully deployed. Prepare for battle.
        </p>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div
        className={`relative overflow-hidden ${theme.gradientBg} backdrop-blur-md border ${theme.border} rounded-xl p-4 sm:p-6 shadow-lg`}
      >
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">
              Squad Selection
            </h2>
            <div
              className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border shadow-inner ${
                allMatchupsSet
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              }`}
            >
              {allMatchupsSet
                ? "✓ Complete"
                : `${matchups.filter((m) => m.losingTeamPlayerId).length} / ${matchups.length} Matched`}
            </div>
          </div>
          <p className="text-sm text-gray-300">
            As Captain of{" "}
            <span className={`font-bold ${theme.accentText}`}>
              {losingTeam.name}
            </span>
            , select which players from your squad will face each opponent.
          </p>
        </div>
      </div>

      {/* --- MATCHUPS LIST --- */}
      <div className="space-y-3">
        {matchups.map((matchup, idx) => {
          const opponentPlayer = playerData[matchup.opponentPlayerId];
          const selectedMyPlyer = matchup.losingTeamPlayerId
            ? playerData[matchup.losingTeamPlayerId]
            : null;
          const isExpanded = expandedIdx === idx;

          return (
            <div
              key={idx}
              className={`relative bg-black/60 backdrop-blur-sm border ${theme.border} ${theme.hoverBorder} rounded-xl overflow-hidden transition-all duration-300 shadow-md`}
            >
              <div
                className={`absolute inset-0 ${theme.gradientBg} opacity-30`}
              />

              <div className="relative z-10">
                {/* Closed State */}
                {!isExpanded && (
                  <button
                    onClick={() => setExpandedIdx(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Opponent Player */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {/* CHANGED TO GETFACECROPURL AND TEAM BACKGROUND */}
                        <img
                          src={getFaceCropUrl(opponentPlayer?.image?.url)}
                          alt={opponentPlayer?.inGameUserName}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/10 flex-shrink-0"
                          style={{ background: opponentAvatarBg }}
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm sm:text-base font-bold text-white truncate">
                            {opponentPlayer?.inGameUserName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {opponentPlayer?.name}
                          </p>
                        </div>
                      </div>

                      {/* VS Arrow */}
                      <div
                        className={`${theme.accentText} flex-shrink-0 font-black px-2`}
                      >
                        <div className="hidden sm:block text-lg">VS</div>
                        <div className="sm:hidden">
                          <ChevronDown size={18} />
                        </div>
                      </div>

                      {/* Your Player */}
                      <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1 min-w-0">
                        {selectedMyPlyer ? (
                          <>
                            <div className="flex-1 min-w-0 text-right">
                              <p className="text-sm sm:text-base font-bold text-white truncate">
                                {selectedMyPlyer?.inGameUserName}
                              </p>
                              <p
                                className={`text-xs ${theme.accentText} truncate`}
                              >
                                {selectedMyPlyer?.name}
                              </p>
                            </div>
                            {/* CHANGED TO GETFACECROPURL AND TEAM BACKGROUND */}
                            <img
                              src={getFaceCropUrl(selectedMyPlyer?.image?.url)}
                              alt={selectedMyPlyer?.inGameUserName}
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 ${theme.border} shadow-lg flex-shrink-0`}
                              style={{ background: myTeamAvatarBg }}
                            />
                          </>
                        ) : (
                          <div className="flex-1 text-right py-2 text-gray-500 italic text-sm">
                            Select player...
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0 ml-2">
                        {selectedMyPlyer ? (
                          <div className="p-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                            <Check size={14} className="text-emerald-400" />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                            <X size={14} className="text-yellow-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )}

                {/* Expanded State (The Selection Drawer) */}
                {isExpanded && (
                  <div
                    className={`p-4 sm:p-5 border-t ${theme.border} space-y-5 bg-black/40`}
                  >
                    {/* Opponent Info */}
                    <div className="space-y-2">
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest ${theme.accentText}`}
                      >
                        Target Opponent
                      </p>
                      <div className="bg-black/60 border border-white/10 rounded-lg p-3 flex items-center gap-3 shadow-inner">
                        {/* CHANGED TO GETFACECROPURL AND TEAM BACKGROUND */}
                        <img
                          src={getFaceCropUrl(opponentPlayer?.image?.url)}
                          alt={opponentPlayer?.inGameUserName}
                          className="w-12 h-12 rounded-full object-cover border border-white/20"
                          style={{ background: opponentAvatarBg }}
                        />
                        <div className="flex-1">
                          <p className="font-bold text-white">
                            {opponentPlayer?.inGameUserName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {opponentPlayer?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Roster Selection */}
                    <div className="space-y-3">
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest ${theme.accentText}`}
                      >
                        Deploy Your Player
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                        {losingTeam.players.map((playerId) => {
                          const player = playerData[playerId];
                          const isSelected =
                            matchup.losingTeamPlayerId === playerId;
                          const isAlreadyMatched = matchups.some(
                            (m, mIdx) =>
                              mIdx !== idx && m.losingTeamPlayerId === playerId,
                          );

                          return (
                            <button
                              key={playerId}
                              onClick={() => handlePlayerSelect(idx, playerId)}
                              disabled={isAlreadyMatched}
                              className={`p-3 rounded-lg border transition-all duration-200 text-left flex items-center gap-3 ${
                                isSelected
                                  ? `bg-white/10 ${theme.border} ring-1 ${theme.ring} shadow-lg`
                                  : isAlreadyMatched
                                    ? "bg-black/40 border-white/5 opacity-40 cursor-not-allowed grayscale"
                                    : "bg-black/60 border-white/10 hover:bg-white/5"
                              }`}
                            >
                              <img
                                src={getFaceCropUrl(player?.image?.url)}
                                alt={player?.inGameUserName}
                                className={`w-10 h-10 rounded-full object-cover border ${isSelected ? theme.border : "border-white/10"}`}
                                style={{ background: myTeamAvatarBg }}
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-bold truncate ${isSelected ? theme.accentText : "text-gray-200"}`}
                                >
                                  {player?.inGameUserName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {player?.name}
                                </p>
                              </div>
                              {isSelected && (
                                <Check
                                  size={18}
                                  color={theme.primary}
                                  className="flex-shrink-0 drop-shadow-md"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedIdx(null)}
                      className={`w-full py-3 bg-black/60 border ${theme.border} rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-all uppercase tracking-widest`}
                    >
                      Confirm Selection
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`flex gap-3 pt-6 border-t ${theme.border}`}>
        <button
          onClick={resetDraft}
          className="flex-1 py-3.5 bg-black/60 border border-white/10 hover:border-white/30 rounded-xl text-gray-300 font-bold uppercase tracking-widest text-xs transition-all"
        >
          Clear Board
        </button>
        <button
          disabled={!allMatchupsSet || submitting}
          onClick={handleSubmit}
          className={`flex-[2] py-3.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center ${
            allMatchupsSet
              ? `${theme.submitBtn} border border-transparent hover:scale-[1.02] active:scale-95`
              : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
          }`}
        >
          {submitting && (
            <LoaderCircle className="animate-spin mr-3" size={18} />
          )}
          {submitting ? "Locking In..." : "Lock In Squad"}
        </button>
      </div>
    </div>
  );
}
