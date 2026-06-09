import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import AuthLoader from "../../Loaders/AuthLoader";
import { API } from "../../../axios";
import { ChevronRight, Swords, Trophy, Crown, Flame } from "lucide-react";

const ClassicoLiveCounter = () => {
  const navigate = useNavigate();
  const CLASSICO_TOURNAMENT_ID = "69a4db2bb752126f7d7768e4";

  const { data: { data: { data: leaderboardData } = {} } = {}, isLoading } =
    useQuery({
      queryKey: ["championship-leaderboard", CLASSICO_TOURNAMENT_ID],
      queryFn: () => {
        return API.get(
          `/massacre/championship-leaderboard/${CLASSICO_TOURNAMENT_ID}`,
          {
            headers: {
              Authorization: localStorage.getItem("authToken"),
            },
          },
        );
      },
    });

  if (isLoading) {
    return (
      <div className="w-full h-[82dvh] sm:h-[100vh] bg-[#05050a] flex items-center justify-center border-b border-white/5">
        <AuthLoader />
      </div>
    );
  }

  const team1 = leaderboardData?.[0] || null;
  const team2 = leaderboardData?.[1] || null;

  const team1Score = team1?.teamGrandTotal || 0;
  const team2Score = team2?.teamGrandTotal || 0;
  const isTeam1Winner = team1Score > team2Score;
  const isTeam2Winner = team2Score > team1Score;
  const isDraw = team1Score === team2Score;

  // ==========================================
  // FIGHTING GAME ESPORTS THEME ENGINE
  // ==========================================
  const getTeamStyles = (teamName, isDefeated) => {
    if (isDefeated) {
      return {
        neonColor: "#450a0a",
        edgeGradient: "linear-gradient(to bottom, #450a0a, #000000)",
        barGradientCSS: "linear-gradient(to right, #450a0a, #000000)",
        metalGradient:
          "linear-gradient(180deg, #52525b 0%, #27272a 40%, #000000 100%)", // Ash/Dead Metal
        abbreviation:
          teamName === "Real Madrid" || teamName === "RMA" ? "RMA" : "FCB",
      };
    }

    if (teamName === "RMA" || teamName === "Real Madrid") {
      return {
        neonColor: "#eab308",
        edgeGradient: "linear-gradient(to bottom, #ffffff, #eab308)",
        barGradientCSS: "linear-gradient(to right, #ffffff, #eab308)",
        metalGradient:
          "linear-gradient(180deg, #fef08a 0%, #ca8a04 40%, #713f12 50%, #a16207 100%)",
        abbreviation: "RMA",
      };
    }
    if (
      teamName === "Barca" ||
      teamName === "FC Barcelona" ||
      teamName === "FCB"
    ) {
      return {
        neonColor: "#ef4444", // Bright arcade red
        edgeGradient: "linear-gradient(to bottom, #ef4444, #004D97)",
        barGradientCSS: "linear-gradient(to right, #ef4444, #004d98)",
        metalGradient:
          "linear-gradient(180deg, #fca5a5 0%, #ef4444 40%, #7f1d1d 50%, #450a0a 100%)",
        abbreviation: "FCB",
      };
    }
    return {
      neonColor: "#6366f1",
      edgeGradient: "linear-gradient(to bottom, #6366f1, #4f46e5)",
      barGradientCSS: "linear-gradient(to right, #6366f1, #4f46e5)",
      metalGradient:
        "linear-gradient(180deg, #a5b4fc 0%, #4f46e5 40%, #312e81 50%, #4338ca 100%)",
      abbreviation: teamName?.substring(0, 3).toUpperCase() || "TBD",
    };
  };

  const t1Styles = getTeamStyles(team1?.teamName, isTeam2Winner);
  const t2Styles = getTeamStyles(team2?.teamName, isTeam1Winner);

  const totalPoints = team1Score + team2Score;
  const t1Percentage = totalPoints > 0 ? (team1Score / totalPoints) * 100 : 50;
  const t2Percentage = totalPoints > 0 ? (team2Score / totalPoints) * 100 : 50;
  const pointDiff = Math.abs(team1Score - team2Score);

  return (
    <>
      {team1 && team2 && (
        <>
          <div
            className="absolute left-0 top-0 w-1.5 sm:w-2 lg:w-3 h-full z-10"
            style={{
              backgroundImage: t1Styles.edgeGradient,
              boxShadow: `0 0 35px 5px ${t1Styles.neonColor}40`,
            }}
          />
          <div
            className="absolute right-0 top-0 w-1.5 sm:w-2 lg:w-3 h-full z-10"
            style={{
              backgroundImage: t2Styles.edgeGradient,
              boxShadow: `0 0 35px 5px ${t2Styles.neonColor}40`,
            }}
          />
        </>
      )}

      {team1 && team2 ? (
        <div className="w-full max-w-7xl flex flex-col items-center justify-center h-full relative overflow-hidden">
          {/* Arcade Fighter Gridded Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none z-0" />

          {/* SKEWED ESPORTS BADGE (Fixes overlap by being a distinct, tight container) */}
          <div className="mb-8 lg:mb-16 z-30 transform -skew-x-12 bg-yellow-500/10 border-l-4 border-r-4 border-yellow-500 px-6 py-2 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            <div className="transform skew-x-12 flex items-center gap-3">
              <Flame className="w-4 h-4 text-yellow-500" />
              <span className="text-[10px] sm:text-xs lg:text-sm font-black text-yellow-500 uppercase tracking-[0.3em]">
                Tournament Concluded • Final Results
              </span>
            </div>
          </div>

          {/* --- MAIN FIGHT SCOREBOARD --- */}
          <div className="w-full flex flex-row items-center justify-center gap-4 sm:gap-12 lg:gap-24 mb-12 lg:mb-16">
            {/* ================= TEAM 1 (PLAYER 1) ================= */}
            <div className="flex flex-col items-center w-1/3 sm:flex-1 relative group">
              {/* "K.O." Style Winner Stamp */}
              {isTeam1Winner && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 z-0 opacity-20 pointer-events-none">
                  <span className="text-6xl sm:text-8xl md:text-9xl font-black text-yellow-500 tracking-tighter uppercase whitespace-nowrap">
                    Victorious
                  </span>
                </div>
              )}

              {/* Logo Container - Crown is now anchored INSIDE this box */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 relative mb-4 lg:mb-8 flex items-center justify-center">
                {/* Properly Positioned Tilted Crown */}
                {isTeam1Winner && (
                  <div className="absolute -top-6 -right-2 sm:-top-8 sm:-right-4 z-40 transform rotate-[25deg]">
                    <Crown
                      className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]"
                      strokeWidth={2.5}
                    />
                  </div>
                )}

                <div
                  className="absolute inset-0 blur-[30px] lg:blur-[50px] opacity-50 rounded-full"
                  style={{ background: t1Styles.neonColor }}
                />

                <img
                  src={team1.teamLogo || "/placeholder.svg"}
                  alt={team1._id}
                  className={`w-full h-full object-contain relative z-10 transition-transform duration-500 
                    ${isTeam2Winner ? "grayscale-[90%] opacity-30 blur-[1px]" : "scale-105 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"}
                  `}
                />
              </div>

              <div
                style={{ filter: `drop-shadow(0px 10px 15px rgba(0,0,0,0.9))` }}
              >
                <h3
                  className="text-6xl sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-black sm:pr-4 italic leading-none"
                  style={{
                    backgroundImage: t1Styles.metalGradient,
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {team1Score}
                </h3>
              </div>
              <p
                className={`text-[12px] sm:text-sm lg:text-xl font-black uppercase tracking-[0.4em] mt-2 italic ${isTeam2Winner ? "text-gray-700" : "text-white"}`}
              >
                {t1Styles.abbreviation}
              </p>
            </div>

            {/* ================= AGGRESSIVE VS DIVIDER ================= */}
            <div className="flex flex-col items-center justify-center shrink-0 relative z-30">
              <div className="p-4 sm:p-6 lg:p-8 rounded-none bg-[#05050a] border-2 border-white/10 transform rotate-45 group shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <Swords
                  className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-400 -rotate-45"
                  strokeWidth={1.5}
                />
              </div>
              <div className="absolute top-[130%] lg:top-[140%] flex flex-col items-center w-max bg-black/80 px-4 py-2 border-l-2 border-r-2 border-white/20 transform -skew-x-12">
                <span className="text-[9px] sm:text-[10px] lg:text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1 transform skew-x-12">
                  {isDraw ? "Standstill" : "Victory Margin"}
                </span>
                <div className="text-sm sm:text-base lg:text-lg font-black text-white transform skew-x-12">
                  {pointDiff} PTS
                </div>
              </div>
            </div>

            {/* ================= TEAM 2 (PLAYER 2) ================= */}
            <div className="flex flex-col items-center w-1/3 sm:flex-1 relative group">
              {/* "K.O." Style Winner Stamp */}
              {isTeam2Winner && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 z-0 opacity-20 pointer-events-none">
                  <span className="text-6xl sm:text-8xl md:text-9xl font-black text-yellow-500 tracking-tighter uppercase whitespace-nowrap">
                    Victorious
                  </span>
                </div>
              )}

              {/* Logo Container - Crown is now anchored INSIDE this box */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 relative mb-4 lg:mb-8 flex items-center justify-center">
                {/* Properly Positioned Tilted Crown */}
                {isTeam2Winner && (
                  <div className="absolute -top-6 -right-2 sm:-top-8 sm:-right-4 z-40 transform rotate-[25deg]">
                    <Crown
                      className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]"
                      strokeWidth={2.5}
                    />
                  </div>
                )}

                <div
                  className="absolute inset-0 blur-[30px] lg:blur-[50px] opacity-50 rounded-full"
                  style={{ background: t2Styles.neonColor }}
                />

                <img
                  src={team2.teamLogo || "/placeholder.svg"}
                  alt={team2._id}
                  className={`w-full h-full object-contain relative z-10 transition-transform duration-500 
                    ${isTeam1Winner ? "grayscale-[90%] opacity-30 blur-[1px]" : "scale-105 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"}
                  `}
                />
              </div>

              <div
                style={{ filter: `drop-shadow(0px 10px 15px rgba(0,0,0,0.9))` }}
              >
                <h3
                  className="text-6xl sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-black sm:pr-4 italic leading-none"
                  style={{
                    backgroundImage: t2Styles.metalGradient,
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {team2Score}
                </h3>
              </div>
              <p
                className={`text-[12px] sm:text-sm lg:text-xl font-black uppercase tracking-[0.4em] mt-2 italic ${isTeam1Winner ? "text-gray-700" : "text-white"}`}
              >
                {t2Styles.abbreviation}
              </p>
            </div>
          </div>

          {/* --- FIGHTING GAME HEALTH BAR (Skewed & Hard Edged) --- */}
          <div className="w-full max-w-4xl mt-12 lg:mt-16 px-4 sm:px-0 z-30">
            <div className="flex justify-between items-end mb-2 px-2">
              <span
                className="text-xs lg:text-sm font-black uppercase tracking-widest italic"
                style={{ color: t1Styles.neonColor }}
              >
                T1 • {t1Percentage.toFixed(1)}%
              </span>
              <span
                className="text-xs lg:text-sm font-black uppercase tracking-widest italic"
                style={{ color: t2Styles.neonColor }}
              >
                {t2Percentage.toFixed(1)}% • T2
              </span>
            </div>

            {/* Skewed Container */}
            <div className="w-full h-5 lg:h-7 bg-[#0a0a14] transform -skew-x-12 flex border-2 border-white/10 overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <div
                className="h-full border-r-4 border-black"
                style={{
                  width: `${t1Percentage}%`,
                  backgroundImage: t1Styles.barGradientCSS,
                }}
              />
              <div
                className="h-full"
                style={{
                  width: `${t2Percentage}%`,
                  backgroundImage: t2Styles.barGradientCSS,
                }}
              />
            </div>
          </div>

          {/* --- ACTION BUTTON --- */}
          <div className="mt-14 lg:mt-20 z-30 w-full flex justify-center">
            <button
              onClick={() =>
                navigate(
                  `/dashboard/my-tournaments/massacre/${CLASSICO_TOURNAMENT_ID}`,
                )
              }
              className="relative sm:w-auto overflow-hidden p-[2px] group transition-all duration-300 transform -skew-x-12 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(236,72,153,0.3)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
              <div className="relative bg-[#05050a] px-10 py-4 lg:px-12 lg:py-5 flex items-center justify-center gap-4 transition-all duration-300 group-hover:bg-opacity-0">
                <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-white transform skew-x-12" />
                <span className="relative z-10 text-white font-black text-sm sm:text-base lg:text-lg uppercase tracking-[0.2em] transform skew-x-12">
                  View Post-Match Hub
                </span>
                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-white transform skew-x-12" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        <AuthLoader />
      )}
    </>
  );
};

export default ClassicoLiveCounter;
