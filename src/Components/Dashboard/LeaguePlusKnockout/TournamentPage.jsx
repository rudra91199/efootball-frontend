import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import TournamentHeader from "./TournamentHeader";
import Navigation from "./Navigation";
import Overview from "./Overview";
import MyMatches from "./MyMatches";
import Leaderboard from "./Leaderboard";
import Rules from "./Rules";
import { useState } from "react";
import { useParams } from "react-router";
import KnockoutStage from "./KnockoutStage";
import AuthLoader from "../../Loaders/AuthLoader";
import LeagueFixtures from "./LeagueFixtures";
import { useAuthStore } from "../../../store/authStore";
import Series from "./Series";
import Playoffs from "./Playoffs";
import CircuitPoints from "../../Admin/LeagueDetails/circuitPoints";
import LeagueNavigation from "../../Admin/LeagueDetails/league-navigation";
import {
  BarChart,
  Gamepad2,
  LayoutDashboard,
  ListOrdered,
  Medal,
  Network,
  Shrink,
} from "lucide-react";

const TournamentPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuthStore();

  const { id: tournamentId } = useParams();

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

  console.log(tournament);

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
      return API.get(`/leagues/${tournament?.stages[0]?.stageData?._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
    enabled: !!tournament,
  });

  const {
    data: { data: { data: leaderboard } = {} } = {},
    isLoading: isLeaderboardLoading,
  } = useQuery({
    queryKey: ["leagueLeaderboard", league?._id],
    queryFn: () => {
      return API.get(`/leagues/generate-leaderboard/${league?._id}`);
    },
    enabled: !!league,
  });

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard color="white" />,
    },
    {
      id: "fixtures",
      label: tournament?.stages[0]?.stageName,
      icon: <Network color="white" />,
    },
    ...(tournament?.type === "League + Knockout Solo"
      ? [
          {
            id: "knockout",
            label: "Knockout Stages",
            icon: <Medal color="white" />,
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
    { id: "my-matches", label: "My Matches", icon: <Gamepad2 color="white" /> },

    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: <BarChart color="white" />,
    },
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
    <div className="min-h-screen">
      <TournamentHeader tournament={tournament} />
      {!isTournamentLoading &&
      (tournament?.status === "Live" || tournament?.status === "Completed") ? (
        <div>
          <LeagueNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stageName={tournament?.stages[0]?.stageName}
            tabs={tabs}
          />

          {/* Content */}
          <div className="w-full mx-auto py-2 ">
            {activeTab === "overview" && (
              <Overview
                tournament={tournament}
                isLoading={isTournamentLoading}
                leaderboard={leaderboard}
              />
            )}

            {activeTab === "fixtures" && (
              <LeagueFixtures
                tournament={tournament}
                leagueId={league?._id}
                leagueFixture={league?.matches}
                isLoading={isLeagueLoading}
              />
            )}
            {activeTab === "knockout" && (
              <KnockoutStage
                stage1={phase1League}
                stage={tournament?.stages?.find(
                  (s) => s.stageType === "Knockout",
                )}
                tournamentId={tournament?._id}
                leagueMatches={league?.matches}
              />
            )}

            {activeTab === "series" && (
              <Series stage={phase2Series} tournamentId={tournament?._id} />
            )}
            {activeTab === "playoff" && (
              <Playoffs stage={phase3Playoff} tournamentId={tournament?._id} />
            )}

            {activeTab === "my-matches" && (
              <MyMatches
                tournamentId={tournament?._id}
                currentUser={user?._id}
              />
            )}

            {activeTab === "leaderboard" && (
              <Leaderboard
                tournamentId={tournament?._id}
                data={leaderboard}
                isLoading={isLeaderboardLoading}
              />
            )}
            {activeTab === "rules" && (
              <Rules rules={tournament?.rules} tournament={tournament?.name} />
            )}

            {activeTab === "circuitPoints" && (
              <CircuitPoints tournamentId={tournament?._id} />
            )}
          </div>
        </div>
      ) : (
        <>
          {isTournamentLoading ? (
            <AuthLoader />
          ) : (
            <div className="h-[50vh] flex items-center justify-center">
              <p className="text-white text-xl md:text-2xl">
                Tournament is not started yet.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TournamentPage;
