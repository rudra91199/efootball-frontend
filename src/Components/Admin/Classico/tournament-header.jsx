import { Shield, Users, Trophy } from "lucide-react";

export default function TournamentHeader({ tournament }) {
  const isLive = tournament?.status === "Live";
  const totalPlayers = tournament?.teams?.reduce((sum, team) => sum + (team.players?.length || 0), 0) || 0;

  return (
    <div className=" sm:pb-6 border-b border-white/5 animate-fade-in font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Left Side: Title & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wider truncate max-w-[500px] drop-shadow-lg">
            {tournament?.name}
          </h1>
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Massacre Pink Accent for Type */}
            <span className="px-3 py-1 rounded-md bg-[#ec4899]/10 border border-[#ec4899]/30 text-[#ec4899] text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
              {tournament?.type}
            </span>
            
            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                isLive 
                  ? "bg-gradient-to-r from-[#e11d48] to-[#ec4899] text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] border border-white/20 animate-pulse" 
                  : "bg-[#030305] text-gray-400 border border-white/10 shadow-inner"
              }`}
            >
              {isLive ? "Live Now" : tournament?.status}
            </span>
          </div>
        </div>

        {/* Right Side: Compact Stats Ribbon */}
        <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 bg-[#030305]/80 backdrop-blur-xl border border-white/5 rounded-[16px] px-6 py-3 relative overflow-hidden w-full lg:w-auto shrink-0 shadow-inner">
          {/* Bottom gradient line for the Massacre theme */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#e11d48] via-[#ec4899] to-transparent opacity-80" />
          
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#e11d48]" /> Squads
            </span>
            <span className="text-sm sm:text-base font-black text-white">
              {tournament?.teams?.length || 0}<span className="text-gray-600 text-xs">/{tournament?.maxTeams}</span>
            </span>
          </div>
          
          <div className="w-px h-8 bg-white/10" />

          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#ec4899]" /> Players
            </span>
            <span className="text-sm sm:text-base font-black text-white">{totalPlayers}</span>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1 flex items-center gap-1.5">
              <Trophy className="w-3 h-3 text-[#e11d48]" /> Prize Pool
            </span>
            <span className="text-sm sm:text-base font-black text-[#ec4899]">
              BDT {tournament?.prizes?.totalPool?.toLocaleString() || 0}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}