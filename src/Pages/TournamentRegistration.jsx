import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../axios";
import { useNavigate, useParams } from "react-router";
import moment from "moment";
import { useAuthStore } from "../store/authStore";
import TeamRegister from "./TeamRegister";
import { toast } from "react-toastify";
import { ArrowBigRight, ArrowRight, ArrowRightCircle, ArrowRightFromLine, Goal, MoveRight } from "lucide-react";
import { includes } from "zod";
import AuthLoader from "../Components/Loaders/AuthLoader";

export default function TournamentRegistration() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    data: { data: { data: tournament } = {} } = {},
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["tournament", id],
    queryFn: () => {
      return API.get(`/tournaments/${id}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  if (isLoading) {
    return <AuthLoader/>;
  }

  const registerPlayerInLeague = async () => {
    setLoading(true);
    try {
      const response = await API.post(
        `/leagues/${tournament.stages[0].stageData._id}/${tournament._id}/register`,
        { playerId: user._id },
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      if (response.data.success) {
        refetch();
        setLoading(false);
        alert("You have been registered in the league!");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };


  const handleNavigate = (type, tournamentId) => {
    if (type === "trifecta") {
      navigate(`/dashboard/my-tournaments/tournament/${tournamentId}`);
    } else if (
      type === "league + knockout solo" ||
      type === "champions circuit"
    ) {
      navigate(`/dashboard/my-tournaments/league-knockout/${tournamentId}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-20 px-2 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-12">
            <h1 className="text-xl sm:text-4xl font-black mb-4">
              Tournament Registration
            </h1>
            <p className="text-white/60 text-sm sm:text-lg">
              {tournament?.type === "League + Knockout Solo"
                ? "Register yourself for the selected tournament"
                : "Register your team for the selected tournament"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Tournament Details */}
            <div className="space-y-0 px-1">
              <div className="liquid-glass-card relative before:rounded-2xl px-6 py-6 sm:p-8 bg-gradient-to-br from-black to-[#5a72ff73]">
                <div className="card-content justify-between">

                  {!tournament?.type.includes("Team") &&
                  tournament?.stages[0]?.stageData?.participants?.includes(
                    user._id
                  ) ? (
                    <div className="bg-pink-red-opc text-white sm:px-4 text-xs pt-2 pb-2 px-2 sm:py-2 rounded-full sm:text-sm font-bold mb-1">
                      SUCCESFULLY REGISTERED
                    </div>
                  ) : (
                    <div className="bg-pink-red text-white sm:px-4 text-xs pt-2 pb-2 px-2 sm:py-2 rounded-full sm:text-sm font-bold mb-1">
                      LIVE REGISTRATION
                    </div>
                  )}

                  <div className="text-white/60">
                    {moment(tournament?.startDate).format("LL")}
                  </div>
                </div>

                <h2 className="text-xl sm:text-3xl bg-yellow-green-text font-extrabold mb-4">
                  {tournament?.name}
                </h2>
                <p className="text-white/70 mb-6 truncate">
                  {tournament?.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-black text-yellow mb-1">
                      {tournament?.name == "The Gauntlet Of Contenders"?
                      "Surprise"
                      :
                      tournament?.prizes?.totalPool + " BDT"
                      }
                    </div>
                    <div className="text-white/60 text-sm">Prize Pool</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-black text-green mb-1">
                      {tournament?.maxTeams || tournament?.maxPlayers}
                    </div>
                    <div className="text-white/60 text-sm">
                      Max {tournament?.maxTeams ? "Teams" : "Players"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-black text-pink mb-1">
                    {tournament?.type === "Trifecta"
                        ? tournament?.maxTeams -
                          tournament?.teams?.filter(
                            (team) => team.status === "Approved"
                          ).length
                        :
                          tournament?.stages[0]?.stageData?.participants
                            ?.length}
                    </div>
                    <div className="text-white/60 text-sm">Registered</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-black text-blue-300 mb-1">
                      {tournament?.entryFee}
                    </div>
                    <div className="text-white/60 text-sm">Entry Fee</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Format:</span>
                    <span className="font-semibold">{tournament?.type}</span>
                  </div>
                  <div className={`flex justify-between items-center ${tournament?.type === "League + Knockout Solo" &&
                  tournament?.stages[0]?.stageData?.participants?.includes(
                    user._id
                  ) && "hidden"}`}>
                    <span className="text-white/70">
                      Registration Deadline:
                    </span>
                    <span className="font-semibold text-red-400">
                      {moment
                        .utc(tournament?.registrationDeadline)
                        .format("LL")}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center ${tournament?.type === "League + Knockout Solo" &&
                  tournament?.stages[0]?.stageData?.participants?.includes(
                    user._id
                  ) && "hidden"}`}>
                    <span className="text-white/70">Spots Remaining:</span>
                    <span className="font-semibold text-green-400">
                      {tournament?.type === "Trifecta"
                        ? tournament?.maxTeams -
                          tournament?.teams?.filter(
                            (team) => team.status === "Approved"
                          ).length
                        : tournament?.maxTeams -
                          tournament?.stages[0]?.stageData?.participants
                            ?.length}
                    </span>
                  </div>
                  {!tournament?.type.includes("Team") &&
                    !tournament?.stages[0]?.stageData?.participants?.includes(
                      user._id
                    ) ? (
                      <button
                        onClick={() => registerPlayerInLeague()}
                        className="glass-button w-full py-2 sm:py-4 rounded-lg font-bold text-lg text-dark-blue cursor-pointer hover:brightness-200 transition-all"
                        disabled={loading}
                      >
                        {loading ? "Please wait..." : "Register Now"}
                      </button>
                    )
                  :
                      <button
                        onClick={() => handleNavigate(tournament?.type.toLowerCase(), tournament._id)}
                        className="flex items-center justify-center gap-2 bg-red-black w-full py-2 sm:py-4 rounded-lg font-bold text-xs text-white cursor-pointer hover:brightness-200 transition-all"
                        disabled={loading}
                      >
                        YOUR TOURNAMENT PAGE <ArrowRightCircle/>
                      </button>
                  }
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            {tournament?.type.includes("Team") && (
              <TeamRegister tournament={tournament} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
