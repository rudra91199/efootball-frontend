"use client";

export default function OverviewSection() {
  const stats = [
    {
      title: "Total Players",
      value: "12",
      change: "+12%",
      color: "rgb(34, 197, 94)",
      textColor: "#2b7fff",
    },
    {
      title: "Active Tournaments",
      value: "1",
      change: "+0",
      color: "rgb(59, 130, 246)",
      textColor: "#fb2c36",
    },
    {
      title: "Completed Matches",
      value: "0",
      change: "+23",
      color: "rgb(168, 85, 247)",
      textColor: "#00c950",
    },
    {
      title: "Total Prize Pool",
      value: "4400",
      change: "+4400",
      color: "white",
      
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">
          Monitor your eFootball tournament platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-xl p-2 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-bold">
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${stat.title.includes("Prize") ? 'bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent':""}`}
                    style={{ color: stat.textColor ? stat.textColor:""}}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className="text-sm font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      color: `${stat.color}`,
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-[#262e5c34] to-[#262e5c31] backdrop-blur-3xl border border-white/10 rounded-2xl">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-white/7 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="flex-1">
                <p className="text-white font-medium">
                  New tournament "Spring Championship" created
                </p>
                <p className="text-gray-400 text-sm">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-white/7 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="flex-1">
                <p className="text-white font-medium">
                  Match result updated: Team Alpha vs Team Beta
                </p>
                <p className="text-gray-400 text-sm">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-white/7 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="flex-1">
                <p className="text-white font-medium">
                  15 new players registered
                </p>
                <p className="text-gray-400 text-sm">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
