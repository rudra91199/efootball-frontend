import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import TournamentHeader from "./TournamentHeader";
import TournamentNavigation from "./TournamentNavigation";
import TournamentTeams from "./TournamentTeams";
import TournamentFixtures from "./TournamentFixtures";
import TournamentPhases from "./TournamentPhases";
import TournamentOverview from "./TournamentOverview";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import Leaderboards from "../../Dashboard/DashboardTournamentManagePage/LeaderBoard";
import ChampionshipPoints from "../../Shared/ChampionshipPoint";


export default function TournamentManagePage() {
  const params = useParams();
  const tournamentId = params.id;
  const prevTab = useLocation().state;
  const [activeTab, setActiveTab] = useState("overview");

  const updateTournamentStatus = (newStatus) => {};

  const {
    data: { data: { data } = {} } = {},
    isLoading,
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

  const {
    data: { data: { data: phase1Leaderboard } = {} } = {},
    isLoading: isLoadingPhase1,
  } = useQuery({
    queryKey: ["leaderboard", tournamentId],
    queryFn: () => {
      return API.get(`/tournaments/${tournamentId}/leaderboard/phase1`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  useEffect(() => {
    if (prevTab) {
      setActiveTab(prevTab);
    }
  }, [prevTab]);
  return (
    <div className="min-h-screen ">
      <TournamentHeader
        tournament={data}
        onStatusUpdate={updateTournamentStatus}
      />

      <TournamentNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        phases={data?.phases}
      />

      {/* Content */}
      <div className="w-full mx-auto py-8 ">
        {activeTab === "overview" && (
          <TournamentOverview
            tournament={data}
            teams={data?.teams}
            phases={data?.phases}
            isLoading={isLoading}
          />
        )}

        {activeTab === "teams" && (
          <TournamentTeams
            teams={data?.teams}
            tournament={data}
            isLoading={isLoading}
            refetch={refetch}
          />
        )}

        {activeTab === "fixtures" && (
          <TournamentFixtures
            phases={data?.phases}
            tournament={data}
            refetch={refetch}
            isLoading={isLoading}
          />
        )}

        {activeTab === "phases" && (
          <TournamentPhases
            phases={data?.phases}
            tournamentId={data?._id}
            refetch={refetch}
            isLoading={isLoading}
          />
        )}
        {activeTab === "leaderboard" && (
          <Leaderboards data={phase1Leaderboard} isLoading={isLoadingPhase1} />
        )}
        {activeTab === "championshipPoints" && (
          <ChampionshipPoints
            tournamentId={data?._id}
            tournamentName={data?.name}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
