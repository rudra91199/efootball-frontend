

import { useIsMobile } from "../../../Hooks/useIsMobile";
import { useAuthStore } from "../../../store/authStore";
import AuthLoader from "../../Loaders/AuthLoader";

export default function Leaderboards({ data, isLoading }) {
  const isMobile = useIsMobile();

  const { user } = useAuthStore();

  const getPositionColor = (position) => {
    if (position === 1) return "bg-yellow-600 text-white";
    if (position === 2) return "bg-gray-400 text-black";
    if (position === 3) return "bg-orange-600 text-white";
    return "bg-gray-700 text-white";
  };

  const getQualificationColor = (position) => {
    if (position <= 2) return "border-l-4 border-accent";
    if (position <= 4) return "border-l-4 border-primary";
    if (position >= 6) return "border-l-4 border-destructive";
    return "";
  };

  if (isLoading) {
    return <AuthLoader />;
  }
  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-3xl font-bold text-foreground">
            Leaderboards & Tables
          </h1>
        </div>

        <div className="space-y-3">
          {data?.map((team, i) => (
            <div
              key={i}
              className={`bg-white/5 px-2 py-4 rounded-lg border border-border/70  ${team.teamInfo.players.includes(user._id) ? "bg-gradient-to-br from-[#0124ec70] to-[#00189e23]" : ""}`}
            >
              {/* Top row: Team name on left, P/GD/Pts on right */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-[10px] font-bold ${getPositionColor(
                      i + 1,
                    )}`}
                  >
                    {i + 1}
                  </div>
                  <img
                    src={team.teamInfo.logo.url}
                    alt=""
                    className="w-8 h-8 object-cover rounded-full border-2 border-[#750200]"
                  />
                  <span className={`ml-2 text-[18px] font-medium text-white`}>
                    {team.teamInfo.name}
                  </span>
                </div>

                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">P</div>
                    <div className="font-bold text-foreground text-[18px]">
                      {team.matchesPlayed}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">GD</div>
                    <div
                      className={`font-bold text-[18px] ${team.goalDifference >= 0 ? "text-[#69fd00]" : "text-[#fd5a58]"}`}
                    >
                      {team.goalDifference > 0 ? "+" : ""}
                      {team.goalDifference}
                    </div>
                  </div>
                  <div className="text-center mr-2">
                    <div className="text-xs text-muted-foreground">Pts</div>
                    <div className="font-bold text-[#f015c7] text-[18px]">
                      {team.points}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom row: W/D/L/GF/GA stats */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div>
                  <div className="text-muted-foreground text-[16px]">W</div>
                  <div className="font-bold text-[#69fd00] text-[18px]">
                    {team.wins}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[16px]">D</div>
                  <div className="font-bold text-[18px] text-blue-400 ">
                    {team.draws}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[16px]">L</div>
                  <div className="font-bold text-[18px] text-[#f72b28]">
                    {team.losses}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[16px]">GF</div>
                  <div className="font-bold text-[18px] text-green-300">
                    {team.goalsFor}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[16px]">GA</div>
                  <div className="font-bold text-[18px] text-red-300 ">
                    {team.goalsAgainst}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Leaderboards & Tables
        </h1>
      </div>

      <div className="space-y-6 sm:w-auto">
        <div className="clean-card sm:p-6 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-foreground">
                    Pos
                  </th>
                  <th className="py-3 px-2 text-sm font-medium text-foreground">
                    Team
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    P
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    W
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    D
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    L
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    GF
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    GA
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    GD
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground">
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((team, i) => (
                  <tr
                    key={i}
                    className={`border-b border-border/50 hover:bg-background/20 transition-colors ${getQualificationColor(
                      i + 1,
                    )}`}
                  >
                    <td className="py-3 px-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPositionColor(
                          i + 1,
                        )}`}
                      >
                        {i + 1}
                      </div>
                    </td>
                    <td className="py-3 px-2 w-[10px]">
                      <span
                        className={`font-medium ${
                          team.teamInfo.name === "Your Team"
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {team.teamInfo.name}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-foreground">
                      {team.matchesPlayed}
                    </td>
                    <td className="py-3 px-2 text-center text-green-400">
                      {team.wins}
                    </td>
                    <td className="py-3 px-2 text-center text-gray-300">
                      {team.draws}
                    </td>
                    <td className="py-3 px-2 text-center text-red-400">
                      {team.losses}
                    </td>
                    <td className="py-3 px-2 text-center text-foreground">
                      {team.goalsFor}
                    </td>
                    <td className="py-3 px-2 text-center text-foreground">
                      {team.goalsAgainst}
                    </td>
                    <td className="py-3 px-2 text-center text-foreground">
                      {team.goalDifference > 0 ? "+" : ""}
                      {team.goalDifference}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-primary">
                      {team.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
