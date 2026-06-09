import moment from "moment";
import { useAuthStore } from "../../../store/authStore";
import { useEffect, useState } from "react";
import AuthLoader from "../../Loaders/AuthLoader";
import { MdOutlineQueryStats } from "react-icons/md";
import {
  AlignStartVertical,
  LoaderCircle,
  Medal,
  SquareStar,
} from "lucide-react";

const Overview = ({ tournament, isLoading, leaderboard }) => {
  const { user } = useAuthStore();
  const myPerformance = leaderboard?.find(
    (team) => team.playerInfo._id === user?._id,
  );

  const myRank = leaderboard?.findIndex(
    (team) => team.playerInfo._id === user?._id,
  );

  return (
    <div className="space-y-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tournament Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="liquid-glass-card relative overflow-hidden p-6 rounded-xl bg-blue-black">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Medal className="text-[#6f85ff]" /> Tournament Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Tournament Name
                  </p>
                  <p className="font-bold text-lg bg-gradient-to-r from-[#fefa04] to-[#69fd00] bg-clip-text text-transparent">
                    {tournament?.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <span className="px-3 py-1 bg-[#89fe04] text-blue-900 rounded-full text-sm font-medium">
                    {tournament?.type}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Entry Fee
                  </p>
                  <p className="font-medium">{tournament?.entryFee}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Stages</p>
                  <p className="font-medium text-[#ff0082]">
                    2 Stages: League + Knockout
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Start Date
                  </p>
                  <p className="font-medium">
                    {moment(tournament?.startDate).format("LL")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">End Date</p>
                  <p className="font-medium">{tournament?.endDate || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Registration Deadline
                  </p>
                  <p className="font-medium text-muted-foreground">
                    {moment(tournament?.registrationDeadline).format("LL")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Organizer
                  </p>
                  <p className="font-medium text-[#fefb04]">
                    The eFootball Center
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Performance Overview */}
          <div className="liquid-glass-card relative overflow-hidden bg-red-black-opc p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MdOutlineQueryStats className="text-[#fefb04]" />
              My Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#69fd00]">
                  {myPerformance?.wins || 0}
                </div>
                <div className="text-sm text-primary-foreground">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {myPerformance?.losses || 0}
                </div>
                <div className="text-sm text-primary-foreground">Losses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#fefb04]">
                  {myPerformance?.draws || 0}
                </div>
                <div className="text-sm text-primary-foreground">Draws</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {myPerformance?.points || 0}
                </div>
                <div className="text-sm text-primary-foreground">Points</div>
              </div>
            </div>

            {/* Current Ranking */}
            <div className="bg-muted/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Ranking
                  </p>
                  <p className="text-2xl font-bold text-blue-300">
                    {myRank + 1 || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Goal Difference
                  </p>
                  <p className="text-xl font-bold text-green-300">
                    {myPerformance?.goalDifference > 0 ? "+" : ""}
                    {myPerformance?.goalDifference}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="liquid-glass-card relative overflow-hidden bg-yellow-green-opc border border-border/80 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlignStartVertical className="text-yellow-300 w-6 h-4" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Participants</span>
                <span className="font-medium">{tournament?.maxTeams}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-green-400">
                  {tournament?.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Prize Pool</span>
                <span className="font-bold text-[#f015c7]">
                  BDT {tournament?.prizes?.totalPool}
                </span>
              </div>
            </div>
          </div>

          {/* Tournament Progress */}
          <div className="liquid-glass-card relative overflow-hidden bg-yellow-green-opc border border-border/80 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <LoaderCircle className="text-yellow-300" /> Tournament Progress
            </h3>
            <div className="space-y-4">
              {tournament?.stages?.map((stage) => (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Stage {stage?.stageOrder}: {stage.stageName}
                    </span>
                    <span
                      className={`font-medium ${
                        stage?.stageData?.status === "Active" &&
                        "text-purple-400"
                      } ${
                        stage?.stageData?.status === "Pending" &&
                        "text-gray-400"
                      }
                      ${
                        stage?.stageData?.status === "Completed" &&
                        "text-green-400"
                      }`}
                    >
                      {stage?.stageData?.status}
                    </span>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full w-full ${
                        stage?.stageData?.status === "Active" &&
                        "bg-gradient-to-r from-yellow-400 to-green-400"
                      } ${
                        stage?.stageData?.status === "Pending" &&
                        "bg-gradient-to-r from-blue-700/40 to-blue-800/70"
                      }
                      ${
                        stage?.stageData?.status === "Completed" &&
                        "bg-green-400"
                      }`}
                    ></div>
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

export default Overview;
