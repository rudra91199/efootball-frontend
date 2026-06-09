"use client";

import { ArrowLeft, Play, Trophy, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";

export default function TournamentHeader({
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
    <div className="border-b pb-2 mb-2 border-red-900">
      <div className="w-full mx-auto  py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-yellow">
                {tournament?.name}
              </h1>
              <p className="text-gray-400 hidden sm:block">{tournament?.type} Tournament</p>
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
           
          </div>
        </div>
      </div>
    </div>
  );
}
