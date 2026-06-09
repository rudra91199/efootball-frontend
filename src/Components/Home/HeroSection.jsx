import { useNavigate } from "react-router";
import BgField from "./BgField";
import BgIcons from "./BgIcons";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[75vh] flex flex-col justify-center items-center text-center bg-[#05050a] overflow-hidden">
      
      {/* Background Layers */}
      <BgField position="absolute" opacity={40} />
      <BgIcons />
      
      {/* Massive Ambient Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-pink-600/15 via-indigo-900/10 to-transparent rounded-full blur-[80px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 px-6 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Glowing Pre-Header Badge */}
        <div className="mb-6 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md">
          <span className="text-[10px] sm:text-xs font-black text-pink-400 uppercase tracking-[0.2em] drop-shadow-md">
            The Ultimate Competitive Arena
          </span>
        </div>

        {/* Aggressive Typography Header */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tight flex flex-col items-center">
          <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            MASTER
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            eFOOTBALL
          </span>
        </h1>

        {/* Esports-style Subtext */}
        <p className="text-xs sm:text-sm md:text-base mb-10 max-w-2xl mx-auto text-gray-400 font-bold uppercase tracking-[0.15em] leading-relaxed">
          Join the elite competitive gaming platform. Prove your skill, climb the ranks, and dominate the arena.
        </p>

        {/* Hollow-Fill Action Button */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto">
          <button
            onClick={() => navigate("/tournaments")}
            className="relative w-full sm:w-auto overflow-hidden rounded-xl p-[2px] group transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:shadow-[0_0_60px_rgba(236,72,153,0.5)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
            <div className="relative bg-[#05050a] px-10 py-4 rounded-[10px] transition-all duration-300 group-hover:bg-opacity-0">
              <span className="relative z-10 text-white font-black text-sm sm:text-base uppercase tracking-[0.2em]">
                Enter The Arena
              </span>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;