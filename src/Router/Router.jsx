import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "../Layouts/Layout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import AdminDashboard from "../Pages/AdminDashboard";
import SubmittedSquad from "../Pages/SubmittedSquad";
import ProtectedRoute from "../protectedRoutes/ProtectedRoute";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminProtection } from "../protectedRoutes/AdminProtection";
import TournamentRegistration from "../Pages/TournamentRegistration";
import AllTournaments from "../Pages/AllTournaments";
import TournamentDetailsPage from "../Pages/TournamentDetailsPage";
import OverviewSection from "../Components/Admin/overview-section";
import MatchManagement from "../Components/Admin/match-management";
import TournamentManagement from "../Components/Admin/tournament-management";
import PlayerManagement from "../Components/Admin/player-management";
import Dashboard from "../Pages/Dashboard";
import TournamentSection from "../Components/Dashboard/TournamentSection";
import ProfileSection from "../Components/Dashboard/Profile";
import DashboardTournamentManagePage from "../Components/Dashboard/DashboardTournamentManagePage/DashboardTournamentManagePage";
import SquadManagement from "../Components/Dashboard/DashboardTournamentManagePage/SquadManagement";
import DashboardSquadUpdate from "../Components/Dashboard/DashboardTournamentManagePage/DashboardSquadUpdate";
import PlayerCareer from "../Components/Dashboard/PlayerCareer";
import LeagueManagement from "../Components/Admin/LeagueDetails/LeagueManagement";
import TournamentManagePage from "../Components/Admin/TournamentDetails/AdminTournamentManage";
import RulesManagement from "../Components/Admin/rules-management";
import RulesPage from "../Pages/Rules";
import TournamentPage from "../Components/Dashboard/LeaguePlusKnockout/TournamentPage";
import MotmManage from "../Components/Admin/SlideCreate/MotmManage";
import TeamVsSlideManage from "../Components/Admin/SlideCreate/TeamVsSlideManage";
import HallOfFame from "../Pages/HallOfFameList";
import LeaderboardPage from "../Pages/LeaderboardPage";
import ClassicoLayout from "../Components/Dashboard/Classico/ClassicoLayout";
import HallOfFameList from "../Pages/HallOfFameList";
import HallOfFameDetails from "../Components/Hall Of Fame/HallOfFameDetails";
import HallOfFameBanner from "../Components/Hall Of Fame/HallOfFameBanner";
import AuthLoader from "../Components/Loaders/AuthLoader";
import MassacreManagement from "../Components/Admin/Classico/MassacreManagement";
import AdminBroadcasts from "../Components/Admin/AdminBroadcasts";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },

      {
        path: "/submittedsquad",
        element: (
          <ProtectedRoute>
            <SubmittedSquad />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tournament/register/:id",
        element: (
          <ProtectedRoute>
            <TournamentRegistration />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tournaments",
        element: <AllTournaments />,
      },
      {
        path: "/leaderboard",
        element: <LeaderboardPage />,
      },
      {
        path: "/rules",
        element: <RulesPage />,
      },
      // Inside your createBrowserRouter array, update the hall-of-fame path:
      {
        path: "/hall-of-fame",
        children: [
          { index: true, element: <HallOfFameList /> },
          { path: ":tournamentId", element: <HallOfFameDetails /> },
          // NEW: The dedicated Banner Route
          {
            path: ":tournamentId/award/:awardSlug",
            element: <HallOfFameBanner />,
          },
        ],
      },
      {
        path: "/tournaments/:id",
        element: <TournamentDetailsPage />,
      },
      {
        path: "/admin",
        element: (
          <AdminProtection>
            <AdminDashboard />
          </AdminProtection>
        ),
        children: [
          { index: true, element: <OverviewSection /> },
          { path: "players", element: <PlayerManagement /> },
          { path: "tournaments", element: <TournamentManagement /> },
          { path: "matches", element: <MatchManagement /> },
          { path: "rules", element: <RulesManagement /> },
          { path: "create-motm", element: <MotmManage /> },
          { path: "create-vs", element: <TeamVsSlideManage /> },
          { path: "tournament/manage/:id", element: <TournamentManagePage /> },
          {
            path: "tournaments/tournament/:tournamentId/squad-submit/:matchId",
            element: <DashboardSquadUpdate />,
          },
          {
            path: "tournament/league-knockout/manage/:tournamentId",
            element: <LeagueManagement />,
          },
          {
            path: "tournament/massacre/manage/:tournamentId",
            element: <MassacreManagement />,
          },
          {path: "broadcasts", element: <AdminBroadcasts />}
        ],
      },
      {
        path: "/dashboard",
        element: (
          <AdminProtection>
            <Dashboard />
          </AdminProtection>
        ),
        children: [
          { path: "my-tournaments", element: <TournamentSection /> },
          { path: "profile", element: <ProfileSection /> },
          {
            index: true,
            element: <PlayerCareer />,
          },
          {
            path: "my-tournaments/tournament/:id",
            element: <DashboardTournamentManagePage />,
          },
          {
            path: "my-tournaments/league-knockout/:id",
            element: <TournamentPage />,
          },
          {
            path: "my-tournaments/tournament/:tournamentId/squad-submit/:matchId",
            element: <SquadManagement />,
          },
          {
            path: "my-tournaments/tournament/:tournamentId/squad-update/:matchId",
            element: <DashboardSquadUpdate />,
          },
          {
            path: "my-tournaments/massacre/:tournamentId",
            element: <ClassicoLayout />,
          },
        ],
      },
    ],
  },
  { path: "login", Component: Login },
  { path: "signup", Component: Signup },
]);

export default function Router() {
  const { checkAuth, isLoading, isCheckingAuth } = useAuthStore();
  const queryClient = new QueryClient();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isLoading || isCheckingAuth) {
    return <AuthLoader/>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
