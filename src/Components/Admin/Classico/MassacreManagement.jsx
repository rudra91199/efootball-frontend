
import { useState } from "react";
import TournamentHeader from "./tournament-header";
import TeamsComparison from "./team-comparison";
import PlayerRankings from "./player-rankings";
import { LayoutDashboard, Users, Trophy, Target, Swords, Medal } from "lucide-react";
import Navigation from "./Navigation";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { useLocation, useParams } from "react-router";
import LeagueFixtures from "./LeagueFixtures";
import SeriesFixtures from "./seriesFixtures";
import KnockoutFixtures from "./knockoutFixtures";
import Overview from "./Overview";
import AuthLoader from "../../Loaders/AuthLoader";

const tabs = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { id: "teams", label: "Squads", icon: <Users size={18} /> },
  { id: "league", label: "League", icon: <Target size={18} /> },
  { id: "series", label: "Series", icon: <Swords size={18} /> },
  { id: "knockout", label: "Knockout", icon: <Trophy size={18} /> },
  { id: "rankings", label: "Rankings", icon: <Medal size={18} /> },
];

const MassacreManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { tournamentId } = useParams();
  const location = useLocation();

  // 1. Fetch Tournament Core Data
  const {
    data: { data: { data: tournamentData } = {} } = {},
    isLoading: isTournamentLoading,
    refetch,
  } = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: () => {
      return API.get(`/tournaments/${tournamentId}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
  });

  // 2. Fetch Leaderboard Data for Player Rankings
  const { 
    data: { data: { data: leaderboardData } = {} } = {}, 
    isLoading: isLeaderboardLoading 
  } = useQuery({
    queryKey: ["massacre-leaderboard", tournamentId],
    queryFn: () => {
      return API.get(`/massacre/championship-leaderboard/${tournamentId}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
    enabled: !!tournamentId,
  });

  const phase1League = tournamentData?.stages?.find((s) => s.stageOrder === 1);
  const phase2Series = tournamentData?.stages?.find((s) => s.stageOrder === 2);
  const phase3Playoff = tournamentData?.stages?.find((s) => s.stageOrder === 3);

  if (isTournamentLoading || isLeaderboardLoading) return <AuthLoader />;

  // --- Parse & Sort Leaderboard Data ---
  // Flatten the teams array to get all individual players, injecting their team name for the table
  const allLeaderboardPlayers = leaderboardData?.flatMap((team) =>
    team.players?.map((player) => ({
      ...player,
      name: player.username, // Map username to name for the Rankings component
      team: team.teamName,   // Inject team name
      playerData: { image: { url: player.image } }, // Mock the nested image structure if PlayerRankings relies on it
    })) || []
  ) || [];

  // Sort logic: Total Points (desc) -> Goal Difference (desc) -> Goals For (desc)
  const sortedPlayers = allLeaderboardPlayers.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total; // Sort by points
    if (b.gd !== a.gd) return b.gd - a.gd;             // Tie-breaker 1: GD
    return b.gf - a.gf;                                // Tie-breaker 2: GF
  });

  return (
    <div className="text-white relative min-h-screen bg-[#030305] overflow-x-hidden font-sans animate-fade-in">
      
      {/* ==========================================
          MASSACRE TRILOGY ATMOSPHERIC GLOWS
      ========================================== */}
      
      <div className="fixed top-[10%] left-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(ellipse_at_top_left,rgba(225,29,72,0.4)_0%,transparent_80%)] blur-[80px] pointer-events-none" />

      <div className="fixed bottom-[10%] right-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.5)_0%,transparent_80%)] blur-[80px] pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e11d48] via-[#ec4899] to-transparent opacity-80 shadow-[0_0_20px_rgba(236,72,153,0.4)] z-50" />

      <div className="z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 relative">
        
        {/* Header */}
        <TournamentHeader tournament={tournamentData} />

        {/* Tab Navigation */}
        <div className="mt-3 relative">
          <Navigation
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Content Area */}
        <div className="mt-3">
          {activeTab === "overview" && <Overview tournament={tournamentData} />}
          
          {activeTab === "teams" && (
            <TeamsComparison
              teams={tournamentData.teams}
              refetchTournament={refetch}
              tournament={tournamentData?._id}
            />
          )}
          
          {activeTab === "rankings" && (
            <PlayerRankings players={sortedPlayers} />
          )}
          
          {activeTab === "league" && (
            <LeagueFixtures
              phase1League={phase1League}
              refetchTournament={refetch}
              teams={tournamentData.teams}
            />
          )}
          
          {activeTab === "series" && (
            <SeriesFixtures phase2Series={phase2Series} />
          )}
          
          {activeTab === "knockout" && (
            <KnockoutFixtures
              phase3Playoff={phase3Playoff}
              metaData={tournamentData?.metadata}
              refetchTournament={refetch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MassacreManagement;