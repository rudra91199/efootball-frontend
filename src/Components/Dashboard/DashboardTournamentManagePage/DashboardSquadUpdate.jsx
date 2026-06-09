import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../axios";
import { useLocation, useNavigate, useParams } from "react-router";
import { LoaderCircle, Moon, Star, Sun } from "lucide-react";

export default function DashboardSquadUpdate() {
  const { tournamentId, matchId } = useParams();
  const { tournament: currentTournament, captain } = useLocation().state;
  const [selectedPlayers, setSelectedPlayers] = useState({
    starPlayer: null,
    firstDayPlayer: null,
    lateNightPlayer: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();
  const [match, setMatch] = useState({});
  const navigate = useNavigate();

  const team = currentTournament?.teams?.find(
    (team) => team.captain._id === (captain || user._id)
  );

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

  const teamPlayers = players
    ?.filter((player) => team.players.some((id) => id._id === player._id))
    .map((player) => ({
      ...player,
      availability: "available",
    }));

  const filteredPlayers = teamPlayers?.filter((player) => {
    const matchesSearch = player?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // const matchesStatus =
    //   statusFilter === "all" || player.availability === statusFilter;
    return matchesSearch;
    // && matchesStatus;
  });


  const handlePlayerSelection = (playerId, role) => {
    setSelectedPlayers((prev) => {
      if (prev[role] === playerId) {
        return { ...prev, [role]: null };
      }

      const currentRoles = Object.entries(prev);
      const existingRole = currentRoles?.find(
        ([key, value]) => value === playerId && key !== role
      );

      if (existingRole) {
        return { ...prev, [existingRole[0]]: null, [role]: playerId };
      }

      return { ...prev, [role]: playerId };
    });
  };

  const isPlayerSelected = (playerId) => {
    return Object.values(selectedPlayers).includes(playerId);
  };

  const getPlayerRole = (playerId) => {
    const roleEntry = Object.entries(selectedPlayers)?.find(
      ([role, id]) => id === playerId
    );
    return roleEntry ? roleEntry[0] : null;
  };

  const selectedCount = Object.values(selectedPlayers).filter(
    (id) => id !== null
  )?.length;

  const getAvailabilityColor = (availability) => {
    const colors = {
      available: "bg-chart-2 text-white",
      injured: "bg-destructive text-white",
      suspended: "bg-chart-3 text-white",
    };
    return colors[availability] || "bg-muted text-muted-foreground";
  };

  // const statuses = ["all", "available", "injured", "suspended"];

  const submitSquad = async () => {
    setSubmitting(true);
    const squadInfo = {
      star_player: selectedPlayers.starPlayer,
      first_day_player: selectedPlayers.firstDayPlayer,
      late_night_player: selectedPlayers.lateNightPlayer,
      tournament: tournamentId,
    };

    const response = await API.patch(
      `/matches/squad-update/${matchId}/${captain || user._id}`,
      squadInfo,
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }
    );
    if (response.data.success) {
      setSubmitting(false);
      if (captain)
        navigate(`/admin/tournament/manage/${tournamentId}`, {
          state: "fixtures",
        });
      else
        navigate(`/dashboard/my-tournaments/tournament/${tournamentId}`, {
          state: "teamManagement",
        });

      // navigate()
    }
    setSubmitting(false);
  };

  useEffect(() => {
    currentTournament.phases.forEach((phase) => {
      const matchData = phase.matches.find((match) => match._id === matchId);
      if (matchData) {
        setMatch(matchData);
        return;
      }
    }); // Adjust based on your API response structure
  }, []);

  useEffect(() => {
    // Determine if the user is captain of team1 or team2
    const isCaptainOfTeam1 = match.team1?.captain === (captain || user._id);
    const isCaptainOfTeam2 = match.team2?.captain === (captain || user._id);

    let existingSquad;
    if (isCaptainOfTeam1 && match.team1_squad) {
      existingSquad = match.team1_squad;
    } else if (isCaptainOfTeam2 && match.team2_squad) {
      existingSquad = match.team2_squad;
    }

    // If an existing squad is found, update the state
    if (existingSquad) {
      setSelectedPlayers({
        starPlayer: existingSquad.star_player,
        firstDayPlayer: existingSquad.first_day_player,
        lateNightPlayer: existingSquad.late_night_player,
      });
    }
  }, [currentTournament, match, user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Player Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Select your Star Player, First Day Player, and Late Night Player
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 bg-white/5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2  border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <div className="absolute left-3 top-2.5 text-muted-foreground">
              🔍
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1 order-2 space-y-6">
          <div className="bg-white/5 border border-[#fefb04]/40 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-[#fefb04] mb-4">
              Squad Overview
            </h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-200">
                  {selectedCount}/3
                </div>
                <p className="text-sm text-muted-foreground">
                  Players Selected
                </p>
              </div>

              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-gradient-to-tr from-[#f20604] to-[#fefb04] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(selectedCount / 3) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Star Player:</span>
                  <span
                    className={
                      selectedPlayers?.starPlayer
                        ? "text-[#f20604] font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {selectedPlayers?.starPlayer
                      ? teamPlayers?.find(
                          (p) => p._id === selectedPlayers.starPlayer
                        )?.name
                      : "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    First Day Player:
                  </span>
                  <span
                    className={
                      selectedPlayers?.firstDayPlayer
                        ? " text-[#ff0082] font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {selectedPlayers?.firstDayPlayer
                      ? teamPlayers?.find(
                          (p) => p._id === selectedPlayers.firstDayPlayer
                        )?.name
                      : "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Late Night Player:
                  </span>
                  <span
                    className={
                      selectedPlayers?.lateNightPlayer
                        ? "text-[#fefb04] font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {selectedPlayers?.lateNightPlayer
                      ? teamPlayers?.find(
                          (p) => p._id === selectedPlayers.lateNightPlayer
                        )?.name
                      : "Not selected"}
                  </span>
                </div>
              </div>

              {selectedCount === 3 && (
                <button
                  onClick={() => submitSquad()}
                  className="w-full py-2 bg-gradient-to-br from-[#fefb04] to-[#69fd00] text-[#041996] rounded-lg font-medium hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
                  disabled={submitting}
                >
                  {submitting && <LoaderCircle className="animate-spin" />}
                  Submit Squad
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="bg-white/5 border border-[#69fd00]/40 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#fefb04]">
                Team Roster
              </h2>
              <div className="text-sm text-muted-foreground">
                {filteredPlayers?.length} players found
              </div>
            </div>

            <div className="mb-6 p-4 border border-border/60 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                Selected roles:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPlayers?.starPlayer
                      ? "bg-red text-primary-foreground"
                      : "bg-muted/20 text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Star className="w-4 h-4" /> Star Player{" "}
                  {selectedPlayers.starPlayer && "✓"}
                </button>
                <button
                  className={`px-3 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPlayers.firstDayPlayer
                      ? "bg-pink text-primary-foreground"
                      : "bg-muted/20 text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Sun className="w-4 h-4" /> First Day Player{" "}
                  {selectedPlayers.firstDayPlayer && "✓"}
                </button>
                <button
                  className={`px-3 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPlayers.lateNightPlayer
                      ? "bg-yellow text-dark-blue"
                      : "bg-muted/20 text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Moon className="w-4 h-4" /> Late Night Player{" "}
                  {selectedPlayers.lateNightPlayer && "✓"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlayers?.map((player) => {
                const isSelected = isPlayerSelected(player._id);
                const playerRole = getPlayerRole(player._id);

                return (
                  <div
                    key={player?._id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? playerRole === "starPlayer"
                          ? "border-red-40"
                          : playerRole === "firstDayPlayer"
                          ? "border-pink-40"
                          : "border-yellow-40"
                        : "border-border hover:border-primary/50 hover:bg-card/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3
                          className={`font-medium text-card-foreground ${
                            playerRole === "starPlayer"
                              ? "text-red-500"
                              : playerRole === "firstDayPlayer"
                              ? "text-pink"
                              : playerRole === "lateNightPlayer"
                              ? "text-yellow"
                              : ""
                          }`}
                        >
                          {player?.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {player?.baseTeamName}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getAvailabilityColor(
                            player?.availability
                          )}`}
                        >
                          available
                        </span>
                        {isSelected && (
                          <div className="text-xs font-medium text-primary mt-2">
                            {playerRole === "starPlayer" && (
                              <span className={`text-red`}>⭐ Star</span>
                            )}
                            {playerRole === "firstDayPlayer" && (
                              <span className={`text-pink`}>🌅 First Day</span>
                            )}
                            {playerRole === "lateNightPlayer" && (
                              <span className={`text-yellow`}>
                                🌙 Late Night
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {player.inGameUserName}
                    </span>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handlePlayerSelection(player._id, "starPlayer")
                        }
                        className={`px-3 py-1 flex items-center gap-1 rounded text-xs font-medium transition-colors ${
                          selectedPlayers.starPlayer === player._id
                            ? "bg-red text-primary-foreground"
                            : "border border-red-60 text-muted-foreground hover:bg-muted/80"
                        }`}
                        disabled={player.availability !== "available"}
                      >
                        <Star className="w-4 h-4" /> Star
                      </button>
                      <button
                        onClick={() =>
                          handlePlayerSelection(player._id, "firstDayPlayer")
                        }
                        className={`px-2 py-1 flex items-center gap-1 rounded text-xs font-medium transition-colors ${
                          selectedPlayers.firstDayPlayer === player._id
                            ? "bg-pink text-primary-foreground"
                            : "border border-pink-60 text-muted-foreground hover:bg-muted/80"
                        }`}
                        disabled={player.availability !== "available"}
                      >
                        <Sun className="w-4 h-4" /> First Day
                      </button>
                      <button
                        onClick={() =>
                          handlePlayerSelection(player._id, "lateNightPlayer")
                        }
                        className={`px-2 py-1 flex items-center gap-1 rounded text-xs font-medium transition-colors ${
                          selectedPlayers.lateNightPlayer === player._id
                            ? "bg-yellow text-blue"
                            : "border border-yellow-60 text-muted-foreground hover:bg-muted/80"
                        }`}
                        disabled={player.availability !== "available"}
                      >
                        <Moon className="w-4 h-4" /> Late Night
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPlayers?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No players found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className=" border border-yellow-30 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Selected Squad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(selectedPlayers)?.map(([role, playerId]) => {
              if (!playerId) return null;
              const player = teamPlayers?.find((p) => p._id === playerId);
              const roleLabels = {
                starPlayer: (
                  <span className="flex items-center gap-2 text-red-500">
                    <Star className="w-4 h-4" /> Star Player
                  </span>
                ),
                firstDayPlayer: (
                  <span className="flex items-center gap-2 text-pink">
                    <Sun className="w-4 h-4" /> First Day Player
                  </span>
                ),
                lateNightPlayer: (
                  <span className="flex items-center gap-2 text-yellow">
                    <Moon className="w-4 h-4" /> Late Night Player
                  </span>
                ),
              };

              return (
                <div
                  key={role}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    role === "starPlayer"
                      ? "shadow-allround-star"
                      : role === "firstDayPlayer"
                      ? "shadow-allround-first"
                      : "shadow-allround-late"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-primary mb-1">
                      {roleLabels[role]}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {player?.name}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedPlayers((prev) => ({ ...prev, [role]: null }))
                    }
                    className="text-destructive hover:text-destructive/80 ml-2 text-lg"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
