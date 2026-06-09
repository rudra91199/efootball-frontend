import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StatusBadge from "../../Admin/LeagueDetails/statusBadge";
import AuthLoader from "../../Loaders/AuthLoader";
import { API } from "../../../axios";
import moment from "moment";
import { Trophy } from "lucide-react";

const Playoffs = ({ stage }) => {
  const { data: { data: { data: playoff } = {} } = {}, isLoading } = useQuery({
    queryKey: ["playOff", stage?.stageData?._id], // Use a key from the stage
    queryFn: () =>
      API.get(`/knockouts/${stage?.stageData._id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }), // You'll need a new API for this
    enabled: !!stage,
  });

  if (!stage) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-gray-400">Playoff stage is not started yet.</p>
      </div>
    );
  }

  if (isLoading) {
    return <AuthLoader />;
  }

  const isRoundCompleted = (matches) => {
    return matches.every((match) => match.status === "Completed");
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-indigo-900/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500 via-black to-blue-800 rounded-lg">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {playoff?.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Playoff Rounds */}
      <div className="space-y-4">
        {playoff?.rounds?.map((round, roundIndex) => {
          const roundCompleted = isRoundCompleted(round.matches);
          const remainingMatch = round.matches.find(
            (m) => m.status === "Scheduled",
          );
          return (
            <div
              key={roundIndex}
              className="liquid-glass-card overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-950/10 to-indigo-900/10 backdrop-blur-sm border border-gray-800 rounded-lg"
            >
              <div className="w-full p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {round.roundName}
                </h3>
                <div className="flex items-center gap-4">
                  {!roundCompleted && remainingMatch && (
                    <div>
                      <p className="text-sm text-muted-foreground mt-2 font-medium">
                        {" "}
                        End Date:{" "}
                        {moment.utc(remainingMatch?.roundEndDate).format("L") +
                          moment
                            .utc(remainingMatch?.roundEndDate)
                            .format(" LT")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800 p-4 space-y-4">
                {round.matches.map((match) => (
                  <div
                    key={match._id}
                    className="relative overflow-hidden  bg-gradient-to-br  from-purple-900/50 via-blue-950/5 to-indigo-900/40 rounded-xl p-3 sm:p-4 shadow-lg shadow-purple-600/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-300 text-sm font-medium">
                        {match.round}
                      </p>
                      {/* <StatusBadge status={match.status} /> */}
                    </div>

                    <div className="grid grid-cols-5 gap-2 items-center">
                      {/* Team 1 */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={match.team1.image.url || "/placeholder.svg"}
                            alt={match.team1.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {match.team1.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {match.team1.inGameUserName}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center justify-center">
                        <div
                          className={`text-center font-bold text-lg ${
                            match.winner?._id === match.team1._id
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {match.team1_score}
                        </div>
                        <div className="text-gray-500 mx-2">-</div>
                        <div
                          className={`text-center font-bold text-lg ${
                            match.winner?._id === match.team2._id
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {match.team2_score}
                        </div>
                      </div>

                      {/* Team 2 */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={match.team2.image.url || "/placeholder.svg"}
                            alt={match.team2.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {match.team2.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {match.team2.inGameUserName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {match.winner && (
                      <div className="mt-3 pt-3 border-t border-gray-700 text-center">
                        <p className="text-green-400 text-sm font-medium">
                          Winner: {match.winner.name} (
                          {match.winner.inGameUserName})
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Playoffs;
