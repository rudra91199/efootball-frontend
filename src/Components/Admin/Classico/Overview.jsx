import {
  Trophy,
  Users,
  Activity,
  Calendar,
  DollarSign,
  Clock,
  Play,
  Flag,
  Settings2,
  Loader2,
  Shield,
  Target,
  Flame,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { toast } from "react-toastify";
import AuthLoader from "../../Loaders/AuthLoader";
// import useScrollReveal from "../../../Hooks/userScrollReveal"; // Assuming you still need this if used elsewhere

export default function Overview({ tournament }) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  // ==========================================
  // FETCH LIVE LEADERBOARD DATA
  // ==========================================
  const TOURNAMENT_ID = tournament?._id || tournament?.id;

  const { data: leaderboardResponse, isLoading } = useQuery({
    queryKey: ["championship-leaderboard-banner", TOURNAMENT_ID],
    queryFn: () => {
      return API.get(`/massacre/championship-leaderboard/${TOURNAMENT_ID}`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
    enabled: !!TOURNAMENT_ID, // Only run the query if we have an ID
  });

  
  const leaderboardData = leaderboardResponse?.data?.data;
console.log(leaderboardData)
  if (!tournament) return null;
if (isLoading) {
  <AuthLoader/>
}
  const activeStage = tournament?.stages?.[0];

  // ==========================================
  // SCORE & DOMINATION LOGIC
  // ==========================================
  const team1 = leaderboardData?.[0]
  const team2 = leaderboardData?.[1] 

  const t1Abbr = team1?.teamName?.substring(0, 3).toUpperCase();
  const t2Abbr = team2?.teamName?.substring(0, 3).toUpperCase();
  // Safely extract the fetched scores, falling back to metadata or 0
  const fetchedTeam1Score = leaderboardData?.[0]?.teamGrandTotal;
  const fetchedTeam2Score = leaderboardData?.[1]?.teamGrandTotal;



  const isDraw = fetchedTeam1Score === fetchedTeam2Score;
  const totalPoints = fetchedTeam1Score + fetchedTeam2Score;
  const t1Percentage = totalPoints > 0 ? (fetchedTeam1Score / totalPoints) * 100 : 50;
  const t2Percentage = totalPoints > 0 ? (fetchedTeam2Score / totalPoints) * 100 : 50;
  const pointDiff = Math.abs(fetchedTeam1Score - fetchedTeam2Score);

  const getStageStatusColor = (isActive) => {
    if (isActive)
      return "text-[#e11d48] bg-[#e11d48]/10 border-[#e11d48]/30 shadow-[0_0_15px_rgba(225,29,72,0.2)]";
    return "text-gray-400 bg-white/5 border-white/10";
  };

  const getStageStatusIcon = (isActive) => {
    if (isActive) return <Activity className="w-4 h-4 text-[#e11d48]" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const handleStatusUpdate = async (newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to transition the match state to: ${newStatus}?`
      )
    )
      return;

    setIsUpdating(true);
    try {
      const response = await API.patch(
        `/tournaments/update-status/${TOURNAMENT_ID}`,
        { status: newStatus },
        { headers: { Authorization: localStorage.getItem("authToken") } }
      );

      if (response.data.success) {
        toast.success(`Match state updated to ${newStatus}`);
        queryClient.invalidateQueries(["tournament"]);
        queryClient.invalidateQueries(["tournaments"]);
        // Invalidate the leaderboard query so scores update immediately
        queryClient.invalidateQueries(["championship-leaderboard-banner", TOURNAMENT_ID]);
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update match state."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in mb-20 font-sans">
      {/* 1. ADMIN SCOREBOARD WIDGET (Centered & Overflow-Proof) */}
      <div className="bg-[#0a0b10]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 sm:p-10 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 relative z-10">
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2 uppercase tracking-widest">
            <Activity className="w-5 h-5 text-[#e11d48]" />
            Live Score Database
          </h3>
          <span
            className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border ${
              tournament.status === "Live"
                ? "text-green-500 bg-green-500/10 border-green-500/30 animate-pulse"
                : "text-[#e11d48] bg-[#e11d48]/10 border-[#e11d48]/30"
            }`}
          >
            {tournament.status === "Completed"
              ? "Final Whistle"
              : `State: ${tournament.status}`}
          </span>
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(225,29,72,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* Main Score Row (Stacks on mobile, row on desktop) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-10 relative z-10">
          {/* SQUAD 1 */}
          <div className="flex flex-col items-center w-full md:w-1/3 text-center">
            <span className="text-2xl sm:text-3xl text-white uppercase tracking-widest font-black mb-2 flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-[#e11d48]" />
              {t1Abbr}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 px-4 truncate max-w-full">
              {team1?.teamName}
            </span>
            <span className="text-7xl sm:text-8xl font-black text-[#e11d48] drop-shadow-[0_0_15px_rgba(225,29,72,0.4)] leading-none">
              {fetchedTeam1Score}
            </span>
          </div>

          {/* VS DIVIDER */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <span className="text-3xl sm:text-4xl font-black text-gray-700 italic uppercase tracking-[0.3em] mb-3">
              VS
            </span>
          </div>

          {/* SQUAD 2 */}
          <div className="flex flex-col items-center w-full md:w-1/3 text-center">
            <span className="text-7xl sm:text-8xl mb-4 font-black text-[#ec4899] drop-shadow-[0_0_15px_rgba(236,72,153,0.4)] leading-none">
              {fetchedTeam2Score}
            </span>
            <span className="text-2xl sm:text-3xl text-white uppercase tracking-widest font-black mb-2 flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-[#ec4899]" />
              {t2Abbr}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest  px-4 truncate max-w-full">
              {team2?.teamName}
            </span>
          </div>
        </div>

        {/* DOMINATION BAR */}
        <div className="w-full bg-[#030305] rounded-xl p-4 border border-white/5 relative z-10 shadow-inner">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
              {t1Abbr} • {t1Percentage.toFixed(1)}%
            </span>
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em]">
              Goal Domination
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ec4899]">
              {t2Percentage.toFixed(1)}% • {t2Abbr}
            </span>
          </div>
          <div className="w-full h-2.5 sm:h-3 bg-[#0a0b10] rounded-full overflow-hidden flex shadow-inner border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#e11d48] to-[#9f1239] transition-all duration-1000 ease-out"
              style={{ width: `${t1Percentage}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-[#9d174d] to-[#ec4899] transition-all duration-1000 ease-out"
              style={{ width: `${t2Percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. TOURNAMENT PIPELINE / PROGRESS */}
      <div className="bg-[#0a0b10]/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-inner">
        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
          <Activity className="w-5 h-5 text-[#e11d48]" />
          Fixture Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0" />
          {tournament?.stages?.map((stage, index) => {
            const isActive = stage.stageOrder === activeStage?.stageOrder;
            return (
              <div
                key={stage._id?.$oid || index}
                className="relative z-10 transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className={`flex flex-col items-center p-6 rounded-[16px] border backdrop-blur-md transition-colors ${
                    isActive
                      ? "bg-[#030305]/90 border-[#e11d48]/50 shadow-[0_0_30px_rgba(225,29,72,0.15)]"
                      : "bg-[#030305]/60 border-white/5"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border shadow-inner ${getStageStatusColor(
                      isActive
                    )}`}
                  >
                    {getStageStatusIcon(isActive)}
                  </div>
                  <h4
                    className={`font-black text-base uppercase tracking-wider mb-2 text-center ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {stage.stageName}
                  </h4>
                  <span
                    className={`text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-md border ${getStageStatusColor(
                      isActive
                    )}`}
                  >
                    {stage.stageType} Phase
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. PRIZE POOL BREAKDOWN */}
        <div className="lg:col-span-2 bg-[#0a0b10]/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-inner">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-widest">
              <Trophy className="w-5 h-5 text-[#e11d48]" />
              Bounty Allocation
            </h3>
            <div className="sm:text-right bg-[#030305] px-4 py-2 rounded-xl border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">
                Total Purse
              </p>
              <p className="text-xl font-black text-[#e11d48]">
                BDT {tournament?.prizes?.totalPool?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {tournament?.prizes?.placements?.map((prize, index) => (
              <div
                key={prize._id?.$oid || index}
                className="flex items-center justify-between p-4 rounded-xl bg-[#030305]/60 border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-[10px] flex items-center justify-center font-black text-sm shadow-inner ${
                      index === 0
                        ? "bg-gradient-to-br from-[#e11d48] to-[#9f1239] text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] border border-[#e11d48]"
                        : index === 1
                        ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black border border-gray-400"
                        : index === 2
                        ? "bg-gradient-to-br from-orange-700 to-orange-900 text-white border border-orange-700"
                        : "bg-white/5 text-gray-400 border border-white/10"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-wider group-hover:text-[#e11d48] transition-colors">
                      {prize.position}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-white">
                    BDT {prize.amount?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {tournament?.prizes?.individualAwards?.map((award, index) => (
              <div
                key={award._id?.$oid || index}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#e11d48]/10 to-transparent border border-[#e11d48]/20 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-[#030305] border border-white/5 text-[#e11d48] shadow-inner">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-wider group-hover:text-[#e11d48] transition-colors">
                      {award.awardName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-white">
                    BDT {award.amount?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {!tournament?.prizes?.placements?.length &&
              !tournament?.prizes?.individualAwards?.length && (
                <div className="text-center py-10 bg-[#030305]/60 border border-dashed border-white/10 rounded-[16px]">
                  <DollarSign className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Prize purse not configured yet.
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* 4. QUICK INFO & ACTIONS */}
        <div className="space-y-6">
          <div className="bg-[#0a0b10]/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-inner">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Calendar className="w-5 h-5 text-[#ec4899]" />
              Tournament Specs
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Entry Fee
                </span>
                <span className="text-xs font-black text-[#ec4899] bg-[#ec4899]/10 border border-[#ec4899]/30 px-3 py-1 rounded-md">
                  {tournament?.entryFee === 0
                    ? "Free Entry"
                    : `BDT ${tournament?.entryFee}`}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Format
                </span>
                <span
                  className="text-[11px] font-black text-white uppercase tracking-wider text-right max-w-[150px] truncate"
                  title={tournament?.type}
                >
                  {tournament?.type}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Reg. Deadline
                </span>
                <span className="text-xs font-black text-rose-400">
                  {tournament?.registrationDeadline?.$date
                    ? new Date(
                        tournament.registrationDeadline.$date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBD"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Kickoff Date
                </span>
                <span className="text-xs font-black text-[#69fd00]">
                  {tournament?.startDate?.$date
                    ? new Date(tournament.startDate.$date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )
                    : "TBD"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#030305] border border-white/5 rounded-[20px] p-5 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e11d48] to-transparent" />
              <Users className="w-6 h-6 text-[#e11d48] mb-3" />
              <span className="text-3xl font-black text-white">
                {tournament?.teams?.length || 0}
              </span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                Squads
              </span>
            </div>
            <div className="bg-[#030305] border border-white/5 rounded-[20px] p-5 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ec4899] to-transparent" />
              <Flame className="w-6 h-6 text-[#ec4899] mb-3" />
              <span className="text-3xl font-black text-white">
                {tournament?.maxTeams || 0}
              </span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                Capacity
              </span>
            </div>
          </div>

          <div className="bg-[#0a0b10]/90 backdrop-blur-xl border border-[#e11d48]/30 rounded-[24px] p-6 shadow-[0_0_30px_rgba(225,29,72,0.15)] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[radial-gradient(circle,rgba(225,29,72,0.2)_0%,transparent_70%)] pointer-events-none" />
            <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2 uppercase tracking-widest">
              <Settings2 className="w-5 h-5 text-[#e11d48]" /> Match Control
            </h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
              Current State:{" "}
              <span className="text-white font-black">
                {tournament?.status || "Unknown"}
              </span>
            </p>

            <div className="flex flex-col gap-3">
              {tournament?.status !== "Published" &&
                tournament?.status !== "Live" &&
                tournament?.status !== "Completed" && (
                  <button
                    onClick={() => handleStatusUpdate("Published")}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] sm:text-xs font-black text-white uppercase tracking-widest transition-all"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}{" "}
                    Publish Fixtures
                  </button>
                )}
              {tournament?.status !== "Live" &&
                tournament?.status !== "Completed" && (
                  <button
                    onClick={() => handleStatusUpdate("Live")}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[#e11d48]/10 hover:bg-[#e11d48]/20 border border-[#e11d48]/30 rounded-xl text-[10px] sm:text-xs font-black text-[#e11d48] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(225,29,72,0.15)]"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}{" "}
                    Kickoff Tournament
                  </button>
                )}
              {tournament?.status !== "Completed" && (
                <button
                  onClick={() => handleStatusUpdate("Completed")}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[#ec4899]/10 hover:bg-[#ec4899]/20 border border-[#ec4899]/30 rounded-xl text-[10px] sm:text-xs font-black text-[#ec4899] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Flag className="w-4 h-4" />
                  )}{" "}
                  Blow Final Whistle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}