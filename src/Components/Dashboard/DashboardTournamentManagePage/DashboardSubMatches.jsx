import { Crown, Star } from "lucide-react";
import moment from "moment";

const DashboardSubMatches = ({
  match,
  getCardDisplay,
  playerStatuses,
  hasDeadlinePassed,
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-border/10">
      <h5 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3">
        Sub-Matches
      </h5>
      <div className="grid grid-cols-1 gap-8">
        {(match.status === "Completed" || hasDeadlinePassed) &&
          match.details.subMatches.map((subMatch, index) => {
            const player1Status = playerStatuses?.[subMatch.player1._id];
            const player2Status = playerStatuses?.[subMatch.player2._id];

            // --- NEW: Check for match-specific orange cards ---
            const didPlayer1GetOrange = match.orangeCardedPlayers?.includes(
              subMatch.player1._id
            );
            const didPlayer2GetOrange = match.orangeCardedPlayers?.includes(
              subMatch.player2._id
            );
            const isPlayer1Banned =
              player1Status?.isBanned &&
              new Date(player1Status.banLiftDate) > new Date();
            const isPlayer2Banned =
              player2Status?.isBanned &&
              new Date(player2Status.banLiftDate) > new Date();
            const hasPlayer1YellowCard =
              player1Status?.activeYellowCards?.length > 0;
            const hasPlayer2YellowCard =
              player2Status?.activeYellowCards?.length > 0;

            return (
              <div
                key={index}
                className="bg-white/2 border border-border/70 rounded-lg"
              >
                <div
                  className={`text-xs flex justify-between px-4 py-2 font-medium text-center rounded-b-md sm:rounded-b-none sm:rounded-br-md sm:w-fit mb-4 sm:mb-2 ${
                    subMatch.matchType === "Star Player" &&
                    "text-white bg-[#f20604]"
                  }
                ${
                  subMatch.matchType === "First Day Player" &&
                  "text-white bg-[#f015c7]"
                }
                ${
                  subMatch.matchType === "Late Night Player" &&
                  "text-black bg-[#fefb04]"
                }
                `}
                >
                  <span>{subMatch.matchType}</span>

                  {subMatch.matchType === "Star Player" && (
                    <span> Second Day:- <strong>12.30 - 12.40 AM</strong></span>
                  )}
                  {subMatch.matchType === "First Day Player" && (
                    <span> First Day:- <strong>01.10 - 01.20 AM</strong></span>
                  )}
                  {subMatch.matchType === "Late Night Player" && (
                    <span> First Day:- <strong>02.00 - 02.10 AM</strong></span>
                  )}
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] text-xs sm:text-sm gap-10 items-center">
                  {/* Player 1 Section */}
                  <div className="flex flex-col pl-2 self-start">
                    <div
                      className={`flex flex-col items-start sm:items-center relative `}
                    >
                      <img
                        src={subMatch.player1.image.url || "/placeholder.svg"}
                        alt=""
                        className={`w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-full flex-shrink-0 z-2 ${
                          match.status == "Completed" &&
                          match.manOfTheMatch?._id === subMatch.player1._id
                            ? " border-3 border-[#69fd00]"
                            : ""
                        }`}
                      />
                      <p
                        className={`truncate mt-2  text-xs sm:text-[16px] font-bold z-2 ${
                          match.status == "Completed" &&
                          match.manOfTheMatch?._id === subMatch.player1._id
                            ? " text-[#fefb04]"
                            : ""
                        } `}
                      >
                        <span>{subMatch.player1?.baseTeamName}</span>
                      </p>
                      {match.status == "Completed" &&
                        match.manOfTheMatch?._id === subMatch.player1._id && (
                          <div className="absolute text-[12px] font-bold flex items-center gap-1 p-1 top-[30%] -translate-y-[50%] left-14 w-fit h-fit rounded-md bg-[#041996] pointer-events-none z-[1] text-[#69fd00]">
                            <Crown color="#fefb04" className="w-4 h-4" />
                            <span className="">King</span>
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 ">
                      {isPlayer1Banned && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm flex-shrink-0">
                            {getCardDisplay("red")?.icon}
                          </span>
                          {player1Status.banLiftDate && (
                            <span className="text-[10px] sm:text-xs text-red-400 leading-tight">
                              Ban until:
                              {moment(player1Status.banLiftDate).format(
                                "ll"
                              )}{" "}
                              {moment(player1Status.banLiftDate)
                                .endOf("hours")
                                .fromNow()}
                            </span>
                          )}
                        </div>
                      )}
                      {hasPlayer1YellowCard && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm flex-shrink-0">
                            {getCardDisplay("yellow")?.icon}
                          </span>
                          {player1Status.activeYellowCards.length > 0 && (
                            <span className="text-[10px] sm:text-xs text-yellow-400 leading-tight">
                              Active until:{" "}
                              {moment(
                                player1Status.activeYellowCards[0].expiryDate
                              ).format("l")}{" "}
                              {moment(
                                player1Status.activeYellowCards[0].expiryDate
                              )
                                .endOf("hours")
                                .fromNow()}
                            </span>
                          )}
                        </div>
                      )}
                      {didPlayer1GetOrange && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm flex-shrink-0">
                            {getCardDisplay("orange")?.icon}
                          </span>
                          <span className="text-[10px] sm:text-xs text-orange-400 leading-tight">
                            Banned for this match.
                          </span>
                        </div>
                      )}
                    </div>
                    <p></p>
                  </div>

                  {/* Status cards stacked below on mobile */}

                  {/* Score Section */}
                  <span className="font-bold text-sm sm:text-lg whitespace-nowrap flex items-center justify-center gap-1 px-2">
                    {subMatch.player1Score} - {subMatch.player2Score}
                  </span>

                  {/* Player 2 Section */}
                  <div className="flex flex-col justify-center">
                    <div
                      className={`flex flex-col items-end sm:items-center pr-2 pb-2 relative `}
                    >
                      <img
                        src={subMatch.player2.image.url || "/placeholder.svg"}
                        alt=""
                        className={`w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-full flex-shrink-0 z-2 ${
                          match.status == "Completed" &&
                          match.manOfTheMatch?._id === subMatch.player2._id
                            ? " border-3 border-[#69fd00]"
                            : ""
                        }`}
                      />
                      <p
                        className={`truncate mt-2  text-xs sm:text-[16px] font-bold z-2 ${
                          match.status == "Completed" &&
                          match.manOfTheMatch?._id === subMatch.player2._id
                            ? " text-[#fefb04]"
                            : ""
                        } `}
                      >
                        <span>{subMatch.player2?.baseTeamName}</span>
                      </p>
                      {match.status == "Completed" &&
                        match.manOfTheMatch?._id === subMatch.player2._id && (
                          <div className="absolute text-[10px] font-bold flex items-center gap-1 p-1 top-[30%] translate-y-[-50%] right-16 w-fit h-fit rounded-md bg-[#041996] pointer-events-none z-[1] text-[#69fd00]">
                            <Crown color="#fefb04" className="w-4 h-4" />
                            <span className="">King</span>
                          </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 pr-0 sm:pr-2 ">
                      {isPlayer2Banned && (
                        <div className="flex items-center gap-1 justify-center">
                          <span className="text-sm flex-shrink-0">
                            {getCardDisplay("red")?.icon}
                          </span>
                          {player2Status.banLiftDate && (
                            <span className="text-[10px] sm:text-xs text-red-400 leading-tight">
                              Ban until:{" "}
                              {moment(player2Status.banLiftDate).format("ll")}{" "}
                              {moment(player2Status.banLiftDate)
                                .endOf("hours")
                                .fromNow()}
                            </span>
                          )}
                        </div>
                      )}
                      {hasPlayer2YellowCard && (
                        <div className="flex items-center gap-1 justify-start">
                          <span className="text-sm flex-shrink-0">
                            {getCardDisplay("yellow")?.icon}
                          </span>
                          {player2Status.activeYellowCards.length > 0 && (
                            <span className="text-[10px] sm:text-xs text-yellow-400 leading-tight">
                              Active until:{" "}
                              {moment(
                                player2Status.activeYellowCards[0].expiryDate
                              ).format("l")}{" "}
                              {moment(
                                player2Status.activeYellowCards[0].expiryDate
                              )
                                .endOf("hours")
                                .fromNow()}
                            </span>
                          )}
                        </div>
                      )}
                      {didPlayer2GetOrange && (
                        <div className="flex items-center gap-1 justify-start">
                          <span className="text-sm flex-shrink-0">
                            {getCardDisplay("orange")?.icon}
                          </span>
                          <span className="text-[10px] sm:text-xs text-orange-400 leading-tight ">
                            Banned for this match.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status cards stacked below on mobile */}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DashboardSubMatches;
