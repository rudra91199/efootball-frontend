import { GiTrophy } from "react-icons/gi";
import {
  MdAdminPanelSettings,
  MdArrowDropDown,
  MdOutlineStackedBarChart,
  MdOutlineStar,
  MdRule,
} from "react-icons/md";
import {
  FaPlay,
  FaUsers,
  FaTrophy,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { PiBookOpenUserFill } from "react-icons/pi";
import { NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";

const MobileSideBar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  mobileMenuRef,
  isDashboardOpen,
  setIsDashboardOpen,
  isAdminOpen,
  setIsAdminOpen,
}) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const dashboardMenuItems = [
    { id: "/dashboard", label: "Career", icon: <PiBookOpenUserFill /> },
    {
      id: "/dashboard/my-tournaments",
      label: "My Tournaments",
      icon: <GiDiamondTrophy />,
    },
  ];

  const adminMenuItems = [
    { id: "/admin", label: "Overview", icon: FaChartBar },
    { id: "/admin/players", label: "Manage Player", icon: FaUsers },
    {
      id: "/admin/tournaments",
      label: "Manage Tournament",
      icon: <FaTrophy />, // Note: Changed to element to match others or keep as component ref if your logic handles it
    },
    { id: "/admin/rules", label: "Manage Rules", icon: FaCog },
  ];

  return (
    <div
      ref={mobileMenuRef}
      className={`fixed top-[50px] right-0 h-[calc(100vh-50px)] w-[55%] liquid-glass-card bg-gradient-to-tl from-black to-[#19214e] backdrop-blur-xl border-l border-white/10 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col py-6 pr-2 pl-8 space-y-4 ">
        {/* Play Now Button - Visible in mobile menu */}

        <div className="border-t border-white/60 space-y-2">
          <h3 className="text-white/80  text-center font-bold mt-2 mb-2 ">
            Main Menu
          </h3>
          <button
            onClick={() => {
              navigate("/tournaments");
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-end gap-2 text-sm text-white text-right font-medium transition-colors py-1 pr-3 rounded-lg hover:bg-white/10 bg-transparent border-none cursor-pointer"
          >
            All Tournaments
            <GiTrophy />
          </button>
          <button
            onClick={() => {
              navigate("/leaderboard");
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-end gap-2  text-sm  text-white text-right  font-medium transition-colors py-1 pr-3 rounded-lg hover:bg-white/10 bg-transparent border-none cursor-pointer"
          >
            Leaderboard
            <MdOutlineStackedBarChart />
          </button>
          <button
            onClick={() => {
              navigate("/rules");
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-end gap-2 text-sm text-white text-right font-medium transition-colors py-1 pr-3 rounded-lg hover:bg-white/10 bg-transparent border-none cursor-pointer"
          >
            Rules
            <MdRule />
          </button>

          <button
            onClick={() => {
              navigate("/hall-of-fame");
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-end gap-2 text-sm text-white text-right font-medium transition-colors py-1 pr-3 rounded-lg hover:bg-white/10 bg-transparent border-none cursor-pointer"
          >
            Hall of Fame
            <MdOutlineStar />
          </button>
        </div>

        {user && (
          <div className="border-t border-white/60 space-y-1">
            <h3 className={`text-white/80 text-center font-medium mt-2  `}>
              Account Menu
            </h3>

            <div className="py-2 font-medium">
              
              {/* --- ADMIN TOGGLE --- */}
              {user.role === "admin" && (
                <>
                  <button
                    onClick={() => {
                      setIsAdminOpen(!isAdminOpen);
                    }}
                    className={`w-full px-4 py-2 text-white transition-colors duration-200 flex items-center justify-end space-x-3 bg-transparent cursor-pointer ${
                      isAdminOpen && "border-b  border-white/30"
                    }`}
                  >
                    <p className="flex items-center gap-2 text-sm">
                      <MdArrowDropDown
                        className={`transition-all duration-300 ${
                          isAdminOpen ? "rotate-180" : ""
                        }`}
                      />
                      Admin Panel
                    </p>
                    <MdAdminPanelSettings />
                  </button>

                  {/* Animation Wrapper for Admin */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isAdminOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="my-1 space-y-2">
                        {adminMenuItems.map((item) => (
                          <NavLink
                            to={item.id}
                            key={item.id}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                            }}
                            className={({ isActive }) =>
                              `flex items-center bg-white/20 justify-center gap-2 py-1 rounded-lg transition-all duration-200 ${
                                (isActive && pathname === "/dashboard") ||
                                (isActive && pathname === `${item.id}`)
                                  ? "sm:bg-primary sm:text-primary-foreground"
                                  : "sm:text-sidebar-foreground hover:bg-secondary hover:text-secondary-foreground"
                              }`
                            }
                          >
                            <span
                              className={`text-white/80 font-medium text-center transition-all duration-300 text-[14px]`}
                            >
                              {item.label}
                            </span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* --- DASHBOARD TOGGLE --- */}
              <button
                onClick={() => {
                  setIsDashboardOpen(!isDashboardOpen);
                }}
                className={`w-full  px-4 py-2 text-white  transition-colors duration-200 flex items-center justify-end space-x-3 bg-transparent  cursor-pointer border-white/60 ${
                  isDashboardOpen && "border-b "
                }`}
              >
                <p className="flex items-center gap-2 text-sm">
                  <MdArrowDropDown
                    className={`transition-all duration-300 ${
                      isDashboardOpen ? "rotate-180" : ""
                    }`}
                  />
                  Dashboard
                </p>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
              </button>

              {/* Animation Wrapper for Dashboard */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isDashboardOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="my-1 space-y-2">
                    {dashboardMenuItems.map((item) => (
                      <NavLink
                        to={item.id}
                        key={item.id}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                        }}
                        className={({ isActive }) =>
                          `flex items-center justify-center bg-white/20 gap-2 py-1 rounded-lg transition-all duration-200 ${
                            (isActive && pathname === "/dashboard") ||
                            (isActive && pathname === `${item.id}`)
                              ? "bg-primary text-primary-foreground"
                              : "text-sidebar-foreground hover:bg-secondary hover:text-secondary-foreground"
                          }`
                        }
                      >
                        <span
                          className={`text-white/80 font-medium  transition-all duration-300 text-[14px]`}
                        >
                          {item.label}
                        </span>
                        <span className="text-white/80 text-sm">
                          {item.icon}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/dashboard/profile");
                }}
                className="w-full px-4 py-2 text-white text-sm transition-colors duration-200 flex items-center justify-end space-x-3 bg-transparent border-none cursor-pointer"
              >
                <span>Profile</span>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <button
          className="sm:hidden text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-[#fefa04] to-[#69fd00] text-[#041996] border-none px-4 py-2 rounded-md font-bold cursor-pointer w-full"
          onClick={() => {
            navigate("/tournaments");
            setIsMobileMenuOpen(false);
          }}
        >
          <FaPlay />
          Play Now
        </button>
        {user && (
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              logout();
            }}
            className="sm:hidden w-full px-4 py-2 text-sm text-white font-bold flex justify-center items-center space-x-3 bg-gradient-to-r from-[#ff0082] to-[#f20604] rounded-md border-none cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileSideBar;