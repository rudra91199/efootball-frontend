"use client";

import { ArrowLeft, Play, Trophy, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";

export default function DashboardTournamentHeader({
  tournament,
  onStatusUpdate,
}) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-600 text-gray-200";
      case "active":
        return "bg-green-600 text-green-100";
      case "completed":
        return "bg-blue-600 text-blue-100";
      case "cancelled":
        return "bg-red-600 text-red-100";
      default:
        return "bg-gray-600 text-gray-200";
    }
  };

  return (
    <div className="border-b border-gray-800">
      <div className="w-full mx-auto  py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                {tournament?.name}
              </h1>
              <p className="text-gray-400">{tournament?.type} Tournament</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                tournament?.status
              )}`}
            >
              {tournament?.status?.charAt(0).toUpperCase() +
                tournament?.status?.slice(1)}
            </span>
            <div className="flex space-x-2">
              {tournament?.status === "draft" && (
                <button
                  onClick={() => onStatusUpdate("active")}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Tournament</span>
                </button>
              )}
              {tournament?.status === "active" && (
                <>
                  <button
                    onClick={() => onStatusUpdate("completed")}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Complete</span>
                  </button>
                  <button
                    onClick={() => onStatusUpdate("cancelled")}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
              {tournament?.status === "cancelled" && (
                <button
                  onClick={() => onStatusUpdate("draft")}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reactivate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
