import { MessageCircle, Users } from "lucide-react";

const HomeCommunity = () => {
  return (
    <section className="relative py-24 bg-[#05050a] overflow-hidden border-t border-white/5">
      
      {/* Background Ambient Glows */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-pink-900/15 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        <div className="mb-4 inline-flex px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.1)]">
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">
            The Inner Circle
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black mb-12 text-white uppercase tracking-wider drop-shadow-lg">
          Join The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Community</span>
        </h2>

        {/* Realistic but "Hype" Stat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          
          <div className="p-8 rounded-2xl bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-4xl sm:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              20+
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              Elite Players
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-4xl sm:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              100%
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              Admin Curated
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-4xl sm:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-indigo-600 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              24/7
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              Active Rivalries
            </div>
          </div>

        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          
          {/* Discord Button */}
          <button className="relative w-full sm:w-auto overflow-hidden rounded-xl p-[2px] group transition-all duration-300 hover:-translate-y-1 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
            <div className="relative bg-[#05050a] px-8 py-3.5 rounded-[10px] flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-opacity-0">
              <Users className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
              <span className="relative z-10 text-white font-black text-sm uppercase tracking-widest">
                Join Discord
              </span>
            </div>
          </button>

          {/* Messenger Button */}
          <button className="relative w-full sm:w-auto overflow-hidden rounded-xl p-[2px] group transition-all duration-300 hover:-translate-y-1 shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_40px_rgba(236,72,153,0.4)]">
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
            <div className="relative bg-[#05050a] px-8 py-3.5 rounded-[10px] flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-opacity-0">
              <MessageCircle className="w-5 h-5 text-pink-400 group-hover:text-white transition-colors" />
              <span className="relative z-10 text-white font-black text-sm uppercase tracking-widest">
                Messenger Chat
              </span>
            </div>
          </button>

        </div>
      </div>
    </section>
  );
};

export default HomeCommunity;