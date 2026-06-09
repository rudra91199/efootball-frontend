"use client";

import { useState } from "react";
import { Calendar, X, LoaderCircle, Clock } from "lucide-react";
import { API } from "../../../axios";
import { toast } from "react-toastify";

export function PublishMatchModal({
  setPublishingMatch,
  publishingMatch,
  refetch,
  roundStatus,
  setRoundStatus,
}) {
  const [roundStartDate, setRoundStartDate] = useState("");
  const [roundStartTime, setRoundStartTime] = useState("");
  const [roundEndDate, setRoundEndDate] = useState("");
  const [roundEndTime, setRoundEndTime] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const formatDateForMongoDB = (dateStr, timeStr) => {
    const combinedDateTime = `${dateStr}T${timeStr}:00.000Z`;

    const dateObject = new Date(combinedDateTime);

    return dateObject.toISOString();
  };

  const handleSaveRoundSettings = async () => {
    const mongoDBDateStringStart = formatDateForMongoDB(
      roundStartDate,
      roundStartTime
    );
    const mongoDBDateStringEnd = formatDateForMongoDB(
      roundEndDate,
      roundEndTime
    );
    if (
      !roundStatus ||
      !roundStartDate ||
      !roundEndDate ||
      !roundStartTime ||
      !roundEndTime
    ) {
      alert("All fields are required.");
      return;
    }
    setIsPublishing(true);
    const response = await API.patch(
      `/matches/update-round-status/${publishingMatch}`,
      {
        roundStartDate: mongoDBDateStringStart,
        roundEndDate: mongoDBDateStringEnd,
        status: roundStatus,
      },
      {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      }
    );
    if (response.data.success) {
      setIsPublishing(false);
      setRoundStartDate("");
      setRoundStartTime("");
      setRoundEndDate("");
      setRoundEndTime("");
      setPublishingMatch(null);
      toast.success("Match published successfully!");
      refetch();
    }
    setIsPublishing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">
            Publish Match:{" "}
            {/* {matches.find((m) => m.id === publishingMatch)?.team1} vs{" "}
                {matches.find((m) => m.id === publishingMatch)?.team2} */}
          </h3>
          <button
            onClick={() => setPublishingMatch(null)}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Match Status
            </label>
            <select
              value={roundStatus}
              onChange={(e) => setRoundStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Unpublished">Unpublished</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
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
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setPublishingMatch(null)}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRoundSettings}
            disabled={isPublishing}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
          >
            {isPublishing && <LoaderCircle className="animate-spin" />}
            Publish Match
          </button>
        </div>
      </div>
    </div>
  );
}
