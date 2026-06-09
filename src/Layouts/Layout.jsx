import {
  Outlet,
  useNavigate,
  useLocation,
  ScrollRestoration,
} from "react-router";
import { useAuthStore } from "../store/authStore";
import { useEffect, useRef, useState } from "react";
import newLogo from "../assets/EcNewBright.png";
import { Bounce, ToastContainer } from "react-toastify";
import MobileSideBar from "../Components/Shared/MobileSideBar";
import UserDropDown from "../Components/Shared/UserDropDown";
import { useIsMobile } from "../Hooks/useIsMobile";
import BottomDock from "../Components/Shared/BottomDock";
import {
  Trophy,
  ScrollText,
  Download,
  Share,
  PlusSquare,
  X,
  Ellipsis,
  ArrowBigDown,
  ArrowDown,
  ChevronDown,
  Users,
  RadioTower,
} from "lucide-react";
import AdminDragPanel from "../Components/Shared/AdminDragPanel";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = useIsMobile();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  // --- PINNED TOURNAMENTS STATE ---


  // 1. Detect if the app is ALREADY installed
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;



  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- PWA INSTALLATION LOGIC (ANDROID/CHROME) ---
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // --- iOS DETECTION & LOGIC ---
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);
  }, []);

  useEffect(() => {
    if (isIOS && !isStandalone) {
      setShowIOSPrompt(true);
    }
  }, [isIOS, isStandalone]);

 
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* ========================================================= */}
      {/* ANDROID / CHROME INSTALLATION OVERLAY (FORCED)            */}
      {/* ========================================================= */}
      {isInstallable && !isStandalone && !isIOS && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-xl p-8 sm:p-12 rounded-[2rem] bg-[#0a0a14]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-pink-600/20 via-indigo-900/20 to-transparent rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff0082]/40 to-[#fefb04]/30 blur-2xl rounded-full" />
              <img
                src={newLogo || "/placeholder.svg"}
                alt="eFootball Center"
                className="w-16 h-16 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              />
            </div>

            <div className="mb-4 inline-flex px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.1)] relative z-10">
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">
                Mandatory Upgrade
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mb-4 drop-shadow-lg relative z-10">
              Install{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0082] via-purple-500 to-indigo-500">
                eFootball
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-[0.15em] mb-10 relative z-10 leading-relaxed max-w-sm mx-auto">
              You must install the official application to enter the elite
              arena, guaranteeing faster load times and full-screen dominance.
            </p>

            <div className="flex flex-col w-full relative z-10 px-2 sm:px-8">
              <button
                onClick={handleInstallClick}
                className="relative w-full overflow-hidden rounded-xl p-[2px] group transition-all duration-300 shadow-[0_0_30px_rgba(255,0,130,0.3)] "
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff0082] via-purple-600 to-indigo-600 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                <div className="relative bg-[#05050a] px-8 py-4 sm:py-5 rounded-[10px] flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-opacity-0">
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff0082] group-hover:text-white transition-colors" />
                  <span className="relative z-10 text-white font-black text-sm sm:text-base uppercase tracking-[0.2em]">
                    Download App Now
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* iOS SAFARI INSTALLATION INSTRUCTIONS (WITH CLOSE BTN)     */}
      {/* ========================================================= */}
      {showIOSPrompt && !isStandalone && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md p-4 pb-12">
          <div className="relative w-full max-w-md p-8 rounded-[2rem] bg-[#0a0a14]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center text-center ">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-gradient-to-t from-[#ff0082]/40 to-transparent rounded-full blur-[50px] pointer-events-none" />

            <img
              src={newLogo || "/placeholder.svg"}
              alt="Logo"
              className="w-12 h-12 mb-6 drop-shadow-[0_0_15px_rgba(254,251,4,0.3)] relative z-10"
            />

            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2 relative z-10">
              Install on iPhone
            </h2>
            <p className="text-sm text-gray-400 font-medium mb-8 relative z-10">
              Apple requires a manual installation. Follow these steps to get
              the app on your home screen:
            </p>

            <div className="w-full flex flex-col gap-4 relative z-10 text-left">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-sm flex-1 font-bold text-gray-200">
                  Tap the{" "}
                  <strong className="text-white">
                    Share{" "}
                    <Share className="w-3 h-3 text-neon-pink shrink-0 inline" />{" "}
                  </strong>
                  button at the top of Chrome.
                </span>
                <span className="h-[50px] bg-gray-300 w-1"></span>
                <span className="text-sm flex-1 font-bold text-gray-200">
                  Or - Tap the{" "}
                  <strong className="text-white">
                    Menu / Ellispsis{" "}
                    <Ellipsis className="w-3 h-3 text-neon-pink shrink-0 inline" />{" "}
                  </strong>
                  button at the bottom of Safari. Then Tap Share{" "}
                  <Share className="w-3 h-3 text-neon-pink shrink-0 inline" />{" "}
                </span>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <PlusSquare className="w-6 h-6 text-white shrink-0" />
                <span className="text-sm font-bold text-gray-200">
                  2. Scroll down or tap View More{" "}
                  <ChevronDown className="w-5 h-5 text-neon-pink shrink-0 inline" />{" "}
                  Then select{" "}
                  <strong className="text-white">Add to Home Screen</strong>.
                </span>
              </div>
            </div>

            <div className="mt-8 animate-bounce text-gray-300 font-black text-xl">
              ↓
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      {(!location.pathname.includes("admin") || isMobile) && (
        <header>
          <nav className="lg:fixed top-0 w-full flex items-center justify-between px-4 z-50 bg-[hsl(243,50%,2%)] sm:bg-black/70 backdrop-blur-xl border-b-2 border-white/20">
            <div className="w-full py-4 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-[200px] flex items-center justify-center gap-24">
              <div
                className="flex items-center justify-between gap-2 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="sm:text-xl md:text-2xl font-black montserrat-logo tracking-widest esports-metallic-glow-text">
                  <span className="text-[20px] sm:text-2xl">
                    The eFootball Center
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6 lg:gap-8">
                <button
                  onClick={() => navigate("/tournaments")}
                  className="text-white/80 hover:text-white font-medium transition-colors bg-transparent border-none cursor-pointer"
                >
                  Tournaments
                </button>
                <button
                  onClick={() => navigate("/leaderboard")}
                  className="text-white/80 hover:text-white font-medium transition-colors bg-transparent border-none cursor-pointer"
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => navigate("/rules")}
                  className="text-white/80 hover:text-white font-medium transition-colors bg-transparent border-none cursor-pointer"
                >
                  Rules
                </button>
                <button
                  onClick={() => navigate("/rules")}
                  className="text-white/80 hover:text-white font-medium transition-colors bg-transparent border-none cursor-pointer"
                >
                  Hall of Fame
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 sm:gap-4 w-[15%]">
                <button className="hidden sm:inline text-sm bg-gradient-to-r from-[#fefa04] to-[#69fd00] text-[#041996] border-none px-4 py-2 rounded-md font-bold cursor-pointer hover:scale-105 transition-transform w-[50%]">
                  Play Now
                </button>

                <UserDropDown
                  dropdownRef={dropdownRef}
                  isDropdownOpen={isDropdownOpen}
                  setIsDropdownOpen={setIsDropdownOpen}
                />
              </div>
            </div>
          </nav>

          <BottomDock />
        </header>
      )}

      {/* Floating Admin Quick Actions (Mobile Only) - MAGNETIC DRAGGABLE */}
    {isMobile && (user?.role === "admin" || user?.isAdmin) && ( <AdminDragPanel/> )}

      {/* Page Content */}
      <main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <ScrollRestoration />

        <Outlet />
      </main>
    </div>
  );
}
