import { Gamepad2, Trophy, Star, Swords } from "lucide-react";

const BgIcons = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      
      {/* Top Left - Gold Trophy */}
      <div className="absolute top-24 left-[10%] sm:left-[20%] opacity-80 animate-[bounce_4s_infinite]">
        <div className="p-4 bg-yellow-500/10 backdrop-blur-md rounded-2xl border border-yellow-500/20 shadow-[0_0_30px_rgba(250,204,21,0.15)] transform -rotate-12">
          <Trophy className="w-8 h-8 text-yellow-400" />
        </div>
      </div>
      
      {/* Top Right - Pink Gamepad */}
      <div className="absolute top-40 right-[10%] sm:right-[20%] opacity-60 animate-[pulse_3s_infinite]">
        <div className="p-3 bg-pink-500/10 backdrop-blur-md rounded-xl border border-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.15)] transform rotate-12">
          <Gamepad2 className="w-8 h-8 text-pink-500" />
        </div>
      </div>
      
      {/* Bottom Left - Indigo Star */}
      <div className="absolute bottom-32 left-[15%] sm:left-[25%] opacity-70 animate-[bounce_5s_infinite] delay-700">
        <div className="p-3 bg-indigo-500/10 backdrop-blur-md rounded-full border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
          <Star className="w-6 h-6 text-indigo-400" />
        </div>
      </div>
      
      {/* Bottom Right - Purple Swords */}
      <div className="absolute bottom-24 right-[15%] sm:right-[25%] opacity-80 animate-[pulse_4s_infinite] delay-1000">
        <div className="p-4 bg-purple-500/10 backdrop-blur-md rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] transform rotate-45">
          <Swords className="w-8 h-8 text-purple-400" />
        </div>
      </div>

    </div>
  );
};

export default BgIcons;