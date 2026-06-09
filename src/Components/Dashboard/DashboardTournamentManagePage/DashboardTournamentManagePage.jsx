import { useEffect, useState } from "react";
import DashboardTournamentHeader from "./DashboardTournamentHeader";
import DashboardTournamentNavigation from "./DashboardTournamentNavigation";
import Leaderboards from "./LeaderBoard";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { useLocation, useParams } from "react-router";
import DashboardTournamentMatches from "./DashboardTournamentMatches";
import DashboardTournamentOverview from "./DashboardTournamentOverview";
import ChampionshipPoints from "../../Shared/ChampionshipPoint";
import { useAuthStore } from "../../../store/authStore";
import DashboardTournamentTeamManagement from "./DashboardTournamentTeamManagement";
import DashboardTournamentfixtures from "./DashboardTournamentFixtures";
import DashboardTournamentRules from "./DashboardTournamentRules";
import DashboardTournamentPrizes from "./DashboardTournamentPrizes";
import AuthLoader from "../../Loaders/AuthLoader";

const DashboardTournamentManagePage = () => {
  const prevTab = useLocation().state;
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState("overview");

  const { id: tournamentId } = useParams();

  const { data: { data: { data } = {} } = {}, isLoading } = useQuery({
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

  const myTeam = data?.teams?.find((team) =>
    team.players.some((player) => player._id === user?._id),
  );

  return (
    <div className="min-h-screen ">
      <DashboardTournamentHeader tournament={data} />

      {/* {isLoading && <AuthLoader />} */}

      {!isLoading &&
      (data?.status === "Live" || data?.status === "Completed") ? (
        <div>
          <DashboardTournamentNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            phases={data?.phases}
            myTeam={myTeam}
          />

          {/* Content */}
          <div className="w-full mx-auto py-8 ">
            {activeTab === "overview" && (
              <DashboardTournamentOverview
                tournament={data}
                teams={data?.teams}
                phases={data?.phases}
                isLoading={isLoading}
                phase1Leaderboard={phase1Leaderboard}
              />
            )}

            {/* {activeTab === "teams" && (
          <TournamentTeams teams={data?.teams} tournament={data} />
        )} */}

            {activeTab === "fixtures" && (
              <DashboardTournamentfixtures
                // matches={matches}
                phases={data?.phases}
                tournament={data}
                // onUpdateMatchScores={updateMatchScores}
                isLoading={isLoading}
              />
            )}
            {activeTab === "teamManagement" && (
              <DashboardTournamentTeamManagement
                // matches={matches}
                phases={data?.phases}
                tournament={data}
                // onUpdateMatchScores={updateMatchScores}
                isLoading={isLoading}
              />
            )}

            {activeTab === "matches" && (
              <DashboardTournamentMatches
                // matches={matches}
                phases={data?.phases}
                tournament={data}
                // onUpdateMatchScores={updateMatchScores}
                isLoading={isLoading}
              />
            )}

            {activeTab === "leaderboard" && (
              <Leaderboards
                // phases={data?.phases}
                tournamentId={data?._id}
                // onFinalizePhase={finalizePhase}
                data={phase1Leaderboard}
                isLoading={isLoadingPhase1}
              />
            )}
            {activeTab === "championshipPoints" && (
              <ChampionshipPoints
                tournamentId={data?._id}
                tournamentName={data?.name}
              />
            )}
            {activeTab === "rules" && (
              <DashboardTournamentRules
                tournament={data?.name}
                isLoading={isLoading}
                rules={data?.rules}
              />
            )}
            {activeTab === "prizes" && (
              <DashboardTournamentPrizes
                tournament={data?.name}
                isLoading={isLoading}
                prizes={data?.prizes}
              />
            )}
          </div>
        </div>
      ) : (
        <>
          {isLoading ? (
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

export default DashboardTournamentManagePage;
