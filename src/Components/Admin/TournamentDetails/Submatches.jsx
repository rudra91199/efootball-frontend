import moment from "moment";
import { API } from "../../../axios";

const Submatches = ({ playerStatuses, match, setLiftBanModal }) => {
  const getCardDisplay = (cardType) => {
    switch (cardType) {
      case "yellow":
        return {
          color: "bg-yellow-400",
          icon: "🟨",
          textColor: "text-yellow-400",
        };
      case "orange":
        return {
          color: "bg-orange-500",
          icon: "🟧",
          textColor: "text-orange-500",
        };
      case "red":
        return { color: "bg-red-600", icon: "🟥", textColor: "text-red-600" };
      default:
        return null;
    }
  };
  return (
    <div className="space-y-2">
      {match.details.subMatches.map((subMatch, index) => {
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
            className="flex items-center justify-between bg-gray-800/50 rounded p-3"
          >
            <div className="flex items-center space-x-4 flex-1">
              <span className="text-sm font-medium text-gray-300 min-w-[80px]">
                {subMatch?.matchType}
              </span>
              <div className="flex items-center space-x-4 flex-1">
                {/* Player 1 */}
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-sm text-gray-400">
                    {subMatch.player1?.baseTeamName}
                  </span>
                  {/* card infos */}
                  <div className="flex flex-col space-y-1">
                    {isPlayer1Banned && (
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">
                          {getCardDisplay("red")?.icon}
                        </span>
                        {player1Status.banLiftDate && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-red-400">
                              Ban until:{" "}
                              {moment(player1Status.banLiftDate).format("ll")}{" "}
                              {moment(player1Status.banLiftDate)
                                .endOf("hours")
                                .fromNow()}
                            </span>
                            <button
                              onClick={() =>
                                setLiftBanModal({
                                  isOpen: true,
                                  player: subMatch.player1.name,
                                  playerId: subMatch.player1._id,
                                  endDate: player1Status.banLiftDate,
                                })
                              }
                              className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                            >
                              Lift Ban
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {hasPlayer1YellowCard && (
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">
                          {getCardDisplay("yellow")?.icon}
                        </span>
                        {player1Status.activeYellowCards.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-red-400">
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
                            <button
                              onClick={() =>
                                setLiftBanModal({
                                  isOpen: true,
                                  player: subMatch.player1.name,
                                  playerId: subMatch.player1._id,
                                  endDate:
                                    player1Status.activeYellowCards[0]
                                      .expiryDate,
                                })
                              }
                              className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                            >
                              Lift Ban
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {didPlayer1GetOrange && (
                      <div className="flex items-center space-x-1 text-white text-xs">
                        <span className="text-lg">
                          {getCardDisplay("orange")?.icon}
                        </span>
                        <div>
                          <span className="text-red-400">
                            Banned for this match.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-gray-500">vs</span>

                {/* Player 2 */}
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-sm text-gray-400">
                    {subMatch.player2?.baseTeamName}
                  </span>
                  {/* card infos */}
                  <div className="flex flex-col space-y-1">
                    {isPlayer2Banned && (
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">
                          {getCardDisplay("red")?.icon}
                        </span>
                        {player2Status.banLiftDate && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-red-400">
                              Ban until:{" "}
                              {moment(player2Status.banLiftDate).format("ll")}{" "}
                              {moment(player2Status.banLiftDate)
                                .endOf("hours")
                                .fromNow()}
                            </span>
                            <button
                              onClick={() =>
                                setLiftBanModal({
                                  isOpen: true,
                                  player: subMatch.player2.name,
                                  playerId: subMatch.player2._id,
                                  endDate: player2Status.banLiftDate,
                                })
                              }
                              className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                            >
                              Lift Ban
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {hasPlayer2YellowCard && (
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">
                          {getCardDisplay("yellow")?.icon}
                        </span>
                        {player2Status.activeYellowCards.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-red-400">
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
                            <button
                              onClick={() =>
                                setLiftBanModal({
                                  isOpen: true,
                                  player: subMatch.player2.name,
                                  playerId: subMatch.player2._id,
                                  endDate:
                                    player2Status.activeYellowCards[0]
                                      .expiryDate,
                                })
                              }
                              className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                            >
                              Lift Ban
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {didPlayer2GetOrange && (
                      <div className="flex items-center space-x-1  text-xs">
                        <span className="text-lg">
                          {getCardDisplay("orange")?.icon}
                        </span>
                        <div>
                          <span className=" text-red-400">
                            Banned for this match.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-100">
                {subMatch.player1Score}
              </span>
              <span className="text-gray-400">-</span>
              <span className="text-sm font-bold text-gray-100">
                {subMatch.player2Score}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Submatches;
