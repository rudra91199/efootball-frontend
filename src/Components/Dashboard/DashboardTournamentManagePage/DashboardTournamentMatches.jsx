import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { useParams } from "react-router";
import AuthLoader from "../../Loaders/AuthLoader";
import moment from "moment";

const DashboardTournamentMatches = () => {
  const { id } = useParams();
  const { data: { data: { data: matches } = {} } = {}, isLoading } = useQuery({
    queryKey: ["tournamentMatches"],
    queryFn: () => {
      return API.get(`/matchHistory/getTournamentMatches/${id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  const getDeadLine = (roundStartTime) => {
    if (roundStartTime) {
      const date = new Date(roundStartTime);

      date?.setHours(date?.getHours() + 10);

      const newDateString = date;
      return newDateString;
    }
  };

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <div className="space-y-6 text-white">
      <div className="bg-card border border-border/20 p-2 sm:p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-6">Tournament Matches</h3>
        {/* Individual Player Matches List */}
        <div className="space-y-4">
          {/* Completed Matches */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-green-400">
              Scheduled Matches
            </h4>
            <div className="space-y-3">
              {matches
                ?.filter((match) => match.result === "Pending")
                ?.map((match) => {
                  const deadline = moment(getDeadLine(match?.matchDate));
                  const now = moment();
                  const hasDeadlinePassed = now.isAfter(deadline);
                  return (
                    <>
                      {hasDeadlinePassed && (
                        <div className="bg-muted/10 border border-border/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">
                                {match?.match?.round}
                              </span>
                              <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                                {match?.result}
                              </span>
                            </div>
                            {/* <span className="text-sm text-muted-foreground">
                        Jan 20, 2024 • 19:15
                      </span> */}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 justify-between mb-4 gap-5 sm:gap-0">
                            <div className="flex items-center gap-4 flex-col-reverse sm:flex-row">
                              <div className="w-12 h-12 overflow-hidden bg-primary/20 rounded-full flex items-center justify-center">
                                <img
                                  src={match?.player?.image.url}
                                  alt=""
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <span className="font-medium">
                                {match?.player?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                              <span className="text-2xl font-bold text-green-400">
                                {match?.scoreFor}
                              </span>
                              <span className="text-muted-foreground">vs</span>
                              <span className="text-2xl font-bold">
                                {match?.scoreAgainst}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 flex-col-reverse sm:flex-row justify-end">
                              <span className="font-medium">
                                {match?.opponent?.name}
                              </span>
                              <div className="w-12 h-12 overflow-hidden bg-muted/30 rounded-full">
                                <img
                                  src={match?.opponent?.image.url}
                                  alt=""
                                  className="object-cover w-12 h-12"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {/* {match.tournament.type}: {match.match.team1.name} vs{" "}
                          {match.match.team2.name} */}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
            </div>
          </div>

          {/* Scheduled Matches */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-yellow-400">
              Completed Matches
            </h4>
            <div className="space-y-3">
              {matches
                ?.filter((match) => match.result !== "Pending")
                ?.map((match) => (
                  <div className="bg-muted/10 border border-border/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {match?.match?.round}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          {match?.result}
                        </span>
                      </div>
                      {/* <span className="text-sm text-muted-foreground">
                        Jan 20, 2024 • 19:15
                      </span> */}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 justify-between mb-4 gap-5 sm:gap-0">
                      <div className="flex items-center gap-4 flex-col-reverse sm:flex-row">
                        <div className="w-12 h-12 overflow-hidden bg-primary/20 rounded-full flex items-center justify-center">
                          <img
                            src={match?.player?.image.url}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="font-medium">
                          {match?.player?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <span className="text-2xl font-bold text-green-400">
                          {match?.scoreFor}
                        </span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="text-2xl font-bold">
                          {match?.scoreAgainst}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 flex-col-reverse sm:flex-row justify-end">
                        <span className="font-medium">
                          {match?.opponent?.name}
                        </span>
                        <div className="w-12 h-12 overflow-hidden bg-muted/30 rounded-full">
                          <img
                            src={match?.opponent?.image.url}
                            alt=""
                            className="object-cover w-12 h-12"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-background/50 rounded-lg p-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {match.tournament.type}: {match.match.team1.name} vs{" "}
                          {match.match.team2.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTournamentMatches;
