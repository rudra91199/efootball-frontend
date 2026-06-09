import { toast } from "react-toastify";
import { API } from "../../../axios";
import { Calendar, Clock, LoaderCircle } from "lucide-react";
import { useState } from "react";

const PublishRoundModal = ({
  selectedFixtures,
  refetch,
  setSelectedFixtures,
  setPublishModal,
  knockoutId,
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
      alert("All fields are required.");
      return;
    }
    const mongoDBDateStringStart = formatDateForMongoDB(
      roundStartDate,
      roundStartTime
    );
    const mongoDBDateStringEnd = formatDateForMongoDB(
      roundEndDate,
      roundEndTime
    );
    setIsPublishingRound(true);
    const response = await API.patch(
      `/knockouts/${knockoutId}/publish-rounds`,
      {
        roundStartDate: mongoDBDateStringStart,
        roundEndDate: mongoDBDateStringEnd,
        round: publishModal.round,
      },
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }
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
      setIsPublishingRound(false);
      toast.success("Fixtures published successfully");
      refetch();
    }
    setIsPublishingRound(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-white">
      <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-foreground mb-4">
          Publish Fixtures
        </h3>
        <p className="text-muted-foreground mb-4">
          Are you sure you want to publish {selectedFixtures.length} fixture(s)?
          This will make them visible to all participants.
        </p>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={roundStartDate}
              onChange={(e) => setRoundStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Start Time
            </label>
            <input
              type="time"
              value={roundStartTime}
              onChange={(e) => setRoundStartTime(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={roundEndDate}
              onChange={(e) => setRoundEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              End Time
            </label>
            <input
              type="time"
              value={roundEndTime}
              onChange={(e) => setRoundEndTime(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
          {selectedFixtures.map((match) => (
            <div
              key={match._id}
              className="text-sm p-2 bg-background/50 rounded"
            >
              {match.team1.name} vs {match.team2.name} - {match.date}
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() =>
              setPublishModal({
                isOpen: false,
                round: null,
              })
            }
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRoundSettings}
            disabled={isPublishingRound}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishingRound && (
              <LoaderCircle className="w-4 h-4 inline animate-spin mr-2" />
            )}
            {isPublishingRound ? "Publishing..." : "Publish Fixtures"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishRoundModal;
