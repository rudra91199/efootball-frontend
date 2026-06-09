import { useQuery } from "@tanstack/react-query";
import { X, Flame, Swords, ShieldAlert } from "lucide-react";
import { API } from "../../axios";
import AuthLoader from "../Loaders/AuthLoader";
import { getFaceCropUrl } from "../../Utils/utils";

export default function PlayerStatModal({
  isOpen,
  onClose,
  player,
  statType,
  tournamentId,
  isGlobal,
}) {
  const endpoint = isGlobal
    ? `/users/leaderboards/global/player/${player?.playerInfo?._id}/matches`
    : `/users/leaderboards/tournament/${tournamentId}/player/${player?.playerInfo?._id}/matches`;

  const { data: { data: { data: matches } = {} } = {}, isLoading } = useQuery({
    queryKey: [
      "player-matches",
      isGlobal ? "global" : tournamentId,
      player?.playerInfo?._id,
    ],
    queryFn: () =>
      API.get(endpoint, {
        headers: { Authorization: localStorage.getItem("authToken") },
      }),
    enabled: !!isOpen && !!player && (isGlobal || !!tournamentId),
  });

  if (!isOpen || !player) return null;

  // Filter matches if we only want Wins
  const displayMatches =
    statType === "W"
      ? matches?.filter((m) => m.result?.toLowerCase() === "win")
      : matches;

  return (
    <div className="fixed inset-0 bg-[#030305]/95 backdrop-blur-md flex items-center justify-center z-[9999] px-2 sm:px-4 font-sans animate-slide-in-bottom ">
      {/* 🚀 FOCUSED MATCH HISTORY MODAL 🚀 */}
      <div className="relative bg-[#0a0b10] border border-white/10 w-full max-w-3xl shadow-[0_0_80px_rgba(0,0,0,1)] flex flex-col max-h-[85vh] rounded-2xl sm:rounded-[24px] overflow-hidden zoom-in-95 duration-200">
        {/* ==========================================
            HEADER: Player Focus
        ========================================== */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#030305]/80 backdrop-blur-xl z-20 relative shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-[#0a0b10] border border-white/5 rounded-xl shadow-inner">
              {statType === "W" ? (
                <Flame className="text-[#3b82f6] w-5 h-5 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              ) : (
                <Swords className="text-[#ec4899] w-5 h-5 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
              )}
            </div>

            <div>
              <h2 className="font-black text-white text-lg sm:text-2xl uppercase tracking-widest leading-none mb-1">
                {player.playerInfo?.inGameUserName || player.playerInfo?.name}
              </h2>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
                <span>
                  {statType === "W" ? "Victories Log" : "Full Match History"}
                </span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-gray-400">
                  {displayMatches?.length || 0} Records
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 rounded-xl transition-all active:scale-95 group"
          >
            <X
              size={22}
              strokeWidth={2.5}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>

        {/* ==========================================
            BODY: Match Feed (The Primary Focus)
        ========================================== */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 custom-scrollbar relative z-10 bg-gradient-to-b from-[#0a0b10] to-[#030305]">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-40 gap-4">
              <AuthLoader />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">
                Loading Matches...
              </p>
            </div>
          ) : displayMatches?.length > 0 ? (
            <div className="flex flex-col gap-2 sm:gap-3">
              {displayMatches.map((match, i) => {
                const isWin = match.result?.toLowerCase() === "win";
                const isLoss = match.result?.toLowerCase() === "loss";
                const isDraw = match.result?.toLowerCase() === "draw";

                // Cyber-Chrome Colors based on Result
                let theme = {
                  border: "border-white/5",
                  bg: "bg-white/5 hover:bg-white/10",
                  text: "text-gray-400",
                  accent: "bg-gray-500",
                };

                if (isWin) {
                  theme = {
                    border: "border-[#3b82f6]/30",
                    bg: "bg-[#3b82f6]/10 hover:bg-[#3b82f6]/15",
                    text: "text-[#3b82f6]",
                    accent:
                      "bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.8)]",
                  };
                } else if (isLoss) {
                  theme = {
                    border: "border-[#e11d48]/30",
                    bg: "bg-[#e11d48]/10 hover:bg-[#e11d48]/15",
                    text: "text-[#e11d48]",
                    accent:
                      "bg-[#e11d48] shadow-[0_0_10px_rgba(225,29,72,0.8)]",
                  };
                } else if (isDraw) {
                  theme = {
                    border: "border-[#a855f7]/30",
                    bg: "bg-[#a855f7]/10 hover:bg-[#a855f7]/15",
                    text: "text-[#a855f7]",
                    accent:
                      "bg-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.8)]",
                  };
                }

                return (
                  <div
                    key={match._id || i}
                    className={`flex items-stretch rounded-xl border ${theme.border} ${theme.bg} transition-colors overflow-hidden`}
                  >
                    {/* Left Indicator Strip */}
                    <div className={`w-1.5 sm:w-2 shrink-0 ${theme.accent}`} />

                    {/* Result & Score (Left Side) */}
                    <div className="w-20 sm:w-28 flex flex-col items-center justify-center py-3 border-r border-white/5 shrink-0 bg-[#030305]/40">
                      <span
                        className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${theme.text} mb-1`}
                      >
                        {match.result}
                      </span>
                      <div className="flex items-center gap-1.5 font-black text-lg sm:text-xl text-white tracking-wider">
                        <span>{match.scoreFor}</span>
                        <span className="text-gray-600 text-sm">-</span>
                        <span>{match.scoreAgainst}</span>
                      </div>
                    </div>

                    {/* Opponent Identity (Right Side) */}
                    <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 flex-1 min-w-0">
                      <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest shrink-0">
                        VS
                      </span>

                      <img
                        src={
                          getFaceCropUrl(match.opponent?.image?.url) ||
                          "/placeholder.svg"
                        }
                        alt={match.opponent?.inGameUserName}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover border border-white/10 shrink-0"
                      />

                      <span className="text-sm sm:text-lg font-black text-white uppercase tracking-wide truncate">
                        {match.opponent?.inGameUserName || "Unknown Opponent"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 opacity-50">
              <ShieldAlert
                className="w-12 h-12 text-gray-500 mb-4"
                strokeWidth={1.5}
              />
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-sm">
                No Matches Found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
