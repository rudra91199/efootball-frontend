import { Trophy, Medal, Shield, Star, Flame, Activity, Swords } from "lucide-react";
import { getFaceCropUrl } from "../../Utils/utils";

export function LeaderboardCard({ player, index, isCurrentUser, onStatClick, onCompareClick }) {
  // Safely normalize data to handle both Global and Tournament API structures
  const name = player?.playerInfo?.name || player?.name || "TBD";
  const inGameName = player?.playerInfo?.inGameUserName || player?.inGameUserName || name;
  const image = player?.playerInfo?.image?.url || player?.image || "/placeholder.svg";

  const mp = player?.matchesPlayed ?? player?.mp ?? 0;
  const w = player?.wins ?? 0;
  const d = player?.draws ?? 0;
  const l = player?.losses ?? 0;
  const gd = player?.goalDifference ?? player?.gd ?? 0;
  const gf = player?.goalsScored ?? player?.gf ?? 0;
  const ga = player?.goalsConceded ?? player?.ga ?? 0;
  const pts = player?.points ?? 0;
  
  const recentForm = player?.recentForm || [];

  // Calculate Win Rate
  const winRate = mp > 0 ? ((w / mp) * 100).toFixed(0) : 0;

  // ==========================================
  // CYBER-CHROME THEME ENGINE
  // ==========================================
  const getCardTheme = () => {
    if (index === 0) {
      return {
        wrapper: "bg-gradient-to-r from-[#ec4899]/10 via-[#0a0b10]/80 to-[#030305] border-[#ec4899]/30 shadow-[0_0_20px_rgba(236,72,153,0.1)]",
        rankBg: "bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/30",
        ptsColor: "text-[#ec4899] drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
        icon: <Trophy className="w-5 h-5 text-[#ec4899]" />,
        avatarRing: "border-[#ec4899]/50",
        imageBg: "bg-[#030305]",
      };
    }
    if (index === 1) {
      return {
        wrapper: "bg-gradient-to-r from-[#3b82f6]/10 via-[#0a0b10]/80 to-[#030305] border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
        rankBg: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30",
        ptsColor: "text-[#3b82f6] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
        icon: <Medal className="w-5 h-5 text-[#3b82f6]" />,
        avatarRing: "border-[#3b82f6]/50",
        imageBg: "bg-[#030305]",
      };
    }
    if (index === 2) {
      return {
        wrapper: "bg-gradient-to-r from-[#e11d48]/10 via-[#0a0b10]/80 to-[#030305] border-[#e11d48]/30 shadow-[0_0_15px_rgba(225,29,72,0.1)]",
        rankBg: "bg-[#e11d48]/10 text-[#e11d48] border-[#e11d48]/30",
        ptsColor: "text-[#e11d48] drop-shadow-[0_0_8px_rgba(225,29,72,0.5)]",
        icon: <Medal className="w-5 h-5 text-[#e11d48]" />,
        avatarRing: "border-[#e11d48]/50",
        imageBg: "bg-[#030305]",
      };
    }
    if (isCurrentUser) {
      return {
        wrapper: "bg-gradient-to-r from-[#a855f7]/15 via-[#0a0b10]/90 to-[#030305] border-[#a855f7]/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]",
        rankBg: "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30",
        ptsColor: "text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
        avatarRing: "border-[#a855f7]/50",
        imageBg: "bg-[#030305]",
      };
    }
    return {
      wrapper: "bg-[#0a0b10]/60 border-white/5 hover:border-white/10 hover:bg-[#0a0b10]/80",
      rankBg: "bg-[#030305] text-gray-500 border-white/5",
      ptsColor: "text-white",
      avatarRing: "border-white/10",
      imageBg: "bg-[#030305]",
    };
  };

  const theme = getCardTheme();

  // Refined Form Colors mapping exactly to your new palette
  const getFormStyle = (result) => {
    const r = result?.toLowerCase();
    if (r === "w" || r === "win") 
      return "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30 shadow-[0_0_8px_rgba(59,130,246,0.15)]";
    if (r === "d" || r === "draw") 
      return "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30 shadow-[0_0_8px_rgba(168,85,247,0.15)]";
    if (r === "l" || r === "loss") 
      return "bg-[#e11d48]/10 text-[#e11d48] border-[#e11d48]/30";
    return "bg-white/5 text-gray-500 border-white/5";
  };

  return (
    <div className={`relative overflow-hidden rounded-[14px] backdrop-blur-xl border transition-all duration-300 ${theme.wrapper}`}>
      
      {/* Current User Top-Border Indicator */}
      {isCurrentUser && (
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#ec4899]" />
      )}

      {/* Top Section: Identity & Points */}
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-white/5 relative z-10">
        
        {/* Rank Badge */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center font-black text-sm sm:text-base border ${theme.rankBg}`}>
          {theme.icon ? theme.icon : `#${index + 1}`}
        </div>

        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={getFaceCropUrl(image)}
            alt={inGameName}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] object-cover border-2 ${theme.avatarRing} ${theme.imageBg}`}
          />
          {isCurrentUser && (
            <div className="absolute -bottom-1 -right-1 bg-[#030305] rounded-full p-0.5 border border-white/10">
              <Star className="w-3 h-3 text-[#a855f7] fill-[#a855f7]" />
            </div>
          )}
        </div>

        {/* Name, Win Rate & Recent Form (FLEX-WRAP ADDED HERE) */}
        <div className="flex-1 min-w-0 flex flex-col justify-center pr-1 sm:pr-0">
          <h3 className="font-black text-white text-sm sm:text-base truncate tracking-wide">
            {inGameName}
          </h3>
          
          {/* Changed to flex-wrap to prevent overlap on narrow screens */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 w-full">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate hidden sm:inline-block max-w-[80px]">
              {name.split(" ").slice(0, 2).join(" ")}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/10 hidden sm:inline-block shrink-0" />
            
            {/* Win Rate Badge */}
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#ec4899] bg-[#ec4899]/10 px-1.5 py-[2px] rounded border border-[#ec4899]/20 shrink-0">
              <Flame className="w-2.5 h-2.5 shrink-0" />
              {winRate}% WR
            </span>

            {/* RECENT FORM INDICATOR (W-D-L) */}
            {recentForm.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10 shrink-0 hidden sm:block" />
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0" title="Last 5 Matches Form">
                  {recentForm.map((result, i) => (
                    <div 
                      key={i} 
                      // Reduced size slightly on mobile (w-3 h-3) to fit better
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[3px] sm:rounded-[4px] flex items-center justify-center text-[7px] sm:text-[8px] font-black border ${getFormStyle(result)}`}
                    >
                      {result.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* COMPARE BUTTON */}
        <div className="shrink-0 flex items-center justify-center pl-1 sm:pl-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if(onCompareClick) onCompareClick(player);
            }}
            className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all group cursor-pointer border border-white/5 hover:border-[#a855f7]/30"
            title="Compare Head-to-Head"
          >
            <Swords className="w-4 h-4 sm:w-3.5 sm:h-3.5 group-hover:scale-110 group-hover:text-[#a855f7] transition-all" />
            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block ml-1.5">Compare</span>
          </button>
        </div>

        {/* Points Hero */}
        <div className="text-right shrink-0 pl-2 md:pl-5 border-l border-white/10 ml-1">
          <div className={`text-2xl sm:text-3xl font-black leading-none tracking-tighter ${theme.ptsColor}`}>
            {pts}
          </div>
          <div className="text-[8px] uppercase tracking-[0.2em] text-gray-500 font-bold mt-1">
            Points
          </div>
        </div>
      </div>

      {/* Bottom Section: Stat Grid */}
      <div className="grid grid-cols-6 divide-x divide-white/5 bg-[#030305]/80 p-2 sm:p-3 relative z-10">
        <div
          onClick={() => onStatClick && onStatClick(player, "MP")}
          className="flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 rounded-md transition-colors py-1 group"
        >
          <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-0.5 group-hover:text-[#3b82f6] transition-colors">
            MP
          </div>
          <div className="font-bold text-xs sm:text-sm text-gray-300 group-hover:text-white">
            {mp}
          </div>
        </div>

        <div
          onClick={() => onStatClick && onStatClick(player, "W")}
          className="flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 rounded-md transition-colors py-1 group"
        >
          <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-0.5 group-hover:text-[#3b82f6] transition-colors">
            W
          </div>
          <div className="font-black text-xs sm:text-sm text-[#3b82f6] group-hover:text-blue-300">
            {w}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">
            D
          </div>
          <div className="font-bold text-xs sm:text-sm text-gray-400">{d}</div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">
            L
          </div>
          <div className="font-bold text-xs sm:text-sm text-rose-400">{l}</div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white/5 rounded-md mx-1">
          <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
            GD
          </div>
          <div className={`font-black text-xs sm:text-sm ${gd > 0 ? "text-[#a855f7] drop-shadow-[0_0_5px_rgba(168,85,247,0.3)]" : "text-gray-400"}`}>
            {gd > 0 ? `+${gd}` : gd}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">
            GF/GA
          </div>
          <div className="font-bold text-[10px] sm:text-xs">
            <span className="text-gray-300">{gf}</span>
            <span className="text-gray-600 mx-0.5">/</span>
            <span className="text-gray-500">{ga}</span>
          </div>
        </div>
      </div>
    </div>
  );
}