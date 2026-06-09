import { useState } from "react";
import LeagueOverview from "./LeagueOverview";
import LeagueFixtures from "./LeagueFixtures";
import LeagueLeaderboard from "./LeagueLeaderboard";
import LeagueKnockoutStages from "./LeagueKnockoutStages";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { useParams } from "react-router";
import { useAuthStore } from "../../../store/authStore";
import { BarChart, Gamepad2, LayoutDashboard, ListOrdered, Medal, Network, Shrink} from "lucide-react";

import CircuitPoints from "./circuitPoints";
import Series from "./Series";
import Playoffs from "./Playoffs";
import LeagueNavigation from "./league-navigation";

export default function LeagueManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const { tournamentId } = useParams();

  const { user } = useAuthStore(); // This would come from user context in real app

  const {
    data: { data: { data: tournament } = {} } = {},
    isLoading: isTournamentLoading,
    refetch,
  } = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: () => {
      return API.get(`/tournaments/${tournamentId}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  const phase1League = tournament?.stages?.find((s) => s.stageOrder === 1);
  const phase2Series = tournament?.stages?.find((s) => s.stageOrder === 2);
  const phase3Playoff = tournament?.stages?.find((s) => s.stageOrder === 3);

  const {
    data: { data: { data: league } = {} } = {},
    isLoading: isLeagueLoading,
    refetch: refetchLeague,
  } = useQuery({
    queryKey: ["league", tournament?.stages[0]?.stageData._id],
    queryFn: () => {
      return API.get(`/leagues/${tournament?.stages[0]?.stageData._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
    enabled: !!tournament,
  });

  const getStatusBadge = (status) => {
    const colors = {
      Completed: "bg-green-500/20 text-green-400 border-green-500/30",
      Live: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

    const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard color="white"/> },
    { id: "fixtures", label: tournament?.stages[0]?.stageName, icon: <Network color="white"/> },
    ...(tournament?.type === "League + Knockout Solo"
      ? [
          {
            id: "knockout",
            label: "Knockout Stages",
            icon:<Medal color="white" />,
          },
        ]
      : []),
    ...(tournament?.type === "Champions Circuit" && phase2Series
      ? [
          {
            id: "series",
            label: phase2Series.stageName,
            icon: <ListOrdered color="white" />,
          },
        ]
      : []),
    ...(league && tournament?.type === "Champions Circuit" && phase3Playoff
      ? [
          {
            id: "playoff",
            label: phase3Playoff.stageName,
            icon: <Shrink color="white" />,
          },
        ]
      : []),
    { id: "leaderboard", label: "Leaderboard", icon:<BarChart color="white" /> },
    ...(league &&
    league?.status === "Completed" &&
    tournament?.type === "Champions Circuit" &&
    league?.circuitPointsCalculated === true
      ? [
          {
            id: "circuitPoints",
            label: "Circuit Points",
            icon: "🏆",
          },
        ]
      : []),
  ];


  return (
    <div className="min-h-screen p-4 pt-18 sm:p-6 lg:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow">
              {tournament?.name}
            </h1>
            <p className="text-gray-300 mt-1">
              Season 2025 • {league?.participants?.length}/
              {league?.maxParticipants} Teams
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500 mb-1">League Status</p>
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusBadge(
                league?.status
              )}`}
            >
              {league?.status === "Live" && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              )}
              {league?.status}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <LeagueNavigation
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content */}
        <div className="animate-in fade-in-50 duration-300">
          {activeTab === "overview" && (
            <LeagueOverview
              leagueData={league}
              leagueParticipants={league?.participants}
              tournament={tournament}
              leagueFixture={league?.matches}
            />
          )}
          {activeTab === "fixtures" && (
            <LeagueFixtures
              leagueId={league?._id}
              leagueFixture={league?.matches}
              refetch={refetchLeague}
              tournamentType={tournament?.type}
              isCircuitPointCalculated={league?.circuitPointsCalculated}
            />
          )}
          {activeTab === "leaderboard" && (
            <LeagueLeaderboard leagueId={league?._id} />
          )}
          {activeTab === "circuitPoints" && (
            <CircuitPoints tournamentId={tournament?._id} />
          )}

      {activeTab === "knockout" && (
        <LeagueKnockoutStages
          stage1={phase1League}
          stage={tournament?.stages?.find((s) => s.stageType === "Knockout")}
          tournamentId={tournament?._id}
          leagueMatches={league?.matches}
        />
      )}

      {activeTab === "series" && (
        <Series
          stage={phase2Series}
          tournamentId={tournament?._id}
          refetch={refetch}
        />
      )}
      {activeTab === "playoff" && (
        <Playoffs
          stage={phase3Playoff}
          tournamentId={tournament?._id}
          refetch={refetch}
        />
          )}
        </div>
      </div>
    </div>
    // <div className="space-y-6">
    //   {/* Header */}
    //   <div className="flex items-center justify-between">
    //     <div>
    //       <h1 className="text-3xl font-bold text-foreground">
    //         {tournament?.name}
    //       </h1>
    //       <p className="text-muted-foreground mt-1">
    //         Season 2025 • {league?.participants?.length}/
    //         {league?.maxParticipants} Teams
    //       </p>
    //     </div>
    //     <div className="text-right">
    //       <p className="text-sm text-muted-foreground">League Status</p>
    //       <span
    //         className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
    //           league?.status
    //         )}`}
    //       >
    //         {league?.status}
    //       </span>
    //     </div>
    //   </div>

    //   {/* Tab Navigation */}
    //   <div className="liquid-glass-card relative p-4 rounded-lg">
    //     <div className="flex space-x-1 bg-muted/20 p-1 rounded-xl">
    //       {tabs.map((tab) => (
    //         <button
    //           key={tab.id}
    //           onClick={() => setActiveTab(tab.id)}
    //           className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
    //             activeTab === tab.id
    //               ? "bg-primary text-primary-foreground"
    //               : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
    //           }`}
    //         >
    //           <span>{tab.icon}</span>
    //           {tab.label}
    //         </button>
    //       ))}
    //     </div>
    //   </div>

    //   {activeTab === "overview" && (
    //     <LeagueOverview
    //       leagueData={league}
    //       leagueParticipants={league?.participants}
    //       tournament={tournament}
    //       leagueFixture={league?.matches}
    //     />
    //   )}

    //   {activeTab === "fixtures" && (
    //     <LeagueFixtures
    //       leagueId={league?._id}
    //       leagueFixture={league?.matches}
    //       refetch={refetchLeague}
    //       tournamentType={tournament?.type}
    //       isCircuitPointCalculated={league?.circuitPointsCalculated}
    //     />
    //   )}

    //   {activeTab === "leaderboard" && (
    //     <LeagueLeaderboard leagueId={league?._id} />
    //   )}

    //   {activeTab === "circuitPoints" && (
    //     <CircuitPoints tournamentId={tournament?._id} />
    //   )}

    //   {activeTab === "knockout" && (
    //     <LeagueKnockoutStages
    //       stage1={phase1League}
    //       stage={tournament?.stages?.find((s) => s.stageType === "Knockout")}
    //       tournamentId={tournament?._id}
    //       leagueMatches={league?.matches}
    //     />
    //   )}

    //   {activeTab === "series" && (
    //     <Series
    //       stage={phase2Series}
    //       tournamentId={tournament?._id}
    //       refetch={refetch}
    //     />
    //   )}
    //   {activeTab === "playoff" && (
    //     <Playoffs
    //       stage={phase3Playoff}
    //       tournamentId={tournament?._id}
    //       refetch={refetch}
    //     />
    //   )}
    // </div>
  );
}
