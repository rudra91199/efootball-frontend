"use client";

import { Trophy, Users, Calendar, Settings } from "lucide-react";

export default function TournamentNavigation({
  activeTab,
  onTabChange,
  phases,
}) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Trophy },
    { id: "teams", label: "Teams", icon: Users },
    { id: "fixtures", label: "Fixtures", icon: Calendar },
    { id: "phases", label: "Phases", icon: Settings },
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
  ];

  return (
    <div className="bg-black/90  px-6 rounded-lg">
      <div className="w-full mx-auto">
        <nav className="flex space-x-8">
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
