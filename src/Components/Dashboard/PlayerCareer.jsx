import { useState, useRef, useEffect } from "react";
import CareerOverview from "./Career Section/CareerOverview";
import CareerGoals from "./Career Section/CareerGoals";
import CareerAchievements from "./Career Section/CareerAchievements";
import CareerSeasonHistory from "./Career Section/CareerSeasonHistory";
import CareerMatchResults from "./Career Section/CareerMatchResults";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../axios";
import { useAuthStore } from "../../store/authStore";

import {
  LayoutDashboard,
  Target,
  CalendarDays,
  History,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Goal,
  Award,
  Star,
  Zap,
  Flame,
  Trophy,
  TrendingUp,
  ShieldCheck,
  Play,
  Swords,
  Crown,
  Shield,
  Activity,
  Medal,
} from "lucide-react";

import moment from "moment";

export default function CareerSection() {
  const [selectedPeriod, setSelectedPeriod] = useState("all-time");
  const [selectedCategory, setSelectedCategory] = useState("overview");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user } = useAuthStore();

  const milestones = [
    // --- MATCH APPEARANCES ---
    { id: "firstMatch", title: "The Debut", description: "Played your first competitive match", date: "", icon: <Play />, category: "matches" },
    { id: "veteran50", title: "Seasoned Pro", description: "Reached 50 match appearances", date: "", icon: <Swords />, category: "matches" },
    { id: "centurionMatches", title: "Centurion Appearance", description: "Reached 100 match appearances", date: "", icon: <Activity />, category: "matches" },

    // --- WINS ---
    { id: "firstWin", title: "Taste of Glory", description: "Secured your first victory", date: "", icon: <Target />, category: "achievements" },
    { id: "halfCenturyWins", title: "Golden Form", description: "Achieved 50 career wins", date: "", icon: <Medal />, category: "achievements" },
    { id: "centurionWins", title: "Century of Victories", description: "Achieved 100 career wins", date: "", icon: <Crown />, category: "achievements" },

    // --- GOALS (CUMULATIVE) ---
    { id: "firstGoal", title: "The Opener", description: "Scored your first competitive goal", date: "", icon: <Goal />, category: "goals" },
    { id: "halfCenturyGoals", title: "Half-Century Marksman", description: "Reached 50 career goals", date: "", icon: <Target />, category: "goals" },
    { id: "centuryClub", title: "Century Club", description: "Reached 100 career goals", date: "", icon: <Award />, category: "goals" },
    { id: "doubleCenturyGoals", title: "Double Centurion", description: "Reached 200 career goals", date: "", icon: <Star />, category: "goals" },

    // --- GOALS (SINGLE MATCH) ---
    { id: "brace", title: "Deadly Duo", description: "Scored a brace (2 goals) in a match", date: "", icon: <Goal />, category: "goals" },
    { id: "hatTrickHero", title: "Match Ball Secured", description: "Scored a hat-trick (3 goals)", date: "", icon: <Star />, category: "goals" },
    { id: "poker", title: "Four-Star Display", description: "Scored a poker (4 goals) in a match", date: "", icon: <Zap />, category: "goals" },
    { id: "glut", title: "The High Five", description: "Scored a glut (5 goals) in a match", date: "", icon: <Flame />, category: "goals" },
    { id: "doubleHatTrick", title: "Six-Star Display", description: "Scored a double hat-trick (6 goals)", date: "", icon: <Zap />, category: "goals" },
    { id: "tripleHatTrick", title: "Ultimate Finisher", description: "Scored a triple hat-trick (9 goals)", date: "", icon: <Flame />, category: "goals" },

    // --- STREAKS ---
    { id: "winStreak5", title: "On Fire", description: "Achieved a 5-match win streak", date: "", icon: <TrendingUp />, category: "achievements" },
    { id: "winStreak10", title: "Unstoppable", description: "Achieved a 10-match win streak", date: "", icon: <Zap />, category: "achievements" },
    { id: "winStreakMaster", title: "The Invincibles", description: "Achieved a 15-match win streak", date: "", icon: <Crown />, category: "achievements" },
    { id: "unbeaten10", title: "Tough to Beat", description: "Went 10 matches unbeaten", date: "", icon: <Shield />, category: "defense" },
    { id: "unbeaten20", title: "Immortality", description: "Went 20 matches unbeaten", date: "", icon: <ShieldCheck />, category: "defense" },

    // --- DEFENSE ---
    { id: "firstCleanSheet", title: "Shutout", description: "Kept your first clean sheet", date: "", icon: <Shield />, category: "defense" },
    { id: "cleanSheet10", title: "Brick Wall", description: "Achieved 10 clean sheets", date: "", icon: <ShieldCheck />, category: "defense" },
    { id: "cleanSheetKing", title: "Defensive Masterclass", description: "Achieved 50 clean sheets", date: "", icon: <ShieldCheck />, category: "defense" },

    // --- MAN OF THE MATCH ---
    { id: "firstMOTM", title: "Star of the Show", description: "Earned your first MOTM award", date: "", icon: <Star />, category: "achievements" },
    { id: "motm10", title: "Consistent Brilliance", description: "Earned 10 MOTM awards", date: "", icon: <Medal />, category: "achievements" },
    { id: "motm50", title: "Legendary Status", description: "Earned 50 MOTM awards", date: "", icon: <Crown />, category: "achievements" },

    // --- TOURNAMENTS ---
    { id: "tournamentChampion", title: "Silverware Secured", description: "Won your first tournament", date: "", icon: <Trophy />, category: "achievements" },
    { id: "multiChampion", title: "Dynasty Builder", description: "Won 3 tournaments", date: "", icon: <Crown />, category: "achievements" },
  ];

  const categories = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} strokeWidth={2} /> },
    { id: "goals", label: "Scoring", icon: <Target size={20} strokeWidth={2} /> },
    { id: "achievements", label: "Records", icon: <Medal size={20} strokeWidth={2} /> },
    { id: "seasons", label: "Seasons", icon: <CalendarDays size={20} strokeWidth={2} /> },
    { id: "matches", label: "Matches", icon: <History size={20} strokeWidth={2} /> },
  ];

  const currentIndex = categories.findIndex((cat) => cat.id === selectedCategory);
  const progressPercentage = ((currentIndex + 1) / categories.length) * 100;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedCategory(categories[currentIndex - 1].id);
    } else {
      setSelectedCategory(categories[categories.length - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < categories.length - 1) {
      setSelectedCategory(categories[currentIndex + 1].id);
    } else {
      setSelectedCategory(categories[0].id);
    }
  };

  const handleSelectFromDropdown = (id) => {
    setSelectedCategory(id);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatColor = (value, threshold) => {
    if (value >= threshold.excellent) return "text-green-400";
    if (value >= threshold.good) return "text-yellow-400";
    return "text-red-400";
  };

  const getResultColor = (result) => {
    switch (result.toLowerCase()) {
      case "win": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "draw": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "loss": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-foreground bg-background/50";
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 9.0) return "text-green-400";
    if (rating >= 8.0) return "text-yellow-400";
    if (rating >= 7.0) return "text-orange-400";
    return "text-red-400";
  };

  const { data: { data: { data: playerTournaments } = {} } = {} } = useQuery({
    queryKey: ["playerTournaments", user._id],
    queryFn: () => API.get(`/users/${user._id}/tournaments`, { headers: { Authorization: localStorage.getItem("authToken") } }),
  });

  const { data: { data: { data: playerCareerStats } = {} } = {} } = useQuery({
    queryKey: ["careerStats", user._id],
    queryFn: () => API.get(`/users/getFullStats/${user._id}`, { headers: { Authorization: localStorage.getItem("authToken") } }),
  });

  const { data: { data: { data: { scoringRecords, goalMilestones } = {} } = {} } = {}, isLoading } = useQuery({
    queryKey: ["scoringStats", user._id],
    queryFn: () => API.get(`/users/getScoringStats/${user._id}`, { headers: { Authorization: localStorage.getItem("authToken") } }),
  });

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider drop-shadow-md">
            CAREER{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-pink)] to-[var(--color-neon-blue)]">
              OVERVIEW
            </span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium">
            Complete career statistics and achievements since{" "}
            {moment(user?.createdAt).format("ll")}
          </p>
        </div>

        <div className="liquid-glass-card black inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-[var(--color-deep-blue)] w-fit">
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-pink)] animate-pulse" />
            <span className="text-[10px] sm:text-xs text-gray-300 uppercase tracking-widest font-black">
              Started • {moment(user?.createdAt).format("YYYY")}
            </span>
          </div>
        </div>
      </div>

      {/* --- MODERN APP NAVIGATION --- */}
      <div className="relative w-full px-1 sm:max-w-md mx-auto sm:mx-0" ref={dropdownRef}>
        <div className="relative bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-between p-2">
          <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-neon-pink)] to-[var(--color-neon-blue)] transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <button onClick={handlePrev} className="relative z-10 p-3 text-gray-500 hover:text-white transition-colors active:scale-90">
            <ChevronLeft size={24} strokeWidth={2} />
          </button>

          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative z-10 flex-1 flex items-center justify-center gap-4 py-2 px-2 hover:bg-white/[0.02] rounded-xl transition-colors group">
            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[var(--color-deep-blue)] to-[#05050a] flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,77,169,0.2),0_0_15px_rgba(255,77,169,0.1)] border border-[var(--color-neon-pink)]/30 group-hover:border-[var(--color-neon-pink)]/60 transition-colors relative">
              <div className="absolute inset-0 bg-[var(--color-neon-pink)]/10 blur-md rounded-[14px]"></div>
              <span className="relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                {categories[currentIndex].icon}
              </span>
            </div>
            <div className="flex flex-col items-start justify-center">
              <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-0.5 flex items-center gap-2">
                {currentIndex + 1} OF {categories.length}
                <ChevronDown size={12} strokeWidth={3} className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-[var(--color-neon-pink)]" : ""}`} />
              </div>
              <span className="text-xl font-black text-white tracking-wide leading-none">
                {categories[currentIndex].label}
              </span>
            </div>
          </button>

          <button onClick={handleNext} className="relative z-10 p-3 text-gray-500 hover:text-white transition-colors active:scale-90">
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        </div>

        {/* --- DROPDOWN MENU --- */}
        <div className={`liquid-glass-card black absolute top-[calc(100%+12px)] left-0 right-0 z-50 bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 transform origin-top shadow-[0_20px_40px_rgba(0,0,0,0.9)] ${isDropdownOpen ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-y-95 -translate-y-4 pointer-events-none"}`}>
          <div className="relative z-10 flex flex-col p-2 space-y-1">
            {categories.map((category, index) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleSelectFromDropdown(category.id)}
                  className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 text-left w-full group ${isActive ? "bg-white/[0.04] border border-white/5" : "bg-transparent hover:bg-white/[0.02]"}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? "bg-gradient-to-br from-[var(--color-deep-blue)] to-[#05050a] border border-[var(--color-neon-pink)]/40 shadow-[inset_0_0_10px_rgba(255,77,169,0.2)]" : "bg-[#111116] border border-white/5"}`}>
                    <span className={`${isActive ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "text-gray-500 group-hover:text-gray-300"}`}>
                      {category.icon}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-600 font-bold tracking-widest uppercase">
                      Step {index + 1}
                    </span>
                    <span className={`font-black tracking-wide text-base ${isActive ? "text-white" : "text-gray-400"}`}>
                      {category.label}
                    </span>
                  </div>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-neon-pink)] shadow-[0_0_8px_var(--color-neon-pink)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Components */}
      {selectedCategory === "overview" && <CareerOverview careerStats={playerCareerStats} />}
      {selectedCategory === "goals" && <CareerGoals careerStats={scoringRecords} milestones={milestones} goalMilestones={goalMilestones} isLoading={isLoading} />}
      {selectedCategory === "achievements" && <CareerAchievements milestones={milestones} goalMilestones={goalMilestones} isLoading={isLoading} />}
      {selectedCategory === "seasons" && <CareerSeasonHistory getStatColor={getStatColor} selectedCategory={selectedCategory} />}
      {selectedCategory === "matches" && <CareerMatchResults getResultColor={getResultColor} getRatingColor={getRatingColor} playerTournaments={playerTournaments} />}
    </div>
  );
}