import { AlertTriangle, Check, LoaderCircle, X } from "lucide-react";
import moment from "moment";
import { API } from "../../../axios";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import LiftBanModal from "./LiftBanModal";
import AuthLoader from "../../Loaders/AuthLoader";

const playerCardSchema = z.object({
  cardType: z.enum(["Yellow", "Orange", "Red"], {
    required_error: "Please select a card type",
  }),
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters"),
});

export default function TournamentTeams({
  teams,
  tournament,
  isLoading,
  refetch,
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [liftBanModal, setLiftBanModal] = useState({
    isOpen: false,
    player: null,
    endDate: null,
    playerId: null,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(playerCardSchema),
  });
  if (isLoading) {
  return <AuthLoader />;
  }
  const handleStatusChange = async (teamId, newStatus) => {
    if (newStatus === "Approved") {
      setApproving(true);
    } else {
      setRejecting(true);
    }
    const response = await API.patch(
      `/teams/update/status/${teamId}`,
      { status: newStatus },
      {
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
      }
    );
    if (response.data.success === true) {
      refetch();
      setApproving(false);
      setRejecting(false);
    }
    setApproving(false);
    setRejecting(false);
  };
  const handleOpenCardModal = (player, teamId) => {
    setSelectedPlayer({ player, teamId });
    setIsCardModalOpen(true);
    reset();
  };

  const handleCloseCardModal = () => {
    setIsCardModalOpen(false);
    setSelectedPlayer(null);
    reset();
  };

  const onSubmitCard = async (data) => {
    const cardData = {
      playerId: selectedPlayer?.player._id,
      cardType: data.cardType,
      reason: data.reason,
      tournamentId: tournament._id,
    };
    const response = await API.post("/users/issue-card", cardData, {
      headers: {
        authorization: `${localStorage.getItem("authToken")}`,
      },
    });
    // TODO: Implement card issuing logic
    if (response.data.success === true) {
      handleCloseCardModal();
      refetch();
      toast.success("Card issued successfully");
    }
  };

  const onLiftBan = async (playerId, banLiftDate) => {
    if (new Date(banLiftDate) > new Date()) {
      toast.error("Ban lift date is in the future. Cannot lift ban now.");
      return;
    } else {
      const response = await API.patch(
        `/users/liftBan/${playerId}`,
        {},
        {
          headers: {
            authorization: localStorage.getItem("authToken"),
          },
        }
      );
      if (response.data.success) {
        refetch();
        toast.success("Ban lifted successfully");
        setLiftBanModal({
          isOpen: false,
          player: null,
          endDate: null,
          playerId: null,
        });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">
          Teams ({teams.filter((team) => team.status === "Approved").length}/
          {tournament.maxTeams})
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 "
          >
            {/* Team Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-1 w-20 h-20 bg-[linear-gradient(to_right,#ff0082,#f20604)] rounded-full">
                    <img
                      src={team?.logo?.url}
                      alt=""
                      className="object-cover p-1
                     border-gray-700 w-full bg-[#000000] rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-2 ">
                    {team.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <span>Captain: {team.captain.name}</span>
                  <span>•</span>
                  <span>Joined: {moment(team.createdAt).format("LLL")}</span>
                  <span>•</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      team.status === "Approved"
                        ? "bg-green-500/20 text-green-400"
                        : team.status === "Rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                  </span>
                </div>
              </div>

              {team.status === "Pending" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(team._id, "Approved")}
                    disabled={approving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {approving ? (
                      <LoaderCircle
                        className="w-4 h-4 animate-spin
                    "
                      />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{approving ? "Approving..." : "Approve"}</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(team._id, "Rejected")}
                    disabled={rejecting}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {rejecting ? (
                      <LoaderCircle
                        className="w-4 h-4 animate-spin
                    "
                      />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    <span>{rejecting ? "Rejecting..." : "Reject"}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
              {team.players.map((player) => (
                <div
                  key={player._id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {/* Player Image */}
                    <img
                      src={
                        player?.image?.url ||
                        "/placeholder.svg?height=48&width=48"
                      }
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-100 truncate">
                        {player.name}
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        @{player.inGameUserName}
                      </p>

                      {/* Player Cards Display
                      {player.cards && player.cards.length > 0 && (
                        <div className="flex space-x-1 mt-2">
                          {player.cards.map((card, idx) => (
                            <div
                              key={idx}
                              className={`w-4 h-6 ${getCardColor(
                                card.type
                              )} rounded-sm`}
                              title={`${card.type} card: ${card.reason}`}
                            />
                          ))}
                        </div>
                      )} */}
                    </div>
                    <div className="flex flex-col space-y-2">
                      {player.isBanned && (
                        <div className="flex items-center gap-2">
                          <div className="text-white flex items-center gap-3">
                            <span className="bg-red-500 h-5 w-4 block rounded-xs"></span>
                            <span className="text-sm">
                              Banned until:{" "}
                              {moment(player.banLiftDate).format("LL")}{" "}
                              {moment(player.banLiftDate)
                                .endOf("hours")
                                .fromNow()}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setLiftBanModal({
                                isOpen: true,
                                player: player.name,
                                playerId: player._id,
                                endDate: player.banLiftDate,
                              })
                            }
                            className="text-sm mt-2 px-4 py-1 bg-red-500 hover:bg-red-600 transition duration-100 text-white rounded-lg w-fit"
                          >
                            Lift Ban
                          </button>
                        </div>
                      )}
                      {player.activeYellowCards.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="text-white flex items-center gap-3">
                            <span className="bg-yellow-500 h-5 w-4 block rounded-xs"></span>
                            <span className="text-sm">
                              Until:{" "}
                              {moment(
                                player.activeYellowCards[0].expiryDate
                              ).format("LL")}{" "}
                              ({" "}
                              {moment(player.activeYellowCards[0].expiryDate)
                                .endOf("hours")
                                .fromNow()}{" "}
                              )
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setLiftBanModal({
                                isOpen: true,
                                player: player.name,
                                playerId: player._id,
                                endDate: player.activeYellowCards[0].expiryDate,
                              })
                            }
                            className="text-sm mt-2 px-4 py-1 bg-yellow-500 hover:bg-yellow-600 transition duration-100 text-white rounded-lg"
                          >
                            Remove Card
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenCardModal(player, team.id)}
                    className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors text-sm"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Issue Card</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isCardModalOpen && selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-100 mb-4">Issue Card</h3>

            {/* Player Info */}
            <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-800/50 rounded-lg">
              <img
                src={
                  selectedPlayer.player.image ||
                  "/placeholder.svg?height=48&width=48"
                }
                alt={selectedPlayer.player.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-semibold text-gray-100">
                  {selectedPlayer.player.name}
                </h4>
                <p className="text-xs text-gray-400">
                  @{selectedPlayer.player.inGameUserName}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitCard)} className="space-y-4">
              {/* Card Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Card Type *
                </label>
                <select
                  {...register("cardType")}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select card type</option>
                  <option value="Yellow">Yellow Card</option>
                  <option value="Red">Red Card</option>
                </select>
                {errors?.cardType && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors?.cardType?.message}
                  </p>
                )}
              </div>

              {/* Reason Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Reason *
                </label>
                <textarea
                  {...register("reason")}
                  rows={4}
                  placeholder="Enter the reason for issuing this card..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                {errors?.reason && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors?.reason?.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseCardModal}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <LoaderCircle className="w-4 h-4 mr-2 inline-block animate-spin" />
                  )}
                  {isSubmitting ? "Please wait..." : "Issue Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {liftBanModal.isOpen && (
        <LiftBanModal
          liftBanModal={liftBanModal}
          setLiftBanModal={setLiftBanModal}
          handleLiftBan={onLiftBan}
        />
      )}
    </div>
  );
}
