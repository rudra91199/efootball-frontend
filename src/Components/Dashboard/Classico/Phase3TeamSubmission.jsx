import { LoaderCircle, ChevronRight, X } from "lucide-react";
import { getFaceCropUrl } from "../../../Utils/utils";

export default function TeamModal({
  isModalOpen,
  setIsModalOpen,
  selectedTeam,
  oldListPlayers,
  newListPlayers,
  originalPlayers,
  setOldListPlayers,
  setNewListPlayers,
  setOriginalPlayers,
  handleLineupSubmit,
  isSubmitting,
  theme = {} // Using the dynamic theme from parent
}) {
  if (!isModalOpen) return null;

  const movePlayerToNewList = (index) => {
    const player = oldListPlayers[index];
    setNewListPlayers([...newListPlayers, player]);
    setOldListPlayers(oldListPlayers.filter((_, i) => i !== index));
  };

  const movePlayerBackToOldList = (index) => {
    const player = newListPlayers[index];
    setOldListPlayers([...oldListPlayers, player]);
    setNewListPlayers(newListPlayers.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setOldListPlayers([...originalPlayers]);
    setNewListPlayers([]);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setOldListPlayers([]);
    setNewListPlayers([]);
    setOriginalPlayers([]);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-[100]">
      <div 
        className={`relative w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col rounded-2xl before:rounded-2xl overflow-hidden ${theme.panelBg} ${theme.border}`}
      >
        
        {/* --- MODAL HEADER --- */}
        <div className="bg-black/40 border-b border-white/10 px-5 sm:px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className={`text-xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}>
              {selectedTeam?.name} Lineup
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Select players in the exact order you want them to fight.
            </p>
          </div>
          <button 
            onClick={handleClose}
            className={`p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:${theme.accentText} transition-all`}
          >
            <X size={20} />
          </button>
        </div>

        {/* --- MODAL CONTENT (Responsive Split) --- */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 relative">
          
          {/* Optional Watermark for extra flavor */}
          {theme.watermark && (
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <img src={theme.watermark} alt="Team Watermark" className="w-[60%] object-contain" />
            </div>
          )}

          {/* AVAILABLE PLAYERS POOL */}
          <div className="flex-1 flex flex-col min-h-[300px] lg:min-h-0 relative z-10">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm sm:text-lg font-bold text-gray-300 uppercase tracking-widest">
                Available Roster
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase tracking-widest ${theme.badge}`}>
                {oldListPlayers.length} Remaining
              </span>
            </div>
            
            <div className="flex-1 border border-white/10 rounded-xl bg-black/40 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {oldListPlayers.length === 0 ? (
                <div className="h-full flex items-center justify-center opacity-50">
                  <div className="text-center">
                    <div className="text-5xl mb-3">✓</div>
                    <p className="text-white font-medium uppercase tracking-widest text-sm">
                      Roster Empty
                    </p>
                  </div>
                </div>
              ) : (
                oldListPlayers.map((player, index) => (
                  <button
                    key={player.id}
                    onClick={() => movePlayerToNewList(index)}
                    className="w-full text-left p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* WRAPPED IMAGE WITH DYNAMIC BACKGROUND */}
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border bg-black shrink-0 ${theme.avatarBorder}`}>
                        <img
                          src={getFaceCropUrl(player.image?.url)}
                          alt={player.name}
                          className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm sm:text-base text-white truncate">
                          {player.inGameUserName}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {player.name}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Icon */}
                    <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all shrink-0 ${theme.accentText}`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ACTIVE SQUAD DEPLOYMENT */}
          <div className="flex-1 flex flex-col min-h-[350px] lg:min-h-0 relative z-10">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm sm:text-lg font-bold text-white uppercase tracking-widest">
                Deployment Order
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase tracking-widest ${theme.badge}`}>
                {newListPlayers.length} Selected
              </span>
            </div>

            <div className="flex-1 border border-white/10 rounded-xl bg-black/60 overflow-y-auto p-3 space-y-2 shadow-inner custom-scrollbar">
              {newListPlayers.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <div className="text-5xl mb-4 grayscale">👥</div>
                  <p className="text-white font-black uppercase tracking-widest text-sm text-center px-4">
                    Tap players to add them to your lineup
                  </p>
                </div>
              ) : (
                newListPlayers.map((player, index) => (
                  <button
                    key={player.id}
                    onClick={() => movePlayerBackToOldList(index)}
                    className="w-full text-left p-3 rounded-lg border bg-black/40 hover:bg-black/60 transition-all duration-200 group flex items-center gap-3 shadow-md"
                    style={{ borderColor: "rgba(255,255,255,0.15)" }}
                  >
                    {/* Thematic Rank Number */}
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-black text-sm sm:text-lg shrink-0 shadow-lg ${theme.badge}`}>
                      {index + 1}
                    </div>

                    {/* WRAPPED IMAGE WITH DYNAMIC BORDER */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 bg-black shrink-0 shadow-md ${theme.avatarBorder}`}>
                      <img
                        src={getFaceCropUrl(player.image?.url)}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm sm:text-base truncate ${theme.accentText}`}>
                        {player.inGameUserName}
                      </div>
                      <div className="text-xs text-gray-400 truncate mt-0.5">
                        {player.name}
                      </div>
                    </div>

                    {/* Remove Action */}
                    <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center group-hover:bg-red-500/30 group-hover:border-red-500 transition-all shrink-0">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

        </div>

        {/* --- MODAL FOOTER --- */}
        <div className="bg-black/40 border-t border-white/10 px-4 sm:px-8 py-4 sm:py-6 shrink-0 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Count Indicator */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="text-center">
                <div className={`text-2xl font-black ${theme.accentText}`}>
                  {newListPlayers.length}
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Ready</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-black text-gray-600">
                  {oldListPlayers.length}
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Bench</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleReset}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 font-bold uppercase tracking-widest text-xs sm:text-sm"
              >
                Reset
              </button>
              <button
                onClick={handleLineupSubmit}
                disabled={isSubmitting || newListPlayers.length === 0}
                className={`flex-[2] sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-8 py-3 rounded-lg font-black uppercase tracking-widest text-xs sm:text-sm transition-all duration-200 border border-white/10 ${
                  isSubmitting || newListPlayers.length === 0
                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                    : `${theme.progressActive} text-white ${theme.shadow} hover:opacity-90 hover:scale-[1.02]`
                }`}
              >
                {isSubmitting && <LoaderCircle className="animate-spin w-4 h-4" />}
                {isSubmitting ? "Locking..." : "Lock In Lineup"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}