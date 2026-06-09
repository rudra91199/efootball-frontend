import { toast } from "react-toastify";
import { API } from "../../../axios";
import {
  Calendar,
  Clock,
  LoaderCircle,
  Zap,
  X,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";

const LeaguePublishRoundModal = ({
  selectedFixtures,
  refetch,
  setSelectedFixtures,
  setPublishModal,
  leageueId,
  publishModal,
}) => {
  const [roundStartDate, setRoundStartDate] = useState("");
  const [roundStartTime, setRoundStartTime] = useState("");
  const [roundEndDate, setRoundEndDate] = useState("");
  const [roundEndTime, setRoundEndTime] = useState("");
  const [isPublishingRound, setIsPublishingRound] = useState(false);

  const formatDateForMongoDB = (dateStr, timeStr) => {
    const combinedDateTime = `${dateStr}T${timeStr}:00.000Z`;
    const dateObject = new Date(combinedDateTime);
    return dateObject.toISOString();
  };

  const handleSaveRoundSettings = async () => {
    if (!roundStartDate || !roundEndDate || !roundStartTime || !roundEndTime) {
      toast.error("All date and time fields are required.");
      return;
    }
    const mongoDBDateStringStart = formatDateForMongoDB(
      roundStartDate,
      roundStartTime,
    );
    const mongoDBDateStringEnd = formatDateForMongoDB(
      roundEndDate,
      roundEndTime,
    );
    setIsPublishingRound(true);

    try {
      const response = await API.patch(
        `/leagues/${leageueId}/publish-rounds`,
        {
          roundStartDate: mongoDBDateStringStart,
          roundEndDate: mongoDBDateStringEnd,
          round: publishModal.round,
        },
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        },
      );
      if (response.data.success) {
        setRoundStartDate("");
        setRoundStartTime("");
        setRoundEndDate("");
        setRoundEndTime("");
        setSelectedFixtures([]);
        setPublishModal({
          isOpen: false,
          round: null,
        });
        toast.success("Fixtures published successfully");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to publish fixtures");
    } finally {
      setIsPublishingRound(false);
    }
  };

  const handleClose = () => {
    setPublishModal({
      isOpen: false,
      round: null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      {/* Premium Modal Container */}
      <div className="relative bg-[#0a0a0c] border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#004d98]/10 via-[#a50044]/10 to-[#eab308]/10 pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 z-10 shrink-0">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#eab308]" />
              Publish Round <br /> {publishModal.round}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              {selectedFixtures.length} Fixture
              {selectedFixtures.length !== 1 && "s"} Selected
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10">
          {/* Info Banner */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
            <CalendarDays className="w-5 h-5 text-[#5865f9] shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              Set the active window for these fixtures. Once published, they
              will become visible to all participating teams.
            </p>
          </div>

          {/* Time Configuration */}
          <div className="space-y-4">
            {/* Start Window */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-[#eab308] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="w-2 h-2 rounded-full bg-[#eab308] animate-pulse"></span>
                Start Window
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date
                  </label>
                  <input
                    type="date"
                    value={roundStartDate}
                    onChange={(e) => setRoundStartDate(e.target.value)}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    className="h-full w-[150px] px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] transition-all cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time
                  </label>
                  <input
                    type="time"
                    value={roundStartTime}
                    onChange={(e) => setRoundStartTime(e.target.value)}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    className="h-full w-[150px] px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] transition-all cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* End Window */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-[#a50044] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="w-2 h-2 rounded-full bg-[#a50044]"></span>
                End Window
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date
                  </label>
                  <input
                    type="date"
                    value={roundEndDate}
                    onChange={(e) => setRoundEndDate(e.target.value)}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    className="h-full w-[150px] px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#a50044] focus:border-[#a50044] transition-all cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time
                  </label>
                  <input
                    type="time"
                    value={roundEndTime}
                    onChange={(e) => setRoundEndTime(e.target.value)}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    className="h-full w-[150px] px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#a50044] focus:border-[#a50044] transition-all cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Selected Fixtures List */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">
              Included Matches
            </p>
            <div className="max-h-32 overflow-y-auto space-y-1.5 custom-scrollbar bg-[#050508]/50 p-2 rounded-xl border border-white/5">
              {selectedFixtures.map((match, idx) => (
                <div
                  key={match._id}
                  className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 text-sm font-bold text-white"
                >
                  <div className="flex-1 truncate text-left">
                    {match.team1?.name || "TBD"}
                  </div>
                  <span className="text-[10px] text-gray-500 mx-3 italic">
                    VS
                  </span>
                  <div className="flex-1 truncate text-right">
                    {match.team2?.name || "TBD"}
                  </div>
                </div>
              ))}
              {selectedFixtures.length === 0 && (
                <div className="p-3 text-center text-gray-500 text-sm font-medium">
                  No fixtures selected for this round.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-black/40 flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-black border border-white/20 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRoundSettings}
            disabled={isPublishingRound || selectedFixtures.length === 0}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#004d98] via-[#a50044] to-[#eab308] disabled:opacity-50 disabled:grayscale text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all hover:shadow-[0_0_15px_rgba(165,0,68,0.5)] active:scale-95 flex items-center justify-center gap-2"
          >
            {isPublishingRound ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" /> Publishing...
              </>
            ) : (
              "Publish Fixtures"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaguePublishRoundModal;
