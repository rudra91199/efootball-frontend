import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../axios";
import { Plus, Search, Smartphone, Trash2, User, Crosshair, Edit3 } from "lucide-react";
import AddPlayerModal from "./add-player-modal";
import EditProfileModal from "./EditProfileModal"; // Import our new modal
import { getFaceCropUrl } from "../../Utils/utils";
import AuthLoader from "../Loaders/AuthLoader";

export default function PlayerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  
  // State for the Edit Profile Modal
  const [selectedPlayerForEdit, setSelectedPlayerForEdit] = useState(null);

  const { data: { data: { data } = {} } = {}, isLoading, refetch } = useQuery({
    queryKey: ["players"],
    queryFn: () => API.get("/users/getAllUsers", {
      headers: { Authorization: localStorage.getItem("authToken") },
    }),
  });

  const filteredPlayers = data?.filter(
    (player) =>
      player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.inGameUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlayer = (newPlayer) => {
    // Implement Add Logic
    setShowAddPlayerModal(false);
    refetch();
  };

  const handleDeletePlayer = async (id) => {
    if(!window.confirm("Are you sure you want to terminate this operator's record?")) return;
    // Implement Delete Logic here
    // await API.delete(`/users/admin/player/${id}`);
    // refetch();
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "active") return <span className="bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 px-2.5 py-1 rounded-md text-[9px] uppercase font-black tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.2)]">Active</span>;
    if (s === "blocked") return <span className="bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/30 px-2.5 py-1 rounded-md text-[9px] uppercase font-black tracking-widest shadow-[0_0_10px_rgba(225,29,72,0.2)]">Blocked</span>;
    return <span className="bg-gray-500/10 text-gray-400 border border-gray-500/30 px-2.5 py-1 rounded-md text-[9px] uppercase font-black tracking-widest">Inactive</span>;
  };

  const getRoleBadge = (role) => {
    const r = role?.toLowerCase();
    if (r === "admin") return <span className="text-[#a855f7] font-black uppercase tracking-wider text-[10px] drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">Admin</span>;
    if (r === "referee") return <span className="text-[#ec4899] font-black uppercase tracking-wider text-[10px]">Referee</span>;
    return <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Player</span>;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-white font-sans min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ec4899]/10 border border-[#ec4899]/20 mb-3 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
            <Crosshair className="w-3.5 h-3.5 text-[#ec4899]" />
            <span className="text-[9px] font-black text-[#ec4899] uppercase tracking-[0.3em]">Command Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-tighter leading-none">
            Operator Roster
          </h1>
        </div>
        
        <button
          onClick={() => setShowAddPlayerModal(true)}
          className="w-full md:w-auto flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-[#3b82f6] to-[#a855f7] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 border border-white/20"
        >
          <Plus className="mr-2 w-4 h-4" strokeWidth={3} />
          Register Operator
        </button>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="mb-8 relative z-10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-[#a855f7] transition-colors" />
          <input
            type="text"
            placeholder="ACCESS DATABASE (NAME, IGN, EMAIL)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#0a0b10]/80 backdrop-blur-xl border border-white/10 rounded-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50 transition-all font-bold text-sm tracking-wide shadow-inner"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AuthLoader/>
        </div>
      ) : (
        <>
          {/* --- MOBILE VIEW (CARDS) --- */}
          <div className="md:hidden space-y-4 relative z-10">
            {filteredPlayers?.map((player) => (
              <div
                key={player._id}
                className="bg-[#0a0b10]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />

                {/* Header */}
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getFaceCropUrl(player?.image?.url) || "/placeholder.svg"}
                      alt={player.name}
                      className="w-12 h-12 object-cover rounded-[10px] border border-white/10"
                    />
                    <div className="min-w-0">
                      <h3 className="text-white font-black text-base uppercase tracking-wide truncate">
                        {player.inGameUserName || "UNKNOWN"}
                      </h3>
                      <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest truncate">
                        {player.name}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(player.status)}
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-2 mb-5 relative z-10">
                  <div className="bg-[#030305] p-2.5 rounded-xl border border-white/5 flex flex-col justify-center">
                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><User size={10} className="text-[#ec4899]" /> ID Code</span>
                    <span className="text-xs font-black text-[#ec4899] truncate">{player.inGameUserId || "N/A"}</span>
                  </div>
                  <div className="bg-[#030305] p-2.5 rounded-xl border border-white/5 flex flex-col justify-center">
                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Smartphone size={10} className="text-[#3b82f6]" /> Hardware</span>
                    <span className="text-xs font-black text-[#3b82f6] truncate">{player.phoneModel || "N/A"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 relative z-10">
                  <button 
                    onClick={() => setSelectedPlayerForEdit(player)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Configure
                  </button>
                  <button
                    onClick={() => handleDeletePlayer(player._id)}
                    className="flex-1 py-2.5 bg-[#e11d48]/10 hover:bg-[#e11d48]/20 rounded-xl border border-[#e11d48]/30 text-[#e11d48] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Terminate
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- DESKTOP VIEW (TABLE) --- */}
          <div className="hidden md:block bg-[#0a0b10]/80 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#030305]/50">
                  <th className="py-5 px-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">Identity</th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">Codename / ID</th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">Hardware</th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">Clearance</th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] text-center">Status</th>
                  <th className="py-5 px-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] text-right">Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPlayers?.map((player) => (
                  <tr key={player._id} className="group hover:bg-white/[0.02] transition-colors">
                    
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <img src={player?.image?.url || "/placeholder.svg"} className="w-12 h-12 object-cover rounded-[10px] border border-white/10 grayscale-[30%] group-hover:grayscale-0 transition-all" alt="" />
                        <div>
                          <p className="text-white font-black uppercase tracking-wide">{player.name}</p>
                          <p className="text-gray-500 text-[10px] font-bold tracking-wider">{player.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="text-[#ec4899] font-black uppercase tracking-wide drop-shadow-[0_0_5px_rgba(236,72,153,0.3)]">{player.inGameUserName || "N/A"}</p>
                      <p className="text-gray-500 text-[10px] font-black tracking-widest mt-0.5">{player.inGameUserId || "NO-ID"}</p>
                    </td>

                    <td className="p-4 text-[#3b82f6] text-xs font-black uppercase tracking-wider">
                      {player.phoneModel || "UNKNOWN"}
                    </td>

                    <td className="p-4">
                      {getRoleBadge(player.role)}
                    </td>

                    <td className="p-4 text-center">
                      {getStatusBadge(player.status)}
                    </td>

                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedPlayerForEdit(player)}
                          className="p-2.5 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 text-gray-300 hover:text-white rounded-xl transition-all"
                          title="Configure Profile"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player._id)}
                          className="p-2.5 bg-white/5 hover:bg-[#e11d48]/20 border border-transparent hover:border-[#e11d48]/30 text-gray-400 hover:text-[#e11d48] rounded-xl transition-all"
                          title="Terminate Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPlayers?.length === 0 && (
              <div className="text-center py-16 text-gray-500 font-bold uppercase tracking-widest text-xs">
                No matching operators found in database.
              </div>
            )}
          </div>
        </>
      )}

      {/* --- MODALS --- */}
      <AddPlayerModal
        isOpen={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        onAdd={handleAddPlayer}
      />

      {/* Edit Modal (Connects to our newly updated component) */}
      <EditProfileModal 
        isOpen={!!selectedPlayerForEdit}
        onClose={() => setSelectedPlayerForEdit(null)}
        player={selectedPlayerForEdit}
        onSuccess={() => refetch()} 
      />
    </div>
  );
}