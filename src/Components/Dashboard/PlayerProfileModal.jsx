import { useQuery } from "@tanstack/react-query";
import { API } from "../../axios";
import {
  X,
  Copy,
  Smartphone,
  User as UserIcon,
  Gamepad2,
  Trophy,
  Swords,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import AuthLoader from "../Loaders/AuthLoader";
import { getFaceCropUrl } from "../../Utils/utils";

const PlayerProfileModal = ({ isOpen, onClose, userId, opponentId }) => {
  const [copied, setCopied] = useState(false);

  const {
    data: { data: { data: player } = {} } = {},
    isLoading: isPlayerLoading,
  } = useQuery({
    queryKey: ["player-profile", userId],
    queryFn: () =>
      API.get(`/users/getUserBasicInfo/${userId}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      }),
    enabled: !!userId && isOpen,
  });

  const {
    data: { data: { data: h2hData } = {} } = {},
    isLoading: isH2hLoading,
  } = useQuery({
    queryKey: ["h2h-stats", userId, opponentId],
    queryFn: () =>
      API.get(`/users/h2h/${userId}/${opponentId}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      }),
    enabled: !!userId && !!opponentId && isOpen,
  });

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const isLoading = isPlayerLoading || isH2hLoading;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-sans">
      {/* Click-away backdrop */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* MAIN MODAL CONTAINER - THE ONLY GLASS ELEMENT */}
      <div className="relative w-full max-w-md liquid-glass-card low bg-[#05050a]/50  backdrop-blur-sm border border-white/10 rounded-[28px] overflow-hidden transform transition-all animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
        
        {/* Internal ambient theme glows to light up the frosted glass */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,transparent_70%)] pointer-events-none z-0" />

        {/* Close Button - Solid styling */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-full transition-all z-20 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
        >
          <X className="w-4 h-4 relative z-10" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar relative z-10">
          
          {/* Header Tag */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-8">
            <div className="p-1.5 bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-lg shadow-inner">
              <Trophy className="w-4 h-4 text-[#a855f7]" />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-[#a855f7] uppercase tracking-[0.2em] drop-shadow-md">
              Scouting Report
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 flex justify-center">
              <AuthLoader />
            </div>
          ) : player ? (
            <div className="flex flex-col items-center">
              
              {/* Avatar Section */}
              <div className="relative mb-5 group">
                <div className="absolute inset-0 bg-[#3b82f6]/20 blur-xl rounded-full transition-opacity group-hover:opacity-70 animate-pulse" />
                {/* Avatar wrapper - Indented cut-out style */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-black/60 border border-white/10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] relative z-10">
                  <img
                    src={getFaceCropUrl(player.image?.url) || "/placeholder.svg"}
                    alt={player.name}
                    className="w-full h-full object-cover rounded-full border border-black"
                  />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-6 text-center drop-shadow-lg">
                {player.name}
              </h2>

              {/* Player Details Grid - Indented solid cut-outs */}
              <div className="w-full space-y-2.5 mb-8">
                {/* IGN */}
                <div className="flex items-center justify-between p-3.5 bg-black/20 border border-white/5 rounded-2xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-2.5 text-gray-400">
                    <UserIcon className="w-4 h-4 text-[#3b82f6]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      In-Game Name
                    </span>
                  </div>
                  <span className="text-[#ec4899] font-black text-[10px] sm:text-xs bg-[#ec4899]/10 border border-[#ec4899]/20 px-2.5 py-1 rounded-lg">
                    {player.inGameUserName || "N/A"}
                  </span>
                </div>

                {/* ID */}
                <div className="flex items-center justify-between p-3.5 bg-black/20 border border-white/5 rounded-2xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] group">
                  <div className="flex items-center gap-2.5 text-gray-400">
                    <Gamepad2 className="w-4 h-4 text-[#a855f7]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      eFootball ID
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black tracking-widest text-[10px] sm:text-xs drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      {player.inGameUserId || "N/A"}
                    </span>
                    {player.inGameUserId && (
                      <button
                        onClick={() => handleCopy(player.inGameUserId)}
                        className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md transition-all active:scale-90 shadow-sm"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-300 group-hover:text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Hardware */}
                <div className="flex items-center justify-between p-3.5 bg-black/20 border border-white/5 rounded-2xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-2.5 text-gray-400">
                    <Smartphone className="w-4 h-4 text-[#f43f5e]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Hardware
                    </span>
                  </div>
                  <span className="text-white font-black text-[10px] sm:text-xs uppercase tracking-wider">
                    {player.phoneModel || "Unknown"}
                  </span>
                </div>
              </div>

              {/* ========================================== */}
              {/* FIXTURE HEAD-TO-HEAD TALE OF THE TAPE      */}
              {/* ========================================== */}
              {opponentId && (
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-5 justify-center">
                    <div className="h-[1px] bg-gradient-to-r from-transparent to-white/10 flex-1" />
                    <div className="p-1.5 rounded-lg border border-white/10 bg-black/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                      <Swords className="w-3.5 h-3.5 text-[#a855f7]" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Head to Head
                    </span>
                    <div className="h-[1px] bg-gradient-to-l from-transparent to-white/10 flex-1" />
                  </div>

                  {h2hData?.totalMatches > 0 ? (
                    <>
                      {/* Overall Win/Loss Counter - Indented Solid */}
                      <div className="flex items-center justify-between bg-black/20 border border-white/5 p-4 rounded-2xl mb-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-[9px] font-black text-[#3b82f6] uppercase tracking-widest mb-1 drop-shadow-md">
                            Wins
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-white leading-none drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                            {h2hData.player1Wins}
                          </span>
                        </div>
                        <div className="flex flex-col items-center flex-1 px-4 border-x border-white/10">
                          <span className="text-[9px] font-black text-[#a855f7] uppercase tracking-widest mb-1">
                            Draws
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-white leading-none drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                            {h2hData.draws}
                          </span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-[9px] font-black text-[#f43f5e] uppercase tracking-widest mb-1 drop-shadow-md">
                            Losses
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-white leading-none drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                            {h2hData.player2Wins}
                          </span>
                        </div>
                      </div>

                      {/* COMPACT MATCH HISTORY GRID */}
                      <div className="w-full">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3 text-center">
                          Recent Form
                        </span>

                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                          {h2hData.matches.slice(0, 5).map((match, idx) => {
                            const playerWon = match.result === "Win";
                            const playerLost = match.result === "Loss";
                            const isDraw = match.result === "Draw";

                            const topBorderColor = playerWon
                              ? "bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                              : playerLost
                                ? "bg-[#f43f5e] shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                                : "bg-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.6)]";
                                
                            const p1ScoreColor = playerWon
                              ? "text-[#3b82f6]"
                              : isDraw
                                ? "text-[#a855f7]"
                                : "text-[#f43f5e]/50"; 
                                
                            const p2ScoreColor = playerLost
                              ? "text-[#f43f5e]"
                              : isDraw
                                ? "text-[#a855f7]"
                                : "text-[#3b82f6]/50"; 

                            const opponentName =
                              match.opponent?.name?.split(" ").slice(0,2).join(" ") ||
                              match.opponent?.inGameUserName ||
                              "Rival";

                            return (
                              <div
                                key={idx}
                                className="bg-black/60 border border-white/5 rounded-[14px] flex flex-col items-center justify-between aspect-square p-2 relative overflow-hidden group hover:bg-black/80 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                              >
                                {/* Top Color Indicator */}
                                <div className={`absolute top-0 left-0 w-full h-[3px] ${topBorderColor} z-10`} />

                                {/* W/L/D Tiny Badge */}
                                <span className={`text-[9px] font-black uppercase mt-1 relative z-10 ${
                                  playerWon ? "text-[#3b82f6]" : playerLost ? "text-[#f43f5e]" : "text-[#a855f7]"
                                }`}>
                                  {playerWon ? "W" : playerLost ? "L" : "D"}
                                </span>

                                {/* Compact Score */}
                                <div className="text-base text-white font-black tracking-widest mt-0.5 relative z-10 flex items-center justify-center">
                                  <span>{match.scoreFor}</span>
                                  <span className="text-gray-600 mx-0.5">-</span>
                                  <span>{match.scoreAgainst}</span>
                                </div>

                                {/* Stacked Opponent & Tournament Details */}
                                <div className="flex flex-col items-center w-full mt-auto gap-0.5 relative z-10">
                                  <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest text-center truncate w-full">
                                    vs
                                  </span>
                                  <span className="text-white text-[9px] font-black truncate w-full text-center drop-shadow-md">
                                    {opponentName}
                                  </span>
                                  <span className="text-[7px] text-[#ec4899] uppercase font-bold tracking-widest text-center truncate w-full">
                                    {match.tournament?.name || "Event"}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center bg-black/40 border border-white/5 py-8 rounded-2xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                      <div className="mx-auto w-10 h-10 rounded-full bg-black/60 border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center mb-3">
                        <Swords className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                        First Meeting
                      </span>
                      <p className="text-[10px] text-gray-600 font-bold px-4">
                        No previous match history exists between these operators.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500 font-black text-xs uppercase tracking-widest">
              Operator Data Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileModal;