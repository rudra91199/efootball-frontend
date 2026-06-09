import { Crown, Medal } from "lucide-react";
import useScrollReveal from "../../Hooks/userScrollReveal";
import { getFaceCropUrl } from "../../Utils/utils";

export function TopThree({ players }) {
  if (players?.length < 3) return null;

  const [first, second, third] = players;


  // Safely extract player info
  const getPlayerName = (player) => 
    player?.playerInfo?.inGameUserName || player?.playerInfo?.name || player?.username || "TBD";
    
  const getPlayerImage = (player) => 
    player?.playerInfo?.image?.url || player?.image || "/placeholder.svg";

  const getPlayerStats = (player) => {
    return {
      pts: player?.points || 0,
      wins: player?.wins || 0,
      gd: player?.goalDifference || 0,
    };
  };

  const maxPts = Math.max(getPlayerStats(first).pts, 1);

  const getDynamicHeight = (rank, playerPts) => {
    const baseHeights = { 1: 190, 2: 160, 3: 145 }; 
    const dynamicBonus = { 1: 50, 2: 40, 3: 30 }; 
    const ratio = playerPts / maxPts; 
    const addedHeight = dynamicBonus[rank] * ratio;
    return `${baseHeights[rank] + addedHeight}px`;
  };

  // ==========================================
  // CYBER-CHROME ESPORTS PODIUM THEMES
  // Mapped across the Blue -> Purple -> Pink -> Red spectrum
  // ==========================================
  const getPodiumTheme = (rank) => {
    switch (rank) {
      case 1:
        return {
          // Purple to Pink (The Core / Champion)
          bg: "bg-gradient-to-t from-[#ec4899]/20 via-[#0a0b10]/90 to-[#030305]",
          cardBorder: "border-[#ec4899]/50", 
          avatarBorder: "border-[#ec4899]",
          textGradient: "from-[#a855f7] to-[#ec4899]",
          accentText: "text-[#ec4899]",
          shadow: "shadow-[0_-10px_40px_rgba(236,72,153,0.2)]",
          icon: <Crown className="w-6 h-6 text-[#ec4899] drop-shadow-[0_0_12px_rgba(236,72,153,0.8)] animate-bounce" />,
          avatarSize: "w-16 h-16 sm:w-22 sm:h-22",
          ring: "ring-[#ec4899]/30",
          imageBg: "bg-[#030305]", 
        };
      case 2:
        return {
          // Blue to Purple (Left Wing)
          bg: "bg-gradient-to-t from-[#3b82f6]/20 via-[#0a0b10]/90 to-[#030305]",
          cardBorder: "border-[#3b82f6]/50", 
          avatarBorder: "border-[#3b82f6]",
          textGradient: "from-[#3b82f6] to-[#a855f7]",
          accentText: "text-[#3b82f6]",
          shadow: "shadow-[0_-10px_30px_rgba(59,130,246,0.15)]",
          icon: <Medal className="w-5 h-5 text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />,
          avatarSize: "w-12 h-12 sm:w-16 sm:h-16",
          ring: "ring-[#3b82f6]/30",
          imageBg: "bg-[#030305]",
        };
      case 3:
        return {
          // Pink to Red (Right Wing)
          bg: "bg-gradient-to-t from-[#e11d48]/20 via-[#0a0b10]/90 to-[#030305]",
          cardBorder: "border-[#e11d48]/50", 
          avatarBorder: "border-[#e11d48]",
          textGradient: "from-[#ec4899] to-[#e11d48]",
          accentText: "text-[#e11d48]",
          shadow: "shadow-[0_-10px_30px_rgba(225,29,72,0.15)]",
          icon: <Medal className="w-5 h-5 text-[#e11d48] drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]" />,
          avatarSize: "w-12 h-12 sm:w-14 sm:h-14",
          ring: "ring-[#e11d48]/30",
          imageBg: "bg-[#030305]",
        };
      default:
        return null;
    }
  };

  const renderPodiumBlock = (player, rank, orderClass, delayClass) => {
    if (!player) return null;
    const theme = getPodiumTheme(rank);
    const stats = getPlayerStats(player);
    const name = getPlayerName(player);

    return (
      <div className={`flex-1 flex flex-col items-center ${orderClass} animate-fade-in ${delayClass} z-${40 - rank * 10} hover:-translate-y-2 transition-transform duration-500 ${rank === 1 ? '-mx-2 sm:-mx-4' : ''}`}>
        
        {/* Avatar & Icon */}
        <div className={`relative ${rank === 1 ? 'mb-5' : 'mb-4'}`}>
          {rank === 1 && (
            <div className="absolute inset-0 bg-[#ec4899] blur-[20px] opacity-30 rounded-full animate-pulse" />
          )}
          
          <img
            src={getFaceCropUrl(getPlayerImage(player))}
            alt={name}
            className={`${theme.avatarSize} rounded-full object-cover border-2 sm:border-[3px] ${theme.avatarBorder} ring-4 ${theme.ring} z-10 relative ${theme.imageBg}`}
          />
          
          <div className={`absolute ${rank === 1 ? '-top-7' : '-top-5'} left-1/2 -translate-x-1/2 z-20`}>
            {theme.icon}
          </div>
        </div>

        {/* Glass Card Pillar */}
        <div 
          className={`w-full ${theme.bg} ${theme.shadow} border-t border-l border-r ${theme.cardBorder} rounded-t-[20px] flex flex-col items-center pt-5 sm:pt-6 px-1.5 sm:px-3 text-center backdrop-blur-2xl relative overflow-hidden transition-all duration-700 ease-out`}
          style={{ height: getDynamicHeight(rank, stats.pts) }}
        >
          {/* Top Edge Glare */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
          <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <p className="text-xs sm:text-sm font-black text-white truncate w-full mb-0.5 drop-shadow-md relative z-10 tracking-wide uppercase">
            {name.split(" ").slice(0, 2).join(" ")}
          </p>
          {player.team && (
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 truncate max-w-full relative z-10">
              {player.team}
            </p>
          )}

          {/* Points Display */}
          <div className="mt-2 mb-auto flex flex-col items-center justify-center relative z-10">
            <p className={`text-2xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b ${theme.textGradient} drop-shadow-lg leading-none`}>
              {stats.pts}
            </p>
            <p className={`text-[9px] sm:text-[10px] ${theme.accentText} font-black uppercase tracking-[0.2em] mt-1.5 opacity-80`}>
              Points
            </p>
          </div>
          
          {/* Sub-Stats Grid */}
          <div className="mt-auto mb-3 sm:mb-4 w-full flex flex-col sm:flex-row gap-1 sm:gap-1.5 px-1 sm:px-2 relative z-10">
            <div className="flex-1 bg-black/40 rounded-md border border-white/5 py-1.5 px-1.5 flex justify-between sm:flex-col sm:justify-center items-center backdrop-blur-md">
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Wins</span>
              <span className="text-[10px] sm:text-xs font-black text-white">
                {stats.wins}
              </span>
            </div>

            <div className="flex-1 bg-black/40 rounded-md border border-white/5 py-1.5 px-1.5 flex justify-between sm:flex-col sm:justify-center items-center backdrop-blur-md">
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">GD</span>
              <span className={`text-[10px] sm:text-xs font-black ${theme.accentText}`}>
                {stats.gd > 0 ? `+${stats.gd}` : stats.gd}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-5 py-6 mb-4 relative max-w-4xl mx-auto px-2 font-sans">
      {/* Base Platform Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-24 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-600/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />
      
      {renderPodiumBlock(second, 2, "order-1", "delay-100")}
      {renderPodiumBlock(first, 1, "order-2", "delay-0")}
      {renderPodiumBlock(third, 3, "order-3", "delay-200")} 
    </div>
  );
}