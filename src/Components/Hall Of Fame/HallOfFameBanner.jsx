import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import AuthLoader from "../Loaders/AuthLoader";
import { API } from "../../axios";
import { ArrowLeft, Crown, Target, Shield, Skull, Flame, Sparkles, Download, Hexagon, Loader2, Medal, Users } from "lucide-react";
import { toPng } from "html-to-image";

const createSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

// ==========================================
// EXACT FACE CROP URL GENERATOR
// ==========================================
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

const SafeImage = ({ src, alt, className }) => {
  const [imgData, setImgData] = useState(null);
  useEffect(() => {
    if (!src) return;
    let isMounted = true;
    const fetchAsBase64 = async () => {
      try {
        const bypassCacheUrl = src.includes('?') ? `${src}&_t=${Date.now()}` : `${src}?_t=${Date.now()}`;
        const response = await fetch(bypassCacheUrl, { mode: 'cors', cache: 'no-cache' });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => { if (isMounted) setImgData(reader.result); };
        reader.readAsDataURL(blob);
      } catch (error) { if (isMounted) setImgData(src); }
    };
    fetchAsBase64();
    return () => { isMounted = false; };
  }, [src]);
  return <img src={imgData || src} alt={alt} className={className} crossOrigin="anonymous" />;
};

const getAwardTheme = (awardName) => {
  const name = awardName.toLowerCase();
  if (name.includes("mvp") || name.includes("champion")) return {
    ambient: "bg-yellow-600/20", accent: "text-yellow-400", borderGlow: "border-yellow-500/20",
    bgFade: "from-[#1a1400]/90 via-[#0a0800]/95 to-[#050400]", statBar: "bg-yellow-500/30", btnHover: "hover:bg-yellow-500 hover:text-black", Icon: Crown,
  };
  if (name.includes("runner-up")) return {
    ambient: "bg-gray-400/20", accent: "text-gray-300", borderGlow: "border-gray-400/20",
    bgFade: "from-[#1f2937]/90 via-[#111827]/95 to-[#030712]", statBar: "bg-gray-400/30", btnHover: "hover:bg-gray-200 hover:text-black", Icon: Medal,
  };
  if (name.includes("scorer") || name.includes("boot") || name.includes("attacker")) return {
    ambient: "bg-cyan-600/20", accent: "text-cyan-400", borderGlow: "border-cyan-500/20",
    bgFade: "from-[#001a26]/90 via-[#000d14]/95 to-[#00050a]", statBar: "bg-cyan-500/30", btnHover: "hover:bg-cyan-500 hover:text-black", Icon: Target,
  };
  if (name.includes("defender") || name.includes("glove") || name.includes("clean sheet")) return {
    ambient: "bg-emerald-600/20", accent: "text-emerald-400", borderGlow: "border-emerald-500/20",
    bgFade: "from-[#002617]/90 via-[#00140c]/95 to-[#000a06]", statBar: "bg-emerald-500/30", btnHover: "hover:bg-emerald-500 hover:text-black", Icon: Shield,
  };
  if (name.includes("nemesis") || name.includes("massacre")) return {
    ambient: "bg-rose-700/20", accent: "text-rose-500", borderGlow: "border-rose-500/20",
    bgFade: "from-[#33000f]/90 via-[#1a0008]/95 to-[#0a0003]", statBar: "bg-rose-500/30", btnHover: "hover:bg-rose-600 hover:text-white", Icon: Skull,
  };
  if (name.includes("grind") || name.includes("master")) return {
    ambient: "bg-orange-600/20", accent: "text-orange-400", borderGlow: "border-orange-500/20",
    bgFade: "from-[#1a0a00]/90 via-[#331400]/95 to-[#0a0400]", statBar: "bg-orange-500/30", btnHover: "hover:bg-orange-500 hover:text-black", Icon: Flame,
  };
  return {
    ambient: "bg-pink-600/20", accent: "text-pink-400", borderGlow: "border-pink-500/20",
    bgFade: "from-[#2d0033]/90 via-[#14001a]/95 to-[#0a000a]", statBar: "bg-pink-500/30", btnHover: "hover:bg-pink-500 hover:text-white", Icon: Sparkles,
  };
};

export default function HallOfFameBanner() {
  const { tournamentId, awardSlug } = useParams();
  const bannerRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["hallOfFameTournaments"],
    queryFn: async () => {
      const res = await API.get("hall-of-fame/get-hall-of-fame", {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
      return res.data;
    },
  });

  if (isLoading) return <AuthLoader />;

  const tournament = response?.data?.find((t) => t._id === tournamentId);
  const award = tournament?.hallOfFame?.awards.find((a) => {
    const slug = createSlug(a.awardName);
    if (awardSlug === "champion" && a.awardName.includes("Champion")) return true;
    if (awardSlug === "runner-up" && a.awardName.includes("Runner-Up")) return true;
    return slug === awardSlug;
  });

  if (award) {
    const isTeamTournament = ["Trifecta", "The Massacre Trilogy", "League + Knockout Team"].includes(tournament?.type);
    award.isTeam = isTeamTournament && (award.awardName.includes("Champion") || award.awardName.includes("Runner-Up"));
  }

  // ===============================================
  // THE SINGLE-ROW V-SHAPE LOGIC (TOP 4)
  // ===============================================
  let cinematicVLineup = [];
  if (award?.isTeam && award.user?.players?.length > 0) {
    const p = award.user.players; 
    if (p.length >= 4) {
      cinematicVLineup = [p[2], p[0], p[1], p[3]];
    } else {
      cinematicVLineup = p;
    }
  }

  // ==========================================
  // IOS-STABLE DOWNLOAD HANDLER
  // ==========================================
  const handleDownload = async () => {
    if (!bannerRef.current) return;
    setIsDownloading(true);
    
    try {
      // 1. Wait for web fonts/icons to finish loading
      await document.fonts.ready;

      const config = { 
        cacheBust: true, 
        pixelRatio: 2, 
        backgroundColor: "#030305", 
        filter: (n) => !n?.classList?.contains('hide-on-export') 
      };

      // 2. iOS / Safari Warm-up Pass
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS || isSafari) {
        await toPng(bannerRef.current, config);
        // Force a tiny visual tick to ensure Safari actually paints it
        await new Promise(resolve => setTimeout(resolve, 200)); 
      }

      // 3. Final Capture
      const dataUrl = await toPng(bannerRef.current, config);
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${award.awardName.replace(/\s+/g, '-')}.png`;
      
      // 4. Crucial for iOS: Append to DOM before click, then immediately remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Image generation failed:", error);
    } finally { 
      setIsDownloading(false); 
    }
  };

  const theme = getAwardTheme(award?.awardName || "");
  const AwardIcon = theme.Icon;
  const rawImageUrl = award?.user?.logo?.url || award?.user?.avatar?.url || award?.user?.image?.url;
  const heroImage = award?.isTeam ? rawImageUrl : getFaceCropUrl(rawImageUrl);
  const displayName = award?.user?.inGameUserName || award?.user?.name;

  if (!award) return <AuthLoader />;

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center p-4 pb-26 md:p-8 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <SafeImage src={heroImage} alt="Atmosphere" className="w-full h-full object-cover blur-[100px] opacity-40 scale-125 transform" />
        <div className={`absolute inset-0 ${theme.ambient} mix-blend-color`} />
        <div className="absolute inset-0 bg-[#030305]/60" />
      </div>

      <Link to={`/hall-of-fame/${tournamentId}`} className="fixed top-6 left-6 z-50 text-gray-400 hover:text-white uppercase tracking-[0.2em] text-xs font-black bg-black/40 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-xl flex items-center gap-2 transition-all hover:bg-white/10">
        <ArrowLeft className="w-4 h-4" /> Vault
      </Link>

      <div ref={bannerRef} className={`relative w-full max-w-[500px] min-h-[85vh] md:aspect-[4/5] md:min-h-0 rounded-[3rem] overflow-hidden flex flex-col border border-white/10 ${theme.borderGlow} bg-black/40 backdrop-blur-3xl z-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgFade} opacity-90 z-0`} />

        {/* HEADER */}
        <div className="relative z-20 pt-8 px-8 md:pt-10 md:px-10 flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-1 flex items-center gap-2"><Hexagon className="w-3 h-3" /> Official Dossier</span>
            <span className="text-sm font-black uppercase tracking-widest text-white/80 max-w-[220px] leading-tight">{tournament.name}</span>
          </div>
          {(award.teamContext?.logo?.url || (award.isTeam && award.user?.logo?.url)) && (
            <div className="w-14 h-14 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 p-2 shadow-2xl z-30">
              <SafeImage src={award.teamContext?.logo?.url || award.user?.logo?.url} alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        {/* MAIN IMAGE AREA */}
        <div className="relative w-full h-[380px] md:h-[460px] flex-shrink-0 z-10 mt-[-20px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 opacity-[0.03] pointer-events-none">
            <span className="text-[6rem] md:text-[8rem] font-black uppercase tracking-tighter leading-none whitespace-nowrap">{displayName}</span>
          </div>
          
          {award.isTeam ? (
            <div className="absolute inset-0 flex flex-row items-end justify-center px-4 z-10 pb-8 -space-x-8 sm:-space-x-12 md:-space-x-16">
              {cinematicVLineup.map((player, idx) => {
                const isWing = idx === 0 || idx === 3;
                const zIndex = isWing ? 10 : 20;
                const pushUp = isWing ? '-mb-2 sm:mb-20 md:mb-24' : 'mb-0';
                const scale = isWing ? 'scale-85 opacity-90' : 'scale-105';

                return (
                  <div key={idx} style={{ zIndex }} className={`relative w-[110px] sm:w-[140px] md:w-[170px] aspect-[3/4] flex-shrink-0 flex flex-col justify-end drop-shadow-2xl transition-all ${pushUp} ${scale}`}>
                    <SafeImage src={getFaceCropUrl(player.avatar?.url || player.image?.url)} alt={player.inGameUserName} className="w-full h-full object-cover object-center opacity-95 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] rounded-2xl" />
                  </div>
                );
              })}
            </div>
          ) : (
            <SafeImage src={heroImage} alt={displayName} className="w-full h-full object-cover object-center opacity-95 [mask-image:linear-gradient(to_bottom,black_40%,transparent_95%)] relative z-10 aspect-[3/4] mx-auto max-w-[260px] md:max-w-[320px] rounded-2xl" />
          )}
        </div>

        {/* INFO SECTION (DYNAMIC) */}
        <div className="relative z-20 px-6 sm:px-8 pb-8 flex flex-col flex-1 mt-[-40px]">
          <div className="flex items-center justify-center gap-3 mb-2">
            <AwardIcon className={`w-5 h-5 ${theme.accent}`} />
            <h1 className={`text-sm font-black uppercase tracking-[0.4em] ${theme.accent}`}>{award.awardName}</h1>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic text-center leading-none drop-shadow-2xl mb-6">{displayName}</h2>

          {/* CASE 1: SOLO/USERS TYPE - SHOW STATS DASHBOARD */}
          {!award.isTeam && award.stats?.length > 0 && (
            <div className="w-full bg-black/40 border border-white/5 rounded-3xl p-4 md:p-6 backdrop-blur-md mb-4 shadow-xl">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {award.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col group">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{stat.label}</span>
                    <span className="text-xl font-black italic text-white flex items-end gap-2">
                      {stat.value} 
                      <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden mb-1.5 ml-2">
                        <div className={`h-full w-full ${theme.statBar} rounded-full`} />
                      </div>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CASE 2: TEAM TYPE - SHOW CHAMPION ROSTER */}
          {award.isTeam && (
            <div className="w-full flex flex-col gap-2.5 mb-4 z-20">
              <div className="text-center mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center justify-center gap-2">
                  <Users className="w-3 h-3" /> Championship Roster
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-hide">
                {award.user?.players?.map((player, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-2xl p-1.5 backdrop-blur-md shadow-lg relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.statBar} opacity-60`} />
                    <SafeImage src={getFaceCropUrl(player.avatar?.url || player.image?.url)} alt={player.inGameUserName} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-[10px] font-black italic text-white uppercase truncate">{player.inGameUserName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1" />
          <div className="flex items-center mt-auto hide-on-export pt-2">
            <button onClick={handleDownload} disabled={isDownloading} className={`w-full flex items-center justify-center gap-3 py-4 rounded-full bg-white/5 border border-white/10 transition-all duration-300 text-xs font-black uppercase tracking-[0.3em] text-white/80 ${theme.btnHover}`}>
              {isDownloading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Download className="w-4 h-4" /> Download Official Record</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}