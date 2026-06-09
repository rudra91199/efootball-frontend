import { useNavigate } from "react-router";
import { Swords, ChevronRight } from "lucide-react";

const ReadyToPlay = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-[#05050a] overflow-hidden border-t border-white/5">
      
      {/* Intense Center Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-pink-600/20 via-indigo-900/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      
      {/* Tech/HUD Corner Accents (Just for that extra AAA gaming detail) */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-indigo-500/30 opacity-50" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-pink-500/30 opacity-50" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-pink-500/30 opacity-50" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-indigo-500/30 opacity-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Pre-Header */}
        <div className="w-16 h-16 rounded-2xl bg-[#0a0a14] border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(236,72,153,0.15)]">
          <Swords className="w-8 h-8 text-pink-500" />
        </div>

        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-lg leading-tight">
          Ready To <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Dominate?
          </span>
        </h2>
        
        <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-[0.2em] mb-12 max-w-2xl mx-auto leading-relaxed">
          The arena is set. The brackets are waiting. Secure your identity and prove you belong among the elite.
        </p>
        
        {/* The Final Hollow-Fill Action Button */}
        <button 
          onClick={() => navigate('/signup')}
          className="relative w-full sm:w-auto overflow-hidden rounded-xl p-[2px] group transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:shadow-[0_0_60px_rgba(236,72,153,0.5)]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
          <div className="relative bg-[#05050a] px-10 py-5 rounded-[10px] flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-opacity-0">
            <span className="relative z-10 text-white font-black text-sm sm:text-base uppercase tracking-[0.2em]">
              Create Player Identity
            </span>
            <ChevronRight className="relative z-10 w-5 h-5 text-pink-400 group-hover:text-white transition-colors group-hover:translate-x-1" />
          </div>
        </button>

      </div>
    </section>
  );
};

export default ReadyToPlay;