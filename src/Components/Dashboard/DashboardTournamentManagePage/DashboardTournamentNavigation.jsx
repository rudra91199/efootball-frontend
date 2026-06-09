"use client";

import { Trophy, Users, Calendar, Settings, FileText } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";

export default function DashboardTournamentNavigation({
  activeTab,
  onTabChange,
  phases,
  myTeam,
}) {
  const { user } = useAuthStore();
  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "fixtures", label: "Fixtures", icon: Calendar },
    ...(user && myTeam && myTeam?.captain?._id === user?._id
      ? [
          {
            id: "teamManagement",
            label: "Team Management",
            icon: Settings,
          },
        ]
      : []),
    { id: "matches", label: "My Matches", icon: Users },
    { id: "leaderboard", label: "Leaderboard", icon: Settings },
    ...(phases && phases[0]?.status === "Completed"
      ? [
          {
            id: "championshipPoints",
            label: "Championship Points",
            icon: Settings,
          },
        ]
      : []),
    { id: "rules", label: "Tournament Rules", icon: FileText },
    { id: "prizes", label: "Prize Distribution", icon: Trophy },
  ];

  return (
    <div className="bg-black/90  p-2 md:p-2 rounded-2xl">
      <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-muted/30 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#ff0082]/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-primary/60 scrollbar-thin">
        <nav className="flex space-x-3 bg-[#000000] p-1 rounded-xl min-w-max lg:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
