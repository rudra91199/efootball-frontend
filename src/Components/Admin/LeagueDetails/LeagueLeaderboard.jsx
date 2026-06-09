"use client";

import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import Leaderboard from "../../Dashboard/LeaguePlusKnockout/Leaderboard";

export default function LeagueLeaderboard({ leagueId }) {
  const { data: { data: { data: leaderbaord } = {} } = {} } = useQuery({
    queryKey: ["leagueLeaderboard", leagueId],
    queryFn: () => {
      return API.get(`/leagues/generate-leaderboard/${leagueId}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  return <Leaderboard data={leaderbaord} />;
}
