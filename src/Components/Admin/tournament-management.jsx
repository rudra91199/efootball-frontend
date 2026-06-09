import { useState, useEffect } from "react";
import StatusBadge from "./status-badge";
import CreateTournamentModal from "./createTournamentModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../../axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  Calendar,
  Check,
  ChevronRight,
  DollarSign,
  Edit3,
  Play,
  Plus,
  Trash2,
  Trophy,
  Users,
  Pin,
  Search,
  Swords,
  Target,
  Crosshair,
  Settings,
} from "lucide-react";

export default function TournamentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- PINNING STATE ---
  const [pinnedTournaments, setPinnedTournaments] = useState(() => {
    const saved = localStorage.getItem("pinnedTournaments");
    return saved ? JSON.parse(saved) : [];
  });

  const {
    data: { data: { data } = {} } = {},
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: () => {
      return API.get("/tournaments/admin/all", {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
    },
  });

  const filteredTournaments = data?.filter((tournament) =>
    tournament?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUpdateTournamentStatus = (id, newStatus, e) => {
    if (e) e.stopPropagation();

    queryClient.setQueryData(["tournaments"], (oldData) => {
      if (!oldData?.data?.data) return oldData;
      return {
        ...oldData,
        data: {
          ...oldData.data,
          data: oldData.data.data.map((tournament) =>
            tournament._id === id
              ? { ...tournament, status: newStatus }
              : tournament,
          ),
        },
      };
    });
    // Add API call here
  };

  const handleDeleteTournament = (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to terminate this tournament?"))
      return;
    // Add API call here
  };

  // --- HELPER: SILENT PATH GENERATOR ---
  const getTournamentPath = (type, tournamentId) => {
    const t = type.toLowerCase();
    if (t === "trifecta") return `/admin/tournament/manage/${tournamentId}`;
    if (t === "league + knockout solo" || t === "champions circuit") {
      return `/admin/tournament/league-knockout/manage/${tournamentId}`;
    }
    if (t === "the massacre trilogy") {
      return `/admin/tournament/massacre/manage/${tournamentId}`;
    }
    return `/admin/tournament/manage/${tournamentId}`; // fallback
  };

  const handleNavigate = (type, tournamentId) => {
    navigate(getTournamentPath(type, tournamentId));
  };

  // --- PIN TOGGLE LOGIC ---
  const togglePin = (e, tournament) => {
    e.stopPropagation();

    const isPinned = pinnedTournaments.some((p) => p.id === tournament._id);
    let newPinned;

    if (isPinned) {
      newPinned = pinnedTournaments.filter((p) => p.id !== tournament._id);
      toast.info(`Unpinned ${tournament.name}`, {
        autoClose: 2000,
        theme: "dark",
      });
    } else {
      if (pinnedTournaments.length >= 2) {
        toast.error(
          "Maximum 2 configurations can be pinned. Unpin one first.",
          {
            autoClose: 3000,
            theme: "dark",
          },
        );
        return;
      }

      const newPin = {
        id: tournament._id,
        name: tournament.name,
        logo: tournament.logo || "/placeholder.svg",
        path: getTournamentPath(tournament.type, tournament._id),
      };

      newPinned = [...pinnedTournaments, newPin];
      toast.success(`Pinned ${tournament.name} to Admin Dock`, {
        autoClose: 2000,
        theme: "dark",
      });
    }

    setPinnedTournaments(newPinned);
    localStorage.setItem("pinnedTournaments", JSON.stringify(newPinned));
    window.dispatchEvent(new Event("pinned-updated"));
  };

  // --- CYBER-CHROME THEME ENGINE ---
  const getCardTheme = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("massacre")) {
      return {
        bg: "bg-[#e11d48]/10",
        border: "border-[#e11d48]/30",
        text: "text-[#e11d48]",
        glow: "shadow-[0_0_15px_rgba(225,29,72,0.3)]",
        icon: <Swords className="w-3 h-3 text-[#e11d48]" />,
      };
    }
    if (t.includes("league") || t.includes("champions")) {
      return {
        bg: "bg-[#a855f7]/10",
        border: "border-[#a855f7]/30",
        text: "text-[#a855f7]",
        glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        icon: <Trophy className="w-3 h-3 text-[#a855f7]" />,
      };
    }
    return {
      bg: "bg-[#3b82f6]/10",
      border: "border-[#3b82f6]/30",
      text: "text-[#3b82f6]",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
      icon: <Target className="w-3 h-3 text-[#3b82f6]" />,
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto sm:p-6 lg:p-8 text-white font-sans min-h-screen animate-fade-in">
      {/* =========================================
          HEADER & CONTROLS SECTION
      ========================================= */}
      <div className="bg-[#0a0b10]/60 backdrop-blur-xl  rounded-[24px] sm:rounded-[32px] px-4 pt-2 pb-1 sm:p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-6 sm:mb-8">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-2">
          <div className="flex flex-col gap-2">

            <div className="flex justify-between w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-fit">
                <Settings className="w-3 h-3 text-gray-400" />
                <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">
                  System Admin
                </span>
              </div>

              <button
                className="flex items-center justify-center gap-2 px-2 py-2 esports-metallic-glow text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 hover:-translate-y-0.5 text-[8px]"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
            <h1 className="text-xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-tighter leading-none">
              Tournament Control
            </h1>
            <p className="text-[10px] sm:text-sm font-bold text-gray-500 uppercase tracking-widest">
              Configure, deploy, and manage operational sectors
            </p>
          </div>

          <div className="flex sm:flex-row gap-4 w-full xl:w-auto">
            {/* Added Missing Search Bar */}
            <div className="relative group w-full sm:w-[300px]">
              <input
                type="text"
                placeholder="SEARCH OPERATIONS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-11 py-2 bg-[#030305]/80 backdrop-blur-xl border border-white/10 rounded-xl focus:ring-1 focus:ring-white/30 outline-none transition-all group-hover:border-white/20 placeholder:text-gray-600 text-white text-xs font-black tracking-widest shadow-inner"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#a855f7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] animate-pulse">
            Accessing Database...
          </p>
        </div>
      ) : (
        <>
          {/* =========================================
              DESKTOP TABLE VIEW
          ========================================= */}
          <div className="hidden lg:block bg-[#0a0b10]/80 backdrop-blur-2xl border border-white/10 rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-[#030305]/80">
                  <th className="py-5 px-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] text-left">
                    Operation
                  </th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] text-left">
                    Classification
                  </th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] text-left">
                    Status
                  </th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] text-left">
                    Capacity
                  </th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] text-left">
                    Bounty
                  </th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] text-left">
                    Phase
                  </th>
                  <th className="py-5 px-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] text-right">
                    Overrides
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTournaments?.map((tournament, index) => {
                  const isPinned = pinnedTournaments.some(
                    (p) => p.id === tournament._id,
                  );
                  const theme = getCardTheme(tournament.type);

                  return (
                    <tr
                      key={tournament._id}
                      className={`group hover:bg-white/[0.02] cursor-pointer transition-all duration-300 relative ${isPinned ? "bg-yellow-500/[0.02]" : ""}`}
                      onClick={() =>
                        handleNavigate(tournament.type, tournament._id)
                      }
                    >
                      {/* Pinned Left-Edge Glow */}
                      {isPinned && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                      )}

                      <td className="p-4 pl-6 max-w-[300px]">
                        <div className="flex items-center gap-4 w-full">
                          <div
                            className={`shrink-0 w-10 h-10 rounded-[10px] border border-white/10 flex items-center justify-center shadow-inner ${theme.bg}`}
                          >
                            {theme.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-white font-black uppercase tracking-wide truncate group-hover:text-white/80 transition-colors"
                              title={tournament.name}
                            >
                              {tournament.name}
                            </p>
                            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                              <span>${tournament.entryFee} Entry</span>
                              <span className="text-gray-700">•</span>
                              <span>
                                {new Date(
                                  tournament.startDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded border text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${theme.bg} ${theme.border} ${theme.text}`}
                        >
                          {tournament.type}
                        </span>
                      </td>

                      <td className="p-4">
                        <StatusBadge status={tournament.status} />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <Users className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-white font-black text-xs">
                            {tournament.teams?.length || 0}
                            <span className="text-gray-600">
                              /{tournament.maxTeams}
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-[#ec4899] font-black text-sm tracking-wide">
                        <span className="text-gray-600 text-[10px] mr-1">
                          BDT
                        </span>
                        {tournament.prizes?.totalPool?.toLocaleString() || 0}
                      </td>

                      <td className="p-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        {tournament.phases?.find(
                          (phase) => phase.status === "Active",
                        )?.phaseName || "PENDING"}
                      </td>

                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => togglePin(e, tournament)}
                            className={`p-2 rounded-xl transition-all border ${
                              isPinned
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(250,204,21,0.2)]"
                                : "bg-white/5 text-gray-400 border-transparent hover:border-white/20 hover:text-white"
                            }`}
                            title={
                              isPinned
                                ? "Unpin Configuration"
                                : "Pin to Admin Dock"
                            }
                          >
                            <Pin
                              className={`w-4 h-4 ${isPinned ? "fill-yellow-400" : ""}`}
                            />
                          </button>

                          {tournament.status === "Published" && (
                            <button
                              onClick={(e) =>
                                handleUpdateTournamentStatus(
                                  tournament._id,
                                  "Live",
                                  e,
                                )
                              }
                              className="p-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors"
                              title="Deploy Operation (Live)"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          {tournament.status === "Live" && (
                            <button
                              onClick={(e) =>
                                handleUpdateTournamentStatus(
                                  tournament._id,
                                  "Completed",
                                  e,
                                )
                              }
                              className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 transition-colors"
                              title="Mark Operation Complete"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={(e) => e.stopPropagation()} // Edit naturally flows into the click handler if not careful, this stops it
                            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent hover:border-white/20 hover:text-white transition-colors"
                            title="Edit Configuration"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) =>
                              handleDeleteTournament(tournament._id, e)
                            }
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                            title="Terminate Operation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =========================================
              MOBILE CARD VIEW
          ========================================= */}
          <div className="lg:hidden w-full space-y-4 pb-20 relative z-10 px-4">
            {filteredTournaments?.map((tournament) => {
              const isPinned = pinnedTournaments.some(
                (p) => p.id === tournament._id,
              );
              const theme = getCardTheme(tournament.type);

              return (
                <div
                  key={tournament._id}
                  className={`relative bg-[#0a0b10]/20 backdrop-blur-xl rounded-[10px] px-4 py-2 border ${isPinned ? "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]" : "border-white/10"} overflow-hidden cursor-pointer transition-all duration-300`}
                  onClick={() =>
                    handleNavigate(tournament.type, tournament._id)
                  }
                >
                  <div
                    className={`absolute -top-20 -right-20 w-60 h-60 ${theme.bg} blur-[10px] pointer-events-none`}
                  />

                  {/* Mobile Header */}
                  <div className="flex items-start justify-between gap-1 mb-2 relative z-10">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`shrink-0 w-4 h-4 rounded-[4px] border border-white/10 flex items-center justify-center shadow-inner ${theme.bg}`}
                      >
                        {theme.icon}
                      </div>
                      <div className="min-w-0">
                        <h3
                          className="text-white font-black text-[10px] uppercase truncate block w-full"
                          title={tournament.name}
                        >
                          {tournament.name}
                        </h3>
                        <p
                          className={`text-[8px] font-black uppercase mt-0.5 truncate ${theme.text}`}
                        >
                          {tournament.type}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={(e) => togglePin(e, tournament)}
                        className={`p-2 rounded-lg transition-all border ${isPinned ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 " : "bg-white/5 text-gray-300 border-transparent animate-pulse"} `}
                      >
                        <Pin
                          className={`w-3 h-3 ${isPinned ? "fill-yellow-400" : ""}`}
                        />
                      </button>
                      <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                    </div>
                  </div>

                  {/* Mobile Grid Info */}
                  <div className="grid grid-cols-2 gap-2 mb-1 relative z-10">
                    <div className="bg-[#030305] p-1 rounded-xl border border-white/5 flex flex-col justify-center">
                      <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Users size={10} /> Capacity
                      </span>
                      <span className="text-[10px] font-black text-white">
                        {tournament.teams?.length || 0}
                        <span className="text-gray-600">
                          /{tournament.maxTeams}
                        </span>
                      </span>
                    </div>
                    <div className="bg-[#030305] p-1 rounded-xl border border-white/5 flex flex-col justify-center">
                      <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        <DollarSign size={10} /> Prize Pool
                      </span>
                      <span className="text-[10px] font-black text-[#ec4899] truncate">
                        BDT {tournament.prizes?.totalPool || 0}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 relative z-10">
                    <StatusBadge status={tournament.status} />

                    <div className="flex items-center gap-1.5">
                      {tournament.status === "Published" && (
                        <button
                          onClick={(e) =>
                            handleUpdateTournamentStatus(
                              tournament._id,
                              "Live",
                              e,
                            )
                          }
                          className="p-2 bg-green-500/10 text-green-400 rounded-lg"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {tournament.status === "Live" && (
                        <button
                          onClick={(e) =>
                            handleUpdateTournamentStatus(
                              tournament._id,
                              "Completed",
                              e,
                            )
                          }
                          className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); /* edit logic */
                        }}
                        className="p-2 bg-white/5 text-gray-400 rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) =>
                          handleDeleteTournament(tournament._id, e)
                        }
                        className="p-2 bg-rose-500/10 text-rose-500 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================
              EMPTY STATE
          ========================================= */}
          {filteredTournaments?.length === 0 && (
            <div className="text-center py-20 bg-[#0a0b10]/40 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-inner">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                <Crosshair className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">
                No Operations Found
              </h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-md mx-auto mb-8 leading-relaxed">
                {searchTerm
                  ? "No data matches your search parameters."
                  : "The database is empty. Deploy your first sector."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#3b82f6] to-[#ec4899] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] border border-white/20"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} /> Deploy Sector
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        refetch={refetch}
      />
    </div>
  );
}
