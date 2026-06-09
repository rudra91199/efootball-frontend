import { useEffect, useState } from "react";
import TournamentHeader from "./tournament-header";
import PlayerRankings from "./player-rankings";
import Navigation from "./Navigation";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { useParams } from "react-router";
import LeagueFixtures from "./LeagueFixtures";
import SeriesFixtures from "./seriesFixtures";
import KnockoutFixtures from "./knockoutFixtures";
import Overview from "./Overview";
import SquadSubmission from "./squad-submission";
import TeamRankings from "./team-rankings";
import Leaderboards from "./leaderboard/classicoLeaderboard";

import {
  LayoutDashboard,
  Shield,
  ListOrdered,
  Shirt,
  Swords,
  GitMerge,
  Medal,
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { useThemeStore } from "../../../store/themeStore";
import AuthLoader from "../../Loaders/AuthLoader";

const ClassicoLayout = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { tournamentId } = useParams();
  const { setActiveTeamTheme } = useThemeStore();

  const { user } = useAuthStore();

  const {
    data: { data: { data: tournamentData } = {} } = {},
    isLoading: isTournamentLoading,
    refetch,
  } = useQuery({
    queryKey: ["classico-tournament", tournamentId],
    queryFn: () => {
      return API.get(`/tournaments/${tournamentId}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  const myTeam = tournamentData?.teams?.find((team) =>
    team.players.some((player) => player._id === user?._id),
  );



  const userTeamName = myTeam?.name || "N/A";

  const isRMA = userTeamName === "Real Madrid" || userTeamName === "RMA";
  const isBarca =
    userTeamName === "FC Barcelona" ||
    userTeamName === "Barca" ||
    userTeamName === "FCB";
  const isSevenBlades = userTeamName === "Seven Blades of Bloodshed";
  const isSuryaSen =
    userTeamName === "Surya Sen Bloodline FC" ||
    userTeamName === "Surya Sen Bloodline";

  useEffect(() => {
    if (isRMA || isBarca || isSevenBlades || isSuryaSen) {
      setActiveTeamTheme(userTeamName);
    }
  }, [
    userTeamName,
    isRMA,
    isBarca,
    isSevenBlades,
    isSuryaSen,
    setActiveTeamTheme,
  ]);

  // ==========================================
  // DYNAMIC THEME ENGINE
  // ==========================================
  let theme = {
    // Default Fallback
    mainBg: "bg-transparent",
    panelBg: "bg-[hsl(232,61%,8%)]/70",
    watermark: myTeam?.teamLogo || myTeam?.logo || "",
    gradientText: "from-gray-400 via-gray-200 to-gray-400",
    border: "border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    badge: "bg-gray-800 text-white",
    accentText: "text-blue-400",
    progressActive: "bg-blue-500",
    avatarBorder: "border-white/20",
    shadow: "shadow-[0px_0px_rgba(255,255,255,0.5)]",
    beforeShadow: "before:shadow-[inset_0_0_8px_0px_rgba(255,255,255,0.2)]",
  };

  if (isRMA) {
    theme = {
      mainBg: "bg-black",
      panelBg: "bg-black/80",
      watermark: "https://i.ibb.co.com/dJK4JRnT/Rma-Logo.webp",
      gradientText: "from-white via-[#cfb53b] to-white",
      border: "border-[#cfb53b]/50 shadow-[0_0_20px_rgba(207,181,59,0.05)]",
      badge:
        "bg-gradient-to-r from-[#cfb53b] to-yellow-600 text-black shadow-[0_0_10px_#cfb53b]",
      accentText: "text-[#cfb53b]",
      progressActive: "bg-gradient-to-r from-gray-300 to-[#cfb53b]",
      avatarBorder: "border-[#cfb53b]",
      shadow: "shadow-[0px_0px_rgba(207,180,59)]",
      beforeShadow: "before:shadow-[inset_0_0_8px_0px_rgba(207,180,59,0.7)]",
    };
  } else if (isBarca) {
    theme = {
      mainBg: "bg-transparent",
      panelBg: "bg-[hsl(232,61%,8%)]/70",
      watermark: "https://i.ibb.co.com/KcjbGX37/Barca-Logo.webp",
      gradientText: "from-[#a50044] via-[#edbb00] to-[#004d98]",
      border: "border-[#a50044]/60 shadow-[0_0_20px_rgba(165,0,68,0.1)]",
      badge:
        "bg-gradient-to-r from-[#a50044] to-red-800 text-white shadow-[0_0_10px_#a50044]",
      accentText: "text-[#edbb00]",
      progressActive: "bg-gradient-to-r from-[#004d98] to-[#a50044]",
      avatarBorder: "border-[#a50044]",
      shadow: "shadow-[0px_0px_hsl(340,100%,42%)]",
      beforeShadow: "before:shadow-[inset_0_0_8px_0px_hsla(340,100%,42%,0.7)]",
    };
} else if (isSevenBlades) {
    theme = {
      mainBg: "bg-[#09090b]",
      panelBg: "bg-gradient-to-br from-[rgb(161,161,162)]/90 to-[rgb(161,161,162)]/10",

      watermark: myTeam?.logo?.url || "",

      gradientText: "from-[#e4e4e7] via-[#991b1b] to-[#e4e4e7]",

      border:
        "border-t-[#a1a1aa]/70 border-l-[#a1a1aa]/70 border-b-[#991b1b]/80 border-r-[#991b1b]/80 shadow-[0_0_20px_rgba(153,27,27,0.15)]",

      badge:
        "bg-gradient-to-br from-[#000000] to-[#991b1b] text-white shadow-[0_0_10px_rgba(153,27,27,0.5)]",

      accentText: "text-red-500",
      prevButton: "text-red-700",
      nextButton: "text-red-700",
      prevButtonDisabled: "text-red-900/30",
      nextButtonDisabled: "text-red-900/30",
      // FIXED: Deep gunmetal/black for high contrast on a silver panel
      normalText: "text-[hsl(0,20%,20%)] font-black tracking-wide", 

      progressActive: "bg-gradient-to-r from-[#a1a1aa] to-[#dc2626]",

      avatarBorder:
        "border-t-[#a1a1aa] border-l-[#a1a1aa] border-b-[#dc2626] border-r-[#dc2626]",

      shadow: "shadow-[0px_0px_rgba(220,38,38,0.8)]",
      beforeShadow: "before:shadow-[inset_0_0_8px_0px_rgba(161,161,170,0.9)]",
    };
  } else if (isSuryaSen) {
    theme = {
      mainBg: "bg-[#111a22]/50",
      panelBg: "bg-[#1a2c3a]/80",
      watermark: myTeam?.logo?.url || "",
      gradientText: "from-[#b08d5c] via-[#f4ecd8] to-[#b08d5c]",
      border: "border-[#b08d5c]/50 shadow-[0_0_20px_rgba(176,141,92,0.15)]",
      badge:
        "bg-gradient-to-r from-[#2d4046] to-[#b08d5c] text-[#f4ecd8] shadow-[0_0_10px_#b08d5c]",
      accentText: "text-[#b08d5c]",
      prevButton: "text-[#b08d5c]",
      nextButton: "text-[#b08d5c]",
      prevButtonDisabled: "text-[#b08d5c]/30",
      nextButtonDisabled: "text-[#b08d5c]/30",
      // normalText: "text-[#f4ecd8] font-bold tracking-wide",
      progressActive: "bg-gradient-to-r from-[#2d4046] to-[#b08d5c]",
      avatarBorder: "border-[#b08d5c]",
      shadow: "shadow-[0px_0px_rgba(176,141,92)]",
      beforeShadow: "before:shadow-[inset_0_0_8px_0px_rgba(176,141,92,0.7)]",
    };
  }

  
  const phase1League = tournamentData?.stages?.find((s) => s.stageOrder === 1);
  const phase2Series = tournamentData?.stages?.find((s) => s.stageOrder === 2);
  const phase3Playoff = tournamentData?.stages?.find((s) => s.stageOrder === 3);

  // ==========================================
  // DYNAMIC PROGRESS LOGIC
  // ==========================================
  const isPhase1Complete =
    phase1League?.stageData?.status === "Completed" || !!phase2Series;
  const isPhase2Complete =
    phase2Series?.stageData?.status === "Completed" || !!phase3Playoff;

  // Dynamically build the tabs based on tournament progress
  const availableTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard color="white"/>,
    },
    {
      id: "league",
      label: "League",
      icon: <Shield color="white"/>,
    },
    {
      id: "phase1Rankings",
      label: "Phase 1 Rankings",
      icon: <ListOrdered color="white" />,
    },
    // Only show if Phase 1 is complete
    ...(isPhase1Complete
      ? [
          // {
          //   id: "squadSubmissions",
          //   label: "Squad Submissions",
          //   icon: <Shirt color="white" />,
          // },
          {
            id: "series",
            label: "Series",
            icon: <Swords color="white" />,
          },
        ]
      : []),
    // Only show if Phase 2 is complete
    ...(isPhase2Complete
      ? [
          {
            id: "knockout",
            label: "Knockout",
            icon: <GitMerge color="white" className="rotate-90" />,
          },
        ]
      : []),
    {
      id: "rankings",
      label: "Rankings",
      icon: <Medal color="white" />,
    },
  ];

  // Safety net: If the active tab disappears because of state changes, return to overview
  useEffect(() => {
    if (!availableTabs.find((t) => t.id === activeTab)) {
      setActiveTab("overview");
    }
  }, [isPhase1Complete, isPhase2Complete, activeTab]);

  //championship points
  const { data: { data: { data: championshipPoints } = {} } = {} } = useQuery({
    queryKey: ["championshipPoints", tournamentData?._id],
    queryFn: () => {
      return API.get(
        `/championship-points/getByTournament/${tournamentData?._id}`,
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        },
      );
    },
    enabled: !!tournamentData,
  });

  // ==========================================
  // NEW TEAM-SEPARATED LEADERBOARD FETCH
  // ==========================================
  const {
    data: { data: { data: phase1Leaderboard } = {} } = {},
    isLoading: isPhase1Loading,
  } = useQuery({
    queryKey: ["team-separated-leaderboard", tournamentId],
    queryFn: () => {
      return API.get(`/massacre/phase1-leaderboard/${tournamentId}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
    enabled: !!tournamentId,
  });

  if (isTournamentLoading || isPhase1Loading) {
    return <AuthLoader />;
  }

  // 1. Grouped & Sorted Array (For `<TeamRankings />`)
  const sortedTeams =
    phase1Leaderboard?.map((team) => {
      // Sort players WITHIN their respective teams
      const sortedPlayers = [...team.players].sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins; // Tie-breaker 1: Wins
        if (b.gd !== a.gd) return b.gd - a.gd; // Tie-breaker 2: Goal Difference (GD)
        return b.gf - a.gf; // Tie-breaker 3: Goals For (GF)
      });
      return { ...team, players: sortedPlayers };
    }) || [];

  // 2. Flattened & Globally Sorted Array (For the global `<Leaderboards />` tab)
  const flatSortedPlayers = sortedTeams
    .flatMap((team) =>
      team.players.map((player) => ({
        ...player,
        name: player.username, // Map for compatibility if needed
        team: team._id, // Inject team name from the grouping _id
        playerData: { image: { url: player.image } }, // Compatibility mapping for older components
      })),
    )
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

  return (
    <div className={`min-h-screen ${theme.mainBg} `}>
      <div className="max-w-7xl mx-auto lg:py-8">
        {/* --- DYNAMICALLY THEMED HEADER --- */}
        <h1
          className={`text-base pt-2 md:text-5xl font-black w-fit mx-auto text-transparent bg-clip-text bg-gradient-to-r uppercase tracking-widest drop-shadow-lg text-center ${theme.gradientText}`}
        >
          {tournamentData?.name}
        </h1>

        {/* Tab Navigation */}
        <div className="mt-2 md:mt-8 px-3 relative">
          <Navigation
            tabs={availableTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navTheme={theme}
            isSevenBlades={isSevenBlades}
          />
        </div>

        {/* Content */}
        <div className="mt-4 px-3 relative">
          {userTeamName !== "N/A" && theme.watermark && (
            <div className="fixed inset-0 top-32 z-0 flex items-center justify-center opacity-[0.75] pointer-events-none overflow-hidden">
              <img
                src={theme.watermark}
                alt="Club Watermark"
                className="w-[80%] md:w-[70%] max-w-[800px] object-contain"
              />
            </div>
          )}
          {activeTab === "overview" && (
            <Overview tournament={tournamentData} theme={theme} />
          )}

          {activeTab === "rankings" && (
            <Leaderboards players={flatSortedPlayers} theme={theme} />
          )}

          {activeTab === "league" && (
            <LeagueFixtures
              championshipPoints={championshipPoints}
              tournament={tournamentData}
              phase1League={phase1League}
              theme={theme}
            />
          )}
          {activeTab === "squadSubmissions" && (
            <SquadSubmission
              tournament={tournamentData}
              refetch={refetch}
              phase2Series={phase2Series}
              theme={theme}
            />
          )}
          {activeTab === "series" && (
            <SeriesFixtures
              phase2Series={phase2Series}
              tournament={tournamentData}
              theme={theme}
            />
          )}
          {activeTab === "knockout" && (
            <KnockoutFixtures
              phase3Playoff={phase3Playoff}
              tournament={tournamentData}
              refetch={refetch}
              theme={theme}
            />
          )}
          {activeTab === "phase1Rankings" && (
            <TeamRankings teams={sortedTeams} theme={theme} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicoLayout;
