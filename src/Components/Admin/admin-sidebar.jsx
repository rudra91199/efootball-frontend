import {
  FaUsers,
  FaTrophy,
  FaGamepad,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GiTrophyCup } from "react-icons/gi";
import { NavLink, useLocation, useNavigate } from "react-router";
import efootballLogoNew from "../../assets/EcNewBright.png";

export default function AdminSidebar() {
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  const menuItems = [
    { id: "", label: "Overview", icon: FaChartBar },
    { id: "players", label: "Player Management", icon: FaUsers },
    { id: "tournaments", label: "Tournament Management", icon: FaTrophy },
    {id:"rules", label: "Rules Management", icon: FaCog},
    {id:"create-motm", label: "Motm Slide", icon: FaCog},
    {id:"create-vs", label: "Team Vs Slide", icon: FaCog},
  ];

  const navs = [
    { id: "/dashboard", label: "User Dashboard", icon: RxDashboard },
    { id: "/tournaments", label: "Tournaments", icon: GiTrophyCup },
  ];

  return (
    <div className="hidden sm:block pt-5 px-5 min-h-screen bg-gradient-to-br from-[#262e5c] to-black backdrop-blur-3xl border-r border-white/10">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={efootballLogoNew} alt="" width={"35px"} />
        <span className="text-lg font-black text-[#fefb04] montserrat-logo">
          The eFootball Center
        </span>
      </div>
      <div className="py-6 mt-4">
        <h2 className="text-md font-bold text-white/70 px-4 mb-3">Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={`${item.id}`}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    (isActive && pathName === "/admin") ||
                    (isActive && pathName === `/admin/${item.id}`)
                      ? "bg-blue-600/30 text-white/90 border border-blue-500/50"
                      : "text-white/90 hover:text-white hover:bg-gray-800/50"
                  }`
                }
              >
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <h2 className="text-md font-bold text-white/70 px-4 mt-6 mb-3">
          Navigation
        </h2>
        <nav className="space-y-2">
          {navs.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={`${item.id}`}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-white/90`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <button className="text-white text-center w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 cursor-pointer rounded-md pt-1 pb-2">
        Sign Out
      </button>
    </div>
  );
}
