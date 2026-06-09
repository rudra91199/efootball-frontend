import { useEffect, useState, useRef } from "react";
import { Trophy, Search, ShieldAlert, Calendar, Clock, ChevronDown } from "lucide-react";
import { LeaderboardTable } from "./LeaderboardTable";
import { LeaderboardCard } from "./LeaderboardCard";
import { TopThree } from "./TopThree";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../axios";
import useScrollReveal from "../../Hooks/userScrollReveal";
import { useAuthStore } from "../../store/authStore";
import PlayerStatModal from "./PlayerStatModal";
import ComparePlayersModal from "./ComparePlayersModal";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// CUSTOM DROPDOWN COMPONENT
// ==========================================
const CustomDropdown = ({
  value,
  onChange,
  options,
  groups,
  icon: Icon,
  colorClass = "text-white",
  activeColorClass = "text-[#a855f7]",
  hoverBorderClass = "hover:border-[#a855f7]/30",
  containerClass = "w-full sm:w-auto min-w-[160px]",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find current label
  let currentLabel = "Select";
  if (options) {
    const found = options.find((o) => o.value == value);
    if (found) currentLabel = found.label;
  } else if (groups) {
    for (const g of groups) {
      const found = g.options.find((o) => o.value == value);
      if (found) {
        currentLabel = found.label;
        break;
      }
    }
  }

  return (
    // Dynamically raise the z-index ONLY when open so it overlays neighboring dropdowns inside the card
    <div className={`relative group ${containerClass} ${isOpen ? 'z-[999]' : 'z-[40]'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-[#030305]/80 backdrop-blur-xl border border-white/10 rounded-xl transition-all ${hoverBorderClass} shadow-inner ${
          Icon ? "pl-10" : ""
        }`}
      >
        {Icon && (
          <Icon
            className={`absolute left-4 w-4 h-4 transition-colors pointer-events-none ${colorClass}`}
          />
        )}
        <span
          className={`text-xs sm:text-sm font-black uppercase tracking-wider truncate pr-4 ${colorClass}`}
        >
          {currentLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 pointer-events-none ${
            isOpen ? "rotate-180 text-white" : "group-hover:text-white"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[999] w-full mt-2 bg-[#0a0b10]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
          >
            {/* Render Flat Options */}
            {options &&
              options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-white/10 ${
                    value == opt.value ? activeColorClass : "text-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}

            {/* Render Grouped Options */}
            {groups &&
              groups.map((grp, idx) => (
                <div key={idx} className={idx > 0 ? "border-t border-white/5" : ""}>
                  <div className="px-4 py-2 text-[10px] font-black tracking-[0.2em] text-gray-500 bg-black/40">
                    {grp.label}
                  </div>
                  {grp.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-white/10 truncate ${
                        value == opt.value ? activeColorClass : "text-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function LeaderboardView({ playerTournaments }) {
  const [activeTab, setActiveTab] = useState("tournament-tables");
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuthStore();
  const [modalData, setModalData] = useState({
    isOpen: false,
    player: null,
    statType: null,
  });

  const [compareModal, setCompareModal] = useState({
    isOpen: false,
    player2: null,
  });

  // ==========================================
  // SMART TOURNAMENT SORTING & DEFAULTING
  // ==========================================
  const liveTournaments = playerTournaments?.filter((t) => t.status === "Live") || [];
  const completedTournaments = playerTournaments?.filter((t) => t.status === "Completed") || [];

  const [selectedTournament, setSelectedTournament] = useState("");

  // Automatically default to the latest Live tournament, or latest Completed if no Live exist
  useEffect(() => {
    if (playerTournaments?.length > 0 && !selectedTournament) {
      const defaultId = liveTournaments[0]?._id || completedTournaments[0]?._id || playerTournaments[0]?._id;
      setSelectedTournament(defaultId);
    }
  }, [playerTournaments, selectedTournament, liveTournaments, completedTournaments]);

  // ==========================================
  // GLOBAL FILTER STATES
  // ==========================================
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const currentYear = new Date().getFullYear();

  const [timeframe, setTimeframe] = useState("week");
  const [weekType, setWeekType] = useState("current");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generate dynamic years (e.g., 2024 to current + 1)
  const availableYears = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleStatClick = (player, statType) => {
    if (activeTab !== "tournament-tables") return;
    setModalData({ isOpen: true, player, statType });
  };

  const handleCompareClick = (player) => {
    setCompareModal({ isOpen: true, player2: player });
  };

  const fetchLeaderboard = async () => {
    if (activeTab === "global-leaderboards") {
      // Construct dynamic query params for Global Leaderboard
      const params = new URLSearchParams();
      if (timeframe !== "all") {
        params.append("timeframe", timeframe);
        if (timeframe === "week") {
          params.append("weekType", weekType);
        }
        if (timeframe === "month") {
          params.append("month", selectedMonth);
          params.append("year", selectedYear);
        }
        if (timeframe === "season") {
          params.append("year", selectedYear);
        }
      }
      const queryString = params.toString() ? `?${params.toString()}` : "";
      return await API.get(`/users/leaderboard/global${queryString}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    }
    
    // Tournament Leaderboard
    if (!selectedTournament) return { data: { data: [] } }; // Prevent fetching if no tournament selected
    return await API.get(`/users/leaderboards/tournament/${selectedTournament}`, {
      headers: { Authorization: localStorage.getItem("authToken") },
    });
  };

  // Note: We add all filter states to queryKey so it auto-refetches when changed
  const {
    data: { data: { data: leaderboard } = {} } = {},
    isLoading: leaderboardLoading,
  } = useQuery({
    queryKey: ["playerLeaderboard", selectedTournament, activeTab, timeframe, weekType, selectedMonth, selectedYear],
    queryFn: () => fetchLeaderboard(),
    enabled: activeTab === "global-leaderboards" || !!selectedTournament, // Only fetch when we have an ID
  });

  const filteredLeaderboard = leaderboard?.filter((player) => {
    if (activeTab === "tournament-tables" || activeTab === "global-leaderboards") {
      return player.playerInfo.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
    return false;
  });

  useScrollReveal("fade-in");

  // Construct Custom Groups for Tournament Dropdown
  const tournamentGroups = [];
  if (liveTournaments.length > 0) {
    tournamentGroups.push({
      label: "🔴 LIVE TOURNAMENTS",
      options: liveTournaments.map((t) => ({ value: t._id, label: t.name })),
    });
  }
  if (completedTournaments.length > 0) {
    tournamentGroups.push({
      label: "🏁 COMPLETED TOURNAMENTS",
      options: completedTournaments.map((t) => ({ value: t._id, label: t.name })),
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto sm:p-4 md:p-6 sm:space-y-8 font-sans relative">
      
      {/* FIX: ADDED z-[50] HERE so the entire top card sits strictly above the TopThree component */}
      <div className="bg-[#0a0b10]/60 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6 lg:pt-12 mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-[50]">
        
        {/* Glows container */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none">
          <div className="absolute top-[-50%] right-[-10%] w-80 h-80 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)]" />
          <div className="absolute bottom-[-50%] left-[-10%] w-80 h-80 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 fade-in z-10">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)] w-fit">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.3em]">
                Live Rankings
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#ec4899]">
                Leaderboard
              </span>
            </h1>
          </div>

          <div className="flex p-1.5 bg-[#030305]/80 backdrop-blur-xl rounded-[14px] border border-white/10 w-full md:w-auto shadow-inner relative z-10">
            {[
              { id: "tournament-tables", label: "Tournament" },
              { id: "global-leaderboards", label: "Global" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-[10px] text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 outline-none ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#ec4899] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================
            CONTROLS SECTION (Search & Filters)
        ========================================= */}
        {/* ADDED relative z-[60] so the dropdown container is highest within this card */}
        <div className="flex flex-col lg:flex-row gap-4 animate-fade-in relative z-[60] pt-4 w-full">
          {/* LEFT SIDE: SELECTORS */}
          <div className="flex-1 flex flex-wrap gap-3">
            {/* Tournament Mode Selectors */}
            {activeTab === "tournament-tables" && (
              <>
                {playerTournaments?.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-500/10 backdrop-blur-xl border border-rose-500/20 rounded-xl text-sm font-bold text-rose-400 uppercase tracking-widest">
                    <ShieldAlert className="w-4 h-4" />
                    <span>No Tournaments Available</span>
                  </div>
                ) : (
                  <CustomDropdown
                    value={selectedTournament}
                    onChange={setSelectedTournament}
                    groups={tournamentGroups}
                    containerClass="w-full sm:w-[350px]"
                  />
                )}
              </>
            )}

            {/* Global Mode Dynamic Filters */}
            {activeTab === "global-leaderboards" && (
              <>
                {/* 1. Primary Timeframe */}
                <CustomDropdown
                  value={timeframe}
                  onChange={setTimeframe}
                  options={[
                    { value: "all", label: "All-Time" },
                    { value: "week", label: "Weekly" },
                    { value: "month", label: "Monthly" },
                    { value: "season", label: "Seasonal" },
                  ]}
                  icon={Clock}
                  colorClass="text-[#3b82f6]"
                  activeColorClass="text-[#3b82f6]"
                  hoverBorderClass="hover:border-[#3b82f6]/30"
                  containerClass="w-full sm:w-auto min-w-[160px]"
                />

                {/* 2. Dynamic Sub-Filters based on Timeframe */}
                {timeframe === "week" && (
                  <div className="animate-slide-in-right duration-300 w-full sm:w-auto">
                    <CustomDropdown
                      value={weekType}
                      onChange={setWeekType}
                      options={[
                        { value: "current", label: "Current Week" },
                        { value: "last", label: "Last Week" },
                      ]}
                      hoverBorderClass="hover:border-white/30"
                      containerClass="w-full sm:w-auto min-w-[150px]"
                    />
                  </div>
                )}

                {timeframe === "month" && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-slide-in-right duration-300">
                    <CustomDropdown
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                      options={months.map((m, index) => ({
                        value: index + 1,
                        label: m,
                      }))}
                      containerClass="w-full sm:w-auto min-w-[140px]"
                    />
                    <CustomDropdown
                      value={selectedYear}
                      onChange={setSelectedYear}
                      options={availableYears.map((yr) => ({
                        value: yr,
                        label: yr.toString(),
                      }))}
                      icon={Calendar}
                      containerClass="w-full sm:w-auto min-w-[120px]"
                    />
                  </div>
                )}

                {timeframe === "season" && (
                  <div className="animate-slide-in-right duration-300 w-full sm:w-auto">
                    <CustomDropdown
                      value={selectedYear}
                      onChange={setSelectedYear}
                      options={availableYears.map((yr) => ({
                        value: yr,
                        label: `${yr} Season`,
                      }))}
                      icon={Calendar}
                      colorClass="text-[#ec4899]"
                      activeColorClass="text-[#ec4899]"
                      hoverBorderClass="hover:border-[#ec4899]/30"
                      containerClass="w-full sm:w-auto min-w-[160px]"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT SIDE: SEARCH BAR */}
          <div className="w-full lg:w-[350px] shrink-0 relative group">
            <input
              type="text"
              placeholder="SEARCH OPERATORS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-11 py-3.5 bg-[#030305]/80 backdrop-blur-xl border border-white/10 rounded-xl focus:ring-1 focus:ring-white/30 outline-none transition-all group-hover:border-white/20 placeholder:text-gray-600 text-white text-xs font-black tracking-widest shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* =========================================
          PODIUM & LIST CONTENT
      ========================================= */}

      {/* Set podium's wrapper z-index low (z-10) so it doesn't overlap the main card (z-[50]) */}
      {!searchQuery && (
        <div className="animate-fade-in relative z-10">
          {filteredLeaderboard?.length > 0 ? (
            <TopThree players={filteredLeaderboard?.slice(0, 3)} />
          ) : (
            <div className="text-center py-16 border border-white/5 rounded-3xl bg-[#0a0b10]/40 backdrop-blur-xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-inner relative z-10">
                <Trophy className="w-8 h-8 text-gray-600" />
              </div>
              <p className="font-black uppercase tracking-[0.2em] text-gray-400 text-sm relative z-10">
                Classified Data Empty
              </p>
              <p className="text-xs text-gray-600 mt-2 font-bold tracking-widest relative z-10">
                AWAITING MATCH RESULTS
              </p>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Content */}
      <div className="space-y-4 pt-4 relative z-10">
        {/* Desktop View */}
        <div className="hidden md:block fade-in bg-[#0a0b10]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <LeaderboardTable leaderboard={filteredLeaderboard} />
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 fade-in px-2">
          {filteredLeaderboard?.map((player, index) => (
            <LeaderboardCard
              key={index}
              player={player}
              index={index}
              isCurrentUser={player.playerInfo._id === user?._id}
              onStatClick={handleStatClick}
              onCompareClick={handleCompareClick}
            />
          ))}
        </div>
      </div>

      {/* =========================================
          MODALS
      ========================================= */}
      <PlayerStatModal
        isOpen={modalData.isOpen}
        onClose={() =>
          setModalData({ isOpen: false, player: null, statType: null })
        }
        player={modalData.player}
        statType={modalData.statType}
        tournamentId={selectedTournament}
      />

      <ComparePlayersModal
        isOpen={compareModal.isOpen}
        onClose={() => setCompareModal({ isOpen: false, player2: null })}
        initialPlayer2={compareModal.player2}
        tournamentId={
          activeTab === "tournament-tables" ? selectedTournament : "global"
        }
        allPlayers={filteredLeaderboard}
      />
    </div>
  );
}