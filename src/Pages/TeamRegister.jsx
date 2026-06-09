import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import noImage from "../assets/no-image-selected.png";
import imageCompression from "browser-image-compression";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../axios";

const teamRegistrationSchema = z.object({
  teamName: z
    .string()
    .min(1, "Team name is required")
    .min(3, "Team name must be at least 3 characters"),
  selectedPlayers: z
    .array(z.string())
    .length(3, "You must select exactly 3 players including yourself"),
  image: z.any().refine((files) => files?.length > 0, "Team logo is required"),
});

const TeamRegister = ({ tournament }) => {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(teamRegistrationSchema),
    defaultValues: {
      selectedPlayers: [],
    },
  });

  const {
    data: { data: { data: players } = {} } = {},
    isLoading: isPlayerLoading,
  } = useQuery({
    queryKey: ["players"],
    queryFn: () => {
      return API.get(`/users/getUsersForRegistration`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setIsCompressingImage(true);

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const base64String = await imageCompression.getDataUrlFromFile(
        compressedFile
      );

      setPreviewImage(base64String);
    } catch (error) {
      console.error("Error compressing image:", error);
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handlePlayerSelect = (playerId) => {
    let newSelectedIds = [];

    if (selectedPlayerIds.includes(playerId)) {
      // Remove player if already selected
      newSelectedIds = selectedPlayerIds.filter((id) => id !== playerId);
    } else if (selectedPlayerIds.length < 3) {
      // Add player if less than 3 selected
      newSelectedIds = [...selectedPlayerIds, playerId];
    } else {
      // Replace last selected player if 3 already selected
      newSelectedIds = [...selectedPlayerIds.slice(0, 2), playerId];
    }

    setSelectedPlayerIds(newSelectedIds);
    setValue("selectedPlayers", newSelectedIds);
  };

  const onSubmit = async (data) => {
    const teamData = {
      name: data.teamName,
      tournament: tournament._id,
      captain: selectedPlayerIds[0], // First selected player is captain
      players: data.selectedPlayers,
      logo: previewImage, // Assuming single file upload
    };

    const response = await API.post("/teams/register", teamData, {
      headers: {
        Authorization: localStorage.getItem("authToken"),
      },
    });
    if (response.data.success) {
      reset();
      refetch();
      setSelectedPlayerIds([]);
      setPreviewImage("");
      alert("Team registered successfully!");
    }
  };

  useEffect(() => {
    const unregisteredPlayers = players?.filter((player) => {
      return !tournament?.teams?.some((team) =>
        team.players.find((p) => p._id === player._id)
      );
    });
    setFilteredPlayers(unregisteredPlayers);
  }, [players, tournament]);

  const isRegistered = tournament?.teams.find((team) => {
    const isPlayerExists = team.players.find(
      (playerId) => playerId._id === user._id
    );
    return isPlayerExists;
  });



  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
      {isRegistered ? (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-green-600/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black mb-2">
              {isRegistered?.status === "Pending"
                ? "Registration Pending"
                : "Registration Confirmed"}
            </h2>
            <p className="text-white/60">
              {isRegistered?.status === "Pending"
                ? "Your team is currently under review"
                : "You are registered for this tournament"}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
            <div>
              <div className="text-white/60 text-sm mb-2">Team Name</div>
              <div className="text-xl font-bold">{isRegistered.name}</div>
            </div>

            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-white/20 overflow-hidden">
                <img
                  src={isRegistered?.logo?.url || "/placeholder.svg"}
                  alt="Team Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="text-white/60 text-sm mb-3">Team Members</div>
              <div className="space-y-2">
                {isRegistered.players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">
                        {player.name || "Unknown Player"}
                      </div>
                      <div className="text-sm text-white/50">
                        {player.email}
                      </div>
                    </div>
                    {player._id === isRegistered.captain._id && (
                      <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                        CAPTAIN
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isRegistered?.status === "Approved" && (
              <div className="bg-gradient-to-r from-green-600/20 to-lime-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                <div className="text-green-400 font-bold mb-1">
                  Status: Approved
                </div>
                <div className="text-white/70 text-sm">
                  Good luck in the tournament!
                </div>
              </div>
            )}

            {isRegistered?.status === "Pending" && (
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4 text-center">
                <div className="text-yellow-400 font-bold mb-1">
                  Status: Under Review
                </div>
                <div className="text-white/70 text-sm">
                  Your registration will be reviewed shortly
                </div>
              </div>
            )}
          </div>
        </div>
      ) : tournament?.type === "Trifecta" &&
        tournament?.teams?.filter((team) => team.status === "Approved")
          .length >= tournament?.maxTeams ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-red-600/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black mb-3 text-red-400">
              Tournament Full
            </h2>
            <p className="text-white/70 text-lg mb-6">
              Maximum team capacity has been reached
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Registered Teams:</span>
              <span className="font-bold text-pink-500">
                {
                  tournament?.teams?.filter(
                    (team) => team.status === "Approved"
                  ).length
                }{" "}
                / {tournament?.maxTeams}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-pink-500 h-full rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
          <p className="text-white/50 text-sm mt-6">
            Registration is now closed. Check back for future tournaments!
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold mb-6">Team Registration Form</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Team Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white/90">
                Team Information
              </h4>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Name *
                </label>
                <input
                  {...register("teamName")}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  placeholder="Enter your team name"
                />
                {errors.teamName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.teamName.message}
                  </p>
                )}
              </div>
            </div>
            {/* team image     */}
            <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30 mb-6">
              {isCompressingImage ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-12 w-12 text-blue-400"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="text-xs text-gray-300">Compressing...</p>
                </div>
              ) : previewImage ? (
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={noImage || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="w-full max-w-xs">
              <label
                htmlFor="image"
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Choose Team Logo *
              </label>
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  register("image").onChange(e);
                  handleImageChange(e);
                }}
                className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errors.image && (
                <p className="mt-2 text-sm" style={{ color: "#fecaca" }}>
                  {errors.image.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white/90">
                  Select 3 Players ({selectedPlayerIds.length}/3)
                </h4>
                <div className="text-sm text-white/60">
                  First selected = Captain
                </div>
              </div>

              {isPlayerLoading ? (
                <div className="text-center py-8">
                  <div className="text-white/60">Loading players...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredPlayers?.map((player, index) => {
                    const isSelected = selectedPlayerIds.includes(player._id);
                    const isCaptain = selectedPlayerIds[0] === player._id;

                    return (
                      <div
                        key={player._id}
                        onClick={() => handlePlayerSelect(player._id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-blue-600/20 border-blue-400 ring-1 ring-blue-400"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {player?.name}
                              {isCaptain && (
                                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                                  CAPTAIN
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-white/60">
                              {player?.email}
                            </div>
                            <div className="text-sm text-white/60">
                              ID: {player?.inGameUserId}
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-blue-400 bg-blue-400"
                                : "border-white/30"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {errors.selectedPlayers && (
                <p className="text-red-400 text-sm">
                  {errors.selectedPlayers.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={
                  selectedPlayerIds.length !== 3 ||
                  isSubmitting ||
                  isCompressingImage
                }
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  isCompressingImage ||
                  selectedPlayerIds.length === 3 ||
                  isSubmitting
                    ? "bg-gradient-to-r from-red-600 to-pink-500 text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Please wait..." : "Register Team"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default TeamRegister;
