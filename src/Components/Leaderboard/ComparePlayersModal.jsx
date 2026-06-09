import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Swords, TrendingUp, Crosshair, Shield, Activity, PieChart as PieChartIcon, Target } from "lucide-react";
import { API } from "../../axios";
import { useAuthStore } from "../../store/authStore";
import { getFaceCropUrl } from "../../Utils/utils";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend
} from "recharts";

// --- 0. SOPHISTICATED GRID PATTERN STYLE ---
const gridPatternStyle = {
  backgroundImage: 'repeating-linear-gradient(#ffffff05 0px, #ffffff05 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, #ffffff05 0px, #ffffff05 1px, transparent 1px, transparent 16px)',
};

// --- 1. NEON TUG-OF-WAR BAR ---
const VersusBar = ({ label, p1Val, p2Val, suffix = "" }) => {
  const total = (p1Val || 0) + (p2Val || 0) || 1;
  const p1Pct = ((p1Val || 0) / total) * 100;
  const p2Pct = ((p2Val || 0) / total) * 100;

  return (
    <div className="w-full flex flex-col mb-5">
      <div className="flex justify-between items-end mb-1.5 px-1">
        <span className={`text-sm md:text-lg font-black ${p1Val >= p2Val ? 'text-[#3b82f6] drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]' : 'text-gray-500'}`}>
          {p1Val || 0}{suffix}
        </span>
        <span className="text-[9px] md:text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">{label}</span>
        <span className={`text-sm md:text-lg font-black ${p2Val >= p1Val ? 'text-[#ec4899] drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]' : 'text-gray-500'}`}>
          {p2Val || 0}{suffix}
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#030305] rounded-full flex overflow-hidden shadow-inner border border-white/5">
        <div className="h-full bg-[#3b82f6] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ width: `${p1Pct}%` }} />
        <div className="h-full bg-[#ec4899] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(236,72,153,0.8)]" style={{ width: `${p2Pct}%` }} />
      </div>
    </div>
  );
};

// --- 2. HOLOGRAPHIC PLAYER SELECTOR ---
const HolographicSelect = ({ value, onChange, players, placeholder, align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPlayer = players?.find(p => (p.playerInfo?._id || p._id) === value);
  const isBlue = align === "left";
  const glow = isBlue ? "hover:border-[#3b82f6] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] text-[#3b82f6]" : "hover:border-[#ec4899] hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] text-[#ec4899]";

  return (
    <div className={`relative w-full max-w-[200px] ${align === "right" ? "ml-auto" : ""}`} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full flex items-center justify-between px-4 py-2 bg-black/40 border border-white/10 rounded-lg outline-none backdrop-blur-md transition-all duration-300 ${glow}`}
      >
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest truncate">
          {selectedPlayer ? (selectedPlayer.playerInfo?.inGameUserName || selectedPlayer.inGameUserName) : placeholder}
        </span>
        <Activity size={14} className={`transition-opacity ${isOpen ? "opacity-100 animate-pulse" : "opacity-50"}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-[250px] bg-[#0a0b10]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 max-h-64 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
          {players?.map((p) => {
            const id = p.playerInfo?._id || p._id;
            const ign = p.playerInfo?.inGameUserName || p.inGameUserName || "Unknown";
            const img = getFaceCropUrl(p.playerInfo?.image?.url || p.image?.url) || "/placeholder.svg";
            return (
              <div key={id} onClick={() => { onChange(id); setIsOpen(false); }} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <img src={img} className="w-8 h-8 object-cover rounded-md border border-white/10 grayscale-[50%] hover:grayscale-0 transition-all" alt="" />
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest truncate">{ign}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- 3. MAIN MODAL COMPONENT ---
export default function ComparePlayersModal({ isOpen, onClose, initialPlayer2, tournamentId, allPlayers }) {
  const { user } = useAuthStore();
  const [p1Id, setP1Id] = useState(user?._id || "");
  const [p2Id, setP2Id] = useState("");

  useEffect(() => {
    if (initialPlayer2) setP2Id(initialPlayer2.playerInfo?._id || initialPlayer2._id);
  }, [initialPlayer2]);

  const { data: { data: { data: comparison } = {} } = {}, isLoading } = useQuery({
    queryKey: ["player-compare", p1Id, p2Id, tournamentId],
    queryFn: () => API.get(`/users/compare/${p1Id}/${p2Id}?tournamentId=${tournamentId || "global"}`, { headers: { Authorization: localStorage.getItem("authToken") } }),
    enabled: !!isOpen && !!p1Id && !!p2Id,
  });

  const p1Name = comparison?.player1?.info?.inGameUserName || "P1";
  const p2Name = comparison?.player2?.info?.inGameUserName || "P2";

  // Data Aggregation
  const totalH2HMatches = comparison?.headToHead?.totalMatches || 0;

  // RADAR CHART DATA (Normalized to 100% for perfect spider webs)
  const radarData = useMemo(() => {
    if (!comparison) return [];
    const makeRadarData = (stat, v1, v2) => {
      const max = Math.max(v1, v2) || 1;
      return { stat, p1Norm: (v1/max)*100, p2Norm: (v2/max)*100, p1Raw: v1, p2Raw: v2 };
    };
    
    return [
      makeRadarData("Win Rate", Number(comparison.player1?.overall?.winRate), Number(comparison.player2?.overall?.winRate)),
      makeRadarData("Goals/Match", Number(comparison.player1?.overall?.goalsFor)/Number(comparison.player1?.overall?.matches || 1), Number(comparison.player2?.overall?.goalsFor)/Number(comparison.player2?.overall?.matches || 1)),
      makeRadarData("Clean Sheets", Number(comparison.player1?.overall?.cleanSheets), Number(comparison.player2?.overall?.cleanSheets)),
      makeRadarData("H2H Wins", Number(comparison.headToHead?.player1Wins), Number(comparison.headToHead?.player2Wins)),
      makeRadarData("Momentum", comparison.player1?.overall?.recentForm?.filter(r=>r==='Win').length || 0, comparison.player2?.overall?.recentForm?.filter(r=>r==='Win').length || 0),
    ];
  }, [comparison]);

  // LINE CHART DATA (Momentum)
  const formChartData = useMemo(() => {
    if (!comparison) return [];
    const p1Form = [...(comparison.player1?.overall?.recentForm || [])].reverse();
    const p2Form = [...(comparison.player2?.overall?.recentForm || [])].reverse();

    return Array.from({ length: 5 }).map((_, i) => {
      const getPts = (r) => r === 'Win' ? 3 : r === 'Draw' ? 1 : 0;
      return { match: `M${i + 1}`, p1: p1Form[i] ? getPts(p1Form[i]) : null, p2: p2Form[i] ? getPts(p2Form[i]) : null };
    });
  }, [comparison]);

  // H2H PIE CHART DATA (Wins)
  const pieData = useMemo(() => {
    if (!comparison) return [];
    return [
      { name: p1Name, value: Number(comparison.headToHead?.player1Wins) || 0, color: "#3b82f6" }, 
      { name: "Draws", value: Number(comparison.headToHead?.draws) || 0, color: "#a855f7" }, 
      { name: p2Name, value: Number(comparison.headToHead?.player2Wins) || 0, color: "#ec4899" }, 
    ];
  }, [comparison, p1Name, p2Name]);

  // H2H PIE CHART DATA (Goals)
  const goalsPieData = useMemo(() => {
    if (!comparison) return [];
    return [
      { name: p1Name, value: Number(comparison.headToHead?.player1Goals) || 0, color: "#3b82f6" }, 
      { name: p2Name, value: Number(comparison.headToHead?.player2Goals) || 0, color: "#ec4899" }, 
    ];
  }, [comparison, p1Name, p2Name]);

  // Tooltips & Labels
  const CustomRadarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#030305]/90 border border-white/10 p-3 rounded-xl backdrop-blur-md">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 border-b border-white/10 pb-1">{data.stat}</p>
          <p className="text-xs font-black text-[#3b82f6]">{p1Name}: {typeof data.p1Raw === 'number' ? data.p1Raw.toFixed(1) : data.p1Raw}</p>
          <p className="text-xs font-black text-[#ec4899] mt-1">{p2Name}: {typeof data.p2Raw === 'number' ? data.p2Raw.toFixed(1) : data.p2Raw}</p>
        </div>
      );
    }
    return null;
  };

  const lineTooltipFormatter = (val) => val === 3 ? ['Win (3)'] : val === 1 ? ['Draw (1)'] : ['Loss (0)'];

  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    if (!value) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="900" className="drop-shadow-md">
        {value}
      </text>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#030305]/95 backdrop-blur-2xl flex items-center justify-center z-[9999] px-2 sm:px-6 font-sans animate-slide-in-left">
      
      {/* MASSIVE ARENA CONTAINER */}
      <div className="relative w-full max-w-6xl h-[95vh] bg-[#0a0b10] border border-white/10 sm:rounded-[32px] rounded-2xl overflow-hidden flex flex-col shadow-[0_0_150px_rgba(0,0,0,1)]">
        
        <div className="absolute inset-0 z-0" style={gridPatternStyle} />

        {/* --- HEADER --- */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50">
          <button onClick={onClose} className="p-3 text-gray-500 bg-white/5 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 rounded-xl transition-all hover:text-white hover:rotate-90 active:scale-95 shadow-xl backdrop-blur-md">
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          
          {/* ==========================================
              THE CLASH: TOP SPLIT SECTION
          ========================================== */}
          <div className="relative min-h-[300px] sm:min-h-[400px] flex items-center justify-center border-b border-white/10 overflow-hidden bg-[#030305]">
            
            {/* Background Split Gradients */}
            <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_left,rgba(59,130,246,0.2)_0%,transparent_80%)]" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_right,rgba(236,72,153,0.2)_0%,transparent_80%)]" />

            {/* Glowing Diagonal Slash */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent skew-x-[-20deg]" />

            <div className="relative z-10 w-full max-w-5xl px-4 sm:px-10 flex justify-between items-center h-full pt-10 pb-8">
              
              {/* PLAYER 1 (BLUE) */}
              <div className="flex flex-col items-start w-[40%]">
                <HolographicSelect value={p1Id} onChange={setP1Id} players={allPlayers} placeholder="P1 Operator" align="left" />
                <div className="mt-4 sm:mt-6 relative group perspective-1000">
                  <div className="absolute inset-0 bg-[#3b82f6] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                  <img src={getFaceCropUrl(comparison?.player1?.info?.image?.url)} className="relative w-24 h-24 sm:w-40 sm:h-40 object-cover rounded-[20px] sm:rounded-[32px] border-2 border-[#3b82f6] shadow-[0_0_30px_rgba(59,130,246,0.4)] transform-gpu rotate-y-[-10deg] group-hover:rotate-y-0 transition-transform duration-500 grayscale-[20%]" alt="P1" />
                </div>
                <h2 className="mt-4 text-xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#3b82f6] uppercase tracking-tighter drop-shadow-md truncate w-full text-left">
                  {p1Name}
                </h2>
              </div>

              {/* CENTER VS BADGE */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20 pointer-events-none mt-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#0a0b10] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center rotate-45 backdrop-blur-2xl">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-[#3b82f6]/20 to-[#ec4899]/20 rounded-xl sm:rounded-2xl border border-white/5 flex items-center justify-center">
                    <span className="text-xl sm:text-3xl font-black text-white -rotate-45 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">VS</span>
                  </div>
                </div>
              </div>

              {/* PLAYER 2 (PINK) */}
              <div className="flex flex-col items-end w-[40%]">
                <HolographicSelect value={p2Id} onChange={setP2Id} players={allPlayers?.filter(p => (p.playerInfo?._id || p._id) !== p1Id)} placeholder="P2 Operator" align="right" />
                <div className="mt-4 sm:mt-6 relative group perspective-1000">
                  <div className="absolute inset-0 bg-[#ec4899] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                  <img src={getFaceCropUrl(comparison?.player2?.info?.image?.url)} className="relative w-24 h-24 sm:w-40 sm:h-40 object-cover rounded-[20px] sm:rounded-[32px] border-2 border-[#ec4899] shadow-[0_0_30px_rgba(236,72,153,0.4)] transform-gpu rotate-y-[10deg] group-hover:rotate-y-0 transition-transform duration-500 grayscale-[20%]" alt="P2" />
                </div>
                <h2 className="mt-4 text-xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-[#ec4899] uppercase tracking-tighter drop-shadow-md truncate w-full text-right">
                  {p2Name}
                </h2>
              </div>

            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Activity className="w-12 h-12 text-white/50 animate-pulse mb-4" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] animate-pulse">Aggregating Combat Data...</p>
            </div>
          ) : comparison ? (
            
            /* ==========================================
               THE DATA CORE: ANALYTICS GRIDS
            ========================================== */
            <div className="p-4 sm:p-8 bg-gradient-to-b from-[#0a0b10] to-[#030305] min-h-screen">
              <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10">
                
                {/* DIRECT H2H HERO STRIP */}
                <div className="w-full bg-[#030305]/80 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/5 via-transparent to-[#ec4899]/5 pointer-events-none" />
                  
                  <div className="flex items-center gap-3 relative z-10 shrink-0">
                    <Swords className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="font-black text-white text-lg uppercase tracking-widest leading-none">H2H Dominance</h3>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">{totalH2HMatches} Direct Engagements</p>
                    </div>
                  </div>

                  <div className="flex-1 w-full relative z-10 px-4 md:px-12">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl sm:text-4xl font-black text-[#3b82f6]">{comparison.headToHead?.player1Wins}</span>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Draws</span>
                        <span className="text-xl font-black text-white">{comparison.headToHead?.draws}</span>
                      </div>
                      <span className="text-2xl sm:text-4xl font-black text-[#ec4899]">{comparison.headToHead?.player2Wins}</span>
                    </div>
                    <div className="w-full h-2 bg-[#0a0b10] rounded-full flex overflow-hidden">
                      <div className="h-full bg-[#3b82f6]" style={{ width: `${(comparison.headToHead?.player1Wins / (totalH2HMatches || 1)) * 100}%` }} />
                      <div className="h-full bg-white/20" style={{ width: `${(comparison.headToHead?.draws / (totalH2HMatches || 1)) * 100}%` }} />
                      <div className="h-full bg-[#ec4899]" style={{ width: `${(comparison.headToHead?.player2Wins / (totalH2HMatches || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>

                {/* TWO COLUMN ANALYTICS (Radar + Stats) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                  
                  {/* LEFT: THE RADAR CHART */}
                  <div className="bg-[#030305]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col backdrop-blur-xl shadow-inner">
                    <div className="flex items-center gap-3 mb-6 shrink-0">
                      <Crosshair className="w-5 h-5 text-gray-400" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Attribute Profile</h4>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                          <PolarGrid stroke="#ffffff15" />
                          <PolarAngleAxis dataKey="stat" tick={{ fill: '#888', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name={p1Name} dataKey="p1Norm" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.3} />
                          <Radar name={p2Name} dataKey="p2Norm" stroke="#ec4899" strokeWidth={3} fill="#ec4899" fillOpacity={0.3} />
                          <RechartsTooltip content={<CustomRadarTooltip />} cursor={{fill: 'transparent'}} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-8 mt-4">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.8)]" /><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{p1Name}</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ec4899] shadow-[0_0_10px_rgba(236,72,153,0.8)]" /><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{p2Name}</span></div>
                    </div>
                  </div>

                  {/* RIGHT: OVERALL CAREER COMPARISON */}
                  <div className="bg-[#030305]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col backdrop-blur-xl shadow-inner">
                    <div className="flex items-center gap-3 mb-8 shrink-0">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Career Aggregates</h4>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-2">
                      <VersusBar label="Win Rate %" p1Val={comparison.player1?.overall?.winRate} p2Val={comparison.player2?.overall?.winRate} />
                      <VersusBar label="Matches" p1Val={comparison.player1?.overall?.matches} p2Val={comparison.player2?.overall?.matches} />
                      <VersusBar label="Total Goals" p1Val={comparison.player1?.overall?.goalsFor} p2Val={comparison.player2?.overall?.goalsFor} />
                      <VersusBar label="Clean Sheets" p1Val={comparison.player1?.overall?.cleanSheets} p2Val={comparison.player2?.overall?.cleanSheets} />
                    </div>

                    {/* Recent Form Block */}
                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                      <div className="flex gap-1.5">
                        {comparison.player1?.overall?.recentForm?.map((r, i) => (
                          <span key={i} className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-[6px] text-[9px] font-black border ${r==='Win'?'bg-[#3b82f6]/20 border-[#3b82f6]/50 text-[#3b82f6]':r==='Draw'?'bg-[#a855f7]/20 border-[#a855f7]/50 text-[#a855f7]':'bg-[#e11d48]/20 border-[#e11d48]/50 text-[#e11d48]'}`}>{r[0]}</span>
                        ))}
                      </div>
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] text-center mx-2">Momentum</span>
                      <div className="flex gap-1.5">
                        {comparison.player2?.overall?.recentForm?.map((r, i) => (
                          <span key={i} className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-[6px] text-[9px] font-black border ${r==='Win'?'bg-[#ec4899]/20 border-[#ec4899]/50 text-[#ec4899]':r==='Draw'?'bg-[#a855f7]/20 border-[#a855f7]/50 text-[#a855f7]':'bg-[#e11d48]/20 border-[#e11d48]/50 text-[#e11d48]'}`}>{r[0]}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* ==========================================
                    DIRECT COMBAT HISTORY (The Pies & List)
                ========================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mt-2 sm:mt-4">
                  
                  {/* LEFT: H2H PIE CHARTS */}
                  <div className="bg-[#030305]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 backdrop-blur-xl shadow-inner">
                    
                    {/* Win Dist Pie */}
                    <div className="flex-1 flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-4">
                        <PieChartIcon className="w-4 h-4 text-[#a855f7]" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">H2H Wins</h4>
                      </div>
                      <div style={{ height: '180px', width: '100%' }}>
                        {totalH2HMatches > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none" labelLine={false} label={renderPieLabel}>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <RechartsTooltip contentStyle={{ backgroundColor: '#0a0b10', borderColor: '#ffffff10', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fff' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : <div className="flex items-center justify-center h-full text-gray-600 text-xs font-bold uppercase tracking-widest">No Data</div>}
                      </div>
                    </div>

                    {/* Goal Dist Pie */}
                    <div className="flex-1 flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-4 h-4 text-[#e11d48]" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">H2H Goals</h4>
                      </div>
                      <div style={{ height: '180px', width: '100%' }}>
                        {totalH2HMatches > 0 && (comparison.headToHead?.player1Goals > 0 || comparison.headToHead?.player2Goals > 0) ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={goalsPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none" labelLine={false} label={renderPieLabel}>
                                {goalsPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <RechartsTooltip contentStyle={{ backgroundColor: '#0a0b10', borderColor: '#ffffff10', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fff' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : <div className="flex items-center justify-center h-full text-gray-600 text-xs font-bold uppercase tracking-widest">No Data</div>}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: LAST 5 DIRECT MEETINGS */}
                  <div className="bg-[#030305]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col backdrop-blur-xl shadow-inner">
                    <div className="flex items-center gap-3 mb-6 shrink-0">
                      <Activity className="w-5 h-5 text-gray-400" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Last 5 Direct Meetings</h4>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center gap-3">
                      {comparison.headToHead?.matches?.length > 0 ? (
                        comparison.headToHead.matches.slice(0, 5).map((m, i) => {
                          const p1IsPlayerObj = m.player === p1Id || m.player?._id === p1Id;
                          const p1Score = p1IsPlayerObj ? m.scoreFor : m.scoreAgainst;
                          const p2Score = p1IsPlayerObj ? m.scoreAgainst : m.scoreFor;
                          
                          return (
                            <div key={i} className="flex justify-between items-center px-4 py-3 bg-[#0a0b10] rounded-xl border border-white/5 transition-colors hover:border-white/10">
                              <span className={`text-base sm:text-lg font-black ${p1Score > p2Score ? 'text-[#3b82f6]' : 'text-gray-500'}`}>{p1Score}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">VS</span>
                              </div>
                              <span className={`text-base sm:text-lg font-black ${p2Score > p1Score ? 'text-[#ec4899]' : 'text-gray-500'}`}>{p2Score}</span>
                            </div>
                          )
                        })
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">No Direct Matches Found</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* BOTTOM FULL WIDTH: MOMENTUM CHART */}
                <div className="bg-[#030305]/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col backdrop-blur-xl shadow-inner">
                  <div className="flex items-center gap-3 mb-8 shrink-0">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Form Trajectory (Last 5)</h4>
                  </div>
                  <div style={{ height: '250px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="match" stroke="#ffffff40" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} />
                        <YAxis stroke="#ffffff40" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} domain={[0, 3]} ticks={[0, 1, 3]} />
                        <RechartsTooltip formatter={lineTooltipFormatter} labelStyle={{ display: 'none' }} contentStyle={{ backgroundColor: '#0a0b10', borderColor: '#ffffff10', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: '#fff' }} />
                        <Line type="monotone" dataKey="p1" name={p1Name} stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: "#0a0b10", stroke: "#3b82f6", strokeWidth: 3 }} activeDot={{ r: 8, fill: "#3b82f6" }} />
                        <Line type="monotone" dataKey="p2" name={p2Name} stroke="#ec4899" strokeWidth={4} dot={{ r: 6, fill: "#0a0b10", stroke: "#ec4899", strokeWidth: 3 }} activeDot={{ r: 8, fill: "#ec4899" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}