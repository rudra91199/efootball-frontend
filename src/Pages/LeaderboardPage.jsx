

import { useQuery } from "@tanstack/react-query";
import { LeaderboardView } from "../Components/Leaderboard/LeaderboardView";
import { API } from "../axios";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import AuthLoader from "../Components/Loaders/AuthLoader";

export default function LeaderboardPage() {
  const { user } = useAuthStore();

  const { tournaments, isLoadingTournaments, getTournaments } = useAuthStore();

  useEffect(() => {
    getTournaments();
  }, []);


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {isLoadingTournaments && <AuthLoader />}
      {tournaments?.length>0 && (
        <LeaderboardView playerTournaments={tournaments} />
      )}
    </div>
  );
}
