import React, { useState, useEffect } from "react";
import {
  Trophy,
  BarChart2,
  LayoutDashboard,
  Menu,
  Scroll,
  Star,
  LogOut,
  TrendingUp,
  Gamepad2,
  LogIn,
  Lock,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { useLocation, useNavigate } from "react-router";
import { getFaceCropUrl } from "../../Utils/utils";

const BottomDock = () => {
  const { user, logout } = useAuthStore();
  const { activeTeamTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("");
  const [isMoreOpen, setMoreOpen] = useState(false);
  const [isDashboardOpen, setDashboardOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // --- YOUR COLORS ---
  const neonBlue = "#5865f9";
  const deepBlue = "#0a0e29";

  // ==========================================
  // DYNAMIC THEME LOGIC
  // ==========================================
  const pathName = location.pathname.toLowerCase();
  const isThemedRoute = pathName.includes("classico") || pathName.includes("massacre") || pathName.includes("nationwide");
  
  const activeName = (activeTeamTheme || "").toLowerCase();
  const isRMA = isThemedRoute && (activeName === "real madrid" || activeName === "rma");
  const isBarca = isThemedRoute && (activeName === "fc barcelona" || activeName === "barca" || activeName === "fcb");
  const isSevenBlades = isThemedRoute && activeName.includes("seven blades");
  const isSuryaSen = isThemedRoute && activeName.includes("surya sen");

  // Dynamic Theme Variables (Default)
  let activeColor = neonBlue;
  let biColorGradient = `bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500`;
  let dockBgColor = "hsla(231, 52%, 5%,0.5)";
  let sheetBgColor = "hsla(0, 0%, 0%,0.5)";
  let sheetBorderColor = "border-white/10";
  let logoutBtnClass = "bg-gradient-to-br from-pink-700 to-indigo-950/50 text-white border border-transparent";
  let avatarBgClass = "bg-gradient-to-b from-[#312c85]/80 via-[#0a0e29]/70 to-black";

  if (isRMA) {
    activeColor = "#cfb53b";
    biColorGradient = `bg-gradient-to-r from-white via-[#cfb53b] to-white`;
    dockBgColor = "rgba(207, 181, 59,0.3)";
    sheetBgColor = "#050505";
    sheetBorderColor = "border-[#cfb53b]/30";
    logoutBtnClass = "bg-gradient-to-br from-gray-900 to-black text-[#cfb53b] border border-[#cfb53b]/30";
    avatarBgClass = "bg-gradient-to-b from-[#cfb53b] to-[#050505]";
  } else if (isBarca) {
    activeColor = "#edbb00";
    biColorGradient = `bg-gradient-to-r from-[#edbb00] via-[#a50044] to-[#004d98]`;
    dockBgColor = "hsla(335, 100%, 20%,0.7)";
    sheetBgColor = "#080b1f";
    sheetBorderColor = "border-[#a50044]/40";
    logoutBtnClass = "bg-gradient-to-br from-[#a50044]/50 to-[#004d98]/50 text-[#edbb00] border border-[#a50044]/40";
    avatarBgClass = "bg-gradient-to-br from-[#a50044]/20 via-[#080b1f]/70 to-[#004d98]/90";
  } else if (isSevenBlades) {
    activeColor = "#ef4444";
    biColorGradient = `bg-gradient-to-r from-[#a1a1aa] via-[#dc2626] to-[#991b1b]`;
    dockBgColor = "rgba(220, 38, 38, 0.15)";
    sheetBgColor = "#09090b";
    sheetBorderColor = "border-[#ef4444]/40";
    logoutBtnClass = "bg-gradient-to-br from-[#991b1b]/30 to-[#27272a]/50 text-[#ef4444] border border-[#ef4444]/40";
    avatarBgClass = "bg-gradient-to-b from-[#000000] via-[#ac2622] to-[#17151b]";
  } else if (isSuryaSen) {
    activeColor = "#b08d5c";
    biColorGradient = `bg-gradient-to-r from-[#b08d5c] via-[#f4ecd8] to-[#b08d5c]`;
    dockBgColor = "rgba(176, 141, 92, 0.2)";
    sheetBgColor = "#111a22";
    sheetBorderColor = "border-[#b08d5c]/40";
    logoutBtnClass = "bg-gradient-to-br from-[#b08d5c]/30 to-[#1a2c3a]/80 text-[#b08d5c] border border-[#b08d5c]/40";
    avatarBgClass = "bg-gradient-to-b from-[#b08d5c] via-[#2d4046] to-[#111a22]";
  }

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/tournaments")) setActiveTab("tournaments");
    else if (path.includes("/leaderboard")) setActiveTab("leaderboard");
    else if (
      path.includes("dashboard") ||
      path.includes("career") ||
      path.includes("/my-tournaments")
    )
      setActiveTab("dashboard");
    else if (path.includes("/profile")) setActiveTab("profile");
    else setActiveTab("");

    setMoreOpen(false);
    setDashboardOpen(false);
    setLoginModalOpen(false);
  }, [location.pathname]);

  const getTabClass = (name) => {
    const isActive = activeTab === name;
    return `
      flex flex-col items-center justify-center w-full h-full 
      transition-all duration-300 relative rounded-full group
      ${isActive ? "text-white" : "text-gray-400 hover:text-gray-200"}
    `;
  };

  const handleRestrictedNav = (pathOrAction) => {
    if (!user) setLoginModalOpen(true);
    else {
      if (typeof pathOrAction === "function") pathOrAction();
      else navigate(pathOrAction);
    }
  };

  const handleDashboardClick = () => {
    handleRestrictedNav(() => {
      if (activeTab === "dashboard") setDashboardOpen(!isDashboardOpen);
      else {
        setDashboardOpen(true);
        setActiveTab("dashboard");
      }
      setMoreOpen(false);
    });
  };

  const handleMoreClick = () => {
      setMoreOpen(!isMoreOpen);
      setDashboardOpen(false);

  };

  const handleCentralClick = () => {
    if (user) navigate("/dashboard/profile");
    else navigate("/login");
  };

  return (
    <>
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pop-in { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-pop-in { animation: pop-in 0.2s ease-out forwards; }
      `}</style>

      {/* --- THE FLOATING ISLAND DOCK --- */}
      <nav
        className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] h-[58px] z-40 rounded-full transition-colors duration-500 backdrop-blur-sm border border-white/10"
        style={{
          backgroundColor: dockBgColor,
          boxShadow: `0 15px 35px rgba(0,0,0,0.8), 0 0 20px ${activeColor}15`,
        }}
      >
        <div className="h-full flex justify-between items-center liquid-glass-card low rounded-full">
          {/* Left Side Group */}
          <div className="flex-1 flex justify-around items-center h-full pr-5 pl-2 ">
            {/* Tournaments */}
            <button
              onClick={() => handleRestrictedNav("/tournaments")}
              className={getTabClass("tournaments")}
            >
              <Trophy
                size={18}
                className={`mb-0.5 transition-transform duration-300 ${activeTab === "tournaments" ? "-translate-y-0.5 drop-shadow-md" : ""}`}
                style={{
                  color: activeTab === "tournaments" ? activeColor : undefined,
                }}
              />
              <span
                className="text-[9px] font-medium transition-colors"
                style={{
                  color: activeTab === "tournaments" ? activeColor : undefined,
                }}
              >
                Tournaments
              </span>
            </button>

            {/* Rankings */}
            <button
              onClick={() => handleRestrictedNav("/leaderboard")}
              className={getTabClass("leaderboard")}
            >
              <BarChart2
                size={18}
                className={`mb-0.5 transition-transform duration-300 ${activeTab === "leaderboard" ? "-translate-y-0.5 drop-shadow-md" : ""}`}
                style={{
                  color: activeTab === "leaderboard" ? activeColor : undefined,
                }}
              />
              <span
                className="text-[9px] font-medium transition-colors"
                style={{
                  color: activeTab === "leaderboard" ? activeColor : undefined,
                }}
              >
                Rankings
              </span>
            </button>
          </div>

          {/* Central Spacer */}
          <div className="w-[30px] shrink-0" />

          {/* Right Side Group */}
          <div className="flex-1 flex justify-around items-center h-full pl-5 pr-2">
            {/* Dashboard */}
            <button
              onClick={handleDashboardClick}
              className={getTabClass("dashboard")}
            >
              <LayoutDashboard
                size={18}
                className={`mb-0.5 transition-transform duration-300 ${activeTab === "dashboard" || isDashboardOpen ? "-translate-y-0.5 drop-shadow-md" : ""}`}
                style={{
                  color:
                    activeTab === "dashboard" || isDashboardOpen
                      ? activeColor
                      : undefined,
                }}
              />
              <span
                className="text-[9px] font-medium transition-colors"
                style={{
                  color:
                    activeTab === "dashboard" || isDashboardOpen
                      ? activeColor
                      : undefined,
                }}
              >
                Dashboard
              </span>
            </button>

            {/* More */}
            <button onClick={handleMoreClick} className={getTabClass("more")}>
              <Menu
                size={18}
                className={`mb-0.5 transition-transform duration-300 ${isMoreOpen ? "-translate-y-0.5 drop-shadow-md" : ""}`}
                style={{ color: isMoreOpen ? activeColor : undefined }}
              />
              <span
                className="text-[9px] font-medium transition-colors"
                style={{ color: isMoreOpen ? activeColor : undefined }}
              >
                More
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- FLOATING CENTRAL BUTTON --- */}
      <div
        className="fixed md:hidden bottom-[18px] left-1/2 -translate-x-1/2 z-50 cursor-pointer group"
        onClick={handleCentralClick}
      >
        <div
          className={`absolute inset-0 rounded-full blur-md opacity-70 ${biColorGradient}`}
        />
        <div
          className={`relative z-10 w-[56px] h-[56px] rounded-full p-[2.5px] shadow-[0_4px_15px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:scale-105 ${biColorGradient}`}
        >
          <div
            className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ${avatarBgClass}`}
          >
            {user ? (
              <img
                src={
                  getFaceCropUrl(user?.image?.url) ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                }
                alt="Profile"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center animate-pulse"
                style={{ color: activeColor }}
              >
                <LogIn size={20} strokeWidth={3} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- LOGIN REQUIRED MODAL --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setLoginModalOpen(false)}
          />
          <div
            className={`relative border w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl animate-pop-in overflow-hidden transition-colors duration-500 ${sheetBorderColor}`}
            style={{ backgroundColor: sheetBgColor }}
          >
            <div
              className={`absolute top-0 left-0 w-full h-1 ${biColorGradient}`}
            />
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <div
              className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4"
              style={{ color: activeColor }}
            >
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Please log in to manage your Tournaments and Dashboard.
            </p>
            <button
              onClick={() => navigate("/login")}
              className={`w-full py-3 rounded-xl font-bold text-white text-sm uppercase tracking-wide hover:opacity-90 transition-opacity shadow-lg ${biColorGradient}`}
            >
              Log In Now
            </button>
          </div>
        </div>
      )}

      {/* --- DASHBOARD & MORE MENUS --- */}
      <ActionSheet
        isOpen={isDashboardOpen}
        onClose={() => setDashboardOpen(false)}
        title="Dashboard Menu"
        bgColor={sheetBgColor}
        borderColor={sheetBorderColor}
      >
        <SheetItem
          icon={<TrendingUp size={22} color={activeColor} />}
          label="My Career"
          subLabel="Stats, History & Achievements"
          onClick={() => navigate("/dashboard")}
        />
        <SheetItem
          icon={<Gamepad2 size={22} color={activeColor} />}
          label="My Tournaments"
          subLabel="Upcoming matches & Brackets"
          onClick={() => navigate("/dashboard/my-tournaments")}
        />
      </ActionSheet>

      <ActionSheet
        isOpen={isMoreOpen}
        onClose={() => setMoreOpen(false)}
        title="App Menu"
        bgColor={sheetBgColor}
        borderColor={sheetBorderColor}
      >
        <SheetItem
          icon={<Scroll size={20} />}
          label="Rules & Regulations"
          onClick={() => navigate("/rules")}
        />
        <SheetItem
          icon={<Star size={20} />}
          label="Hall of Fame"
          onClick={() => navigate("/hall-of-fame")}
        />
        <div className="h-px bg-white/10 my-2" />
        {user && (
          <button
            onClick={logout}
            className={`flex items-center gap-4 p-4 rounded-xl w-full transition-colors ${logoutBtnClass}`}
          >
            <LogOut size={20} /> <span className="font-semibold">Sign Out</span>
          </button>
        )}
      </ActionSheet>
    </>
  );
};

/* --- REUSABLE SUB-COMPONENTS --- */
const ActionSheet = ({
  isOpen,
  onClose,
  title,
  children,
  bgColor,
  borderColor,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`absolute bottom-0 w-full rounded-t-3xl p-6 animate-slide-up border-t ${borderColor}`}
        style={{ backgroundColor: bgColor? bgColor : "#111a22" }}
      >
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
        {title && (
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 text-center">
            {title}
          </h3>
        )}
        <div className="grid gap-2">{children}</div>
      </div>
    </div>
  );
};

const SheetItem = ({ icon, label, subLabel, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 p-4 text-gray-200 hover:bg-white/5 rounded-xl w-full text-left transition-colors border border-transparent hover:border-white/5"
  >
    <div className="p-2 bg-black/20 rounded-lg text-gray-300 brightness-200">
      {icon}
    </div>
    <div>
      <span className="block font-semibold text-sm">{label}</span>
      {subLabel && (
        <span className="block text-xs text-gray-500 mt-0.5">{subLabel}</span>
      )}
    </div>
  </button>
);

export default BottomDock;