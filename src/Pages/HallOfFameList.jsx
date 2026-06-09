import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { API } from "../axios";
import { Trophy, Swords, ChevronRight, Crosshair, Skull, Shield, Hexagon, Crown } from "lucide-react";
import AuthLoader from "../Components/Loaders/AuthLoader";

export default function HallOfFameList() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["hallOfFameTournaments"],
    queryFn: async () => {
      const res = await API.get("hall-of-fame/get-hall-of-fame", {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
      return res.data;
    },
  });


  if (isLoading) return <AuthLoader />;

  const tournaments = response?.data || [];

  // ==========================================
  // HARDCORE ESPORTS THEME ENGINE (Smooth/Football UI)
  // ==========================================
  const getTournamentTheme = (tournament) => {
    const type = tournament.type;
    const name = tournament.name.toLowerCase();

    // 1. MASSACRE TRILOGY (Aggressive Red, Hazard Stripes, Glitch)
    if (type === "The Massacre Trilogy" || name.includes("massacre")) {
      return {
        accent: "text-red-500",
        glow: "group-hover:shadow-[0_0_40px_rgba(220,38,38,0.3)]",
        border: "border-red-500/30 group-hover:border-red-500",
        bgBase: "bg-red-950/10",
        bgPattern: "bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(220,38,38,0.03)_10px,rgba(220,38,38,0.03)_20px)] bg-[length:200%_200%] group-hover:animate-[pan_3s_linear_infinite]",
        pill: "bg-red-500/20 border border-red-500/50 text-red-400",
        iconBtn: "bg-red-500 text-white",
        IconComponent: Skull,
        iconBgClass: "text-red-500/5 group-hover:text-red-500/15 group-hover:animate-glitch",
      };
    }

    // 2. GAUNTLET (Forged Amber, Hex Grid, Heavy Pulse)
    if (name.includes("gauntlet") || type === "Knockout") {
      return {
        accent: "text-orange-500",
        glow: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.3)]",
        border: "border-orange-500/30 group-hover:border-orange-500",
        bgBase: "bg-orange-950/10",
        bgPattern: "bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.1),transparent_70%)] group-hover:animate-pulse",
        pill: "bg-orange-500/20 border border-orange-500/50 text-orange-400",
        iconBtn: "bg-orange-500 text-white",
        IconComponent: Shield,
        iconBgClass: "text-orange-500/5 group-hover:text-orange-500/15 group-hover:-translate-y-2 transition-transform duration-500",
      };
    }

    // 3. TRIFECTA (Neon Pink, Cyber Matrix, Floating)
    if (type === "Trifecta" || name.includes("trifecta")) {
      return {
        accent: "text-pink-500",
        glow: "group-hover:shadow-[0_0_40px_rgba(236,72,153,0.3)]",
        border: "border-pink-500/30 group-hover:border-pink-500",
        bgBase: "bg-pink-950/10",
        bgPattern: "bg-[radial-gradient(rgba(236,72,153,0.1)_1px,transparent_1px)] bg-[size:16px_16px] group-hover:animate-[pan_10s_linear_infinite]",
        pill: "bg-pink-500/20 border border-pink-500/50 text-pink-400",
        iconBtn: "bg-pink-500 text-white",
        IconComponent: Hexagon,
        iconBgClass: "text-pink-500/5 group-hover:text-pink-500/15 group-hover:animate-[spin_6s_linear_infinite]",
      };
    }

    // 4. CHAMPIONS CIRCUIT (Prestige Gold, Shimmer)
    if (type === "Champions Circuit" || name.includes("top 4")) {
      return {
        accent: "text-yellow-400",
        glow: "group-hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]",
        border: "border-yellow-400/30 group-hover:border-yellow-400",
        bgBase: "bg-yellow-950/10",
        bgPattern: "bg-[linear-gradient(45deg,transparent_25%,rgba(250,204,21,0.05)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-[shimmer_2s_linear_infinite]",
        pill: "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400",
        iconBtn: "bg-yellow-500 text-black",
        IconComponent: Crown,
        iconBgClass: "text-yellow-500/5 group-hover:text-yellow-500/15 group-hover:scale-110 transition-transform duration-500",
      };
    }

    // 5. DEFAULT SOLO/LEAGUE (Cyan, Digital Scanline)
    return {
      accent: "text-cyan-400",
      glow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]",
      border: "border-cyan-500/30 group-hover:border-cyan-500",
      bgBase: "bg-cyan-950/10",
      bgPattern: "bg-[linear-gradient(to_bottom,transparent,rgba(6,182,212,0.08)_50%,transparent)] bg-[length:100%_200%] group-hover:animate-[scanline_1.5s_linear_infinite]",
      pill: "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400",
      iconBtn: "bg-cyan-500 text-black",
      IconComponent: Swords,
      iconBgClass: "text-cyan-500/5 group-hover:text-cyan-500/15 group-hover:rotate-12 transition-transform duration-500",
    };
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white p-6 pb-24 md:p-12 relative overflow-hidden font-sans">
      
      {/* --- CINEMATIC GRID BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />
      <div className="absolute top-[-20%] left-[10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- ESPORTS HEADER --- */}
        <div className="flex flex-col items-center justify-center text-center mb-20 lg:mb-28 pt-8">
          <div className="mb-6 flex items-center gap-3 px-6 py-2 border border-white/10 bg-white/5 backdrop-blur-md rounded-full shadow-lg">
            <Trophy className="w-4 h-4 text-pink-500" />
            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.4em]">
              The Ultimate Records Archive
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tighter leading-[1] drop-shadow-2xl italic">
            Hall Of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              Champions
            </span>
          </h1>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
          {tournaments.map((tournament) => {
            const serialCode = `ARC-${tournament._id.toString().substring(0, 6).toUpperCase()}`;
            const theme = getTournamentTheme(tournament);
            const MainIcon = theme.IconComponent;
            
            return (
              <Link
                key={tournament._id}
                to={`/hall-of-fame/${tournament._id}`}
                className="group outline-none"
              >
                {/* --- ESPORTS CARD CONTAINER (Smooth Football UI Shape) --- */}
                <div className={`relative h-full bg-[#0a0b10] border ${theme.border} rounded-3xl transition-all duration-500 ${theme.glow} transform group-hover:-translate-y-2 overflow-hidden`}>
                  
                  {/* --- DYNAMIC BACKGROUNDS --- */}
                  <div className={`absolute inset-0 ${theme.bgBase} z-0`} />
                  <div className={`absolute inset-0 ${theme.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`} />

                  <div className="p-8 flex flex-col h-full relative z-10">
                    
                    {/* Top Tech Data Row */}
                    <div className="flex justify-between items-start mb-10">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">
                          System ID
                        </span>
                        <span className={`text-xs font-black ${theme.accent} tracking-widest uppercase`}>
                          {serialCode}
                        </span>
                      </div>
                      
                      {/* Animated Targeting Reticle */}
                      <Crosshair className={`w-6 h-6 ${theme.accent} opacity-50 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-700`} />
                    </div>

                    {/* MASSIVE THEMATIC BACKGROUND ICON */}
                    <MainIcon 
                      className={`absolute -right-6 -bottom-6 w-52 h-52 ${theme.iconBgClass} pointer-events-none z-0`} 
                      strokeWidth={1} 
                    />

                    {/* Content Section */}
                    <div className="relative z-20 flex-1 mb-12">
                      {/* Rounded Badge */}
                      <div className={`inline-flex items-center px-4 py-1 mb-4 rounded-full ${theme.pill} backdrop-blur-md shadow-lg`}>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                          {tournament.type}
                        </span>
                      </div>

                      <h2 className={`text-3xl font-black text-white uppercase tracking-tighter italic leading-none transition-colors duration-300 drop-shadow-lg`}>
                        {tournament.name}
                      </h2>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="relative z-20 mt-auto pt-4 flex items-center justify-between border-t border-white/10 group-hover:border-white/20 transition-colors duration-300">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${theme.accent.replace('text-', 'bg-')} animate-ping`} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                          Access File
                        </span>
                      </div>
                      
                      {/* Smooth Circular Action Button */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 transition-all duration-300 group-hover:${theme.iconBtn.split(' ').join(' group-hover:')}`}>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          ESPORTS CUSTOM CSS ANIMATIONS
      ========================================== */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Thematic Background Animations */
        @keyframes pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes scanline {
          0% { background-position: 0 -100%; }
          100% { background-position: 0 200%; }
        }
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
      `}} />
    </div>
  );
}