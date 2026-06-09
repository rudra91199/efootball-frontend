import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Trophy, Users, ScrollText, RadioTower, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";

const AdminDragPanel = () => {
  const [pinnedTournaments, setPinnedTournaments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dockPosition, setDockPosition] = useState("left");
  const [bounds, setBounds] = useState({ right: 1000, bottom: 800 });
  const navigate = useNavigate();

  // --- ADMIN PANEL SNAP & BOUNDS LOGIC ---
  const adminControls = useAnimation();
  const adminPanelRef = useRef(null);

  useEffect(() => {
    // Dynamic window bounds for safe dragging
    const updateBounds = () => {
      setBounds({
        right: window.innerWidth - 56, // 56px is roughly the pill's width
        bottom: window.innerHeight - 300,
      });
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);

    const loadPinnedTournaments = () => {
      const saved = localStorage.getItem("pinnedTournaments");
      if (saved) setPinnedTournaments(JSON.parse(saved));
      else setPinnedTournaments([]);
    };

    loadPinnedTournaments();
    window.addEventListener("pinned-updated", loadPinnedTournaments);

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("pinned-updated", loadPinnedTournaments);
    };
  }, []);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminPanelRef.current && !adminPanelRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const handleAdminDragEnd = (event, info) => {
    const screenWidth = window.innerWidth;
    const panelWidth = adminPanelRef.current?.offsetWidth || 56;
    const isLeftHalf = info.point.x < screenWidth / 2;

    if (isLeftHalf) {
      // Snap to Left
      adminControls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 25 },
      });
      setDockPosition("left");
    } else {
      // Snap to Right
      adminControls.start({
        x: screenWidth - panelWidth,
        transition: { type: "spring", stiffness: 300, damping: 25 },
      });
      setDockPosition("right");
    }
  };

  // Vertical arrow rotation (points down when closed, up when expanded)
  const arrowRotation = isExpanded ? 180 : 0;

  // Reusable button classes for clean UI
  const iconBtnClass = "w-10 h-10 bg-black/50 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10 active:scale-95 group shrink-0 relative";
  const iconColorClass = "text-white/80  pointer-events-none";

  return (
    <motion.div
      drag
      animate={adminControls}
      onDragEnd={handleAdminDragEnd}
      dragConstraints={{
        left: 0,
        right: bounds.right,
        top: -50,
        bottom: bounds.bottom,
      }}
      dragElastic={0.1}
      dragMomentum={false}
      className="fixed top-[5%] left-0 z-[60] cursor-grab active:cursor-grabbing touch-none"
    >
      {/* --- MAIN VERTICAL PILL --- */}
      <div 
        ref={adminPanelRef} 
        className="flex flex-col items-center gap-2 p-1.5 rounded-full liquid-glass-card low bg-gradient-to-br from-white/40 to-white/5 backdrop-blur-sm z-10"
      >
        
        {/* DYNAMIC PINNED TOURNAMENTS */}
        {pinnedTournaments.map((pin) => {
          const getInitials = (name) => {
            if (!name) return "T";
            const words = name.trim().split(/\s+/);
            if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
            return name.substring(0, 2).toUpperCase();
          };

          const initials = getInitials(pin.name);

          return (
            <button
              key={pin.id}
              onClick={() => { navigate(pin.path); setIsExpanded(false); }}
              title={pin.name}
              className="w-10 h-10 rounded-full bg-black/30 transition-all duration-200 active:scale-95 flex items-center justify-center border border-white/5 shadow-inner"
            >
              <span className="font-black text-gray-200 text-[11px] tracking-widest pointer-events-none esports-metallic-glow-text ">
                {initials}
              </span>
            </button>
          );
        })}

        {/* Separator Line */}
        {pinnedTournaments.length > 0 && (
          <div className="w-6 h-[1px] bg-white/10 mx-auto rounded-full transition-all duration-300"></div>
        )}

        {/* TOGGLE EXPAND ARROW (Anchored above the expanding menu) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={iconBtnClass}
          title="Toggle Menu"
        >
          <motion.div
            animate={{ rotate: arrowRotation }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center justify-center w-full h-full"
          >
            <ChevronDown size={20} className={iconColorClass} />
          </motion.div>
        </button>

        {/* --- VERTICAL EXPANDED MENU --- */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              // Swapped heavy spring/blur for a snappy, hardware-accelerated tween
              transition={{ duration: 0.25, ease: "easeInOut" }} 
              className="flex flex-col items-center overflow-hidden w-full"
            >
              <div className="flex flex-col items-center gap-2 pt-1 pb-0.5">
                {/* 1. Tournaments */}
                <button
                  onClick={() => { navigate("/admin/tournaments"); setIsExpanded(false); }}
                  className={iconBtnClass}
                  title="Tournaments"
                >
                  <Trophy size={18} className={iconColorClass} />
                </button>

                {/* 2. Players Management */}
                <button
                  onClick={() => { navigate("/admin/players"); setIsExpanded(false); }}
                  className={iconBtnClass}
                  title="Players"
                >
                  <Users size={18} className={iconColorClass} />
                </button>

                {/* 3. Rules */}
                <button
                  onClick={() => { navigate("/admin/rules"); setIsExpanded(false); }}
                  className={iconBtnClass}
                  title="Rules"
                >
                  <ScrollText size={18} className={iconColorClass} />
                </button>

                {/* 4. Broadcast Ticker */}
                <button
                  onClick={() => { navigate("/admin/broadcasts"); setIsExpanded(false); }}
                  className={iconBtnClass}
                  title="Broadcasts"
                >
                  <span className="absolute top-[8px] right-[8px] w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse pointer-events-none" />
                  <RadioTower size={18} className={iconColorClass} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default AdminDragPanel;