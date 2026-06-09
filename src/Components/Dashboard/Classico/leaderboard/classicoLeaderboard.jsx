import { useState } from "react";
import TeamSeparatedLeaderboard from "./TeamSeparatedLeaderboard";
import GlobalLeaderboard from "./AllPlayerLeaderboard";
import ChampionshipLeaderboard from "./ChampionshipLeaderboard";
import { Users, Globe, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAuthStore } from "../../../../store/authStore";
import { API } from "../../../../axios";

export default function Leaderboards() {
  const [activeTab, setActiveTab] = useState("separated");
  const { tournamentId } = useParams();
  const { user } = useAuthStore();

  // Fetch tournament data to determine user's team
  const { data: { data: { data: tournamentData } = {} } = {} } = useQuery({
    queryKey: ["classico-tournament", tournamentId],
    queryFn: () => {
      return API.get(`/tournaments/${tournamentId}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
    enabled: !!tournamentId,
  });

  const myTeam = tournamentData?.teams?.find((team) =>
    team.players.some((player) => player._id === user?._id),
  );

  const userTeamName = myTeam?.name?.toLowerCase()?.trim() || "";

  // ==========================================
  // THEME ENGINE FOR TABS & GLOWS
  // ==========================================
  let theme = {
    // Default / Neutral
    ambientLeft: "bg-blue-600",
    ambientRight: "bg-purple-600",
    panelBg: "bg-black/40",
    border: "border-white/10",
    tabActiveBg: "from-blue-500/20 to-blue-400/10",
    tabActiveText: "text-blue-400",
    tabActiveBorder: "border-blue-500/30",
    tabActiveShadow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    mutedText: "text-gray-400",
    hoverText: "hover:text-white hover:bg-white/5",
  };

  if (userTeamName === "real madrid" || userTeamName === "rma") {
    theme = {
      ambientLeft: "bg-[#cfb53b]",
      ambientRight: "bg-[#ffffff]",
      panelBg: "bg-[#050505]/80",
      border: "border-[#cfb53b]/30",
      tabActiveBg: "from-[#cfb53b]/20 to-[#cfb53b]/5",
      tabActiveText: "text-[#cfb53b]",
      tabActiveBorder: "border-[#cfb53b]/30",
      tabActiveShadow: "shadow-[0_0_15px_rgba(207,181,59,0.2)]",
      mutedText: "text-gray-500",
      hoverText: "hover:text-gray-200 hover:bg-white/5",
    };
  } else if (userTeamName === "fc barcelona" || userTeamName === "barca" || userTeamName === "fcb") {
    theme = {
      ambientLeft: "bg-[#a50044]",
      ambientRight: "bg-[#004d98]",
      panelBg: "bg-[#080b1f]/80",
      border: "border-[#a50044]/30",
      tabActiveBg: "from-[#edbb00]/20 to-[#edbb00]/5",
      tabActiveText: "text-[#edbb00]",
      tabActiveBorder: "border-[#edbb00]/30",
      tabActiveShadow: "shadow-[0_0_15px_rgba(237,187,0,0.2)]",
      mutedText: "text-gray-500",
      hoverText: "hover:text-gray-200 hover:bg-white/5",
    };
  } else if (userTeamName.includes("seven blades")) {
    theme = {
      ambientLeft: "bg-[#a1a1aa]", // Silver ambient
      ambientRight: "bg-[#dc2626]", // Crimson ambient
      panelBg: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[rgb(161,161,162)]/10",
      border: "border-[#a1a1aa]/60",
      tabActiveBg: "from-[#27272a] to-[#991b1b]", // Dark steel to blood red
      tabActiveText: "text-white",
      tabActiveBorder: "border-[#ef4444]/50",
      tabActiveShadow: "shadow-[0_0_15px_rgba(239,68,68,0.4)]",
      mutedText: "text-gray-300", // Darker text for silver background
      hoverText: "hover:text-gray-900 hover:bg-black/10", // Darker hover
    };
  } else if (userTeamName.includes("surya sen")) {
    theme = {
      ambientLeft: "bg-[#5eb89e]",
      ambientRight: "bg-[#b08d5c]",
      panelBg: "bg-[#111a22]/80",
      border: "border-[#b08d5c]/30",
      tabActiveBg: "from-[#b08d5c]/20 to-[#b08d5c]/5",
      tabActiveText: "text-[#b08d5c]",
      tabActiveBorder: "border-[#b08d5c]/30",
      tabActiveShadow: "shadow-[0_0_15px_rgba(176,141,92,0.2)]",
      mutedText: "text-gray-400",
      hoverText: "hover:text-gray-200 hover:bg-white/5",
    };
  }

  const tabs = [
    { id: "separated", label: "Team Rankings", icon: Users },
    { id: "global", label: "Global Top 100", icon: Globe },
    { id: "championship", label: "Championship", icon: Trophy },
  ];

  return (
    <div className="min-h-[100dvh] bg-black/10 text-white relative overflow-hidden py-4 px-0 md:p-8">
      
      {/* --- AMBIENT ARENA LIGHTING DYNAMIC --- */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${theme.ambientLeft} rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0 transition-colors duration-1000`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${theme.ambientRight} rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0 transition-colors duration-1000`} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8 md:mb-10 text-center md:text-left px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-lg">
            Hall of Fame
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
            Track player legacy & team dominance across the Gauntlet
          </p>
        </div>

        {/* --- PREMIUM TAB SELECTOR --- */}
        <div className="w-full flex justify-center md:justify-start mb-8 px-4 md:px-0">
          <div className={`flex w-full lg:w-auto ${theme.panelBg} backdrop-blur-xl border ${theme.border} p-1.5 rounded-[20px] gap-1 sm:gap-2 shadow-2xl`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2.5 flex-1 lg:flex-none px-3 sm:px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${theme.tabActiveBg} ${theme.tabActiveText} border ${theme.tabActiveBorder} ${theme.tabActiveShadow}`
                      : `${theme.mutedText} ${theme.hoverText} border border-transparent`
                  }`}
                >
                  <Icon size={16} className={`shrink-0 ${isActive ? theme.tabActiveText : "opacity-70"}`} />
                  <span className="hidden sm:block whitespace-nowrap">{tab.label}</span>
                  <span className="sm:hidden whitespace-nowrap">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="relative w-full min-h-[500px] z-20 text-white">
          {activeTab === "separated" && (
              <TeamSeparatedLeaderboard tab={activeTab} />
          )}
          
          {activeTab === "global" && (
              <GlobalLeaderboard tab={activeTab} />
          )}
          
          {activeTab === "championship" && (
              <ChampionshipLeaderboard tab={activeTab} />
          )}
        </div>

      </div>
    </div>
  );
}