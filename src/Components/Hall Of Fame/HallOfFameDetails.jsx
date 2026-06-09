import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import AuthLoader from "../Loaders/AuthLoader";
import { API } from "../../axios";
import { ChevronRight, ArrowLeft, Target, ShieldAlert, Crown, Shield, Skull, Flame, Sparkles, Trophy, Medal } from "lucide-react";

// --- URL Formatters ---
const createSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

export const getFaceCropUrl = (url) => {
  if (!url || typeof url !== "string") return "https://placehold.co/400x600/1a1a1a/FFF?text=NO+IMAGE";
  if (url.includes("cloudinary.com")) {
    if (url.includes("g_face") || url.includes("g_auto")) return url;
    const cleanUrl = url.replace(/\/v\d+\//, '/');
    const newUrl = cleanUrl.replace(
      "/image/upload/", 
      "/image/upload/c_thumb,g_face,z_0.6,w_600,h_800,q_auto,f_auto/"
    );
    return newUrl.includes("?") ? `${newUrl}&v=trans3` : `${newUrl}?v=trans3`;
  }
  return url;
};

export default function HallOfFameDetails() {
  const { tournamentId } = useParams();

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

  console.log(response.data)
  const tournament = response?.data?.find((t) => t._id === tournamentId);
  if (!tournament || !tournament.hallOfFame)
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center text-white">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-black tracking-widest uppercase text-gray-500">Vault Empty</h2>
          <p className="text-gray-600 mt-2">Tournament records classified or not found.</p>
        </div>
      </div>
    );

  // ==========================================
  // PREMIUM "FUT CARD" THEME ENGINE
  // ==========================================
  const getAwardTheme = (awardName) => {
    const name = awardName.toLowerCase();
    if (name.includes("mvp") || name.includes("player of the tournament")) {
      return {
        cardBg: "from-[#1a1400] via-[#2a1f00] to-[#0a0800]",
        borderGlow: "border-yellow-500/20 shadow-[0_10px_30px_rgba(234,179,8,0.1)]",
        hoverGlow: "group-hover:shadow-[0_20px_40px_rgba(250,204,21,0.25)] group-hover:border-yellow-500/60",
        textAccent: "text-yellow-400",
        statsBg: "bg-gradient-to-t from-[#2a1f00] to-transparent",
        Icon: Crown,
      };
    }
    if (name.includes("scorer") || name.includes("boot") || name.includes("attacker")) {
      return {
        cardBg: "from-[#00141a] via-[#002233] to-[#000a0f]",
        borderGlow: "border-cyan-500/20 shadow-[0_10px_30px_rgba(6,182,212,0.1)]",
        hoverGlow: "group-hover:shadow-[0_20px_40px_rgba(6,182,212,0.25)] group-hover:border-cyan-500/60",
        textAccent: "text-cyan-400",
        statsBg: "bg-gradient-to-t from-[#002233] to-transparent",
        Icon: Target,
      };
    }
    if (name.includes("defender") || name.includes("glove") || name.includes("clean sheet")) {
      return {
        cardBg: "from-[#001a0f] via-[#00331f] to-[#000a05]",
        borderGlow: "border-emerald-500/20 shadow-[0_10px_30px_rgba(16,185,129,0.1)]",
        hoverGlow: "group-hover:shadow-[0_20px_40_rgba(16,185,129,0.25)] group-hover:border-emerald-500/60",
        textAccent: "text-emerald-400",
        statsBg: "bg-gradient-to-t from-[#00331f] to-transparent",
        Icon: Shield,
      };
    }
    if (name.includes("nemesis") || name.includes("killer") || name.includes("massacre")) {
      return {
        cardBg: "from-[#1a0005] via-[#33000f] to-[#0a0002]",
        borderGlow: "border-rose-600/20 shadow-[0_10px_30px_rgba(225,29,72,0.1)]",
        hoverGlow: "group-hover:shadow-[0_20px_40px_rgba(225,29,72,0.25)] group-hover:border-rose-500/60",
        textAccent: "text-rose-500",
        statsBg: "bg-gradient-to-t from-[#33000f] to-transparent",
        Icon: Skull,
      };
    }
    return {
      cardBg: "from-[#1a001a] via-[#2d0033] to-[#0a000a]",
      borderGlow: "border-pink-500/20 shadow-[0_10px_30px_rgba(236,72,153,0.1)]",
      hoverGlow: "group-hover:shadow-[0_20px_40px_rgba(236,72,153,0.25)] group-hover:border-pink-500/60",
      textAccent: "text-pink-400",
      statsBg: "bg-gradient-to-t from-[#2d0033] to-transparent",
      Icon: Sparkles,
    };
  };

  // --- RENDERING LOGIC FIX ---
  // 1. Pull directly from top-level keys
  const actualChampion = tournament.champion;
  const actualRunnerUp = tournament.runnerUp;

  // 2. Filter out Team-based awards from the individual honors grid (removes indices 4 & 5)
  const individualAwards = tournament.hallOfFame.awards.filter(
    (award,index) =>{
      if(tournament.type === "The Massacre Trilogy" && index<4) 
        return true;
      else if(index<3) // Keep all for Massacre Trilogy
        return true;
    }
  );

  // Safe Image Resolvers for Teams
  const champImg = actualChampion?.logo?.url || getFaceCropUrl(actualChampion?.avatar?.url || actualChampion?.image?.url);
  const runnerImg = actualRunnerUp?.logo?.url || getFaceCropUrl(actualRunnerUp?.avatar?.url || actualRunnerUp?.image?.url);

  return (
    <div className="min-h-screen bg-[#030305] pb-26 text-white p-6 md:p-12 relative overflow-hidden font-sans">
      
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0 opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col items-center mb-16 text-center">
          <Link
            to="/hall-of-fame"
            className="group flex items-center gap-2 text-gray-400 hover:text-white text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-8 transition-colors bg-[#0a0b10]/50 hover:bg-[#111218] px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Archives
          </Link>

          <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl mb-6 text-balance">
            {tournament.name}
          </h1>
          <div className="inline-flex items-center gap-3 px-8 py-2 bg-[#0a0b10]/80 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-full backdrop-blur-xl">
            <Trophy className="w-4 h-4 text-violet-400" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-gray-300">
              Official Collectibles
            </span>
          </div>
        </div>

        {/* ==========================================
            TOURNAMENT PODIUM (FROM TOP-LEVEL KEYS)
        ========================================== */}
        {(actualChampion || actualRunnerUp) && (
          <div className="w-full mb-24 flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-2 justify-center opacity-70">
              <div className="h-px bg-gradient-to-r from-transparent to-white/20 flex-1 max-w-[80px]" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-gray-400">
                Podium Finishers
              </span>
              <div className="h-px bg-gradient-to-l from-transparent to-white/20 flex-1 max-w-[80px]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {actualChampion && (
                <Link 
                  to={`/hall-of-fame/${tournamentId}/award/champion`}
                  className="lg:col-span-2 relative rounded-[2rem] border border-yellow-500/30 bg-gradient-to-br from-[#1a1400] via-[#2a1f00] to-[#0a0800] overflow-hidden shadow-[0_10px_40px_rgba(250,204,21,0.15)] group min-h-[500px] lg:min-h-[600px] block outline-none hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500"
                >
                  <div className="absolute inset-0 z-10">
                    <img
                      src={champImg}
                      alt="Champion"
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0800] via-[#0a0800]/60 to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 sm:p-10 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400 drop-shadow-md">
                        Grand Champion
                      </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-lg mb-2">
                      {actualChampion.name}
                    </h2>
                  </div>
                </Link>
              )}

              {actualRunnerUp && (
                <Link 
                  to={`/hall-of-fame/${tournamentId}/award/runner-up`}
                  className="lg:col-span-1 relative rounded-[2rem] border border-gray-400/30 bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#030712] overflow-hidden shadow-[0_10px_30px_rgba(156,163,175,0.1)] group min-h-[500px] lg:min-h-[600px] block outline-none hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500"
                >
                  <div className="absolute inset-0 z-10">
                    <img
                      src={runnerImg}
                      alt="Runner Up"
                      className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-80 transition-opacity duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] from-10% to-60% to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Medal className="w-5 h-5 text-gray-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                        Runner-Up
                      </span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-md">
                      {actualRunnerUp.name}
                    </h3>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mb-8 justify-center opacity-70">
          <div className="h-px bg-gradient-to-r from-transparent to-white/20 flex-1 max-w-[80px]" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-gray-400">
            Individual Honors
          </span>
          <div className="h-px bg-gradient-to-l from-transparent to-white/20 flex-1 max-w-[80px]" />
        </div>

        {/* ==========================================
            AWARDS GRID (FILTERED INDIVIDUAL AWARDS)
        ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
          {individualAwards.map((award, index) => {
            const previewStats = award.stats || [];
            const theme = getAwardTheme(award.awardName);
            const AwardIcon = theme.Icon;

            return (
              <div key={index} className="w-full max-w-[320px]">
                <Link
                  to={`/hall-of-fame/${tournamentId}/award/${createSlug(award.awardName)}`}
                  className={`group relative block outline-none transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] z-10 w-full aspect-[5/7] rounded-[2rem] border bg-gradient-to-br ${theme.cardBg} ${theme.borderGlow} ${theme.hoverGlow} overflow-hidden`}
                >
                  <div className="absolute inset-0 z-40 pointer-events-none opacity-0 group-hover:opacity-15 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white to-transparent mix-blend-overlay" />
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:12px_12px] opacity-10 pointer-events-none z-0" />

                  <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-30">
                    <div className="flex flex-col items-center">
                      <AwardIcon className={`w-8 h-8 ${theme.textAccent} drop-shadow-lg mb-1`} />
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${theme.textAccent} text-center max-w-[80px] leading-tight`}>
                        {award.awardName}
                      </span>
                    </div>

                    {award.teamContext?.logo?.url && (
                      <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/20 p-1.5 shadow-2xl">
                        <img 
                          src={award.teamContext.logo.url} 
                          alt="Team Logo" 
                          className="w-full h-full object-contain drop-shadow-md" 
                        />
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 z-10 [mask-image:linear-gradient(to_bottom,black_50%,transparent_95%)]">
                    <img
                      src={getFaceCropUrl(award.user?.avatar?.url || award.user?.image?.url)}
                      alt={award.user?.inGameUserName}
                      className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                    />
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 z-30 pt-20 pb-6 px-6 flex flex-col items-center text-center ${theme.statsBg}`}>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] mb-4">
                      {award.user?.inGameUserName}
                    </h2>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />

                    {previewStats.length > 0 && (
                      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
                        {previewStats.map((stat, i) => (
                          <div key={i} className="flex justify-between items-center px-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors">
                              {stat.label.split(' ').map(word => word.charAt(0)).join('').toUpperCase()} 
                            </span>
                            <span className={`text-sm font-black italic ${theme.textAccent} drop-shadow-md`}>
                              {stat.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-white/50">
                      Click to Inspect <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}