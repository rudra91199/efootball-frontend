import { Trophy, Medal, Star } from "lucide-react";
import { getFaceCropUrl } from "../../Utils/utils";

export function LeaderboardTable({ leaderboard, userId }) {
  
  // ==========================================
  // RANK BADGE ENGINE
  // ==========================================
  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ec4899]/10 border border-[#ec4899]/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
          <Trophy className="w-5 h-5 text-[#ec4899] drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Medal className="w-5 h-5 text-[#3b82f6] drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#e11d48]/10 border border-[#e11d48]/30 shadow-[0_0_15px_rgba(225,29,72,0.2)]">
          <Medal className="w-5 h-5 text-[#e11d48] drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#030305] border border-white/5">
        <span className="text-sm font-black text-gray-500">{index + 1}</span>
      </div>
    );
  };

  return (
    // Table Wrapper with subtle internal background grid
    <div className="w-full overflow-x-auto custom-scrollbar relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      
      <table className="w-full text-left border-collapse relative z-10 min-w-[800px]">
        
        {/* --- HEADER --- */}
        <thead>
          <tr className="border-b border-white/10 bg-[#030305]/80 backdrop-blur-md">
            <th className="py-5 px-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap text-center w-20">
              Rank
            </th>
            <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap">
              Operator
            </th>
            <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap text-center">
              MP
            </th>
            <th className="py-5 px-4 text-[10px] font-black text-[#3b82f6] uppercase tracking-[0.25em] whitespace-nowrap text-center">
              W
            </th>
            <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] whitespace-nowrap text-center">
              D
            </th>
            <th className="py-5 px-4 text-[10px] font-black text-[#e11d48] uppercase tracking-[0.25em] whitespace-nowrap text-center">
              L
            </th>
            <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap text-center">
              GF
            </th>
            <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap text-center">
              GA
            </th>
            <th className="py-5 px-4 text-[10px] font-black text-[#a855f7] uppercase tracking-[0.25em] whitespace-nowrap text-center">
              GD
            </th>
            <th className="py-5 px-6 text-[11px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap text-right">
              Points
            </th>
          </tr>
        </thead>

        {/* --- BODY --- */}
        <tbody className="divide-y divide-white/5">
          {leaderboard?.map((player, index) => {
            const isCurrentUser = player.playerInfo._id === userId;
            
            return (
              <tr
                key={index}
                className={`group transition-all duration-300 hover:bg-white/[0.03] ${
                  isCurrentUser ? "bg-white/[0.02]" : ""
                }`}
              >
                {/* 1. Rank */}
                <td className="py-4 px-6 relative">
                  {/* Current User Left-Edge Indicator */}
                  {isCurrentUser && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3b82f6] via-[#a855f7] to-[#ec4899]" />
                  )}
                  <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {getRankBadge(index)}
                  </div>
                </td>

                {/* 2. Player Info */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={getFaceCropUrl?.(player.playerInfo.image?.url) || player.playerInfo.image?.url || "/placeholder.svg"}
                        alt={player.playerInfo.name}
                        className={`w-12 h-12 rounded-[14px] object-cover border-2 transition-all duration-300 ${
                          index === 0 ? "border-[#ec4899]" :
                          index === 1 ? "border-[#3b82f6]" :
                          index === 2 ? "border-[#e11d48]" :
                          "border-white/10 grayscale-[30%] group-hover:grayscale-0"
                        }`}
                      />
                      {isCurrentUser && (
                        <div className="absolute -bottom-1.5 -right-1.5 bg-[#030305] rounded-full p-0.5 border border-white/10">
                          <Star className="w-3.5 h-3.5 text-[#a855f7] fill-[#a855f7]" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-sm sm:text-base font-black uppercase tracking-wider truncate max-w-[200px] ${isCurrentUser ? "text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-white"}`}>
                        {player.playerInfo.inGameUserName || player.playerInfo.name}
                      </span>
                      {player.playerInfo.inGameUserName && (
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-[200px]">
                          {player.playerInfo.name}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* 3. Base Stats */}
                <td className="py-4 px-4 text-center font-bold text-sm text-gray-400">
                  {player.matchesPlayed}
                </td>
                
                <td className="py-4 px-4 text-center">
                  <span className="inline-block w-8 py-1 rounded bg-[#3b82f6]/10 text-[#3b82f6] font-black text-sm border border-[#3b82f6]/20">
                    {player.wins}
                  </span>
                </td>
                
                <td className="py-4 px-4 text-center font-bold text-sm text-gray-500">
                  {player.draws}
                </td>
                
                <td className="py-4 px-4 text-center">
                  <span className="inline-block w-8 py-1 rounded bg-[#e11d48]/10 text-[#e11d48] font-black text-sm border border-[#e11d48]/20">
                    {player.losses}
                  </span>
                </td>

                {/* 4. Goal Stats */}
                <td className="py-4 px-4 text-center font-black text-sm text-gray-300">
                  {player.goalsScored}
                </td>
                
                <td className="py-4 px-4 text-center font-black text-sm text-gray-500">
                  {player.goalsConceded}
                </td>
                
                <td className="py-4 px-4 text-center">
                  <span className={`font-black text-sm ${player.goalDifference > 0 ? "text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" : "text-gray-500"}`}>
                    {player.goalDifference > 0 ? `+${player.goalDifference}` : player.goalDifference}
                  </span>
                </td>

                {/* 5. Points */}
                <td className="py-4 px-6 text-right">
                  <span className={`text-2xl font-black tracking-tighter ${
                    index < 3 || isCurrentUser 
                      ? "text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400" 
                      : "text-gray-300"
                  }`}>
                    {player.points}
                  </span>
                </td>
                
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}