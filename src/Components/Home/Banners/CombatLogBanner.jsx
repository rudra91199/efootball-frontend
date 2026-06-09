import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { API } from "../../../axios";
import { getFaceCropUrl } from "../../../Utils/utils";
import AuthLoader from "../../Loaders/AuthLoader";

export default function CombatLogBanner() {
  const [currentPage, setCurrentPage] = useState(0);

  const { data: { data: { data: tickerItems } = {} } = {}, isLoading } =
    useQuery({
      queryKey: ["live-ticker-matches"],
      queryFn: () =>
        API.get("/broadcast-ticker/ticker-data", {
          headers: { Authorization: localStorage.getItem("authToken") },
        }),
      refetchInterval: 30000,
    });

  // Filter only CombatLogs and grab the latest 10
  const matches = tickerItems?.filter((item) => item.type === "CombatLog").slice(0, 10) || [];

  // Internal Auto-Paginator (4-4-2 logic)
  const matchesPerPage = 4;
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000); // Switch pages every 5 seconds
    return () => clearInterval(timer);
  }, [totalPages]);

  if (isLoading) return <AuthLoader />;
  if (matches.length === 0) return null;

  const currentMatches = matches.slice(
    currentPage * matchesPerPage,
    (currentPage + 1) * matchesPerPage
  );

  // --- BANGLISH ROAST DICTIONARY (Action Verbs) ---
  const getRoastAction = (margin) => {
    const roasts = {
      0: [
        "ghame vije draw korlo",
        "hafaite hafaite stalemate korlo",
        "chul chirte chirte draw korlo"
      ],
      1: [
        "kono rokom ijjot bachay harailo",
        "kepe kepe harailo",
        "bap bap daak paraye harailo"
      ],
      2: [
        "shanti moton dhuise",
        "dhoira dhoira pitailo",
        "aramse haray dilo"
      ],
      3: [
        "math theke uraye dilo",
        "dhuwa dhuwa kore dilo",
        "nachte nachte pitailo"
      ],
      4: [
        "chokh mukhe ondhokar dekhay dilo",
        "bosta-bondi kore pitailo",
        "kadiye chere dilo"
      ],
      5: [
        "ijjoter faluda banano shikhalo ",
        "merciless bhabe khun korlo",
        "kono daya maya charai dhuise"
      ],
      6: [
        "human rights violation kore pitailo",
        "asto kacha kheye felse",
        "pitaye jibon tejpata kore dilo"
      ],
      7: [
        "game uninstall koray charlo",
        "dhore career ekhanei shesh kore dilo",
        "boshot-bari theke uched kore dilo"
      ]
    };

    const level = margin >= 7 ? 7 : margin;
    const options = roasts[level];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden py-4 sm:py-6">
      {/* Sleek Dark Background Texture */}
      <div className="absolute inset-0 bg-[#05050a] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent z-0 pointer-events-none" />

      {/* Compact Header */}
      <div className="relative z-10 flex flex-col items-center mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 drop-shadow-sm">
            Recent Massacres
          </h2>
          <Activity className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Matches Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full max-w-6xl px-4 flex-1 content-center min-h-[300px]">
        {currentMatches.map((match, idx) => (
          <div
            key={`${currentPage}-${idx}`} // Force re-render animation on page change
            className="bg-[#0a0b10]/90 liquid-glass-card low backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 animate-fade-in hover:border-white/20 transition-colors duration-300 min-h-[120px]"
          >
            <div className="flex flex-wrap items-center  gap-x-2.5 gap-y-3 text-center leading-relaxed">
              
              {match.isDraw ? (
                // ================= DRAW SENTENCE =================
                <>
                  <div className="flex items-center gap-2">
                    <img src={getFaceCropUrl(match.team1Image) || "/placeholder.svg"} alt="T1" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-600 object-cover" />
                    <span className="font-black text-white text-sm sm:text-lg">{match.team1}</span>
                  </div>
                  
                  <span className="text-amber-500 font-bold italic text-sm sm:text-lg px-1">{getRoastAction(0)}</span>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm sm:text-lg">{match.team2}</span>
                    <img src={getFaceCropUrl(match.team2Image) || "/placeholder.svg"} alt="T2" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-600 object-cover" />
                  </div>
                  
                  <span className="text-gray-400 font-bold text-sm sm:text-lg">-er sathe.</span>
                  
                  <span className="ml-1 bg-gray-800/80 px-2 py-1 rounded text-white font-black border border-gray-600 text-xs sm:text-sm whitespace-nowrap shadow-inner">
                    [{match.score1} - {match.score2}]
                  </span>
                </>
              ) : (
                // ================= WIN/LOSS SENTENCE =================
                <>
                  <div className="flex items-center flex-wrap gap-2">
                    <img src={getFaceCropUrl(match.winnerImage) || "/placeholder.svg"} alt="Winner" className="w-12 h-12 sm:w-10 sm:h-10 rounded-full border-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] object-cover" />
                    <span className="font-black text-white text-xs sm:text-lg drop-shadow-md">{match.winner}</span>
                  <span className="text-amber-500 text-wrap font-black italic text-base sm:text-lg drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] px-1">
                    {getRoastAction(match.margin)}
                  </span>
                  </div>
                  
                  
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-500 line-through text-xs sm:text-base">{match.loser}</span>
                    <img src={getFaceCropUrl(match.loserImage) || "/placeholder.svg"} alt="Loser" className="w-12 h-12 sm:w-10 sm:h-10 rounded-full border border-gray-700 grayscale opacity-60 object-cover" />
                  </div>
                  
                  <span className="text-gray-400 font-bold text-xs sm:text-base">-ke.</span>
                  
                  <span className="ml-1 bg-red-900/30 text-red-400 px-3 py-1 rounded border border-red-500/30 font-black tracking-widest text-xs sm:text-sm whitespace-nowrap shadow-inner">
                    [{Math.max(match.score1, match.score2)} - {Math.min(match.score1, match.score2)}]
                  </span>
                </>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* Pagination Indicators (Dots) */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-6 sm:mt-8 z-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentPage ? "w-8 bg-gray-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "w-2 bg-gray-700"}`}
            />
          ))}
        </div>
      )}

      {/* Quick CSS for fade-in animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}} />
    </div>
  );
}