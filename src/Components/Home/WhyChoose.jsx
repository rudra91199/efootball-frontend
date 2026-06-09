import { Flame, BarChart2, Crosshair } from "lucide-react";

const WhyChoose = () => {
  return (
    <section className="relative py-24 bg-[#080812] border-y border-white/5 overflow-hidden">
      
      {/* SECTION SEPARATOR: Top Glowing Cyber Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      
      {/* SECTION SEPARATOR: Cyber-Grid Texture */}
      {/* This draws a faint 32x32px grid that fades out at the edges using a radial mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/15 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* Header Area */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="mb-4 inline-flex px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
              The E-Football Center Difference
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white uppercase tracking-wider drop-shadow-lg">
            Beyond Ordinary <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Tournaments</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-[0.15em] max-w-2xl mx-auto leading-relaxed">
            We don't do basic brackets. We build immersive, high-stakes competition arenas for true esports athletes.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Unique Formats */}
          <div className="group relative p-8 rounded-2xl bg-[#0a0a14]/90 backdrop-blur-xl border border-white/5 hover:border-pink-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(236,72,153,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-[#05050a] border border-pink-500/30 text-pink-500 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(236,72,153,0.2)] group-hover:scale-110 group-hover:bg-pink-500/10 transition-all duration-300">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black mb-3 text-white uppercase tracking-wider">
                Exclusive Formats
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400 font-medium tracking-wide leading-relaxed">
                Tired of the same old standard brackets? From grueling Gauntlets to intense Clásico showdowns, our custom rulesets test true skill.
              </p>
            </div>
          </div>

          {/* Card 2: AAA Visuals (Stat Tracking) */}
          <div className="group relative p-8 rounded-2xl bg-[#0a0a14]/90 backdrop-blur-xl border border-white/5 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(250,204,21,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-[#05050a] border border-yellow-500/30 text-yellow-400 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(250,204,21,0.2)] group-hover:scale-110 group-hover:bg-yellow-500/10 transition-all duration-300">
                <BarChart2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black mb-3 text-white uppercase tracking-wider">
                Pro-Level Dashboard
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400 font-medium tracking-wide leading-relaxed">
                Feel like a real esports athlete. We track every point, goal difference, and win rate with stunning, broadcast-quality visuals.
              </p>
            </div>
          </div>

          {/* Card 3: Curated Admin Execution */}
          <div className="group relative p-8 rounded-2xl bg-[#0a0a14]/90 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-[#05050a] border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-300">
                <Crosshair className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black mb-3 text-white uppercase tracking-wider">
                Curated Execution
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400 font-medium tracking-wide leading-relaxed">
                Focus entirely on your gameplay. Play your in-game friendlies based on our fixtures, submit your scores, and let our admins handle the data.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      {/* SECTION SEPARATOR: Bottom Glowing Cyber Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      
    </section>
  );
};

export default WhyChoose;