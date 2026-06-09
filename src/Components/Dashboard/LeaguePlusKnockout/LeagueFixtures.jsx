"use client";

import { useState, useEffect } from "react";
import moment from "moment/moment";
// 1. Import the new icon
import { IoMdArrowDroprightCircle } from "react-icons/io";

export default function LeagueFixtures({ leagueFixture }) {
  const [selectedRound, setSelectedRound] = useState("all");
  const [collapsedRounds, setCollapsedRounds] = useState(new Set());
  const [rounds, setRounds] = useState({});

  useEffect(() => {
    const calculatedRounds = leagueFixture
      ? leagueFixture.reduce((acc, match) => {
          const round = `${match.round}`;
          if (!acc[round]) {
            acc[round] = [];
          }
          acc[round].push(match);
          return acc;
        }, {})
      : {};
    setRounds(calculatedRounds);
  }, [leagueFixture]);

  const [categorizedRounds, setCategorizedRounds] = useState({
    active: [],
    upcoming: [],
    completed: [],
  });

  const isRoundCompleted = (matches) => {
    return matches.every((match) => match.status === "Completed");
  };

  const getRoundCategory = (matches) => {
    if (
      matches.some((m) => m.status === "Active" || m.status === "Scheduled")
    ) {
      return "active";
    }
    if (matches.every((m) => m.status === "Completed")) {
      return "completed";
    }
    return "upcoming";
  };

  useEffect(() => {
    const newCategorized = { active: [], upcoming: [], completed: [] };
    const newCollapsed = new Set();

    Object.entries(rounds).forEach(([round, matches]) => {
      const category = getRoundCategory(matches);
      newCategorized[category].push([round, matches]);

      if (category === "upcoming" || category === "completed") {
        newCollapsed.add(round);
      }
    });

    setCategorizedRounds(newCategorized);
    setCollapsedRounds(newCollapsed);
  }, [rounds]);

  const toggleRoundCollapse = (round) => {
    const newCollapsed = new Set(collapsedRounds);
    if (newCollapsed.has(round)) {
      newCollapsed.delete(round);
    } else {
      newCollapsed.add(round);
    }
    setCollapsedRounds(newCollapsed);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Active":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Scheduled":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Unpublished":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const renderMatch = (match) => (
    <div key={match._id} className="bg-black/30 rounded-lg sm:p-4">
      <div className="flex items-center justify-between py-2 gap-4">
        <div className="flex items-center justify-between gap-4 sm:gap-6 w-full">
          <div className="text-center sm:text-left sm:min-w-[120px] flex-1 flex flex-col sm:flex-row items-center sm:gap-2">
            <div className="relative">
              <img
                src={match.team1.image.url || "/placeholder.svg"}
                alt=""
                className="w-8 h-8 sm:w-20 sm:h-20 object-cover mx-auto sm:mx-0 mb-1 sm:mb-0 rounded-full"
              />
              <span className="absolute top-[-6px] right-[-4px] text-[12px]">
                {match?.team1?.isBanned
                  ? "🟥"
                  : match?.team1?.activeYellowCards?.length > 0 && "🟨"}
              </span>
            </div>
            <p
              className={`font-bold text-sm sm:text-lg truncate ${
                match.status === "Completed"
                  ? match.winner?._id === match.team1._id
                    ? "text-lime-600"
                    : "text-red-800"
                  : "text-blue-200"
              } ${
                match.status === "Completed" && match.winner === null
                  ? "text-yellow-500"
                  : ""
              }`}
            >
              {match.team1.name.split(" ").slice(0, 2).join(" ") || "TBD"}
            </p>
          </div>

          <div className="text-center  sm:px-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {match.team1_score}
              </span>
              <span className="text-base sm:text-lg text-muted-foreground">
                -
              </span>
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {match.team2_score}
              </span>
            </div>
          </div>

          <div className="text-center sm:text-left sm:min-w-[120px] flex-1 flex flex-col sm:flex-row items-center justify-end sm:gap-2">
            <div className="relative">
              <img
                src={match.team2.image.url || "/placeholder.svg"}
                alt=""
                className="w-8 h-8 sm:w-20 sm:h-20 object-cover mx-auto sm:mx-0 mb-1 sm:mb-0 rounded-full"
              />
              <span className="absolute top-[-6px] right-[-4px] text-[12px]">
                {match.team2.isBanned
                  ? "🟥"
                  : match?.team2?.activeYellowCards?.length > 0 && "🟨"}
              </span>
            </div>
            <p
              className={`font-bold text-sm sm:text-lg truncate ${
                match.status === "Completed"
                  ? match.winner?._id === match.team2._id
                    ? "text-lime-600"
                    : "text-red-800"
                  : "text-blue-200"
              } ${
                match.status === "Completed" && match.winner === null
                  ? "text-yellow-500"
                  : ""
              }`}
            >
              {match.team2.name.split(" ").slice(0, 2).join(" ") || "TBD"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoundList = (roundList) => {
    const filteredList = roundList.filter(
      ([round]) => selectedRound === "all" || selectedRound === round,
    );

    if (filteredList.length === 0) {
      return (
        <p className="text-muted-foreground text-sm">
          No rounds to show for the current filter.
        </p>
      );
    }

    return filteredList.map(([round, matches]) => {
      const roundCompleted = isRoundCompleted(matches);
      let isCollapsed = collapsedRounds.has(round);

      const isRoundUnpublished = matches.some(
        (m) => m.status === "Unpublished",
      );

      const remainingMatch = matches.find((m) => m.status === "Scheduled");

      return (
        //
        <div
          key={round}
          className={`liquid-glass-card relative rounded-2xl before:rounded-2xl after:rounded-2xl ${remainingMatch ? "bg-gradient-to-br from-pink-600/60 from-10% to-90% via-black to-indigo-900" : isRoundUnpublished ? "bg-gradient-to-bl from-red-800 from-[2%] via-40% to-160% via-black to-pink-600" : "bg-blue-black"} px-4 py-6 `}
        >
          <div className="text-white sm:flex justify-between sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => toggleRoundCollapse(round)}
              className="flex w-full items-center gap-2 p-1 -m-1 hover:bg-muted/30 rounded-lg transition-colors text-left"
            >
              {/* --- 2. THIS IS THE CHANGED BLOCK --- */}
              <IoMdArrowDroprightCircle
                size={22} // Adjusted size slightly
                className={`transform transition-transform ${
                  isCollapsed ? "rotate-0" : "rotate-90"
                }`}
              />
              {/* --- END OF CHANGE --- */}

              <h3 className="text-lg font-bold text-foreground capitalize">
                {round.replace(/(\d+)/, "$1")}
              </h3>
            </button>

            <div className="flex items-center my-2 justify-between font-bold sm:pl-8">
              {!isRoundUnpublished && (
                <span className="text-left  text-sm text-white">
                  {matches.filter((m) => m.status === "Completed").length}/
                  {matches.length} Completed
                </span>
              )}
              {!roundCompleted && remainingMatch && (
                <span className="text-sm text-white font-medium text-nowrap">
                  End Date:{" "}
                  {moment.utc(remainingMatch?.roundEndDate).format("lll") ||
                    "N/A"}
                </span>
              )}
            </div>
          </div>
          {!isCollapsed && (
            <div className="space-y-4">
              {matches.map((match) => renderMatch(match))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end mb-2">
        <div className="flex items-center">
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className="px-3 py-2 bg-blue-black border border-white/20  rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Rounds</option>
            {Object.keys(rounds).map((round) => (
              <option key={round} value={round}>
                {round.replace(/(\d+)/, "$1")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-6">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground pl-2 bg-yellow-green-text">
            Active Rounds
          </h2>
          {categorizedRounds.active.length > 0 ? (
            renderRoundList(categorizedRounds.active)
          ) : (
            <p className="text-muted-foreground">
              No active or scheduled rounds.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground pl-2">
            Upcoming Rounds
          </h2>
          {categorizedRounds.upcoming.length > 0 ? (
            renderRoundList(categorizedRounds.upcoming)
          ) : (
            <p className="text-muted-foreground">No upcoming rounds.</p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground pl-2">
            Completed Rounds
          </h2>
          {categorizedRounds.completed.length > 0 ? (
            renderRoundList(categorizedRounds.completed)
          ) : (
            <p className="text-muted-foreground">No completed rounds yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
